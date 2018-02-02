import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import * as childProcess from "child_process";
import { ipcRenderer } from "electron";

import { defaultConfiguration, IConfiguration } from "../../../electron/configuration/configuration";
import { EVENTS } from "../../../electron/constants";
import { environment } from "../../environments";

@Injectable()
export class ElectronService implements OnDestroy {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  configuration: IConfiguration;

  constructor() {
    this.configuration = Object.assign({}, defaultConfiguration);

    if (!environment.production) {
      this.configuration.logLevel = "silly";
    }

    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require("electron").ipcRenderer;
      this.childProcess = window.require("child_process");

      this.ipcRenderer.on(EVENTS.MAIN.CONFIGURATION_UPDATED, this.onConfigurationUpdated);
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  private onConfigurationUpdated(event: string, updatedConfig: IConfiguration) {
    this.configuration = updatedConfig;

    console.log("Configuration has been updated!", this.configuration);
  }

  ngOnDestroy() {
    this.ipcRenderer.removeListener(EVENTS.MAIN.CONFIGURATION_UPDATED, this.onConfigurationUpdated);
  }
}
