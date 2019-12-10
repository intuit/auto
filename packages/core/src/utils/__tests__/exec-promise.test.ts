import exec from '../exec-promise';

const warn = jest.fn();
const error = jest.fn();

jest.mock('../logger.ts', () => () => ({
  // @ts-ignore
  log: { warn: (...args) => warn(...args) },
  // @ts-ignore
  verbose: { error: (...args) => error(...args) }
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('resolves stdout', async () => {
  expect(await exec('echo', ['foo'])).toBe('foo');
});

test('filters out anything but strings', async () => {
  expect(await exec('echo', ['foo', false, undefined, 'baz'])).toBe('foo baz');
});

test('fails correctly', async () => {
  expect.assertions(1);
  return expect(exec('false')).rejects.toMatchInlineSnapshot(
    `[Error: Running command 'false' with args [] failed]`
  );
});

test('appends stdout and stderr', async () => {
  expect.assertions(1);
  return expect(
    exec('echo', ['foo', '&&', '>&2', 'echo', '"this error"', '&&', 'false'])
  ).rejects.toMatchInlineSnapshot(`
            [Error: Running command 'echo' with args [foo, &&, >&2, echo, "this error", &&, false] failed

            foo


            this error
            ]
          `);
});

test('prints stderr when exec exits without a code', async () => {
  jest.spyOn(console, 'log').mockImplementation();
  await exec('>&2 echo "this error"');

  return expect(warn).toHaveBeenCalledWith('this error\n');
});
