import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms/src/directives/ng_form";

import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user.service";

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

  constructor(private loggerService: LoggerService, private userService: UserService) {

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
    this.loginError = false;
    let user;
    if (this.newUser) {
      this.loggerService.debug("New user. Registering the user.");
      user = this.userService.registerUser(form.value.email, form.value.name);
    } else if(this.editCurrentUser) {
      this.loggerService.debug("Editing the current user!");
      user = await this.userService.editUser({
        name: this.name,
        username: this.email
      })
    } else {
      this.loggerService.debug("Existing user. Getting their info...");
      user = await this.userService.loadUser(form.value.email);
      this.loginError = user === undefined || user === null;
    }

    this.loggerService.debug("Setting the last user.", user);
    this.userService.setLastUser(user);
  }
}
