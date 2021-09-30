import { Options as CoreOptions } from "conventional-changelog-core";
import { Commit, sync as parse } from "conventional-commits-parser";
import { promisify } from "util";
import conventionalChangelogPresetLoader from "conventional-changelog-preset-loader";
import flatMap from "array.prototype.flatmap";
import * as t from "io-ts";

import {
  Auto,
  IPlugin,
  SEMVER,
  getReleaseType,
  getHigherSemverTag,
} from "@auto-it/core";
import endent from "endent";

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
  /** The default release type to apply when the conventional commit isn't "fix", "feat" or "breaking" */
  defaultReleaseType: t.string,
});

const VERSIONS = [SEMVER.major, SEMVER.minor, SEMVER.patch] as const;

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
    this.options = {
      defaultReleaseType: "skip",
      ...options,
    };
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
            const bump =
              VERSIONS[result.level] || this.options.defaultReleaseType;
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
      const semVerLabels = flatMap([...auto.semVerLabels!.values()], (x) => x);

      // check if semver label is already on PR
      if (labels.some((l) => semVerLabels.includes(l))) {
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

      const definedBumps = bumps.filter(
        (bump): bump is SEMVER.major | SEMVER.minor | SEMVER.patch | "skip" =>
          bump !== undefined
      );

      if (definedBumps.length === 0) {
        return;
      }

      const bump = definedBumps
        .map(getReleaseType)
        .reduce(getHigherSemverTag, SEMVER.noVersion);

      if (
        bump === undefined ||
        bump === null ||
        bump === SEMVER.premajor ||
        bump === SEMVER.preminor ||
        bump === SEMVER.prepatch
      ) {
        
        return;
      }
      
      const bumpOrSkip = bump === SEMVER.noVersion ? 'skip' : bump;

      const label = auto.semVerLabels?.get(bumpOrSkip);

      if (label) {
        await auto.git.addLabelToPr(pr.number, label[0]);
      }
    });

    auto.hooks.onCreateLogParse.tap(this.name, (logParse) => {
      logParse.hooks.parseCommit.tapPromise(this.name, async (commit) => {
        if (!auto.semVerLabels || !auto.git) {
          return commit;
        }

        try {
          const message = `${commit.subject}\n\n${commit.rawBody}`;
          const allSemVerLabels = [
            auto.semVerLabels.get(SEMVER.major),
            auto.semVerLabels.get(SEMVER.minor),
            auto.semVerLabels.get(SEMVER.patch),
          ].reduce<string[]>(
            (acc, labels) => (labels ? [...acc, ...labels] : acc),
            []
          );
          const prHasSemverLabel = commit.labels.some((l) =>
            allSemVerLabels.includes(l)
          );
          let bump = await getBump(message);

          // Take into account all conventional commit message in each commit for a PR
          if (
            commit.pullRequest &&
            // If the PR already has a semver label it takes precedence over conventional
            // commit messages
            !prHasSemverLabel
          ) {
            const prCommits = await auto.git.getCommitsForPR(
              commit.pullRequest.number
            );
            const prBumps = (
              await Promise.all(prCommits.map((c) => getBump(c.commit.message)))
            ).filter((bump): bump is
              | SEMVER.major
              | SEMVER.minor
              | SEMVER.patch => Boolean(bump && bump !== "skip"));

            if (prBumps.includes(SEMVER.major)) {
              bump = SEMVER.major;
            } else if (prBumps.includes(SEMVER.minor)) {
              bump = SEMVER.minor;
            } else if (prBumps.includes(SEMVER.patch)) {
              bump = SEMVER.patch;
            }
          }

          if (!bump) {
            return commit;
          }

          const incrementLabel = auto.semVerLabels.get(bump);

          if (incrementLabel && !prHasSemverLabel) {
            auto.logger.verbose.log(
              endent`
                Found "${bump}" from conventional commit message: ${message}
              
                Applying "${incrementLabel}"
              `
            );

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
