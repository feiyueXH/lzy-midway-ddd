import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TestService {
  getMessage(): string {
    return 'hello world';
  }
}
