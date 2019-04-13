import _ from "lodash";
import { wait } from "f-promise";
import { MongoClientOptions, MongoClient } from "mongodb";

import { IMongoConfig } from "../Abstract/Dao/AbstractDbDao";


export class MongoDbUtils {
  config: IMongoConfig;
  mongoClient: MongoClient;
  constructor(config: IMongoConfig) {
    this.config = config;
  }

  public init(): void {
    const options: MongoClientOptions = _.defaultsDeep({}, this.config.options, { useNewUrlParser: true });
    this.mongoClient = wait(MongoClient.connect(this.generateURI(), options));
  }

  public closeAllConnections (): void{
    wait(this.mongoClient.close(true));
  }

  public dropCollection (collection: string): void {
    wait(this.mongoClient.db().dropCollection(collection));
  }


  private generateURI (): string {
    let userWithPassword: string | undefined = '';
    if (this.config.credentials) {
      userWithPassword = `${this.config.credentials.username}:${this.config.credentials.pass}@`;
    }
    return `mongodb://${userWithPassword}${this.config.host}:${this.config.port}/${this.config.database}`;
  }
}