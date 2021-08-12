import {  Provide, Scope, ScopeEnum } from '@midwayjs/decorator';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TestService {
  sayHello(): void {
    console.log('hello world!');
  }
}
