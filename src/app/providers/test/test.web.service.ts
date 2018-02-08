import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

import { HighlightTag } from "angular-text-input-highlight";
import * as _ from "lodash";
import * as moment from "moment";
import * as momentDurationFormatSetup from "moment-duration-format";

import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user/user.service";

import { ITestResult } from "app/../../electron/test/result";
import { ITestText } from "app/../../electron/test/testText";
import { TestService } from "app/providers/test/test.service";

@Injectable()
export class TestWebService extends TestService {
  //////////////////////////////////////////////////////////////////

  // private intervalRef?: number;
  // private testWords: string[];
  // private typedWords: string[] = [];

  ///////////////////////////////////////////////////////////////////

  constructor(protected loggerService: LoggerService, protected userService: UserService) {
    super(loggerService, userService);
  }

  public async loadTestText(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {

        resolve([]);
    });
  }



  public async loadResultsForUser(username: string): Promise<Array<ITestResult>> {
    this.loggerService.debug("Looking up the results for a user:", username);

    return new Promise<Array<ITestResult>>((resolve, reject) => {
      resolve([]);
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
  }
}
