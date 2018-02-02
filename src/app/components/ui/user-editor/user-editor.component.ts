import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms/src/directives/ng_form";

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

  constructor(private userService: UserService) {
  }

  setupNewUser() {
    this.newUser = true;
  }

  onSubmit(form: NgForm) {
    this.userService.registerUser(form.value.email, form.value.name);
  }
}
