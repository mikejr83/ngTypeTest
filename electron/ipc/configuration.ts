import { Event, ipcMain } from "electron";
import * as _ from "lodash";

import App from "../app";
import config from "../configuration";
import { saveConfiguration } from "../configuration";
import { IElectronConfiguration } from "../configuration/electron";
import { EVENTS } from "../constants";
import logger from "../logging";

export function registerIpcListeners() {
  ipcMain.on(EVENTS.RENDERER.CONFIGURATION.LOAD, handleConfigurationLoad);
  ipcMain.on(EVENTS.RENDERER.CONFIGURATION.SAVE, handleConfigurationSave);
}

export function onConfigurationUpdated(configuration: IElectronConfiguration) {
  logger.debug("Firing IPC event:" + EVENTS.MAIN.CONFIGURATION_UPDATED, configuration);

  App.AppWindow.webContents.send(EVENTS.MAIN.CONFIGURATION_UPDATED, configuration);
}

function handleConfigurationLoad(event: Event) {
  event.returnValue = config;
}

function handleConfigurationSave(event: Event, configuration: IElectronConfiguration) {

  saveConfiguration(configuration);

  if (configuration.showDebugTools) {
    App.AppWindow.webContents.openDevTools();
  }

  onConfigurationUpdated(config);
}
