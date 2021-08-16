import {
  CommonException,
  CommonRepository,
  ExceptionCodeEnum,
  RepositoryManager,
  SubscribeCommand,
  SuperCommand,
  SuperCommandExecutor
} from '@lzy-plugin/ddd-cqrs';
import { Inject, Provide } from '@midwayjs/decorator';
import { User } from '../../../domain/aggregate/user';
import { IUserChecker } from '../../checker/interface';
import { RegisterUserCommand } from '../register-user.command';
import { ChangePasswordCommand } from '../change-password.command';
import { BindPhoneNumberCommand } from '../bind-phone-number.command';

@SubscribeCommand([
  RegisterUserCommand,
  ChangePasswordCommand,
  BindPhoneNumberCommand
])
@Provide()
export class UserCommandExecutor extends SuperCommandExecutor {
  userRepository: CommonRepository<User>;

  @Inject()
  userChecker: IUserChecker;

  public async init(repositoryManager: RepositoryManager): Promise<void> {
    this.userRepository = await repositoryManager.get(User);
  }
  async executeCommand<C extends SuperCommand>(command: C): Promise<void> {
    if (command instanceof RegisterUserCommand) {
      await this.register(command);
    } else if (command instanceof ChangePasswordCommand) {
      await this.changePassword(command);
    } else if (command instanceof BindPhoneNumberCommand) {
      await this.bindPhoneNumber(command);
    } else {
      throw new Error('未定义执行逻辑的命令!');
    }
  }

  private async register(command: RegisterUserCommand): Promise<void> {
    const user: User = await User.create(User, command, this.userChecker);
    await this.userRepository.add(user);
  }

  private async changePassword(command: ChangePasswordCommand): Promise<void> {
    const user: User = await this.userRepository.get(command.userId);
    if (!user) {
      throw new CommonException(
        ExceptionCodeEnum.DB_FAIL_FIND_NOTFOUND,
        '查无数据'
      );
    }
    user.changePassword(command.newPassword);
  }

  private async bindPhoneNumber(
    command: BindPhoneNumberCommand
  ): Promise<void> {
    const user: User = await this.userRepository.get(command.userId);
    if (!user) {
      throw new CommonException(
        ExceptionCodeEnum.DB_FAIL_FIND_NOTFOUND,
        '查无数据'
      );
    }
    await user.modifyPhoneNumber(command.phoneNumber, this.userChecker);
  }
}
