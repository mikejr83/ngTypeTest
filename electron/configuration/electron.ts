import * as Store from "electron-store"; // tslint:disable-line
import * as _ from "lodash";

import { CONFIGURATION } from "../constants";
export interface IElectronConfiguration {
  lastUsername?: string;
  logLevel: string;
  serve: boolean;
  showDebugTools: boolean;
}

export const defaultElectronConfiguration = {
  logLevel: "info",
  serve: false,
  showDebugTools: false
};

export function saveConfiguration(configuration: IElectronConfiguration, configToSave: IElectronConfiguration) {
  const store = new Store();

  _.forIn(configToSave, (val, key) => {
    configuration[key] = val;
    store.set(key, val);
  });

  configuration.lastUsername = configToSave.lastUsername;
  store.set(CONFIGURATION.LAST_USERNAME, configToSave.lastUsername);
}

export function loadConfiguration(): IElectronConfiguration {
  const config: IElectronConfiguration = _.cloneDeep(defaultElectronConfiguration) as IElectronConfiguration;
  const store = new Store();

  _.forIn(defaultElectronConfiguration, (val, key) => {
    config[key] = store.get(key);
  });

  config[CONFIGURATION.LAST_USERNAME] = store.get(CONFIGURATION.LAST_USERNAME);

  return config;
}
