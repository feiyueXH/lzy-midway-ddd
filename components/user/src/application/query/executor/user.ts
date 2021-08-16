import {
  CommonException,
  getZoneData,
  SubscribeQuery,
  SuperQuery,
  SuperQueryExecutor,
  UserExceptionCodeEnum
} from '@lzy-plugin/ddd-cqrs';
import { IMongoManager, MongoContext } from '@lzy-plugin/mongo-context';
import { Provide } from '@midwayjs/decorator';
import { LoginUserQuery } from '../login-user.query';
import { UserModel } from '../../../infrastructure/db/mongo/models/user';
@SubscribeQuery([LoginUserQuery])
@Provide()
export class UserQueryExecutor extends SuperQueryExecutor {
  mongoContext: MongoContext;

  async init(mongoManager: IMongoManager): Promise<any> {
    this.mongoContext = await mongoManager.getContext(getZoneData('dbKey'));
  }

  async executeQuery<C extends SuperQuery>(query: C): Promise<any> {
    if (query instanceof LoginUserQuery) {
      return await this.login(query);
    } else {
      throw new Error('未定义执行逻辑的命令!');
    }
  }

  private async login(query: LoginUserQuery): Promise<UserModel> {
    const filter = {
      $or: [
        // { username: query.loginCode },
        { phoneNumber: query.loginCode }
      ]
    };
    const user: UserModel = await this.mongoContext
      .switchModel(UserModel)
      .findOne(filter);
    if (!user) {
      throw new CommonException(
        UserExceptionCodeEnum.LOGIN_CODE_NOT_EXIST,
        '查无账号或手机号'
      );
    }

    if (user.password !== query.password) {
      throw new CommonException(
        UserExceptionCodeEnum.PASSWORD_ERROR,
        '密码错误'
      );
    }
    return user;
  }
}
