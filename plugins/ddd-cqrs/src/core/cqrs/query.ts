import { ValidateMessages } from '@lzy-plugin/common';
import { IMongoManager, MongoUtil } from '@lzy-plugin/mongo-context';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

// 查询基类
export interface ISuperQuery {
  queryId: string;
  operatorId: string;
}

// 查询基类
export abstract class SuperQuery implements ISuperQuery {
  constructor(queryId?: string) {
    this.queryId = queryId || MongoUtil.newObjectIdToString();
  }

  queryId: string;

  //操作者编码
  @Expose()
  @IsNotEmpty({
    message: ValidateMessages.base_isNotEmpty
  })
  @IsString({
    message: ValidateMessages.base_isString
  })
  operatorId: string;

  // @Expose()
  // $or?: IMatchItem[];
}

export interface ISuperQueryExecutor {
  executeQuery<Q extends SuperQuery>(query: Q): Promise<any>;

  init(mongoManager: IMongoManager): Promise<any>;
}

/**
 * 查询执行者
 */
export abstract class SuperQueryExecutor implements ISuperQueryExecutor {
  constructor() {}
  abstract init(mongoManager: IMongoManager): Promise<any>;
  abstract executeQuery<Q extends SuperQuery>(query: Q): Promise<any>;
}
