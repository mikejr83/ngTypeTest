import { Component, OnInit } from "@angular/core";

import { UserService } from "app/providers/user.service";

@Component({
  selector: "app-typing-test",
  templateUrl: "./typing-test.component.html",
  styleUrls: ["./typing-test.component.scss"]
})
export class TypingTestComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}
