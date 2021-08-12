import { MongoContext } from '@lzy-plugin/mongo-context';
import { IMidwayApplication } from '@midwayjs/core';
import {
  App,
  Aspect,
  IMethodAspect,
  Init,
  // Inject,
  JoinPoint,
  Provide
} from '@midwayjs/decorator';
import { getZoneData } from '../common/util';
import { IUnitOfWork } from '../interface';

/**
 * @Aspect使用介绍
 * 文档:https://www.yuque.com/midwayjs/midway_v2/aspect
 * 第一个参数 必填 可以指定Class的方法进行切面 格式:Class | Class[]
 * 第二个参数 可选 指定对哪些方法进行切面 格式:string | ()=>boolean 参照的规范文档:https://github.com/micromatch/picomatch
 * 第三个参数 可选 执行顺序,数字越大,优先度越高 格式:number
 */
@Aspect([MongoContext], '*')
@Provide()
export class DbCrudAspect implements IMethodAspect {
  @App()
  app: IMidwayApplication;

  @Init()
  async initMethod(): Promise<void> {}

  async before(point: JoinPoint): Promise<void> {
    if (/^save|^create|^remove|^update|^get|^list/.test(point.methodName)) {
      const uow: IUnitOfWork = getZoneData('uow');
      if (uow) {
        if (/^save|^create|^remove/.test(point.methodName)) {
          //如果是增删操作,options为作为第二个参数
          point.args[1] = uow.register(point.args[1] || {});
        } else if (/^update/.test(point.methodName)) {
          //如果是改操作,options为作为第三个参数
          point.args[2] = uow.register(point.args[2] || {});
        } else if (/^get|^list/.test(point.methodName) && uow.openTransaction) {
          //如果是查操作,并且有开启事务,那接下来的查询将在事务中进行,避免改查不一致,options为作为第三个参数
          point.args[2] = uow.register(point.args[2] || {});
        }
      }
    }
  }
}
