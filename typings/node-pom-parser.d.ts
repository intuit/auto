declare module "pom-parser" {
  interface IDeveloper {
    name: string;
    email: string;
  }

  interface IScm {
    connection: string;
    url: string;
    tag: string;
  }

  export interface IPom {
    pomXml: string;
    pomObject: {
      project: {
        version?: string;
        scm: IScm | IScm[];
        developers?: {
          developer?: IDeveloper | IDeveloper[];
        };
      };
    };
  }

  export function parse(
    options: { filePath: string },
    cb: (err: Error, pom: IPom) => void
  ): void;
}
