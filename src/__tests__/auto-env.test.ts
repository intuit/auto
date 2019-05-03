import Auto from '../auto';

jest.mock('fs', () => ({
  readFileSync: () => 'FOO="test value"',
  closeSync: () => undefined,
  existsSync: () => true,
  readFile: () => undefined,
  ReadStream: () => undefined,
  WriteStream: () => undefined,
  writeFile: () => undefined
}));

test('should load .env file and override and env vars that are already set', async () => {
  process.env.FOO = 'old value';

  const auto = new Auto({
    command: 'init',
    owner: 'foo',
    repo: 'bar'
  });

  expect(auto).toBeDefined();
  expect(process.env.FOO).toBe('test value');
});
