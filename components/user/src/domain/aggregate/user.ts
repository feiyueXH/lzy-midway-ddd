import {
  AggregateRoot,
  CommonException,
  Entity,
  EntityFactory,
  ExceptionCodeEnum,
  IsPasswordFormat,
  IsPhoneNumberFormat,
  // IsUsernameFormat,
  ValidateMessages
} from '@lzy-plugin/ddd-cqrs';
import { Expose } from 'class-transformer';
import { IsByteLength, IsNotEmpty, IsString } from 'class-validator';
import { IUserChecker } from '../../application/checker/interface';

export class User extends AggregateRoot {
  userChecker: IUserChecker;

  // @Expose()
  // @IsNotEmpty({ message: ValidateMessages.base_isNotEmpty })
  // @IsString({ message: ValidateMessages.base_isString })
  // @IsByteLength(6, 20, { message: ValidateMessages.base_byteLengthLimit })
  // @IsUsernameFormat({ message: ValidateMessages.common_usernameFormat })
  // username: string; //账号

  @Expose()
  @IsNotEmpty({ message: ValidateMessages.base_isNotEmpty })
  @IsString({ message: ValidateMessages.base_isString })
  @IsByteLength(6, 20, { message: ValidateMessages.base_byteLengthLimit })
  @IsPasswordFormat({ message: ValidateMessages.common_passwordFormat })
  password: string; //密码

  @Expose()
  @IsNotEmpty({ message: ValidateMessages.base_isNotEmpty })
  @IsString({ message: ValidateMessages.base_isString })
  @IsPhoneNumberFormat({ message: ValidateMessages.common_phoneNumberFormat })
  phoneNumber: string; //手机号

  @Expose()
  enableStatus: boolean = true; //启用状态

  @Expose()
  isEnterpriseUser: boolean = false; //是否为企业用户

  //验证密码
  public equalPassword(password: string): boolean {
    return this.password === password;
  }

  //修改密码
  public changePassword(password: string): void {
    this.password = password;
  }

  //修改绑定的手机号
  public async modifyPhoneNumber(
    phoneNumber: string,
    userChecker: IUserChecker
  ): Promise<void> {
    if (phoneNumber === this.phoneNumber) {
      return;
    }

    if (await userChecker.isExistedByPhoneNumber(phoneNumber)) {
      throw new CommonException(
        ExceptionCodeEnum.DB_FAIL_UNIQUE,
        '手机号已注册'
      );
    }
    this.phoneNumber = phoneNumber;
  }

  static async create<T extends Entity>(
    clazz: new () => T,
    object: Record<string, any>,
    userChecker: IUserChecker
  ): Promise<T> {
    // if (await userChecker.isExistedByUsername(object.username)) {
    //   throw new CommonException(ExceptionCodeEnum.DB_FAIL_UNIQUE, '账号已注册');
    // }

    if (await userChecker.isExistedByPhoneNumber(object.phoneNumber)) {
      throw new CommonException(
        ExceptionCodeEnum.DB_FAIL_UNIQUE,
        '手机号已注册'
      );
    }
    return await EntityFactory.create(clazz, object);
  }
}
