declare module 'gitlog' {
  export interface ICommit {
    hash: string;
    authorName: string;
    authorEmail?: string;
    subject: string;
    rawBody?: string;
    labels?: string[];
  }

  interface IGitlogOptions {
    repo: string;
    fields: string[];
    branch: string;
  }

  export default function gitlog(
    options: IGitlogOptions,
    callback: (err: Error, res: ICommit[]) => void
  ): void;
}
