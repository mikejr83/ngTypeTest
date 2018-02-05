import * as Store from "electron-store"; // tslint:disable-line

import { CONFIGURATION } from "../constants";
import { IUser } from "../user/user";

export interface IConfiguration {
  culture: string;
  lastUsername?: string;
  logLevel: string;
  serve: boolean;
  showDebugTools: boolean;
  removeNonAsciiCharacters: boolean;
  wikipediaUrl: string;
  wordCount: number;
}

export class Configuration implements IConfiguration {
  private _serve: boolean | undefined; // tslint:disable-line
  private store;

  constructor() {
    this.store = new Store();
  }

  get culture(): string {
    return this.store.get(CONFIGURATION.CULTURE, defaultConfiguration.culture);
  }

  set culture(culture: string) {
    this.store.set(CONFIGURATION.CULTURE, culture);
  }

  get lastUsername(): string {
    return this.store.get(CONFIGURATION.LAST_USERNAME, undefined);
  }

  set lastUsername(username: string) {
    this.store.set(CONFIGURATION.LAST_USERNAME, username);
  }

  get logLevel(): string {
    return this.store.get(CONFIGURATION.LOG_LEVEL, defaultConfiguration.logLevel);
  }

  get removeNonAsciiCharacters(): boolean {
    return this.store.get(CONFIGURATION.REMOVE_NON_ASCII_CHAR, defaultConfiguration.removeNonAsciiCharacters);
  }

  set removeNonAsciiCharacters(remove: boolean) {
    this.store.set(CONFIGURATION.REMOVE_NON_ASCII_CHAR, remove);
  }

  get serve(): boolean {
    if (this._serve !== undefined) {
      return this._serve;
    } else {
      return this.store.get(CONFIGURATION.SERVE, false) as boolean;
    }
  }

  get showDebugTools(): boolean {
    return this.store.get(CONFIGURATION.SHOW_DEBUG_TOOLS, defaultConfiguration.showDebugTools);
  }

  public updateServe(serve: boolean) {
    this._serve = serve;
  }

  get wikipediaUrl(): string {
    return this.store.get(CONFIGURATION.WIKIPEDIA_URL, defaultConfiguration.wikipediaUrl);
  }

  get wordCount(): number {
    return this.store.get(CONFIGURATION.WORD_COUNT, defaultConfiguration.wordCount);
  }

  set wordCount(count: number) {
    this.store.set(CONFIGURATION.WORD_COUNT, count);
  }
}

export const defaultConfiguration: IConfiguration = {
  culture: "en",
  logLevel: "info",
  removeNonAsciiCharacters: true,
  serve: false,
  showDebugTools: false,
  wikipediaUrl: "http://en.wikipedia.org/wiki/Special:Randompage",
  wordCount: 200
};
