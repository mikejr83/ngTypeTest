import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms/src/directives/ng_form";

import { ConfigurationService } from "app/providers/configuration/configuration.service";
import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user/user.service";

@Component({
  selector: "user-editor",
  templateUrl: "./user-editor.component.html",
  styleUrls: ["./user-editor.component.scss"]
})
export class UserEditorComponent implements OnInit {
  public newUser: boolean = false;
  @Input()
  public editCurrentUser: boolean = false;
  public email: string;
  public loginError: boolean;
  public name: string;

  constructor(private configurationService: ConfigurationService, private loggerService: LoggerService, private userService: UserService) {

  }

  ngOnInit() {
    this.loggerService.debug("Editing current user?", this.editCurrentUser);
    if (this.editCurrentUser) {
      this.email = this.userService.user.username;
      this.name = this.userService.user.name;
    }
  }

  setupNewUser() {
    this.newUser = true;
  }

  async onSubmit(form: NgForm) {
    // Reset the login error flag.
    this.loginError = false;
    let user;

    // If we're dealing with a new user case then we'll register them.
    if (this.newUser) {
      this.loggerService.debug("New user. Registering the user.");
      // Call the registration function on the user service.
      user = this.userService.registerUser(form.value.email, form.value.name);
      // Tell the user service who the current user is
      this.userService.user = user;
    } else if (this.editCurrentUser) { // If we're editing the current user then we need to send that info back to the user service
      this.loggerService.debug("Editing the current user!");

    } else { // The user is attempting to log-in. Use the load user functionality.
      this.loggerService.debug("Existing user. Getting their info...");
      await this.userService.loginUser(form.value.email);
      this.loginError = this.userService.user === undefined || this.userService.user === null;
    }

    this.loggerService.debug("Setting the last user.", this.userService.user);
    // Tell the app who the last user is
    this.configurationService.configuration.lastUsername = this.userService.user.username;
    this.configurationService.saveCurrentConfig();
  }
}
