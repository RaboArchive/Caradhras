import * as _ from 'lodash';
import { AbstractDbDao, IFirmwareDbSchema, IMongoConfig, IFirmware } from '../../../../caradhras-common';
import { Firmware } from '../Firmware';

export class FirmwareDbDao extends AbstractDbDao<IFirmwareDbSchema> {
  constructor (config: IMongoConfig, collectionName: string = 'firmware') {
    super(config, collectionName);
  }

  public afterInit() {
    /*this.createIndexes([
      {
        key: {
          hardware: 1,
          version: 1,
        },
        name: 'hardwareVersion_Uniq',
        unique: true,
      },
    ]);*/
  }

  public getFirmware(hardware: string, version: string): IFirmware {
    const firmware: IFirmwareDbSchema = this.get({hardware, version});
    // TODO : Fix with something like this to prevent usage of buffer.buffer
    // firmware.buffer = firmware.buffer.buffer;
    return _.omit(firmware, '_info') as IFirmware;
  }

  public insertFirmware(firmware: Firmware): IFirmware {
    const now = new Date();
    const firmwareToInsert: IFirmwareDbSchema = {
      version: firmware.getVersion,
      hardware: firmware.getHardware,
      buffer: firmware.getFirmware,
      _infos: {
        createdAt: now,
        createdBy: 'firmwareManager',
        updatedAt: now,
        updatedBy: 'firmwareManager',
      }
    };
    return _.omit(this.insert(firmwareToInsert), '_info') as IFirmware;
  }
}