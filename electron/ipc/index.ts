import * as configuration from "./configuration";
import * as textRequest from "./test";
import * as user from "./user";

export function registerIpcListeners() {
  configuration.registerIpcListeners();
  textRequest.registerIpcListeners();
  user.registerIpcListeners();
}
