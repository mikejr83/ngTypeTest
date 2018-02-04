import { Injectable } from "@angular/core";
import { ipcRenderer } from "electron";

import { ElectronService } from "app/providers/electron.service";
import { LoggerService } from "app/providers/logging/logger.service";

import { EVENTS } from "../../../electron/constants";
import { IUser } from "../../../electron/user/user";

@Injectable()
export class UserService {
  public user: IUser;

  constructor(private electronService: ElectronService, private loggerService: LoggerService) {
    if (electronService.configuration.lastUsername !== undefined) {
      loggerService.debug("Looks like there was a previous user...");

      this.loadUser(electronService.configuration.lastUsername).then((user: IUser) => {
        loggerService.debug("Setting the current user:", user);
        this.user = user;
      });
    }
  }

  public setLastUser(user: IUser) {
    this.electronService.configuration.lastUsername = user.username;
  }

  public async loadUser(email: string): Promise<IUser | undefined> {
    this.loggerService.debug("Loading a user by email/username: ", email);
    return new Promise<IUser>((resolve, reject) => {
      this.loggerService.debug("Sending IPC " + EVENTS.MAIN.USER.LOAD, email);
      ipcRenderer.send(EVENTS.MAIN.USER.LOAD, email);

      ipcRenderer.once(EVENTS.MAIN.USER.ONLOAD, (event, user: IUser) => {
        this.loggerService.debug("User was loaded!", user);
        resolve(user);
      });
    }).catch((e) => {
      this.loggerService.error("An error occurred for trying to load a user...", e);
      return undefined;
    })
  }

  public registerUser(email: string, name: string) {
    this.user = {
      name,
      username: email
    };

    this.loggerService.debug("Sending the user to be registered in the db.", this.user);

    ipcRenderer.send(EVENTS.MAIN.USER.SAVE, this.user);

    return this.user;
  }
}
