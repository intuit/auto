import token from '../github-token';

const origHome = process.env.HOME;

let existsResult = false;
let readResult = '';

jest.mock('registry-url', () => () => '//registry.yarnpkg.com/');

jest.mock('fs', () => ({
  // @ts-ignore
  readFile: (a, b, cb) => {
    cb(null, readResult);
  },
  existsSync: () => existsResult
}));

test('should throw if HOME undefined', async () => {
  expect.assertions(1);

  delete process.env.GH_TOKEN;
  delete process.env.HOME;

  try {
    await token();
  } catch (error) {
    expect(error.message.trim()).toBe(
      "Can't find the GH_TOKEN. No HOME defined."
    );
  }
});

test('should throw if no rc', async () => {
  expect.assertions(1);

  process.env.HOME = origHome;
  delete process.env.GH_TOKEN;

  try {
    await token();
  } catch (error) {
    expect(error.message.trim()).toBe("Can't find a GitHub token to use.");
  }
});

test('should try to use token in RC file', async () => {
  expect.assertions(1);

  existsResult = true;
  delete process.env.GH_TOKEN;

  try {
    await token();
  } catch (error) {
    expect(error.message.trim()).toBe('No token in the .npmrc.');
  }
});

test('should use token in RC file', async () => {
  delete process.env.GH_TOKEN;
  process.env.HOME = origHome;

  existsResult = true;
  readResult = '//registry.yarnpkg.com/:_authToken=123456789';

  expect(await token()).toBe('123456789');
});

test('should use process GH_TOKEN', async () => {
  process.env.GH_TOKEN = 'test';
  expect(await token()).toBe('test');
  process.env.GH_TOKEN = undefined;
});
