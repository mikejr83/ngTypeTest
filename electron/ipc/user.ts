import { ipcMain } from "electron";

import App from "../app";
import { EVENTS } from "../constants";
import logger from "../logging";
import { loadUser, saveUser, updateUser } from "../repository/user";
import { IUser } from "../user/user";

export function registerIpcListeners() {
  logger.silly("GOT HERE!");

  ipcMain.on(EVENTS.MAIN.USER.LOAD, loadHandler);
  ipcMain.on(EVENTS.MAIN.USER.UPDATE, updateHandler);
  ipcMain.on(EVENTS.MAIN.USER.SAVE, saveHandler);
}

async function loadHandler(event, username: string) {
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
}

async function saveHandler(event, user: IUser) {
  logger.debug("Handling " + EVENTS.MAIN.USER.SAVE + " IPC event!", user);

  const result = await saveUser(user);
  logger.debug("Save user result: ", result);
}

async function updateHandler(event, currentUserInfo: IUser, newUserInfo: IUser) {
  logger.debug("Handling " + EVENTS.MAIN.USER.UPDATE + " IPC event!", currentUserInfo, newUserInfo);

  if (currentUserInfo.username !== newUserInfo.username) {
    logger.debug("This could be interesting. Changing the username/email of the user from " + currentUserInfo.username + " to " + newUserInfo.username);
  }
  let result;
  try {
    result = await updateUser(currentUserInfo.username, newUserInfo);
    logger.debug("Result of updating:", result);
  } catch (e) {
    logger.error("Unable to update the user!", e);
  }

  let user;

  try {
    logger.debug("Loading the updated user's info.", newUserInfo.username);
    user = await loadUser(newUserInfo.username);
  } catch (e) {
    logger.error("Unable to get updated user info from the database!", e);
  }

  if (user) {
    logger.debug("Got updated user info.", user);
    onUserUpdated(user);
  }
}

export function onUserLoaded(user: IUser) {
  logger.debug("Firing IPC event: " + EVENTS.MAIN.USER.ONLOAD, user);

  App.AppWindow.webContents.send(EVENTS.MAIN.USER.ONLOAD, user);
}

export function onUserUpdated(user: IUser) {
  logger.debug("Firing IPC event: " + EVENTS.MAIN.USER.ONUPDATED, user);

  App.AppWindow.webContents.send(EVENTS.MAIN.USER.ONUPDATED, user);
}
