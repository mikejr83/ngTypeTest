import { Event, ipcMain } from "electron";
import * as _ from "lodash";

import App from "../app";
import config from "../configuration";
import { saveConfiguration } from "../configuration/electron";
import { IElectronConfiguration } from "../configuration/electron";
import { EVENTS } from "../constants";
import logger from "../logging";

/**
 * Registers the IPC listeners .
 *
 * @export
 */
export function registerIpcListeners() {
  // Register each of the configuration listeners.
  ipcMain.on(EVENTS.RENDERER.CONFIGURATION.LOAD, handleConfigurationLoad);
  ipcMain.on(EVENTS.RENDERER.CONFIGURATION.SAVE, handleConfigurationSave);
}

/**
 * Fires an event for notification of configuration changes.
 *
 * @export
 * @param {IElectronConfiguration} configuration
 */
export function onConfigurationUpdated(configuration: IElectronConfiguration) {
  logger.debug("Firing IPC event:" + EVENTS.MAIN.CONFIGURATION_UPDATED, configuration);

  App.AppWindow.webContents.send(EVENTS.MAIN.CONFIGURATION_UPDATED, configuration);
}

/**
 * This was a syncronous function to return the configuration for Electron on disk.
 *
 * Note this is still used in the Electron providers in the Angular app but the model
 * adapted in order to support web loading makes a sync call unnecessary.
 *
 * @deprecated
 *
 * @param {Event} event
 */
function handleConfigurationLoad(event: Event) {
  event.returnValue = config;
}

/**
 * Handler for saving configuration.
 *
 * @param event
 * @param configuration
 */
function handleConfigurationSave(event: Event, configuration: IElectronConfiguration) {
  saveConfiguration(config, configuration);

  if (configuration.showDebugTools) {
    App.AppWindow.webContents.openDevTools();
  }

  onConfigurationUpdated(config);
}
