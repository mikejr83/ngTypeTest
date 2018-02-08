export abstract class ElectronService {

  // ipcRenderer: typeof ipcRenderer;
  // childProcess: typeof childProcess;

  isElectron = () => {
    return false;// window && window.process && window.process.type;
  }

  public openExternal(url: string, options?: any, callback?: (error: any) => void): boolean { return false; }
}
