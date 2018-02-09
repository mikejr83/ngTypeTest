import { Event, ipcMain } from "electron";

import App from "../app";
import { EVENTS } from "../constants";
import logger from "../logging";
import { loadUser, saveUser, updateUser } from "../repository/user";
import { IUser } from "../user/user";

/**
 * Registers the IPC listeners .
 *
 * @export
 */
export function registerIpcListeners() {
  ipcMain.on(EVENTS.MAIN.USER.LOAD, loadHandler);
  ipcMain.on(EVENTS.MAIN.USER.UPDATE, updateHandler);
  ipcMain.on(EVENTS.MAIN.USER.SAVE, saveHandler);
}

/**
 * Handler for loading a user.
 *
 * @param event Electron IPC event object.
 * @param username The username of the user to load.
 */
async function loadHandler(event: Event, username: string) {
  logger.debug(
    "Handling " + EVENTS.MAIN.USER.LOAD + " IPC event! Username: " + username
  );
  let user: IUser;

  try {
    // Attempt to load the user from the user repository.
    user = await loadUser(username);
  } catch (e) {
    // Whoops
    logger.error("An error occurred while trying to load the user.", e);
  }

  // Fire the user loaded event.
  onUserLoaded(user);
}

/**
 * Handler for saving the user.
 *
 * @param event Electron IPC event object.
 * @param user The user's object.
 */
async function saveHandler(event: Event, user: IUser) {
  logger.debug("Handling " + EVENTS.MAIN.USER.SAVE + " IPC event!", user);

  // Attempt to save the user via the user repository.
  const result = await saveUser(user);
  logger.debug("Save user result: ", result);

  let loadedUser: IUser;

  // Get the user from the repository using a load. Insure that it is updated correctly.
  try {
    loadedUser = await loadUser(user.username);
  } catch (e) {
    logger.error("An error occurred while trying to load the user.", e);
  }

  // Fire the user loaded event.
  onUserLoaded(loadedUser);
}

/**
 * Handle the user updated event.
 *
 * @param event Electron IPC event object.
 * @param currentUserInfo The user info as it currently stands, pre-update.
 * @param newUserInfo The user's info as it should be updated in the data store.
 */
async function updateHandler(event: Event, currentUserInfo: IUser, newUserInfo: IUser) {
  logger.debug("Handling " + EVENTS.MAIN.USER.UPDATE + " IPC event!", currentUserInfo, newUserInfo);

  // At first it was going to allow for chaning the user name - nixed that in the UI but it is still technically possible.
  if (currentUserInfo.username !== newUserInfo.username) {
    logger.debug("This could be interesting. Changing the username/email of the user from " + currentUserInfo.username + " to " + newUserInfo.username);
  }

  // Use the update functionality in the user repository.
  let result;
  try {
    result = await updateUser(currentUserInfo.username, newUserInfo);
    logger.debug("Result of updating:", result);
  } catch (e) {
    logger.error("Unable to update the user!", e);
  }

  let user;

  // Load the user using the possibly new username so that a fresh from the data store copy can be handed back.
  try {
    logger.debug("Loading the updated user's info.", newUserInfo.username);
    user = await loadUser(newUserInfo.username);
  } catch (e) {
    logger.error("Unable to get updated user info from the database!", e);
  }

  // Check. This should never fail...
  if (user) {
    logger.debug("Got updated user info.", user);
    // Fire the user loaded event.
    onUserUpdated(user);
  }
}

/**
 * Fires the event which alerts that a user was loaded.
 * @param user User which was loaded.
 */
export function onUserLoaded(user: IUser) {
  logger.debug("Firing IPC event: " + EVENTS.MAIN.USER.ONLOAD, user);

  App.AppWindow.webContents.send(EVENTS.MAIN.USER.ONLOAD, user);
}

/**
 * Fires the event which alerts that a user was updated.
 * @param user User which was updated - updated user object.
 */
export function onUserUpdated(user: IUser) {
  logger.debug("Firing IPC event: " + EVENTS.MAIN.USER.ONUPDATED, user);

  App.AppWindow.webContents.send(EVENTS.MAIN.USER.ONUPDATED, user);
}
