import { ipcMain } from "electron";

import App from "../app";
import { EVENTS } from "../constants";
import logger from "../logging";
import { loadUser, saveUser } from "../repository/user";
import { IUser } from "../user/user";

export function registerIpcListeners() {
  logger.silly("GOT HERE!");

  ipcMain.on(EVENTS.MAIN.USER.LOAD, async (event, username: string) => {
    logger.debug(
      "Handling " + EVENTS.MAIN.USER.LOAD + " IPC event! Username: " + username
    );
    let user: IUser;

    try {
    user = await loadUser(username);
    } catch (e) {
      logger.error("An error occurred while trying to load the user.", e);
    }

    onUserLoaded(user);
  });

  ipcMain.on(EVENTS.MAIN.USER.SAVE, async (event, user: IUser) => {
    logger.debug("Handling " + EVENTS.MAIN.USER.SAVE + " IPC event!", user);

    const result = await saveUser(user);
    logger.debug("Save user result: ", result);
  });
}

export function onUserLoaded(user: IUser) {
  logger.debug("Firing IPC event: " + EVENTS.MAIN.USER.ONLOAD, user);

  App.AppWindow.webContents.send(EVENTS.MAIN.USER.ONLOAD, user);
}
