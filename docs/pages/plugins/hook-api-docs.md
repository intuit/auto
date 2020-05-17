# Hook APIs

Plugins work by "hooking" into various parts of `auto` to control or add to its behavior.

The categories of hooks available to plugins are:

- [Init](./init-hooks.md) - Add functionality to `auto init`
- [Configuration](./configuration-hooks.md) - Detect, modify and validate `auto`'s configuration
- [Log Parser](./log-parse-hooks.md) - Extend how `auto` analyzes commits
- [Changelog](./changelog-hooks.md) - Change how `auto` renders changelogs
- [Release Lifecycle](./release-lifecycle-hooks.md) - Called during various release commands, these facilitate publishing the package

The hooks that are called depends on the command is run.
Some hooks are specific to a single command, such as the "Init" hooks, and others are called for every command.

This is the general flow when any `auto` command is ran:

- Call configuration hooks
- Run `before` release lifecycle hooks
- Get `git log` => Pass through `LogParse` hooks
- If necessary: Create a changelog and => Call `Changelog` hooks
- Run necessary remaining release lifecycle hooks

## Plugin Ideas

Having a plug-able release process means you can automate so many things.
Here are a few ideas of what you could do.

- `size-changelog`: Every time a `latest` release is made update a `size-changelog.md` with the bundle size
- Use the `afterRelease` hook to communicate changes to consumers (ex: twitter or slack)

The documentation for each hook also lists examples of how the hook is used.

## Example Run: `auto latest`

The following details the hooks called in a run of `auto latest` where a new version is published.

1. All configuration hooks called
2. Get `git log` => Pass through `LogParse` hooks
3. Create a changelog and in the process call all changelog hooks
4. [beforeCommitChangelog](./release-lifecycle-hooks.md#beforecommitchangelog)
5. [afterAddToChangelog](./release-lifecycle-hooks.md#afterAddToChangelog)
6. [version](./release-lifecycle-hooks.md##version)
7. [afterVersion](./release-lifecycle-hooks.md##afterversion)
8. [publish](./release-lifecycle-hooks.md##publish)
9. [afterPublish](./release-lifecycle-hooks.md##afterpublish)
10. [makeRelease](./release-lifecycle-hooks.md##makerelease)
11. [afterRelease](./release-lifecycle-hooks.md##afterrelease)
