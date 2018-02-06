import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgModel } from "@angular/forms";
import * as jQuery from "jquery";

import { ITextWord } from "app/../../electron/test/word";
import { splitTextIntoWords } from "app/../../util/wordCount";

import { LoggerService } from "app/providers/logging/logger.service";
import { TestService, TestStatus } from "app/providers/test.service";


@Directive({
  selector: "[appTextarea]",
  providers: [NgModel]
})
export class TestTextareaDirective {

  constructor(private element: ElementRef, private loggerService: LoggerService, private testService: TestService) {

  }

  @HostListener("keydown") onkeydown() {
    if (this.testService.testStatus === TestStatus.ready) {
      this.testService.startTest();
    }
  }

  @HostListener("ngModelChange", ["$event"]) onInputChange($event) {
    this.testService.wordsTyped = splitTextIntoWords($event, true);

    if ($event.length >= this.testService.textLength) {
      this.loggerService.info("Test length reached")
      this.testService.stopTest(false, new Date());
    }
  }
}
