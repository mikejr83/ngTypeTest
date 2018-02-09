import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { ConfigurationService } from "app/providers/configuration/configuration.service";
import { LoggerService } from "app/providers/logging/logger.service";

import { defaultConfiguration } from "app/../../electron/configuration/user";
import { IUser } from "app/../../electron/user/user";

/**
 * The user service. Provides user functions
 */
export abstract class UserService {
  /**
   * The currently logged in user.
   *
   * @type {IUser}
   * @memberof UserService
   */
  public user: IUser;

  /**
   * Creates an instance of UserService.
   * @param {ConfigurationService} configurationService
   * @param {LoggerService} loggerService
   * @param {TranslateService} translateService
   * @memberof UserService
   */
  constructor(protected configurationService: ConfigurationService, protected loggerService: LoggerService, protected translateService: TranslateService) {
    // Check to see if there is a lastUsername defined. If it is then we'll load up the last user of the app.
    if (configurationService.configuration && configurationService.configuration.lastUsername !== undefined) {
      loggerService.debug("Looks like there was a previous user...");

      this.loginUser(configurationService.configuration.lastUsername);
    } else if (!configurationService.configuration) {
      configurationService.loadConfig().then(() => {
        if (configurationService.configuration.lastUsername !== undefined) {
          loggerService.debug("Looks like there was a previous user...");

          this.loginUser(configurationService.configuration.lastUsername);
        }
      });
    }
  }

  /**
   * Updates a user and their accompanying information in the database.
   * @param updatedUser The user object which contains the updates to apply to the user record in the db.
   */
  public abstract async editUser(updatedUser: IUser): Promise<IUser>;

  /**
   * Loads a user from the database.
   * @param email The email/username of the user to load.
   */
  public abstract async loadUser(email: string): Promise<IUser | undefined>;

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

  /**
   * Logs the current user out.
   *
   * @memberof UserService
   */
  public logoutCurrentUser() {
    this.loggerService.debug("Logging out user! Setting user service user to undefined and clearing the config's lastUsername.");
    // Unset the current user
    this.user = undefined;
    // Unset the last username
    this.configurationService.configuration.lastUsername = undefined;
    // Save the configuration so that user isn't loaded next time.
    this.configurationService.saveCurrentConfig();
  }

  /**
   * Register (create) a user.
   *
   * @abstract
   * @param {string} email User's email (username)
   * @param {string} name Greeting or display name.
   * @returns {Promise<IUser>}
   * @memberof UserService
   */
  public abstract registerUser(email: string, name: string): Promise<IUser>;

  /**
   * Sets the current user in the app.
   *
   * @protected
   * @param {IUser} user The user to set as "logged" in.
   * @memberof UserService
   */
  protected setCurrentUser(user: IUser) {
    this.loggerService.debug("Setting the current user:", user);
    // Set the current user
    this.user = user;

    // Check to see if the user is actually a real user
    if (!this.user) {
      // Null was returned by the call. Logout any user that was "previous" as they don't exist in the db.
      this.logoutCurrentUser();
    } else {
      // We got a valid user back so let's make sure they also have a valid configuration.
      if (this.user.configuration === undefined || this.user.configuration === null) {
        this.user.configuration = Object.assign({}, defaultConfiguration);
      }

      this.loggerService.debug("Setting the last user.", this.user);
      // Tell the app who the last user is
      this.configurationService.configuration.lastUsername = this.user.username;
      // Save the current configuration so that if the user leaves they will be remembered next time.
      this.configurationService.saveCurrentConfig();

      // Set the translations for the app.
      this.translateService.use(this.user.configuration.culture);
    }
  }
}
