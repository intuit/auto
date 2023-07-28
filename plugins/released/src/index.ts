import { Auto, IPlugin, validatePluginConfiguration } from "@auto-it/core";
import { IExtendedCommit } from "@auto-it/core/dist/log-parse";
import { RestEndpointMethodTypes } from "@octokit/rest";
import botList from "@auto-it/bot-list";

import merge from "deepmerge";
import * as t from "io-ts";

const pluginOptions = t.partial({
  /** Message to use when posting on issues and pull requests */
  message: t.string,
  /** The label to add to issues and pull requests */
  label: t.string,
  /** The label to add to issues and pull requests that are in a prerelease */
  prereleaseLabel: t.string,
  /** Whether to lock the issue once the pull request has been released */
  lockIssues: t.boolean,
  /** Whether to lock the issue once the pull request has been released */
  lockPrs: t.boolean,
  /** Whether to comment on PRs made by bots */
  includeBotPrs: t.boolean,
});

export type IReleasedLabelPluginOptions = t.TypeOf<typeof pluginOptions>;

const TYPE = "%TYPE";
const VERSION = "%VERSION";
const defaultOptions: Required<IReleasedLabelPluginOptions> = {
  label: "released",
  prereleaseLabel: "prerelease",
  lockIssues: false,
  lockPrs: false,
  includeBotPrs: false,
  message: `:rocket: ${TYPE} was released in ${VERSION} :rocket:`,
};

const closeIssue = /(?:Close|Closes|Closed|Fix|Fixes|Fixed|Resolve|Resolves|Resolved)\s((?:#\d+(?:,\s)?)+)/gi;

/** Comment on merged pull requests and issues with the new version */
export default class ReleasedLabelPlugin implements IPlugin {
  /** The name of the plugin */
  name = "released";

  /** The options of the plugin */
  readonly options: Required<IReleasedLabelPluginOptions>;

  /** Initialize the plugin with it's options */
  constructor(options: Partial<IReleasedLabelPluginOptions> = {}) {
    this.options = merge(
      defaultOptions,
      options
    ) as Required<IReleasedLabelPluginOptions>;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.modifyConfig.tap(this.name, (config) => {
      if (!config.labels.find((l) => l.name === this.options.label)) {
        config.labels.push({
          name: this.options.label,
          description: "This issue/pull request has been released.",
          releaseType: "none",
        });
      }

      if (!config.labels.find((l) => l.name === this.options.prereleaseLabel)) {
        config.labels.push({
          name: this.options.prereleaseLabel,
          description: "This change is available in a prerelease.",
          releaseType: "none",
        });
      }

      return config;
    });

    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });

    auto.hooks.afterRelease.tapPromise(
      this.name,
      async ({ newVersion, commits, response }) => {
        if (!newVersion) {
          return;
        }

        const head = commits[0];

        if (!head) {
          return;
        }

        const skipReleaseLabels = (
          auto.config?.labels.filter((l) => l.releaseType === "skip") || []
        ).map((l) => l.name);
        const isSkipped = head.labels.find((label) =>
          skipReleaseLabels.includes(label)
        );

        if (isSkipped) {
          return;
        }

        const releases =
          (Array.isArray(response) && response) ||
          (response && [response]) ||
          [];

        await Promise.all(
          commits.map(async (commit) =>
            this.addReleased(auto, commit, releases)
          )
        );
      }
    );
  }

  /** Add the release label + other stuff to a commit */
  private async addReleased(
    auto: Auto,
    commit: IExtendedCommit,
    releases: Array<
      RestEndpointMethodTypes["repos"]["createRelease"]["response"]
    >
  ) {
    const messages = [commit.subject];
    const isPrerelease = releases.some((r) => r.data.prerelease);

    if (commit.pullRequest) {
      try {
        const pr = await auto.git!.getPullRequest(commit.pullRequest.number);
        const branch = pr?.data.head.ref;

        if (branch && auto.config?.prereleaseBranches.includes(branch)) {
          return;
        }

        if (
          !this.options.includeBotPrs &&
          commit.authors.some(
            (author) =>
              (author.name && botList.includes(author.name)) ||
              (author.username && botList.includes(author.username)) ||
              author.type === "Bot"
          )
        ) {
          return;
        }

        await this.addCommentAndLabel({
          auto,
          prOrIssue: commit.pullRequest.number,
          isPrerelease,
          releases,
        });
        if (this.options.lockPrs && !isPrerelease) {
          await auto.git!.lockIssue(commit.pullRequest.number);
        }

        pr.data.body?.split("\n").map((line) => messages.push(line));

        const commitsInPr = await auto.git!.getCommitsForPR(
          commit.pullRequest.number
        );
        commitsInPr.map((c) => messages.push(c.commit.message));
      } catch (error) {
        auto.logger.verbose.log(error);
      }
    }

    const issues = messages
      .map((message) => message.match(closeIssue))
      .filter((r): r is RegExpMatchArray => Boolean(r))
      .reduce((all, arr) => [...all, ...arr], [] as string[])
      .map((issue) => issue.match(/#(\d+)/i))
      .filter((r: RegExpMatchArray | null): r is RegExpMatchArray => Boolean(r))
      .map((match) => Number(match[1]));

    await Promise.all(
      issues.map(async (issue) => {
        await this.addCommentAndLabel({
          auto,
          prOrIssue: issue,
          isIssue: true,
          isPrerelease,
          releases,
        });

        if (this.options.lockIssues && !isPrerelease) {
          await auto.git!.lockIssue(issue);
        }
      })
    );
  }

  /** Add the templated comment to the pr and attach the "released" label */
  private async addCommentAndLabel({
    auto,
    prOrIssue,
    isIssue = false,
    isPrerelease = false,
    releases,
  }: {
    /** Reference to auto instance */
    auto: Auto;
    /** Issue or pr number */
    prOrIssue: number;
    /** Whether it's an issue number */
    isIssue?: boolean;
    /** Whether the release was a prerelease */
    isPrerelease?: boolean;
    /** All of the releases that happened */
    releases: Array<
      RestEndpointMethodTypes["repos"]["createRelease"]["response"]
    >;
  }) {
    // leave a comment with the new version
    const urls = releases.map((release) =>
      this.options.message === defaultOptions.message
        ? `[\`${release.data.name || release.data.tag_name}\`](${
            release.data.html_url
          })`
        : release.data.name
    );
    const message = this.createReleasedComment(isIssue, urls.join(", "));
    await auto.comment({ message, pr: prOrIssue, context: "released" });

    // add a `released` label to a PR
    const labels = await auto.git!.getLabels(prOrIssue);

    if (isPrerelease) {
      if (!labels.includes(this.options.prereleaseLabel)) {
        await auto.git!.addLabelToPr(prOrIssue, this.options.prereleaseLabel);
      }
    } else if (!labels.includes(this.options.label)) {
      await auto.git!.addLabelToPr(prOrIssue, this.options.label);

      if (labels.includes(this.options.prereleaseLabel)) {
        await auto.git!.removeLabel(prOrIssue, this.options.prereleaseLabel);
      }
    }
  }

  /** Create a comment that fits the context (pr of issue) */
  private createReleasedComment(isIssue: boolean, version: string) {
    return this.options.message
      .replace(new RegExp(TYPE, "g"), isIssue ? "Issue" : "PR")
      .replace(new RegExp(VERSION, "g"), version);
  }
}
