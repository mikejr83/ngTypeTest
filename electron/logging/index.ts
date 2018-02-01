import {
  Logger,
  LoggerInstance,
  TransportInstance,
  transports
} from "winston";

const transportInstances: TransportInstance[] = [];

transportInstances.push(new transports.Console({
  colorize: true,
  level: "silly"
}));

const logger = new Logger({
  transports: transportInstances
});

export default logger;
