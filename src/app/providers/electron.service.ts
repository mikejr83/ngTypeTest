import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import * as childProcess from "child_process";
import { ipcRenderer } from "electron";

import config from "../../../electron/configuration";
import { ElectronConfiguration } from "../../../electron/configuration/electron";
import { EVENTS } from "../../../electron/constants";
import { environment } from "../../environments";

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  configuration: ElectronConfiguration;

  constructor() {
    this.configuration = config;

    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require("electron").ipcRenderer;
      this.childProcess = window.require("child_process");
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }
}
