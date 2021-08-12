import { Connection, createConnection, Document, Model } from 'mongoose';
import { getMongoOptions, getMongoUri } from './connect-util';
import {
  // addModelToTypegoose,
  // buildSchema,
  getModelForClass
} from '@typegoose/typegoose';
import {
  classToPlain,
  plainToClass,
  plainToClassFromExist
} from 'class-transformer';
import { SuperModel } from './super-model';
import {
  IDeleteResult,
  IFilter,
  IMongoConfig,
  IObj,
  IOptions,
  IProjection,
  IUpdateResult
} from '../interface';
import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';

@Provide()
@Scope(ScopeEnum.Prototype)
export class MongoContext {
  private static connectionMap = new Map<string, Connection>();
  private static modelMap = new Map<
    string,
    Array<{
      modelName: string;
      model: Model<Document>;
      clazz: new () => SuperModel;
    }>
  >();
  private static typegooseClazzArray = new Array<{
    modelName: string;
    modelClazz: new () => SuperModel;
    collectionName: string;
  }>();
  key: string;
  model: Model<any>;
  clazz: new () => SuperModel;
  /**
   * 创建数据库连接连接对象,并且内部为该数据库连接对象创建被@TypegooseModel装饰的ModelClazz
   * @param config 数据库连接配置
   * @returns
   */
  static async createConnection(config: IMongoConfig): Promise<Connection> {
    if (!this.connectionMap.has(config.key)) {
      const connection = createConnection(
        getMongoUri(config),
        getMongoOptions(config)
      );
      await new Promise((resolve, reject) => {
        connection.on('connected', () => {
          resolve(true);
        });
        connection.on('error', (err) => {
          reject(err);
        });
      });
      await this.bindModelToConnection(config.key, connection);
      this.connectionMap.set(config.key, connection);
    }
    return this.connectionMap.get(config.key);
  }

  static getConnection(connectionName: string): Connection {
    return this.connectionMap.has(connectionName)
      ? this.connectionMap.get(connectionName)
      : null;
  }
  /**
   * 添加TypegooseClazz
   * @param item
   */
  static addTypegooseClazz(item: {
    modelName: string;
    modelClazz: new () => SuperModel;
    collectionName: string;
  }): void {
    this.typegooseClazzArray.push(item);
  }
  static hasDatabase(key: string): boolean {
    return this.modelMap.has(key);
  }
  //为每个数据库连接对象创建Model
  private static async bindModelToConnection(
    key: string,
    connection: Connection
  ) {
    if (this.modelMap.has(key)) {
      return;
    }
    const value = new Array();
    for (const item of this.typegooseClazzArray) {
      //先判断是否存在集合,如果不存在集合,将自动创建一个空的集合
      //因为listCollection()要求数据库连接对象必须是连接成功状态的,所以需要等待connection连接成功后才能执行这个方法
      if (item.collectionName) {
        const result = await connection.db
          .listCollections({ name: item.collectionName }, { nameOnly: true })
          .next();
        if (!result) {
          connection.createCollection(item.collectionName);
        }
      }
      // //创建mongoose的Model
      // const mongooseModel = connection.model(
      //   item.modelName,
      //   buildSchema(item.modelClazz),
      //   item.collectionName
      // );
      // //创建typegoose的Model,我猜typegoose这里应该是做了代理,让我们定义的ModelClazz与mongooseModel关联起来
      // const typegooseModel = addModelToTypegoose(
      //   mongooseModel,
      //   item.modelClazz
      // );

      const typegooseModel = getModelForClass(item.modelClazz, {
        existingConnection: connection,
        schemaOptions: { collection: item.collectionName }
      });

      value.push({
        modelName: item.modelName,
        model: typegooseModel,
        clazz: item.modelClazz
      });
    }
    this.modelMap.set(key, value);
  }
  /**
   * 切换数据库
   * @param key
   */
  switchDatabase(key: string): MongoContext {
    if (MongoContext.modelMap.has(key)) {
      this.key = key;
      this.model = null;
      this.clazz = null;
      return this;
    } else {
      throw new Error(`找不到指定数据库:${key}`);
    }
  }
  /**
   * 切换数据库
   * @param key
   */
  switchModel(value: (new () => SuperModel) | string): MongoContext {
    if (MongoContext.modelMap.has(this.key)) {
      if (typeof value === 'string') {
        const result = MongoContext.modelMap
          .get(this.key)
          .find((item) => item.modelName === value);
        this.model = result.model;
        this.clazz = result.clazz;
      } else if (value['prototype'] instanceof SuperModel) {
        const result = MongoContext.modelMap
          .get(this.key)
          .find((item) => item.clazz === value);
        this.model = result.model;
        this.clazz = result.clazz;
      } else {
        throw new Error('非法传参导致无法识别持久化对象!');
      }
    } else {
      throw new Error(`找不到指定数据库:${this.key}`);
    }
    return this;
  }
  /**
   * 创建多行数据
   * @param modelName 指定modelName
   * @param obj[] 保存内容
   * @param options 执行参数
   */
  async create(obj: IObj | IObj[], options?: IOptions): Promise<any> {
    const model = this.model;
    return await model.create(obj, options);
  }

  getDocumentById(
    id: string,
    projection: IProjection,
    options: IOptions
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const model = this.model;
      model.findById(id, projection, options).exec((err, result) => {
        if (err) {
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }
  /**
   * 保存单行数据
   * @param modelName 指定modelName
   * @param obj 保存内容
   * @param options 执行参数
   */
  async save(obj: IObj, options?: IOptions): Promise<any> {
    const model = this.model;
    let entity;
    if (obj._id) {
      entity = await this.getDocumentById(obj._id, {}, options);
      plainToClassFromExist(entity, obj, {
        excludeExtraneousValues: true
      });
    }
    entity = entity ? entity : new model(obj);
    return await entity.save(options);
  }
  /**
   * 更新数据(多行)
   * @param modelName 指定modelName
   * @param filter 筛选条件
   * @param obj 保存内容
   * @param options 执行参数
   */
  async update(
    filter: IFilter,
    obj: IObj,
    options?: IOptions
  ): Promise<IUpdateResult> {
    const model = this.model;
    const res = await model.updateMany(filter, obj, options);
    const result = {
      matchedCount: res.n,
      modifiedCount: res.nModified
    };
    return result;
  }
  /**
   * 移除数据(多行)
   * @param modelName 指定modelName
   * @param filter 筛选条件
   * @param options 执行参数
   */
  async remove(filter: IFilter, options?: IOptions): Promise<IDeleteResult> {
    const model = this.model;
    const res = await model.deleteMany(filter, options);
    const result = {
      matchedCount: res.n,
      deletedCount: res.deletedCount
    };
    return result;
  }
  /**
   * 查询单条数据
   * @param modelName 指定modelName
   * @param filter 筛选条件
   * @param projection 字段过滤
   * @param options 执行参数
   */
  findOne(
    filter: IFilter,
    projection?: IProjection,
    options?: IOptions
  ): Promise<any> {
    // const model = this.model;
    // return await model.findOne(filter, projection, options).exec();
    return new Promise((resolve, reject) => {
      const model = this.model;
      model
        .findOne(filter, projection, options)
        .lean()
        .exec((err, result) => {
          if (err) {
            resolve(null);
          } else {
            const deserialized = plainToClass(this.clazz, result, {
              excludeExtraneousValues: true
            });
            const serialized = classToPlain(deserialized, {
              excludeExtraneousValues: true
            });
            resolve(serialized);
          }
        });
    });
  }

  /**
   * 统计数量
   * @param filter
   * @returns
   */
  count(filter: IFilter): Promise<number> {
    return new Promise((resolve, reject) => {
      const model = this.model;
      model.count(filter).exec((err, result) => {
        if (err) {
          resolve(0);
        } else {
          resolve(result);
        }
      });
    });
  }
  /**
   * 查询单条数据
   * @param modelName 指定modelName
   * @param filter 筛选条件
   * @param projection 字段过滤
   * @param options 执行参数
   */
  async findById(
    id: string,
    projection?: IProjection,
    options?: IOptions
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const model = this.model;
      model.findById(id, projection, options).exec((err, result) => {
        if (err) {
          resolve(null);
        } else {
          const deserialized = plainToClass(this.clazz, result, {
            excludeExtraneousValues: true
          });
          const serialized = classToPlain(deserialized, {
            excludeExtraneousValues: true
          });
          resolve(serialized);
        }
      });
    });
  }
  /**
   * 查询多条数据
   * @param modelName 指定modelName
   * @param filter 筛选条件
   * @param projection 字段过滤
   * @param options 执行参数
   */
  find(
    filter: IFilter,
    projection?: IProjection,
    options?: IOptions
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // const model = this.model;
      // return model.find(filter, projection, options);
      const model = this.model;
      model
        .find(filter, projection, options)
        .lean()
        .exec((err, result) => {
          if (err) {
            resolve([]);
          } else {
            const deserialized = plainToClass(this.clazz, result, {
              excludeExtraneousValues: true
            });
            const serialized = classToPlain(deserialized, {
              excludeExtraneousValues: true
            });
            resolve(serialized);
          }
        });
    });
  }
  /**
   * 批量操作
   */
  async bulkWrite(writes: any[], options?: IOptions): Promise<void> {
    const model = this.model;
    await model.bulkWrite(writes, options);
  }
}
