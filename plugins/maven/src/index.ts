import { Auto, execPromise, IPlugin } from "@auto-it/core";
import parseGitHubUrl from "parse-github-url";
import path from "path";
import { promisify } from "util";
import * as t from "io-ts";
import * as glob from "fast-glob";
import { IDeveloper, parse } from "pom-parser";
import { inc, ReleaseType } from "semver";
import fs from "fs";
import * as xml2js from "xml2js";
import { validatePluginConfiguration } from "@auto-it/core/dist/auto";

const snapshotSuffix = "-SNAPSHOT";

/** Ensure a value is an array **/
const arrayify = <T>(arg: T | T[]): T[] => (Array.isArray(arg) ? arg : [arg]);
/** Parse the pom.xml file **/
const parsePom = promisify(parse);
/** Write the pom.xml file **/
const writeFile = promisify(fs.writeFile);

/** Get the maven pom.xml for a project **/
const getPom = async (filePath: string = path.join(process.cwd(), "pom.xml")) =>
  parsePom({ filePath: filePath });

/** Write the pom.xml file **/
const writePom = async (
  content: string,
  filePath: string = path.join(process.cwd(), "pom.xml")
) => writeFile(filePath, content);

/** Xml to Js **/
const xmlToJs = (content: string) => xml2js.parseStringPromise(content);

/** Js to Xml **/
const jsToXml = (content: string) => {
  const builder = new xml2js.Builder();
  return builder.buildObject(content);
};

const pluginOptions = t.partial({
  /** The maven binary to release the project with **/
  mavenCommand: t.string,

  /** A list of maven command customizations to pass to maven **/
  mavenOptions: t.array(t.string),

  /** A list of maven goals to pass to maven for release **/
  mavenReleaseGoals: t.array(t.string),

  /** Path to maven settings file **/
  mavenSettings: t.string,

  /**
   * The username to use when deploying to the maven repository
   *
   * @deprecated since 9.38.0
   **/
  mavenUsername: t.string,

  /**
   * The password to use when deploying to the maven repository
   *
   * @deprecated since 9.38.0
   **/
  mavenPassword: t.string,
});

export type IMavenPluginOptions = t.TypeOf<typeof pluginOptions>;

export interface IMavenProperties {
  /** version **/
  version?: string;

  /** git repository owner **/
  owner?: string;

  /** git repository **/
  repo?: string;

  /** the author **/
  developer?: IDeveloper;
}

/** Deploy project to maven repository */
export default class MavenPlugin implements IPlugin {
  /** The name of the plugin */
  readonly name = "maven";

  /** The options of the plugin **/
  private readonly options: Required<IMavenPluginOptions>;

  /** cached properties **/
  private properties: IMavenProperties = {};

  /** should this release be a snapshot release **/
  private snapshotRelease = false;

  /** Initialize the plugin with its options **/
  constructor(options: IMavenPluginOptions = {}) {
    const {
      MAVEN_COMMAND,
      MAVEN_OPTIONS,
      MAVEN_RELEASE_GOALS,
      MAVEN_SETTINGS,
      MAVEN_PASSWORD,
      MAVEN_USERNAME,
    } = process.env;
    this.options = {
      mavenCommand:
        MAVEN_COMMAND ||
        (options?.mavenCommand ? options.mavenCommand : "/usr/bin/mvn"),
      mavenOptions: MAVEN_OPTIONS?.split(" ") || options.mavenOptions || [],
      mavenReleaseGoals:
        MAVEN_RELEASE_GOALS?.split(" ") ||
        (options?.mavenReleaseGoals
          ? options.mavenReleaseGoals
          : ["deploy", "site-deploy"]),
      mavenUsername: MAVEN_USERNAME || options.mavenUsername || "",
      mavenPassword: MAVEN_PASSWORD || options.mavenPassword || "",
      mavenSettings: MAVEN_SETTINGS || options.mavenSettings || "",
    };
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.beforeRun.tapPromise(this.name, async () => {
      auto.logger.verbose.warn(`Running "beforeRun"`);
      this.properties = await MavenPlugin.getProperties();
      const { version = "" } = this.properties;
      if (version?.endsWith(snapshotSuffix)) {
        this.snapshotRelease = true;
      }
    });

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () =>
      auto.prefixRelease(await this.getVersion(auto))
    );

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      auto.logger.verbose.warn(`Running "getAuthor"`);
      const { developer } = this.properties;
      auto.logger.verbose.info(
        `Found author information in pom.xml: ${developer}`
      );
      return developer;
    });

    auto.hooks.getRepository.tapPromise(this.name, async () => {
      auto.logger.verbose.warn(`Running "getRepository"`);
      const { owner, repo } = this.properties;
      auto.logger.verbose.info(
        `Found repo information in pom.xml: ${owner}/${repo}`
      );
      return {
        owner: owner,
        repo: repo,
      };
    });

    auto.hooks.version.tapPromise(this.name, async (version) => {
      auto.logger.verbose.warn(`Running "version"`);
      const previousVersion = await this.getVersion(auto);
      const releaseVersion =
        // After release we bump the version by a patch and add -SNAPSHOT
        // Given that we do not need to increment when versioning, since
        // it has already been done
        this.snapshotRelease && version === "patch"
          ? previousVersion
          : inc(previousVersion, version as ReleaseType);

      if (releaseVersion) {
        await this.updatePoms(releaseVersion, auto);

        const newVersion = auto.prefixRelease(releaseVersion);

        // Ensure tag is on this commit, changelog will be added automatically
        await execPromise("git", [
          "tag",
          newVersion,
          "-m",
          `"Update version to ${newVersion}"`,
        ]);
      }
    });

    auto.hooks.publish.tapPromise(this.name, async () => {
      auto.logger.verbose.warn(`Running "publish"`);
      await execPromise(this.options.mavenCommand, [
        ...this.options.mavenOptions,
        ...this.options.mavenReleaseGoals,
        this.options?.mavenSettings ? `-s=${this.options.mavenSettings}` : "",
        this.options?.mavenUsername
          ? `-Dusername=${this.options.mavenUsername}`
          : "",
        this.options?.mavenPassword
          ? `-Dpassword=${this.options.mavenPassword}`
          : "",
      ]);

      // await execPromise("git", [
      //   "push",
      //   "--follow-tags",
      //   "--set-upstream",
      //   auto.remote,
      //   auto.baseBranch,
      // ]);
    });

    auto.hooks.afterShipIt.tapPromise(this.name, async () => {
      auto.logger.verbose.warn(`Running "afterShipIt"`);
      if (!this.snapshotRelease) {
        return;
      }

      const releaseVersion = await this.getVersion(auto);

      // snapshots precede releases, so if we had a minor/major release,
      // then we need to set up snapshots on the next version
      const newVersion = `${inc(releaseVersion, "patch")}${snapshotSuffix}`;

      await this.updatePoms(newVersion, auto);

      // await execPromise("git", [
      //   "push",
      //   "--follow-tags",
      //   "--set-upstream",
      //   auto.remote,
      //   auto.baseBranch,
      // ]);
    });
  }

  /** Find and update all pom.xml files with new versions, and then commit the changes **/
  private async updatePoms(releaseVersion: string, auto: Auto) {
    auto.logger.verbose.warn(
      `Running "updatePoms". releaseVersion: ${releaseVersion}`
    );
    /** Get all the poms and update their versions **/
    await Promise.all(
      glob.sync("**/pom.xml").map((pomFile) =>
        MavenPlugin.updatePomVersion(pomFile, releaseVersion).catch(
          (reason) => {
            auto.logger.verbose.error(
              `There was an error modifying the ${pomFile}: ${reason}`
            );
          }
        )
      )
    ).catch((reason) => {
      auto.logger.verbose.error(
        `There was an error modifying the pom files. Running 'git checkout -- .' to reset the clone.`
      );
      execPromise("git", ["checkout", "--", "."]).catch((reason) => {
        throw new Error(reason);
      });
      throw new Error(reason);
    });

    await execPromise("git", [
      "commit",
      "-am",
      `"update version: ${releaseVersion} [skip ci]"`,
      "--no-verify",
    ]);
  }

  /** Update the version in the pom.xml file **/
  private static async updatePomVersion(pomFile: string, version: string) {
    const pom = await getPom(pomFile);
    const pomJson = await xmlToJs(pom.pomXml);
    if (pomJson?.parent) {
      pomJson.parent.version = version;
    }

    if (pomJson?.version) {
      pomJson.version = version;
    }

    await writePom(jsToXml(pomJson), pomFile);
  }

  /** Get the properties from the pom.xml file **/
  private static async getProperties(): Promise<IMavenProperties> {
    const pom = await getPom();
    const { scm } = pom.pomObject?.project || {};
    let github;
    let repoInfo;

    if (scm) {
      github = arrayify(scm).find((remote) =>
        Boolean(remote.url.includes("github"))
      );
    }

    if (github) {
      repoInfo = parseGitHubUrl(github.url);
    }

    const developers = pom.pomObject?.project?.developers?.developer;
    const developer = developers ? arrayify(developers)[0] : undefined;

    return {
      version: pom.pomObject?.project.version,
      owner: repoInfo?.owner || undefined,
      repo: repoInfo?.name || undefined,
      developer: developer,
    };
  }

  /** Get the version from the current pom.xml **/
  private async getVersion(auto: Auto): Promise<string> {
    const { version } = this.properties;

    if (version) {
      auto.logger.verbose.info(`Found version in pom.xml: ${version}`);
      return version.replace(snapshotSuffix, "");
    }

    return "0.0.0.0";
  }
}
