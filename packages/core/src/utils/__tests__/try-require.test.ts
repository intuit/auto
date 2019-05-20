import tryRequire from '../try-require';

jest.mock('test', () => 'success', {
  virtual: true
});

jest.mock('npm', () => 'success', {
  virtual: true
});

describe('try require', () => {
  test('should fall back to normal require', async () => {
    expect(tryRequire('test')).toBe('success');
  });

  test('should not fall back to normal require for npm', async () => {
    expect(tryRequire('npm')).not.toBe('success');
  });

  test('should return nothing if not found', async () => {
    expect(tryRequire('foobar')).toBeUndefined();
  });
});
