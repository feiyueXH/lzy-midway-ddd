import { SuperModel, TypegooseModel } from '@lzy-plugin/mongo-context';
import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
@TypegooseModel({ modelName: 'User', collectionName: 'user' })
export class UserModel extends SuperModel {
  @Expose()
  @prop()
  enableStatus: boolean;
  @prop()
  @Expose()
  isEnterpriseUser: boolean;
  @prop()
  @Expose()
  phoneNumber: string;
  @prop()
  @Expose()
  password: string;
}
