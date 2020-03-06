import path from 'path';
import loadPlugin from '../load-plugins';
import { dummyLog } from '../logger';

const logger = dummyLog();

jest.mock(
  'auto-plugin-foo',
  () => ({
    default: class {
      name = 'foo';
    }
  }),
  {
    virtual: true
  }
);
jest.mock(
  '@my-scope/auto-plugin-bar',
  () => ({
    default: class {
      name = 'bar';
    }
  }),
  { virtual: true }
);
jest.mock(
  '@auto-it/baz',
  () => ({
    default: class {
      name = 'baz';
    }
  }),
  {
    virtual: true
  }
);

describe('loadPlugins', () => {
  test('should load official plugins', () => {
    expect(loadPlugin(['baz', {}], logger)?.name).toBe('baz');
    expect(loadPlugin(['@auto-it/baz', {}], logger)?.name).toBe('baz');
  });

  test('should load community plugins', () => {
    expect(loadPlugin(['foo', {}], logger)?.name).toBe('foo');
    expect(loadPlugin(['auto-plugin-foo', {}], logger)?.name).toBe('foo');
  });

  test('should load scoped plugins', () => {
    expect(loadPlugin(['@my-scope/auto-plugin-bar', {}], logger)?.name).toBe(
      'bar'
    );
  });

  test('should require custom plugins -- fallback to cwd', () => {
    expect(
      loadPlugin([path.join(__dirname, './test-plugin.ts'), {}], logger)
    ).toStrictEqual(
      expect.objectContaining({
        name: 'foo',
        config: {}
      })
    );
  });

  test('should require custom plugins -- surface errors', () => {
    expect(() =>
      loadPlugin(
        [path.join(__dirname, './test-plugin-malformed.js'), {}],
        logger
      )
    ).toThrow();
  });

  test('should load config', () => {
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
