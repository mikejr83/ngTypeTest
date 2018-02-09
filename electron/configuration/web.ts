import * as fs from "fs-extra";
import * as _ from "lodash";
import * as path from "path";

import { defaultElectronConfiguration, IElectronConfiguration } from "./electron";

/**
 * Saves configuration. Used by the web server to persist "application" configuration.
 *
 * @export
 * @param {IElectronConfiguration} configuration
 * @param {IElectronConfiguration} config
 */
export function saveLocalConfiguration(configuration: IElectronConfiguration, config: IElectronConfiguration) {
  // Take the configuration which is going to be saved and update the same properties on the exported
  // "main" configuration.
  _.forIn(config, (val, key) => {
    configuration[key] = val;
  });

  // Last username is weird since it can be undefined.
  configuration.lastUsername = config.lastUsername;

  // Write out the configuration to the root application directory.
  try {
    fs.writeFileSync(path.join(__dirname, "../../config.json"), JSON.stringify(config, null, 2));
  } catch (e) {
    console.error(e); // tslint:disable-line
  }
}

/**
 * Loads configuration. Used by the web server to load "application" configuration.
 *
 * @export
 * @returns {IElectronConfiguration}
 */
export function loadWebConfiguration(): IElectronConfiguration {
  // Create a copy of the default configuration in case no configuration has ever been saved.
  let config: IElectronConfiguration = _.cloneDeep(defaultElectronConfiguration) as IElectronConfiguration;
  // Path to the configuration files.
  const pathname = path.join(__dirname, "../../config.json");

  // Check to see if there is a config file.
  if (fs.existsSync(pathname)) {
    // Read the config file.
    const readConfig = fs.readJsonSync(pathname);

    // Extend the default configuration with the configuration read from disk.
    config = _.extend(config, readConfig);
  }

  // Return the loaded configuration.
  return config;
}
