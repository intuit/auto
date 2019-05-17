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
  } = {}
): IExtendedCommit => ({
  hash: options.hash || 'foo',
  labels: options.labels || [],
  authorName: options.name || 'Adam Dierkens',
  authorEmail: options.email || 'adam@dierkens.com',
  authors: [
    {
      name: options.name || 'Adam Dierkens',
      email: options.email || 'adam@dierkens.com'
    }
  ],
  subject,
  packages: options.packages
});

export default makeCommitFromMsg;
