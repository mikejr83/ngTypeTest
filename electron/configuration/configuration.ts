import * as Store from "electron-store"; // tslint:disable-line

import { CONFIGURATION } from "../constants";
import { IUser } from "../user/user";

export interface IConfiguration {
  logLevel: string;
  serve: boolean;
  showDebugTools: boolean;
  lastUsername?: string;
}

export class Configuration implements IConfiguration {
  private _serve: boolean | undefined; // tslint:disable-line
  private store;

  constructor() {
    this.store = new Store();
  }

  get lastUsername(): string {
    return this.store.get(CONFIGURATION.LAST_USERNAME, undefined);
  }

  set lastUsername(username: string) {
    this.store.set(CONFIGURATION.LAST_USERNAME, username);
  }

  get logLevel(): string {
    return this.store.get(CONFIGURATION.LOG_LEVEL, "info");
  }

  get serve(): boolean {
    if (this._serve !== undefined) {
      return this._serve;
    } else {
      return this.store.get(CONFIGURATION.SERVE, false) as boolean;
    }
  }

  get showDebugTools(): boolean {
    return this.store.get(CONFIGURATION.SHOW_DEBUG_TOOLS, false);
  }

  public updateServe(serve: boolean) {
    this._serve = serve;
  }
}

export const defaultConfiguration: IConfiguration = {
  logLevel: "info",
  serve: false,
  showDebugTools: false
};
