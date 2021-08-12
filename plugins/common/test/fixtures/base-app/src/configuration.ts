import { Configuration } from '@midwayjs/decorator';
import { join } from 'path';
import { IMidwayContainer } from '@midwayjs/core';
import * as common from '../../../../src';
@Configuration({
  imports: [common],
  importConfigs: [join(__dirname, 'config')]
})
export class AutoConfiguration {
  async onReady(container: IMidwayContainer) {
    // console.log('container:', container);
  }
}
