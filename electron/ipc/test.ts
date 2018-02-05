import { ipcMain } from "electron";
import * as ASCIIFolder from "fold-to-ascii";
import * as jquery from "jquery";
import * as jsdom from "jsdom";
import * as _ from "lodash";
import * as rp from "request-promise-native";

import { findWordCount } from "../../util/wordCount";
import App from "../app";
import config from "../configuration";
import { EVENTS } from "../constants";
import logger from "../logging";

export function registerIpcListeners() {
  logger.silly("GOT HERE!");

  ipcMain.on(EVENTS.RENDERER.TEST.LOAD_WIKIPEDIA, loadWikipediaHandler);
}

export function onWikipediaTextLoaded(paragraphs: string[]) {
  logger.debug("Firing IPC event " + EVENTS.MAIN.TEST.ON_WIKIPEDIA_LOADED);

  App.AppWindow.webContents.send(EVENTS.MAIN.TEST.ON_WIKIPEDIA_LOADED, paragraphs);
}

async function loadWikipediaHandler() {
  const pageContent = await rp.get(config.wikipediaUrl);

  const dom = new jsdom.JSDOM(pageContent);

  let $: JQueryStatic;

  try {
    $ = require("jquery")(dom.window) as JQueryStatic;
  } catch (e) {
    logger.error("jQuery issue.", e);
  }

  const paragraphs = $("#mw-content-text p");
  let currentTextSize = 0;
  const paragraphsToUse: string[] = [];

  logger.debug("For eaching!");
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

    const wordCount = findWordCount(text);

    logger.silly("Current paragraph word count:", wordCount);

    if (currentTextSize + wordCount <= config.wordCount) {
      currentTextSize += wordCount;
      paragraphsToUse.push(text);
    } else {
      return false;
    }
  });

  logger.silly("Text to use:", paragraphsToUse);

  onWikipediaTextLoaded(paragraphsToUse);
}
