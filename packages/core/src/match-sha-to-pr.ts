import endent from 'endent';

import { IExtendedCommit } from './log-parse';

interface ISearchEdge {
  /** Graphql search node */
  node: {
    /** PR number */
    number: number;
    /** State of the PR */
    state: 'MERGED' | 'CLOSED' | 'OPEN';
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

      hash_${commit}: search(query: "${subQuery}", type: ISSUE, first: 1) {
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
  }, '');

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
  const hash = key.split('hash_')[1];
  const commit = commitsWithoutPR.find(
    commitWithoutPR => commitWithoutPR.hash === hash
  );

  if (!commit) {
    return;
  }

  if (result.edges.length > 0) {
    if (result.edges[0].node.state === 'CLOSED') {
      return;
    }

    const labels: {
      /** The label */
      name: string;
    }[] = result.edges[0].node.labels
      ? result.edges[0].node.labels.edges.map(edge => edge.node)
      : [];
    commit.pullRequest = {
      number: result.edges[0].node.number,
      body: result.edges[0].node.body
    };
    commit.labels = [...labels.map(label => label.name), ...commit.labels];
  } else {
    commit.labels = ['pushToBaseBranch', ...commit.labels];
  }

  commit.subject = commit.subject.split('\n')[0];

  return commit;
}
