import { Controller, Get, Inject, Provide } from '@midwayjs/decorator';
import { TestService } from '../service/test';
import { IMidwayContext } from '@midwayjs/core';
@Controller('/test')
@Provide()
export class TestController {
  @Inject()
  testService: TestService;

  @Inject()
  ctx: IMidwayContext;

  @Get('/')
  sayHello(): string {
    const message: string = this.testService.getMessage();
    return message;
    // this.ctx.body = { message: message };
  }
}
