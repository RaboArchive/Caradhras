import _ from 'lodash';
import { setup } from 'f-mocha';
import { expect } from 'chai';

import { FirmwareDbDao } from './../lib/DAO/FirmwareDbDao';
import { IMongoConfig, IFirmware } from './../../../caradhras-common';
import { Firmware } from './../lib/Firmware';

setup();

const mongoConfig: IMongoConfig = {
  host: 'localhost',
  port: 27017,
  database: 'caradhras_test',
};

const firmwareDbDao: FirmwareDbDao = new FirmwareDbDao(mongoConfig, 'firmware_test');

describe.only('FirmwareDbDao', () => {
  let firmware: Firmware;
  before(() => {
    firmwareDbDao.init();
    firmware = new Firmware('0.0.1', 'A', Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05]));
  });

  after(() => {
    (firmwareDbDao as any).deleteMany();
    (firmwareDbDao as any).disconnect();
  });

  describe('> with an empty database', () => {
    it('> should throw getting no firmware', () => {
      expect(() => firmwareDbDao.getFirmware('noth', 'ing')).to.throw();
    });

    it('> should insert the given firmware', () => {
      expect(() => firmwareDbDao.insertFirmware(firmware)).to.not.throw();
      const insertedFirmware: IFirmware = firmwareDbDao.getFirmware(firmware.getHardware, firmware.getVersion);
      expect(insertedFirmware.hardware).to.be.equal(firmware.getHardware);
      expect(insertedFirmware.version).to.be.equal(firmware.getVersion);
      expect(insertedFirmware.buffer.buffer).to.be.deep.equal(firmware.getFirmware);
    });
  });
});