import { IMidwayApplication } from '@midwayjs/core';
import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { join } from 'path';
const sleep = (time: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), time);
  });
};
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
    await sleep(3000);
  });

  afterAll(async () => {
    // close app
    await close(app);
  });

  it('should Post /', async () => {
    // // make request
    const result = await createHttpRequest(app)
      .post('/users')
      .set('Cookie', cookies)
      .send({
        username: 'lzy' + Date.now(),
        password: 'lzy123456',
        operatorId: '123'
      });
    // // use expect by jest
    expect(result.status).toBe(200);
  });
});
