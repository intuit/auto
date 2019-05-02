import loadPlugin from '../load-plugins';
import { dummyLog } from '../logger';

const logger = dummyLog();

describe('loadPlugins', () => {
  test('should use supported plugin', async () => {
    expect(loadPlugin(['foobar', {}], logger)).toBeUndefined();
  });

  test('should use supported plugin', async () => {
    expect(loadPlugin(['npm', {}], logger)).toEqual({
      forcePublish: true,
      name: 'NPM',
      setRcToken: true
    });
  });

  test('should require custom plugins -- fallback to cwd', async () => {
    expect(
      loadPlugin(['./src/utils/__tests__/test-plugin.ts', {}], logger)
    ).toEqual({
      name: 'foo',
      config: {}
    });
  });

  test('should load config', async () => {
    expect(
      loadPlugin(
        ['./src/utils/__tests__/test-plugin.ts', 'do the thing'],
        logger
      )
    ).toEqual({
      name: 'foo',
      config: 'do the thing'
    });
  });
});
