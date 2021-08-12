import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { join } from 'path';

describe('/test/index.test.ts', () => {
  it('should connnect mongodb', async () => {
    let app = await createApp(
      join(__dirname, 'fixtures', 'base-app'),
      {},
      Framework
    );
    await close(app);
  });
});
