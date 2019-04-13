import * as _ from "lodash";

import { AbstractApplication } from "../caradhrasCommon";
import { FirmwareDispenserService } from "../caradhrasFirmwareDispenser";

import { ICaradhrasConfig, config, applicationOptions } from "../config";

export class CaradhrasApplication extends AbstractApplication {
  private config: ICaradhrasConfig;
  private applications: AbstractApplication[];
  constructor () {
    super();
    this.config = this.getConfig();
  }

  public startApp () {
    if(this.config.applications.firmwareDispenser.enable) {
      this.applications.push(new FirmwareDispenserService());
    }
    if(this.config.applications.firmwareWebManager.enable) {
      // TODO
    }
    this.applications.forEach((application) => {
      application.startApp();
    });
  }

  private getConfig (): ICaradhrasConfig {
    return config;
  }
}