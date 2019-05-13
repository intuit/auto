import Config from '../config';
import { dummyLog } from '../utils/logger';

const fetchSpy = jest.fn();

// @ts-ignore
jest.mock('node-fetch', () => (...args) => fetchSpy(...args));

beforeEach(() => {
  fetchSpy.mockClear();
});

const log = dummyLog();

const importMock = jest.fn();
jest.mock('import-cwd', () => (path: string) => importMock(path));

describe('loadExtendConfig', () => {
  test('should reject when no config found', async () => {
    const config = new Config(log);
    await expect(config.loadExtendConfig('nothing')).rejects.toBeInstanceOf(
      Error
    );
  });

  test('should load file path', async () => {
    const config = new Config(log);

    importMock.mockImplementation(path =>
      path === '../fake/path.json' ? { someOption: 'url' } : undefined
    );
    expect(await config.loadExtendConfig('../fake/path.json')).toEqual({
      someOption: 'url'
    });
  });

  test('should load package.json file from path', async () => {
    const config = new Config(log);

    importMock.mockImplementation(path =>
      path === './package.json' ? { auto: { someOption: 'url' } } : undefined
    );
    expect(await config.loadExtendConfig('./package.json')).toEqual({
      someOption: 'url'
    });
  });

  test('should fail if file path points to js file', async () => {
    const config = new Config(log);
    importMock.mockImplementation(path =>
      path === '../fake/path.js' ? { someOption: 'url' } : undefined
    );
    await expect(
      config.loadExtendConfig('../fake/path.js')
    ).rejects.toBeInstanceOf(Error);
  });

  test('should call fetch on URL with config', async () => {
    const config = new Config(log);
    const mockFetchJson = jest.fn();
    mockFetchJson.mockReturnValue({});

    fetchSpy.mockResolvedValueOnce({
      json: mockFetchJson
    });

    // tslint:disable-next-line:no-http-string
    await config.loadExtendConfig('http://www.test.com/config.json');
    expect(fetchSpy).toHaveBeenCalled();
    expect(mockFetchJson).toHaveBeenCalled();
  });

  test('should reject if extends URL fails to fetch', async () => {
    const config = new Config(log);

    fetchSpy.mockRejectedValueOnce(new Error());
    await expect(
      // tslint:disable-next-line:no-http-string
      config.loadExtendConfig('http://www.test.com/config.json')
    ).rejects.toBeInstanceOf(Error);
  });

  test('should load @NAME/auto-config', async () => {
    const config = new Config(log);

    importMock.mockImplementation(path =>
      path === '@artsy/auto-config/package.json'
        ? { auto: { onlyPublishWithReleaseLabel: true } }
        : undefined
    );

    expect(await config.loadExtendConfig('@artsy')).toEqual({
      onlyPublishWithReleaseLabel: true
    });
  });

  test('should load auto-config-NAME', async () => {
    const config = new Config(log);

    importMock.mockImplementation(path =>
      path === 'auto-config-fuego/package.json'
        ? { auto: { noVersionPrefix: true } }
        : undefined
    );

    expect(await config.loadExtendConfig('fuego')).toEqual({
      noVersionPrefix: true
    });
  });
});
