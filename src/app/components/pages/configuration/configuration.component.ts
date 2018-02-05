import { AfterViewInit, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";

import { defaultConfiguration } from "../../../../../electron/configuration/user";
import { IUser } from "../../../../../electron/user/user";

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
  public currentUser: IUser;
  public saving: boolean = false;

  constructor(private loggerService: LoggerService, private translateService: TranslateService, public electronService: ElectronService, public userService: UserService) {
  }

  ngOnInit() {
    if (this.userService.user) {
      this.loggerService.debug("current user from service", this.userService.user);
      this.currentUser = _.cloneDeep(this.userService.user);
    } else if (this.electronService.configuration.lastUsername) {
      this.loggerService.debug("The user service doesn't have a user. Trying to get it from the last username.");
      this.userService.loadUser(this.electronService.configuration.lastUsername).then((user) => {
        this.currentUser = _.cloneDeep(user);
        this.loggerService.debug("current user from direct load call.", this.currentUser);
      });
    }
  }

  public async onSubmit() {
    this.saving = true;
    await this.userService.editUser(this.currentUser);
    await this.userService.loginUser(this.currentUser.username);
    this.saving = false;
  }

  public languageChanged() {
    this.loggerService.debug("The language selection changed. Going to update the UI culture.");
    this.translateService.use(this.currentUser.configuration.culture);
  }
}

interface Culture {
  displayName: string;
  cultureCode: string;
}
