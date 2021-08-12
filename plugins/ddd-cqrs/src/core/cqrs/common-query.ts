import { Inject, Provide } from '@midwayjs/decorator';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { MongoManager, SuperModel } from '@lzy-plugin/mongo-context';
import { Expose } from 'class-transformer';
import { FilterQuery, QueryFindOptions } from 'mongoose';
export class CommonQuery<T> {
  @Expose()
  filter: FilterQuery<DocumentType<T>>;
  @Expose()
  fields?: any | null;
  @Expose()
  options?: QueryFindOptions;
}

@Provide()
export class QueryUtil {
  @Inject('mongo-context:mongoManager')
  private mongoManager: MongoManager;
  public async find<T extends SuperModel>(
    dbKey: string,
    commonQuery: CommonQuery<T>,
    clazz: new () => T
  ): Promise<T[]> {
    const mongoContext = await this.mongoManager.getContext(dbKey);
    const { filter, fields, options } = commonQuery || {};
    const result = await mongoContext
      .switchModel(clazz)
      .find(filter, fields, options);
    return result;
  }

  public async findOne<T extends SuperModel>(
    dbKey: string,
    commonQuery: CommonQuery<T>,
    clazz: new () => T
  ): Promise<T> {
    const mongoContext = await this.mongoManager.getContext(dbKey);
    const { filter, fields, options } = commonQuery || {};
    const result = await mongoContext
      .switchModel(clazz)
      .findOne(filter, fields, options);
    return result;
  }

  public async count<T extends SuperModel>(
    dbKey: string,
    commonQuery: CommonQuery<T>,
    clazz: new () => T
  ): Promise<number> {
    const { filter } = commonQuery || {};
    const mongoContext = await this.mongoManager.getContext(dbKey);
    const result = await mongoContext.switchModel(clazz).count(filter);
    return result;
  }

  public async findById<T extends SuperModel>(
    dbKey: string,
    id: string,
    commonQuery: CommonQuery<T>,
    clazz: new () => T
  ): Promise<T> {
    const { fields } = commonQuery || {};
    const mongoContext = await this.mongoManager.getContext(dbKey);
    const result = await mongoContext.switchModel(clazz).findById(id, fields);
    return result;
  }
}
