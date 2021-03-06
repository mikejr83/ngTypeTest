import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import * as childProcess from "child_process";
// import { ipcRenderer, OpenExternalOptions, shell } from "electron";

import { environment } from "app/../environments";
import { ElectronService } from "app/providers/electron/electron.service";

@Injectable()
export class ElectronIpcService extends ElectronService {

  // ipcRenderer: typeof ipcRenderer;
  // childProcess: typeof childProcess;

  constructor() {
    super();

    // Conditional imports
    if (this.isElectron()) {
      // this.ipcRenderer = window.require("electron").ipcRenderer;
      // this.childProcess = window.require("child_process");
    }
  }

  isElectron = () => {
    return true;// window && window.process && window.process.type;
  }

  public openExternal(url: string, options?: any, callback?: (error: Error) => void): boolean {
    // if (this.isElectron()) {
    //   return shell.openExternal(url);
    // } else {
      return false;
    // }

  }
}
