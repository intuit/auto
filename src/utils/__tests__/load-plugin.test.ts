import loadPlugin from '../load-plugins';

describe('loadPlugins', () => {
  test('should use supported plugin', async () => {
    expect(loadPlugin(['foobar', {}])).toBeUndefined();
  });

  test('should use supported plugin', async () => {
    expect(loadPlugin(['npm', {}])).toEqual({ name: 'NPM' });
  });

  test('should require custom plugins', async () => {
    expect(loadPlugin(['./__tests__/test-plugin.ts', {}])).toEqual({
      name: 'foo',
      config: {}
    });
  });

  test('should load config', async () => {
    expect(loadPlugin(['./__tests__/test-plugin.ts', 'do the thing'])).toEqual({
      name: 'foo',
      config: 'do the thing'
    });
  });

  test('should require custom plugins -- fallback to cwd', async () => {
    expect(loadPlugin(['./src/utils/__tests__/test-plugin.ts', {}])).toEqual({
      name: 'foo',
      config: {}
    });
  });
});
