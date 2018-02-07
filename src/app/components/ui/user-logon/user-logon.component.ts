import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms/src/directives/ng_form";

import { ElectronService } from "app/providers/electron.service";
import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user.service";

@Component({
  selector: "user-logon",
  templateUrl: "./user-logon.component.html",
  styleUrls: ["./user-logon.component.scss"]
})
export class UserLogonComponent implements OnInit {
  public newUser: boolean = false;
  public email: string;
  public loginError: boolean;
  public name: string;

  constructor(private electronService: ElectronService, private loggerService: LoggerService, private userService: UserService) {

  }

  ngOnInit() {
  }

  setupNewUser() {
    this.newUser = true;
  }

  async submitRegistration(form: NgForm) {
    this.loggerService.debug("New user. Registering the user.");
    // Call the registration function on the user service.
    this.userService.registerUser(form.value.email, form.value.name);
  }

  async submitLogin(form: NgForm) {
    // Reset the login error flag.
    this.loginError = false;

    // The user is attempting to log-in. Use the load user functionality.
    this.loggerService.debug("Existing user. Getting their info...");
    await this.userService.loginUser(form.value.email);
    this.loggerService.debug("Login performed. Checking to see if it was good.");
    this.loginError = this.userService.user === undefined || this.userService.user === null;
  }

  cancelRegistration() {
    this.newUser = false;
    this.email = "";
    this.name = "";
  }
}
