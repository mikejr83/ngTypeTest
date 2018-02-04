import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { ElectronService } from "app/providers/electron.service";
import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user.service";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.scss"]
})
export class ConfigurationComponent implements OnInit {

  public cultures: Culture[] = [
    {
      displayName: "English",
      cultureCode: "en"
    },
    {
      displayName: "Español",
      cultureCode: "es"
    }
  ];
  public currentCulture;

  constructor(private loggerService:LoggerService, private translateService: TranslateService, public electronService: ElectronService, public userService: UserService) {
    this.currentCulture = this.electronService.configuration.culture;
    loggerService.debug("Current culture:", this.currentCulture);
   }

  ngOnInit() {
  }

  public languageChanged() {
    // this.loggerService.debug("The culture changed in the editor.", this.currentCulture);
    // this.electronService.configuration.culture = this.currentCulture;
    this.translateService.use(this.electronService.configuration.culture);
  }
}

interface Culture {
  displayName: string;
  cultureCode: string;
}
