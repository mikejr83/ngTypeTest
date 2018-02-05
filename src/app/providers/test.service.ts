import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

import { ipcRenderer } from "electron";
import * as _ from "lodash";

import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user.service";

import { defaultConfiguration } from "../../../electron/configuration/user";
import { EVENTS } from "../../../electron/constants"



@Injectable()
export class TestService {
  public paragraphs: string[];
  public testHtml: string = "";

  constructor(private loggerService: LoggerService, private userService: UserService) {
  }

  async loadTestText(): Promise<string[]> {
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
}
