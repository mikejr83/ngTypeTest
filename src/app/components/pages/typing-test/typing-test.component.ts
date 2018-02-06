import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as jquery from "jquery";

import { splitTextIntoWords } from "app/../../util/wordCount";

import { ElectronService } from "app/providers/electron.service";
import { TestService } from "app/providers/test.service";
import { UserService } from "app/providers/user.service";

@Component({
  selector: "app-typing-test",
  templateUrl: "./typing-test.component.html",
  styleUrls: ["./typing-test.component.scss"]
})

export class TypingTestComponent implements OnInit {
  @ViewChild("typedText") typedText: ElementRef;

  public paragraphs = [];
  public testAborted = false;

  constructor(public electronService: ElectronService, public testService: TestService, public userService: UserService) { }

  ngOnInit() {
  }

  public async getTestText() {
    this.paragraphs = await this.testService.loadTestText();

    // Grab the text area and then set the focus to it.
    const typedTextElement = jquery(this.typedText.nativeElement);
    setTimeout(() => typedTextElement.focus(), 0);
  }

  public abortTest() {
    this.testAborted = true;
    this.testService.stopTest(true, new Date());
  }

  public async newTest() {
    await this.testService.loadTestText();

    this.restartTest();
  }

  public restartTest() {
    //
    this.testService.resetTest();

    // Grab the text area and then set the focus to it.
    const typedTextElement = jquery(this.typedText.nativeElement);
    setTimeout(() => typedTextElement.focus(), 0);
  }

  public navigateToTextLocation() {
    if (this.electronService.isElectron()) {
      this.electronService.openExternal(this.testService.testTextInfo.locationDescription);
    }
  }
}
