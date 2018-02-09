import * as configuration from "./configuration";
import * as textRequest from "./test";
import * as user from "./user";

/**
 * Registers each set of IPC listeners in relevant modules.
 *
 * @export
 */
export function registerIpcListeners() {
  configuration.registerIpcListeners();
  textRequest.registerIpcListeners();
  user.registerIpcListeners();
}
