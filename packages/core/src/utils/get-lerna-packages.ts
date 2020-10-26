import execPromise from "./exec-promise";

export interface LernaPackage {
  /** Path to package */
  path: string;
  /** Name of package */
  name: string;
  /** Version of package */
  version: string;
}

/** Get all of the packages in the lerna monorepo */
export default async function getLernaPackages(): Promise<LernaPackage[]> {
  return execPromise("npx", ["lerna", "ls", "-pla"]).then((res) =>
    res.split("\n").map((packageInfo) => {
      const [packagePath, name, version] = packageInfo.split(":");
      return { path: packagePath, name, version };
    })
  );
}
