import { Firmware } from './Firmware';

import { IFirmware, IFirmwareHardware, IFirmwareVersion } from '../../../caradhras-common';
import { FirmwareManagerDbDao } from './FirmwareManagerDbDao';

export class FirmwareManager {

  private firmwareManagerDbDao: FirmwareManagerDbDao;
  private firmwares: Firmware[];

  constructor () {
    this.firmwareManagerDbDao = new FirmwareManagerDbDao();

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