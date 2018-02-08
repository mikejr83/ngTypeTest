import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Form } from "@angular/forms";

import { TranslateService } from "@ngx-translate/core";

import * as _ from "lodash";

import { IElectronConfiguration } from "../../../../../electron/configuration/electron";
import { defaultConfiguration } from "../../../../../electron/configuration/user";
import { IUser } from "../../../../../electron/user/user";

import { ConfigurationService } from "app/providers/configuration/configuration.service";
import { LoggerService } from "app/providers/logging/logger.service";
import { UserService } from "app/providers/user/user.service";


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
  public debugLevels: DebugLevel[] = [
    {
      code: "silly",
      displayName: "Silly"
    },
    {
      code: "debug",
      displayName: "Debug"
    },
    {
      code: "info",
      displayName: "Info"
    },
    {
      code: "warn",
      displayName: "Warn"
    },
    {
      code: "error",
      displayName: "Error"
    }
  ];
  public currentUser: IUser;
  public currentElectron: IElectronConfiguration;
  public saving: boolean = false;

  constructor(private loggerService: LoggerService,
    private translateService: TranslateService,
    public configurationService: ConfigurationService,
    public userService: UserService) {
  }

  ngOnInit() {
    if (this.userService.user) {
      this.loggerService.debug("current user from service", this.userService.user);
      this.currentUser = _.cloneDeep(this.userService.user);
    } else if (this.configurationService.configuration.lastUsername) {
      this.loggerService.debug("The user service doesn't have a user. Trying to get it from the last username.");
      this.userService.loadUser(this.configurationService.configuration.lastUsername).then((user) => {
        this.currentUser = _.cloneDeep(user);
        this.loggerService.debug("current user from direct load call.", this.currentUser);
      });
    }

    this.currentElectron = _.cloneDeep(this.configurationService.configuration);;
  }

  public async onSubmit(form: Form) {
    console.log(form);
    this.saving = true;
    await this.userService.editUser(this.currentUser);
    await this.userService.loginUser(this.currentUser.username);

    _.extend(this.configurationService.configuration, this.currentElectron);
    await this.configurationService.saveCurrentConfig();

    this.saving = false;
  }

  public languageChanged() {
    this.loggerService.debug("The language selection changed. Going to update the UI culture.");
    this.translateService.use(this.currentUser.configuration.culture);
  }

  public debugLevelChanged() {

  }
}

interface Culture {
  displayName: string;
  cultureCode: string;
}

interface DebugLevel {
  displayName: string;
  code: string;
}
