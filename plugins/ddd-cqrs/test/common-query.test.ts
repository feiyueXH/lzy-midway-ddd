import { IMidwayApplication } from '@midwayjs/core';
import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { join } from 'path';
import { stringifyQuery } from '../src';
// const sleep = (time: number) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => resolve(true), time);
//   });
// };
let cookies = [
  'userInfo={"userId":"609c963fccc2fe53dc91e9ac"}; path=/; max-age=3600; expires=Thu, 13 May 2021 04:00:16 GMT; httponly',
  'userInfo.sig=jKBTN8HF5OkKxfB_efRHsL1D-rbmWw2bXfH-sFGNv1c; path=/; max-age=3600; expires=Thu, 13 May 2021 04:00:16 GMT; httponly'
];
describe('test/controller/home.test.ts', () => {
  let app: IMidwayApplication;

  beforeAll(async () => {
    app = await createApp(
      join(__dirname, 'fixtures', 'base-app'),
      {},
      Framework
    );
    // await sleep(3000);
  });

  afterAll(async () => {
    // close app
    await close(app);
  });

  it('should Get /', async () => {
    // // make request
    const result = await createHttpRequest(app)
      .get('/users')
      .set('Cookie', cookies)
      .query(
        stringifyQuery({
          fields: ['phoneNumber', 'password'], //返回字段
          filter: {
            // phoneNumber: '16215641745'
          }, //筛选参数
          options: {
            limit: 2,
            skip: 0,
            sort: { _id: 'asc' }
          }
        })
      );
    // use expect by jest
    console.log(result.body);
    expect(result.status).toBe(200);
  });
});

