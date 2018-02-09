import * as electron from "electron";

import { CONFIGURATION } from "../constants";
import { defaultElectronConfiguration, IElectronConfiguration, loadConfiguration } from "./electron";
import { defaultConfiguration } from "./user";
import { loadWebConfiguration } from "./web";

let configuration: IElectronConfiguration;

if (electron.remote) {
  configuration = loadConfiguration();
} else {
  configuration = loadWebConfiguration();
}

/**
 * Configuration for the application
 */
export default configuration;
