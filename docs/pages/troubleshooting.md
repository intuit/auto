# Troubleshooting

## Error: Can't find a GitHub token to use

You must set a [`GH_TOKEN`](https://github.com/settings/tokens) for `auto` to work. If you publish to npm make sure to add your `NPM_TOKEN` while you're at it as well.

## npm ERR! Git working directory not clean

To version and publish you cannot have any changes in the git repo during publish. This means that if you build some files before release that aren't git-ignored `auto` will fail to continue. To fix this either add those `dist` files to your `.gitignore` or commit them somehow before the release.

## npm ERR! need auth auth required for publishing

This error will occur when you do not have a `NPM_TOKEN` set.

### Still getting errors?!

Make sure that `npm` is trying to publish to the correct registry. Force `npm`/`lerna` to use the public registry by adding the following to your package.json:

```json
{
  "publishConfig": {
    "registry": "https://registry.npmjs.org/",
    "access": "public"
  }
}
```

## Hangs on: Are you sure you want to continue connecting (yes/no)?

This mean your environment does not trust github. To change this add this command somewhere before `auto`

public:

```sh
mkdir ~/.ssh/ && echo -e "Host github.com\n\tStrictHostKeyChecking no\n" > ~/.ssh/config
```

enterprise:

```sh
mkdir ~/.ssh/ && echo -e "Host github.YOUR_COMPANY.com\n\tStrictHostKeyChecking no\n" > ~/.ssh/config
```

## You cannot publish over the previously published versions

If you've encountered any of these errors you'll probably run into this problem. If the whole release process doesn't complete you can end up in a state when `auto` published the new version, but doesn't push that back to github. To fix this just bump the version number to the "previously published version".

## Cannot read owner and package name from GitHub URL in package.json

This means that you do not have a repository set in your package.json. Add something along the line of:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/intuit/auto"
  },
  // or simply
  "repository": "intuit/auto"
}
```

## How do I auto a fork of another repo?

If auto doesn't find a last release it will default to the first commit for version calculation (and a log of other things). If you have forked a repo, you fork all the merge commit messages as well. This confuses `auto` since it will look for those pull requests in your fork and not the main one.

To remedy this first tag your first commit in the fork with your first version. If the tags from the original repo are still in your repo you should just bump that version. This will let `auto` ignore all the old merge commits.

::: message is-warning
:warning: You must also match this new tag version in your package.json
:::

```sh
# Set head to last release and tag it with 2.10.1
git tag v2.10.1
```

Then on GitHub go to your project, click release, then draft a new release. Select the tag you just published and `publish release`. Now auto will be able to use the correct version and git log!
