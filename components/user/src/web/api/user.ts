// eslint-disable-next-line node/no-extraneous-import
import {
  ALL,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Provide,
  Put,
  Queries
} from '@midwayjs/decorator';
import { CreateApiDoc } from '@midwayjs/swagger';
import {
  CommonException,
  CommonQuery,
  ExceptionCodeEnum,
  isNotUndefined,
  parseQuery,
  replaceStr,
  SuperController,
  ValidateMessages
} from '@lzy-plugin/ddd-cqrs';
import { plainToClass } from 'class-transformer';
import { BindPhoneNumberCommand } from '../../application/command/bind-phone-number.command';
import { ChangePasswordCommand } from '../../application/command/change-password.command';
import { RegisterUserCommand } from '../../application/command/register-user.command';
import { LoginUserQuery } from '../../application/query/login-user.query';
import { UserModel } from '../../infrastructure/db/mongo/models/user';

@Controller('/users')
@Provide()
export class UserController extends SuperController {
  @(CreateApiDoc()
    .summary('注册用户')
    .description('这是一个注册用户接口')
    .param('body参数', {
      type: 'object',
      description: '注册用户表单参数',
      example: {
        phoneNumber: '1367xxxxxxx',
        password: 'Ykx123456'
      }
    })
    .build())
  @Post('/actions/register')
  async registerUser(@Body(ALL) body: any): Promise<void> {
    //接收所有参数
    this.logger.info(body);
    const command: RegisterUserCommand = plainToClass(
      RegisterUserCommand,
      body,
      { excludeExtraneousValues: true }
    );
    await this.commandBus.send(command, { dbKey: 'admin' });
    //处理成功,响应请求
    this.httpHelper.success(null, 'OK');
  }

  @Post('/actions/login')
  async login(@Body(ALL) body: any): Promise<void> {
    //发起注册账号命令
    const query = plainToClass(LoginUserQuery, body, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true
    });
    const user: UserModel = await this.queryBus.send(query, { dbKey: 'admin' });
    this.ctx.cookies.set(
      'userInfo',
      JSON.stringify({
        userId: user._id
      }),
      {
        maxAge: 3600000
      }
    );
    //处理成功,响应请求
    this.httpHelper.success(null, 'OK');
  }

  @Post('/actions/logout')
  async logout(): Promise<void> {
    const userInfo = this.ctx.cookies.set('userInfo', null);
    this.httpHelper.success(userInfo, 'OK');
  }

  @Put('/:userId/actions/changePassword')
  async changePassword(
    @Param('userId') userId: string,
    @Body(ALL) body: any
  ): Promise<void> {
    if (!body.verificationCode) {
      throw new CommonException(
        ExceptionCodeEnum.VALIDATE_FAIL,
        'verificationCode不能为空'
      );
    }

    if (body.verificationCode !== '111111') {
      throw new CommonException(ExceptionCodeEnum.UNKNOWN_ERR, '验证码错误');
    }

    const command = plainToClass(
      ChangePasswordCommand,
      {
        ...body,
        userId: userId
      },
      { excludeExtraneousValues: true, exposeDefaultValues: true }
    );
    await this.commandBus.send(command, { dbKey: 'admin' });
    this.httpHelper.success(null, 'OK');
  }

  @Put('/:userId/actions/bindPhoneNumber')
  async bindPhoneNumber(
    @Param('userId') userId: string,
    @Body(ALL) body: any
  ): Promise<void> {
    if (!body.verificationCode) {
      throw new CommonException(
        ExceptionCodeEnum.VALIDATE_FAIL,
        'verificationCode不能为空'
      );
    }

    if (body.verificationCode !== '111111') {
      throw new CommonException(ExceptionCodeEnum.UNKNOWN_ERR, '验证码错误');
    }

    const command = plainToClass(
      BindPhoneNumberCommand,
      {
        ...body,
        userId: userId
      },
      { excludeExtraneousValues: true, exposeDefaultValues: true }
    );
    await this.commandBus.send(command, { dbKey: 'admin' });
    this.httpHelper.success(null, 'OK');
  }

  @Get('/')
  public async list(@Queries(ALL) queries: any) {
    const json = parseQuery(queries); //将参数转化为符合通查询规范的json结构
    const commonQuery: CommonQuery<UserModel> = plainToClass(
      CommonQuery,
      json,
      {
        excludeExtraneousValues: true
      }
    );
    const result = await this.queryUtil.find('admin', commonQuery, UserModel);
    const count = await this.queryUtil.count('admin', commonQuery, UserModel);
    this.httpHelper.success({ list: result, count: count });
  }

  @(CreateApiDoc()
    .summary('get user')
    .description('获取单个用户详情')
    .param('param id', {
      required: true,
      example: '123456'
    })
    .param('query', {
      description:
        'hello world通用查询文档:https://stjy.yuque.com/zmvqpo/agghed/ikglz8#qzmJQ',
      example: {
        //将json结构转为url参数
        fields: ['phoneNumber', 'password'], //返回字段
        filter: {
          create_at: {
            $lt: Date.now(),
            $gt: Date.now() - 12 * 3600 * 1000
          },
          $or: [{ phoneNumber: { $regex: '^136' } }]
        }, //筛选参数
        options: {
          sort: {
            create_at: 'desc'
          },
          limit: 10,
          skip: 0
        } //执行参数
      }
    })
    .build())
  @Get('/:id')
  public async get(@Param('id') id: string, @Queries(ALL) queries: any) {
    const json = parseQuery(queries); //将参数转化为符合通查询规范的json结构
    const commonQuery: CommonQuery<UserModel> = plainToClass(
      CommonQuery,
      json,
      {
        excludeExtraneousValues: true
      }
    );
    if (!isNotUndefined(id)) {
      throw new CommonException(
        ExceptionCodeEnum.VALIDATE_FAIL,
        replaceStr(ValidateMessages.base_isNotEmpty, { property: 'id' })
      );
    }
    const result = await this.queryUtil.findById(
      'admin',
      id,
      commonQuery,
      UserModel
    );
    if (!result) {
      throw new CommonException(
        ExceptionCodeEnum.DB_FAIL_FIND_NOTFOUND,
        '查无数据'
      );
    }
    this.httpHelper.success(result);
  }
}
