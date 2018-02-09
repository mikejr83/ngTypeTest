import { Component, OnInit } from "@angular/core";

import { UserService } from "app/providers/user/user.service";

/**
 * The home page component.
 *
 * @export
 * @class HomeComponent
 * @implements {OnInit}
 */
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  /**
   * Creates an instance of HomeComponent.
   * @param {UserService} userService
   * @memberof HomeComponent
   */
  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}
