import fetch from 'node-fetch';
import join from 'url-join';

const sanitizeMarkdown = (markdown: string) =>
  markdown
    .split('\n')
    .map(line => line.replace(/\[([\s\S]+)\]\([\S\s]+\)/, (_, label) => label))
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
  const body = `\`\`\`${sanitizeMarkdown(releaseNotes)}\`\`\``;
  const token = process.env.SLACK_TOKEN;
  const url = `${join(
    options.baseUrl,
    options.owner,
    options.repo,
    'releases/tag',
    options.tag
  )}\n`;

  if (!token) {
    return Promise.reject(new Error('Slack needs a token to send a message'));
  }

  return fetch(`${options.slackUrl}?token=${token}`, {
    method: 'POST',
    body: JSON.stringify({
      text: [`@channel: New release *${options.tag}*`, url, body].join('\n'),
      // eslint-disable-next-line camelcase
      link_names: 1
    }),
    headers: { 'Content-Type': 'application/json' }
  });
}
