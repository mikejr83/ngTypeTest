import { ipcMain } from "electron";

import App from "../app";
import { Configuration } from "../configuration/configuration";
import { EVENTS } from "../constants";
import logger from "../logging";

export function onConfigurationUpdated(config: Configuration) {
  logger.debug("Firing IPC event:" + EVENTS.MAIN.CONFIGURATION_UPDATED, config);

  App.AppWindow.webContents.send(EVENTS.MAIN.CONFIGURATION_UPDATED, config);
}
