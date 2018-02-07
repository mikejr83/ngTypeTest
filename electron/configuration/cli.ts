import * as yargs from "yargs";

import config from "./";

export function updateFromArguments() {
  config.serve = yargs.argv.serve !== undefined;
}
