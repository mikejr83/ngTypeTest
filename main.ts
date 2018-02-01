import { app, BrowserWindow, screen } from "electron";
import * as electronReload from "electron-reload";
import * as path from "path";
import * as yargs from "yargs";

import App from "./electron/app";
import logger from "./electron/logging";

if (yargs.argv.serve) {
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
