import { Component, OnInit } from "@angular/core";
import { ipcRenderer } from "electron";

import { TestService } from "app/providers/test.service";
import { UserService } from "app/providers/user.service";

@Component({
  selector: "tester",
  templateUrl: "./tester.component.html",
  styleUrls: ["./tester.component.scss"]
})
export class TesterComponent implements OnInit {
  public testReady: boolean = false;

  constructor(public testService: TestService, public userService: UserService) { }

  ngOnInit() {
  }

  public async getTestText() {
    await this.testService.loadTestText();
    this.testReady = true;
  }
}
