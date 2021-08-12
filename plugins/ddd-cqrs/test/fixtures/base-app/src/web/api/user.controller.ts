import {
  ALL,
  Body,
  Controller,
  Get,
  Post,
  Provide,
  Queries
} from '@midwayjs/decorator';
import { plainToClass } from 'class-transformer';
import {
  CommonQuery,
  SuperController,
  parseQuery
} from '../../../../../../src';
import { RegisterUserCommand } from '../../application/command/register-user.command';
import { UserModel } from '../../infrastructure/db/mongo/models/user';

@Controller('/users')
@Provide()
export class UserController extends SuperController {
  @Post('/')
  async registerUser(@Body(ALL) body: any): Promise<void> {
    const command: RegisterUserCommand = plainToClass(
      RegisterUserCommand,
      body,
      { excludeExtraneousValues: true }
    );
    await this.commandBus.send(command, { dbKey: 'admin' });
    this.httpHelper.success();
  }

  @Get('/')
  async listUser(@Queries(ALL) queries: any): Promise<void> {
    const params = parseQuery(queries);
    const result = await this.queryUtil.find(
      'admin',
      plainToClass(CommonQuery, params, {
        excludeExtraneousValues: true
      }),
      UserModel
    );
    this.httpHelper.success(result, 'OK');
  }
}
