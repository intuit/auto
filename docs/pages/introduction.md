![Markdown](../images/auto.gif)/.header-image\

# :rocket: auto :rocket:/.has-text-centered\

> Automated releases powered by pull request labels

Streamline your release workflow and publish constantly!
`auto` is meant to be run in a continuous integration (CI) environment, but all the commands work locally as well.

The two main problems auto is trying to solve are: release automation and pull request interaction.
With the set of tools we provide you can automate every part of contribution!

<br />

**Release Features:**

- Calculate semantic version bumps from PRs
- Publish [canaries](./generated/canary.md) (test versions) directly from PRs or locally
- Generate changelogs with fancy headers, authors, and [detailed release notes](./generated/changelog.md#additional-release-notes)
- Make GitHub releases

**Pull Request Interaction Features:**

- Get the labels for a PR
- Set the status of a PR
- Comment on a PR with markdown
- Update the PR body with contextual build metadata
