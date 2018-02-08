import { IElectronConfiguration } from "app/../../electron/configuration/electron";

export abstract class ConfigurationService {
  public configuration: IElectronConfiguration;

  public abstract async loadConfig(): Promise<IElectronConfiguration>;

  public abstract async saveCurrentConfig(): Promise<void>;
}
