import * as textRequest from "./test";
import * as user from "./user";

export function registerIpcListeners() {
  textRequest.registerIpcListeners();
  user.registerIpcListeners();
}
