import _ from 'lodash';
import { setup } from 'f-mocha';
import { expect } from 'chai';

import { IMongoConfig } from './../../../caradhras-common';
import { FirmwareDbDao } from './../lib/DAO/FirmwareDbDao';
import { Firmware } from './../lib/Firmware';
import { FirmwareManager } from './../../src/lib/FirmwareManager';

setup();

const mongoConfig: IMongoConfig = {
  host: 'localhost',
  port: 27017,
  database: 'caradhras_test',
};

const testFirmware: Firmware = new Firmware('0.0.1', 'N/A', Buffer.from([0x01, 0xff, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x00]));

describe.only('FirmwareManager', () => {
  let firmwareManager: FirmwareManager;
  let firmwareDbDao: FirmwareDbDao;

  before(() => {
    firmwareManager = new FirmwareManager(mongoConfig);
    firmwareDbDao = new FirmwareDbDao(mongoConfig, 'firmware');
    firmwareDbDao.init();
  });

  after(() => {
    (firmwareManager as any).getFirmwareDbDao().disconnect();
    (firmwareDbDao as any).disconnect();
  })

  describe('> With no firmware in cache', () => {
    it('> Should not find a firmware in cache', () => {
      const cachedFirmware = (firmwareManager as any).getFirmwareInCache('Noth', 'ing');
      expect(cachedFirmware).to.be.undefined;
    });
  });
  describe('> With a firmware in cache and nothing in db', () => {
    before(() => {
      (firmwareManager as any).setFirmware(testFirmware);
    })
    after(() => {
      (firmwareManager as any).purgeCache();
    });
    it('> setFirmware & getFirmwareInCache should have inserted Firmware in cache', () => {
      const cachedFirmware = (firmwareManager as any).getFirmwareInCache(testFirmware.getHardware(), testFirmware.getVersion());
      expect(cachedFirmware).to.be.not.undefined;
      expect(cachedFirmware).to.be.deep.equal(testFirmware);
    });

    it('> getFirmware should pick firmware from cache', () => {
      const cachedFirmware = firmwareManager.getFirmware(testFirmware.getHardware(), testFirmware.getVersion());
      expect(cachedFirmware).to.be.not.undefined;
      expect(cachedFirmware).to.be.deep.equal(testFirmware);
    });
  });
  describe('> With no firmware in cache and one in db', () => {
    let newFirmwareManager: FirmwareManager;
    before(() => {
      firmwareDbDao.insertFirmware(testFirmware);
      newFirmwareManager = new FirmwareManager(mongoConfig);
    });
    after(() => {
      (firmwareDbDao as any).deleteFirmware(testFirmware.getHardware(), testFirmware.getVersion());
      (newFirmwareManager as any).getFirmwareDbDao().disconnect();
    });
    it('> getFirmware should get firmware from db and cache it', () => {
      const cachedFirmware = (firmwareManager as any).getFirmwareInCache(testFirmware.getHardware(), testFirmware.getVersion());
      expect(cachedFirmware).to.be.undefined;

      const savedFirmware = firmwareManager.getFirmware(testFirmware.getHardware(), testFirmware.getVersion());
      expect(savedFirmware).to.be.not.undefined;
      expect(savedFirmware).to.be.deep.equal(testFirmware);

      const newlyCachedFirmware = (firmwareManager as any).getFirmwareInCache(testFirmware.getHardware(), testFirmware.getVersion());
      expect(newlyCachedFirmware).to.be.not.undefined;
      expect(newlyCachedFirmware).to.be.deep.equal(testFirmware);
    });
  });
});