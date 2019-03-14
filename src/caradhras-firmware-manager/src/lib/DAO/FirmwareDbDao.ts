import * as _ from 'lodash';
import { AbstractDbDao, IFirmwareDbSchema, IMongoConfig, IFirmware } from '../../../../caradhras-common';

export class FirmwareDbDao extends AbstractDbDao<IFirmwareDbSchema> {
  constructor (config: IMongoConfig) {
    super(config, 'firmware');
  }

  public getFirmware(hardware: string, version: string): IFirmware {
    const firmware: IFirmwareDbSchema = this.get({hardware, version});
    return _.omit(firmware, '$info') as IFirmware;
  }
}