import * as _ from 'lodash';
import { setup } from 'f-mocha';
import { expect } from 'chai';

setup();

import { CommonDbDoa, IMongoConfig } from '../dbDao/commonDbDao';

interface dbTestInterface {
  _id?: string;
  content: string;
  object: Object;
}

const testObject = {
  _id: 'test',
  content: 'content',
  object: {
    dun: 'no',
  }
}

const mongoConfig: IMongoConfig = {
  host: 'localhost',
  port: 27017,
  database: 'caradhras_test',
}

const testDbDao: CommonDbDoa<dbTestInterface> = new CommonDbDoa(mongoConfig, 'test');

describe('> Caradhras-common', function () {
  
  before(() => {
    testDbDao.init();
  })
  
  beforeEach(() => {
    testDbDao.deleteMany();
  });

  describe('> With an empty database', () => {
    it('> Expect get to throw a CommonDbError', () => {
      expect(() => { testDbDao.get(); }).to.throw();
    });

    it('> Expect list to throw a CommonDbError', () => {
      expect(() => { testDbDao.list({'_id': 'notExisting'}); }).to.not.throw();
    });

    it('> Expect delete to not throw', () => {
      expect(() => { testDbDao.delete({'_id': 'notExisting'}); }).to.not.throw();
    });

    it('> Expect insert to succeed', () => {
      expect(() => { testDbDao.insert(testObject); }).to.not.throw();
      expect(testDbDao.get()).to.be.deep.equal(testObject);
    });
  });
});