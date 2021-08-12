// import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { IMidwayContext } from '@midwayjs/core';
import { Inject, Provide } from '@midwayjs/decorator';
import { ExceptionCodeEnum } from '@lzy-plugin/common';

export interface IHttpResult {
  code: string;
  message: string;
  data: any;
  label: string;
}

export interface IHttpContext extends IMidwayContext {
  body: IHttpResult;
  status: number;
}

@Provide()
export class HttpHelper {
  @Inject()
  private ctx: IHttpContext;
  /**
   * 处理成功响应
   * @param ctx
   * @param result
   * @param message
   * @param status
   */
  public success(result: any = null, message = 'OK', status = 200): void {
    this.ctx.body = {
      code: ExceptionCodeEnum.SUCCESS.code,
      message,
      data: result,
      label: ExceptionCodeEnum.SUCCESS.label
    };
    this.ctx.status = status;
  }

  //没有error，所有错误都是throw new BaseException(BaseExceptionCode.*)抛出异常,在全局错误处理中间件中处理
}
