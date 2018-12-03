declare module 'parse-git' {
  export interface ICommit {
    id: string;
    author: {
      name: string;
      email?: string;
    };
    comment: string;
  }
  function parseGit(lines: string): ICommit[];
}
