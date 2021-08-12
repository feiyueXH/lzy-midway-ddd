import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from 'class-validator';
import { isCoordinate, isNotUndefined } from '../functions';

export function IsUsernameFormat(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUsernameFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          //必须是数字、大小写字母的组合
          return /^[A-Za-z0-9]+$/.test(value);
        }
      }
    });
  };
}

export function IsPasswordFormat(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPasswordFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          //必须是数字、大小写字母的组合
          return /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]*$/.test(value);
        }
      }
    });
  };
}

export function IsPhoneNumberFormat(validationOptions?: any) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumberFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          //必须是数字、大小写字母的组合
          return new RegExp(
            '^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[0-9])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\\d{8}$'
          ).test(value);
        }
      }
    });
  };
}

export function Common_IsNotUndefined(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Common_IsUndefined',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isNotUndefined(value);
        }
      }
    });
  };
}

export function Common_IsCoordinate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Common_IsUndefined',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isCoordinate(value);
        }
      }
    });
  };
}
