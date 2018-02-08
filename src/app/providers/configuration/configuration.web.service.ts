import { Injectable } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";

import { IElectronConfiguration } from "app/../../electron/configuration/electron";
import { EVENTS } from "app/../../electron/constants";
import { ConfigurationService } from "app/providers/configuration/configuration.service";

@Injectable()
export class ConfigurationWebService extends ConfigurationService {

  constructor() {
    super();
    this.configuration = {
      lastUsername: null,
      logLevel: "silly",
      serve: false,
      showDebugTools: false
    }
  }

  public async saveCurrentConfig(): Promise<void> {

  }
}
