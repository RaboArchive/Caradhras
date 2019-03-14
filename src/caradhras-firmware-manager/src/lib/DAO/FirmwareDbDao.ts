import { AbstractDbDao, IFirmwareDbSchema, IMongoConfig } from '../../../../caradhras-common';

export class FirmwareDbDao extends AbstractDbDao<IFirmwareDbSchema> {
  constructor (config: IMongoConfig) {
    super(config, 'firmware');
  }
}