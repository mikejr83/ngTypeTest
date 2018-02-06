import { ipcMain } from "electron";
import * as ASCIIFolder from "fold-to-ascii";
import * as jquery from "jquery";
import * as jsdom from "jsdom";
import * as _ from "lodash";
import * as rp from "request-promise-native";

import { findWordCount, splitTextIntoWords } from "../../util/wordCount";
import App from "../app";
import { IUserConfiguration } from "../configuration/user";
import { EVENTS } from "../constants";
import logger from "../logging";
import { ITestText, TestTextLocation } from "../test/testText";

export function registerIpcListeners() {
  logger.silly("GOT HERE!");

  ipcMain.on(EVENTS.RENDERER.TEST.LOAD_WIKIPEDIA, loadWikipediaHandler);
}

export function onWikipediaTextLoaded(testText: ITestText) {
  logger.debug("Firing IPC event " + EVENTS.MAIN.TEST.ON_WIKIPEDIA_LOADED);

  App.AppWindow.webContents.send(EVENTS.MAIN.TEST.ON_WIKIPEDIA_LOADED, testText);
}

async function loadWikipediaHandler(event, config: IUserConfiguration) {
  // Get the page content from the wikipedia url.
  const pageContentResponse = await rp.get({
    resolveWithFullResponse: true,
    uri: config.wikipediaUrl
  });

  // Use jsdom to mock up a dom for the returned page.
  const dom = new jsdom.JSDOM(pageContentResponse.body);

  let $: JQueryStatic;

  try {
    // Create a jQuery context to query the DOM.
    $ = require("jquery")(dom.window) as JQueryStatic;
  } catch (e) {
    logger.error("jQuery issue.", e);
  }

  // Find all the paragraphs that are in the main content area.
  const paragraphs = $("#mw-content-text p");
  // Setup a counter for how much text we've imported.
  let currentTextSize = 0;
  // Create an array of the paragraphs that we're going to hand back to display in the test.
  const paragraphsToUse: string[] = [];

  logger.debug("For eaching!");

  // Loop through each one of the paragraph nodes that was in the main wikipedia content.
  _.forEach(paragraphs, (pElement) => {
    const paragraph = $(pElement);
    let text = paragraph.text();

    // No text let's skip this paragraph.
    if (text === "") { return; }

    // Now we need to remove the citation tags
    text = text.replace(/\[\d+\]/g, "");

    // If this test is going to remove ascii characters do that.
    if (config.removeNonAsciiCharacters) {
      text = ASCIIFolder.fold(text);
    }

    // Get the word count for this paragraph.
    const wordCount = findWordCount(text);

    logger.silly("Current paragraph word count:", wordCount);

    // Check to see how big the size of the paragraph is compared to how much more text we need.
    if (currentTextSize + wordCount <= config.wordCount) {
      // Paragraph was smaller than the size of text we need.
      // Update the current word count.
      currentTextSize += wordCount;
      // Put the paragraph into our list to use.
      paragraphsToUse.push(text);
    } else {
      // Paragraph was too big for the content size we wanted. Find out how many more words we should use.
      const remainingWords = config.wordCount - currentTextSize;

      // Cut the paragraph down to the correct size.
      paragraphsToUse.push(splitTextIntoWords(text).slice(0, remainingWords).join(" "));

      // No need to process any more paragraphs since we're at the max size required.
      return false;
    }
  });

  logger.silly("Text to use:", paragraphsToUse);

  const testTextResult: ITestText = {
    locationDescription: pageContentResponse.request.href,
    paragraphs: paragraphsToUse,
    textLocationType: TestTextLocation.Wikipedia
  };

  // Fire off that we've got text to use.
  onWikipediaTextLoaded(testTextResult);
}
