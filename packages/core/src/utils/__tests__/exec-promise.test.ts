import exec from '../exec-promise';

test('resolves stdout', async () => {
  expect(await exec('echo', ['foo'])).toBe('foo');
});

test('filters out anything but strings', async () => {
  expect(await exec('echo', ['foo', false, undefined, 'baz'])).toBe('foo baz');
});

test('fails correctly', async () => {
  expect.assertions(1);
  return expect(exec('false')).rejects.toMatchInlineSnapshot(
    `[Error: Running command 'false' failed]`
  );
});

test('appends stdout and stderr', async () => {
  expect.assertions(1);
  return expect(
    exec('echo', ['foo', '&&', '>&2', 'echo', '"this error"', '&&', 'false'])
  ).rejects.toMatchInlineSnapshot(`
[Error: Running command 'echo' failed

foo


this error
]
`);
});

test('prints stderr when exec exits without a code', async () => {
  jest.spyOn(console, 'log').mockImplementation();
  await exec('>&2 echo "this error"');

  return expect(console.log).toHaveBeenCalledWith('this error\n');
});
