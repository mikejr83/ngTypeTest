import { Component, OnInit } from "@angular/core";

import { UserService } from "app/providers/user.service";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.scss"]
})
export class ConfigurationComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}
