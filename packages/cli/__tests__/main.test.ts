import main, { run } from '../src/run';

test('throws error for unknown args', async () => {
  await expect(run('foo', {})).rejects.toStrictEqual(
    new Error("idk what i'm doing.")
  );
});

test('throws exits for caught error', async () => {
  console.log = jest.fn() as any;
  process.exit = jest.fn() as any;

  await main('foo', {});

  expect(process.exit).toHaveBeenCalledWith(1);
});
