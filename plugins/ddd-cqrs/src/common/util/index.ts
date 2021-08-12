import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidateException } from '../../exception/validate-exception';
export interface TransformerOption {
  groups?: string[];
  [propName: string]: any;
}

export interface ValidateOption {
  groups?: string[];
  [propName: string]: any;
}

export const plainToClassAndValidate = async (
  cls: new (...arg: any[]) => any,
  plain: any | any[],
  transformerOption?: TransformerOption,
  validateOption?: ValidateOption
): Promise<any> => {
  transformerOption = transformerOption || {};
  const _transformerOption = {
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
    ...validateOption
  };

  validateOption = validateOption || {};
  const _validateOption = {
    forbidUnknownValues: true,
    always: true,
    strictGroups: true,
    ...validateOption
  };

  const result = plainToClass(cls, plain, _transformerOption);
  const errors = await validate(result, _validateOption);
  if (errors.length > 0) {
    throw new ValidateException(errors);
  } else {
    return result;
  }
};

export const plainToClassFromExistAndValidate = async (
  obj: any,
  plain: any | any[],
  transformerOption?: TransformerOption,
  validateOption?: ValidateOption
): Promise<any> => {
  transformerOption = transformerOption || {};
  const _transformerOption = {
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
    ...validateOption
  };

  validateOption = validateOption || {};
  const _validateOption = {
    forbidUnknownValues: true,
    always: true,
    strictGroups: true,
    ...validateOption
  };

  const result = plainToClassFromExist(obj, plain, _transformerOption);
  const errors = await validate(result, _validateOption);
  if (errors.length > 0) {
    throw new ValidateException(errors);
  } else {
    return result;
  }
};

export const getClassName = (obj: any): string => {
  if (!obj.constructor) {
    throw new Error(`${obj}不是类实例`);
  }
  return obj.constructor.name;
};

export const getZoneData = (key: string): any => {
  const { current } = require('node-zone');
  return current.data[key];
};
