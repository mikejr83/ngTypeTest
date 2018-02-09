import { app, BrowserWindow, screen } from "electron";
import * as electronReload from "electron-reload";
import * as path from "path";

import App from "./electron/app";
import config from "./electron/configuration";
import { updateFromArguments } from "./electron/configuration/cli";
import logger from "./electron/logging";

// Update the configuration from the arguments passed to the executaable.
updateFromArguments();

// If the configuration is set to serve allow hot reloading of electron - NOTE NOT WORKING RIGHT NOW.
if (config.serve) {
  logger.debug("Starting electron-reload.");
  electronReload(__dirname, {});
}

// Try loading the application. Do this in a try/catch because we want to trap any exceptions so we can
// debug a little better.
try {
  logger.silly("Starting App.main...");
  App.main();
} catch (e) {
  // Catch Error
  logger.error("An error was generated during the setup of application event handling.", e);
}
