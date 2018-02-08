import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

import { HighlightTag } from "angular-text-input-highlight";
import { Event, ipcRenderer } from "electron";
import * as _ from "lodash";
import * as moment from "moment";
import * as momentDurationFormatSetup from "moment-duration-format";

import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user/user.service";

import { defaultConfiguration } from "app/../../electron/configuration/user";
import { EVENTS } from "app/../../electron/constants"
import { ITestResult } from "app/../../electron/test/result";
import { ITestText } from "app/../../electron/test/testText";
import { splitTextIntoWords } from "app/../../util/wordCount";
import { TestService, TestStatus } from "app/providers/test/test.service";

@Injectable()
export class TestIpcService extends TestService {
  //////////////////////////////////////////////////////////////////

  // private intervalRef?: number;
  // private testWords: string[];
  // private typedWords: string[] = [];

  ///////////////////////////////////////////////////////////////////

  constructor(protected loggerService: LoggerService, protected userService: UserService) {
    super(loggerService, userService);
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

  public async loadResultsForUser(username: string): Promise<Array<ITestResult>> {
    this.loggerService.debug("Looking up the results for a user:", username);

    ipcRenderer.send(EVENTS.RENDERER.TEST.LOAD_RESULTS_FOR_USER, username);

    return new Promise<Array<ITestResult>>((resolve, reject) => {
      ipcRenderer.once(EVENTS.MAIN.TEST.ON_TEST_RESULTS_LOADED, (event: Event, results: ITestResult[]) => {
        resolve(results);
      });
    });
  }

  protected logTest(abort: boolean, end: Date) {
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
}
