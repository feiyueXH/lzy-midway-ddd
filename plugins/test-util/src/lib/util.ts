import { IMidwayApplication } from '@midwayjs/core';
import { createHttpRequest } from '@midwayjs/mock';

/**
 * 请求方式枚举 -lzy
 */
export enum HTTP_METHOD {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DELETE = 'delete'
}

/**
 * 验证规则枚举
 */
export enum EXCEPT_RULE {
  TO_BE = 'toBe', //相等
  TO_CONTAIN = 'toContain' //包含
}

//固定的期望结果
export interface FixedExpect {
  type: 'fixedExpect';
  //固定的期望结果
  label?: string; //期望结果描述
  key: string; //result.data.code //结果使用键值字符串 格式:result.*.*
  not?: boolean; //结果是否取反
  rule: EXCEPT_RULE; //判断规则
  value: any; //期望值
  // groups?: string[]; //分组
}

/**
 * 判断是否有实现FixedExpect接口
 * @param object
 * @returns
 */
function instanceOfFixedExpect(object: any): object is FixedExpect {
  return object.type === 'fixedExpect';
}

//自定义期待结果
export interface CustomExpect {
  type: 'customExpect';
  label?: string; //期望结果描述
  // groups?: string[]; //分组
  callback: (result: any, app: IMidwayApplication) => void;
}

/**
 * 校验是否实现CustomExpect接口
 * @param object
 * @returns
 */
function instanceOfCustomExpect(object: any): object is CustomExpect {
  return object.type === 'customExpect';
}

/**
 * 测试模型子项
 */
export interface TestModelItem {
  name: string;
  path: string;
  method: HTTP_METHOD;
  param?: { [prop: string]: any };
  body?: { [prop: string]: any };
  query?: { [prop: string]: any } | string;
  expectArray: Array<FixedExpect | CustomExpect>;
  setCookie?: any;
  groups?: string[];
}

/**
 * 测试用例模型
 */
export interface TestModel {
  name: string;
  array: TestModelItem[];
}

/**
 * 方法接口
 */
export interface Method {
  name: string;
  args:
    | {
        [prop: string]: any;
      }
    | any;
}

/**
 * 解析key,获取深度对象值
 * @param obj
 * @param key
 * @returns
 */
const deepObject = (obj: object, key: string) => {
  if (typeof obj !== 'object') {
    return obj;
  }

  let value = obj;
  const keys = key.split('.');
  keys.forEach((item) => {
    value = value[item];
  });
  return value;
};

/**
 * 求数组交集
 * @param a
 * @param b
 * @returns
 */
const intersection = (a: any[], b: any[]): any[] => {
  const s = new Set(b);
  return [...new Set(a)].filter((x) => s.has(x));
};

const chainingCall = (target, methods, index = 0) => {
  if (index < methods.length) {
    const method = methods[index];
    const func = deepObject(target, method.name);
    if (func instanceof Function) {
      if (method.args instanceof Array) {
        target = func.apply(target, method.args);
      } else {
        target = func.call(target, method.args);
      }
      return chainingCall(target, methods, ++index);
    } else {
      throw new Error(`${target}不存在函数:${method.name}`);
    }
  } else {
    return target;
  }
};

export interface ExecuteOption {
  groups?: string[];
  beforeAll: () => Promise<IMidwayApplication>;
  afterAll: (app: IMidwayApplication) => Promise<void>;
}
const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time);
  });
};
/**
 * 执行测试
 * @param model
 */
export const executeTest = (model: TestModel, executeOption: ExecuteOption) => {
  describe(model.name, () => {
    let app: IMidwayApplication;
    beforeAll(async () => {
      console.log('beforeAll');
      app = await executeOption.beforeAll();
      await sleep(2000); //延时2秒 避免服务启动的时候有东西未加载完毕
    });

    afterAll(async () => {
      await executeOption.afterAll(app);
    });

    /**
     * 测试方法
     * @param item
     */
    const testFunc = async (item: TestModelItem, option?: ExecuteOption) => {
      const executeGroups = option && option.groups ? option.groups : null;
      //没有指定执行分组,不做任何拦截
      //拦截情况1：当执行分组不为空时，没有指定测试用例的分组将被拦截
      //拦截情况2：当执行分组不为空时，测试用例的分组不在执行分组将被拦截
      if (
        !!executeGroups &&
        (!item.groups || intersection(executeGroups, item.groups).length === 0)
      ) {
        return false;
      }

      it(item.name, async () => {
        //1、将param参数替换进path
        if (item.param) {
          for (const key in item.param) {
            const regexp = new RegExp(':' + key, 'g');
            item.path = item.path.replace(
              regexp,
              typeof item.param[key] === 'object'
                ? item.param[key].toString()
                : item.param[key]
            );
          }
        }

        //2、添加链式方法数组
        const methods = new Array<Method>();
        methods.push({ name: item.method, args: item.path });
        //确认是否需要调用query函数
        !!item.query && methods.push({ name: 'query', args: item.query });
        //确认是否需要调用send函数
        !!item.body && methods.push({ name: 'send', args: item.body });
        //确实是否需要设置cookie
        !!item.setCookie &&
          methods.push({ name: 'set', args: ['Cookie', item.setCookie] });
        //3、链式调用
        console.log('app:', app);
        const result = await chainingCall(createHttpRequest(app), methods);

        for (const expectItem of item.expectArray) {
          // if (
          //   !executeGroups ||
          //   !expectItem.groups ||
          //   intersection(executeGroups, expectItem.groups).length === 0
          // ) {
          //   continue;
          // }

          if (instanceOfFixedExpect(expectItem)) {
            const methods = new Array<Method>();
            methods.push({
              name: (expectItem.not ? 'not.' : '') + expectItem.rule,
              args: expectItem.value
            });

            chainingCall(expect(deepObject(result, expectItem.key)), methods);
          } else if (instanceOfCustomExpect(expectItem)) {
            expectItem.callback(result, app);
          }
        }
      });
    };

    for (const item of model.array) {
      testFunc(item, executeOption);
    }
  });
};
