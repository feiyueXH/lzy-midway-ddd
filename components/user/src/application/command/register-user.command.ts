import {
  IsPasswordFormat,
  IsPhoneNumberFormat,
  // IsUsernameFormat,
  SuperCommand,
  ValidateMessages
} from '@lzy-plugin/ddd-cqrs';
import { Expose } from 'class-transformer';
import {
  IsByteLength,
  IsNotEmpty,
  IsString,
  ValidateIf
} from 'class-validator';

//用户注册命令
export class RegisterUserCommand extends SuperCommand {
  @ValidateIf(() => false) //取消该属性上所有验证器
  operatorId: string;

  @Expose()
  @IsNotEmpty({
    message: ValidateMessages.base_isNotEmpty
  })
  @IsString({
    message: ValidateMessages.base_isString
  })
  @IsPhoneNumberFormat({
    message: ValidateMessages.common_phoneNumberFormat
  })
  public phoneNumber: string;

  // @Expose()
  // @IsNotEmpty({
  //   message: ValidateMessages.base_isNotEmpty
  // })
  // @IsString({
  //   message: ValidateMessages.base_isString
  // })
  // @IsUsernameFormat({
  //   message: ValidateMessages.common_usernameFormat
  // })
  // public username: string;

  @Expose()
  @IsNotEmpty({
    message: ValidateMessages.base_isNotEmpty
  })
  @IsString({
    message: ValidateMessages.base_isString
  })
  @IsByteLength(6, 20, {
    message: ValidateMessages.base_byteLengthLimit
  })
  @IsPasswordFormat({
    message: ValidateMessages.common_passwordFormat
  })
  password: string;

  constructor() {
    super();
  }
}
