import { IExtendedCommit } from '../log-parse';

/** Construct a dummy commit for testing. */
const makeCommitFromMsg = (
  subject: string,
  options: {
    /** Name of the committer */
    name?: string;
    /** Hash of the commit */
    hash?: string;
    /** Email of the committer */
    email?: string;
    /** Labels on the commit */
    labels?: string[];
    /** Username of the committer */
    username?: string;
    /** Packages effected by the commit */
    packages?: string[];
    /** The type of user */
    type?: 'Bot' | 'User';
    /** PR info for the commit */
    pullRequest?: {
      /** PR number attached to commit */
      number: number;
    };
    /** Files included in commit */
    files?: string[];
  } = {}
): IExtendedCommit => ({
  hash: options.hash || 'foo',
  labels: options.labels || [],
  authorName:
    options.name !== undefined && options.name !== null
      ? options.name
      : 'Adam Dierkens',
  authorEmail: options.email || 'adam@dierkens.com',
  files: options.files || [],
  authors: [
    {
      type: options.type,
      name:
        options.name !== undefined && options.name !== null
          ? options.name
          : 'Adam Dierkens',
      email: options.email || 'adam@dierkens.com',
      ...(options.username ? { username: options.username } : {})
    }
  ],
  subject,
  pullRequest: options.pullRequest
});

export default makeCommitFromMsg;
