import packageConfig from '../src/package-config';

let readResult = {};

jest.mock('../src/utils', () => ({
  loadPackageJson: () => readResult
}));

let parseResult: object | undefined = {};

jest.mock('parse-github-url', () => () => parseResult);

test('should throw without a repo', async () => {
  expect.assertions(1);

  await expect(packageConfig()).rejects.toStrictEqual(
    new Error('Cannot read repo info from package.json')
  );
});

test('should throw without an owner', async () => {
  expect.assertions(1);
  readResult = {
    repository: { url: 'fake.com' }
  };
  parseResult = undefined;

  await expect(packageConfig()).rejects.toStrictEqual(
    new Error(
      'Cannot read owner and package name from GitHub URL in package.json'
    )
  );
});

test('should throw without an package name', async () => {
  expect.assertions(1);
  readResult = {
    repository: { url: 'fake.com' }
  };
  parseResult = {
    owner: 'black-panther'
  };

  await expect(packageConfig()).rejects.toStrictEqual(
    new Error(
      'Cannot read owner and package name from GitHub URL in package.json'
    )
  );
});

test('should correctly parse package info', async () => {
  readResult = {
    version: '1.0.0',
    repository: { url: 'fake.com/black-panther/operation-foo' }
  };
  parseResult = {
    owner: 'black-panther',
    name: 'operation-foo'
  };

  expect(await packageConfig()).toStrictEqual({
    repo: 'operation-foo',
    owner: 'black-panther'
  });
});

test('should correctly parse package info - string', async () => {
  readResult = {
    version: '1.0.0',
    repository: 'black-panther/operation-foo'
  };
  parseResult = {
    owner: 'black-panther',
    name: 'operation-foo'
  };

  expect(await packageConfig()).toStrictEqual({
    repo: 'operation-foo',
    owner: 'black-panther'
  });
});
