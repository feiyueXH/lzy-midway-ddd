import {
  Inject,
  Provide,
  Scope,
  ScopeEnum
  // Scope, ScopeEnum
} from '@midwayjs/decorator';
import { MyHttpRequest, SmsUtil } from '../../../../../src';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TestService {
  @Inject('common:myHttpRequest')
  httpRequest: MyHttpRequest;

  @Inject('common:smsUtil')
  smsUtil: SmsUtil;

  public async send(url: string, options: Record<string, any>): Promise<any> {
    console.log('url:', url);
    return await this.httpRequest.send(url, options);
  }

  public async sendSms(phoneNumber: string, code: string): Promise<void> {
    await this.smsUtil.sendSms(phoneNumber, {
      code: '666666'
    });
  }
}
