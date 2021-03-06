import { MongoUtil } from '@lzy-plugin/mongo-context';
import { IEntity } from './entity';

/**
 * 领域事件接口 一般用于类型来使用
 */
export interface IDomainEvent {
  source: IEntity;
  _id: string;
  createTime: Date;
}

/**
 * 领域事件基类 一般给各个领域事件基层使用
 */
export class DomainEvent implements IDomainEvent {
  _id: string;
  createTime: Date;
  source: IEntity;

  constructor(source?: IEntity) {
    this.source = source;
    this._id = MongoUtil.newObjectIdToString();
    this.setCreateTime(new Date());
  }

  getCreateTime(): Date {
    return this.createTime;
  }
  setCreateTime(date: Date): void {
    this.createTime = date;
  }

  toString(): string {
    throw new Error('Method not implemented.');
  }
}

/**
 * 领域事件
 */
export interface IDomainEventHandler {
  handleEvent<E extends DomainEvent>(eventData: E): void;
}

/**
 * 领域事件处理者接口(订阅者)基类 一般给各个领域事件基层使用
 */
export abstract class DomainEventHandler implements IDomainEventHandler {
  abstract handleEvent<E extends DomainEvent>(eventData: E): Promise<void>;
}
