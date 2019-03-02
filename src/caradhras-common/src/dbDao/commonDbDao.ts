import * as _ from 'lodash';
import { wait } from 'f-promise'
import { MongoClient, Collection, MongoClientOptions, UpdateManyOptions, UpdateOneOptions, FilterQuery, UpdateWriteOpResult, InsertWriteOpResult, InsertOneWriteOpResult } from 'mongodb';

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

export class CommonDbDoa<T> {

  private readonly config: IMongoConfig;
  private readonly collectionName: string;
  private URI: string

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

  public insert (toInsert: any): InsertOneWriteOpResult {
    return wait(this.collection.insertOne(toInsert));
  }

  public insertMany (toInsert: any): InsertWriteOpResult {
    return wait(this.collection.insertMany(toInsert));
  }

  public updateOne (query: FilterQuery<T>, object: any, updateOptions: UpdateOneOptions): UpdateWriteOpResult {
    return wait(this.collection.updateOne(query, object, updateOptions));
  }

  public updateMany (query: FilterQuery<T>, object: any, updateOptions: UpdateManyOptions): UpdateWriteOpResult {
    return wait(this.collection.updateMany(query, object, updateOptions));
  }

  public delete (query: FilterQuery<T>) {
    wait(this.collection.deleteOne(query));
  }

  public deleteMany (query?: FilterQuery<T>): any;
  public deleteMany (query: FilterQuery<T>): any {
    wait(this.collection.deleteMany(query));
  }

  private generateURI (): string {
    let userWithPassword: string | undefined = '';
    if (this.config.credentials) {
      userWithPassword = `${this.config.credentials.username}:${this.config.credentials.pass}@`
    }
    return `mongodb://${userWithPassword}${this.config.host}:${this.config.port}/${this.config.database}`
  }
}