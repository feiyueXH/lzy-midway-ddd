import {
  executeTest,
  HTTP_METHOD,
  TestModel,
  TestModelItem
} from '@lzy-plugin/test-util';
import { ExceptionCodeEnum, UserExceptionCodeEnum } from '@lzy-plugin/ddd-cqrs';
import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { IMidwayApplication } from '@midwayjs/core';
import { join } from 'path';
const array = new Array<TestModelItem>();
let cookies = [
  'userInfo={"userId":"609c963fccc2fe53dc91e9ac"}; path=/; max-age=3600; expires=Thu, 13 May 2021 04:00:16 GMT; httponly',
  'userInfo.sig=jKBTN8HF5OkKxfB_efRHsL1D-rbmWw2bXfH-sFGNv1c; path=/; max-age=3600; expires=Thu, 13 May 2021 04:00:16 GMT; httponly'
];
const phoneNumber = `${Math.round(Date.now() / 100)}`;
const newPhoneNumber = `${Math.round(Date.now() / 100) + 1}`;

// /**
//  * 设置cookie值
//  * @param name 名称
//  * @param value 名称对应值
//  * @param Hours 过期时间
//  */
// const createCookieData = (name: string, value: string, hours: number) => {
//   var date = new Date(); //获取当前时间
//   var expiresDays = hours; //将date设置为n天以后的时间
//   date.setTime(date.getTime() + expiresDays * 3600 * 1000); //格式化为cookie识别的时间
//   const cookie = name + '=' + value + ';expires=' + date.toUTCString(); //设置cookie
//   return cookie;
// };

array.push(
  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:注册时手机号为空',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: '',
      //username: phoneNumber,
      password: 'Ykx123456'
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain('phoneNumber不能为空');
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:使用不符合手机号格式的手机号进行注册',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: '12345',
      //username: phoneNumber,
      password: 'Ykx123456'
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'phoneNumber不符合手机号码格式'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:使用不符合手机号格式的手机号进行注册',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: 'NewUser12345678901234567890',
      //username: phoneNumber,
      password: 'Ykx123456'
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'phoneNumber不符合手机号码格式'
          );
        }
      }
    ]
  },
  // {
  //   name: '接口名:/users/actions/register 请求方式:POST 测试内容:账号不能为空',
  //   path: '/users/actions/register',
  //   method: HTTP_METHOD.POST,
  //   body: {
  //     phoneNumber: phoneNumber,
  //     //username: '',
  //     password: 'Ykx123456'
  //   },
  //   groups: ['post'],
  //   expectArray: [
  //     {
  //       type: 'customExpect',
  //       callback: (result) => {
  //         expect(result.status).toBe(500);
  //         expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
  //         expect(result.body.messageArray).toContain('username不能为空');
  //       }
  //     }
  //   ]
  // },
  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:注册用户时密码为空',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: phoneNumber,
      //username: phoneNumber,
      password: ''
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain('password不能为空');
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:使用少于6位或超过18位的密码进行注册',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: phoneNumber,
      //username: phoneNumber,
      password: '12345'
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'password字符串长度限制在范围[6,20]'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:使用少于6位或超过18位的密码进行注册',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: phoneNumber,
      //username: phoneNumber,
      password: 'NewUser12345678901234567890'
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'password字符串长度限制在范围[6,20]'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:使用不包含大写字母、小写字母和数字的密码进行注册',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: phoneNumber,
      //username: phoneNumber,
      password: '123456'
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'password格式必须是大小写字母、数字的组合，不允许使用特殊字符'
          );
        }
      }
    ]
  },

  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:使用不包含大写字母、小写字母和数字的密码进行注册',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: phoneNumber,
      //username: phoneNumber,
      password: 'a12345'
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'password格式必须是大小写字母、数字的组合，不允许使用特殊字符'
          );
        }
      }
    ]
  },

  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:使用不包含大写字母、小写字母和数字的密码进行注册',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: phoneNumber,
      //username: phoneNumber,
      password: 'A12345'
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'password格式必须是大小写字母、数字的组合，不允许使用特殊字符'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:使用包含特殊字符的密码进行注册',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: phoneNumber,
      //username: phoneNumber,
      password: 'Abc123456@'
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'password格式必须是大小写字母、数字的组合，不允许使用特殊字符'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:注册用户成功',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: phoneNumber,
      //username: phoneNumber,
      password: 'Ykx123456'
    },
    groups: ['post', 'success'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(200);
        }
      }
    ]
  },
  // {
  //   name: '接口名:/users/actions/register 请求方式:POST 测试内容:使用已注册的账号进行注册',
  //   path: '/users/actions/register',
  //   method: HTTP_METHOD.POST,
  //   body: {
  //     phoneNumber: newPhoneNumber,
  //     //username: phoneNumber,
  //     password: 'Ykx123456'
  //   },
  //   groups: ['post'],
  //   expectArray: [
  //     {
  //       type: 'customExpect',
  //       callback: (result) => {
  //         expect(result.status).toBe(500);
  //         expect(result.body.code).toBe(ExceptionCodeEnum.DB_FAIL_UNIQUE.code);
  //         expect(result.body.messageArray).toContain('账号已注册');
  //       }
  //     }
  //   ]
  // },
  {
    name: '接口名:/users/actions/register 请求方式:POST 测试内容:使用已注册的手机号进行注册',
    path: '/users/actions/register',
    method: HTTP_METHOD.POST,
    body: {
      phoneNumber: phoneNumber,
      //username: newPhoneNumber,
      password: 'Ykx123456'
    },
    groups: ['post'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.DB_FAIL_UNIQUE.code);
          expect(result.body.messageArray).toContain('手机号已注册');
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/login 请求方式:POST 测试内容:登录时账号为空',
    path: '/users/actions/login',
    method: HTTP_METHOD.POST,
    body: {
      loginCode: '',
      password: 'Abc123456'
    },
    groups: ['login'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
        }
      },
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/login 请求方式:POST 测试内容:登录时密码为空',
    path: '/users/actions/login',
    method: HTTP_METHOD.POST,
    body: {
      loginCode: phoneNumber,
      password: ''
    },
    groups: ['login'],
    expectArray: [
      {
        type: 'customExpect',

        callback: (result) => {
          expect(result.status).toBe(500);
        }
      },
      {
        type: 'customExpect',

        callback: (result) => {
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/login 请求方式:POST 测试内容:登录时使用未注册的手机号',
    path: '/users/actions/login',
    method: HTTP_METHOD.POST,
    body: {
      loginCode: '13330000000',
      password: 'Ykx123456'
    },
    groups: ['login'],
    expectArray: [
      {
        type: 'customExpect',

        callback: (result) => {
          expect(result.status).toBe(500);
        }
      },
      {
        type: 'customExpect',

        callback: (result) => {
          expect(result.body.code).toBe(
            UserExceptionCodeEnum.LOGIN_CODE_NOT_EXIST.code
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/login 请求方式:POST 测试内容:密码错误',
    path: '/users/actions/login',
    method: HTTP_METHOD.POST,
    body: {
      loginCode: phoneNumber,
      password: 'Ykx1234567'
    },
    groups: ['login'],
    expectArray: [
      {
        type: 'customExpect',

        callback: (result) => {
          expect(result.status).toBe(500);
        }
      },
      {
        type: 'customExpect',

        callback: (result) => {
          expect(result.body.code).toBe(
            UserExceptionCodeEnum.PASSWORD_ERROR.code
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/login 请求方式:POST 测试内容:登录成功',
    path: '/users/actions/login',
    method: HTTP_METHOD.POST,
    body: {
      loginCode: phoneNumber,
      password: 'Ykx123456'
    },
    groups: ['login'],
    expectArray: [
      {
        type: 'customExpect',

        callback: (result) => {
          cookies = result.header['set-cookie'];
          expect(result.status).toBe(200);
        }
      }
    ]
  },
  {
    name: '接口名:/users/actions/logout 请求方式:POST 测试内容:退出登录',
    path: '/users/actions/logout',
    method: HTTP_METHOD.POST,
    setCookie: cookies,
    groups: ['logout'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          console.log(result.header);
          expect(result.status).toBe(200);
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT 测试内容:无权限修改密码',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      newPassword: 'Ykx1234567',
      verificationCode: ''
    },
    groups: ['changePassword'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(401);
          expect(result.body.code).toBe(ExceptionCodeEnum.NO_PERMISSION.code);
          expect(result.body.messageArray).toContain('无权限');
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT 测试内容:未指定userId修改密码',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: undefined
    },
    body: {
      newPassword: 'Ykx1234567',
      verificationCode: '111111'
    },
    setCookie: cookies,
    groups: ['changePassword'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain('userId不能为undefined');
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT 测试内容:调用修改密码接口时,验证码为空',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      newPassword: 'Ykx1234567',
      verificationCode: ''
    },
    groups: ['changePassword'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'verificationCode不能为空'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT 测试内容:调用修改密码接口时,输入错误的验证码',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      newPassword: 'Ykx1234567',
      verificationCode: '000000'
    },
    groups: ['changePassword'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.UNKNOWN_ERR.code);
          expect(result.body.messageArray).toContain('验证码错误');
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT  测试内容:修改密码时键入空的密码',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      newPassword: '',
      verificationCode: '111111'
    },
    groups: ['changePassword'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain('newPassword不能为空');
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT  测试内容:使用少于6位或超过18位的密码修改密码',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    setCookie: cookies,
    body: {
      newPassword: '12345',
      verificationCode: '111111'
    },
    groups: ['changePassword'],
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'newPassword字符串长度限制在范围[6,20]'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT  测试内容:使用少于6位或超过18位的密码修改密码',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      newPassword: 'NewUser12345678901234567890',
      verificationCode: '111111'
    },
    groups: ['changePassword'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'newPassword字符串长度限制在范围[6,20]'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT  测试内容:使用不包含大写字母、小写字母和数字的密码修改密码',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      newPassword: '123456',
      verificationCode: '111111'
    },
    groups: ['changePassword'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'newPassword格式必须是大小写字母、数字的组合，不允许使用特殊字符'
          );
        }
      }
    ]
  },

  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT 测试内容:使用不包含大写字母、小写字母和数字的密码修改密码',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      newPassword: 'a12345',
      verificationCode: '111111'
    },
    groups: ['changePassword'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'newPassword格式必须是大小写字母、数字的组合，不允许使用特殊字符'
          );
        }
      }
    ]
  },

  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT  测试内容:使用不包含大写字母、小写字母和数字的密码修改密码',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      newPassword: 'A12345',
      verificationCode: '111111'
    },
    groups: ['changePassword'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'newPassword格式必须是大小写字母、数字的组合，不允许使用特殊字符'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/changePassword 请求方式:PUT  测试内容:使用包含特殊字符的密码修改密码',
    path: '/users/:userId/actions/changePassword',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      newPassword: 'Abc123456@',
      verificationCode: '111111'
    },
    groups: ['changePassword'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'newPassword格式必须是大小写字母、数字的组合，不允许使用特殊字符'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/bindPhoneNumber 请求方式:PUT  测试内容:绑定手机号未指定用户id',
    path: '/users/:userId/actions/bindPhoneNumber',
    method: HTTP_METHOD.PUT,
    param: {
      userId: undefined
    },
    body: {
      phoneNumber: newPhoneNumber,
      verificationCode: '111111'
    },
    groups: ['bindPhoneNumber'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain('userId不能为undefined');
        }
      }
    ]
  },

  {
    name: '接口名:/users/:userId/actions/bindPhoneNumber 请求方式:PUT  测试内容:绑定手机号时手机号为空',
    path: '/users/:userId/actions/bindPhoneNumber',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      phoneNumber: '',
      verificationCode: '111111'
    },
    groups: ['bindPhoneNumber'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',

        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain('phoneNumber不能为空');
        }
      },
      {
        type: 'customExpect',

        callback: (result) => {}
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/bindPhoneNumber 请求方式:PUT  测试内容:绑定手机号时使用错误的手机号',
    path: '/users/:userId/actions/bindPhoneNumber',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      phoneNumber: '123456789',
      verificationCode: '111111'
    },
    groups: ['bindPhoneNumber'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.VALIDATE_FAIL.code);
          expect(result.body.messageArray).toContain(
            'phoneNumber不符合手机号码格式'
          );
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/bindPhoneNumber 请求方式:PUT  测试内容:绑定手机号成功',
    path: '/users/:userId/actions/bindPhoneNumber',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71a4e78e80d30f09640af'
    },
    body: {
      phoneNumber: newPhoneNumber,
      verificationCode: '111111'
    },
    groups: ['bindPhoneNumber', 'test'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',

        callback: (result) => {
          expect(result.status).toBe(200);
        }
      }
    ]
  },
  {
    name: '接口名:/users/:userId/actions/bindPhoneNumber 请求方式:PUT  测试内容:绑定手机号使用已绑定的手机号',
    path: '/users/:userId/actions/bindPhoneNumber',
    method: HTTP_METHOD.PUT,
    param: {
      userId: '60a71aeb86d0cf32a0fa8b55'
    },
    body: {
      phoneNumber: newPhoneNumber,
      verificationCode: '111111'
    },
    groups: ['bindPhoneNumber', 'test'],
    setCookie: cookies,
    expectArray: [
      {
        type: 'customExpect',
        callback: (result) => {
          expect(result.status).toBe(500);
          expect(result.body.code).toBe(ExceptionCodeEnum.DB_FAIL_UNIQUE.code);
          expect(result.body.messageArray).toContain('手机号已注册');
        }
      }
    ]
  }
);

const testModel: TestModel = {
  name: '用户中心功能测试用例',
  array: array
};

executeTest(testModel, {
  async beforeAll(): Promise<IMidwayApplication> {
    //创建app实例
    let app = await createApp(
      join(__dirname, 'fixtures', 'base-app'),
      {},
      Framework
    );
    return app;
  },
  async afterAll(app: IMidwayApplication) {
    //关闭app实例
    await close(app);
  },
  // groups: ['post', 'login']
  // groups: ['logout']
  // groups: ['changePassword']
  // groups: ['test']
  groups: ['success']
}); //执行测试
