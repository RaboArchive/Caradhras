import * as _ from 'lodash';
import { setup } from 'f-mocha';
import {run, wait} from 'f-promise';
import { expect } from 'chai';

setup();

import { CommonDbDoa, IMongoConfig } from '../dbDao/commonDbDao';

interface dbTestInterface {
  _id?: string;
  content: string;
  object: Object;
}

const testObject = {
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

describe('> Caradhras-common', function () {
  this.timeout(3000);
  let testDbDao: CommonDbDoa<dbTestInterface> = new CommonDbDoa(mongoConfig, 'test');
  
  before(() => {
    testDbDao.init();
  })
  it('> Expect to insert a document and to get it', () => {
      console.log('origin', testObject);
      testDbDao.insert(testObject);
      let obj = testDbDao.get();
      console.log('get', obj);
      console.log('origin', testObject);
      expect(_.omit(obj, ['_id'])).to.be.deep.equal(testObject);
      testDbDao.delete({_id: obj._id});
  })
});