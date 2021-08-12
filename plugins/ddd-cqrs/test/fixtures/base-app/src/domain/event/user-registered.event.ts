import { DomainEvent } from '../../../../../../src';
import { User } from '../aggregate/user';

export class UserRegisteredEvent extends DomainEvent {
  username: string;
  constructor(user: User) {
    super(user);
    this.username = user.username;
  }
}
