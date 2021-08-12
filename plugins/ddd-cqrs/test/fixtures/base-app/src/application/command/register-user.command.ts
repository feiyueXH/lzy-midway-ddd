import { Expose } from 'class-transformer';
import { SuperCommand } from '../../../../../../src';

export class RegisterUserCommand extends SuperCommand {
  @Expose()
  username: string;
  @Expose()
  password: string;
}
