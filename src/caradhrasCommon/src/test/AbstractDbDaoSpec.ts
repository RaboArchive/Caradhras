import * as _ from 'lodash';
import { setup } from 'f-mocha';
import { expect } from 'chai';

import { AbstractDbDao, IMongoConfig } from '../Abstract/Dao/AbstractDbDao';

setup();

interface DbTestInterface {
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
}];

const mongoConfig: IMongoConfig = {
  host: 'localhost',
  port: 27017,
  database: 'caradhras_test',
};

const testDbDao: AbstractDbDao<DbTestInterface> = new AbstractDbDao(mongoConfig, 'test');

describe('> Caradhras-common', function () {

  before(() => {
    (testDbDao as any).init();
  });

  after(() => {
    (testDbDao as any).drop();
    (testDbDao as any).disconnect();
  });

  describe('> With an empty database', () => {
    beforeEach(() => {
      (testDbDao as any).deleteMany();
    });

    it('> Expect index creation to not throw', () => {
      const indexes = [{
        key: { content: 1 },
        name: 'content_uniq',
        unique: true,
      }];
      expect(() => (testDbDao as any).createIndexes(indexes)).to.not.throw();
    });

    it('> Expect get to throw a CommonDbError', () => {
      expect(() => { (testDbDao as any).get(); }).to.throw();
    });

    it('> Expect list to throw a CommonDbError', () => {
      expect(() => { (testDbDao as any).list({'_id': 'notExisting'}); }).to.not.throw();
    });

    it('> Expect delete to not throw', () => {
      expect(() => { (testDbDao as any).delete({'_id': 'notExisting'}); }).to.not.throw();
    });

    it('> Expect deleteMany to not throw', () => {
      expect(() => { (testDbDao as any).deleteMany({}); }).to.not.throw();
    });

    it('> Expect insert to succeed', () => {
      expect(() => { (testDbDao as any).insert(testObjects[0]); }).to.not.throw();
      expect((testDbDao as any).get()).to.be.deep.equal(testObjects[0]);
    });

    it('> Expect insertMany to succeed', () => {
      expect(() => { (testDbDao as any).insertMany(testObjects); }).to.not.throw();
      expect((testDbDao as any).list()).to.be.deep.equal(testObjects);
    });

    it('> Expect findOneAndUpdate to not throw', () => {
      expect(() => { (testDbDao as any).findOneAndUpdate({_id: 'unknown'}, {$set: { cc: 'me' } }); }).to.not.throw();
    });

    it('> Expect updateMany to not throw', () => {
      expect(() => { (testDbDao as any).updateMany({}, {$set: { cc: 'me' } }); }).to.not.throw();
    });

  });

  describe('> With one document in the database', () => {
    const insertedObject = _.first(testObjects);
    beforeEach(() => {
      (testDbDao as any).deleteMany();
      (testDbDao as any).insert(insertedObject);
    });

    it('> Expect get to not throw and return the same object', () => {
      expect(() => { (testDbDao as any).get({_id: insertedObject._id}); }).to.not.throw();
      const result = (testDbDao as any).get({_id: insertedObject._id});
      expect(result).to.be.deep.equal(insertedObject);
    });

    it('> Expect get to not throw and return the same objects', () => {
      expect(() => { (testDbDao as any).list({_id: insertedObject._id}); }).to.not.throw();
      const result = (testDbDao as any).list({_id: insertedObject._id});
      expect(result).to.be.deep.equal([insertedObject]);
    });

    it('> Expect delete to not throw', () => {
      expect(() => { (testDbDao as any).delete({_id: insertedObject._id}); }).to.not.throw();
      expect(() => { (testDbDao as any).get({_id: insertedObject._id}); }).to.throw();
    });

    it('> Expect deleteMany to not throw', () => {
      expect(() => { (testDbDao as any).deleteMany({}); }).to.not.throw();
      expect(() => { (testDbDao as any).get({_id: insertedObject._id}); }).to.throw();
    });

    it('> Expect insert to throw', () => {
      expect(() => { (testDbDao as any).insert(testObjects[0]); }).to.throw();
    });

    it('> Expect insertMany to throw', () => {
      expect(() => { (testDbDao as any).insertMany(testObjects); }).to.throw();
    });

    it('> Expect findOneAndUpdate to not throw', () => {
      expect(() => { (testDbDao as any).findOneAndUpdate({_id: insertedObject._id}, {$set: { cc: 'me' } }); }).to.not.throw();

    });

    it('> Expect updateMany to not throw', () => {
      expect(() => { (testDbDao as any).updateMany({}, {$set: { cc: 'me' } }); }).to.not.throw();
    });
  });
});