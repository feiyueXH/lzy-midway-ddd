import { Init, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { MongoContext, MongoManager } from '../../../../../src';
import { User } from '../models/user';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TestService {
  constructor() {
    console.log('TestService init()');
  }

  @Inject()
  mongoManager: MongoManager;
  context: MongoContext;
  sayHello(): void {
    console.log('hello world!');
  }

  @Init()
  async init(): Promise<void> {
    this.context = await this.mongoManager.getContext('admin');
  }

  async createUser(username: string, password: string): Promise<void> {
    const user = new User();
    user.password = password;
    user.username = username;
    await this.context.switchModel(User).save(user);
    console.log('新增用户成功');
  }

  async listUser(): Promise<void> {
    const result = await this.context.switchModel(User).find({});
    console.log(result);
  }
}
