import { Auto, IPlugin, SEMVER } from '@auto-it/core';
import endent from 'endent';
import { diff, ReleaseType } from 'semver';
import twitter from 'tweet-tweet';
import tweetValidation from 'twitter-text';
import { promisify } from 'util';

interface ITwitterPluginOptions {
  /** The message template to use to post to Twitter */
  message: string;
  /** A threshold the semver has to pass to be posted to Twitter */
  threshold: SEMVER;
}

const defaults: ITwitterPluginOptions = {
  threshold: SEMVER.minor,
  message: endent`
    A new %release version of %package was released!

    %notes

    %link
  `
};

const RELEASE_PRECEDENCE: ReleaseType[] = ['patch', 'minor', 'major'];

/** Determine the release with the biggest semver change */
const isGreaterThan = (a: ReleaseType, b: ReleaseType) =>
  RELEASE_PRECEDENCE.indexOf(a) > RELEASE_PRECEDENCE.indexOf(b);

/** Remove the last line of text from a multiline string */
const removeLastLine = (text: string) =>
  text
    .split('\n')
    .slice(0, -1)
    .join('\n')
    .trim();

interface MakeTweetArgs {
  /** The generated release notes for the release */
  releaseNotes: string;
  /** The message template to use to post to Twitter */
  message: string;
  /** The semver bump applied to the version */
  versionBump: ReleaseType;
  /** The new version to release (already bumped) */
  newVersion: string;
  /** GitHub project to operate on */
  repo: string;
  /** A url to link to the release */
  url: string;
}

/** Construct a tweet that contains the release notes across multiple tweets */
const makeTweet = ({
  releaseNotes,
  message,
  versionBump,
  newVersion,
  repo,
  url
}: MakeTweetArgs) => {
  /** Replace all the variables in the message */
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
    tweet = build(endent`
      ${truncatedNotes}
      …
    `);
  }

  return tweet;
};

/** Post your release notes to twitter during `auto release` */
export default class TwitterPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Twitter';

  /** The options of the plugin */
  readonly options: ITwitterPluginOptions;

  /** Send a tweet */
  private readonly tweet: (message: string) => Promise<void>;

  /** Initialize the plugin with it's options */
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

  /** Tap into auto plugin points. */
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
