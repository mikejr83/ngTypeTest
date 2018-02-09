import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

import { HighlightTag } from "angular-text-input-highlight";
import * as _ from "lodash";
import * as moment from "moment";
import * as momentDurationFormatSetup from "moment-duration-format";

import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user/user.service";

import { defaultConfiguration } from "app/../../electron/configuration/user";
import { ITestResult } from "app/../../electron/test/result";
import { ITestText } from "app/../../electron/test/testText";
import { splitTextIntoWords } from "app/../../util/wordCount";

/**
 * Test state
 */
export enum TestStatus {
  /**
   * Test needs text to start
   */
  needText = 1,
  /**
   * Test is ready to start; have text
   */
  ready = 2,
  /**
   * Test is in the process of running; user is entering text
   */
  running = 3,
  /**
   * The test was aborted by the user.
   */
  aborted = 4,
  /**
   * The test was fully completed by the user.
   */
  completed = 5
}

/**
 * Service for test functionality.
 *
 * @export
 * @abstract
 * @class TestService
 */
export abstract class TestService {
  /**
   * Words typed incorrectly
   *
   * @type {HighlightTag[]}
   * @memberof TestService
   */
  public badWords: HighlightTag[] = [];
  /**
   * Percentage of errors in the typed text.
   *
   * @type {number}
   * @memberof TestService
   */
  public errorPercentage: number = 0;

  /**
   * Formatted string for the duration of the test.
   *
   * @type {string}
   * @memberof TestService
   */
  public formattedDuration: string;
  /**
   * Raw number of incorrect.
   *
   * @type {number}
   * @memberof TestService
   */
  public incorrect: number = 0;
  /**
   * Text information for the test.
   *
   * @type {ITestText}
   * @memberof TestService
   */
  public testTextInfo: ITestText;
  /**
   * Raw HTML for the test.
   *
   * @type {string}
   * @memberof TestService
   */
  public testHtml: string = "";
  /**
   * User entered text.
   *
   * @type {string}
   * @memberof TestService
   */
  public typedText: string;
  /**
   * Current test status.
   *
   * @type {TestStatus}
   * @memberof TestService
   */
  public testStatus: TestStatus = TestStatus.needText;
  /**
   * Flag for if the test started.
   *
   * @deprecated
   * @type {boolean}
   * @memberof TestService
   */
  public testHasStarted: boolean = false;
  /**
   * Time when the test started.
   *
   * @type {moment.Moment}
   * @memberof TestService
   */
  public testStartTime: moment.Moment;
  /**
   * Raw length of the text the user must type.
   *
   * @type {number}
   * @memberof TestService
   */
  public textLength: number = 0;
  /**
   * Words the user has typed.
   *
   * @type {string[]}
   * @memberof TestService
   */
  public wordsTyped: string[] = [];
  /**
   * Current words per minute.
   *
   * @type {number}
   * @memberof TestService
   */
  public wpm: number;
  /**
   * Text broken down into words
   *
   * @protected
   * @type {string[]}
   * @memberof TestService
   */
  protected testWords: string[];
  /**
   * Interval reference handle.
   *
   * @private
   * @type {number}
   * @memberof TestService
   */
  private intervalRef: number;

  /**
   * Creates an instance of TestService.
   * @param {LoggerService} loggerService
   * @param {UserService} userService
   * @memberof TestService
   */
  constructor(protected loggerService: LoggerService, protected userService: UserService) {
    momentDurationFormatSetup(moment);
  }

  /**
   * Load several paragraphs of text for a new test.
   *
   * This should set the testTextInfo
   * @abstract
   * @returns {Promise<string[]>}
   * @memberof TestService
   */
  public abstract async loadTestText(): Promise<string[]>;

  /**
   * Get all the results for a specific user.
   *
   * @abstract
   * @param {string} username
   * @returns {Promise<Array<ITestResult>>}
   * @memberof TestService
   */
  public abstract async loadResultsForUser(username: string): Promise<Array<ITestResult>>;

  /**
   * Rest the current state such that no test has begun.
   *
   * @memberof TestService
   */
  public resetTest() {
    this.badWords = [];
    // Clear out the timer display
    this.formattedDuration = "";
    // Clear out the typed text
    this.typedText = "";
    // Set the test as ready to start
    this.testStatus = TestStatus.ready;
  }

  /**
   * Start a test when the service is in the ready state.
   *
   * @memberof TestService
   */
  public startTest() {
    // You can only start a test that
    if (this.testStatus === TestStatus.ready) {
      this.resetTest();

      this.testStatus = TestStatus.running;

      this.testStartTime = moment();
      this.intervalRef = window.setInterval(this.timerTick.bind(this), 1000);
    }
  }

  public stopTest(abort: boolean, end: Date) {
    this.loggerService.debug("Stopping the test. Abort:", abort);

    if (this.intervalRef) {
      window.clearInterval(this.intervalRef);
    }

    this.testStatus = abort ? TestStatus.aborted : TestStatus.completed;

    this.logTest(abort, end);
  }

  /**
   * Log (save) a test result.
   *
   * @protected
   * @abstract
   * @param {boolean} abort Was the test aborted
   * @param {Date} end When did the test end.
   * @memberof TestService
   */
  protected abstract logTest(abort: boolean, end: Date);

  /**
   * Make the text for the test.
   * @param testText
   */
  protected makeText(testText: ITestText) {
    this.loggerService.debug("Got wikipedia test text.");

    this.testTextInfo = testText;
    const testWords: string[] = [];
    let textLength = 0;
    _.forEach(testText.paragraphs, (paragraph) => {
      this.testHtml += "<p>" + paragraph + "</p>\n";

      textLength += paragraph.length;

      const paragraphWords = splitTextIntoWords(paragraph, true);
      testWords.push.apply(testWords, paragraphWords);
    });

    this.testWords = _.filter(testWords, (word) => {
      return word !== "";
    });

    this.textLength = textLength;

    this.loggerService.debug("Here are the test words:", this.testWords);

    this.testStatus = TestStatus.ready;

    return testText.paragraphs;
  }

  protected timerTick() {
    const durationOfTest = moment.duration(moment().diff(this.testStartTime)) as any;
    let formattedDuration: string = "";
    if (!durationOfTest.get("minutes")) {
      formattedDuration = "0:"
    }
    formattedDuration += durationOfTest.format("mm:ss")

    this.formattedDuration = formattedDuration;

    let correct: number = 0;
    let incorrect: number = 0;
    let offset: number = 0;
    const badWords: HighlightTag[] = [];
    for (let i = 0; i < this.wordsTyped.length; i++) {
      if (this.wordsTyped[i] === "") { continue; }

      if (this.wordsTyped[i] === this.testWords[i]) {
        correct++;
      } else {
        incorrect++;
        if (i !== (this.wordsTyped.length - 1)) {
          badWords.push({
            cssClass: "bad-word",
            data: {
              word: this.wordsTyped[i]
            },
            indices: {
              end: (offset + this.wordsTyped[i].length),
              start: offset,
            }
          });
        }
      }

      // Move the offset of where the text starts.
      offset += (this.wordsTyped[i].length + 1);
    }
    this.badWords = badWords;

    const correctWPM = correct / durationOfTest.as("minutes");

    this.loggerService.debug("Raw WPM:", correctWPM);

    this.wpm = correctWPM;
    this.incorrect = incorrect;
    this.errorPercentage = incorrect / (this.wordsTyped.length);
  }
}
