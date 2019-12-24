import { githubToSlack } from '@atomist/slack-messages';
import { Auto, IPlugin, getCurrentBranch } from '@auto-it/core';
import fetch from 'node-fetch';
import join from 'url-join';

/** Transform markdown into slack friendly text */
const sanitizeMarkdown = (markdown: string) =>
  githubToSlack(markdown)
    .split('\n')
    .map(line => {
      // Strip out the ### prefix and replace it with *<word>* to make it bold
      if (line.startsWith('#')) {
        return `*${line.replace(/^[#]+/, '')}*`;
      }

      return line;
    })
    .join('\n');

interface ISlackPluginOptions {
  /** URL of the slack to post to */
  url: string;
  /** Who to bother when posting to the channel */
  atTarget?: string;
  /** Allow users to opt into having prereleases posted to slack */
  publishPreRelease?: boolean;
}

/** Post your release notes to Slack during `auto release` */
export default class SlackPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Slack';

  /** The options of the plugin */
  readonly options: ISlackPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: ISlackPluginOptions | string) {
    if (typeof options === 'string') {
      this.options = { url: options, atTarget: 'channel' };
    } else {
      this.options = {
        url: options.url ? options.url : '',
        atTarget: options.atTarget ? options.atTarget : 'channel',
        publishPreRelease: options.publishPreRelease
          ? options.publishPreRelease
          : false
      };
    }
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.afterRelease.tapPromise(
      this.name,
      async ({ newVersion, commits, releaseNotes }) => {
        // Avoid publishing on prerelease branches by default, but allow folks to opt in if they care to
        const currentBranch = getCurrentBranch();
        if (
          currentBranch &&
          auto.config?.prereleaseBranches?.includes(currentBranch) &&
          !this.options.publishPreRelease
        ) {
          return;
        }

        if (!newVersion) {
          return;
        }

        const head = commits[0];

        if (!head) {
          return;
        }

        const skipReleaseLabels = (
          auto.config?.labels.filter(l => l.releaseType === 'skip') || []
        ).map(l => l.name);
        const isSkipped = head.labels.find(label =>
          skipReleaseLabels.includes(label)
        );

        if (isSkipped) {
          return;
        }

        if (!this.options.url) {
          throw new Error('Slack url must be set to post a message to slack.');
        }

        await this.postToSlack(auto, newVersion, releaseNotes);
      }
    );
  }

  /** Post the release notes to slack */
  async postToSlack(auto: Auto, newVersion: string, releaseNotes: string) {
    if (!auto.git) {
      return;
    }

    auto.logger.verbose.info('Posting release notes to slack.');

    const project = await auto.git.getProject();
    const body = sanitizeMarkdown(releaseNotes);
    const token = process.env.SLACK_TOKEN;
    const releaseUrl = join(project.html_url, 'releases/tag', newVersion);
    const atTarget = this.options.atTarget;

    if (!token) {
      auto.logger.verbose.warn('Slack may need a token to send a message');
    }

    await fetch(`${this.options.url}${token ? `?token=${token}` : ''}`, {
      method: 'POST',
      body: JSON.stringify({
        text: [
          `@${atTarget}: New release *<${releaseUrl}|${newVersion}>*`,
          body
        ].join('\n'),
        link_names: 1
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    auto.logger.verbose.info('Posted release notes to slack.');
  }
}
