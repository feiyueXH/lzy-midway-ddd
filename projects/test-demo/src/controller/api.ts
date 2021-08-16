import { Controller, Post, Provide, Body, ALL } from '@midwayjs/decorator';
import { RegisterUserCommand, UserModel } from '@lzy-component/user';
import {
  CommonException,
  ExceptionCodeEnum,
  isPhoneNumberFormat,
  plainToClassAndValidate,
  replaceStr,
  SuperController,
  ValidateMessages,
} from '@lzy-plugin/ddd-cqrs';

@Provide()
@Controller('/crm')
export class CrmController extends SuperController {
  @Post('/login_or_register')
  async loginOrRegister(@Body(ALL) body: any) {
    const phoneNumber = body?.phoneNumber;
    //判断手机号是否正确
    if (!isPhoneNumberFormat(phoneNumber)) {
      throw new CommonException(
        ExceptionCodeEnum.VALIDATE_FAIL,
        replaceStr(ValidateMessages.common_phoneNumberFormat, {
          property: 'phoneNumber',
        })
      );
    }

    //获取cookie中的验证码
    const verificationCode: string = this.ctx.cookies.get('verificationCode', {
      encrypt: true,
    });
    this.logger.info(`${verificationCode},${body?.verificationCode}`);
    if (verificationCode !== body?.verificationCode) {
      throw new CommonException(ExceptionCodeEnum.UNKNOWN_ERR, '验证码错误');
    }
    const params = {
      filter: { phoneNumber: body.phoneNumber },
      fields: ['_id', 'phoneNumber'],
    };
    //如果账号不存在,则进行注册
    const existArray = await this.queryUtil.find('admin', params, UserModel);
    this.logger.info(`${JSON.stringify(existArray)}`);
    if (existArray.length === 0) {
      this.logger.info('发送注册命令');
      const command: RegisterUserCommand = await plainToClassAndValidate(
        RegisterUserCommand,
        {
          phoneNumber: body.phoneNumber,
          password: 'Ykx123456',
        }
      );
      await this.commandBus.send(command, { dbKey: 'admin' });
    }

    this.logger.info(`params:${JSON.stringify(params)}`);
    const result = await this.queryUtil.find('admin', params, UserModel);
    if (result.length === 0) {
      throw new CommonException(
        ExceptionCodeEnum.UNKNOWN_ERR,
        '登录失败,请重试!'
      );
    } else {
      this.ctx.cookies.set(
        'userInfo',
        JSON.stringify({
          userId: result[0]._id,
          phoneNumber: result[0].phoneNumber,
        }),
        {
          maxAge: 3600000,
        }
      );
      this.httpHelper.success(null, 'OK');
    }
  }
}
