import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

import { environment } from "app/../environments";
import { ElectronService } from "app/providers/electron/electron.service";

@Injectable()
export class ElectronWebService extends ElectronService {

  // ipcRenderer: typeof ipcRenderer;
  // childProcess: typeof childProcess;

  constructor() {
    super();
  }

  isElectron = () => {
    return false;// window && window.process && window.process.type;
  }

  public openExternal(url: string, options?: any, callback?: (error: Error) => void): boolean {
    // if (this.isElectron()) {
    //   return shell.openExternal(url);
    // } else {
      return false;
    // }

  }
}
