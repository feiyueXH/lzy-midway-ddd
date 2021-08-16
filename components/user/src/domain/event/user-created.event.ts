import { DomainEvent } from '@lzy-plugin/ddd-cqrs';
import { User } from '../aggregate/user';

export class UserRegisteredEvent extends DomainEvent {
  constructor(source: User) {
    super(source);
    this.setCreateTime(new Date());
  }

  toString(): string {
    throw new Error('Method not implemented.');
  }
}
