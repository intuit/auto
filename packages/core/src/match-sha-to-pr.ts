import endent from "endent";

import { IExtendedCommit } from "./log-parse";
import { ILabelDefinition } from "./release";

interface ISearchEdge {
  /** Graphql search node */
  node: {
    /** PR number */
    number: number;
    /** State of the PR */
    state: "MERGED" | "CLOSED" | "OPEN";
    /** Body of the PR */
    body: string;
    /** Labels attached to the PR */
    labels: {
      /** Edges of the Query */
      edges: [
        {
          /** Graphql search node */
          node: {
            /** Name of the label */
            name: string;
          };
        }
      ];
    };
  };
}

export interface ISearchResult {
  /** Results in the search */
  edges: ISearchEdge[];
}

/**
 * Generate a GitHub graphql query to find all the commits related
 * to a PR.
 */
export function buildSearchQuery(
  owner: string,
  project: string,
  commits: string[]
) {
  const repo = `${owner}/${project}`;
  const query = commits.reduce((q, commit) => {
    const subQuery = `repo:${repo} ${commit}`;

    return endent`
      ${q}

      hash_${commit}: search(query: "${subQuery}", type: ISSUE, first: 10) {
        edges {
          node {
            ... on PullRequest {
              number
              state
              body
              labels(first: 10) {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;
  }, "");

  if (!query) {
    return;
  }

  return `{
    ${query}
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }`;
}

/** Use the graphql query result to fill in more information about a commit */
export function processQueryResult(
  key: string,
  result: ISearchResult,
  commitsWithoutPR: IExtendedCommit[]
) {
  const hash = key.split("hash_")[1];
  const commit = commitsWithoutPR.find(
    (commitWithoutPR) => commitWithoutPR.hash === hash
  );

  if (!commit) {
    return;
  }

  // When matching SHA to PR only take merged into account. You can have
  // multiple open PRs with the same commits, such as in a rebase.
  const prs = result.edges.filter((edge) => edge.node.state === "MERGED");

  if (prs.length) {
    const pr = prs[0].node;
    const labels: ILabelDefinition[] = pr.labels
      ? pr.labels.edges.map((edge) => edge.node)
      : [];
    commit.pullRequest = {
      number: pr.number,
      body: pr.body,
    };
    commit.labels = [...labels.map((label) => label.name), ...commit.labels];
  } else if (!result.edges.length) {
    commit.labels = ["pushToBaseBranch", ...commit.labels];
  }

  commit.subject = commit.subject.split("\n")[0];

  return commit;
}
