import { Event, ipcMain } from "electron";

import { loadFromWikipedia } from "../../util/wikipedia";
import App from "../app";
import { IUserConfiguration } from "../configuration/user";
import { EVENTS } from "../constants";
import logger from "../logging";
import { loadTestResults, saveTestResult } from "../repository/testResult";
import { ITestResult } from "../test/result";
import { ITestText } from "../test/testText";

export function registerIpcListeners() {
  logger.silly("GOT HERE!");

  ipcMain.on(EVENTS.RENDERER.TEST.LOAD_RESULTS_FOR_USER, loadTestResultsForUserHandler);
  ipcMain.on(EVENTS.RENDERER.TEST.LOAD_WIKIPEDIA, loadWikipediaHandler);
  ipcMain.on(EVENTS.RENDERER.TEST.LOG, logTestHandler);
}

export function onTestResultsLoaded(results: ITestResult[]) {
  logger.debug("Firing IPC event " + EVENTS.MAIN.TEST.ON_TEST_RESULTS_LOADED);

  App.AppWindow.webContents.send(EVENTS.MAIN.TEST.ON_TEST_RESULTS_LOADED, results);
}

export function onWikipediaTextLoaded(testText: ITestText) {
  logger.debug("Firing IPC event " + EVENTS.MAIN.TEST.ON_WIKIPEDIA_LOADED);

  App.AppWindow.webContents.send(EVENTS.MAIN.TEST.ON_WIKIPEDIA_LOADED, testText);
}

async function loadTestResultsForUserHandler(event: Event, username: string) {
  const results = await loadTestResults(username);

  onTestResultsLoaded(results);
}

async function loadWikipediaHandler(event, config: IUserConfiguration) {
  const testTextResult =  await loadFromWikipedia(config);

  // Fire off that we've got text to use.
  onWikipediaTextLoaded(testTextResult);
}

async function logTestHandler(event, result: ITestResult) {
  logger.debug("Handling IPC " + EVENTS.RENDERER.TEST.LOG);

  try {
    saveTestResult(result);
  } catch (e) {
    logger.error("Error trying to save the test result!", e);
  }
}
