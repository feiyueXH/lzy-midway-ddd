import { App, Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { ExceptionCodeEnum } from '@lzy-plugin/common';
import { Application, Context } from 'egg';
import { CommonException } from '../exception/common-exception';
import { ValidateException } from '../exception/validate-exception';

@Provide()
export class ErrorHandlerMiddleware implements IWebMiddleware {
  @App()
  app: Application;
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext): Promise<void> => {
      try {
        await next();
        // //请求执行成功,默认添加状态码
      } catch (err) {
        // console.log('>>>>>>>>>>>>>>>>捕获的错误:', err);
        // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
        ctx.app.emit('error', err, ctx);
        let exception: CommonException;
        if (err instanceof CommonException === false) {
          exception = new CommonException(
            ExceptionCodeEnum.UNKNOWN_ERR,
            err.message,
            500
          );
        } else {
          exception = err;
        }

        const error = {
          requestUrl: `${ctx.method} : ${ctx.path}`,
          code: exception.code,
          message: exception.msg,
          messageArray:
            exception instanceof ValidateException
              ? err.msgArray
              : [exception.msg],
          label: exception.label
        };

        // 从 error 对象上读出各个属性，设置到响应中
        ctx.body = error;
        ctx.status = exception.status;
      }
    };
  }
}
