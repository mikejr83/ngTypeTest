import { app, BrowserWindow, ipcMain, Menu, screen } from "electron";
import * as path from "path";
import * as url from "url";
import * as yargs from "yargs";

import config from "./configuration";
import { EVENTS } from "./constants";
import { registerIpcListeners } from "./ipc";
import logger from "./logging";

/**
 * Application container class. Encapsulates the main Electron process and how it's spun up.
 *
 * @export
 * @class App
 */
export default class App {
  /**
   * Reference to the Electron browser window.
   *
   * @static
   * @type {Electron.BrowserWindow}
   * @memberof App
   */
  public static AppWindow: Electron.BrowserWindow;
  /**
   * Reference to the Electron application
   *
   * @static
   * @type {Electron.App}
   * @memberof App
   */
  public static application: Electron.App;
  /**
   *
   *
   * @static
   * @memberof App
   */
  public static BrowserWindow;

  /**
   * The main execute path for setting up the application
   *
   * @static
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

  /**
   * Handles when the window is closed.
   *
   * @private
   * @static
   * @memberof App
   */
  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      App.application.quit();
    }
  }


  private static onClose() {
    App.AppWindow = null;
  }

  /**
   * Sets up the Electron application window.
   *
   * When the application becomes ready there are a number of tasks to be done.
   * The application window is setup and has events attached to it.
   *
   * @private
   * @static
   * @memberof App
   */
  private static onReady() {
    logger.debug("onReady");

    // Create the App window
    App.createWindow();

    // Setup some basic events.
    App.AppWindow.on("closed", App.onClose);
    App.AppWindow.webContents.on("did-finish-load", App.windowDidFinishLoad);

    // Load the root Angular application page.
    App.loadPage("../index.html");

    // Open the DevTools.
    if (config.showDebugTools) {
      App.AppWindow.webContents.openDevTools();
    }
  }

  /**
   * Creates the browser window which is where the application will run.
   *
   * @private
   * @static
   * @memberof App
   */
  private static createWindow() {
    logger.debug("Beginning window creation.");

    // Build out the dimensions for launching the screen.
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    logger.debug(
      "Creating a new BrowserWindow with the {0} height and {1} width",
      size.height,
      size.width
    );

    // Create the browser window.
    App.AppWindow = new BrowserWindow({
      height: size.height,
      width: size.width,
      x: 0,
      y: 0
    });

    registerIpcListeners();
  }

  /**
   * Load a specific page into the application window.
   *
   * @private
   * @static
   * @param {string} pathname
   * @memberof App
   */
  private static loadPage(pathname: string) {
    // Get the full path
    pathname = path.join(__dirname, pathname);

    logger.debug("Looking for start page:", path.resolve(pathname));

    // and load the index.html of the app.
    App.AppWindow.loadURL(
      url.format({
        pathname,
        protocol: "file:",
        slashes: true
      })
    );
  }

  /**
   * Executes when the "page" finishes loading.
   *
   * @private
   * @static
   * @memberof App
   */
  private static windowDidFinishLoad() {
    logger.silly("The app window finished loading!");
  }
}
