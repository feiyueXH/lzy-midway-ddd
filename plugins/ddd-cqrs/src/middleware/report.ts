import { App, Logger, Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { ExceptionCodeEnum } from '@lzy-plugin/common';
import { Application, Context } from 'egg';
import { CommonException } from '../exception/common-exception';
import { ILogger } from '@midwayjs/logger';
@Provide()
export class ReportMiddleware implements IWebMiddleware {
  @App()
  app: Application;

  @Logger()
  logger: ILogger;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext): Promise<void> => {
      let body = ctx.request.body ? ctx.request.body : {};
      const userInfo = ctx.cookies.get('userInfo', {
        signed: process.env.NODE_ENV === 'production' ? true : false
      });
      body = {
        ...body,
        operatorId: userInfo ? JSON.parse(userInfo).userId : undefined
      };
      ctx.request.body = body;
      // const common_query = ctx?.request?.query?.common_query;
      // if (common_query === 'true') {
      //   const query = parseQuery(querystring.encode(ctx.request.query));
      //   console.log('query:', query);
      //   ctx.request.query = query;
      // }

      if (
        !/login|logout|register|verificationCodes|swagger-ui/.test(ctx.path) &&
        !ctx.request.body.operatorId
      ) {
        throw new CommonException(
          ExceptionCodeEnum.NO_PERMISSION,
          '无权限',
          401
        );
      }

      await next();
    };
  }
}
