declare module 'gitlogplus' {
  interface IGitlogOptions {
    /**
     *
     */
    repo: string;
    /**
     *
     */
    fields: string[];
    /**
     *
     */
    branch: string;
    /**
     *
     */
    number: number;
    /**
     *
     */
    execOptions: {
      /**
       *
       */
      maxBuffer: number;
    };
  }

  export default function gitlog<T>(
    options: IGitlogOptions,
    callback: (err: Error, res: T[]) => void
  ): void;
}
