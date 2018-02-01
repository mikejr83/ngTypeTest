import * as fs from "fs-extra";
import * as path from "path";
import * as yargs from "yargs";

import { IConfiguration } from "./configuration";

const defaultConfiguration: IConfiguration = {
  logLevel: "info",
  serve: false,
  showDebugTools: false
};

const relativePathBase = "../../";
const configPath = path.join(__dirname, relativePathBase, "config.json");

let rawConfig;

if (fs.existsSync(configPath)) {
  rawConfig = fs.readJsonSync(configPath);
} else {
  rawConfig = defaultConfiguration;
}

const configuration: IConfiguration = Object.assign({}, defaultConfiguration, rawConfig);

configuration.serve = yargs.argv.serve !== undefined;

export default configuration;
