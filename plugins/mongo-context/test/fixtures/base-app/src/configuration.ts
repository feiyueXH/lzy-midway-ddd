import { Config, Configuration } from '@midwayjs/decorator';
import * as mongoContext from '../../../../src';
import { join } from 'path';
import { TestService } from './service/test';
import { IMidwayContainer } from '@midwayjs/core';
import { IMongoConfig, MongoContext } from '../../../../src';

@Configuration({
  imports: [mongoContext],
  importConfigs: [join(__dirname, 'config')]
})
export class AutoConfiguration {
  @Config('mongoConfig')
  mongoConfig: IMongoConfig;

  async onReady(container: IMidwayContainer) {
    await MongoContext.createConnection(this.mongoConfig);

    const service: TestService = await container.getAsync('testService');
    service.sayHello();
    // await service.createUser('1234561234', '1234561234');
    await service.listUser();
  }
}
