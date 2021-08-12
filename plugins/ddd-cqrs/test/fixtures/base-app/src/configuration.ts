import { Config, Configuration } from '@midwayjs/decorator';
import * as dddCqrs from '../../../../src';
import { join } from 'path';
import { IMongoConfig, MongoContext } from '@lzy-plugin/mongo-context';

@Configuration({
  imports: [dddCqrs],
  importConfigs: [join(__dirname, 'config')]
})
export class TestConfiguration {
  @Config('mongoConfig')
  mongoConfig: IMongoConfig;

  async onReady(container) {
    await MongoContext.createConnection(this.mongoConfig);
  }
}
