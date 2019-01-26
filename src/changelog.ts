import { AsyncSeriesBailHook } from 'tapable';
import { URL } from 'url';
import join from 'url-join';

import { ICommitAuthor, IExtendedCommit } from './log-parse';
import { ILabelDefinitionMap } from './release';
import { ILogger } from './utils/logger';
import { makeChangelogHooks } from './utils/make-hooks';

export interface IGenerateReleaseNotesOptions {
  owner: string;
  repo: string;
  baseUrl: string;
  jira?: string;
  labels: ILabelDefinitionMap;
}

export interface IChangelogHooks {
  renderChangelogLine: AsyncSeriesBailHook<
    [IExtendedCommit[], (commit: IExtendedCommit) => Promise<string>],
    string[] | void
  >;
  renderChangelogTitle: AsyncSeriesBailHook<
    [string, { [label: string]: string }],
    string | void
  >;
  renderChangelogAuthor: AsyncSeriesBailHook<
    [ICommitAuthor, IExtendedCommit, IGenerateReleaseNotesOptions],
    string | void
  >;
  renderChangelogAuthorLine: AsyncSeriesBailHook<
    [ICommitAuthor, string],
    string | void
  >;
}

const filterLabel = (commits: IExtendedCommit[], label: string) =>
  commits.filter(commit => commit.labels.includes(label));

export default class Changelog {
  readonly hooks: IChangelogHooks;
  private readonly logger: ILogger;
  private readonly options: IGenerateReleaseNotesOptions;

  constructor(logger: ILogger, options: IGenerateReleaseNotesOptions) {
    this.logger = logger;
    this.options = options;
    this.hooks = makeChangelogHooks();
    this.options.labels.pushToMaster = {
      name: 'pushToMaster',
      title: '⚠️  Pushed to master',
      description: 'N/A',
      ...(this.options.labels.pushToMaster || {})
    };
  }

  loadDefaultHooks() {
    this.hooks.renderChangelogAuthor.tap('Default', (author, commit) =>
      this.createUserLink(author, commit)
    );
    this.hooks.renderChangelogAuthorLine.tap('Default', (author, user) => {
      const authorString =
        author.name && user ? `${author.name} (${user})` : user;
      return authorString ? `- ${authorString}` : undefined;
    });
    this.hooks.renderChangelogLine.tapPromise(
      'Default',
      async (currCommits, renderLine) =>
        Promise.all(currCommits.map(async commit => renderLine(commit)))
    );
    this.hooks.renderChangelogTitle.tap(
      'Default',
      (label, changelogTitles) => `#### ${changelogTitles[label]}\n`
    );
  }

  // Every Commit will either be a PR, jira story, or push to master (patch)
  async generateReleaseNotes(commits: IExtendedCommit[]): Promise<string> {
    if (commits.length === 0) {
      return '';
    }

    this.logger.verbose.info('Generating release notes for:\n', commits);
    const split = this.splitCommits(commits);
    this.logger.verbose.info('Split commits into groups');
    this.logger.veryVerbose.info('\n', split);
    const sections: string[] = [];

    await this.createLabelSection(split, sections);
    this.logger.verbose.info('Added groups to changelog');

    await this.createAuthorSection(split, sections);
    this.logger.verbose.info('Added authors to changelog');

    const result = sections.join('\n\n');
    this.logger.verbose.info('Successfully generated release notes.');

    return result;
  }

  createUserLink(author: ICommitAuthor, commit: IExtendedCommit) {
    const githubUrl = new URL(this.options.baseUrl).origin;

    if (author.username === 'invalid-email-address') {
      return;
    }

    return author.username
      ? `[@${author.username}](${join(githubUrl, author.username)})`
      : author.email || commit.authorEmail;
  }

  /**
   * Split commits into changelogTitle sections.
   */
  private splitCommits(
    commits: IExtendedCommit[]
  ): {
    [key: string]: IExtendedCommit[];
  } {
    let currentCommits = [...commits];

    commits
      .filter(commit => commit.labels.length === 0)
      .map(commit => commit.labels.push('patch'));

    const sections = Object.values(this.options.labels).filter(
      label => label.title
    );

    return Object.assign(
      {},
      ...sections.map(label => {
        const matchedCommits = filterLabel(currentCommits, label.name);

        if (matchedCommits.length === 0) {
          return {};
        }

        currentCommits = currentCommits.filter(
          commit => !matchedCommits.includes(commit)
        );

        return {
          [label.name]: matchedCommits
        };
      })
    );
  }

  private async createUserLinkList(commit: IExtendedCommit) {
    const result = new Set<string>();

    await Promise.all(
      commit.authors.map(async author => {
        const link = await this.hooks.renderChangelogAuthor.promise(
          author,
          commit,
          this.options
        );
        if (link) {
          result.add(link);
        }
      })
    );

    return [...result].join(' ');
  }

  private async generateCommitNote(commit: IExtendedCommit) {
    let jira = '';
    let pr = '';

    if (commit.jira && this.options.jira) {
      const link = join(this.options.jira, ...commit.jira.number);
      jira = `[${commit.jira.number}](${link}): `;
    }

    if (commit.pullRequest) {
      const prLink = join(
        this.options.baseUrl,
        'pull',
        commit.pullRequest.number.toString()
      );
      pr = `[#${commit.pullRequest.number}](${prLink})`;
    }

    const user = await this.createUserLinkList(commit);
    return `- ${jira}${commit.subject.trim()} ${pr}${user ? ` (${user})` : ''}`;
  }

  private async createAuthorSection(
    split: {
      [key: string]: IExtendedCommit[];
    },
    sections: string[]
  ) {
    const authors = new Set<string>();
    const commits = Object.values(split).reduce(
      (
        labeledCommits: IExtendedCommit[],
        sectionCommits: IExtendedCommit[]
      ) => [...labeledCommits, ...sectionCommits],
      []
    );

    await Promise.all(
      commits.map(async commit => {
        commit.authors.map(async author => {
          if (author.username === 'invalid-email-address') {
            return;
          }

          const user = await this.hooks.renderChangelogAuthor.promise(
            author,
            commit,
            this.options
          );
          const authorEntry = await this.hooks.renderChangelogAuthorLine.promise(
            author,
            user as string
          );

          if (authorEntry && !authors.has(authorEntry)) {
            authors.add(authorEntry);
          }
        });
      })
    );

    if (authors.size > 0) {
      let authorSection = `#### Authors: ${authors.size}\n\n`;
      authorSection += [...authors].join('\n');
      sections.push(authorSection);
    }
  }

  private async createLabelSection(
    split: {
      [key: string]: IExtendedCommit[];
    },
    sections: string[]
  ) {
    const changelogTitles = Object.entries(this.options.labels).reduce(
      (titles, [, labelDef]) => {
        if (labelDef.title) {
          titles[labelDef.name] = labelDef.title;
        }

        return titles;
      },
      {} as { [label: string]: string }
    );

    await Promise.all(
      Object.entries(split).map(async ([label, labelCommits]) => {
        const title = await this.hooks.renderChangelogTitle.promise(
          label,
          changelogTitles
        );

        const lines = await this.hooks.renderChangelogLine.promise(
          labelCommits,
          async commit => this.generateCommitNote(commit)
        );

        sections.push([title, ...lines].join('\n'));
      })
    );
  }
}
