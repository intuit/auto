import { Auto, IPlugin, SEMVER } from '@auto-it/core';
import dedent from 'dedent';
import { diff, ReleaseType } from 'semver';
import twitter from 'tweet-tweet';
import tweetValidation from 'twitter-text';
import { promisify } from 'util';

interface ITwitterPluginOptions {
  message: string;
  threshold: SEMVER;
}

const defaults: ITwitterPluginOptions = {
  threshold: SEMVER.minor,
  message: dedent`
    A new %release version of %package was released!

    %notes

    %link
  `
};

const RELEASE_PRECEDENCE: ReleaseType[] = ['patch', 'minor', 'major'];

const isGreaterThan = (a: ReleaseType, b: ReleaseType) =>
  RELEASE_PRECEDENCE.indexOf(a) > RELEASE_PRECEDENCE.indexOf(b);

const removeLastLine = (text: string) =>
  text
    .split('\n')
    .slice(0, -1)
    .join('\n')
    .trim();

interface MakeTweetArgs {
  releaseNotes: string;
  message: string;
  versionBump: ReleaseType;
  newVersion: string;
  repo: string;
  url: string;
}

const makeTweet = ({
  releaseNotes,
  message,
  versionBump,
  newVersion,
  repo,
  url
}: MakeTweetArgs) => {
  const build = (notes: string) =>
    message
      .replace('%release', versionBump)
      .replace('%package', repo)
      .replace('%version', newVersion)
      .replace('%notes', notes)
      .replace('%link', url);

  let truncatedNotes = releaseNotes
    .split('#### Authors')[0]
    .replace(/#### /gm, '')
    .replace(/\(?\[\S+\]\(\S+\)/gm, '')
    .trim();
  let tweet = build(truncatedNotes);

  while (!tweetValidation.parseTweet(tweet).valid) {
    truncatedNotes = removeLastLine(truncatedNotes);
    tweet = build(dedent`
      ${truncatedNotes}
      …
    `);
  }

  return tweet;
};

export default class TwitterPlugin implements IPlugin {
  name = 'Twitter';

  readonly options: ITwitterPluginOptions;
  private readonly tweet: (message: string) => Promise<void>;

  constructor(options: Partial<ITwitterPluginOptions> = {}) {
    this.options = { ...defaults, ...options };

    if (
      !process.env.TWITTER_ACCESS_TOKEN ||
      !process.env.TWITTER_ACCESS_TOKEN_SECRET ||
      !process.env.TWITTER_CONSUMER_KEY ||
      !process.env.TWITTER_CONSUMER_KEY_SECRET
    ) {
      throw new Error(
        'Need all of the following secrets available on the environment: TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_KEY_SECRET'
      );
    }

    this.tweet = promisify(
      twitter({
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_KEY_SECRET
      })
    );
  }

  apply(auto: Auto) {
    auto.hooks.afterRelease.tapPromise(
      this.name,
      async ({ newVersion, lastRelease, response, releaseNotes }) => {
        if (!newVersion || !response || !auto.git) {
          return;
        }

        const versionBump = diff(newVersion, lastRelease) || 'patch';

        if (isGreaterThan(this.options.threshold as ReleaseType, versionBump)) {
          return;
        }

        await this.tweet(
          makeTweet({
            releaseNotes,
            message: this.options.message,
            versionBump,
            newVersion,
            repo: auto.git.options.repo,
            url: response.data.html_url
          })
        );
      }
    );
  }
}
