import { run } from '../main';

test('throws error for unknown args', async () => {
  expect.assertions(1);

  try {
    await run({
      command: 'foo'
    });
  } catch (error) {
    expect(error).toEqual(new Error("idk what i'm doing."));
  }
});
