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
export default async function getLernaPackages() {
  const packages: LernaPackage[] = [];
  const response = await execPromise("npx", ["lerna", "ls", "-pla"]);

  response.split("\n").forEach((packageInfo) => {
    const [packagePath, name, version] = packageInfo.split(":");

    if (version !== "MISSING") {
      packages.push({ path: packagePath, name, version });
    }
  });

  return packages;
}
