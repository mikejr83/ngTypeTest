import { app, BrowserWindow, screen } from "electron";
import * as electronReload from "electron-reload";
import * as path from "path";

import logger from "./electron/logging";

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === "--serve");
import * as url from "url";

if (serve) {
  electronReload(__dirname, {});
}

function createWindow() {
  logger.debug("Beginning window creation.");

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  logger.debug("Creating a new BrowserWindow with the {0} height and {1} width", size.height, size.width);
  // Create the browser window.
  win = new BrowserWindow({
    height: size.height,
    width: size.width,
    x: 0,
    y: 0
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, "/index.html"),
    protocol: "file:",
    slashes: true
  }));

  // Open the DevTools.
  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", createWindow);

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    logger.info("window-all-closed firing! This means the app should be shutting down.");

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  logger.error("An error was generated during the setup of application event handling.", e);
}
