import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { SuperModel, TypegooseModel } from '../../../../../src';
console.log('>>>>>>>>>>>>>>>>>>>', SuperModel);
@TypegooseModel()
export class User extends SuperModel {
  @prop()
  @Expose()
  username: string;
  @prop()
  @Expose()
  password: string;
}
