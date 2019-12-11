import { Auto, IPlugin } from '@auto-it/core';
import { IExtendedCommit } from '@auto-it/core/dist/log-parse';
import merge from 'deepmerge';

interface IReleasedLabelPluginOptions {
  /** Message to use when posting on issues and pull requests */
  message: string;
  /** The label to add to issues and pull requests */
  label: string;
  /** The label to add to issues and pull requests that are in a prerelease */
  prereleaseLabel: string;
  /** Whether to lock the issue once the pull request has been released */
  lockIssues: boolean;
}

const TYPE = '%TYPE';
const VERSION = '%VERSION';
const defaultOptions = {
  label: 'released',
  prereleaseLabel: 'prerelease',
  lockIssues: false,
  message: `:rocket: ${TYPE} was released in ${VERSION} :rocket:`
};

const closeIssue = /(?:Close|Closes|Closed|Fix|Fixes|Fixed|Resolve|Resolves|Resolved)\s((?:#\d+(?:,\s)?)+)/gi;

/** Determine if string is a canary version */
const isCanary = (version: string) => version.match('canary');

/** Comment on merged pull requests and issues with the new version */
export default class ReleasedLabelPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'Released Label';

  /** The options of the plugin */
  readonly options: IReleasedLabelPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: Partial<IReleasedLabelPluginOptions> = {}) {
    this.options = merge(defaultOptions, options);
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.modifyConfig.tap(this.name, config => {
      if (!config.labels.find(l => l.name === this.options.label)) {
        config.labels.push({
          name: this.options.label,
          description: 'This issue/pull request has been released.',
          releaseType: 'none'
        });
      }

      if (!config.labels.find(l => l.name === this.options.prereleaseLabel)) {
        config.labels.push({
          name: this.options.prereleaseLabel,
          description: 'This change is available in a prerelease.',
          releaseType: 'none'
        });
      }

      return config;
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
          auto.config?.labels.filter(l => l.releaseType === 'skip') || []
        ).map(l => l.name);
        const isSkipped = head.labels.find(label =>
          skipReleaseLabels.includes(label)
        );

        if (isSkipped) {
          return;
        }

        await Promise.all(
          commits.map(async commit =>
            this.addReleased(
              auto,
              commit,
              newVersion,
              response?.data.prerelease
            )
          )
        );
      }
    );
  }

  /** Add the release label + other stuff to a commit */
  private async addReleased(
    auto: Auto,
    commit: IExtendedCommit,
    newVersion: string,
    isPrerelease = false
  ) {
    const messages = [commit.subject];

    if (commit.pullRequest) {
      const branch = (await auto.git?.getPullRequest(commit.pullRequest.number))
        ?.data.head.ref;

      if (branch && auto.config?.prereleaseBranches.includes(branch)) {
        return;
      }

      await this.addCommentAndLabel({
        auto,
        newVersion,
        prOrIssue: commit.pullRequest.number,
        isPrerelease
      });

      const pr = await auto.git!.getPullRequest(commit.pullRequest.number);
      pr.data.body.split('\n').map(line => messages.push(line));

      const commitsInPr = await auto.git!.getCommitsForPR(
        commit.pullRequest.number
      );
      commitsInPr.map(c => messages.push(c.commit.message));
    }

    const issues = messages
      .map(message => message.match(closeIssue))
      .filter((r): r is string[] => Boolean(r))
      .reduce((all, arr) => [...all, ...arr], [])
      .map(issue => issue.match(/#(\d+)/i))
      .filter((r: RegExpMatchArray | null): r is RegExpMatchArray => Boolean(r))
      .map(match => Number(match[1]));

    await Promise.all(
      issues.map(async issue => {
        await this.addCommentAndLabel({
          auto,
          newVersion,
          prOrIssue: issue,
          isIssue: true,
          isPrerelease
        });

        if (this.options.lockIssues && !isCanary(newVersion) && !isPrerelease) {
          await auto.git!.lockIssue(issue);
        }
      })
    );
  }

  /** Add the templated comment to the pr and attach the "released" label */
  private async addCommentAndLabel({
    auto,
    newVersion,
    prOrIssue,
    isIssue = false,
    isPrerelease = false
  }: {
    /** Reference to auto instance */
    auto: Auto;
    /** The version being publishing */
    newVersion: string;
    /** Issue or pr number */
    prOrIssue: number;
    /** Whether it's an issue number */
    isIssue?: boolean;
    /** Whether the release was a prerelease */
    isPrerelease?: boolean;
  }) {
    // leave a comment with the new version
    const message = this.createReleasedComment(isIssue, newVersion);
    await auto.comment({ message, pr: prOrIssue, context: 'released' });

    // Do not add released to issue/label for canary versions
    if (isCanary(newVersion)) {
      return;
    }

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
      .replace(new RegExp(TYPE, 'g'), isIssue ? 'Issue' : 'PR')
      .replace(new RegExp(VERSION, 'g'), version);
  }
}
