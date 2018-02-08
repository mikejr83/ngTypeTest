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

export enum TestStatus {
  needText = 1,
  ready = 2,
  running = 3,
  aborted = 4,
  completed = 5
}

export abstract class TestService {
  //////////////////////////////////////////////////////////////////
  public badWords: HighlightTag[] = [];

  public errorPercentage: number = 0;

  public formattedDuration: string;

  public incorrect: number = 0;

  public testTextInfo: ITestText;

  public testHtml: string = "";
  public typedText: string;

  public testStatus: TestStatus = TestStatus.needText;

  public testHasStarted: boolean = false;
  public testStartTime: moment.Moment;

  public textLength: number = 0;

  public wordsTyped: string[] = [];
  public wpm: number;

  protected testWords: string[];

  private intervalRef: number;

  ///////////////////////////////////////////////////////////////////

  constructor(protected loggerService: LoggerService, protected userService: UserService) {
    momentDurationFormatSetup(moment);
  }

  public abstract async loadTestText(): Promise<string[]>;

  public abstract async loadResultsForUser(username: string): Promise<Array<ITestResult>>;

  public resetTest() {
    this.badWords = [];
    // Clear out the timer display
    this.formattedDuration = "";
    // Clear out the typed text
    this.typedText = "";
    // Set the test as ready to start
    this.testStatus = TestStatus.ready;
  }

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

  protected abstract logTest(abort: boolean, end: Date);

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
