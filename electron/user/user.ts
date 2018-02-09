import { IUserConfiguration } from "../configuration/user";

/**
 * Interface for defining the structure of user data.
 *
 * @export
 * @interface IUser
 */
export interface IUser {
  /**
   * Uniquly identifiable string; email address.
   *
   * @type {string}
   * @memberof IUser
   */
  username: string;
  /**
   * Display name of the user; greeting
   *
   * @type {string}
   * @memberof IUser
   */
  name: string;
  /**
   * User specific configuration.
   *
   * @type {IUserConfiguration}
   * @memberof IUser
   */
  configuration: IUserConfiguration;
}
