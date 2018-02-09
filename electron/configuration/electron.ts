import * as Store from "electron-store"; // tslint:disable-line
import * as _ from "lodash";

import { CONFIGURATION } from "../constants";

/**
 * The description of the Electron configuration.
 *
 * @export
 * @interface IElectronConfiguration
 */
export interface IElectronConfiguration {
  /**
   * The username of the user last using the software.
   *
   * This is a hack to load up the last user that was using the app.
   *
   * @type {string}
   * @memberof IElectronConfiguration
   */
  lastUsername?: string;
  /**
   * The level of logging for the application.
   *
   * @type {string}
   * @memberof IElectronConfiguration
   */
  logLevel: string;
  /**
   * Should the app be setup to hot reload Electron
   *
   * @type {boolean}
   * @memberof IElectronConfiguration
   */
  serve: boolean;
  /**
   * Open the debug tools pane when the application loads.
   *
   * @type {boolean}
   * @memberof IElectronConfiguration
   */
  showDebugTools: boolean;
}

/**
 * Default configuration
 */
export const defaultElectronConfiguration = {
  logLevel: "info",
  serve: false,
  showDebugTools: false
};

/**
 * Saves the configuration to the configuration store used by electron-store.
 * Also updates the current configuration.
 *
 * Note, this repository is only available if the app is running as an Electron application. It cannot be used via the web server.
 *
 * @export
 * @param configuration Current configuration
 * @param configToSave The configuration to be persisted.
 */
export function saveConfiguration(configuration: IElectronConfiguration, configToSave: IElectronConfiguration) {
  // Open a new generic electron store.
  const store = new Store();

  // Go through each property that will be always undefined !== true and set it on the current configuration
  _.forIn(configToSave, (val, key) => {
    configuration[key] = val;
    store.set(key, val);
  });

  // The last username is special because it can be undefined. This must be manually copied.
  configuration.lastUsername = configToSave.lastUsername;
  store.set(CONFIGURATION.LAST_USERNAME, configToSave.lastUsername);
}

/**
 * Loads the confuration from the electron-store repository.
 *
 * Note, this repository is only available if the app is running as an Electron application. It cannot be used via the web server.
 */
export function loadConfiguration(): IElectronConfiguration {
  // Get a default configuration.
  const config: IElectronConfiguration = _.cloneDeep(defaultElectronConfiguration) as IElectronConfiguration;
  // Open a connection to the electron-store configuration store.
  const store = new Store();

  // Go through each of the default configuration properties and get that property name from the store.
  _.forIn(defaultElectronConfiguration, (val, key) => {
    config[key] = store.get(key);
  });

  // Do the same for the corner case of last username.
  config[CONFIGURATION.LAST_USERNAME] = store.get(CONFIGURATION.LAST_USERNAME);

  // Return the populated configuration.
  return config;
}
