import merge from 'deepmerge';
import { IExtendedCommit } from '../../log-parse';
import { Auto, IPlugin } from '../../main';

interface IReleasedLabelPluginOptions {
  message: string;
  label: string;
  lockIssues: boolean;
}

const TYPE = '%TYPE';
const VERSION = '%VERSION';
const defaultOptions = {
  label: 'released',
  lockIssues: false,
  message: `:rocket: ${TYPE} was released in ${VERSION} :rocket:`
};

const closeIssue = /(?:Close|Closes|Closed|Fix|Fixes|Fixed|Resolve|Resolves|Resolved)\s((?:#\d+(?:,\s)?)+)/gi;

export default class ReleasedLabelPlugin implements IPlugin {
  name = 'Released Label';

  readonly options: IReleasedLabelPluginOptions;

  constructor(options: Partial<IReleasedLabelPluginOptions> = {}) {
    this.options = merge(defaultOptions, options);
  }

  apply(auto: Auto) {
    auto.hooks.afterShipIt.tapPromise(
      this.name,
      async (newVersion, commits) => {
        if (!newVersion) {
          return;
        }

        await Promise.all(
          commits.map(async commit =>
            this.addReleased(auto, commit, newVersion)
          )
        );
      }
    );
  }

  private async addReleased(
    auto: Auto,
    commit: IExtendedCommit,
    newVersion: string
  ) {
    const messages = [commit.subject];

    if (commit.pullRequest) {
      await this.addCommentAndLabel(
        auto,
        newVersion,
        commit.pullRequest.number
      );

      const pr = await auto.git!.getPullRequest(commit.pullRequest.number);
      pr.data.body.split('\n').map(line => messages.push(line));

      const commitsInPr = await auto.git!.getCommitsForPR(
        commit.pullRequest.number
      );
      commitsInPr.map(c => messages.push(c.commit.message));
    }

    const issues = messages
      .map(message => message.match(closeIssue))
      .filter((r): r is string[] => !!r)
      .reduce((all, arr) => [...all, ...arr], [])
      .map(issue => issue.match(/#(\d+)/i))
      .filter((r: RegExpMatchArray | null): r is RegExpMatchArray => !!r)
      .map(match => Number(match[1]));

    await Promise.all(
      issues.map(async issue => {
        await this.addCommentAndLabel(auto, newVersion, issue, true);

        if (this.options.lockIssues) {
          await auto.git!.lockIssue(issue);
        }
      })
    );
  }

  private async addCommentAndLabel(
    auto: Auto,
    newVersion: string,
    prOrIssue: number,
    isIssue = false
  ) {
    // leave a comment with the new version
    const comment = this.createReleasedComment(isIssue, newVersion);
    await auto.git!.createComment(comment, prOrIssue, 'released');

    // add a `released` label to a PR
    await auto.git!.addLabelToPr(prOrIssue, this.options.label);
  }

  private createReleasedComment(isIssue: boolean, version: string) {
    return this.options.message
      .replace(TYPE, isIssue ? 'Issue' : 'PR')
      .replace(VERSION, version);
  }
}
