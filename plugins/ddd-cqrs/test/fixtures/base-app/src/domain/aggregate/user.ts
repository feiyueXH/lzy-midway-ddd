import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
  AggregateRoot,
  CommonException,
  Entity,
  EntityFactory,
  ExceptionCodeEnum
} from '../../../../../../src';

import { IUserChecker } from '../../application/checker/interface';
export class User extends AggregateRoot {
  @Expose()
  @IsNotEmpty()
  username: string;
  @Expose()
  @IsNotEmpty()
  password: string;

  changePassword(password: string) {
    this.password = password;
  }

  static async create<E extends Entity>(
    clazz: new () => E,
    object: Record<string, any>,
    userChecker: IUserChecker
  ): Promise<E> {
    if (await userChecker.isExistedByUsername(object)) {
      throw new CommonException(
        ExceptionCodeEnum.DB_FAIL_CREATE_UNIQUE,
        '账号已被注册'
      );
    }
    return await EntityFactory.create(clazz, object);
  }
}
