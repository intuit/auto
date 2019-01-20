<div align="center">
  <img width="200" height="200"
    src="./auto.gif">
  <h1>auto-release</h1>
  <p>Generate releases based on semantic version labels on pull requests</p>
</div>

<div align="center"><a href="https://circleci.com/gh/intuit/auto-release"><img src="https://img.shields.io/circleci/project/github/intuit/auto-release/master.svg?style=flat-square&logo=circleci" alt="CircleCI" /></a> <a href="https://codecov.io/gh/intuit/auto-release"><img src="https://img.shields.io/codecov/c/github/intuit/auto-release.svg?style=flat-square&logo=codecov" alt="Codecov" /></a> <a href="https://www.npmjs.com/package/auto-release-cli"><img src="https://img.shields.io/npm/v/auto-release-cli.svg?style=flat-square&logo=npm" alt="npm" /></a> <a href="#contributors"><img src="https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square&logo=github" alt="All Contributors" /></a> <a href="https://www.npmjs.com/package/auto-release-cli"><img src="https://img.shields.io/npm/dt/auto-release-cli.svg?style=flat-square&logo=npm" alt="npm" /></a> <a href="https://github.com/intuit/auto-release"><img src="https://img.shields.io/badge/release-auto.svg?style=flat-square&colorA=888888&amp;colorB=9B065A&amp;label=auto&amp;logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACzElEQVR4AYXBW2iVBQAA4O+/nLlLO9NM7JSXasko2ASZMaKyhRKEDH2ohxHVWy6EiIiiLOgiZG9CtdgG0VNQoJEXRogVgZYylI1skiKVITPTTtnv3M7+v8UvnG3M+r7APLIRxStn69qzqeBBrMYyBDiL4SD0VeFmRwtrkrI5IjP0F7rjzrSjvbTqwubiLZffySrhRrSghBJa8EBYY0NyLJt8bDBOtzbEY72TldQ1kRm6otana8JK3/kzN/3V/NBPU6HsNnNlZAz/ukOalb0RBJKeQnykd7LiX5Fp/YXuQlfUuhXbg8Di5GL9jbXFq/tLa86PpxPhAPrwCYaiorS8L/uuPJh1hZFbcR8mewrx0d7JShr3F7pNW4vX0GRakKWVk7taDq7uPvFWw8YkMcPVb+vfvfRZ1i7zqFwjtmFouL72y6C/0L0Ie3GvaQXRyYVB3YZNE32/+A/D9bVLcRB3yw3hkRCdaDUtFl6Ykr20aaLvKoqIXUdbMj6GFzAmdxfWx9iIRrkDr1f27cFONGMUo/gRI/jNbIMYxJOoR1cY0OGaVPb5z9mlKbyJP/EsdmIXvsFmM7Ql42nEblX3xI1BbYbTkXCqRnxUbgzPo4T7sQBNeBG7zbAiDI8nWfZDhQWYCG4PFr+HMBQ6l5VPJybeRyJXwsdYJ/cRnlJV0yB4ZlUYtFQIkMZnst8fRrPcKezHCblz2IInMIkPzbbyb9mW42nWInc2xmE0y61AJ06oGsXL5rcOK1UdCbEXiVwNXsEy/6+EbaiVG8eeEAfxvaoSBnCH61uOD7BS1Ul8ESHBKWxCrdyd6EYNKihgEVrwOAbQruoytuBYIFfAc3gVN6iawhjKyNCEpYhVJXgbOzARyaU4hCtYizq5EI1YgiUoIlT1B7ZjByqmRWYbwtdYjoWoN7+LOIQefIqKawLzK6ID69GGpQgwhhEcwGGUzfEPAiPqsCXadFsAAAAASUVORK5CYII=" alt="Auto Release" /></a> <a href="https://app.snyk.io/org/hipstersmoothie/project/f32a03c3-9884-4fc9-9ac5-525c48799d4c"><img src="https://img.shields.io/snyk/vulnerabilities/github/intuit/auto-release/package.json.svg?style=flat-square&logo=snyk&logoColor=lightgrey" alt="" /></a> <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square&logo=producthunt" alt="code style: prettier" /></a></div>

<br />

CI/CD helpers for github releases. Generate releases based on semantic version labels on pull requests.

Release Features:

- Release every merge to master based on a PR labels
- Skip a release with the `skip-release` label
- Generate a changelog with fancy headers, authors, and monorepo package association
- Generate a GitHub release

Pull Request Interaction Features:

- Get the labels for a PR
- Set the status of a PR
- Check that a pull request has a SemVer label
- Comment on a PR with markdown

Visit [the docs](https://intuit.github.io/auto-release/) for more information.

## Start Developing

To get set up, fork and clone the project and run the following command:

```sh
brew install automake
yarn
```

### Linting

```sh
yarn lint
```

### Testing

```sh
yarn test
```

### Build/Typecheck

```sh
yarn build
```

### Run the docs

To deploy the docs you will need to add the `documentation` label to your pull request.

```sh
yarn docs:watch
```

## Contributing

Feel free to make and [issue](https://github.com/intuit/auto-release/issues) or open a [pull request](https://github.com/intuit/auto-release/pulls)!

Make sure to read our [code of conduct](./CODE_OF_CONDUCT.md).

## :rocket: Projects Using `auto-release` :rocket:

:star: [webpack-inject-plugin](https://github.com/adierkens/webpack-inject-plugin) - A webpack plugin to dynamically inject code into the bundle.

:star: [storybook-addon-notes-github-markdown-css](https://github.com/hipstersmoothie/github-markdown-css) - Make your notes addon look like github markdown.

:star: [html-webpack-insert-text-plugin](https://github.com/hipstersmoothie/html-webpack-insert-text-plugin) - Insert text into the head or body of your HTML

:star: [react-glider](https://github.com/hipstersmoothie/react-glider) - A react wrapper for glider.js

:star: [Ignite](https://github.com/intuit/Ignite) - Modern markdown documentation generator

:star: [reaction](https://github.com/artsy/reaction) - Artsy’s React Components

## :nail_care: `auto-release` Badge :nail_care:

Do you project use `auto-release`? Then use our custom badge!

[![Auto Release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto)](https://github.com/intuit/auto-release)

[![Auto Release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACzElEQVR4AYXBW2iVBQAA4O+/nLlLO9NM7JSXasko2ASZMaKyhRKEDH2ohxHVWy6EiIiiLOgiZG9CtdgG0VNQoJEXRogVgZYylI1skiKVITPTTtnv3M7+v8UvnG3M+r7APLIRxStn69qzqeBBrMYyBDiL4SD0VeFmRwtrkrI5IjP0F7rjzrSjvbTqwubiLZffySrhRrSghBJa8EBYY0NyLJt8bDBOtzbEY72TldQ1kRm6otana8JK3/kzN/3V/NBPU6HsNnNlZAz/ukOalb0RBJKeQnykd7LiX5Fp/YXuQlfUuhXbg8Di5GL9jbXFq/tLa86PpxPhAPrwCYaiorS8L/uuPJh1hZFbcR8mewrx0d7JShr3F7pNW4vX0GRakKWVk7taDq7uPvFWw8YkMcPVb+vfvfRZ1i7zqFwjtmFouL72y6C/0L0Ie3GvaQXRyYVB3YZNE32/+A/D9bVLcRB3yw3hkRCdaDUtFl6Ykr20aaLvKoqIXUdbMj6GFzAmdxfWx9iIRrkDr1f27cFONGMUo/gRI/jNbIMYxJOoR1cY0OGaVPb5z9mlKbyJP/EsdmIXvsFmM7Ql42nEblX3xI1BbYbTkXCqRnxUbgzPo4T7sQBNeBG7zbAiDI8nWfZDhQWYCG4PFr+HMBQ6l5VPJybeRyJXwsdYJ/cRnlJV0yB4ZlUYtFQIkMZnst8fRrPcKezHCblz2IInMIkPzbbyb9mW42nWInc2xmE0y61AJ06oGsXL5rcOK1UdCbEXiVwNXsEy/6+EbaiVG8eeEAfxvaoSBnCH61uOD7BS1Ul8ESHBKWxCrdyd6EYNKihgEVrwOAbQruoytuBYIFfAc3gVN6iawhjKyNCEpYhVJXgbOzARyaU4hCtYizq5EI1YgiUoIlT1B7ZjByqmRWYbwtdYjoWoN7+LOIQefIqKawLzK6ID69GGpQgwhhEcwGGUzfEPAiPqsCXadFsAAAAASUVORK5CYII=)](https://github.com/intuit/auto-release)

[![Auto Release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto&style=for-the-badge)](https://github.com/intuit/auto-release)

[![Auto Release](https://img.shields.io/badge/release-auto.svg?colorA=888888&colorB=9B065A&label=auto&style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACzElEQVR4AYXBW2iVBQAA4O+/nLlLO9NM7JSXasko2ASZMaKyhRKEDH2ohxHVWy6EiIiiLOgiZG9CtdgG0VNQoJEXRogVgZYylI1skiKVITPTTtnv3M7+v8UvnG3M+r7APLIRxStn69qzqeBBrMYyBDiL4SD0VeFmRwtrkrI5IjP0F7rjzrSjvbTqwubiLZffySrhRrSghBJa8EBYY0NyLJt8bDBOtzbEY72TldQ1kRm6otana8JK3/kzN/3V/NBPU6HsNnNlZAz/ukOalb0RBJKeQnykd7LiX5Fp/YXuQlfUuhXbg8Di5GL9jbXFq/tLa86PpxPhAPrwCYaiorS8L/uuPJh1hZFbcR8mewrx0d7JShr3F7pNW4vX0GRakKWVk7taDq7uPvFWw8YkMcPVb+vfvfRZ1i7zqFwjtmFouL72y6C/0L0Ie3GvaQXRyYVB3YZNE32/+A/D9bVLcRB3yw3hkRCdaDUtFl6Ykr20aaLvKoqIXUdbMj6GFzAmdxfWx9iIRrkDr1f27cFONGMUo/gRI/jNbIMYxJOoR1cY0OGaVPb5z9mlKbyJP/EsdmIXvsFmM7Ql42nEblX3xI1BbYbTkXCqRnxUbgzPo4T7sQBNeBG7zbAiDI8nWfZDhQWYCG4PFr+HMBQ6l5VPJybeRyJXwsdYJ/cRnlJV0yB4ZlUYtFQIkMZnst8fRrPcKezHCblz2IInMIkPzbbyb9mW42nWInc2xmE0y61AJ06oGsXL5rcOK1UdCbEXiVwNXsEy/6+EbaiVG8eeEAfxvaoSBnCH61uOD7BS1Ul8ESHBKWxCrdyd6EYNKihgEVrwOAbQruoytuBYIFfAc3gVN6iawhjKyNCEpYhVJXgbOzARyaU4hCtYizq5EI1YgiUoIlT1B7ZjByqmRWYbwtdYjoWoN7+LOIQefIqKawLzK6ID69GGpQgwhhEcwGGUzfEPAiPqsCXadFsAAAAASUVORK5CYII=)](https://github.com/intuit/auto-release)

## :art: Prior Art :art:

`auto-release` is inspired by some excellent tech that came before it.

- [github-semantic-version](https://github.com/ericclemmons/github-semantic-version) - Automated semantic version releases powered by Github Issues.
- [lerna-changelog](https://github.com/lerna/lerna-changelog) - 📖 PR-based changelog generator with monorepo support

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/13004162?v=4" width="100px;" alt="Adam Dierkens"/><br /><sub><b>Adam Dierkens</b></sub>](https://adamdierkens.com)<br />[💻](https://github.com/intuit/auto-release/commits?author=adierkens "Code") [📖](https://github.com/intuit/auto-release/commits?author=adierkens "Documentation") [🤔](#ideas-adierkens "Ideas, Planning, & Feedback") [⚠️](https://github.com/intuit/auto-release/commits?author=adierkens "Tests") | [<img src="https://avatars3.githubusercontent.com/u/1192452?v=4" width="100px;" alt="Andrew Lisowski"/><br /><sub><b>Andrew Lisowski</b></sub>](http://hipstersmoothie.com)<br />[💻](https://github.com/intuit/auto-release/commits?author=hipstersmoothie "Code") [📖](https://github.com/intuit/auto-release/commits?author=hipstersmoothie "Documentation") [🤔](#ideas-hipstersmoothie "Ideas, Planning, & Feedback") [🚇](#infra-hipstersmoothie "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/intuit/auto-release/commits?author=hipstersmoothie "Tests") | [<img src="https://avatars2.githubusercontent.com/u/3680126?v=4" width="100px;" alt="David"/><br /><sub><b>David</b></sub>](https://github.com/Aghassi)<br />[🚇](#infra-Aghassi "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars2.githubusercontent.com/u/49038?v=4" width="100px;" alt="Orta"/><br /><sub><b>Orta</b></sub>](http://orta.io)<br />[💻](https://github.com/intuit/auto-release/commits?author=orta "Code") | [<img src="https://avatars1.githubusercontent.com/u/3087225?v=4" width="100px;" alt="Justin Bennett"/><br /><sub><b>Justin Bennett</b></sub>](https://github.com/zephraph)<br />[🐛](https://github.com/intuit/auto-release/issues?q=author%3Azephraph "Bug reports") [💻](https://github.com/intuit/auto-release/commits?author=zephraph "Code") | [<img src="https://avatars2.githubusercontent.com/u/1925840?v=4" width="100px;" alt="Alec Larson"/><br /><sub><b>Alec Larson</b></sub>](https://twitter.com/alecdotbiz)<br />[💻](https://github.com/intuit/auto-release/commits?author=aleclarson "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

### Adding a Contributor

To add a contributor run `yarn contributors:add`, choose "Add new contributor or edit contribution type" and follow the prompts.
