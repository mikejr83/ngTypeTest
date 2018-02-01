import { app, BrowserWindow, screen } from "electron";
import * as electronReload from "electron-reload";
import * as path from "path";

import App from "./electron/app";
import config from "./electron/configuration";
import logger from "./electron/logging";

if (config.serve) {
  logger.debug("Starting electron-reload.");
  electronReload(__dirname, {});
}

try {
  logger.silly("Starting App.main...");
  App.main();
} catch (e) {
  // Catch Error
  logger.error("An error was generated during the setup of application event handling.", e);
}
