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
    /** Name of the branch the PR was made from */
    headRefName: string;
    /** Use of the fork the PR was made from */
    headRepositoryOwner: {
      /** Username of the owner of the fork the PR was made from */
      login: string;
    };
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

export type ISearchQuery = Record<string, ISearchResult>;

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
              headRefName
              headRepositoryOwner {
                login
              }
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
export function processQueryResult({
  owner,
  sha,
  result,
  commitsWithoutPR,
  prereleaseBranches,
}: {
  /** The owner of the main fork of the repo to automate releases for */
  owner: string;
  /** The commit sha to process */
  sha: string;
  /** The graphql response for the search query hash */
  result: ISearchResult;
  /** Commits that do not yet have a PR matched to them */
  commitsWithoutPR: IExtendedCommit[];
  /** Branches to treat as pre-releases */
  prereleaseBranches: string[];
}) {
  const hash = sha.split("hash_")[1];
  const commit = commitsWithoutPR.find(
    (commitWithoutPR) => commitWithoutPR.hash === hash
  );

  if (!commit) {
    return;
  }

  // When matching SHA to PR only take merged into account. You can have
  // multiple open PRs with the same commits, such as in a rebase.
  const prs = result.edges.filter((edge) => edge.node.state === "MERGED");
  const isInPrerelease = result.edges.filter(
    (edge) =>
      prereleaseBranches.includes(edge.node.headRefName) &&
      edge.node.headRepositoryOwner.login === owner
  );

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
  } else if (!result.edges.length || isInPrerelease.length) {
    commit.labels = ["pushToBaseBranch", ...commit.labels];
  }

  commit.subject = commit.subject.split("\n")[0];

  return commit;
}
