import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { HighlightTag } from "angular-text-input-highlight";
import * as _ from "lodash";
import * as moment from "moment";
import * as momentDurationFormatSetup from "moment-duration-format";
import * as URI from "urijs";

import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user/user.service";

import { ITestResult } from "app/../../electron/test/result";
import { ITestText } from "app/../../electron/test/testText";
import { TestService } from "app/providers/test/test.service";

@Injectable()
export class TestWebService extends TestService {

  constructor(private http: HttpClient, loggerService: LoggerService, userService: UserService) {
    super(loggerService, userService);
  }

  public async loadTestText(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      console.log("Go get test data");
      this.http.post("./test/text", this.userService.user.configuration).subscribe((data: ITestText) => {
        resolve(this.makeText(data));
      }, (error) => {
        this.loggerService.error(error);
      });
    });
  }

  public async loadResultsForUser(username: string): Promise<Array<ITestResult>> {
    this.loggerService.debug("Looking up the results for a user:", username);

    return new Promise<Array<ITestResult>>((resolve, reject) => {
      const url = new URI("/test");
      url.query({
        "username": username
      });

      this.http.get(url.toString()).subscribe((results: ITestResult[]) => {
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

    this.http.put("/test", result).subscribe((response) => {
      this.loggerService.debug("Response", response);
    });
  }
}
