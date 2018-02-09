import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ipcRenderer } from "electron";

import { ConfigurationService } from "app/providers/configuration/configuration.service";
import { LoggerService } from "app/providers/logging/logger.service";

import { defaultConfiguration } from "app/../../electron/configuration/user";
import { EVENTS } from "app/../../electron/constants";
import { IUser } from "app/../../electron/user/user";
import { UserService } from "app/providers/user/user.service";

/**
 * IPC/Electron implementation of the user service.
 *
 * @export
 * @class UserIpcService
 * @extends {UserService}
 */
@Injectable()
export class UserIpcService extends UserService {

  /**
   * Creates an instance of UserIpcService.
   * @param {ConfigurationService} configurationService
   * @param {LoggerService} loggerService
   * @param {TranslateService} translateService
   * @memberof UserIpcService
   */
  constructor(configurationService: ConfigurationService, loggerService: LoggerService, translateService: TranslateService) {
    super(configurationService, loggerService, translateService);
  }

  /**
   * Updates a user and their accompanying information in the database.
   * @param updatedUser The user object which contains the updates to apply to the user record in the db.
   */
  public async editUser(updatedUser: IUser): Promise<IUser> {
    this.loggerService.debug("Updating the current user to this info:", updatedUser);

    // The call to update a user and get its result is async. Hand back a promise to update the user.
    return new Promise<IUser>((resolve, reject) => {
      this.loggerService.debug("Sending IPC " + EVENTS.MAIN.USER.UPDATE);

      // Send the user as we currently know them and the user as it has been updated.
      ipcRenderer.send(EVENTS.MAIN.USER.UPDATE, this.user, updatedUser);

      // Wait for the main process to update the user and respond.
      ipcRenderer.once(EVENTS.MAIN.USER.ONUPDATED, (event, updatedAndSavedUser: IUser) => {
        this.loggerService.debug("The user was edited and saved.");

        // The user was updated. Resolve the promise with the new user object.
        resolve(updatedAndSavedUser);
      });
    });
  }

  /**
   * Loads a user from the database.
   * @param email The email/username of the user to load.
   */
  public async loadUser(email: string): Promise<IUser | undefined> {
    this.loggerService.debug("Loading a user by email/username: ", email);

    // The call out to the main process and its response are async. Hand back a promise to resolve a user object.
    return new Promise<IUser>((resolve, reject) => {
      this.loggerService.debug("Sending IPC " + EVENTS.MAIN.USER.LOAD, email);

      // Send a notice to the main process to load the user.
      ipcRenderer.send(EVENTS.MAIN.USER.LOAD, email);

      // Wait for the response from the main process that the user was loaded.
      ipcRenderer.once(EVENTS.MAIN.USER.ONLOAD, (event, user: IUser) => {
        this.loggerService.debug("User was loaded!", user);

        // Resolve the promise with the loaded user object.
        resolve(user);
      });
    }).catch((e) => {
      this.loggerService.error("An error occurred for trying to load a user...", e);

      // If there was an error loading the user hand back undefined.
      return undefined;
    })
  }

  /**
   * Registers and creats a user in the system by using IPC events with the
   * user's information.
   *
   * @param {string} email The user's email or username.
   * @param {string} name The user's dispaly name or greeting.
   * @returns {Promise<IUser>}
   * @memberof UserWebService
   */
  public registerUser(email: string, name: string): Promise<IUser> {
    // Create a user object
    this.user = {
      configuration: Object.assign({}, defaultConfiguration),
      name,
      username: email
    };

    this.loggerService.debug("Sending the user to be registered in the db.", this.user);

    return new Promise<IUser>((resolve, reject) => {
      // Fire and forget a save.
      ipcRenderer.send(EVENTS.MAIN.USER.SAVE, this.user);

      ipcRenderer.once(EVENTS.MAIN.USER.ONLOAD, (event, user: IUser) => {
        this.setCurrentUser(user);
      })
    });
  }
}
