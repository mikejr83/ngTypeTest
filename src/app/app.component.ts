import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { ElectronService } from "app/providers/electron/electron.service";
import { LoggerService } from "app/providers/logging/logger.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(public electronService: ElectronService,
    private logger: LoggerService,
    private translateService: TranslateService) {

    translateService.setDefaultLang("en");

    if (electronService.isElectron()) {
      this.logger.debug("Mode electron");
      // Check if electron is correctly injected (see externals in webpack.config.js)
      // this.logger.debug("ipcRenderer", electronService.ipcRenderer);
      // Check if nodeJs childProcess is correctly injected (see externals in webpack.config.js)
      // this.logger.debug("childProcess", electronService.childProcess);
    } else {
      this.logger.debug("Mode web");
    }
  }
}
