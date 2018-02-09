import { Injectable } from "@angular/core";

/**
 * Provides the blueprint for any logging service
 *
 * @export
 * @abstract
 * @class Logger
 */
export abstract class Logger {
  /**
   * Log a debug message
   *
   * @type {*}
   * @memberof Logger
   */
  debug: any;
  /**
   * Log an informational message.
   *
   * @type {*}
   * @memberof Logger
   */
  info: any;
  /**
   * Log a warning.
   *
   * @type {*}
   * @memberof Logger
   */
  warn: any;
  /**
   * Log an error!
   *
   * @type {*}
   * @memberof Logger
   */
  error: any;
}

/**
 * Stub LoggerService. This provides a basic implementation for the logger provider.
 *
 * @export
 * @class LoggerService
 * @implements {Logger}
 */
@Injectable()
export class LoggerService implements Logger {
  /**
   * Log a debug message
   *
   * @type {*}
   * @memberof Logger
   */
  debug: any;
  /**
   * Log an informational message.
   *
   * @type {*}
   * @memberof Logger
   */
  info: any;
  /**
   * Log a warning.
   *
   * @type {*}
   * @memberof Logger
   */
  warn: any;
  /**
   * Log an error!
   *
   * @type {*}
   * @memberof Logger
   */
  error: any;

  invokeConsoleMethod(type: string, args?: any): void {}
}
