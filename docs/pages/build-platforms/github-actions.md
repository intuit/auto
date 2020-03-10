# GitHub Actions

The following config declares the `release` action that run on all branches. The job will either release:

- a new `latest` version from `master`
- a `canary` build from a pull request (only on the main fork and if your package manager plugin implements them)

**`.github/workflows/release.yml`**

::: message is-warning
You must use some sort of action that implements `skip ci` functionality (as seen below). Otherwise you will get stuck in a release loop!
:::

```yaml
name: Release

on: [push]

jobs:
  release:
    runs-on: ubuntu-latest
    if: "!contains(github.event.head_commit.message, 'ci skip') && !contains(github.event.head_commit.message, 'skip ci')"
    steps:
      - uses: actions/checkout@v2

      - name: Prepare repository
        run: git fetch --unshallow --tags

      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: 12.x

      - name: Cache node modules
        uses: actions/cache@v1
        with:
          path: node_modules
          key: yarn-deps-${{ hashFiles('yarn.lock') }}
          restore-keys: |
            yarn-deps-${{ hashFiles('yarn.lock') }}

      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          yarn install --frozen-lockfile
          yarn build
          npx auto shipit
```

## Troubleshooting

If you are having problems make sure you have done the following:

- Any required secrets for plugins are set (e.g. `NPM_TOKEN` with the NPM plugin)
- Update references of `<your-github-user>`, `<project-owner>`, and `<project-repo>` with the appropriate values

### Running With Branch Protection

GitHub actions require a little more setup to use `auto` with branch protection.

```yml
steps:
  - uses: actions/checkout@v2

  - name: Prepare repository
    # Fetch full git history and tags
    run: git fetch --unshallow --tags

  - name: Unset header
    # checkout@v2 adds a header that makes branch protection report errors
    # because the Github action bot is not a collaborator on the repo
    run: git config --local --unset http.https://github.com/.extraheader
```

## Examples

- [`auto-config-hipstersmoothie`](https://github.com/hipstersmoothie/auto-config-hipstersmoothie/blob/07d128afd96ac6a7b0fe3f04313847c0fc3d84a2/.github/workflows/push.yml)
- [`create-check`](https://github.com/hipstersmoothie/create-check/blob/master/.github/workflows/push.yml)
- [`octokit-cli`](https://github.com/hipstersmoothie/octokit-cli/blob/master/.github/workflows/push.yml)
