import Config from '../config';
import { dummyLog } from '../utils/logger';

const log = dummyLog();

const importMock = jest.fn();
jest.mock('import-cwd', () => (path: string) => importMock(path));

describe('loadExtendConfig', () => {
  test('should work when no config found', async () => {
    const config = new Config(log);
    expect(config.loadExtendConfig('nothing')).toEqual({});
  });

  test('should load file path', async () => {
    const config = new Config(log);

    importMock.mockImplementation(path =>
      path === '../fake/path.json' ? { jira: 'url' } : undefined
    );
    expect(config.loadExtendConfig('../fake/path.json')).toEqual({
      jira: 'url'
    });
  });

  test('should load @NAME/auto-config', async () => {
    const config = new Config(log);

    importMock.mockImplementation(path =>
      path === '@artsy/auto-config'
        ? { onlyPublishWithReleaseLabel: true }
        : undefined
    );

    expect(config.loadExtendConfig('@artsy')).toEqual({
      onlyPublishWithReleaseLabel: true
    });
  });

  test('should load auto-config-NAME', async () => {
    const config = new Config(log);

    importMock.mockImplementation(path =>
      path === 'auto-config-fuego' ? { noVersionPrefix: true } : undefined
    );

    expect(config.loadExtendConfig('fuego')).toEqual({
      noVersionPrefix: true
    });
  });
  test('should load extend config from function', async () => {
    const config = new Config(log);

    importMock.mockImplementation(path =>
      path === '../fake/path.js' ? () => ({ slack: 'url' }) : undefined
    );

    expect(config.loadExtendConfig('../fake/path.js')).toEqual({
      slack: 'url'
    });
  });
});
