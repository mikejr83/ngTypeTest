import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

import { Event, ipcRenderer } from "electron";

import { IElectronConfiguration } from "../../../electron/configuration/electron";
import { EVENTS } from "../../../electron/constants";

@Injectable()
export class ConfigurationService {
  configuration: IElectronConfiguration;

  constructor() {
    this.configuration = ipcRenderer.sendSync(EVENTS.RENDERER.CONFIGURATION.LOAD);
  }

  public async saveCurrentConfig(): Promise<void> {
    ipcRenderer.send(EVENTS.RENDERER.CONFIGURATION.SAVE, this.configuration);

    return new Promise<void>((resolve, reject) => {
      ipcRenderer.once(EVENTS.MAIN.CONFIGURATION_UPDATED, (event: Event, config: IElectronConfiguration) => {
        resolve();
      });
    });
  }
}
