import LogParse, { parsePR, parseSquashPR } from "../log-parse";

import makeCommitFromMsg from "./make-commit-from-msg";

describe("parsePR", () => {
  test("should do nothing without merge commit", () => {
    const commit = makeCommitFromMsg("Not a merge");
    expect(parsePR(commit)).toStrictEqual(commit);
  });

  test("should parse number base and comment", () => {
    const commit = makeCommitFromMsg(
      "Merge pull request #1234 from Another PR\nComments about the PR"
    );

    expect(parsePR(commit)).toStrictEqual({
      ...commit,
      pullRequest: {
        number: 1234,
        base: "Another PR",
      },
      subject: "Comments about the PR",
    });
  });
});

describe("parseSquashPR", () => {
  test("should do nothing squash merge commit", () => {
    const commit = makeCommitFromMsg("Not a squash");
    expect(parseSquashPR(commit)).toStrictEqual(commit);
  });

  test("should parse PR number and comment", () => {
    const commit = makeCommitFromMsg("Some Message (#1234)");
    expect(parseSquashPR(commit)).toStrictEqual({
      ...commit,
      pullRequest: {
        number: 1234,
      },
      subject: "Some Message",
    });
  });
});

describe("normalizeCommits", () => {
  test("should do nothing with normal commits", async () => {
    const logParse = new LogParse();
    const commits = [
      makeCommitFromMsg("First"),
      makeCommitFromMsg("Second"),
      makeCommitFromMsg("Third"),
    ];

    expect(await logParse.normalizeCommits(commits)).toMatchSnapshot();
  });
});
