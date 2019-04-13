import _ from 'lodash';
import { setup } from 'f-mocha';
import { expect } from 'chai';

import { IMongoConfig, IFirmware } from '../..';
import { Firmware } from '../../../caradhras-firmware-manager/src/lib/Firmware';
import { FirmwareDbDao } from '../dbDao/FirmwareDbDao';
import { MongoDbUtils } from '../tools/mongoDbUtils';

setup();

const mongoConfig: IMongoConfig = {
  host: 'localhost',
  port: 27017,
  database: 'caradhras_test',
};

const firmwareDbDao: FirmwareDbDao = new FirmwareDbDao(mongoConfig, 'firmware_test');
let mongoDbUtils: MongoDbUtils = new MongoDbUtils(mongoConfig);

describe('FirmwareDbDao', () => {
  let firmware: Firmware;
  before(() => {
    firmwareDbDao.init();
    mongoDbUtils.init();
    firmware = new Firmware('0.0.1', 'A', Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05]));
  });

  after(() => {
    (firmwareDbDao as any).deleteMany();
    (firmwareDbDao as any).disconnect();
  });

  describe('> with an empty database', () => {
    afterEach(() => {
      (firmwareDbDao as any).deleteMany();
    });

    it('> should throw getting no firmware', () => {
      expect(() => firmwareDbDao.getFirmware('noth', 'ing')).to.throw();
    });

    it('> should insert the given firmware', () => {
      expect(() => firmwareDbDao.insertFirmware(firmware)).to.not.throw();
      const insertedFirmware: IFirmware = firmwareDbDao.getFirmware(firmware.getHardware(), firmware.getVersion());
      expect(insertedFirmware.hardware).to.be.equal(firmware.getHardware());
      expect(insertedFirmware.version).to.be.equal(firmware.getVersion());
      expect(insertedFirmware.buffer).to.be.deep.equal(firmware.getFirmware());
    });    
  });

  describe('> with a firmware set in the database', () => {
    before(() => {
      firmwareDbDao.insertFirmware(firmware);
    });

    it('> should get the correct firmware', () => {
      const insertedFirmware: IFirmware = firmwareDbDao.getFirmware(firmware.getHardware(), firmware.getVersion());
      expect(insertedFirmware.hardware).to.be.equal(firmware.getHardware());
      expect(insertedFirmware.version).to.be.equal(firmware.getVersion());
      expect(insertedFirmware.buffer).to.be.deep.equal(firmware.getFirmware());
    });

    it('> should delete the firmware', () => {
      (firmwareDbDao as any).deleteFirmware(firmware.getHardware(), firmware.getVersion());
      expect(() => firmwareDbDao.getFirmware(firmware.getHardware(), firmware.getVersion())).to.throw();
    });
  });
});