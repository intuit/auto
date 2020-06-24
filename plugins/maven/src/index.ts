import { Auto, execPromise, IPlugin } from "@auto-it/core";
import parseGitHubUrl from "parse-github-url";
import { promisify } from "util";
import * as t from "io-ts";
import * as glob from "fast-glob";
import { IDeveloper, parse } from "pom-parser";
import { inc, ReleaseType } from "semver";
import { validatePluginConfiguration } from "@auto-it/core/dist/auto";
import * as fs from "fs";
import * as jsdom from "jsdom";
import * as prettier from "prettier";

const snapshotSuffix = "-SNAPSHOT";

/** Ensure a value is an array **/
const arrayify = <T>(arg: T | T[]): T[] => (Array.isArray(arg) ? arg : [arg]);
/** Parse the pom.xml file **/
const parsePom = promisify(parse);

/** Get the maven pom.xml for a project **/
const getPom = async (filePath = "pom.xml") => parsePom({ filePath: filePath });

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

  /** Update the version in the pom.xml file **/
  private static async updatePomVersion(
    content: string,
    version: string,
    options: IMavenPluginOptions
  ): Promise<string> {
    const dom = new jsdom.JSDOM(content, { contentType: "text/xml" });
    const pomDom = dom.window.document;
    const versionNode = pomDom.evaluate(
      "/project/version",
      pomDom.documentElement,
      pomDom.createNSResolver(pomDom.documentElement),
      9 // XPathResult.FIRST_ORDERED_NODE_TYPE
    );

    if (versionNode?.singleNodeValue) {
      versionNode.singleNodeValue.textContent = version;
    }

    const parentVersionNode = pomDom.evaluate(
      "/project/parent/version",
      pomDom.documentElement,
      pomDom.createNSResolver(pomDom.documentElement),
      9 // XPathResult.FIRST_ORDERED_NODE_TYPE
    );

    if (parentVersionNode?.singleNodeValue) {
      parentVersionNode.singleNodeValue.textContent = version;
    }

    return prettier.format(dom.serialize(), {
      printWidth: options.printWidth,
      tabWidth: options.tabWidth,
      parser: "html",
    });
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

  /** Update the pom.xml file with the new version **/
  private static async updatePomFile(
    pomFile: string,
    version: string,
    options: IMavenPluginOptions,
    auto: Auto
  ) {
    auto.logger.verbose.info(`Updating: ${pomFile}`);
    const pom = await getPom(pomFile);
    const content = await MavenPlugin.updatePomVersion(
      pom.pomXml,
      version,
      options
    );
    fs.writeFile(pomFile, content, { encoding: "utf8" }, (err) => {
      if (err) throw err;
    });
  }

  /** Find and update all pom.xml files with new versions, and then commit the changes **/
  private static async updatePoms(
    version: string,
    options: IMavenPluginOptions,
    auto: Auto
  ) {
    /** Get all the poms and update their versions **/
    const pomFiles = await glob.sync("**/pom.xml");
    if (pomFiles && pomFiles.length > 0) {
      const updatedPoms = pomFiles.map((pomFile) => {
        return MavenPlugin.updatePomFile(pomFile, version, options, auto);
      });
      await Promise.all(updatedPoms)
        .then(() => {
          auto.logger.verbose.info(
            `Updated ${pomFiles.length} pom.xml files with version: ${version}`
          );
        })
        .catch((reason: string) => {
          auto.logger.verbose.error(
            `There was an error modifying the pom files. Running 'git checkout -- .' to reset the clone.`
          );
          execPromise("git", ["checkout", "--", "."]).catch(
            (reason: string) => {
              throw new Error(reason);
            }
          );
          throw new Error(reason);
        });

      await execPromise("git", [
        "commit",
        "-am",
        `"update version: ${version} [skip ci]"`,
        "--no-verify",
      ]);
    }
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
          auto.logger.verbose.warn("Using the versions-maven-plugin");
          await execPromise("mvn", [
            "versions:set",
            "-DgenerateBackupPoms=false",
            `-DnewVersion=${releaseVersion}`,
          ]);
        } else {
          auto.logger.verbose.warn("Using the auto maven plugin");
          await MavenPlugin.updatePoms(releaseVersion, this.options, auto);
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

      const releaseVersion = await this.getVersion(auto);

      // snapshots precede releases, so if we had a minor/major release,
      // then we need to set up snapshots on the next version
      const newVersion = `${inc(releaseVersion, "patch")}${snapshotSuffix}`;

      if (this.versionsMavenPlugin) {
        auto.logger.verbose.warn("Using the versions-maven-plugin");

        await execPromise("mvn", [
          "versions:set",
          "-DgenerateBackupPoms=false",
          `-DnewVersion=${newVersion}`,
        ]);
      } else {
        auto.logger.verbose.warn("Using the auto maven plugin");
        await MavenPlugin.updatePoms(newVersion, this.options, auto);
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
