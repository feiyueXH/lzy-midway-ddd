// src/configuration.ts
import {
  App,
  Configuration,
  getClassMetadata,
  listModule
} from '@midwayjs/decorator';

import { join } from 'path';
import { IMidwayApplication, IMidwayContainer } from '@midwayjs/core';
// import { MongoManager } from './core/mongo-manager';
import { MongoContext } from './core/mongo-context';

@Configuration({
  namespace: 'mongo-context',
  importConfigs: [join(__dirname, 'config')]
})
export class AutoConfiguration {
  @App()
  app: IMidwayApplication;

  async onReady(container: IMidwayContainer) {
    // const mongoManager = await container.getAsync(MongoManager);
    //注册全局对象，在其他组件都可以不用使用命名空间前缀直接实例化
    // this.app
    //   .getApplicationContext()
    //   .registerObject('mongoManager', mongoManager);
    //在其他组件使用
    // @Inject()
    // mongoManager:MongoManager
    const MODULE_KEY = 'decorator:typegooseModel';
    // 可以获取到所有装饰了 @SubscribeEvent 装饰器的 class
    const modules = listModule(MODULE_KEY);
    for (const mod of modules) {
      const options = getClassMetadata(MODULE_KEY, mod) || {};
      const item = {
        modelName: options.modelName ? options.modelName : mod.name,
        modelClazz: mod,
        collectionName: options.collectionName
          ? options.collectionName
          : undefined
      };
      MongoContext.addTypegooseClazz(item);
    }
  }
}
