import { Injectable } from "@angular/core";
import { IUser } from "../../../electron/user/user";

@Injectable()
export class UserService {

  public user: IUser;

  constructor() {

  }

  public registerUser(email: string, name: string) {
    this.user = {
      name,
      username: email
    }
  }
}
