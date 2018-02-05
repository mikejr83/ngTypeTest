import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ipcRenderer } from "electron";

import { ElectronService } from "app/providers/electron.service";
import { LoggerService } from "app/providers/logging/logger.service";

import { defaultConfiguration } from "../../../electron/configuration/user";
import { EVENTS } from "../../../electron/constants";
import { IUser } from "../../../electron/user/user";


@Injectable()
export class UserService {
  public user: IUser;

  constructor(private electronService: ElectronService, private loggerService: LoggerService, private translateService: TranslateService) {
    // Check to see if there is a lastUsername defined. If it is then we'll load up the last user of the app.
    if (electronService.configuration.lastUsername !== undefined) {
      loggerService.debug("Looks like there was a previous user...");

      this.loginUser(electronService.configuration.lastUsername);
    }
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
   * Looks up a user by the username and sets the service's information if the user exists.
   * @param username The user's username.
   */
  public loginUser(username: string): Promise<void> {
    // Load the user.
    return this.loadUser(username).then((user: IUser) => {
      this.setCurrentUser(user);
    });
  }

  public logoutCurrentUser() {
    this.loggerService.debug("Logging out user! Setting user service user to undefined and clearing the config's lastUsername.");
    this.user = undefined;
    this.electronService.configuration.lastUsername = undefined;
  }

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

  private setCurrentUser(user: IUser) {
    this.loggerService.debug("Setting the current user:", user);
    // Set the current user
    this.user = user;

    // Check to see if the user is actually a real user
    if (this.user === null) {
      // Null was returned by the call. Logout any user that was "previous" as they don't exist in the db.
      this.logoutCurrentUser();
    } else {
      // We got a valid user back so let's make sure they also have a valid configuration.
      if (this.user.configuration === undefined || this.user.configuration === null) {
        this.user.configuration = Object.assign({}, defaultConfiguration);
      }

      this.loggerService.debug("Setting the last user.", this.user);
      // Tell the app who the last user is
      this.electronService.configuration.lastUsername = this.user.username;

      this.translateService.use(this.user.configuration.culture);
    }
  }
}
