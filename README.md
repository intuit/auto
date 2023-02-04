<div align="center">
  <img
    src="docs/public/readme-logo.png"
    alt="Auto Logo"
    width="300px"
    padding="40px"
  />
  <br />
  <br />
  <p>Generate releases based on semantic version labels on pull requests</p>
</div>

---

<div align="center"><a href="https://circleci.com/gh/intuit/auto"><img src="https://img.shields.io/circleci/project/github/intuit/auto/main.svg?style=flat-square&logo=circleci" alt="CircleCI" /></a> <a href="https://codecov.io/gh/intuit/auto"><img src="https://img.shields.io/codecov/c/github/intuit/auto.svg?style=flat-square&logo=codecov" alt="Codecov" /></a> <a href="https://www.npmjs.com/package/auto"><img src="https://img.shields.io/npm/v/auto.svg?style=flat-square&logo=npm" alt="npm" /></a> <a href="#contributors"><img src="https://img.shields.io/badge/all_contributors-30-orange.svg?style=flat-square&logo=github" alt="All Contributors" /></a> <a href="https://www.npmjs.com/package/auto"><img src="https://img.shields.io/npm/dt/auto.svg?style=flat-square&logo=npm" alt="npm" /></a> <a href="https://github.com/intuit/auto"><img src="https://img.shields.io/badge/release-auto.svg?style=flat-square&colorA=888888&amp;colorB=9B065A&amp;label=auto&amp;logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACzElEQVR4AYXBW2iVBQAA4O+/nLlLO9NM7JSXasko2ASZMaKyhRKEDH2ohxHVWy6EiIiiLOgiZG9CtdgG0VNQoJEXRogVgZYylI1skiKVITPTTtnv3M7+v8UvnG3M+r7APLIRxStn69qzqeBBrMYyBDiL4SD0VeFmRwtrkrI5IjP0F7rjzrSjvbTqwubiLZffySrhRrSghBJa8EBYY0NyLJt8bDBOtzbEY72TldQ1kRm6otana8JK3/kzN/3V/NBPU6HsNnNlZAz/ukOalb0RBJKeQnykd7LiX5Fp/YXuQlfUuhXbg8Di5GL9jbXFq/tLa86PpxPhAPrwCYaiorS8L/uuPJh1hZFbcR8mewrx0d7JShr3F7pNW4vX0GRakKWVk7taDq7uPvFWw8YkMcPVb+vfvfRZ1i7zqFwjtmFouL72y6C/0L0Ie3GvaQXRyYVB3YZNE32/+A/D9bVLcRB3yw3hkRCdaDUtFl6Ykr20aaLvKoqIXUdbMj6GFzAmdxfWx9iIRrkDr1f27cFONGMUo/gRI/jNbIMYxJOoR1cY0OGaVPb5z9mlKbyJP/EsdmIXvsFmM7Ql42nEblX3xI1BbYbTkXCqRnxUbgzPo4T7sQBNeBG7zbAiDI8nWfZDhQWYCG4PFr+HMBQ6l5VPJybeRyJXwsdYJ/cRnlJV0yB4ZlUYtFQIkMZnst8fRrPcKezHCblz2IInMIkPzbbyb9mW42nWInc2xmE0y61AJ06oGsXL5rcOK1UdCbEXiVwNXsEy/6+EbaiVG8eeEAfxvaoSBnCH61uOD7BS1Ul8ESHBKWxCrdyd6EYNKihgEVrwOAbQruoytuBYIFfAc3gVN6iawhjKyNCEpYhVJXgbOzARyaU4hCtYizq5EI1YgiUoIlT1B7ZjByqmRWYbwtdYjoWoN7+LOIQefIqKawLzK6ID69GGpQgwhhEcwGGUzfEPAiPqsCXadFsAAAAASUVORK5CYII=" alt="Auto Release" /></a> <a href="https://app.snyk.io/org/hipstersmoothie/project/f32a03c3-9884-4fc9-9ac5-525c48799d4c"><img src="https://img.shields.io/snyk/vulnerabilities/github/intuit/auto/package.json.svg?style=flat-square&logo=snyk&logoColor=lightgrey" alt="" /></a> <a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fintuit%2Fauto?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fintuit%2Fauto.svg?type=shield"/></a>
<a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square&logo=producthunt" alt="code style: prettier" /></a></div>

<br />

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

Visit [the docs](https://intuit.github.io/auto/) for more information.

## :pushpin: Plugins :pushpin:

Auto has an extensive plugin system and wide variety of official plugins. Make a PR to add yours!

**Package Managers:**

- [brew](./plugins/brew) - Automate the creation of Homebrew formulae
- [chrome](./plugins/chrome) - Publish code to Chrome Web Store
- [cocoapods](./plugins/cocoapods) - Version your [CocoaPod](https://cocoapods.org/), and push to your specs repository!
- [crates](./plugins/crates) - Publish Rust crates
- [docker](./plugins/docker) - Publish images with Docker
- [gem](./plugins/gem) - Publish ruby gems
- [git-tag](./plugins/git-tag) - Manage your projects version through just a git tag (`default` when used with binary)
- [gradle](./plugins/gradle) - Publish code with gradle
- [maven](./plugins/maven) - Publish code with maven
- [npm](./plugins/npm) - Publish code to npm (`default` when installed through `npm`)
- [sbt](./plugins/sbt) - Publish Scala projects with [sbt](https://www.scala-sbt.org)
- [vscode](./plugins/vscode) - Publish code to the VSCode extension marketplace

**Extra Functionality:**

- [all-contributors](./plugins/all-contributors) - Automatically add contributors as changelogs are produced using [all-contributors-cli](https://www.npmjs.com/package/all-contributors-cli)
- [conventional-commits](./plugins/conventional-commits) - Parse conventional commit messages for version bumps
- [exec](./plugins/exec) - Tap into hooks and run scripts on the terminal
- [first-time-contributor](./plugins/first-time-contributor) - Thank first time contributors for their work right in your release notes.
- [gh-pages](./plugins/gh-pages) - Automate publishing to your gh-pages documentation website
- [jira](./plugins/jira) - Include Jira story links in the changelog
- [magic-zero](./plugins/magic-zero) - A plugin that closely adheres to semver versioning for 0.0.x and 0.x.y releases
- [microsoft-teams](./plugins/microsoft-teams) - Post your release notes to a Microsoft teams channel
- [omit-commits](./plugins/omit-commits) - Ignore commits base on name, email, subject, labels, and username
- [omit-release-notes](./plugins/omit-release-notes) - Ignore release notes in PRs made by certain accounts
- [pr-body-labels](./plugins/pr-body-labels) - Allow outside contributors to indicate what semver label should be applied to the Pull Request
- [released](./plugins/released) - Add a `released` label to published PRs, comment with the version it's included in and comment on the issues the PR closes
- [s3](./plugins/s3) - Post your built artifacts to amazon s3
- [slack](./plugins/slack) - Post release notes to slack
- [twitter](./plugins/twitter) - Post release notes to twitter
- [upload-assets](./plugins/upload-assets) - Add extra assets to the release
- [protected-branch](./plugins/protected-branch) - Handle Github branch protections and avoid run auto with an admin token

## :hammer: Start Developing :hammer:

To get set up, fork and clone the project then run the following command:

```bash
yarn
```

### Build/Typecheck

You must build at least once before running the tests or lint.

```bash
yarn build
```

In watch mode:

```bash
yarn start
```

### Installing the binary

Install the bundled binary onto your system. This requires the project to be built or in watch mode.

```bash
yarn install-mac
```

If running this for the first time you may also have to run the following command.

```bash
chmod +x /usr/local/bin/auto
```

### Cleaning

```bash
yarn clean
```

### Linting

```bash
yarn lint
```

### Testing

```bash
yarn test
```

### Run the docs

```bash
yarn docs
```

### Create a new plugin

Get started developing a new plugin in the monorepo in seconds.

The two arguments are:

1. A spaced name
2. A description

```bash
yarn create:plugin my-plugin "Do something really cool"
```

### Create a new package

Get started developing a new package in the monorepo in seconds.

The two arguments are:

1. A spaced name
2. A description

```bash
yarn create:package my-package "Do something really cool"
```

## :beers: Contributing :beers:

Feel free to make an [issue](https://github.com/intuit/auto/issues) or open a [pull request](https://github.com/intuit/auto/pulls)!

Make sure to read our [code of conduct](./CODE_OF_CONDUCT.md).

## :rocket: Projects Using `auto` :rocket:

:star: [Storybookjs design-system](https://github.com/storybookjs/design-system) - Storybook's official design system

:star: [space-kit](https://github.com/apollographql/space-kit) - Home base for Apollo's design system

:star: [react-glider](https://github.com/hipstersmoothie/react-glider) - A react wrapper for glider.js

:star: [reaction](https://github.com/artsy/reaction) - Artsy’s React Components

:star: [emission](https://github.com/artsy/emission) - Artsy’s React Native Components

:star: [webpack-inject-plugin](https://github.com/adierkens/webpack-inject-plugin) - A webpack plugin to dynamically inject code into the bundle.

:star: [html-webpack-insert-text-plugin](https://github.com/hipstersmoothie/html-webpack-insert-text-plugin) - Insert text into the head or body of your HTML

:star: [react-easy-crop](https://github.com/ValentinH/react-easy-crop) - A React component to crop images/videos with easy interactions

## :nail_care: `auto` Badge :nail_care:

Does your project use `auto`? Then use our custom badge!

[![Auto Release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto)](https://github.com/intuit/auto)

[![Auto Release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACzElEQVR4AYXBW2iVBQAA4O+/nLlLO9NM7JSXasko2ASZMaKyhRKEDH2ohxHVWy6EiIiiLOgiZG9CtdgG0VNQoJEXRogVgZYylI1skiKVITPTTtnv3M7+v8UvnG3M+r7APLIRxStn69qzqeBBrMYyBDiL4SD0VeFmRwtrkrI5IjP0F7rjzrSjvbTqwubiLZffySrhRrSghBJa8EBYY0NyLJt8bDBOtzbEY72TldQ1kRm6otana8JK3/kzN/3V/NBPU6HsNnNlZAz/ukOalb0RBJKeQnykd7LiX5Fp/YXuQlfUuhXbg8Di5GL9jbXFq/tLa86PpxPhAPrwCYaiorS8L/uuPJh1hZFbcR8mewrx0d7JShr3F7pNW4vX0GRakKWVk7taDq7uPvFWw8YkMcPVb+vfvfRZ1i7zqFwjtmFouL72y6C/0L0Ie3GvaQXRyYVB3YZNE32/+A/D9bVLcRB3yw3hkRCdaDUtFl6Ykr20aaLvKoqIXUdbMj6GFzAmdxfWx9iIRrkDr1f27cFONGMUo/gRI/jNbIMYxJOoR1cY0OGaVPb5z9mlKbyJP/EsdmIXvsFmM7Ql42nEblX3xI1BbYbTkXCqRnxUbgzPo4T7sQBNeBG7zbAiDI8nWfZDhQWYCG4PFr+HMBQ6l5VPJybeRyJXwsdYJ/cRnlJV0yB4ZlUYtFQIkMZnst8fRrPcKezHCblz2IInMIkPzbbyb9mW42nWInc2xmE0y61AJ06oGsXL5rcOK1UdCbEXiVwNXsEy/6+EbaiVG8eeEAfxvaoSBnCH61uOD7BS1Ul8ESHBKWxCrdyd6EYNKihgEVrwOAbQruoytuBYIFfAc3gVN6iawhjKyNCEpYhVJXgbOzARyaU4hCtYizq5EI1YgiUoIlT1B7ZjByqmRWYbwtdYjoWoN7+LOIQefIqKawLzK6ID69GGpQgwhhEcwGGUzfEPAiPqsCXadFsAAAAASUVORK5CYII=)](https://github.com/intuit/auto)

[![Auto Release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto&style=for-the-badge)](https://github.com/intuit/auto)

[![Auto Release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto&style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACzElEQVR4AYXBW2iVBQAA4O+/nLlLO9NM7JSXasko2ASZMaKyhRKEDH2ohxHVWy6EiIiiLOgiZG9CtdgG0VNQoJEXRogVgZYylI1skiKVITPTTtnv3M7+v8UvnG3M+r7APLIRxStn69qzqeBBrMYyBDiL4SD0VeFmRwtrkrI5IjP0F7rjzrSjvbTqwubiLZffySrhRrSghBJa8EBYY0NyLJt8bDBOtzbEY72TldQ1kRm6otana8JK3/kzN/3V/NBPU6HsNnNlZAz/ukOalb0RBJKeQnykd7LiX5Fp/YXuQlfUuhXbg8Di5GL9jbXFq/tLa86PpxPhAPrwCYaiorS8L/uuPJh1hZFbcR8mewrx0d7JShr3F7pNW4vX0GRakKWVk7taDq7uPvFWw8YkMcPVb+vfvfRZ1i7zqFwjtmFouL72y6C/0L0Ie3GvaQXRyYVB3YZNE32/+A/D9bVLcRB3yw3hkRCdaDUtFl6Ykr20aaLvKoqIXUdbMj6GFzAmdxfWx9iIRrkDr1f27cFONGMUo/gRI/jNbIMYxJOoR1cY0OGaVPb5z9mlKbyJP/EsdmIXvsFmM7Ql42nEblX3xI1BbYbTkXCqRnxUbgzPo4T7sQBNeBG7zbAiDI8nWfZDhQWYCG4PFr+HMBQ6l5VPJybeRyJXwsdYJ/cRnlJV0yB4ZlUYtFQIkMZnst8fRrPcKezHCblz2IInMIkPzbbyb9mW42nWInc2xmE0y61AJ06oGsXL5rcOK1UdCbEXiVwNXsEy/6+EbaiVG8eeEAfxvaoSBnCH61uOD7BS1Ul8ESHBKWxCrdyd6EYNKihgEVrwOAbQruoytuBYIFfAc3gVN6iawhjKyNCEpYhVJXgbOzARyaU4hCtYizq5EI1YgiUoIlT1B7ZjByqmRWYbwtdYjoWoN7+LOIQefIqKawLzK6ID69GGpQgwhhEcwGGUzfEPAiPqsCXadFsAAAAASUVORK5CYII=)](https://github.com/intuit/auto)

## :art: Prior Art :art:

`auto` is inspired by some excellent tech that came before it.

- [github-semantic-version](https://github.com/ericclemmons/github-semantic-version) - Automated semantic version releases powered by Github Issues.
- [lerna-changelog](https://github.com/lerna/lerna-changelog) - 📖 PR-based changelog generator with monorepo support

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://adamdierkens.com"><img src="https://avatars1.githubusercontent.com/u/13004162?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adam Dierkens</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=adierkens" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=adierkens" title="Documentation">📖</a> <a href="#ideas-adierkens" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/intuit/auto/commits?author=adierkens" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://hipstersmoothie.com"><img src="https://avatars3.githubusercontent.com/u/1192452?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Lisowski</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=hipstersmoothie" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=hipstersmoothie" title="Documentation">📖</a> <a href="#ideas-hipstersmoothie" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-hipstersmoothie" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/intuit/auto/commits?author=hipstersmoothie" title="Tests">⚠️</a> <a href="#blog-hipstersmoothie" title="Blogposts">📝</a></td>
    <td align="center"><a href="https://github.com/Aghassi"><img src="https://avatars2.githubusercontent.com/u/3680126?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David</b></sub></a><br /><a href="#infra-Aghassi" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/intuit/auto/commits?author=Aghassi" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=Aghassi" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=Aghassi" title="Documentation">📖</a></td>
    <td align="center"><a href="http://orta.io"><img src="https://avatars2.githubusercontent.com/u/49038?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Orta</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=orta" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=orta" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/zephraph"><img src="https://avatars1.githubusercontent.com/u/3087225?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Justin Bennett</b></sub></a><br /><a href="https://github.com/intuit/auto/issues?q=author%3Azephraph" title="Bug reports">🐛</a> <a href="https://github.com/intuit/auto/commits?author=zephraph" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=zephraph" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=zephraph" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://twitter.com/alecdotbiz"><img src="https://avatars2.githubusercontent.com/u/1925840?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alec Larson</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=aleclarson" title="Code">💻</a></td>
    <td align="center"><a href="http://tylerkrupicka.com"><img src="https://avatars1.githubusercontent.com/u/5761061?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tyler Krupicka</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=tylerkrupicka" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/hello-woof"><img src="https://avatars2.githubusercontent.com/u/48960849?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Zachary Sherwin</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=hello-woof" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=hello-woof" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=hello-woof" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/bnigh"><img src="https://avatars3.githubusercontent.com/u/8219313?v=4?s=100" width="100px;" alt=""/><br /><sub><b>bnigh</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=bnigh" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=bnigh" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=bnigh" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/su7edja"><img src="https://avatars0.githubusercontent.com/u/2717065?v=4?s=100" width="100px;" alt=""/><br /><sub><b>su7edja</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=su7edja" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ykhandelwal913"><img src="https://avatars3.githubusercontent.com/u/16071601?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yogesh Khandelwal</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=ykhandelwal913" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=ykhandelwal913" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Celeo"><img src="https://avatars1.githubusercontent.com/u/772507?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matt Boulanger</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=Celeo" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/karenclo"><img src="https://avatars1.githubusercontent.com/u/8535239?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Karen Lo</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=karenclo" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/jrnail23"><img src="https://avatars1.githubusercontent.com/u/392612?v=4?s=100" width="100px;" alt=""/><br /><sub><b>James Nail</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=jrnail23" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=jrnail23" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/rdipika"><img src="https://avatars3.githubusercontent.com/u/12812259?v=4?s=100" width="100px;" alt=""/><br /><sub><b>rdipika94</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=rdipika" title="Documentation">📖</a></td>
    <td align="center"><a href="http://brianmuenzenmeyer.com"><img src="https://avatars1.githubusercontent.com/u/298435?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brian Muenzenmeyer</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=bmuenzenmeyer" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=bmuenzenmeyer" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sarah-vanderlaan"><img src="https://avatars0.githubusercontent.com/u/32620284?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sarah van der Laan</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=sarah-vanderlaan" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/reckter"><img src="https://avatars1.githubusercontent.com/u/1771450?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hannes Güdelhöfer</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=reckter" title="Code">💻</a></td>
    <td align="center"><a href="https://ericclemmons.com/"><img src="https://avatars0.githubusercontent.com/u/15182?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Eric Clemmons</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=ericclemmons" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=ericclemmons" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=ericclemmons" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://www.jeremiahzucker.com"><img src="https://avatars1.githubusercontent.com/u/9255651?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jeremiah Zucker</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=sugarmanz" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=sugarmanz" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=sugarmanz" title="Code">💻</a></td>
    <td align="center"><a href="https://www.unconfinedsoftware.com/"><img src="https://avatars2.githubusercontent.com/u/13172697?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brandon Miller</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=unknownerror404" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=unknownerror404" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=unknownerror404" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/hborawski"><img src="https://avatars1.githubusercontent.com/u/1325154?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Harris Borawski</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=hborawski" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=hborawski" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=hborawski" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ShelbyCohen"><img src="https://avatars1.githubusercontent.com/u/7768053?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Shelby Cohen</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=ShelbyCohen" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=ShelbyCohen" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=ShelbyCohen" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/krohrsb"><img src="https://avatars1.githubusercontent.com/u/321544?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kyle Brown</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=krohrsb" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=krohrsb" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/whynotzoidberg"><img src="https://avatars0.githubusercontent.com/u/18683899?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Till Weisser</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=whynotzoidberg" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=whynotzoidberg" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=whynotzoidberg" title="Code">💻</a></td>
    <td align="center"><a href="http://www.terradatum.com"><img src="https://avatars0.githubusercontent.com/u/94763?v=4?s=100" width="100px;" alt=""/><br /><sub><b>G. Richard Bellamy</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=rbellamy" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=rbellamy" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=rbellamy" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://kevinwolf.dev"><img src="https://avatars2.githubusercontent.com/u/3157426?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kevin Wolf</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=kevinwolfdev" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=kevinwolfdev" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=kevinwolfdev" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/10hendersonm"><img src="https://avatars2.githubusercontent.com/u/14095644?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marty Henderson</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=10hendersonm" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=10hendersonm" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=10hendersonm" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/spentacular"><img src="https://avatars2.githubusercontent.com/u/1043478?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Spencer Hamm</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=spentacular" title="Code">💻</a></td>
    <td align="center"><a href="https://lshadler.github.io/"><img src="https://avatars1.githubusercontent.com/u/23409677?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lucas Shadler</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=lshadler" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=lshadler" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/stabbylambda"><img src="https://avatars3.githubusercontent.com/u/124668?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Stone</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=stabbylambda" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=stabbylambda" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=stabbylambda" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lucascurti"><img src="https://avatars3.githubusercontent.com/u/2811287?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lucas Curti</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=lucascurti" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/rachanamamillapalli"><img src="https://avatars1.githubusercontent.com/u/9112473?v=4?s=100" width="100px;" alt=""/><br /><sub><b>rachana</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=rachanamamillapalli" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=rachanamamillapalli" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=rachanamamillapalli" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/RichiCoder1"><img src="https://avatars2.githubusercontent.com/u/2391878?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Richard Simpson</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=RichiCoder1" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=RichiCoder1" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=RichiCoder1" title="Code">💻</a></td>
    <td align="center"><a href="https://artmsilva.com/"><img src="https://avatars2.githubusercontent.com/u/347490?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Arturo Silva</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=artmsilva" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://christyjacob4.github.io/"><img src="https://avatars1.githubusercontent.com/u/20852629?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Christy Jacob</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=christyjacob4" title="Documentation">📖</a></td>
    <td align="center"><a href="https://help.github.com/articles/why-are-my-commits-linked-to-the-wrong-user"><img src="https://avatars0.githubusercontent.com/u/148100?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Check your git settings!</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=invalid-email-address" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/kendallgassner"><img src="https://avatars3.githubusercontent.com/u/15275462?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kendall Gassner</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=kendallgassner" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=kendallgassner" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=kendallgassner" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dcortright"><img src="https://avatars1.githubusercontent.com/u/14990112?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Drew Cortright</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=dcortright" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=dcortright" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=dcortright" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/philippeboyd"><img src="https://avatars0.githubusercontent.com/u/3239656?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Philippe Boyd</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=philippeboyd" title="Documentation">📖</a></td>
    <td align="center"><a href="https://changelogg.io/"><img src="https://avatars0.githubusercontent.com/u/8403230?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mukul Chaware</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=mukul13" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=mukul13" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=mukul13" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tinytim84"><img src="https://avatars2.githubusercontent.com/u/6330189?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tim Ottewell</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=tinytim84" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=tinytim84" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=tinytim84" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://andrewleedham.me/"><img src="https://avatars2.githubusercontent.com/u/5557458?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Leedham</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=AndrewLeedham" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=AndrewLeedham" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=AndrewLeedham" title="Code">💻</a></td>
    <td align="center"><a href="http://sethomas.com/"><img src="https://avatars2.githubusercontent.com/u/3957314?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Seth Thomas</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=sethomas" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=sethomas" title="Code">💻</a></td>
    <td align="center"><a href="https://www.knapsack.cloud/"><img src="https://avatars.githubusercontent.com/u/569699?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Evan Lovely</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=EvanLovely" title="Documentation">📖</a></td>
    <td align="center"><a href="https://dorianmarie.fr/"><img src="https://avatars.githubusercontent.com/u/58794487?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dorian Marié</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=dorianmariefr" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/myndelx"><img src="https://avatars.githubusercontent.com/u/13200484?v=4?s=100" width="100px;" alt=""/><br /><sub><b>myndelx</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=myndelx" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sentony93"><img src="https://avatars.githubusercontent.com/u/13474011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>sentony93</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=sentony93" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=sentony93" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=sentony93" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kharrop"><img src="https://avatars.githubusercontent.com/u/24794756?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kelly Harrop</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=kharrop" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=kharrop" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/angeliski"><img src="https://avatars.githubusercontent.com/u/1574240?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rogerio Angeliski</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=angeliski" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=angeliski" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=angeliski" title="Code">💻</a></td>
    <td align="center"><a href="https://haspar.us/"><img src="https://avatars.githubusercontent.com/u/15332326?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Piotr Monwid-Olechnowicz</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=hasparus" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=hasparus" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/jwodder"><img src="https://avatars.githubusercontent.com/u/98207?v=4?s=100" width="100px;" alt=""/><br /><sub><b>John T. Wodder II</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=jwodder" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/laughedelic"><img src="https://avatars.githubusercontent.com/u/766656?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alexey Alekhin</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=laughedelic" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=laughedelic" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=laughedelic" title="Tests">⚠️</a> <a href="#infra-laughedelic" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://www.vincentbriglia.com/"><img src="https://avatars.githubusercontent.com/u/452811?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vincent Briglia</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=vincentbriglia" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=vincentbriglia" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=vincentbriglia" title="Code">💻</a></td>
    <td align="center"><a href="https://serendipidata.com/"><img src="https://avatars.githubusercontent.com/u/9020979?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cameron Yick</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=hydrosquall" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=hydrosquall" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=hydrosquall" title="Documentation">📖</a> <a href="#infra-hydrosquall" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://kelyvin.com/"><img src="https://avatars.githubusercontent.com/u/1530102?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kelvin Nguyen</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=kelyvin" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://lshadler.github.io/"><img src="https://avatars.githubusercontent.com/u/23409677?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lucas Shadler</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=sumwatshade" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=sumwatshade" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=sumwatshade" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mathieubergeron"><img src="https://avatars.githubusercontent.com/u/5585923?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mathieu Bergeron</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=mathieubergeron" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=mathieubergeron" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=mathieubergeron" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/AndreasWeichselbaum"><img src="https://avatars.githubusercontent.com/u/65903773?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andreas Weichselbaum</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=AndreasWeichselbaum" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=AndreasWeichselbaum" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=AndreasWeichselbaum" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/torkjel"><img src="https://avatars.githubusercontent.com/u/102654?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Torkjel Hongve</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=torkjel" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=torkjel" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=torkjel" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/daltonscharff"><img src="https://avatars.githubusercontent.com/u/14829777?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dalton Scharff</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=daltonscharff" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=daltonscharff" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=daltonscharff" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ardeois"><img src="https://avatars.githubusercontent.com/u/1867939?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Corentin Ardeois</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=ardeois" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jBouyoud"><img src="https://avatars.githubusercontent.com/u/1336548?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Julien Bouyoud</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=jBouyoud" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=jBouyoud" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=jBouyoud" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://valentin-hervieu.fr/"><img src="https://avatars.githubusercontent.com/u/2678610?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Valentin Hervieu</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=ValentinH" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=ValentinH" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=ValentinH" title="Code">💻</a></td>
    <td align="center"><a href="https://bandism.net/"><img src="https://avatars.githubusercontent.com/u/22633385?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ikko Ashimine</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=eltociear" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=eltociear" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=eltociear" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sonic-knuckles"><img src="https://avatars.githubusercontent.com/u/102497932?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Josh Biddick</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=sonic-knuckles" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=sonic-knuckles" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/karpoff"><img src="https://avatars.githubusercontent.com/u/6905209?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anton Karpov</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=karpoff" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=karpoff" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ejhayes"><img src="https://avatars.githubusercontent.com/u/310233?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Eric Hayes</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=ejhayes" title="Documentation">📖</a> <a href="https://github.com/intuit/auto/commits?author=ejhayes" title="Tests">⚠️</a> <a href="https://github.com/intuit/auto/commits?author=ejhayes" title="Code">💻</a></td>
    <td align="center"><a href="https://www.domoritz.de/"><img src="https://avatars.githubusercontent.com/u/589034?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dominik Moritz</b></sub></a><br /><a href="https://github.com/intuit/auto/commits?author=domoritz" title="Code">💻</a> <a href="https://github.com/intuit/auto/commits?author=domoritz" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

### Adding a Contributor

To add a contributor run `yarn contributors:add`, choose "Add new contributor or edit contribution type" and follow the prompts.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fintuit%2Fauto.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fintuit%2Fauto?ref=badge_large)
