import flatten from 'arr-flatten';
import { AsyncSeriesBailHook, AsyncSeriesWaterfallHook } from 'tapable';
import { URL } from 'url';
import join from 'url-join';

import dedent from 'dedent';
import { ICommitAuthor, IExtendedCommit } from './log-parse';
import { ILabelDefinitionMap } from './release';
import { ILogger } from './utils/logger';
import { makeChangelogHooks } from './utils/make-hooks';

export interface IGenerateReleaseNotesOptions {
  owner: string;
  repo: string;
  baseUrl: string;
  labels: ILabelDefinitionMap;
  baseBranch: string;
}

interface ICommitSplit {
  [key: string]: IExtendedCommit[];
}

export interface IChangelogHooks {
  renderChangelogLine: AsyncSeriesWaterfallHook<[[IExtendedCommit, string]]>;
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
  omitReleaseNotes: AsyncSeriesBailHook<[IExtendedCommit], boolean | void>;
}

const getHeaderDepth = (line: string) =>
  line.split('').reduce((count, char) => (char === '#' ? count + 1 : count), 0);

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
    this.options.labels.pushToBaseBranch = {
      name: 'pushToBaseBranch',
      title: `⚠️  Pushed to ${options.baseBranch}`,
      description: 'N/A',
      ...(this.options.labels.pushToBaseBranch || {})
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
    this.hooks.renderChangelogLine.tap('Default', ([commit, line]) => [
      commit,
      line
    ]);
    this.hooks.renderChangelogTitle.tap(
      'Default',
      (label, changelogTitles) => `#### ${changelogTitles[label]}\n`
    );
    this.hooks.omitReleaseNotes.tap('Renovate', commit => {
      const names = ['renovate-pro[bot]', 'renovate-bot'];

      if (
        commit.authors.find(author =>
          Boolean(
            (author.name && names.includes(author.name)) ||
              (author.username && names.includes(author.username))
          )
        )
      ) {
        return true;
      }
    });
  }

  async generateReleaseNotes(commits: IExtendedCommit[]): Promise<string> {
    if (commits.length === 0) {
      return '';
    }

    this.logger.verbose.info('Generating release notes for:\n', commits);
    const split = this.splitCommits(commits);
    this.logger.verbose.info('Split commits into groups');
    this.logger.veryVerbose.info('\n', split);
    const sections: string[] = [];

    await this.createReleaseNotesSection(commits, sections);
    this.logger.verbose.info('Added release notes to changelog');

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
  private splitCommits(commits: IExtendedCommit[]): ICommitSplit {
    let currentCommits = [...commits];
    const order = ['major', 'minor', 'patch'];
    const sections = Object.values(this.options.labels)
      .filter(label => label.title)
      .sort((a, b) => {
        const bIndex = order.indexOf(b.name) + 1 || order.length + 1;
        const aIndex = order.indexOf(a.name) + 1 || order.length + 1;
        return aIndex - bIndex;
      });

    commits
      .filter(({ labels }) => labels.length === 0)
      .map(({ labels }) => labels.push('patch'));

    return Object.assign(
      {},
      ...sections.map(label => {
        const matchedCommits = filterLabel(currentCommits, label.name);
        currentCommits = currentCommits.filter(
          commit => !matchedCommits.includes(commit)
        );

        return matchedCommits.length === 0
          ? {}
          : { [label.name]: matchedCommits };
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
    const subject = commit.subject ? commit.subject.trim() : '';
    let pr = '';

    if (commit.pullRequest && commit.pullRequest.number) {
      const prLink = join(
        this.options.baseUrl,
        'pull',
        commit.pullRequest.number.toString()
      );
      pr = `[#${commit.pullRequest.number}](${prLink})`;
    }

    const user = await this.createUserLinkList(commit);
    return `- ${subject} ${pr}${user ? ` (${user})` : ''}`;
  }

  private async createAuthorSection(split: ICommitSplit, sections: string[]) {
    const seenUsers = new Set<string>();
    const authors = new Set<string>();
    const commits = Object.values(split).reduce(
      (
        labeledCommits: IExtendedCommit[],
        sectionCommits: IExtendedCommit[]
      ) => [...labeledCommits, ...sectionCommits],
      []
    );

    await Promise.all(
      flatten(
        commits.map(commit =>
          commit.authors.map(async author => {
            if (author.username === 'invalid-email-address') {
              return;
            }

            const user = await this.hooks.renderChangelogAuthor.promise(
              author,
              commit,
              this.options
            );

            if (user && seenUsers.has(user)) {
              return;
            }

            seenUsers.add(user as string);

            const authorEntry = await this.hooks.renderChangelogAuthorLine.promise(
              author,
              user as string
            );

            if (authorEntry && !authors.has(authorEntry)) {
              authors.add(authorEntry);
            }
          })
        )
      )
    );

    if (authors.size === 0) {
      return;
    }

    let authorSection = `#### Authors: ${authors.size}\n\n`;
    authorSection += [...authors].join('\n');
    sections.push(authorSection);
  }

  private async createLabelSection(split: ICommitSplit, sections: string[]) {
    const changelogTitles = Object.entries(this.options.labels).reduce(
      (titles, [, labelDef]) => {
        if (labelDef.title) {
          titles[labelDef.name] = labelDef.title;
        }

        return titles;
      },
      {} as { [label: string]: string }
    );

    const labelSections = await Promise.all(
      Object.entries(split).map(async ([label, labelCommits]) => {
        const title = await this.hooks.renderChangelogTitle.promise(
          label,
          changelogTitles
        );

        const lines = await Promise.all(
          labelCommits.map(async commit => {
            const [, line] = await this.hooks.renderChangelogLine.promise([
              commit,
              await this.generateCommitNote(commit)
            ]);

            return line;
          })
        );

        return [
          title,
          ...lines.sort((a, b) => a.split('\n').length - b.split('\n').length)
        ].join('\n');
      })
    );

    labelSections.map(section => sections.push(section));
  }

  private async createReleaseNotesSection(
    commits: IExtendedCommit[],
    sections: string[]
  ) {
    if (!commits.length) {
      return;
    }

    let section = '';
    const visited = new Set<number>();
    const included = await Promise.all(
      commits.map(async commit => {
        const omit = await this.hooks.omitReleaseNotes.promise(commit);

        if (!omit) {
          return commit;
        }
      })
    );

    included.map(commit => {
      if (!commit) {
        return;
      }

      const pr = commit.pullRequest;

      if (!pr || !pr.body) {
        return;
      }

      const title = /^[#]{0,5}[ ]*[R|r]elease [N|n]otes$/;
      const lines = pr.body.split('\n').map(line => line.replace(/\r$/, ''));
      const notesStart = lines.findIndex(line => Boolean(line.match(title)));

      if (notesStart === -1 || visited.has(pr.number)) {
        return;
      }

      const depth = getHeaderDepth(lines[notesStart]);
      visited.add(pr.number);
      let notes = '';

      for (let index = notesStart; index < lines.length; index++) {
        const line = lines[index];
        const isTitle = line.match(title);

        if (line.startsWith('#') && getHeaderDepth(line) <= depth && !isTitle) {
          break;
        }

        if (!isTitle) {
          notes += `${line}\n`;
        }
      }

      section += dedent`
        _From #${pr.number}_

        ${notes.trim()}\n\n
      `;
    });

    if (!section) {
      return;
    }

    sections.push(dedent`
      ### Release Notes

      ${section}---
    `);
  }
}
