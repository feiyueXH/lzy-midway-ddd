import { Configuration } from '@midwayjs/decorator';
import { join } from 'path';
import { IMidwayContainer } from '@midwayjs/core';

@Configuration({
  namespace: 'common',
  importConfigs: [join(__dirname, 'config')]
})
export class AutoConfiguration {
  async onReady(container: IMidwayContainer, app) {}
}
