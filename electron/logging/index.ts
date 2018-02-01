import {
  Logger,
  LoggerInstance,
  TransportInstance,
  transports
} from "winston";

import config from "../configuration";

const transportInstances: TransportInstance[] = [];

transportInstances.push(new transports.Console({
  colorize: true,
  level: config.logLevel
}));

const logger = new Logger({
  transports: transportInstances
});

export default logger;
