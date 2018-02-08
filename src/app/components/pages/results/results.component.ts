import { AfterViewInit, Component, OnInit } from "@angular/core";

import { HighlightTag } from "angular-text-input-highlight";
import * as _ from "lodash";
import * as moment from "moment";

import { ConfigurationService } from "app/providers/configuration/configuration.service";
import { ElectronService } from "app/providers/electron/electron.service";
import { TestService } from "app/providers/test/test.service";
import { UserService } from "app/providers/user/user.service";

import { ITestResult } from "../../../../../electron/test/result";
import { ITestText } from "../../../../../electron/test/testText";
import { splitTextIntoWords } from "../../../../../util/wordCount";

class TestResult implements ITestResult {
  public info: ITestText;
  public enteredText: string;
  public badWords: HighlightTag[];
  public start: Date;
  public end: Date;
  public username: string;

  public duration: string;
  public numberOfWords: number;
  public wpm: number;
}

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"]
})
export class ResultsComponent implements OnInit {

  public averageWpm: number;
  public maxWpm: number;
  public results: TestResult[] = [];


  constructor(private configService: ConfigurationService,
    private electronService: ElectronService,
    private testService: TestService,
    private userService: UserService) {

  }

  ngOnInit() {
    this.loadTestResults();
  }

  navigateToTextLocation(testResult: ITestResult) {
    if (this.electronService.isElectron()) {
      this.electronService.openExternal(testResult.info.locationDescription);
    }
  }

  calculateDuration(testResult: ITestResult) {
    const durationOfTest = moment.duration(moment(testResult.end).diff(testResult.start)) as any;
    let formattedDuration: string = "";
    if (!durationOfTest.get("minutes")) {
      formattedDuration = "0:"
    }
    formattedDuration += durationOfTest.format("mm:ss");

    return formattedDuration;
  }

  calculateWPM(testResult: ITestResult) {
    const durationOfTest = moment.duration(moment(testResult.end).diff(testResult.start));

    const words = splitTextIntoWords(testResult.enteredText, true);


    const correctWPM = (words.length - testResult.badWords.length) / durationOfTest.as("minutes");

    return correctWPM;
  }

  calculateNumberOfWords(testResult: ITestResult) {
    const words = splitTextIntoWords(testResult.enteredText, true);

    return words.length;
  }

  private async loadTestResults() {
    const rawResults = await this.testService.loadResultsForUser(this.configService.configuration.lastUsername);

    const r = [];
    let totalWPM = 0;
    let maxWpm = 0;
    this.results = _.chain(rawResults)
      .orderBy(["start"], ["desc"])
      .map((result) => {
        const newResult = <TestResult>result;
        newResult.duration = this.calculateDuration(result);
        newResult.numberOfWords = this.calculateNumberOfWords(result);
        newResult.wpm = this.calculateWPM(result);

        totalWPM += newResult.wpm;
        maxWpm = Math.max(maxWpm, newResult.wpm);

        return newResult;
      })
      .value();

    this.maxWpm = maxWpm;
    this.averageWpm = (totalWPM / rawResults.length);
  }
}
