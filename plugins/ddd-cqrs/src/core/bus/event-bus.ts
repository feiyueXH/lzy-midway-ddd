import { App, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { IMidwayApplication } from '@midwayjs/core';
import { DomainEvent, DomainEventHandler } from '../domain/event';
import { IPublishOptions } from '../../interface';

/**
 * 事件总线接口,用于处理订阅缓存和发布处理 一般用于类型来使用
 */
export interface IEventBus {
  handlerMap: Map<new () => DomainEvent, (new () => DomainEventHandler)[]>;
  subscribe<E extends DomainEvent, H extends DomainEventHandler>(
    evtClazz: new () => E,
    evtHandler: new () => H
  ): void;
  publish(evt: DomainEvent, options: IPublishOptions): Promise<void>;
}

/**
 * 事件总线,用于处理订阅缓存和发布处理 整个进程只有一个实例
 */
@Provide()
@Scope(ScopeEnum.Singleton) //作用域设置全局唯一
export class EventBus implements IEventBus {
  @App()
  app: IMidwayApplication;

  handlerMap: Map<
    new () => DomainEvent,
    (new () => DomainEventHandler)[]
  > = new Map<new () => DomainEvent, (new () => DomainEventHandler)[]>();

  public subscribe<E extends DomainEvent, H extends DomainEventHandler>(
    evtClazz: new () => E,
    evtHandler: new () => H
  ): void {
    if (!this.handlerMap.has(evtClazz)) {
      this.handlerMap.set(evtClazz, new Array<new () => DomainEventHandler>());
    }

    this.handlerMap.get(evtClazz).push(evtHandler);
  }

  public async publish(
    evt: DomainEvent,
    options: IPublishOptions
  ): Promise<void> {
    const keys = this.handlerMap.keys();
    let hasHandler = false;
    for (const key of keys) {
      if (evt instanceof key) {
        const eventHandlers = this.handlerMap.get(key);
        hasHandler = true;
        await this.execHandle(evt, eventHandlers);
        break;
      }
    }
    if (hasHandler === false) {
      console.log('找不到事件处理者');
    }
  }

  private async execHandle(
    evt: DomainEvent,
    eventHandlers: Array<new () => DomainEventHandler>
  ): Promise<void> {
    const container = this.app.getApplicationContext();
    for (const handlerClazz of eventHandlers) {
      const handler = await container.getAsync(handlerClazz);
      console.log('找到事件处理者了', handler);
      await handler.handleEvent(evt);
    }
  }
}
