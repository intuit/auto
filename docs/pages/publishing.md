# Publishing

`auto`'s main use it to automate the release process for your project. This can be broken down into three core steps:

```text
pre: (optional) Check if new version

1. Generate CHANGELOG.md
2. Publish code
3. Generate github release notes
```

`auto` makes no assumptions about your publishing process. Each tool is a function that can be run in isolation and only does one thing really well. For instance, you could just use `auto changelog` to generate the changelog and nothing else or use `auto version` to calculate just the semver bump.

## Base Branch

By default `auto` assumes that your repo's base branch is `master`. You can configure this behavior through the [.autorc](./autorc.md#base-branch) or via a CLI to any relevant command.

```sh
auto shipit --base-branch trunk
```

## Push to base branch

If you push commits to the base branch they will count as patches. This is a good way to get a release out without having to make a PR.

The changelog entry will contain the first line of the commit message. These commits will fall under a special section in the changelog.

ex:

```md
⚠️ Pushed to master

- fix docs publishing ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))
```

You can configure the title of this changelog entry by adding the `pushToBaseBranch` label in your config.

```json
{
  "labels": [
    {
      "name": "pushToBaseBranch",
      "changelogTitle": "Emergency!!"
    }
  ]
}
```
