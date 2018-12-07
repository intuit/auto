<div align="center">
  <img width="200" height="200"
    src="./auto.gif">
  <h1>auto-release</h1>
  <p>Generate releases based on semantic version labels on pull requests</p>
</div

[![Codecov](https://img.shields.io/codecov/c/github/intuit/auto-release.svg?style=for-the-badge)](https://codecov.io/gh/intuit/auto-release) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier) [![CircleCI](https://img.shields.io/circleci/project/github/intuit/auto-release/master.svg?style=for-the-badge)](https://circleci.com/gh/intuit/auto-release) [![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=for-the-badge)](#contributors) [![npm](https://img.shields.io/npm/v/auto-release-cli.svg?style=for-the-badge)](https://www.npmjs.com/package/auto-release-cli) [![npm](https://img.shields.io/npm/dt/auto-release-cli.svg?style=for-the-badge)](https://www.npmjs.com/package/auto-release-cli)

CI/CD helpers for github releases. Generate releases based on semantic version labels on pull requests.

Release Features:

- Release every merge to master based on a PR labels
- Skip a release with the `no-release` label
- Generate a changelog with fancy headers, authors, and monorepo package association
- Generate a Github release

Pull Request Interaction Features:

- Get the labels for a PR
- Set the status of a PR
- Check that a pull request has a SemVer label
- Comment on a PR with markdown

Visit [the docs](https://intuit.github.io/auto-release/) for more information.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/13004162?v=4" width="100px;"/><br /><sub><b>Adam Dierkens</b></sub>](https://adamdierkens.com)<br />[💻](https://github.com/intuit/auto-release/commits?author=adierkens "Code") [📖](https://github.com/intuit/auto-release/commits?author=adierkens "Documentation") [🤔](#ideas-adierkens "Ideas, Planning, & Feedback") [⚠️](https://github.com/intuit/auto-release/commits?author=adierkens "Tests") | [<img src="https://avatars3.githubusercontent.com/u/1192452?v=4" width="100px;"/><br /><sub><b>Andrew Lisowski</b></sub>](http://hipstersmoothie.com)<br />[💻](https://github.com/intuit/auto-release/commits?author=hipstersmoothie "Code") [📖](https://github.com/intuit/auto-release/commits?author=hipstersmoothie "Documentation") [🤔](#ideas-hipstersmoothie "Ideas, Planning, & Feedback") [🚇](#infra-hipstersmoothie "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/intuit/auto-release/commits?author=hipstersmoothie "Tests") |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
