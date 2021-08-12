import { IMidwayApplication } from '@midwayjs/core';
import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { join } from 'path';
import {
  executeTest,
  HTTP_METHOD,
  TestModel,
  TestModelItem
} from '../src/lib/util';

const array = new Array<TestModelItem>();
array.push({
  name: '测试用例1',
  path: '/test',
  method: HTTP_METHOD.GET,
  expectArray: [
    // {
    //   type: 'fixedExpect',
    //   key: 'status',
    //   rule: EXCEPT_RULE.TO_BE,
    //   value: 200
    // },
    // {
    //   type: 'fixedExpect',
    //   key: 'body.message',
    //   rule: EXCEPT_RULE.TO_BE,
    //   value: 'hello world'
    // },
    {
      type: 'customExpect',
      callback: (result) => {
        expect(result.status).toBe(200);
      }
    }
  ]
});

const testModel: TestModel = {
  name: '测试封装的测试工具',
  array: array
};

executeTest(testModel, {
  async beforeAll(): Promise<IMidwayApplication> {
    let app = await createApp(
      join(__dirname, 'fixtures', 'base-app'),
      {},
      Framework
    );
    return app;
  },
  async afterAll(app: IMidwayApplication): Promise<void> {
    await close(app);
  }
});
