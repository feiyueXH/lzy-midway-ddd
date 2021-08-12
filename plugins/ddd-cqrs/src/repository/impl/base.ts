import { IMongoManager, MongoContext } from '@lzy-plugin/mongo-context';
import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { serialize } from 'class-transformer';

import { EventBus } from '../../core/bus/event-bus';
import { AggregateRoot } from '../../core/domain/aggregate-root';
import { Entity } from '../../core/domain/entity';
import { CommonException } from '../../exception/common-exception';
import {
  IChangedItem,
  OperationTypes,
  proxyObject
} from '../core/aggregate-observer';
import {
  ExceptionCodeEnum,
  getClassName,
  getZoneData,
  plainToClassAndValidate
} from '../..';

@Provide()
@Scope(ScopeEnum.Prototype)
export class CommonRepository<T extends AggregateRoot> {
  @Inject('mongo-context:mongoManager')
  private mongoManager: IMongoManager;

  private mongoContext: MongoContext;

  @Inject()
  private eventBus: EventBus;

  private modelClazz: new () => T;
  private changedArray: IChangedItem[];
  private serializeMap: Map<string, string>;
  private cacheArray: T[]; //缓存数据

  private deleteArray: Array<Entity>;
  private insertArray: Array<Entity>;
  private modifyArray: Array<Entity>;

  /**
   * 创建实例必须执行初始初始化方法
   * @param modelClazz
   */
  public async init(modelClazz: new () => T): Promise<void> {
    this.modelClazz = modelClazz;
    this.changedArray = new Array<IChangedItem>();
    this.cacheArray = new Array<T>();
    this.serializeMap = new Map<string, string>();
    this.deleteArray = new Array<Entity>();
    this.insertArray = new Array<Entity>();
    this.modifyArray = new Array<Entity>();
    const dbKey: string = getZoneData('dbKey');
    this.mongoContext = await this.mongoManager.getContext(dbKey);
  }

  /**
   * 通过_id从仓储查询查询数据
   * @param _id
   * @returns
   */
  public async get(_id: string): Promise<T> {
    //先在缓存区中查询是否存在,没有再从数据库找
    const isExist = this.cacheArray.find((item) => item._id === _id);
    if (isExist) {
      return isExist; //因为是直接从缓存区拿的数据,所以不需要进行代理侦测变化
    }

    //从数据库查询
    this.mongoContext.switchModel(this.modelClazz.name);
    const result = await this.mongoContext.findById(_id);
    if (!result) {
      return result;
    } else {
      const domainObject = await plainToClassAndValidate(
        this.modelClazz,
        result
      );

      //将数据进行代理侦测变化
      const proxyData = proxyObject(domainObject, this.changedArray);

      //将数据序列化,然后进行缓存
      this.serializeMap.set(proxyData._id, serialize(proxyData));

      //将数据添加到缓存区
      this.cacheArray.push(proxyData);
      return proxyData;
    }
  }

  /**
   * 添加数据到仓储中
   * @param value
   */
  public async add(value: T): Promise<void> {
    //判断缓存区或数据库存在数据,不允许add
    this.mongoContext.switchModel(this.modelClazz.name);
    if (
      this.cacheArray.find((item) => item._id === value._id) ||
      (await this.mongoContext.findById(value._id))
    ) {
      throw new CommonException(
        ExceptionCodeEnum.DB_FAIL_CREATE_UNIQUE,
        'CommonRepository检查_id发现重复,不允许添加重复数据'
      );
    }

    //不存在则先添加到缓存区,提交时直接save即可,不需要监听数据变化
    this.cacheArray.push(value);
  }

  /**
   * 从仓储中移除数据 慎重使用,聚合根最好不要删除
   * @param value
   */
  public async remove(value: Entity): Promise<void>;
  public async remove(value: string): Promise<void>;
  public async remove(value: string | Entity): Promise<void> {
    if (value instanceof Entity) {
      this.addDeleteItem(value);
    } else {
      const entity = await this.get(value);
      console.log('entity:', entity);
      console.log('id:', value);
      if (!entity) {
        throw new CommonException(
          ExceptionCodeEnum.DB_FAIL_DELETE_NOTFOUND,
          '操作失败,查无数据'
        );
      }
      this.addDeleteItem(entity);
    }
  }

  //缓存被移除的数据
  private addDeleteItem(item: Entity): void {
    if (!(item instanceof Entity)) {
      return;
    }

    if (!this.deleteArray) {
      this.deleteArray = new Array<Entity>();
    }
    if (
      this.deleteArray.findIndex(
        (deleteItem) => deleteItem._id === item._id
      ) === -1
    ) {
      this.deleteArray.push(item);
    }
  }

  //缓存新增的数据
  private addInsertItem(item: Entity): void {
    if (!(item instanceof Entity)) {
      return;
    }

    if (!this.insertArray) {
      this.insertArray = new Array<Entity>();
    }
    if (
      this.insertArray.findIndex(
        (insertItem) => insertItem._id === item._id
      ) === -1
    ) {
      this.insertArray.push(item);
    }
  }

  //缓存修改的数据
  private addModifyItem(item: Entity): void {
    if (!(item instanceof Entity)) {
      return;
    }

    if (!this.modifyArray) {
      this.modifyArray = new Array<Entity>();
    }

    if (
      this.modifyArray.findIndex(
        (modifyItem) => modifyItem._id === item._id
      ) === -1
    ) {
      this.modifyArray.push(item);
    }
  }

  //持久化操作--保存数据
  private async executeSave(item: Entity): Promise<void> {
    for (const key in item) {
      const value = item[key];
      if (Array.isArray(value)) {
        for (const item of value) {
          await this.executeSave(item);
        }
      } else if (value instanceof Entity) {
        await this.executeSave(value);
      }
    }

    if (item instanceof Entity) {
      this.mongoContext.switchModel(getClassName(item));
      await this.mongoContext.save(item);
    }
  }

  //持久化操作--删除数据
  private async executeDelete(item: Entity): Promise<void> {
    for (const key in item) {
      const value = item[key];
      if (Array.isArray(value)) {
        for (const item of value) {
          await this.executeDelete(item);
        }
      } else if (value instanceof Entity) {
        await this.executeDelete(value);
      }
    }

    if (item instanceof Entity) {
      this.mongoContext.switchModel(getClassName(item));
      await this.mongoContext.remove({ _id: item._id });
    }
  }

  //提交，将缓存起来的被删除数据、新增数据、修改数据进行持久化
  public async commit(): Promise<void> {
    //检查更新列表中哪些实体发生删除和新增
    for (const item of this.changedArray) {
      switch (item.type) {
        case OperationTypes.ADD:
          // if (item.newValue instanceof Entity) {
          //   this.addInsertItem(item.newValue);
          // }
          break;
        case OperationTypes.DELETE:
          if (item.oldValue instanceof Entity) {
            this.addDeleteItem(item.oldValue);
          }
          break;
        case OperationTypes.SET:
          if (item.oldValue instanceof Entity) {
            this.addDeleteItem(item.oldValue);
          }

          // if (item.newValue instanceof Entity) {
          //   this.addInsertItem(item.newValue);
          // }
          break;
      }
    }

    //对比缓存数据与序列化数据的差异,存在差异则加入更细名单
    for (const item of this.cacheArray) {
      if (this.serializeMap.has(item._id)) {
        if (serialize(item) !== this.serializeMap.get(item._id)) {
          this.addModifyItem(item);
        }
      } else {
        this.addInsertItem(item);
      }
    }

    //进行持久化
    const promiseArray = [];
    this.insertArray.forEach((item) => {
      promiseArray.push(this.executeSave(item));
    });
    this.modifyArray.forEach((item) => {
      promiseArray.push(this.executeSave(item));
    });
    this.deleteArray.forEach((item) => {
      promiseArray.push(this.executeDelete(item));
    });

    //并发执行持久化
    await Promise.all(promiseArray);

    //发布领域事件
    this.cacheArray.forEach((item) => {
      item.events.forEach((event) =>
        this.eventBus.publish(event, getZoneData('dbKey'))
      );
    });

    this.init(this.modelClazz);
  }
}
