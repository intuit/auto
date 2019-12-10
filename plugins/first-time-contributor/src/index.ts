import { Auto, IPlugin, execPromise } from '@auto-it/core';
import { ICommitAuthor } from '@auto-it/core/dist/log-parse';
import flatMap from 'array.prototype.flatmap';
import endent from 'endent';
import urlJoin from 'url-join';
import { URL } from 'url';

const JUST_NAME = '%aN' as const;
const JUST_EMAIL = '%cE' as const;

type Format = typeof JUST_NAME | typeof JUST_EMAIL;

/** Get some of the contributors from the git history */
const getContributors = async (format: Format) => {
  const start = '$(git rev-list HEAD | tail -n 1)';
  const lastRelease = '$(git describe --tags --abbrev=0)';

  return execPromise(
    `git log --format='${format}' ${start}..${lastRelease} | sort -u`
  );
};

/**
 * Thank first time contributors for their work right in your release notes.
 */
export default class FirstTimeContributorPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'First Time Contributor';

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.onCreateChangelog.tap(this.name, changelog => {
      const base = new URL(changelog.options.baseUrl).origin;

      /** Format a string for the contributor */
      const renderContributor = ({ name, username }: ICommitAuthor) => {
        const link = `[@${username}](${urlJoin(base, username || '')})`;
        return `${name}${username ? (name ? ` (${link})` : link) : ''}`;
      };

      changelog.hooks.addToBody.tapPromise(
        this.name,
        async (notes, commits) => {
          const authors = flatMap(commits, c => c.authors);

          const contributors = await Promise.all([
            getContributors(JUST_NAME),
            getContributors(JUST_EMAIL),
            auto
              .git!.github.repos.listContributors({
                repo: auto.git!.options.repo,
                owner: auto.git!.options.owner
              })
              .then(response =>
                response.data.map(collaborator => collaborator.login).join('\n')
              )
          ]).then(lists => lists.join('\n').split('\n'));

          const newContributors = authors.filter(
            ({ name = '', email = '', username = '' }) =>
              !(
                (name && contributors.includes(name)) ||
                (email && contributors.includes(email)) ||
                (username && contributors.includes(username))
              )
          );

          if (!newContributors.length) {
            return notes;
          }

          const lines = new Set(newContributors.map(renderContributor));
          let thankYou: string;

          if (lines.size > 1) {
            thankYou = endent`
              :tada: This release contains work from new contributors! :tada:
            
              Thanks for all your work!\n\n${[...lines]
                .map(line => `:heart: ${line}`)
                .join('\n\n')}
            `;
          } else {
            thankYou = endent`
              :tada: This release contains work from a new contributor! :tada:
            
              Thank you, ${[...lines][0]}, for all your work!
            `;
          }

          return [...notes, thankYou];
        }
      );
    });
  }
}
