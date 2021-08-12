import { Init, Inject } from '@midwayjs/decorator';
import { CommandBus } from '../bus/command-bus';
import { QueryBus } from '../bus/query-bus';
import { ILogger } from '@midwayjs/logger';
import { HttpHelper } from '../../common/http-helper';
import { IMidwayContext } from '@midwayjs/core';
import { QueryUtil } from '../cqrs/common-query';
export class SuperController {
  httpHelper: HttpHelper;

  commandBus: CommandBus;

  queryBus: QueryBus;

  logger: ILogger; // 获取上下文日志

  queryUtil: QueryUtil;

  @Inject()
  ctx: IMidwayContext;

  @Init()
  async init(): Promise<void> {
    this.commandBus = await this.ctx.requestContext.getAsync(CommandBus);
    this.queryBus = await this.ctx.requestContext.getAsync(QueryBus);
    this.httpHelper = await this.ctx.requestContext.getAsync(HttpHelper);
    this.queryUtil = await this.ctx.requestContext.getAsync(QueryUtil);
    this.logger = this.ctx.logger;
  }
}
