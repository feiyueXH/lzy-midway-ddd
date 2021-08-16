import { SuperQuery, ValidateMessages } from '@lzy-plugin/ddd-cqrs';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginUserQuery extends SuperQuery {
  @ValidateIf(() => false) //取消该属性上所有验证器
  operatorId: string;

  @Expose()
  @IsNotEmpty({
    message: ValidateMessages.base_isNotEmpty
  })
  @IsString({
    message: ValidateMessages.base_isString
  })
  public loginCode: string; //登录账号 可以是手机号或者是用户账号

  @Expose()
  @IsNotEmpty({
    message: ValidateMessages.base_isNotEmpty
  })
  @IsString({
    message: ValidateMessages.base_isString
  })
  public password: string;
}
