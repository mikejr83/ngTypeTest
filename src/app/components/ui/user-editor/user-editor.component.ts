import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms/src/directives/ng_form";

import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user.service";

@Component({
  selector: "user-editor",
  templateUrl: "./user-editor.component.html",
  styleUrls: ["./user-editor.component.scss"]
})
export class UserEditorComponent {
  public newUser: boolean = false;
  public email: string;
  public name: string;

  constructor(private loggerService: LoggerService, private userService: UserService) {
  }

  setupNewUser() {
    this.newUser = true;
  }

  async onSubmit(form: NgForm) {
    let user;
    if (this.newUser) {
      this.loggerService.debug("New user. Registering the user.");
      user = this.userService.registerUser(form.value.email, form.value.name);
    } else {
      this.loggerService.debug("Existing user. Getting their info...");
      user = await this.userService.loadUser(form.value.email);
    }
    this.loggerService.debug("Setting the last user.", user);
    this.userService.setLastUser(user);
  }
}
