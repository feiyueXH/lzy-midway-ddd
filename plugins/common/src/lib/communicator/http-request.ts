import { App, Provide } from '@midwayjs/decorator';
import { IMidwayWebApplication } from '@midwayjs/web';
@Provide()
export class MyHttpRequest {
  @App()
  app: IMidwayWebApplication;

  public async send(url: string, options: Record<string, any>): Promise<any> {
    return await this.app.curl(url, options);
  }
}
