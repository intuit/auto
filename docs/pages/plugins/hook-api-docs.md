# Hook APIs

Plugins work by "hooking" into various parts of `auto` to control or add to its behavior.

Here are the categories of hooks available to plugins:

- [Init](./init-hooks.md) - Add functionality to `auto init`
- [Configuration](./configuration-hooks.md) - Detect, modify and validate `auto`'s configuration
- [Log Parser](./log-parse-hooks.md) - Extend how `auto` analyzes commits
- [Changelog](./changelog-hooks.md) - Change how `auto` renders changelogs
- [Release Lifecycle](./release-lifecycle-hooks.md) - Called during various release commands, these facilitate publishing the package

## Plugin Ideas

Having a plug-able release process means you can automate so many things.
Here are a few ideas of what you could do.

- `size-changelog`: Every time a `latest` release is made update a `size-changelog.md` with the bundle size
- Use the `afterRelease` hook to communicate changes to consumers (ex: twitter or slack)

The documentation for each hook also lists examples of how the hook is used.

## Fitting It All Together

The hooks that are called depends on the command is run.
Some hooks are specific to a single command, such as the "Init" hooks, and others are called for every command.

An example run of `auto latest` where a new version is published:

1. All configuration hooks called
2. Get `git log` => Pass through `LogParse` hooks
3. If `skip-release` detected, stop
4. Create a changelog and in the process call all changelog hooks
5. [beforeCommitChangelog](./release-lifecycle-hooks.md#beforecommitchangelog)
6. [afterAddToChangelog](./release-lifecycle-hooks.md#afterAddToChangelog)
7. [version](./release-lifecycle-hooks.md##version)
8. [afterVersion](./release-lifecycle-hooks.md##afterversion)
9. [publish](./release-lifecycle-hooks.md##publish)
10. [afterPublish](./release-lifecycle-hooks.md##afterpublish)
11. [makeRelease](./release-lifecycle-hooks.md##makerelease)
12. [afterRelease](./release-lifecycle-hooks.md##afterrelease)
