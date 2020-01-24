import path from 'path';
import loadPlugin from '../load-plugins';
import { dummyLog } from '../logger';

const logger = dummyLog();

describe('loadPlugins', () => {
  test('should require custom plugins -- fallback to cwd', async () => {
    expect(
      loadPlugin([path.join(__dirname, './test-plugin.ts'), {}], logger)
    ).toStrictEqual(
      expect.objectContaining({
        name: 'foo',
        config: {}
      })
    );
  });

  test('should require custom plugins -- surface errors', async () => {
    expect(() =>
      loadPlugin(
        [path.join(__dirname, './test-plugin-malformed.js'), {}],
        logger
      )
    ).toThrow();
  });

  test('should load config', async () => {
    expect(
      loadPlugin(
        [path.join(__dirname, './test-plugin.ts'), 'do the thing'],
        logger
      )
    ).toStrictEqual(
      expect.objectContaining({
        name: 'foo',
        config: 'do the thing'
      })
    );
  });
});
