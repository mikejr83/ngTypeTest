import { IUserConfiguration } from "../configuration/user";

export interface IUser {
  username: string;
  name: string;
  configuration: IUserConfiguration;
}
