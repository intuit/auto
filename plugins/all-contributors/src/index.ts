import {
  Auto,
  IPlugin,
  execPromise,
  getLernaPackages,
  inFolder,
  validatePluginConfiguration,
} from "@auto-it/core";
import { RestEndpointMethodTypes } from "@octokit/rest";
import envCi from "env-ci";
import endent from "endent";
import botList from "@auto-it/bot-list";
import fs from "fs";
import path from "path";
import match from "anymatch";
import on from "await-to-js";
import { IExtendedCommit } from "@auto-it/core/src/log-parse";
import * as t from "io-ts";
import fromEntries from "fromentries";

import addContributor from "all-contributors-cli/dist/contributors";
import generateReadme from "all-contributors-cli/dist/generate";

const contributionTypes = [
  "blog",
  "bug",
  "business",
  "code",
  "content",
  "design",
  "doc",
  "eventOrganizing",
  "example",
  "financial",
  "fundingFinding",
  "ideas",
  "infra",
  "maintenance",
  "platform",
  "plugin",
  "projectManagement",
  "question",
  "review",
  "security",
  "talk",
  "test",
  "tool",
  "translation",
  "tutorial",
  "userTesting",
  "video",
] as const;
type Contribution = typeof contributionTypes[number];

/** Determine if it's a valid contribution type */
const isContribution = (
  contribution: string | Contribution
): contribution is Contribution =>
  contributionTypes.includes(contribution as Contribution);

/** Get an rc file if there is one. */
function getRcFile(auto: Auto) {
  const rcFile = path.join(process.cwd(), ".all-contributorsrc");

  if (!fs.existsSync(rcFile)) {
    auto.logger.verbose.warn(
      `No all-contributors configuration file found at: ${rcFile}`
    );
    return;
  }

  try {
    const config: AllContributorsRc = JSON.parse(
      fs.readFileSync(rcFile, "utf8")
    );

    return { ...config, config: rcFile };
  } catch (error) {
    auto.logger.log.error(
      `Encountered errors loading all-contributors configuration at ${rcFile}`,
      error
    );
    process.exit(1);
  }
}

const pattern = t.union([t.string, t.array(t.string)]);
const pluginOptions = t.partial({
  /** Usernames to exclude from the contributors */
  exclude: t.array(t.string),
  /** Globs to detect change types by */
  types: t.partial(
    fromEntries(contributionTypes.map((c) => [c, pattern])) as Record<
      Contribution,
      typeof pattern
    >
  ),
});

export type IAllContributorsPluginOptions = t.TypeOf<typeof pluginOptions>;

interface Contributor {
  /** GitHub username */
  login: string;
  /** Types of contributions they've made */
  contributions: Contribution[];
}

interface AllContributorsRc {
  /** All of the current contributors */
  contributors: Contributor[];
  /** Files to generate a markdown table of contributors in */
  files?: string[];
}

const defaultOptions: IAllContributorsPluginOptions = {
  exclude: botList,
  types: {
    doc: ["**/*.mdx", "**/*.md", "**/docs/**/*", "**/documentation/**/*"],
    example: ["**/*.stories*", "**/*.story.*"],
    infra: ["**/.circle/**/*", "**/.github/**/*", "**/travis.yml"],
    test: ["**/*.test.*", "**/test/**", "**/__tests__/**"],
    code: ["**/src/**/*", "**/lib/**/*", "**/package.json", "**/tsconfig.json"],
  },
};

const title = /[#]{0,5}[ ]*[C|c]ontributions/;
const contributorLine = /^[-*] @(\S+)\s+[:-]\s+([\S ,]+)$/;

/** Find contributions listed in PR bodies */
function getExtraContributors(body?: string | null) {
  const authorContributions: Record<string, Set<string>> = {};

  if (!body) {
    return;
  }

  const start = body.match(title);

  if (!start) {
    return;
  }

  body
    .slice((start.index || 0) + (start[0] || "").length)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .forEach((line) => {
      if (line.startsWith("#") || line.startsWith("<!--")) {
        return;
      }

      const contributor = line.match(contributorLine);

      if (!contributor) {
        return;
      }

      const [, username, contributions] = contributor;

      if (!authorContributions[username]) {
        authorContributions[username] = new Set();
      }

      contributions
        .split(",")
        .map((contribution) => contribution.trim())
        .forEach((contribution) =>
          authorContributions[username].add(contribution)
        );
    });

  return authorContributions;
}

/** Determine which files need to display contributors and generate contributors */
function generateContributorReadme(
  config: AllContributorsRc,
  contributors: any
) {
  return Promise.all(
    (config.files || ["README.md"]).map(async (file) => {
      const oldReadMe = fs.readFileSync(file, {
        encoding: "utf-8",
      });
      const newReadMe = await generateReadme(
        {
          contributorsPerLine: 7,
          imageSize: 100,
          ...config,
          contributors,
        },
        contributors,
        oldReadMe
      );
      fs.writeFileSync(file, newReadMe);
    })
  );
}

/** Automatically add contributors as changelogs are produced. */
export default class AllContributorsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "all-contributors";

  /** The options of the plugin */
  readonly options: Required<IAllContributorsPluginOptions>;
  /** Has the Readme been initialized */
  private generatedReadme: boolean;

  /** Initialize the plugin with it's options */
  constructor(options: IAllContributorsPluginOptions = {}) {
    this.options = {
      exclude: [...(defaultOptions.exclude || []), ...(options.exclude || [])],
      types: { ...defaultOptions.types, ...options.types },
    };

    this.generatedReadme = false;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    const env = envCi();

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.beforeShipIt.tapPromise(this.name, async (context) => {
      if (
        context.releaseType === "latest" ||
        context.releaseType === "old" ||
        !("pr" in env)
      ) {
        return;
      }

      const pr = Number(env.pr);

      if (!pr) {
        return;
      }

      const prInfo = await auto.git?.getPullRequest(pr);
      auto.logger.log.info(this.name, { prInfo });

      if (!prInfo) {
        return;
      }

      const extra = getExtraContributors(prInfo.data.body);
      auto.logger.log.info(this.name, { extra });

      if (!extra || !Object.keys(extra).length) {
        return;
      }

      const allContributions = Object.values(extra).reduce<string[]>(
        (all, i) => [...all, ...i],
        []
      );
      const unknownTypes = allContributions.filter(
        (contribution) =>
          !contributionTypes.includes(contribution as Contribution)
      );
      const hasValidTypes = allContributions.length !== unknownTypes.length;

      const message = endent`
        # Extra Contributions

        ${
          hasValidTypes
            ? endent`
              The following contributions will be added to all-contributors (as well as any code contributions) when this PR is released :tada::

              ${Object.entries(extra)
                .map(([username, contributions]) => {
                  const validContributions = [...contributions].filter(
                    isContribution
                  );

                  if (!validContributions.length) {
                    return "";
                  }

                  return `- @${username} - ${validContributions.join(", ")}`;
                })
                .filter(Boolean)
                .join("\n")}
            `
            : "No valid contribution types found!"
        }

        ${
          unknownTypes.length
            ? endent`
                ## Unknown Contribution Types

                We found some unknown contribution types in your PR body!
                These contributions will not be counted and you should fix them.

                ${unknownTypes.map((type) => `- \`${type}\``)}
              `
            : ""
        }
      `;

      await auto.comment({
        pr,
        context: "Extra Contributions",
        edit: true,
        message,
      });
    });

    auto.hooks.afterChangelog.tapPromise(this.name, async ({ commits }) => {
      const rootDir = process.cwd();
      // Always do the root package
      let packages = [{ path: rootDir, name: "root-package" }];

      try {
        // Try to get sub-packages
        packages = [...packages, ...(await getLernaPackages())];
      } catch (error) {}

      // Go through each package and update code contributions
      await packages.reduce(async (last, { name, path }) => {
        // Cannot run git operations in parallel
        await last;

        auto.logger.verbose.info(`Updating contributors for: ${name}`);

        const includedCommits = commits.filter((commit) =>
          commit.files.some((file) => inFolder(path, file))
        );

        if (includedCommits.length > 0) {
          auto.logger.verbose.success(
            `${name} has ${includedCommits.length} new commits.`
          );
          auto.logger.veryVerbose.info(
            `With commits: ${JSON.stringify(includedCommits, null, 2)}`
          );

          process.chdir(path);
          await this.updateContributors(auto, includedCommits);
        }
      }, Promise.resolve());

      process.chdir(rootDir);
      const changedFiles = await execPromise("git", ["status", "--porcelain"]);

      if (changedFiles) {
        await execPromise("git", ["add", "README.md"]);
        await execPromise("git", ["add", ".all-contributorsrc"]);
        await on(execPromise("git", ["add", "**/README.md"]));
        await on(execPromise("git", ["add", "**/.all-contributorsrc"]));
        await execPromise("git", [
          "commit",
          "--no-verify",
          "-m",
          '"Update contributors [skip ci]"',
        ]);
      }
    });

    auto.hooks.onCreateLogParse.tap(this.name, (logParse) => {
      logParse.hooks.parseCommit.tapPromise(this.name, async (commit) => {
        const extraContributions = getExtraContributors(commit.rawBody);

        if (!extraContributions) {
          return commit;
        }

        const contributors = (
          await Promise.all(
            Object.keys(extraContributions).map(async (contributor) =>
              auto.git?.getUserByUsername(contributor)
            )
          )
        ).filter(
          (
            c
          ): c is RestEndpointMethodTypes["users"]["getByUsername"]["response"]["data"] =>
            Boolean(c)
        );

        return {
          ...commit,
          authors: [
            ...commit.authors,
            ...contributors.map((c) => ({ ...c, username: c.login })),
          ],
        };
      });
    });
  }

  /** Update the contributors rc for a package. */
  private async updateContributors(auto: Auto, commits: IExtendedCommit[]) {
    const config = getRcFile(auto);

    if (!config) {
      return;
    }

    const authorContributions: Record<string, Set<Contribution>> = {};
    let didUpdate = false;

    const commitsWithAllChangedFiles = await Promise.all(
      commits.map(async (commit) => {
        const extra = await execPromise("git", [
          "show",
          '--pretty=""',
          "--name-only",
          "--first-parent",
          "-m",
          commit.hash,
          "-l0",
        ]);

        commit.files = [...new Set([...commit.files, ...extra.split("\n")])];

        return commit;
      })
    );

    // 1. Find all the authors and their contribution types
    commitsWithAllChangedFiles.forEach((commit) => {
      const { authors } = commit;
      let { files } = commit;

      // Find automated contribution for type globs
      Object.keys(this.options.types || {})
        .filter((type): type is Contribution => {
          /** Determine if path is the contribution type */
          const isType = (file: string) =>
            match(this.options.types[type as Contribution] || [], file);
          const isMatch = files.some(isType);
          files = files.filter((file) => !isType(file));

          return isMatch;
        })
        .forEach((contribution) => {
          authors.forEach(({ username }) => {
            if (!username) {
              return;
            }

            if (!authorContributions[username]) {
              authorContributions[username] = new Set();
            }

            authorContributions[username].add(contribution);
          });
        });

      // Find contributions listed in PR bodies
      const extra = getExtraContributors(commit.rawBody);

      if (extra) {
        Object.entries(extra).forEach(([username, contributions]) => {
          if (!authorContributions[username]) {
            authorContributions[username] = new Set();
          }

          [...contributions]
            .filter(isContribution)
            .forEach((contribution) =>
              authorContributions[username].add(contribution)
            );
        });
      }
    });

    auto.logger.verbose.info("Found contributions:", authorContributions);

    // 2. Determine if contributor has update
    for await (const [username, contributions] of Object.entries(
      authorContributions
    )) {
      const { contributions: old = [] } =
        config.contributors.find(
          (contributor) =>
            contributor.login.toLowerCase() === username.toLowerCase()
        ) || {};
      const hasNew = [...contributions].find(
        (contribution) => !old.includes(contribution)
      );

      if (hasNew && !this.options.exclude.includes(username)) {
        const newContributions = new Set([...old, ...contributions]);

        didUpdate = true;
        auto.logger.log.info(`Adding "${username}"'s contributions...`);

        // If a PRIVATE_TOKEN is not set for all-contributors-cli
        // use the GH_TOKEN
        if (process.env.PRIVATE_TOKEN === undefined) {
          process.env.PRIVATE_TOKEN = process.env.GH_TOKEN;
        }

        // Update/add contributor in RC file
        const { contributors } = await addContributor(
          config,
          username,
          Array.from(newContributions).join(",")
        );
        this.generatedReadme = true;
        // Update files that contain contributors table
        await generateContributorReadme(config, contributors);
      } else {
        auto.logger.verbose.warn(`"${username}" had no new contributions...`);
      }
    }

    if (config.contributors.length && !this.generatedReadme) {
      // if the all-contributors has not been generated ... generate it
      try {
        // test if the first file in the list of files has been init
        const file = path.join(
          process.cwd(),
          config.files ? config.files[0] : "README.md"
        );

        const displayFile = file ? fs.readFileSync(file, "utf8") : "";

        const notInitalized = displayFile.indexOf(
          "<!-- markdownlint-disable -->\n<!-- markdownlint-restore -->"
        );

        if (notInitalized && file) {
          await generateContributorReadme(config, config.contributors);
        }
      } catch {}
    }

    if (didUpdate) {
      auto.logger.log.success("Updated contributors!");
    }
  }
}
