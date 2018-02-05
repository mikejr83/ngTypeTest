import * as yargs from "yargs";

import config from "./";

export function updateFromArguments() {
  config.updateServe(yargs.argv.serve !== undefined);
}
