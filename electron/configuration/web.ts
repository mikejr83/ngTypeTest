import * as fs from "fs-extra";
import * as _ from "lodash";
import * as path from "path";

import { defaultElectronConfiguration, IElectronConfiguration } from "./electron";

export function saveLocalConfiguration(configuration: IElectronConfiguration, config: IElectronConfiguration) {
  _.forIn(config, (val, key) => {
    configuration[key] = val;
  });

  configuration.lastUsername = config.lastUsername;

  try {
    fs.writeFileSync(path.join(__dirname, "../../config.json"), JSON.stringify(config, null, 2));
  } catch (e) {
    console.error(e); // tslint:disable-line
  }
}

export function loadWebConfiguration(): IElectronConfiguration {
  let config: IElectronConfiguration = _.cloneDeep(defaultElectronConfiguration) as IElectronConfiguration;
  const pathname = path.join(__dirname, "../../config.json");

  if (fs.existsSync(pathname)) {
    const readConfig = fs.readJsonSync(pathname);

    config = _.extend(config, readConfig);
  }

  return config;
}
