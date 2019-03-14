import { Firmware } from './Firmware';

import { IFirmware, IFirmwareHardware, IFirmwareVersion } from '../../../caradhras-common';
import { FirmwareDbDao } from './DAO/FirmwareDbDao';

export class FirmwareManager {

  private firmwareDbDao: FirmwareDbDao;
  private firmwares: Firmware[];

  constructor () {
    // this.firmwareManagerDbDao = new FirmwareDbDao();

    this.downloadFirmwares();
  }

  public addFirmware (): void {

  }

  public getFirmware (hardware?: IFirmwareHardware, version?: IFirmwareVersion): IFirmware {
    return {} as IFirmware;
  }

  private downloadFirmwares (): void {
  }
}