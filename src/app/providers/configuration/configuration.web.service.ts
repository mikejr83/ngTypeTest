import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import * as _ from "lodash";

import { IElectronConfiguration } from "app/../../electron/configuration/electron";
import { EVENTS } from "app/../../electron/constants";
import { ConfigurationService } from "app/providers/configuration/configuration.service";

@Injectable()
export class ConfigurationWebService extends ConfigurationService {
  private loadingConfigPromise: Promise<IElectronConfiguration>;
  constructor(private http: HttpClient) {
    super();
  }

  public async loadConfig(): Promise<IElectronConfiguration> {
    if (!this.loadingConfigPromise) {
      this.loadingConfigPromise = new Promise<IElectronConfiguration>((resolve, reject) =>{
        this.http.get("./appConfiguration").subscribe((config: IElectronConfiguration) => {
          this.loadingConfigPromise = null;
          this.configuration = _.cloneDeep(config);
          resolve(this.configuration);
        }, error => {
          console.log(error);
        });
      });
    }

    return this.loadingConfigPromise;
  }

  public async saveCurrentConfig(): Promise<void> {
    console.log("saving!");
    this.http.post("./appConfiguration", this.configuration).subscribe((res) => {
      console.log(res);
    }, (error) => {
      console.error(error);
    });
  }
}
