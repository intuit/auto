/* eslint-disable no-await-in-loop */
import { Auto, getCurrentBranch, IPlugin } from "@auto-it/core";
import { ICommitAuthor } from "@auto-it/core/dist/log-parse";
import botList from "@auto-it/bot-list";
import flatMap from "array.prototype.flatmap";
import endent from "endent";
import urlJoin from "url-join";
import { URL } from "url";

interface QueryNode {
  /** The query node */
  node: {
    /** The commit message */
    message: "remove canary context";
  };
}

interface QueryResponse {
  /** The repo queried */
  repository: {
    /** The object queried */
    object: {
      /** The commit history */
      history: {
        /** The edges in the query */
        edges: QueryNode[];
      };
    };
  };
}

/**
 * Thank first time contributors for their work right in your release notes.
 */
export default class FirstTimeContributorPlugin implements IPlugin {
  /** The name of the plugin */
  name = "first-time-contributor";

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.onCreateChangelog.tap(this.name, (changelog) => {
      const base = new URL(changelog.options.baseUrl).origin;

      /** Format a string for the contributor */
      const renderContributor = ({ name, username }: ICommitAuthor) => {
        const link = `[@${username}](${urlJoin(base, username || "")})`;
        return `${name}${username ? (name ? ` (${link})` : link) : ""}`;
      };

      changelog.hooks.addToBody.tapPromise(
        this.name,
        async (notes, commits) => {
          const newContributors: ICommitAuthor[] = [];

          for (const author of flatMap(commits, (c) => c.authors)) {
            if (
              !author.username ||
              author.type === "Bot" ||
              botList.includes(author.username) ||
              (author.name && botList.includes(author.name))
            ) {
              continue;
            }

            const user = await auto.git?.getUserByUsername(author.username);

            if (!user) {
              continue;
            }

            // prettier-ignore
            const userCommits = await auto.git?.graphql<QueryResponse>(`
              {
                repository(name: "${auto.git?.options.repo}", owner: "${auto.git?.options.owner}") {
                  object(expression: "${getCurrentBranch()}") {
                    ... on Commit {
                      history(after: "${commits[0].hash} 0", first: 1, author: { id: "${user.id}" }) {
                        edges {
                          node {
                            message
                          }
                        }
                      }
                    }
                  }
                }
              }
            `)

            if (
              userCommits &&
              userCommits.repository.object.history.edges.length === 0
            ) {
              newContributors.push(author);
            }
          }

          if (!newContributors.length) {
            return notes;
          }

          const lines = new Set(newContributors.map(renderContributor));
          let thankYou: string;

          if (lines.size > 1) {
            thankYou = endent`
              :tada: This release contains work from new contributors! :tada:

              Thanks for all your work!\n\n${[...lines]
                .map((line) => `:heart: ${line}`)
                .join("\n\n")}
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
