import { IMidwayApplication } from '@midwayjs/core';
import { App, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { validate } from 'class-validator';
import { current } from 'node-zone';
import { ValidateException } from '../../exception/validate-exception';
import { ISendOptions, IUnitOfWork } from '../../interface';
import { RepositoryManager } from '../../repository/manager';
import { SuperCommand, SuperCommandExecutor } from '../cqrs/command';
import { MongoUnitOfWork } from '../other/mongo-uow';

export interface ICommandBus {
  executorMap: Map<new () => SuperCommand, new () => SuperCommandExecutor>;
  /**
   * 订阅命令
   */
  subscribe<C extends SuperCommand, E extends SuperCommandExecutor>(
    commandClazz: new () => C,
    executorClazz: new () => E
  ): void;
  /**
   * 发送命令
   * @param command
   */
  send<C extends SuperCommand>(
    command: C,
    options: ISendOptions
  ): Promise<void>;

  index: number;
}

/**
 * 命令总线
 * 职责:
 * 1)负责管理命令执行者订阅命令
 * 2)发送命令给命令执行者执行
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CommandBus implements ICommandBus {
  index: number;
  @App()
  app: IMidwayApplication;

  @Init()
  init(): void {
    this.index = 0;
  }

  //收集归纳命令执行者
  executorMap: Map<new () => SuperCommand, new () => SuperCommandExecutor> =
    new Map<new () => SuperCommand, new () => SuperCommandExecutor>();

  //订阅命令
  subscribe<C extends SuperCommand, E extends SuperCommandExecutor>(
    commandClazz: new () => C,
    executorClazz: new () => E
  ): void {
    if (!this.executorMap.has(commandClazz)) {
      this.executorMap.set(commandClazz, executorClazz);
    } else {
      throw new Error(
        `命令<${commandClazz.name}>存在多个执行者[${
          this.executorMap.get(commandClazz).name
        },${executorClazz.name}]`
      );
    }
  }
  async send<C extends SuperCommand>(
    command: C,
    options: ISendOptions
  ): Promise<void> {
    //执行命令之前验证命令有效性
    const _validateOption = {
      forbidUnknownValues: true,
      always: true,
      strictGroups: true
    };

    const errors = await validate(command, _validateOption);
    if (errors.length > 0) {
      throw new ValidateException(errors);
    }

    //从Map中查找命令执行者
    const keys = this.executorMap.keys();
    const container = this.app.getApplicationContext();
    for (const key of keys) {
      if (command instanceof key) {
        const executorClazz = this.executorMap.get(key);
        const zone = current.fork(command.commandId);
        const uow: IUnitOfWork = await container.getAsync(MongoUnitOfWork); //创建工作单元
        zone.data.uow = uow; //缓存工作单元
        zone.data.dbKey = options.dbKey;
        return new Promise((resolve, reject) => {
          zone.run(async () => {
            try {
              const executor = await container.getAsync(executorClazz);
              const repositoryManager: RepositoryManager =
                await container.getAsync(RepositoryManager);
              await executor.init(repositoryManager); //初始化命令执行者
              await executor.executeCommand(command); //执行命令
              await repositoryManager.commit(); //执行仓储持久化//执行仓储持久化
              await uow.commit(); //提交工作单元 即 提交事务
              resolve(null);
            } catch (e) {
              await uow.abort(); //回滚工作单元 即 回滚事务
              reject(e);
            }
          });
        });
      }
    }
    throw new Error('找不到该命令的执行者');
  }
}
