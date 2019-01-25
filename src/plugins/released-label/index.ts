import merge from 'deepmerge';
import { IExtendedCommit } from '../../log-parse';
import { Auto, IPlugin } from '../../main';

interface IReleasedLabelPluginOptions {
  message: string;
  label: string;
}

const TYPE = '%TYPE';
const VERSION = '%VERSION';
const defaultOptions = {
  label: 'released',
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
    auto.hooks.afterShipIt.tap(this.name, async (newVersion, commits) => {
      await Promise.all(
        commits.map(async commit => this.addReleased(auto, commit, newVersion))
      );
    });
  }

  private async addReleased(
    auto: Auto,
    commit: IExtendedCommit,
    newVersion: string
  ) {
    const messages = [commit.subject];

    if (commit.pullRequest) {
      // leave a comment with the new version
      auto.git!.createComment(
        this.createReleasedComment(false, newVersion),
        commit.pullRequest.number
      );

      // add a `released` label to a PR
      auto.git!.addLabelToPr(commit.pullRequest.number, this.options.label);

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
      .reduce((all, arr) => [...all, ...arr], []);

    issues.map(issue => {
      const pr = issue.match(/#(\d+)/i);

      if (!pr) {
        return;
      }

      // comment on issues closed with PR with new version
      auto.git!.createComment(
        this.createReleasedComment(true, newVersion),
        Number(pr[1])
      );
    });
  }

  private createReleasedComment(isIssue: boolean, version: string) {
    return this.options.message
      .replace(TYPE, isIssue ? 'Issue' : 'PR')
      .replace(VERSION, version);
  }
}
