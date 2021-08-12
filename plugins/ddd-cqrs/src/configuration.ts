// src/configuration.ts
import {
  App,
  Configuration,
  getClassMetadata,
  Inject,
  listModule
} from '@midwayjs/decorator';
import * as mongoContext from '@lzy-plugin/mongo-context';
import * as common from '@lzy-plugin/common';
import { join } from 'path';
import { IMidwayContainer } from '@midwayjs/core';
import { ICommandBus } from './core/bus/command-bus';
import { IEventBus } from './core/bus/event-bus';
import { IQueryBus } from './core/bus/query-bus';
import * as bodyParser from 'koa-bodyparser';
import { IMidwayWebApplication } from '@midwayjs/web';
@Configuration({
  imports: [mongoContext, common],
  namespace: 'ddd-cqrs',
  importConfigs: [join(__dirname, 'config')]
})
export class DddCqrsConfiguration {
  @Inject()
  commandBus: ICommandBus;

  @Inject()
  eventBus: IEventBus;

  @Inject()
  queryBus: IQueryBus;

  @App()
  app: IMidwayWebApplication;

  async onReady(container: IMidwayContainer) {
    const MODULE_SUBSCRIBECOMMAND_KEY = 'decorator:subscribeCommand';
    // 可以获取到所有装饰了 @SubscribeCommand 装饰器的 class
    const commandModules = listModule(MODULE_SUBSCRIBECOMMAND_KEY);
    for (const mod of commandModules) {
      const metaData = getClassMetadata(MODULE_SUBSCRIBECOMMAND_KEY, mod);
      if (metaData.cmdArray instanceof Array) {
        for (const cmdClazz of metaData.cmdArray) {
          this.commandBus.subscribe(cmdClazz, mod);
        }
      }
    }
    const MODULE_SUBSCRIBEEVENT_KEY = 'decorator:subscribeEvent';
    // 可以获取到所有装饰了 @SubscribeEvent 装饰器的 class
    const eventModules = listModule(MODULE_SUBSCRIBEEVENT_KEY);
    for (const mod of eventModules) {
      const metaData = getClassMetadata(MODULE_SUBSCRIBEEVENT_KEY, mod);
      if (metaData.evtArray instanceof Array) {
        for (const evtClazz of metaData.evtArray) {
          this.eventBus.subscribe(evtClazz, mod);
        }
      }
    }
    const MODULE_SUBSCRIBEQUERY_KEY = 'decorator:subscribeQuery';
    // 可以获取到所有装饰了 @SubscribeEvent 装饰器的 class
    const queryModules = listModule(MODULE_SUBSCRIBEQUERY_KEY);
    for (const mod of queryModules) {
      const metaData = getClassMetadata(MODULE_SUBSCRIBEQUERY_KEY, mod);
      if (metaData.queryArray instanceof Array) {
        for (const evtClazz of metaData.queryArray) {
          this.queryBus.subscribe(evtClazz, mod);
        }
      }
    }
    //======挂载全局中间件 start======
    this.app.use(bodyParser());
    this.app.use(
      await this.app.generateMiddleware('ddd-cqrs:errorHandlerMiddleware')
    );
    this.app.use(
      await this.app.generateMiddleware('ddd-cqrs:reportMiddleware')
    );
    //======挂载全局中间件 end======
  }
}
