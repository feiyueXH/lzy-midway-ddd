import { Config, Init, Provide } from '@midwayjs/decorator';
import { IAliyunSMSConfig } from '../../interface';
import * as Client from '@alicloud/pop-core';
// const Core = require('@alicloud/pop-core');

@Provide()
export class SmsUtil {
  @Config('smsConfig')
  smsConfig: IAliyunSMSConfig;

  client: Client;

  @Init()
  async init(): Promise<void> {
    this.client = new Client({
      accessKeyId: this.smsConfig.accessKeyId,
      accessKeySecret: this.smsConfig.accessKeySecret,
      endpoint: this.smsConfig.endpoint,
      apiVersion: '2017-05-25'
    });
  }

  public async sendSms(
    phoneNumber: string,
    params: Record<string, any>,
    templateCode: string = 'SMS_78540006',
    options?: Record<string, any>
  ): Promise<any> {
    const _params = {
      PhoneNumbers: phoneNumber,
      SignName: this.smsConfig.signName,
      TemplateCode: templateCode,
      TemplateParam: JSON.stringify(params)
    };
    await this.client.request('SendSms', _params);
  }
}
