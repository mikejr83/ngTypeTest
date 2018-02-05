import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

import { ipcRenderer } from "electron";
import * as _ from "lodash";
import * as moment from "moment";
import * as momentDurationFormatSetup from "moment-duration-format";

import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user.service";

import { defaultConfiguration } from "../../../electron/configuration/user";
import { EVENTS } from "../../../electron/constants"



@Injectable()
export class TestService {
  public paragraphs: string[];
  public formattedDuration: string;
  public testHtml: string = "";
  public typedText: string;
  public testHasStarted: boolean = false;
  public testStartTime: moment.Moment;

  private intervalRef?: number;

  constructor(private loggerService: LoggerService, private userService: UserService) {
    momentDurationFormatSetup(moment);
  }

  public async loadTestText(): Promise<string[]> {
    this.loggerService.debug("Asking for wikipedia text to be loaded.");

    // Reset the HTML for the test.
    this.testHtml = "";

    const userConfig = this.userService.user ? this.userService.user.configuration : defaultConfiguration;

    // Go get the test text.
    ipcRenderer.send(EVENTS.RENDERER.TEST.LOAD_WIKIPEDIA, userConfig);

    return new Promise<string[]>((resolve, reject) => {
      // Wait for the resoponse for the wikipedia text.
      ipcRenderer.once(EVENTS.MAIN.TEST.ON_WIKIPEDIA_LOADED, (event, paragraphs: string[]) => {
        this.loggerService.debug("Got wikipedia test text.");
        this.paragraphs = paragraphs;
        _.forEach(paragraphs, (paragraph) => {
          this.testHtml += "<p>" + paragraph + "</p>\n";
        });

        resolve(paragraphs);
      });
    });
  }

  public resetTest() {
    this.testHasStarted = false;
    this.formattedDuration = "";
    this.typedText = "";
  }

  public startTest() {
    if (!this.testHasStarted) {
      this.resetTest();

      this.testHasStarted = true;


      this.testStartTime = moment();
      this.intervalRef = window.setInterval(this.timerTick.bind(this), 1000);
    }
  }

  public stopTest() {
    if (this.intervalRef) {
      this.testHasStarted = false;
      window.clearInterval(this.intervalRef);
    }
  }

  private timerTick() {
    const durationOfTest = moment.duration(moment().diff(this.testStartTime)) as any;
    let formattedDuration: string = "";
    if (!durationOfTest.get("minutes")) {
      formattedDuration = "0:"
    }
    formattedDuration += durationOfTest.format("mm:ss")

    this.formattedDuration = formattedDuration;
  }
}
