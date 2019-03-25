import { Firmware } from './Firmware';

import { IFirmware, IMongoConfig } from '../../../caradhras-common';
import { FirmwareDbDao } from './DAO/FirmwareDbDao';

interface IFirmwareSubStructure {
  [version: string]: Firmware;
}
interface IFirmwareStructure {
  [string: string]: IFirmwareSubStructure;
}

export class FirmwareManager {

  private firmwareDbDao: FirmwareDbDao;
  private firmwares: IFirmwareStructure = {};

  constructor (mongoConfig: IMongoConfig) {
    this.firmwareDbDao = new FirmwareDbDao(mongoConfig);
    console.log(this.firmwareDbDao);
  }

  public getFirmware (hardware: string, version: string): Firmware {
    const firmwareInCache = this.isFirmwareInCache(hardware, version);
    if (firmwareInCache) {
      return firmwareInCache;
    }
    const firmware: Firmware = this.generateFirmware(this.firmwareDbDao.getFirmware(hardware, version));
    this.setFirmware(firmware);
    return firmware;
  }

  private isFirmwareInCache (hardware: string, version: string): Firmware|undefined {
    return this.firmwares[hardware] && this.firmwares[hardware][version];
  }

  private generateFirmware (firmware: IFirmware): Firmware {
    return new Firmware(firmware.version, firmware.hardware, firmware.buffer);
  }

  private setFirmware (firmware: Firmware): void {
    if (!this.firmwares[firmware.getHardware()]) {
      this.firmwares[firmware.getHardware()] = {};
    }
    this.firmwares[firmware.getHardware()][firmware.getVersion()] = firmware;
  }
}