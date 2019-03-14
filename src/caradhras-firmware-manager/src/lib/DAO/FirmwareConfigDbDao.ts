import { AbstractDbDao, IFirmwareDbSchema, IMongoConfig } from '../../../../caradhras-common';

export class FirmwareManagerConfigDbDao extends AbstractDbDao<IFirmwareDbSchema> {
  constructor (config: IMongoConfig) {
    super(config, 'firmwareManagerConfig');
  }
}