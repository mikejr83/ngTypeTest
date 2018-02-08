import { Component, OnInit } from "@angular/core";

import { UserService } from "app/providers/user/user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}
