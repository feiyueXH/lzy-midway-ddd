import { MongoUtil } from '@lzy-plugin/mongo-context';
import { plainToClassFromExistAndValidate } from '../../common/util';
import { Entity } from './entity';
import { DomainEvent } from './event';

export interface IAggregateRoot {
  events: DomainEvent[];
}

export abstract class AggregateRoot extends Entity implements IAggregateRoot {
  events: DomainEvent[];
  constructor(_id?: string) {
    super(_id);
    this.events = new Array<DomainEvent>();
  }

  static async create<T extends AggregateRoot>(
    clazz: new () => T,
    object: Record<string, any>,
    ...args: any[]
  ): Promise<T> {
    const entity = new clazz();
    entity._id = MongoUtil.newObjectIdToString();
    await plainToClassFromExistAndValidate(entity, object);
    return entity;
  }
}
