import {
  app,
  BrowserWindow,
  Menu,
  screen
} from "electron";
import path = require("path");
import url = require("url");
import * as yargs from "yargs";

import config from "./configuration";
import logger from "./logging";

// import { buildMenu } from "./menu/builder";

// import * as log from "electron-log";

export default class App {
  public static AppWindow: Electron.BrowserWindow;
  public static application: Electron.App;
  public static BrowserWindow;
  /**
   *
   *
   * @static
   * @param {Electron.App} electronApp
   * @param {typeof BrowserWindow} browserWindow
   * @memberof App
   */
  public static main() {
    /**
     * We pass the Electron.App object and the Electron.BrowserWindow into this function
     * so this class1 has no dependencies.  This makes the code easier to write tests for
     */

    App.BrowserWindow = BrowserWindow;
    App.application = app;
    App.application.on("window-all-closed", App.onWindowAllClosed);
    App.application.on("ready", App.onReady);
  }

  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      App.application.quit();
    }
  }

  private static onClose() {
    App.AppWindow = null;
  }

  private static onReady() {
    logger.debug("onReady");

    // Create the App window
    App.createWindow();

    App.loadPage("../index.html");

    // Open the DevTools.
    if (config.showDebugTools) {
      App.AppWindow.webContents.openDevTools();
    }

    // buildMenu();

    App.AppWindow.on("closed", App.onClose);
  }

  private static createWindow() {
    logger.debug("Beginning window creation.");

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    logger.debug("Creating a new BrowserWindow with the {0} height and {1} width", size.height, size.width);
    // Create the browser window.
    App.AppWindow = new BrowserWindow({
      height: size.height,
      width: size.width,
      x: 0,
      y: 0
    });
  }

  private static loadPage(pathname: string) {
    pathname = path.join(__dirname, pathname);

    logger.debug("Looking for start page:", path.resolve(pathname));

    // and load the index.html of the app.
    App.AppWindow.loadURL(url.format({
      pathname,
      protocol: "file:",
      slashes: true
    }));
  }
}
