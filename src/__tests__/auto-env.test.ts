import AutoRelease from '../auto';

jest.mock('fs', () => ({
  readFileSync: () => 'FOO="test value"',
  closeSync: () => undefined,
  existsSync: () => undefined,
  readFile: () => undefined,
  ReadStream: () => undefined,
  WriteStream: () => undefined,
  writeFile: () => undefined
}));

test('should load .env file', async () => {
  const auto = new AutoRelease({
    command: 'init',
    owner: 'foo',
    repo: 'bar'
  });

  expect(auto).toBeDefined();
  expect(process.env.FOO).toBe('test value');
});
