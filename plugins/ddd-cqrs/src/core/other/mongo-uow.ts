import { IOptions, MongoContext, MongoUtil } from '@lzy-plugin/mongo-context';
import { Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { ClientSession, Connection } from 'mongoose';
import { IUnitOfWork } from '../../interface';

@Scope(ScopeEnum.Prototype)
@Provide()
export class MongoUnitOfWork implements IUnitOfWork {
  uow_id: string;

  private session: ClientSession;

  private _openTransaction: boolean;
  public get openTransaction(): boolean {
    return this._openTransaction;
  }

  constructor() {
    this.uow_id = MongoUtil.newObjectIdToString();
  }

  @Init()
  async initMethod(): Promise<void> {
    const db: Connection = MongoContext.getConnection('admin');
    if (!db) {
      throw new Error('获取数据库连接对象失败');
    }
    this.session = await db.startSession();
  }

  private startTransaction(): void {
    if (!this.session) {
      throw new Error('工作单元初始化时创建事务会话失败!');
    } else {
      this.session.startTransaction();
      this._openTransaction = true;
    }
  }

  register(options: IOptions): IOptions {
    if (!this.openTransaction) {
      this.startTransaction();
      console.log('事务已开启!');
    }
    const session = this.session;
    options = { session, ...options };
    return options;
  }

  async commit(): Promise<void> {
    if (this._openTransaction) {
      await this.session.commitTransaction();
      this.session.endSession();
      // this.session = null;
      // this._openTransaction = false;
      console.log('事务已提交!');
    }
  }
  async abort(): Promise<void> {
    if (this._openTransaction) {
      await this.session.abortTransaction();
      this.session.endSession();
      // this.session = null;
      // this._openTransaction = false;
      console.log('事务已回滚!');
    }
  }
}
