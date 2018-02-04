import { Injectable } from "@angular/core";
import { ipcRenderer } from "electron";

import { LoggerService } from "app/providers/logging/logger.service";

import { EVENTS } from "../../../electron/constants";
import { IUser } from "../../../electron/user/user";

@Injectable()
export class UserService {
  public user: IUser;

  constructor(private loggerService: LoggerService) {}

  public registerUser(email: string, name: string) {
    this.user = {
      name,
      username: email
    };

    this.loggerService.debug("Sending the user to be registered in the db.", this.user);

    ipcRenderer.send(EVENTS.MAIN.USER.SAVE, this.user);
  }
}
