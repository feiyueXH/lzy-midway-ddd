import { plainToClassFromExistAndValidate } from '../..';
import { AggregateRoot } from './aggregate-root';
import { Entity } from './entity';

export interface IFactory<TAggregateRoot extends AggregateRoot> {
  create(): TAggregateRoot;
}

export abstract class Factory<TAggregateRoot extends AggregateRoot>
  implements IFactory<TAggregateRoot>
{
  abstract create(): TAggregateRoot;
}

export class EntityFactory {
  public static async create<T extends Entity>(
    clazz: new () => T,
    object: Record<string, any>
  ) {
    const entity = new clazz();
    await plainToClassFromExistAndValidate(entity, object);
    return entity;
  }
}
