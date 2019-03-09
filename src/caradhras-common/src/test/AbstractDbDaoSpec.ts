import * as _ from 'lodash';
import { setup } from 'f-mocha';
import { expect } from 'chai';

setup();

import { AbstractDbDao, IMongoConfig } from '../dbDao/AbstractDbDao';

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

const testDbDao: AbstractDbDao<dbTestInterface> = new AbstractDbDao(mongoConfig, 'test');

describe('> Caradhras-common', function () {
  
  before(() => {
    testDbDao.init();
  })

  after(() => {
    testDbDao.deleteMany();
    testDbDao.disconnect();
  })
  
  
  describe('> With an empty database', () => {
    beforeEach(() => {
      testDbDao.deleteMany();
    });

    it('> Expect get to throw a CommonDbError', () => {
      expect(() => { testDbDao.get(); }).to.throw();
    });

    it('> Expect list to throw a CommonDbError', () => {
      expect(() => { testDbDao.list({'_id': 'notExisting'}); }).to.not.throw();
    });

    it('> Expect delete to not throw', () => {
      expect(() => { testDbDao.delete({'_id': 'notExisting'}); }).to.not.throw();
    });

    it('> Expect deleteMany to not throw', () => {
      expect(() => { testDbDao.deleteMany({}); }).to.not.throw();
    });

    it('> Expect insert to succeed', () => {
      expect(() => { testDbDao.insert(testObjects[0]); }).to.not.throw();
      expect(testDbDao.get()).to.be.deep.equal(testObjects[0]);
    });
    
    it('> Expect insertMany to succeed', () => {
      expect(() => { testDbDao.insertMany(testObjects) }).to.not.throw();
      expect(testDbDao.list()).to.be.deep.equal(testObjects);
    });

    it('> Expect findOneAndUpdate to not throw', () => {
      expect(() => { testDbDao.findOneAndUpdate({_id: 'unknown'}, {$set: { cc: 'me' } }) }).to.not.throw();
    });

    it('> Expect updateMany to not throw', () => {
      expect(() => { testDbDao.updateMany({}, {$set: { cc: 'me' } }) }).to.not.throw();
    });

  });

  describe('> With one document in the database', () => {
    let insertedObject = _.first(testObjects);
    beforeEach(() => {
      testDbDao.deleteMany();
      testDbDao.insert(insertedObject);
    });

    it('> Expect get to not throw and return the same object', () => {
      expect(() => { testDbDao.get({_id: insertedObject._id}); }).to.not.throw();
      const result = testDbDao.get({_id: insertedObject._id});
      expect(result).to.be.deep.equal(insertedObject);
    });

    it('> Expect get to not throw and return the same objects', () => {
      expect(() => { testDbDao.list({_id: insertedObject._id}); }).to.not.throw();
      const result = testDbDao.list({_id: insertedObject._id});
      expect(result).to.be.deep.equal([insertedObject]);
    });

    it('> Expect delete to not throw', () => {
      expect(() => { testDbDao.delete({_id: insertedObject._id}); }).to.not.throw();
      expect(() => { testDbDao.get({_id: insertedObject._id}); }).to.throw();
    });

    it('> Expect deleteMany to not throw', () => {
      expect(() => { testDbDao.deleteMany({}); }).to.not.throw();
      expect(() => { testDbDao.get({_id: insertedObject._id}); }).to.throw();
    });

    it('> Expect insert to throw', () => {
      expect(() => { testDbDao.insert(testObjects[0]); }).to.throw();
    });
    
    it('> Expect insertMany to throw', () => {
      expect(() => { testDbDao.insertMany(testObjects) }).to.throw();
    });

    it('> Expect findOneAndUpdate to not throw', () => {
      expect(() => { testDbDao.findOneAndUpdate({_id: insertedObject._id}, {$set: { cc: 'me' } }) }).to.not.throw();

    });

    it('> Expect updateMany to not throw', () => {
      expect(() => { testDbDao.updateMany({}, {$set: { cc: 'me' } }) }).to.not.throw();
    });
  });
});