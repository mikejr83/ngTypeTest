import { Component, OnInit } from "@angular/core";

import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  show: boolean = false;

  constructor(private logger: LoggerService, public userService: UserService) { }

  ngOnInit() {
  }

  toggle() {
    this.logger.debug("Toggling the side nav", !this.show);

    this.show = !this.show;
  }

  logout() {
    this.toggle();
    this.userService.logoutCurrentUser();
  }
}
