import { ValidateMessages } from '@lzy-plugin/common';
import { MongoUtil } from '@lzy-plugin/mongo-context';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { RepositoryManager } from '../../repository/manager';

export interface ISuperCommand {
  commandId: string;
  operatorId: string;
}

// 命令基类
export abstract class SuperCommand {
  constructor() {
    this.commandId = MongoUtil.newObjectIdToString();
  }

  //命令编码
  commandId: string;

  //操作者编码
  @Expose()
  @IsNotEmpty({
    message: ValidateMessages.base_isNotEmpty
  })
  @IsString({
    message: ValidateMessages.base_isString
  })
  public operatorId: string;
}

export interface ISuperCommandExecutor {
  executeCommand<C extends SuperCommand>(command: C): Promise<void>;
  init(repositoryManager: RepositoryManager): Promise<void>;
}

/**
 * 命令处理类
 */
export abstract class SuperCommandExecutor implements ISuperCommandExecutor {
  public abstract init(repositoryManager: RepositoryManager): Promise<void>;

  public abstract executeCommand<C extends SuperCommand>(
    command: C
  ): Promise<void>;
}
