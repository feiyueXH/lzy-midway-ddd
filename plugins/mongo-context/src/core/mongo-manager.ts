import { IMongoManager } from '../interface';
import { App, Autoload, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { IMidwayApplication } from '@midwayjs/core';
import { MongoContext } from './mongo-context';
@Autoload()
@Provide()
@Scope(ScopeEnum.Singleton)
export class MongoManager implements IMongoManager {
  @App()
  app: IMidwayApplication;

  async getContext(key: string): Promise<MongoContext> {
    const mongoContext = await this.app
      .getApplicationContext()
      .getAsync(MongoContext);
    return mongoContext.switchDatabase(key);
  }
}
