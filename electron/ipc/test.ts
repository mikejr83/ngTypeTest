import { Event, ipcMain } from "electron";

import { loadFromWikipedia } from "../../util/wikipedia";
import App from "../app";
import { IUserConfiguration } from "../configuration/user";
import { EVENTS } from "../constants";
import logger from "../logging";
import { loadTestResults, saveTestResult } from "../repository/testResult";
import { ITestResult } from "../test/result";
import { ITestText } from "../test/testText";

/**
 * Registers the IPC listeners .
 *
 * @export
 */
export function registerIpcListeners() {
  ipcMain.on(EVENTS.RENDERER.TEST.LOAD_RESULTS_FOR_USER, loadTestResultsForUserHandler);
  ipcMain.on(EVENTS.RENDERER.TEST.LOAD_WIKIPEDIA, loadWikipediaHandler);
  ipcMain.on(EVENTS.RENDERER.TEST.LOG, logTestHandler);
}

/**
 * Fires the test results loaded event.
 *
 * @export
 * @param {ITestResult[]} results The list of results to send.
 */
export function onTestResultsLoaded(results: ITestResult[]) {
  logger.debug("Firing IPC event " + EVENTS.MAIN.TEST.ON_TEST_RESULTS_LOADED);

  App.AppWindow.webContents.send(EVENTS.MAIN.TEST.ON_TEST_RESULTS_LOADED, results);
}

/**
 * Fires the test text (wikipedia) has been loaded.
 * @param testText Test text information object to send.
 */
export function onWikipediaTextLoaded(testText: ITestText) {
  logger.debug("Firing IPC event " + EVENTS.MAIN.TEST.ON_WIKIPEDIA_LOADED);

  App.AppWindow.webContents.send(EVENTS.MAIN.TEST.ON_WIKIPEDIA_LOADED, testText);
}

/**
 * Handler for loading test results.
 * @param event Electron IPC event object.
 * @param username Username which should be used to filter the results.
 */
async function loadTestResultsForUserHandler(event: Event, username: string) {
  // Get the test results from the repository.
  const results = await loadTestResults(username);

  // First the loaded event.
  onTestResultsLoaded(results);
}

/**
 * Handler for loading the test text information for a user's test.
 *
 * @param event Electron IPC event object.
 * @param config The user's configuration.
 */
async function loadWikipediaHandler(event: Event, config: IUserConfiguration) {
  // Use the wikipedia utility to get the test text information based on the user's settings.
  const testTextResult =  await loadFromWikipedia(config);

  // Fire off that we've got text to use.
  onWikipediaTextLoaded(testTextResult);
}

/**
 * Handles the saving (logging) of a test result.
 * @param event Electron IPC event object.
 * @param result The test result object.
 */
async function logTestHandler(event: Event, result: ITestResult) {
  logger.debug("Handling IPC " + EVENTS.RENDERER.TEST.LOG);

  try {
    // Attempt to save the test results
    saveTestResult(result);
  } catch (e) {
    // Whoops
    logger.error("Error trying to save the test result!", e);
  }
}
