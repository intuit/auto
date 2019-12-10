import Auto, { SEMVER } from '@auto-it/core';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';
import endent from 'endent';
import TwitterPlugin from '../src';

const tweet = jest.fn();
// @ts-ignore
jest.mock('tweet-tweet', () => () => (m, cb) => tweet(m, cb()));
const mockResponse = {
  data: { html_url: 'https://foo.com' }
} as any;
const mockGit = {
  options: { repo: 'Test-Repo' }
} as any;

test('Twitter Plugin should throw without proper tokens set', async () => {
  expect(() => new TwitterPlugin()).toThrow();
});

describe('Twitter Plugin', () => {
  beforeAll(() => {
    process.env.TWITTER_ACCESS_TOKEN = '1';
    process.env.TWITTER_ACCESS_TOKEN_SECRET = '2';
    process.env.TWITTER_CONSUMER_KEY = '3';
    process.env.TWITTER_CONSUMER_KEY_SECRET = '4';
  });

  beforeEach(() => {
    tweet.mockReset();
  });

  test('should not throw with env variables set', async () => {
    expect(() => new TwitterPlugin()).not.toThrow();
  });

  test('should do nothing without a new version', async () => {
    const plugin = new TwitterPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, git: mockGit } as Auto);
    await hooks.afterRelease.promise({
      commits: [],
      releaseNotes: '',
      lastRelease: '1.0.0'
    });

    expect(tweet).not.toHaveBeenCalled();
  });

  test("should do nothing if the threshold isn't met", async () => {
    const plugin = new TwitterPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, git: mockGit } as Auto);
    await hooks.afterRelease.promise({
      newVersion: '1.0.1',
      commits: [],
      releaseNotes: '',
      lastRelease: '1.0.0',
      response: mockResponse
    });

    expect(tweet).not.toHaveBeenCalled();
  });

  test('should post message if threshold met', async () => {
    const plugin = new TwitterPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, git: mockGit } as Auto);
    await hooks.afterRelease.promise({
      newVersion: '1.1.0',
      commits: [],
      releaseNotes: '',
      lastRelease: '1.0.0',
      response: mockResponse
    });

    expect(tweet).toHaveBeenCalled();
  });

  test("should still work if version doesn't change", async () => {
    const plugin = new TwitterPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, git: mockGit } as Auto);
    await hooks.afterRelease.promise({
      newVersion: '1.0.0',
      commits: [],
      releaseNotes: '',
      lastRelease: '1.0.0',
      response: mockResponse
    });

    expect(tweet).not.toHaveBeenCalled();
  });

  test('should be able to configure threshold', async () => {
    const plugin = new TwitterPlugin({ threshold: SEMVER.major });
    const hooks = makeHooks();

    plugin.apply({ hooks, git: mockGit } as Auto);
    await hooks.afterRelease.promise({
      newVersion: '1.1.0',
      commits: [],
      releaseNotes: '',
      lastRelease: '1.0.0',
      response: mockResponse
    });

    expect(tweet).not.toHaveBeenCalled();
  });

  test('should be able to configure message', async () => {
    const plugin = new TwitterPlugin({
      message: endent`
        v%version of %package was released!

        %link
      `
    });
    const hooks = makeHooks();

    plugin.apply({ hooks, git: mockGit } as Auto);
    await hooks.afterRelease.promise({
      newVersion: '1.1.0',
      commits: [],
      releaseNotes: '',
      lastRelease: '1.0.0',
      response: mockResponse
    });

    expect(tweet.mock.calls[0][0]).toMatchSnapshot();
  });

  test('should post correct message', async () => {
    const plugin = new TwitterPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, git: mockGit } as Auto);
    await hooks.afterRelease.promise({
      newVersion: '1.1.0',
      commits: [],
      releaseNotes: endent`
        #### 🐛  Bug Fix

        - fix jira PR titles without additional subject [#404](https://github.com/intuit/auto/pull/404) ([@hipstersmoothie](https://github.com/hipstersmoothie))

        #### 📝  Documentation

        - update docs for canary [#402](https://github.com/intuit/auto/pull/402) ([@hipstersmoothie](https://github.com/hipstersmoothie))

        #### Authors: 1

        - Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
      `,
      lastRelease: '1.0.0',
      response: mockResponse
    });

    expect(tweet.mock.calls[0][0]).toMatchSnapshot();
  });

  test('should handle long release notes', async () => {
    const plugin = new TwitterPlugin();
    const hooks = makeHooks();

    plugin.apply({ hooks, git: mockGit } as Auto);
    await hooks.afterRelease.promise({
      newVersion: '1.1.0',
      commits: [],
      releaseNotes: endent`
        #### 🐛  Bug Fix

        - fix jira PR titles without additional subject [#404](https://github.com/intuit/auto/pull/404) ([@hipstersmoothie](https://github.com/hipstersmoothie))
        - split off useless hash from version [#387](https://github.com/intuit/auto/pull/387) ([@hipstersmoothie](https://github.com/hipstersmoothie))

        #### 📝  Documentation

        - update docs for canary [#402](https://github.com/intuit/auto/pull/402) ([@hipstersmoothie](https://github.com/hipstersmoothie))

        #### 🔩 Dependency Updates

        - update deps for things greenkeeper failed on [#385](https://github.com/intuit/auto/pull/385) ([@hipstersmoothie](https://github.com/hipstersmoothie))

        #### Authors: 1

        - Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
      `,
      lastRelease: '1.0.0',
      response: mockResponse
    });

    expect(tweet.mock.calls[0][0]).toMatchSnapshot();
  });
});
