import * as yargs from "yargs";

import config from "./";
import { Configuration } from "./configuration";

export function updateFromArguments() {
  console.log("Updating the config from the command line args...");
  config.updateServe(yargs.argv.serve !== undefined);
}
