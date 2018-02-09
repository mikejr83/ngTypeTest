import { HighlightTag } from "angular-text-input-highlight";

import { ITestText } from "./testText";

/**
 * Test result
 *
 * Defines the structure for the data describing the results of a typing test.
 *
 * @export
 * @interface ITestResult
 */
export interface ITestResult {
  /**
   * The information test text object which was used to setup the test.
   *
   * @type {ITestText}
   * @memberof ITestResult
   */
  info: ITestText;
  /**
   * The text which the user entered.
   *
   * @type {string}
   * @memberof ITestResult
   */
  enteredText: string;
  /**
   * The words which the user typed in that did not match their corresponding text.
   *
   * The objects in this array belong to the angular-text-input-highlight module.
   * They define where in the text the words appear.
   *
   * @type {HighlightTag[]}
   * @memberof ITestResult
   */
  badWords: HighlightTag[];
  /**
   * When the user started the test.
   *
   * Used for duration calculation.
   *
   * @type {Date}
   * @memberof ITestResult
   */
  start: Date;
  /**
   * When the user stopped the test.
   *
   * Used for duration calculation.
   */
  end: Date;
  /**
   * The user which owns this test result.
   */
  username: string;
}
