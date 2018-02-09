import { Injectable } from "@angular/core";

import { ConfigurationService } from "app/providers/configuration/configuration.service";
import { Logger } from "./logger.service";

const noop = (): any => undefined;

/**
 * Console logger implementation.
 *
 * This implementation of a logger creates a provider which sends any log messages to the browser's console.
 *
 * @export
 * @class ConsoleLoggerService
 * @implements {Logger}
 */
@Injectable()
export class ConsoleLoggerService implements Logger {

  /**
   * Creates an instance of ConsoleLoggerService.
   * @param {ConfigurationService} configurationService
   * @memberof ConsoleLoggerService
   */
  constructor(private configurationService: ConfigurationService) {
    this.configurationService.loadConfig();
  }

  /**
   * Log a debug message to the console.
   *
   * Uses console.debug.
   *
   * @type {*}
   * @memberof Logger
   */
  get debug() {
    if (this.findLevel() >= 0) {
      return console.debug.bind(console);
    } else {
      return noop;
    }
  }

  /**
   * Log an informational message to the console.
   *
   * Uses console.info
   *
   * @type {*}
   * @memberof Logger
   */
  get info() {
    if (this.findLevel() >= 2) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  /**
   * Log a warning message to the console.
   *
   * Uses console.warn
   *
   * @type {*}
   * @memberof Logger
   */
  get warn() {
    if (this.findLevel() >= 3) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  /**
   * Log an error to the console.
   *
   * Uses console.error
   *
   * @type {*}
   * @memberof Logger
   */
  get error() {
    if (this.findLevel() >= 4) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }


  /**
   * Gets the current logging level from the configuration.
   *
   * @private
   * @returns
   * @memberof ConsoleLoggerService
   */
  private findLevel() {
    // If we have no configuration return a default of 2 (info).
    if (!this.configurationService.configuration) {
      return 2;
    }

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
