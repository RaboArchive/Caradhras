import * as _ from 'lodash';
import { wait } from 'f-promise'
import { MongoClient, Collection, MongoClientOptions, UpdateManyOptions, UpdateOneOptions, FilterQuery, ObjectID, DeleteWriteOpResultObject } from 'mongodb';

import { CommonDbError } from '../errors/errorCommonDb';

export interface IMongoCredentials {
  username: string;
  pass: string;
}

export interface IMongoConfig {
  host: string;
  port: number;
  database: string;
  credentials?: IMongoCredentials;
  options?: MongoClientOptions;
}

export interface IMongoQuery {
  [key: string]: string;
}

export class AbstractDbDao<T> {

  private readonly config: IMongoConfig;
  private readonly collectionName: string;

  private mongoClient: MongoClient;
  private collection: Collection;

  constructor (config: IMongoConfig, collectionName: string) {
    this.config = config;
    this.collectionName = collectionName;
  }

  public init () {
    let options: MongoClientOptions = _.defaultsDeep(this.config.options, { useNewUrlParser: true });
    this.mongoClient = wait(MongoClient.connect(this.generateURI(), options));
    this.collection = this.mongoClient.db().collection(this.collectionName);
    this.afterInit();
  }

  protected afterInit () {
    // noop
  }

  public disconnect (): void {
    wait(this.mongoClient.close());
  }

  public get (query?: FilterQuery<T>): T;
  public get (query: FilterQuery<T>): T {
    const res = wait(this.collection.findOne(query));
    if (!res) {
      throw new CommonDbError(CommonDbError.CODES.DB_NOT_FOUND);
    }
    return res;
  }

  public list (query: FilterQuery<T> = {}): T[] {
    const res = wait(this.collection.find(query).toArray());
    if (!res) {
      throw new CommonDbError(CommonDbError.CODES.DB_NOT_FOUND);
    }
    return res;
  }

  public insert (data: T): T {
    const res = wait(this.collection.insertOne(data));
    if (res.result.n !== 1 || res.result.ok !== 1) {
      throw new CommonDbError(CommonDbError.CODES.DB_INSERT_FAILED);
    }
    return this.get({ _id: res.insertedId });
  }

  public insertMany (datas: T[]): ObjectID[] {
    const res = wait(this.collection.insertMany(datas));
    if (res.result.n === 0 || res.result.ok !== 1) {
      throw new CommonDbError(CommonDbError.CODES.DB_INSERT_FAILED);
    }
    return _.map(res.insertedIds, (value) => {
      return value;
    });
  }

  public findOneAndUpdate (query: FilterQuery<T>, object: any, updateOptions?: UpdateOneOptions): T {
    const res = wait(this.collection.findOneAndUpdate(query, object, updateOptions));
    if (res.ok !== 1) {
      throw new CommonDbError(CommonDbError.CODES.DB_UPDATE_FAILED);
    }
    return res.value;
  }

  public updateMany (query: FilterQuery<T>, object: any, updateOptions?: UpdateManyOptions): T[] {
    const res = wait(this.collection.updateMany(query, object, updateOptions));
    if (res.result.ok !== 1 ) {
      throw new CommonDbError(CommonDbError.CODES.DB_UPDATE_FAILED);
    }
    return this.list(query);
  }

  public delete (query: FilterQuery<T>): DeleteWriteOpResultObject  {
    return wait(this.collection.deleteOne(query));
  }

  public deleteMany (query?: FilterQuery<T>): DeleteWriteOpResultObject;
  public deleteMany (query: FilterQuery<T>):  DeleteWriteOpResultObject {
    return wait(this.collection.deleteMany(query));
  }

  private generateURI (): string {
    let userWithPassword: string | undefined = '';
    if (this.config.credentials) {
      userWithPassword = `${this.config.credentials.username}:${this.config.credentials.pass}@`
    }
    return `mongodb://${userWithPassword}${this.config.host}:${this.config.port}/${this.config.database}`
  }
}