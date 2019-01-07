import NPMPlugin from '../../plugins/npm';
import loadPlugin from '../load-plugins';

describe('loadPlugins', () => {
  test('should use supported plugin', async () => {
    expect(loadPlugin('npm')).toEqual(NPMPlugin);
  });

  test('should require custom plugins', async () => {
    expect(loadPlugin('./__tests__/test-plugin.ts')).toBeDefined();
  });

  test('should require custom plugins -- fallback to cwd', async () => {
    expect(loadPlugin('./src/utils/__tests__/test-plugin.ts')).toBeDefined();
  });
});
