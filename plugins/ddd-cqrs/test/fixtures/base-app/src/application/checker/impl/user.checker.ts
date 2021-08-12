import { IMongoManager, MongoContext } from '@lzy-plugin/mongo-context';
import { Init, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { getZoneData } from '../../../../../../../src';
import { IUserChecker } from '../interface';

@Provide()
@Scope(ScopeEnum.Singleton)
export class UserChecker implements IUserChecker {
  @Inject('mongo-context:mongoManager')
  mongoManager: IMongoManager;

  mongoContext: MongoContext;

  @Init()
  async init(): Promise<void> {
    this.mongoContext = await this.mongoManager.getContext(
      getZoneData('dbKey')
    );
    this.mongoContext.switchModel('User');
  }

  async isExistedByUsername(params: Record<string, any>): Promise<boolean> {
    const match = {
      username: params.username
    };
    if (params._id) {
      match['_id'] = params._id;
    }
    return await this.mongoContext.findOne(match);
  }
}
