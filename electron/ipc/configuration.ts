import { ipcMain } from "electron";

import App from "../app";
import { IConfiguration } from "../configuration/configuration";
import { EVENTS } from "../constants";
import logger from "../logging";

export function onConfigurationUpdated(config: IConfiguration) {
  logger.debug("Firing IPC event:" + EVENTS.MAIN.CONFIGURATION_UPDATED, config);

  App.AppWindow.webContents.send(EVENTS.MAIN.CONFIGURATION_UPDATED, config);
}
