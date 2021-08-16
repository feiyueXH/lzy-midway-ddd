import { App, Config, Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';
import { join } from 'path';
import * as user from '@lzy-component/user';
import { IMongoConfig, MongoContext } from '@lzy-plugin/mongo-context';
import * as swagger from '@midwayjs/swagger';
@Configuration({
  importConfigs: [join(__dirname, './config')],
  imports: [user, swagger],
  conflictCheck: true,
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  @Config('mongoConfig')
  mongoConfig: IMongoConfig;

  async onReady(): Promise<void> {
    await MongoContext.createConnection(this.mongoConfig);
  }
}
