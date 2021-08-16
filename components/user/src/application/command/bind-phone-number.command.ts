import {
  Common_IsNotUndefined,
  IsPhoneNumberFormat,
  SuperCommand,
  ValidateMessages
} from '@lzy-plugin/ddd-cqrs';
import { Expose } from 'class-transformer';
import { IsByteLength, IsNotEmpty, IsString } from 'class-validator';

//修改密码命令
export class BindPhoneNumberCommand extends SuperCommand {
  @Expose()
  @IsNotEmpty({
    message: ValidateMessages.base_isNotEmpty
  })
  @Common_IsNotUndefined({ message: ValidateMessages.common_isNotUndefined })
  @IsString({
    message: ValidateMessages.base_isString
  })
  public userId: string; //用户_id

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
  @IsPhoneNumberFormat({
    message: ValidateMessages.common_phoneNumberFormat
  })
  phoneNumber: string;

  constructor() {
    super();
  }
}
