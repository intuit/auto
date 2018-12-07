import run from '../main';

test('throws error for unknown args', () => {
  expect(
    run({
      command: 'foo'
    })
  ).rejects.toEqual(new Error(`idk what i'm doing.`));
});
