// src/configuration.ts
import { Configuration } from '@midwayjs/decorator';
import { join } from 'path';
import * as mongoContext from '@lzy-plugin/mongo-context';
import * as ddd_cqrs from '@lzy-plugin/ddd-cqrs';
import * as swagger from '@midwayjs/swagger';
@Configuration({
  imports: [
    mongoContext,
    ddd_cqrs,
    {
      component: swagger,
      enabledEnvironment: ['local']
    }
  ],
  namespace: 'user',
  importConfigs: [join(__dirname, 'config')]
})
export class AutoConfiguration {
  async onReady(app) {}
}
