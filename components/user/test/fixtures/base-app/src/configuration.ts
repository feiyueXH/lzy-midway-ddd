import { App, Config, Configuration } from '@midwayjs/decorator';
import * as developTemplate from '../../../../src';
import { join } from 'path';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';
import { IMongoConfig, MongoContext } from '@lzy-plugin/mongo-context';

@Configuration({
  imports: [developTemplate],
  importConfigs: [join(__dirname, 'config')]
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
