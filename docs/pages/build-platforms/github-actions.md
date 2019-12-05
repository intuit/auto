# GitHub Actions

The following config declares the `release` action that run on all branches. The job will either release:

- a new `latest` version from `master`
- a `canary` build from a pull request (only on the main fork and if your package manager plugin implements them)

**`.github/workflows/release.yml`**

::: message is-warning
You must use some sort of action that implements `skip ci` functionality. Otherwise you will get stuck in a release loop!
:::

```yaml
name: Release

on: [push]

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1
      - name: Skip CI
        uses: veggiemonk/skip-commit@master
        env:
          COMMIT_FILTER: skip ci
      - name: Prepare repository
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git checkout "${GITHUB_REF:11}" --
          git remote rm origin
          git remote add origin "https://$GH_TOKEN@github.com/hipstersmoothie/my-test-project"
          git fetch origin
          git branch --set-upstream-to origin/master
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
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          yarn
          yarn build 
          npx auto shipit
```

## Troubleshooting

If you are having problems make sure you have done the following:

- Any required secrets for plugins are set (Ex; `NPM_TOKEN` with the NPM plugin)

To add a secret for actions go to https://github.com/<owner>/<repo>/settings/secrets/new

## Examples

- [`create-check`](https://github.com/hipstersmoothie/create-check/blob/master/.github/workflows/push.yml)
- [`octokit-cli`](https://github.com/hipstersmoothie/octokit-cli/blob/master/.github/workflows/push.yml)
