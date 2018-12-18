![Markdown](../images/auto.gif)/.header-image\

# :rocket: auto-release :rocket:/.has-text-centered\

CI/CD helpers for github releases. Generate releases based on semantic version labels on pull requests.

Release Features:

- Release every merge to master based on a PR labels
- Skip a release with the `skip-release` label
- Generate a changelog with fancy headers, authors, and monorepo package association
- Generate a Github release

Pull Request Interaction Features:

- Get the labels for a PR
- Set the status of a PR
- Check that a pull request has a SemVer label
- Comment on a PR with markdown
