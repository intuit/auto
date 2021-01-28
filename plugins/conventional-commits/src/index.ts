import { Options as CoreOptions } from "conventional-changelog-core";
import { Commit, sync as parse } from "conventional-commits-parser";
import { promisify } from "util";
import conventionalChangelogPresetLoader from "conventional-changelog-preset-loader";
import * as t from "io-ts";

import { Auto, IPlugin, SEMVER } from "@auto-it/core";
// import conventionalCommitsParser, { Commit } from "conventional-commits-parser";

/** Resolve a conventional commit preset */
function presetResolver(presetPackage: CoreOptions.Config) {
  if (typeof presetPackage === "function") {
    return promisify(presetPackage)();
  }

  // handle object literal or Promise instance
  if (typeof presetPackage === "object") {
    return presetPackage;
  }

  throw new Error("preset package must be a promise, function, or object");
}

const defaultPreset = {
  recommendedBumpOpts: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
      breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
      headerCorrespondence: ["type", "scope", "subject"],
      noteKeywords: ["BREAKING CHANGE"],
    },
    /** Find the bump */
    whatBump: (commits: Commit[]) => {
      let level: number | undefined;
      let breakings = 0;
      let features = 0;

      commits.forEach((commit) => {
        if (
          commit.notes.length > 0 ||
          commit.type === "BREAKING" ||
          commit.header?.match(
            defaultPreset.recommendedBumpOpts.parserOpts.breakingHeaderPattern
          )
        ) {
          breakings += commit.notes.length;
          level = 0;
        } else if (commit.type === "feat") {
          features += 1;
          if (level === undefined) {
            level = 1;
          }
        } else if (commit.type === "fix" && level === undefined) {
          level = 2;
        } else if (commit.type && level === undefined) {
          level = 3;
        }
      });

      return {
        level: level,
        reason:
          breakings === 1
            ? `There is ${breakings} BREAKING CHANGE and ${features} features`
            : `There are ${breakings} BREAKING CHANGES and ${features} features`,
      };
    },
  },
};

const optionalOptions = t.partial({
  /** A path to the formula template */
  preset: t.string,
});

const VERSIONS = [SEMVER.major, SEMVER.minor, SEMVER.patch, "skip"] as const;

export type ConventionalCommitsOptions = t.TypeOf<typeof optionalOptions>;

/**
 * Parse conventional commit messages and use them to
 * calculate the version.
 */
export default class ConventionalCommitsPlugin implements IPlugin {
  /** The name of the plugin */
  name = "conventional-commits";

  /** The options of the plugin */
  private readonly options: ConventionalCommitsOptions;

  /** The getBump function stored on the plugin so we don't load the config for every commit */
  private storedGetBump?: (
    message: string
  ) =>
    | Promise<SEMVER.major | SEMVER.minor | SEMVER.patch | "skip" | undefined>
    | undefined;

  /** Initialize the plugin with it's options */
  constructor(options: ConventionalCommitsOptions = {}) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    /** Get the bump using conventional commits */
    const getBump = async (message: string) => {
      if (!this.storedGetBump) {
        /** Load the implementation */
        this.storedGetBump = async (message: string) => {
          if (!auto.semVerLabels) {
            return;
          }

          const conventionalCommit = parse(message);
          const preset = this.options.preset
            ? await conventionalChangelogPresetLoader(this.options.preset)
            : defaultPreset;
          const config = await presetResolver(preset);
          const whatBump =
            config.recommendedBumpOpts?.whatBump ||
            defaultPreset.recommendedBumpOpts.whatBump;
          const result = whatBump([conventionalCommit]);

          if (result?.level !== null && result?.level !== undefined) {
            const bump = VERSIONS[result.level];
            return bump;
          }
        };
      }

      return this.storedGetBump(message);
    };

    auto.hooks.prCheck.tapPromise(this.name, async ({ pr }) => {
      if (!auto.git) {
        return;
      }

      const labels = await auto.git.getLabels(pr.number);

      // check if semver label is already on PR
      if (labels.filter((l) => auto.semVerLabels?.get(l as any)).length > 0) {
        return;
      }

      const commits = await auto.git?.getCommitsForPR(pr.number);

      const bumps = await Promise.all(
        commits.map(async (commit) => {
          try {
            return await getBump(commit.commit.message);
          } catch (error) {
            auto.logger.verbose.info(
              `No conventional commit message found for ${commit.sha}`
            );
          }
        })
      );

      const sorted = bumps
        .filter(
          (bump): bump is SEMVER.major | SEMVER.minor | SEMVER.patch | "skip" =>
            bump !== undefined
        )
        .sort((bump1, bump2) => {
          return VERSIONS.indexOf(bump1) - VERSIONS.indexOf(bump2);
        });

      if (!sorted[0]) {
        return;
      }

      const label = auto.semVerLabels?.get(sorted[0]);
      if (label) {
        await auto.git.addLabelToPr(pr.number, sorted[0]);
      }
    });

    auto.hooks.onCreateLogParse.tap(this.name, (logParse) => {
      logParse.hooks.parseCommit.tapPromise(this.name, async (commit) => {
        if (!auto.semVerLabels) {
          return commit;
        }

        try {
          const label = await getBump(`${commit.subject}\n\n${commit.rawBody}`);

          if (!label) {
            return commit;
          }

          const incrementLabel = auto.semVerLabels.get(label);
          const allSemVerLabels = [
            auto.semVerLabels.get(SEMVER.major),
            auto.semVerLabels.get(SEMVER.minor),
            auto.semVerLabels.get(SEMVER.patch),
          ].reduce<string[]>(
            (acc, labels) => (labels ? [...acc, ...labels] : acc),
            []
          );

          if (
            incrementLabel &&
            !commit.labels.some((l) => allSemVerLabels.includes(l))
          ) {
            commit.labels = [...commit.labels, incrementLabel[0]];
          }
        } catch (error) {
          auto.logger.verbose.info(
            `No conventional commit message found for ${commit.hash}`
          );
        }

        return commit;
      });

      // should omit PR commit if there exists a commit with a CC commit message
      logParse.hooks.omitCommit.tapPromise(this.name, async (commit) => {
        if (
          auto.git &&
          auto.release &&
          commit.pullRequest &&
          commit.labels.length === 0
        ) {
          const prCommits = await auto.git.getCommitsForPR(
            commit.pullRequest.number
          );
          let shouldOmit = false;

          // Omit the commit if one of the commits in the PR contains a CC message since it will already be counted
          await Promise.all(
            prCommits.map(async (c) => {
              try {
                const label = await getBump(c.commit.message);

                if (label) {
                  shouldOmit = true;
                }
              } catch (error) {}
            })
          );

          return shouldOmit;
        }
      });
    });
  }
}
