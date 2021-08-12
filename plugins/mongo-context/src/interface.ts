import { ClientSession } from 'mongoose';
import { MongoContext } from './core/mongo-context';
export interface IReplicaSet {
  name: string;
  members: Array<{
    host: string;
    port: number;
  }>;
}
export interface IMongoConfig {
  key: string;
  db: string;
  user: string;
  pass: string;
  host: string;
  port: string;
  replicaSet: IReplicaSet;
}
export interface ICreateResult {
  insertedCount: number;
}
export interface IUpdateResult {
  matchedCount: number;
  modifiedCount: number;
}
export interface IDeleteResult {
  matchedCount: number;
  deletedCount: number;
}
export interface IOptions {
  [propName: string]: any;
  session?: ClientSession;
}
export interface IFilter {
  [propName: string]: any;
}
export interface IObj {
  [propName: string]: any;
}
export interface IProjection {
  [propName: string]: number;
}
export interface ITypegooseModelOptions {
  modelName?: string;
  collectionName: string;
}
export interface IMongoManager {
  getContext(key?: string): Promise<MongoContext>;
}
