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

const testObjects = [{
  _id: 'test',
  content: 'content',
  object: {
    dun: 'no',
  }
},
{
  _id: 'test2',
  content: 'content2',
  object: {
    dun: 'no2',
  }
}]

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

  after(() => {
    testDbDao.deleteMany();
    testDbDao.disconnect();
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
      expect(() => { testDbDao.insert(testObjects[0]); }).to.not.throw();
      expect(testDbDao.get()).to.be.deep.equal(testObjects[0]);
    });
    
    it('> Expect insertMany to succeed', () => {
      expect(() => { testDbDao.insertMany(testObjects) }).to.not.throw();
      expect(testDbDao.list()).to.be.deep.equal(testObjects);
    });
  });
});