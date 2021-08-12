import { Inject, Provide } from '@midwayjs/decorator';
import {
  CommonRepository,
  SuperCommand,
  SuperCommandExecutor,
  RepositoryManager,
  SubscribeCommand
} from '../../../../../../../src';
import { User } from '../../../domain/aggregate/user';
import { IUserChecker } from '../../checker/interface';
import { RegisterUserCommand } from '../register-user.command';

@SubscribeCommand([RegisterUserCommand])
@Provide()
export class UserCommandExecutor extends SuperCommandExecutor {
  @Inject()
  userChecker: IUserChecker;

  userRepository: CommonRepository<User>;
  public async init(repositoryManager: RepositoryManager): Promise<void> {
    this.userRepository = await repositoryManager.get(User);
  }
  public async executeCommand<C extends SuperCommand>(
    command: C
  ): Promise<void> {
    if (command instanceof RegisterUserCommand) {
      await this.registerUser(command);
    }else{
      throw new Error('未实现业务逻辑');
    }
  }

  private async registerUser(command: RegisterUserCommand): Promise<void> {
    const user = await User.create(User, command, this.userChecker);
    await this.userRepository.add(user);
  }
}
