import { IMidwayApplication } from '@midwayjs/core';
import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { join } from 'path';
import { TestService } from './fixtures//base-app/src/service/test';
describe('/test/index.test.ts', async () => {
  // it('should test http-request', async () => {
  //   let app: IMidwayApplication = await createApp(
  //     join(__dirname, 'fixtures', 'base-app'),
  //     {},
  //     Framework
  //   );
  //   const testService = await app
  //     .getApplicationContext()
  //     .getAsync<TestService>(TestService);
  //   const result = await testService.send('www.baidu.com', {});
  //   expect(result.status).toBe(200);
  //   await close(app);
  // });

  it('should test aliyun sms', async () => {
    let app: IMidwayApplication = await createApp(
      join(__dirname, 'fixtures', 'base-app'),
      {},
      Framework
    );
    const testService = await app
      .getApplicationContext()
      .getAsync<TestService>(TestService);
    await testService.sendSms('13670512437', '666666');
    await close(app);
  });
});
