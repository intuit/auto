import { IExtendedCommit } from '../log-parse';

const makeCommitFromMsg = (
  subject: string,
  options: {
    name?: string;
    hash?: string;
    email?: string;
    labels?: string[];
    username?: string;
    packages?: string[];
    pullRequest?: {
      number: number;
    };
  } = {}
): IExtendedCommit => ({
  hash: options.hash || 'foo',
  labels: options.labels || [],
  authorName:
    options.name !== undefined && options.name !== null
      ? options.name
      : 'Adam Dierkens',
  authorEmail: options.email || 'adam@dierkens.com',
  files: [],
  authors: [
    {
      name:
        options.name !== undefined && options.name !== null
          ? options.name
          : 'Adam Dierkens',
      email: options.email || 'adam@dierkens.com',
      ...(options.username ? { username: options.username } : {})
    }
  ],
  subject,
  packages: options.packages,
  pullRequest: options.pullRequest
});

export default makeCommitFromMsg;
