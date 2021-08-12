import { MongoManager } from '@lzy-plugin/mongo-context';
import { IMidwayApplication } from '@midwayjs/core';
import { App, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { validate } from 'class-validator';
import { ValidateException } from '../../exception/validate-exception';
import { SuperQuery, SuperQueryExecutor } from '../cqrs/query';
import { current } from 'node-zone';
import { ISendOptions } from '../../interface';
export interface IQueryBus {
  executorMap: Map<new () => SuperQuery, new () => SuperQueryExecutor>;
  /**
   * 订阅查询
   */
  subscribe<Q extends SuperQuery, E extends SuperQueryExecutor>(
    queryClazz: new () => Q,
    executorClazz: new () => E
  ): void;
  /**
   * 执行查询
   * @param query
   */
  send<Q extends SuperQuery>(query: Q, options: ISendOptions): Promise<void>;
}

/**
 * 查询总线
 * 职责:
 * 1)负责管理查询执行者订阅查询
 * 2)转发查询,交给查询执行者们处理
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class QueryBus implements IQueryBus {
  @App()
  app: IMidwayApplication;

  @Inject('mongo-context:mongoManager')
  mongoManager: MongoManager;

  //收集归纳查询执行者
  executorMap: Map<new () => SuperQuery, new () => SuperQueryExecutor> =
    new Map<new () => SuperQuery, new () => SuperQueryExecutor>();

  //订阅查询
  subscribe<Q extends SuperQuery, E extends SuperQueryExecutor>(
    queryClazz: new () => Q,
    executorClazz: new () => E
  ): void {
    if (!this.executorMap.has(queryClazz)) {
      this.executorMap.set(queryClazz, executorClazz);
    } else {
      throw new Error(
        `查询<${queryClazz.name}>存在多个执行者[${
          this.executorMap.get(queryClazz).name
        },${executorClazz.name}]`
      );
    }
  }
  async send<Q extends SuperQuery>(
    query: Q,
    options: ISendOptions
  ): Promise<any> {
    //执行查询之前验证查询有效性
    const _validateOption = {
      forbidUnknownValues: true,
      always: true,
      strictGroups: true
    };
    const errors = await validate(query, _validateOption);
    if (errors.length > 0) {
      throw new ValidateException(errors);
    }

    const keys = this.executorMap.keys();
    const container = this.app.getApplicationContext();
    for (const key of keys) {
      if (query instanceof key) {
        const zone = current.fork(query.queryId);
        zone.data.dbKey = options.dbKey;
        return new Promise((resolve, reject) => {
          zone.run(async () => {
            try {
              const executorClazz = this.executorMap.get(key);
              const executor = await container.getAsync(executorClazz);
              await executor.init(this.mongoManager);
              const result = await executor.executeQuery(query);
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    }
    throw new Error('找不到该查询的执行者');
  }
}
