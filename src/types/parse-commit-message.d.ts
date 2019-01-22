declare module 'parse-commit-message' {
  interface IHeader {
    type: string;
    scope?: string | null;
    subject: string;
  }

  interface ICommit {
    header: IHeader;
    body?: string | null;
    footer?: string | null;
    isBreaking?: boolean;
    increment: string | boolean;
  }

  type Plugin = (commit: ICommit) => ICommit;

  export const plugins: Plugin[];
  export function parse(commitSubjects: string[]): ICommit[];
  export function applyPlugins(plugins: Plugin[], commits: ICommit[]): Commit[];
}
