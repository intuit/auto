# Frequently Asked Question

## Cannot read owner and package name from Github URL in package.json?

This means that you do not have a repository set in your package.json. Add something along the line of:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/intuit/auto-release"
  },
  // or simply
  "repository": "intuit/auto-release"
}
```

## How do I auto-release a fork of another repo?

If auto-release doesn't find a last release it will default to the first commit for version calculation (and a log of other things). If you have forked a repo, you fork all the merge commit messages as well. This confuses `auto-release` since it will look for those pull requests in your fork and not the main one.

To remedy this first tag your first commit in the fork with your first version. If the tags from the original repo are still in your repo you should just bump that version. This will let `auto-release` ignore all the old merge commits.

```sh
# Set head to last release and tag it with 2.10.1
git tag v2.10.1
```

Then on GitHub go to your project, click release, then draft a new release. Select the tag you just published and `publish release`. Now auto-release will be able to use the correct version and git log!
