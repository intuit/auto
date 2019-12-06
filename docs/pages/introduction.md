![Markdown](../images/auto.gif)/.header-image\

# :rocket: auto :rocket:/.has-text-centered\

Automated releases powered by pull request labels. Streamline your release workflow and publish constantly! `auto` is meant to be run in a continuous integration (CI) environment, but all the commands work locally as well.

Release Features:

- Calculate semantic version bumps from PRs
- Skip a release with the `skip-release` label
- Publish canary releases from PRs or locally
- Generate changelogs with fancy headers, authors, and monorepo package association
- Use labels to create new changelog sections
- Generate a GitHub release

Pull Request Interaction Features:

- Get the labels for a PR
- Set the status of a PR
- Check that a pull request has a SemVer label
- Comment on a PR with markdown
- Update the PR body with contextual build metadata
