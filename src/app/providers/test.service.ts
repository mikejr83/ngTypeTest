import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

import { HighlightTag } from "angular-text-input-highlight";
import { Event, ipcRenderer } from "electron";
import * as _ from "lodash";
import * as moment from "moment";
import * as momentDurationFormatSetup from "moment-duration-format";

import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user.service";

import { defaultConfiguration } from "../../../electron/configuration/user";
import { EVENTS } from "../../../electron/constants"
import { ITestResult } from "../../../electron/test/result";
import { ITestText } from "../../../electron/test/testText";
import { splitTextIntoWords } from "../../../util/wordCount";

export enum TestStatus {
  needText = 1,
  ready = 2,
  running = 3,
  aborted = 4,
  completed = 5
}

@Injectable()
export class TestService {
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

  private intervalRef?: number;
  private testWords: string[];
  private typedWords: string[] = [];

  ///////////////////////////////////////////////////////////////////

  constructor(private loggerService: LoggerService, private userService: UserService) {
    momentDurationFormatSetup(moment);
  }

  public async loadTestText(): Promise<string[]> {
    this.testStatus = TestStatus.needText;

    this.loggerService.debug("Asking for wikipedia text to be loaded.");

    // Reset the HTML for the test.
    this.testHtml = "";

    const userConfig = this.userService.user ? this.userService.user.configuration : defaultConfiguration;

    // Go get the test text.
    ipcRenderer.send(EVENTS.RENDERER.TEST.LOAD_WIKIPEDIA, userConfig);

    return new Promise<string[]>((resolve, reject) => {
      // Wait for the resoponse for the wikipedia text.
      ipcRenderer.once(EVENTS.MAIN.TEST.ON_WIKIPEDIA_LOADED, (event, testText: ITestText) => {
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

        resolve(testText.paragraphs);
      });
    });
  }

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

  public async loadResultsForUser(username: string): Promise<Array<ITestResult>> {
    this.loggerService.debug("Looking up the results for a user:", username);

    ipcRenderer.send(EVENTS.RENDERER.TEST.LOAD_RESULTS_FOR_USER, username);

    return new Promise<Array<ITestResult>>((resolve, reject) => {
      ipcRenderer.once(EVENTS.MAIN.TEST.ON_TEST_RESULTS_LOADED, (event: Event, results: ITestResult[]) => {
        resolve(results);
      });
    });
  }

  private logTest(abort: boolean, end: Date) {
    this.loggerService.debug("Logging the test result!");

    const result: ITestResult = {
      badWords: this.badWords,
      end,
      enteredText: this.typedText,
      info: Object.assign({}, this.testTextInfo),
      start: this.testStartTime.toDate(),
      username: this.userService.user.username
    };

    ipcRenderer.send(EVENTS.RENDERER.TEST.LOG, result);
  }

  private timerTick() {
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
