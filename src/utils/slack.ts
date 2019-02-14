import { githubToSlack } from '@atomist/slack-messages';
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

interface IPostToSlackOptions {
  tag: string;
  owner: string;
  repo: string;
  slackUrl: string;
  baseUrl: string;
}

export default async function postToSlack(
  releaseNotes: string,
  options: IPostToSlackOptions
) {
  const body = sanitizeMarkdown(releaseNotes);
  const token = process.env.SLACK_TOKEN;
  const url = join(
    options.baseUrl,
    options.owner,
    options.repo,
    'releases/tag',
    options.tag
  );

  if (!token) {
    return Promise.reject(new Error('Slack needs a token to send a message'));
  }

  return fetch(`${options.slackUrl}?token=${token}`, {
    method: 'POST',
    body: JSON.stringify({
      text: [`@channel: New release *<${url}|${options.tag}>*`, body].join(
        '\n'
      ),
      // eslint-disable-next-line camelcase
      link_names: 1
    }),
    headers: { 'Content-Type': 'application/json' }
  });
}
