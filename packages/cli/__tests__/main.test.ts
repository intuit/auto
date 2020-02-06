import main, { run } from '../src/run';

test('throws error for unknown args', async () => {
  process.exit = jest.fn() as any;
  console.log = jest.fn() as any;

  await run('foo', {});

  expect(process.exit).toHaveBeenCalledWith(1);
});

test('throws exits for caught error', async () => {
  console.log = jest.fn() as any;
  process.exit = jest.fn() as any;

  await main('foo', {});

  expect(process.exit).toHaveBeenCalledWith(1);
});
