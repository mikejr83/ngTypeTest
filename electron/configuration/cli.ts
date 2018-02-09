import * as yargs from "yargs";

import config from "./";

/**
 * Update configuration from yargs
 *
 * @export
 */
export function updateFromArguments() {
  // Update from the --serve flag.
  config.serve = yargs.argv.serve !== undefined;
}
