import { githubToSlack } from '@atomist/slack-messages';
import { Auto, IPlugin } from '@auto-it/core';
import fetch from 'node-fetch';
import join from 'url-join';

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
  url: string;
  atTarget?: string;
}

export default class SlackPlugin implements IPlugin {
  name = 'Slack';

  readonly options: ISlackPluginOptions;

  constructor(options: ISlackPluginOptions | string) {
    if (typeof options === 'string') {
      this.options = { url: options, atTarget: 'channel' };
    } else {
      this.options = {
        url: options.url ? options.url : '',
        atTarget: options.atTarget ? options.atTarget : 'channel'
      };
    }
  }

  apply(auto: Auto) {
    auto.hooks.afterRelease.tapPromise(
      this.name,
      async ({ newVersion, commits, releaseNotes }) => {
        if (!newVersion) {
          return;
        }

        if ('dryRun' in auto.options && auto.options.dryRun) {
          return;
        }

        const head = commits[0];

        if (!head) {
          return;
        }

        const isSkipped = head.labels.find(label =>
          auto.release!.options.skipReleaseLabels.includes(label)
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
        // eslint-disable-next-line camelcase
        link_names: 1
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    auto.logger.verbose.info('Posted release notes to slack.');
  }
}
