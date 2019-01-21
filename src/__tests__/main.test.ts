import main, { run } from '../main';

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

test('throws exits for caught error', async () => {
  console.log = jest.fn() as any;
  process.exit = jest.fn() as any;

  await main({
    command: 'foo'
  });

  expect(process.exit).toHaveBeenCalledWith(1);
});
