import { Auto, execPromise, IPlugin } from "@auto-it/core";
import parseGitHubUrl from "parse-github-url";
import { promisify } from "util";
import * as t from "io-ts";
import { IDeveloper, parse } from "pom-parser";
import { inc, ReleaseType } from "semver";
import { validatePluginConfiguration } from "@auto-it/core/dist/auto";
import * as jsdom from "jsdom";
import * as nativeVersionUpdate from "./native-version-update";
import * as mavenVersionUpdate from "./maven";

const snapshotSuffix = "-SNAPSHOT";

/** Ensure a value is an array **/
const arrayify = <T>(arg: T | T[]): T[] => (Array.isArray(arg) ? arg : [arg]);
/** Parse the pom.xml file **/
const parsePom = promisify(parse);

/** Get the maven pom.xml for a project **/
export const getPom = async (filePath = "pom.xml") =>
  parsePom({ filePath: filePath });

const pluginOptions = t.partial({
  /** The maven binary to release the project with **/
  mavenCommand: t.string,

  /** A list of maven command customizations to pass to maven **/
  mavenOptions: t.array(t.string),

  /** A list of maven goals to pass to maven for release **/
  mavenReleaseGoals: t.array(t.string),

  /** Path to maven settings file **/
  mavenSettings: t.string,

  /** Print width for prettier formatting **/
  printWidth: t.number,

  /** Tab width for prettier formatting **/
  tabWidth: t.number,

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

  /** should pom.xml versions be handled with the "versions-maven-plugin" **/
  private versionsMavenPlugin = false;

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
      mavenCommand: MAVEN_COMMAND || options.mavenCommand || "/usr/bin/mvn",
      mavenOptions: MAVEN_OPTIONS?.split(" ") || options.mavenOptions || [],
      mavenReleaseGoals: MAVEN_RELEASE_GOALS?.split(" ") ||
        options.mavenReleaseGoals || ["deploy", "site-deploy"],
      mavenSettings: MAVEN_SETTINGS || options.mavenSettings || "",
      printWidth: options.printWidth || 120,
      tabWidth: options.tabWidth || 4,
      mavenUsername: MAVEN_USERNAME || options.mavenUsername || "",
      mavenPassword: MAVEN_PASSWORD || options.mavenPassword || "",
    };
  }

  /** Detect whether the parent pom.xml has the versions-maven-plugin **/
  private static async detectVersionMavenPlugin(): Promise<boolean> {
    const pom = await getPom();
    const pomDom = new jsdom.JSDOM(pom.pomXml, { contentType: "text/xml" })
      .window.document;
    const versionsMavenPluginNode = pomDom.evaluate(
      "/project/build/plugins/plugin/artifactId[normalize-space(text())='versions-maven-plugin']",
      pomDom.documentElement,
      pomDom.createNSResolver(pomDom.documentElement),
      9 // XPathResult.FIRST_ORDERED_NODE_TYPE
    );

    if (versionsMavenPluginNode?.singleNodeValue) {
      return true;
    }

    const versionsMavenPluginManagementNode = pomDom.evaluate(
      "/project/build/pluginManagement/plugins/plugin/artifactId[normalize-space(text())='versions-maven-plugin']",
      pomDom.documentElement,
      pomDom.createNSResolver(pomDom.documentElement),
      9 // XPathResult.FIRST_ORDERED_NODE_TYPE
    );

    return Boolean(versionsMavenPluginManagementNode?.singleNodeValue);
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

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.beforeRun.tapPromise(this.name, async () => {
      this.properties = await MavenPlugin.getProperties();
      const { version = "" } = this.properties;
      if (version?.endsWith(snapshotSuffix)) {
        this.snapshotRelease = true;
      }

      this.versionsMavenPlugin = await MavenPlugin.detectVersionMavenPlugin();
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
      const { developer } = this.properties;
      auto.logger.verbose.info(
        `Found author information in pom.xml: ${developer}`
      );
      return developer;
    });

    auto.hooks.getRepository.tapPromise(this.name, async () => {
      const { owner, repo } = this.properties;
      auto.logger.verbose.info(
        `Found repo information in pom.xml: ${owner}/${repo}`
      );
      return {
        owner: owner,
        repo: repo,
      };
    });

    auto.hooks.version.tapPromise(this.name, async (version: string) => {
      const previousVersion = await this.getVersion(auto);
      const releaseVersion =
        // After release we bump the version by a patch and add -SNAPSHOT
        // Given that we do not need to increment when versioning, since
        // it has already been done
        this.snapshotRelease && version === "patch"
          ? previousVersion
          : inc(previousVersion, version as ReleaseType);

      if (releaseVersion) {
        if (this.versionsMavenPlugin) {
          await mavenVersionUpdate.updatePoms(
            releaseVersion,
            this.options,
            auto,
            `"[auto] prepare release ${releaseVersion}"`
          );
        } else {
          await nativeVersionUpdate.updatePoms(
            releaseVersion,
            this.options,
            auto
          );
        }

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

      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        auto.baseBranch,
      ]);
    });

    auto.hooks.afterShipIt.tapPromise(this.name, async () => {
      if (!this.snapshotRelease) {
        return;
      }

      auto.logger.verbose.info("Running afterShipIt for maven update");

      const releaseVersion = await this.getVersion(auto);

      // snapshots precede releases, so if we had a minor/major release,
      // then we need to set up snapshots on the next version
      const newVersion = `${inc(releaseVersion, "patch")}${snapshotSuffix}`;

      if (this.versionsMavenPlugin) {
        await mavenVersionUpdate.updatePoms(
          newVersion,
          this.options,
          auto,
          `"[auto] prepare for development on ${newVersion}"`
        );
      } else {
        await nativeVersionUpdate.updatePoms(newVersion, this.options, auto);
      }

      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        auto.baseBranch,
      ]);
    });
  }

  /** Get the version from the current pom.xml **/
  private async getVersion(auto: Auto): Promise<string> {
    const { version } = this.properties;

    if (version) {
      auto.logger.verbose.info(`Found version in pom.xml: ${version}`);
      return version.replace(snapshotSuffix, "");
    }

    return "0.0.0";
  }
}
