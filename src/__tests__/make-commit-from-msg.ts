import { IExtendedCommit } from '../log-parse';

const makeCommitFromMsg = (
  comment: string,
  options: {
    name?: string;
    email?: string;
    labels?: string[];
    username?: string;
    packages?: string[];
  } = {}
): IExtendedCommit => ({
  id: 'foo',
  labels: options.labels || [],
  author: {
    name: options.name || 'Adam Dierkens',
    email: options.email || 'adam@dierkens.com'
  },
  authors: [
    {
      name: options.name || 'Adam Dierkens',
      email: options.email || 'adam@dierkens.com'
    }
  ],
  comment,
  packages: options.packages
});

export default makeCommitFromMsg;
