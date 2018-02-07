import * as Store from "electron-store"; // tslint:disable-line
import * as _ from "lodash";

import { CONFIGURATION } from "../constants";
import { defaultElectronConfiguration, IElectronConfiguration } from "./electron";
import { defaultConfiguration } from "./user";

export function saveConfiguration(config: IElectronConfiguration) {
  const store = new Store();

  _.forIn(config, (val, key) => {
    configuration[key] = val;
    store.set(key, val);
  });
}

export function loadConfiguration(): IElectronConfiguration {
  const config: IElectronConfiguration = _.cloneDeep(defaultElectronConfiguration) as IElectronConfiguration;
  const store = new Store();

  _.forIn(defaultConfiguration, (val, key) => {
    config[key] = store.get(key);
  });

  config[CONFIGURATION.LAST_USERNAME] = store.get(CONFIGURATION.LAST_USERNAME);

  return config;
}

const configuration: IElectronConfiguration = loadConfiguration();

export default configuration;
