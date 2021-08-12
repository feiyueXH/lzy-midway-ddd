import {
  Scope,
  ScopeEnum,
  saveClassMetadata,
  saveModule
} from '@midwayjs/decorator';
import { ITypegooseModelOptions } from '../interface';

const MODULE_KEY = 'decorator:typegooseModel';

export function TypegooseModel(
  options?: ITypegooseModelOptions
): ClassDecorator {
  return (target: any) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(MODULE_KEY, target);
    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(MODULE_KEY, options, target);
    // 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
    Scope(ScopeEnum.Prototype)(target);
  };
}
