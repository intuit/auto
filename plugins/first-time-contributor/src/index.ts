import { Auto, IPlugin, execPromise } from '@auto-it/core';
import { ICommitAuthor } from '@auto-it/core/dist/log-parse';
import dedent from 'dedent';
import urlJoin from 'url-join';
import { URL } from 'url';

export default class FirstTimeContributorPlugin implements IPlugin {
  name = 'First Time Contributor';

  apply(auto: Auto) {
    auto.hooks.onCreateChangelog.tap(this.name, changelog => {
      const renderContributor = (n: ICommitAuthor) => {
        let line = n.name || '';

        if (n.username) {
          const base = new URL(changelog.options.baseUrl).origin;
          const link = `[@${n.username}](${urlJoin(base, n.username)})`;

          line += n.name ? ` (${link})` : link;
        }

        return line;
      };

      changelog.hooks.addToBody.tapPromise(
        this.name,
        async (notes, commits) => {
          if (!auto.git) {
            return notes;
          }

          const contributors = (await Promise.all([
            execPromise(
              "git log --format='%aN' $(git rev-list HEAD | tail -n 1)..$(git describe --tags --abbrev=0) | sort -u"
            ),
            execPromise(
              "git log --format='%cE' $(git rev-list HEAD | tail -n 1)..$(git describe --tags --abbrev=0) | sort -u"
            )
          ]))
            .join('\n')
            .split('\n');

          const authors = commits
            .map(c => c.authors)
            .reduce<ICommitAuthor[]>((acc, i) => [...acc, ...i], []);

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
            thankYou = dedent`
              :tada: This release contains work from new contributors! :tada:
            
              Thanks for all your work!\n\n${[...lines]
                .map(line => `:heart: ${line}`)
                .join('\n\n')}
            `;
          } else {
            thankYou = dedent`
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
