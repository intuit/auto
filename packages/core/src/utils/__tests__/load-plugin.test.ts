import path from 'path';
import loadPlugin from '../load-plugins';
import { dummyLog } from '../logger';

const logger = dummyLog();

describe('loadPlugins', () => {
  test('should require custom plugins -- fallback to cwd', async () => {
    expect(
      loadPlugin([path.join(__dirname, './test-plugin.ts'), {}], logger)
    ).toEqual({
      name: 'foo',
      config: {}
    });
  });

  test('should load config', async () => {
    expect(
      loadPlugin(
        [path.join(__dirname, './test-plugin.ts'), 'do the thing'],
        logger
      )
    ).toEqual({
      name: 'foo',
      config: 'do the thing'
    });
  });
});
