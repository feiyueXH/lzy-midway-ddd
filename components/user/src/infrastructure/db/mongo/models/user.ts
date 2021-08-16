import { prop } from '@typegoose/typegoose';
import { SuperModel, TypegooseModel } from '@lzy-plugin/mongo-context';
import { Expose } from 'class-transformer';
@TypegooseModel({ modelName: 'User', collectionName: 'user' })
export class UserModel extends SuperModel {
  // @prop()
  // @Expose()
  // public username: string; //账户

  @prop()
  @Expose()
  public password: string; //密码

  @prop()
  @Expose()
  public phoneNumber: string; //手机号

  @prop()
  @Expose()
  public enableStatus: boolean; //启用状态

  @prop()
  @Expose()
  public isEnterpriseUser: boolean = false; //是否为企业用户
}
