import endent from "endent";
import Changelog, { IGenerateReleaseNotesOptions } from "../changelog";
import LogParse from "../log-parse";
import { dummyLog } from "../utils/logger";

import makeCommitFromMsg from "./make-commit-from-msg";
import SEMVER, { defaultLabels } from "../semver";
import { getCurrentBranch } from "../utils/get-current-branch";

const currentBranchSpy = getCurrentBranch as jest.Mock;
jest.mock("../utils/get-current-branch");

const testOptions = (): IGenerateReleaseNotesOptions => ({
  owner: "foobar",
  repo: "auto",
  baseUrl: "https://github.custom.com/foobar/auto",
  labels: [...defaultLabels],
  baseBranch: "main",
  prereleaseBranches: ["next"],
});

const logParse = new LogParse();

describe("createUserLink", () => {
  test("should", () => {
    const changelog = new Changelog(dummyLog(), {
      owner: "",
      repo: "",
      baseUrl: "https://github.custom.com/",
      labels: [...defaultLabels],
      baseBranch: "main",
      prereleaseBranches: ["next"],
    });
    changelog.loadDefaultHooks();

    expect(
      changelog.createUserLink(
        {
          name: "none",
          email: undefined,
          username: "invalid-email-address",
        },
        {
          hash: "1",
          files: [],
          labels: [],

          pullRequest: {
            number: 22,
          },
          authorName: "none",
          authorEmail: "default@email.com",
          authors: [
            {
              name: "none",
              email: undefined,
            },
          ],
          subject: "",
        }
      )
    ).toBe(undefined);
  });

  test("should find email", () => {
    const changelog = new Changelog(dummyLog(), {
      owner: "",
      repo: "",
      baseUrl: "https://github.custom.com/",
      labels: [...defaultLabels],
      baseBranch: "main",
      prereleaseBranches: ["next"],
    });
    changelog.loadDefaultHooks();

    expect(
      changelog.createUserLink(
        {
          name: "none",
          email: undefined,
        },
        {
          hash: "1",
          files: [],
          labels: [],
          pullRequest: {
            number: 22,
          },
          authorName: "none",
          authorEmail: "default@email.com",
          authors: [
            {
              name: "none",
              email: undefined,
            },
          ],
          subject: "",
        }
      )
    ).toBe("default@email.com");
  });
});

describe("Hooks", () => {
  test("title", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)"),
    ]);

    changelog.hooks.renderChangelogTitle.tap(
      "test",
      (label, changelogTitles) => `:heart: ${changelogTitles[label]} :heart:`
    );
    changelog.loadDefaultHooks();

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("author", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)"),
    ]);

    changelog.hooks.renderChangelogAuthor.tap(
      "test",
      (author, commit) => `:heart: ${author.name}/${commit.authorEmail} :heart:`
    );

    changelog.hooks.renderChangelogAuthorLine.tap(
      "test",
      (author, user) => `:shipit: ${author.name} (${user})`
    );
    changelog.loadDefaultHooks();

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });
});

describe("generateReleaseNotes", () => {
  test("should create note for PR commits", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)", { labels: ["minor"] }),
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should omit authors with invalid email addresses", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)", { labels: ["minor"] }),
    ]);
    normalized[0].authors[0].username = "invalid-email-address";

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should create note for PR commits without labels", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)"),
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should create note for PR commits without labels with custom patch label", async () => {
    const options = testOptions();
    options.labels = [
      {
        name: "Version: Patch",
        changelogTitle: "🐛  Bug Fix",
        description: "N/A",
        releaseType: SEMVER.patch,
      },
    ];

    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)"),
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should create note for PR commits with only non config labels", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)", {
        labels: ["someOtherNonConfigLabel"],
      }),
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should prefer section with highest releaseType for PR with multiple labels", async () => {
    const options = testOptions();
    options.labels = [
      {
        name: "Internal",
        changelogTitle: "Internal Section",
        releaseType: "none",
      },
      {
        name: "Version: Minor",
        changelogTitle: "Minor Section",
        releaseType: SEMVER.minor,
      },
    ];

    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)", {
        labels: ["Internal", "Version: Minor"],
      }),
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should prefer section defined first in config for PR with multiple labels of same releaseType", async () => {
    const options = testOptions();
    options.labels = [
      {
        name: "Internal",
        changelogTitle: "Internal Section",
        releaseType: "none",
      },
      {
        name: "Typescript",
        changelogTitle: "Typescript Section",
        releaseType: "none",
      },
    ];

    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)", {
        labels: ["Typescript", "Internal"],
      }),
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should prefer section of default label for PR with multiple labels of same releaseType", async () => {
    const options = testOptions();
    options.labels = [
      ...options.labels,
      {
        name: "Minor2",
        changelogTitle: "Minor 2 Section",
        releaseType: SEMVER.minor,
      },
    ];

    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)", {
        labels: ["Minor2", "minor"],
      }),
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should use username if present", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)", {
        labels: ["minor"],
        username: "adam",
      }),
    ]);

    normalized[0].authors[0].username = "adam";

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should combine pr w/no label and labelled pr", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)"),
      makeCommitFromMsg("Third", { labels: ["patch"] }),
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should include prs with released label", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const normalized = await logParse.normalizeCommits([
      makeCommitFromMsg("Some Feature (#1234)", { labels: ["released"] }),
      makeCommitFromMsg("Third", { labels: ["patch"] }),
    ]);

    expect(await changelog.generateReleaseNotes(normalized)).toMatchSnapshot();
  });

  test("should use only email if author name doesn't exist", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();
    const commits = await logParse.normalizeCommits([
      {
        hash: "foo",
        files: [],
        labels: [],
        authorEmail: "adam@dierkens.com",
        subject: "Another Feature (#1234)",
      },
      {
        hash: "foo",
        files: [],
        labels: [],
        subject: "One Feature (#1235)",
      },
    ]);

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("should include PR-less commits as patches", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "1",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "I was a push to main\n\nfoo bar",
        labels: ["pushToBaseBranch"],
      },
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
    ]);

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("should include PR-less commits as the default label", async () => {
    const options = testOptions();
    options.labels[1] = {
      ...options.labels[1],
      default: true,
    };
    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "1",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "I was a push to main\n\nfoo bar",
      },
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
    ]);

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test('should add "Push to Next"', async () => {
    currentBranchSpy.mockReturnValueOnce("next");
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "1",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "I was a push to main\n\n",
        labels: ["pushToBaseBranch"],
      },
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
    ]);

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("should order the section major, minor, patch, then the rest", async () => {
    const options = testOptions();
    options.labels = [
      options.labels.find((l) => l.name === "documentation")!,
      options.labels.find((l) => l.name === "internal")!,
      options.labels.find((l) => l.name === "patch")!,
      options.labels.find((l) => l.name === "minor")!,
      options.labels.find((l) => l.name === "major")!,
    ];

    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "0a",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "something\n\n",
        labels: ["internal"],
      },
      {
        hash: "0",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "docs\n\n",
        labels: ["documentation"],
      },

      {
        hash: "1",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "I was a push to main\n\n",
        labels: ["patch"],
      },
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["major"],
      },
    ]);

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("should match authors correctly", async () => {
    const options = testOptions();
    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "0a",
        files: [],
        subject: "something\n\n",
        labels: ["internal"],
      },
      {
        hash: "0",
        files: [],
        subject: "docs\n\n",
        labels: ["documentation"],
      },
      {
        hash: "0",
        files: [],
        subject: "another\n\n",
        labels: ["documentation"],
      },
    ]);

    commits.forEach((commit, index) => {
      switch (index) {
        case 0:
          commit.authors = [{ email: "andrew@email.com" }];
          break;
        case 1:
          commit.authors = [{ email: "kendall@email.com" }];
          break;
        case 2:
          commit.authors = [{ username: "rdubzz" }];
          break;
        default:
      }
    });

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("should be able to customize pushToBaseBranch title", async () => {
    const options = testOptions();
    options.labels = [
      ...options.labels,
      {
        name: "pushToBaseBranch",
        changelogTitle: "Custom Title",
        description: "N/A",
        releaseType: "none",
      },
    ];

    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "1",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "I was a push to main\n\n",
        labels: ["pushToBaseBranch"],
      },
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
    ]);

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("should omit changelog item for next branches", async () => {
    const options = testOptions();
    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
    ]);

    expect(
      await changelog.generateReleaseNotes([
        {
          ...commits[0],
          hash: "1",
          files: [],
          authorName: "Adam Dierkens",
          authorEmail: "adam@dierkens.com",
          subject: "V8\n\n",
          labels: [""],
          pullRequest: {
            base: "intuit/next",
            number: 123,
            body: "# Release Notes\n\nfoobar",
          },
        },
        ...commits,
      ])
    ).toMatchSnapshot();
  });

  test("should be able to customize titles", async () => {
    const options = testOptions();
    options.labels = [
      ...options.labels,
      {
        name: "Version: Minor",
        changelogTitle: "Woo Woo New Features",
        description: "N/A",
        releaseType: SEMVER.minor,
      },
    ];

    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["Version: Minor"],
      },
    ]);

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("should merge sections with same changelog title", async () => {
    const options = testOptions();
    options.labels = [
      ...options.labels,
      {
        name: "new-component",
        changelogTitle: "Enhancement",
        releaseType: SEMVER.minor,
      },
      {
        name: "Version: Minor",
        changelogTitle: "Enhancement",
        description: "N/A",
        releaseType: SEMVER.minor,
      },
    ];

    const changelog = new Changelog(dummyLog(), options);
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "3",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "Second Feature (#1236)",
        labels: ["new-component"],
      },
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["Version: Minor"],
      },
    ]);

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("should add additional release notes", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
    ]);
    commits[0].pullRequest!.body = endent`
      # Why

      Some words

      ## Release Notes

      Here is how you upgrade

      ## Todo

      - [ ] add tests
    `;

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("should not add automated comments to additional release notes", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
    ]);
    commits[0].pullRequest!.body = endent`
      ## Release Notes

      Here is how you upgrade

      <!-- GITHUB_RELEASE PR BODY: prerelease-version -->
      Should not show up in notes
      <!-- GITHUB_RELEASE PR BODY: prerelease-version -->
    `;

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("additional release notes should be able to contain sub-headers", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
    ]);
    commits[0].pullRequest!.body = endent`
      # Why

      Some words

      ## Release Notes

      Here is how you upgrade

      ### Things you should really know

      Bam!?

      ## Todo

      - [ ] add tests
    `;

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("doesn't add additional release notes when there are none", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
    ]);
    commits[0].pullRequest!.body = endent`
      # Why

      Some words
    `;

    const res = await changelog.generateReleaseNotes(commits);
    expect(res).toMatchSnapshot();
  });

  test("additional release notes should omit renovate prs", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();

    const commits = await logParse.normalizeCommits([
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor"],
      },
    ]);
    commits[0].authors[0].username = "renovate-bot";
    commits[0].pullRequest!.body = endent`
      # Why

      Some words

      ## Release Notes

      Here is how you upgrade

      ### Things you should really know

      Bam!?

      ## Todo

      - [ ] add tests
    `;

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });

  test("additional release notes should have tappable omit", async () => {
    const changelog = new Changelog(dummyLog(), testOptions());
    changelog.loadDefaultHooks();

    changelog.hooks.omitReleaseNotes.tap("test", (commit) => {
      if (commit.labels.includes("no-notes")) {
        return true;
      }
    });

    const commits = await logParse.normalizeCommits([
      {
        hash: "2",
        files: [],
        authorName: "Adam Dierkens",
        authorEmail: "adam@dierkens.com",
        subject: "First Feature (#1235)",
        labels: ["minor", "no-notes"],
      },
    ]);
    commits[0].pullRequest!.body = endent`
      # Why

      Some words

      ## Release Notes

      Here is how you upgrade

      ### Things you should really know

      Bam!?

      ## Todo

      - [ ] add tests
    `;

    expect(await changelog.generateReleaseNotes(commits)).toMatchSnapshot();
  });
});
