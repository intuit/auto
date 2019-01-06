import { AutoRelease, run } from '../main';

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

const defaults = {
  owner: 'foo',
  repo: 'bar',
  token: 'XXXX'
};

const search = jest.fn();
jest.mock('cosmiconfig', () => () => ({
  search
}));

describe('AutoRelease', () => {
  test('should use args', async () => {
    const auto = new AutoRelease({ command: 'init', ...defaults });
    await auto.loadConfig();
    expect(auto.githubRelease).toBeDefined();
  });

  test('should load config', async () => {
    search.mockReturnValueOnce({ config: defaults });
    const auto = new AutoRelease({ command: 'init' });
    await auto.loadConfig();
    expect(auto.githubRelease).toBeDefined();
  });

  test('should use labels from config config', async () => {
    search.mockReturnValueOnce({
      config: {
        ...defaults,
        labels: {
          major: 'Version: Major',
          patch: 'Version: Patch',
          minor: 'Version: Minor'
        }
      }
    });
    const auto = new AutoRelease({ command: 'init' });
    await auto.loadConfig();

    expect([...auto.semVerLabels!.values()]).toEqual([
      'Version: Major',
      'Version: Minor',
      'Version: Patch',
      'skip-release',
      'release',
      'prerelease'
    ]);
  });
});
