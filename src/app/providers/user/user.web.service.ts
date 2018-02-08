import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { ConfigurationService } from "app/providers/configuration/configuration.service";
import { LoggerService } from "app/providers/logging/logger.service";

import { defaultConfiguration } from "app/../../electron/configuration/user";
import { IUser } from "app/../../electron/user/user";
import { UserService } from "app/providers/user/user.service";


@Injectable()
export class UserWebService extends UserService {

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
      // The user was updated. Resolve the promise with the new user object.
      resolve();
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
      resolve();
    }).catch((e) => {
      this.loggerService.error("An error occurred for trying to load a user...", e);

      // If there was an error loading the user hand back undefined.
      return undefined;
    })
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
      resolve();
    });
  }
}
