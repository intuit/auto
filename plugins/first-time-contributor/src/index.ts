import { Auto, IPlugin } from '@auto-it/core';
import { ICommitAuthor } from '@auto-it/core/dist/log-parse';
import flatMap from 'array.prototype.flatmap';
import endent from 'endent';
import urlJoin from 'url-join';
import { URL } from 'url';

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
          const newContributors = (
            await Promise.all(
              flatMap(commits, c => c.authors).map(async author => {
                if (!author.username) {
                  return;
                }

                const prs = await auto.git?.graphql(`
                  {
                    search(first: 2, type: ISSUE, query: "user:${auto.git?.options.owner} repo:${auto.git?.options.repo} author:${author.username} state:closed") {
                      issueCount
                    }
                  }
                `);

                if (prs && prs.search.issueCount <= 1) {
                  return author;
                }
              })
            )
          ).filter((a): a is ICommitAuthor => Boolean(a));

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
