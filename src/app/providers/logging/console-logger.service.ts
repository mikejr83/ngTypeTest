import { Injectable } from "@angular/core";

import { ConfigurationService } from "app/providers/configuration.service";
import { Logger } from "./logger.service";

const noop = (): any => undefined;

@Injectable()
export class ConsoleLoggerService implements Logger {

  constructor(private configurationService: ConfigurationService) {

  }

  get debug() {
    if (this.findLevel() >= 0) {
      return console.debug.bind(console);
    } else {
      return noop;
    }
  }

  get info() {
    if (this.findLevel() >= 2) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (this.findLevel() >= 3) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (this.findLevel() >= 4) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  private findLevel() {
    switch (this.configurationService.configuration.logLevel) {
      case "silly":
        return 0;

      case "debug":
        return 1;

      case "info":
        return 2;

      case "warn":
        return 3;

      case "error":
        return 4;
    }
  }

  invokeConsoleMethod(type: string, args?: any): void {
    const logFn: Function = (console)[type] || console.log || noop;
    logFn.apply(console, [args]);
  }
}
