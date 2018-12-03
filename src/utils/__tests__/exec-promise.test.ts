import exec from '../exec-promise';

test('resolves stdout', async () => {
  expect(await exec('echo foo')).toBe('foo');
});

// Some tools log to stderr even with no error
test.skip('throws stderr', async () => {
  expect.assertions(1);

  try {
    await exec('echo error 1>&2');
  } catch (error) {
    expect(error.message.trim()).toBe('error');
  }
});
