# v10.12.2 (Thu Jan 21 2021)

#### 🐛 Bug Fix

- handle case where auto isn't used in a git repo [#1739](https://github.com/intuit/auto/pull/1739) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- handle case where auto isn't used in a git repo ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.12.1 (Thu Jan 21 2021)

#### 🐛 Bug Fix

- respect `skip` and `none` releases for prereleases [#1738](https://github.com/intuit/auto/pull/1738) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- respect `skip` and `none` releases for prereleases ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.12.0 (Thu Jan 21 2021)

### Release Notes

#### Support "main" as a default "baseBranch" ([#1736](https://github.com/intuit/auto/pull/1736))

Many communities, both on GitHub and in the wider Git community, are considering renaming the default branch name of their repository from `master` to `main`.

This pull request add default support for a `main` branch instead of `master`. If `main` is detected then that will be used as the `baseBranch` without the need for any configuration.

## Why

The community is shifting.

Todo:

- [x] Add tests
- [ ] Add docs

## Change Type

Indicate the type of change your pull request is:

- [ ] `documentation`
- [ ] `patch`
- [x] `minor`
- [ ] `major`

---

#### 🚀 Enhancement

- Support "main" as a default "baseBranch" [#1736](https://github.com/intuit/auto/pull/1736) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- use `main` branch if it exists ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.10.1 (Tue Jan 19 2021)

#### 🐛 Bug Fix

- properly kill spawned node child processes [#1732](https://github.com/intuit/auto/pull/1732) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- properly kill spawned node child processes ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.9.1 (Thu Jan 14 2021)

#### 🐛 Bug Fix

- take into account labels on next+canary PRs [#1722](https://github.com/intuit/auto/pull/1722) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- if canary PR detected get it's labels ([@hipstersmoothie](https://github.com/hipstersmoothie))
- take into account labels on next branch PRs ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.9.0 (Thu Jan 14 2021)

#### 🚀 Enhancement

- default `name` and `email` to the token user if no author config is found in autorc or plugin [#1720](https://github.com/intuit/auto/pull/1720) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- default `name` and `email` to the token user if no author config is found in autorc or plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.7.0 (Thu Jan 14 2021)

#### 🚀 Enhancement

- Attempt to resolve relative plugin paths from extended config location [#1717](https://github.com/intuit/auto/pull/1717) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- Attempt to resolve relative plugin paths from extended config location ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.6.2 (Wed Jan 13 2021)

#### 🐛 Bug Fix

- add missing configurable option validation [#1716](https://github.com/intuit/auto/pull/1716) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add test to verify config options ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add missing configurable option validation ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.6.0 (Mon Jan 11 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Andrew Leedham ([@AndrewLeedham](https://github.com/AndrewLeedham)), for all your work!

#### 🚀 Enhancement

- feat: tag canaries for cocoapods plugin [#1702](https://github.com/intuit/auto/pull/1702) ([@hborawski](https://github.com/hborawski))

#### 🐛 Bug Fix

- fix npm plugin git tag splitting [#1705](https://github.com/intuit/auto/pull/1705) ([@AndrewLeedham](https://github.com/AndrewLeedham))
- fix: get remote repo from octokit for the current PR ([@hborawski](https://github.com/hborawski))

#### Authors: 2

- Andrew Leedham ([@AndrewLeedham](https://github.com/AndrewLeedham))
- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v10.5.1 (Fri Jan 08 2021)

#### 🐛 Bug Fix

- default to patch for 0 non-auto labels on head PR [#1703](https://github.com/intuit/auto/pull/1703) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- default to patch for 0 non-auto labels on head PR ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @atomist/slack-messages from 1.2.0 to 1.2.1 [#1676](https://github.com/intuit/auto/pull/1676) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump eslint-plugin-prettier from 3.1.4 to 3.3.0 [#1691](https://github.com/intuit/auto/pull/1691) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/fontawesome-svg-core from 1.2.30 to 1.2.32 [#1685](https://github.com/intuit/auto/pull/1685) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 7.12.1 to 7.16.0 [#1697](https://github.com/intuit/auto/pull/1697) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump node-notifier from 8.0.0 to 8.0.1 [#1695](https://github.com/intuit/auto/pull/1695) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump ini from 1.3.5 to 1.3.8 [#1689](https://github.com/intuit/auto/pull/1689) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.5.2 to 10.5.3 [#1686](https://github.com/intuit/auto/pull/1686) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump array.prototype.flatmap from 1.2.3 to 1.2.4 [#1681](https://github.com/intuit/auto/pull/1681) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 24.1.0 to 24.1.3 [#1680](https://github.com/intuit/auto/pull/1680) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.4.2 (Mon Nov 23 2020)

#### 🐛 Bug Fix

- Improve release notes section rendering in npm monorepos [#1664](https://github.com/intuit/auto/pull/1664) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Improve release notes section rendering in npm monorepos ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- fix url pr-check uses for auto's CI [#1663](https://github.com/intuit/auto/pull/1663) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.4.1 (Mon Nov 23 2020)

#### 🐛 Bug Fix

- Improve readability of release notes [#1662](https://github.com/intuit/auto/pull/1662) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Improve readability of releasee notes ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.4.0 (Wed Nov 18 2020)

#### 🚀 Enhancement

- add dry-run info to afterShipIt hook [#1650](https://github.com/intuit/auto/pull/1650) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add dry-run info to afterShipIt hook ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump type-fest from 0.16.0 to 0.18.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump conventional-commits-parser from 3.1.0 to 3.2.0 [#1639](https://github.com/intuit/auto/pull/1639) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 30.7.6 to 30.7.7 [#1647](https://github.com/intuit/auto/pull/1647) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.14.0 to 6.15.0 [#1646](https://github.com/intuit/auto/pull/1646) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-retry from 3.0.3 to 3.0.4 [#1645](https://github.com/intuit/auto/pull/1645) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-enterprise-compatibility from 1.2.5 to 1.2.6 [#1644](https://github.com/intuit/auto/pull/1644) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-throttling from 3.3.0 to 3.3.1 [#1642](https://github.com/intuit/auto/pull/1642) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump type-fest from 0.16.0 to 0.18.0 [#1641](https://github.com/intuit/auto/pull/1641) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.5 (Fri Nov 06 2020)

### Release Notes

_From #1636_

Previously when using `auto pr-check` you would have to check that you were running the command from a PR with bash scripting so it didn't fail when running on master.

This PR simplifies this workflow so that you can run `auto pr-check` without any logic. On CI + base branch `pr-check` will exit successfully, otherwise it will check for a PR number and fail accordingly.

## Why

Less config + more automation = happy `auto` consumers

Todo:

- [ ] Add tests
- [ ] Add docs

## Change Type

Indicate the type of change your pull request is:

- [ ] `documentation`
- [x] `patch`
- [ ] `minor`
- [ ] `major`

---

#### 🐛 Bug Fix

- improve pr-check usage + don't fail on runs in CI base branch [#1636](https://github.com/intuit/auto/pull/1636) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- also exit successfully in a prerelease branch ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- improve pr-check usage + don't fail on runs in CI master branch ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.4 (Fri Nov 06 2020)

#### 🐛 Bug Fix

- Truncate commit hash for shorter canary versions [#1635](https://github.com/intuit/auto/pull/1635) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- truncate has for shorter cnary versions ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.3 (Wed Nov 04 2020)

#### 🐛 Bug Fix

- add timeout when verifying auth to remote [#1632](https://github.com/intuit/auto/pull/1632) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add timeout when verifying auth to remote ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.1.0 (Mon Nov 02 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Tim Ottewell ([@tinytim84](https://github.com/tinytim84)), for all your work!

#### 🚀 Enhancement

- feat: add ssh support for connecting to github [#1590](https://github.com/intuit/auto/pull/1590) ([@tinytim84](https://github.com/tinytim84) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- fix: do ssh check first ([@tinytim84](https://github.com/tinytim84))
- Fix non-ssh release [#1629](https://github.com/intuit/auto/pull/1629) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix: accidental removal ([@tinytim84](https://github.com/tinytim84))
- chore: remove permissions check ([@tinytim84](https://github.com/tinytim84))
- Bump tslib from 2.0.1 to 2.0.3 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- testing ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix: check push permissions before verifyAuth ([@tinytim84](https://github.com/tinytim84))
- fix: remove envs for ssh test + process.env cleanup ([@tinytim84](https://github.com/tinytim84))
- fix: clear env vars for ssh test ([@tinytim84](https://github.com/tinytim84))
- feat: add ssh support for connecting to github ([@tinytim84](https://github.com/tinytim84))

#### 🔩 Dependency Updates

- Bump ts-jest from 26.4.0 to 26.4.3 [#1627](https://github.com/intuit/auto/pull/1627) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tslib from 2.0.1 to 2.0.3 [#1626](https://github.com/intuit/auto/pull/1626) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Tim Ottewell ([@tinytim84](https://github.com/tinytim84))

---

# v10.0.2 (Thu Oct 29 2020)

#### 🐛 Bug Fix

- make version, afterVersion, publish, and afterPublish series hooks [#1620](https://github.com/intuit/auto/pull/1620) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- make version, afterVersion, publish, and afterPublish series hooks ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.0.0 (Thu Oct 29 2020)

### Release Notes

_From #1609_

This release simplifies some of the hooks arguements to allow for easier future extensibility.

The following hooks have had their second argument converted to an object that takes a "context" of pertinent information:

- `afterShipIt`
- `onCreateChangelog`
- `publish`
-  `next`

Please consult the docs or plugin implementations for further detail.

_From #1604_

Previously a lot of the hooks would not run during a dry run and `auto` would try to guess what they would do. This lead to the output versions of some commands to be off.

With the release of v10 `auto` will call to the plugins for various hooks so they can control that.

_From #1607_

We were implementing the `renderChangelogLine` in a way that was more complex than needed

Previously the hook took a tuple and had to return a tuple

```ts
auto.hooks.onCreateChangelog.tapPromise('Stars', changelog =>
  changelog.hooks.renderChangelogLine.tapPromise(
    'Stars',
    async ([commit, line]) =>
      [commit, `${line.replace('-', ':star:')}\n`]
  );
);
```

Now it can just return the rendered changelog line

```ts
auto.hooks.onCreateChangelog.tapPromise('Stars', changelog =>
  changelog.hooks.renderChangelogLine.tapPromise(
    'Stars',
    async (line, commit) => `${line.replace('-', ':star:')}\n`
  );
);
```

---

#### 💥 Breaking Change

- simplify hook APIs for easier future extensibility [#1609](https://github.com/intuit/auto/pull/1609) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Run various hooks in a --dry-run [#1604](https://github.com/intuit/auto/pull/1604) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- correct renderChangelogLine hook usage [#1607](https://github.com/intuit/auto/pull/1607) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- rename afterAddToChangelog hook to afterChangelog [#1606](https://github.com/intuit/auto/pull/1606) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add quiet functionality to version hook ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Git reset bugs on canary/next [#1618](https://github.com/intuit/auto/pull/1618) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- simplify hook APIs for easier future extensibility ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- correct renderChangelogLine hook usage ([@hipstersmoothie](https://github.com/hipstersmoothie))
- rename afterAddToChangelog hook to afterChangelog ([@hipstersmoothie](https://github.com/hipstersmoothie))
- check clean status during dry run too ([@hipstersmoothie](https://github.com/hipstersmoothie))
- use shared dry run interface ([@hipstersmoothie](https://github.com/hipstersmoothie))
- call version and afterVersion hook during dryRun ([@hipstersmoothie](https://github.com/hipstersmoothie))
- improve npm lerna independent makeRelease dry run ([@hipstersmoothie](https://github.com/hipstersmoothie))
- call next hook during dry run ([@hipstersmoothie](https://github.com/hipstersmoothie))
- call canary hook during dry-run ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add dryrun to prCheck hook ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump eslint-config-prettier from 6.13.0 to 6.14.0 [#1610](https://github.com/intuit/auto/pull/1610) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-import from 2.22.0 to 2.22.1 [#1611](https://github.com/intuit/auto/pull/1611) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 24.0.2 to 24.1.0 [#1612](https://github.com/intuit/auto/pull/1612) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 7.9.0 to 7.12.1 [#1613](https://github.com/intuit/auto/pull/1613) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.5.0 to 4.6.0 [#1614](https://github.com/intuit/auto/pull/1614) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 15.0.1 to 16.0.0 [#1616](https://github.com/intuit/auto/pull/1616) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.59.0 (Wed Oct 14 2020)

#### 🚀 Enhancement

- Group monorepo changelog lines if possivle [#1589](https://github.com/intuit/auto/pull/1589) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add sortChangelogLines hook ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.55.0 (Wed Oct 07 2020)

#### 🚀 Enhancement

- add dryRun to BeforeShipItContext [#1572](https://github.com/intuit/auto/pull/1572) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add dryRun to BeforeShipItContext ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.54.5 (Tue Oct 06 2020)

#### 🐛 Bug Fix

- add invalid-email-address to botlist [#1569](https://github.com/intuit/auto/pull/1569) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.54.1 (Mon Oct 05 2020)

#### 🐛 Bug Fix

- upgrade gitlog [#1561](https://github.com/intuit/auto/pull/1561) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- upgrade gitlog ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.54.0 (Thu Oct 01 2020)

#### 🚀 Enhancement

- Add pr-body-labels plugin [#1554](https://github.com/intuit/auto/pull/1554) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- Add pr-body-labels plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump node-fetch from 2.6.0 to 2.6.1 in /packages/core ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### 🔩 Dependency Updates

- Bump @types/prettier from 2.0.2 to 2.1.1 [#1542](https://github.com/intuit/auto/pull/1542) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.1.1 to 4.3.0 [#1549](https://github.com/intuit/auto/pull/1549) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pretty-ms from 7.0.0 to 7.0.1 [#1550](https://github.com/intuit/auto/pull/1550) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump all-contributors-cli from 6.17.2 to 6.17.4 [#1545](https://github.com/intuit/auto/pull/1545) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump prettier from 2.0.5 to 2.1.2 [#1544](https://github.com/intuit/auto/pull/1544) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 26.2.0 to 26.4.0 [#1543](https://github.com/intuit/auto/pull/1543) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.1.1 to 4.3.0 [#1551](https://github.com/intuit/auto/pull/1551) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 26.0.13 to 26.0.14 [#1539](https://github.com/intuit/auto/pull/1539) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 24.0.1 to 24.0.2 [#1538](https://github.com/intuit/auto/pull/1538) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.20.0 to 24.0.1 [#1532](https://github.com/intuit/auto/pull/1532) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @types/jest from 26.0.10 to 26.0.13 [#1516](https://github.com/intuit/auto/pull/1516) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump node-fetch from 2.6.0 to 2.6.1 in /packages/core [#1523](https://github.com/intuit/auto/pull/1523) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- [@dependabot[bot]](https://github.com/dependabot[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.10 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- only post partial release notes to next releases [#1474](https://github.com/intuit/auto/pull/1474) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- only post partial release notes to next releases ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.9 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- Fix label initialization [#1473](https://github.com/intuit/auto/pull/1473) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add color to label prompt so we can detect differences between base label ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix getting label from user ([@hipstersmoothie](https://github.com/hipstersmoothie))
- no need to init enterprise graphql api ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add more release plugins to init ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.8 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- correct behavior for lerna project with private packages [#1472](https://github.com/intuit/auto/pull/1472) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- correct behavior for lerna project with private packages ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.7 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- fix default bump type [#1470](https://github.com/intuit/auto/pull/1470) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix default bump ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.4 (Thu Aug 13 2020)

#### 🐛 Bug Fix

- correct enterprise upload assets baseUrl [#1466](https://github.com/intuit/auto/pull/1466) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- correct enterprise upload assets baseUrl ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Improve package manager plugin docs [#1465](https://github.com/intuit/auto/pull/1465) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.2 (Tue Aug 11 2020)

#### 🐛 Bug Fix

- Fix finding available canary version and add logging [#1460](https://github.com/intuit/auto/pull/1460) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump tslib from 2.0.0 to 2.0.1 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump cosmiconfig from 6.0.0 to 7.0.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 18.0.1 to 18.0.3 [#1455](https://github.com/intuit/auto/pull/1455) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump jest from 26.2.2 to 26.3.0 [#1452](https://github.com/intuit/auto/pull/1452) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tslib from 2.0.0 to 2.0.1 [#1457](https://github.com/intuit/auto/pull/1457) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump cosmiconfig from 6.0.0 to 7.0.0 [#1454](https://github.com/intuit/auto/pull/1454) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.6 (Fri Aug 07 2020)

#### 🐛 Bug Fix

- Fix Independent `next` versioning [#1445](https://github.com/intuit/auto/pull/1445) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- change getFirstCommit so -vv doesn't print every commit hash ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix printing GHE version ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.5 (Thu Aug 06 2020)

#### 🐛 Bug Fix

- upgrade eslint + ensure all imported packages are in package.json [#1442](https://github.com/intuit/auto/pull/1442) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- log require errors in veryVerbose mode ([@hipstersmoothie](https://github.com/hipstersmoothie))
- upgrade eslint + ensure all imported packages are in package.json ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump jest from 26.1.0 to 26.2.2 [#1431](https://github.com/intuit/auto/pull/1431) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.4 (Tue Aug 04 2020)

### Release Notes

_From #1429_

This PR fixes a few issues around `next` releases and lerna independent monorepos:

- implement a lerna-like versioning function for independent next releases. Allows us more control of how the repo gets versioned. this function will tag+commit the next version, relying on the previously implemented "tag-juggling" so we can rely on lerna as much as possible.
- rely on `makeRelease` hook to create `next` releases. This enables changelogs in the prerelease for each package
- keep tags annotated while moving. This makes lerna's package publishing logic work better. `lerna changed` only works on annotated tags.
- remove version from "Full Changelog"s in prerelease PRs. hard to calculate correct version so it's easier to just omit it

---

#### 🐛 Bug Fix

- Fix lerna independent "next" releases [#1429](https://github.com/intuit/auto/pull/1429) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove version from independent next Full Changelogs. hard to calculate correct version ([@hipstersmoothie](https://github.com/hipstersmoothie))
- rely on makeRelease hook to create `next` releases ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.3 (Fri Jul 31 2020)

#### 🐛 Bug Fix

- Fix various rate limiting issues [#1424](https://github.com/intuit/auto/pull/1424) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- memoize getCommits ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove author email match, easily hits rate limit ([@hipstersmoothie](https://github.com/hipstersmoothie))
- return only commits in the canary release instead of all commits since last tag. getting all commits can trigger rate limits and canaries should be lightweight ([@hipstersmoothie](https://github.com/hipstersmoothie))
- use graphql api on octokit instance ([@hipstersmoothie](https://github.com/hipstersmoothie))
- pretty print time left on rate limit ([@hipstersmoothie](https://github.com/hipstersmoothie))
- memoize searchRepo ([@hipstersmoothie](https://github.com/hipstersmoothie))
- retry after abuse limit ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.1 (Wed Jul 29 2020)

#### 🐛 Bug Fix

- don't leak GH_TOKEN in exec promise output [#1419](https://github.com/intuit/auto/pull/1419) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- don't leak GH_TOKEN in exec promise output ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.48.2 (Tue Jul 28 2020)

#### 🐛 Bug Fix

- Stream logs in verbose mode [#1409](https://github.com/intuit/auto/pull/1409) ([@stabbylambda](https://github.com/stabbylambda))
- add helpful error message when git state isn't clean for gh-pages plugin [#1410](https://github.com/intuit/auto/pull/1410) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- catch errors when finding tags on next [#1402](https://github.com/intuit/auto/pull/1402) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- pipe the output ([@stabbylambda](https://github.com/stabbylambda))
- Stream logs in verbose mode ([@stabbylambda](https://github.com/stabbylambda))
- Bump @types/jest from 26.0.0 to 26.0.7 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- catch errors when finding tags on next ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump eslint-plugin-jest from 23.18.0 to 23.19.0 [#1404](https://github.com/intuit/auto/pull/1404) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/fontawesome-svg-core from 1.2.29 to 1.2.30 [#1407](https://github.com/intuit/auto/pull/1407) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest from 25.5.4 to 26.1.0 [#1406](https://github.com/intuit/auto/pull/1406) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump all-contributors-cli from 6.16.1 to 6.17.0 [#1405](https://github.com/intuit/auto/pull/1405) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 26.0.0 to 26.0.7 [#1403](https://github.com/intuit/auto/pull/1403) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- David Stone ([@stabbylambda](https://github.com/stabbylambda))

---

# v9.47.2 (Wed Jul 22 2020)

#### 🐛 Bug Fix

- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump eslint-plugin-jsdoc from 28.6.1 to 30.0.2 [#1385](https://github.com/intuit/auto/pull/1385) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/rest from 18.0.0 to 18.0.1 [#1390](https://github.com/intuit/auto/pull/1390) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump ts-jest from 25.5.1 to 26.1.3 [#1392](https://github.com/intuit/auto/pull/1392) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/graphql from 4.5.1 to 4.5.2 [#1391](https://github.com/intuit/auto/pull/1391) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pkg from 4.4.8 to 4.4.9 [#1389](https://github.com/intuit/auto/pull/1389) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.6.1 to 2.7.0 [#1388](https://github.com/intuit/auto/pull/1388) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fromentries from 1.2.0 to 1.2.1 [#1387](https://github.com/intuit/auto/pull/1387) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-import from 2.21.1 to 2.22.0 [#1386](https://github.com/intuit/auto/pull/1386) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/free-solid-svg-icons from 5.13.0 to 5.14.0 [#1384](https://github.com/intuit/auto/pull/1384) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.47.1 (Mon Jul 20 2020)

#### 🐛 Bug Fix

- Fixes baseBranch from config [#1393](https://github.com/intuit/auto/pull/1393) ([@10hendersonm](https://github.com/10hendersonm))
- fix(baseBranch): Applies custom configured base branch back to Auto.baseBranch ([@10hendersonm](https://github.com/10hendersonm))

#### Authors: 1

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))

---

# v9.47.0 (Thu Jul 16 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, David Stone ([@stabbylambda](https://github.com/stabbylambda)), for all your work!

#### 🚀 Enhancement

- Add `--exists $LABEL` to label command [#1383](https://github.com/intuit/auto/pull/1383) ([@stabbylambda](https://github.com/stabbylambda))

#### 🐛 Bug Fix

- Add `--exists $LABEL` to label command ([@stabbylambda](https://github.com/stabbylambda))

#### Authors: 1

- David Stone ([@stabbylambda](https://github.com/stabbylambda))

---

# v9.45.0 (Mon Jul 13 2020)

### Release Notes

_From #1371_

Previously `auto` would mark unlabelled PRs as `patch`. You can now configure what label will be applied as the `default` when calculating SEMVER bumps and adding PRs to changelogs.

To configure a default label add the `default` property and set it to `true`.

```json
{
  "labels": [
    {
      "name": "Version: Minor",
      "releaseType": "minor",
      "default": true
    }
  ]
}
```

---

#### 🚀 Enhancement

- allow default SEMVER label to be configured [#1371](https://github.com/intuit/auto/pull/1371) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- allow default SEMVER label to be configured ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.44.0 (Sat Jul 11 2020)

#### 🚀 Enhancement

- add .autorc "author" option that combines email + name [#1370](https://github.com/intuit/auto/pull/1370) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add .autorc "author" option that combines email + name ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.43.2 (Sat Jul 11 2020)

#### 🐛 Bug Fix

- exit in CI when no valid git email + name found [#1369](https://github.com/intuit/auto/pull/1369) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- exit in CI when no valid git email + name found ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.43.1 (Tue Jul 07 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Lucas Shadler ([@lshadler](https://github.com/lshadler)), for all your work!

#### 🐛 Bug Fix

- fix: prioritize base branch head ref [#1363](https://github.com/intuit/auto/pull/1363) ([@lshadler](https://github.com/lshadler) [@hipstersmoothie](https://github.com/hipstersmoothie))
- fix test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix: prioritize base branch head ref ([@lshadler](https://github.com/lshadler))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Lucas Shadler ([@lshadler](https://github.com/lshadler))

---

# v9.42.0 (Tue Jul 07 2020)

#### 🚀 Enhancement

- add --to flag to "auto release" [#1362](https://github.com/intuit/auto/pull/1362) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add --to flag to "auto release" ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.41.1 (Mon Jul 06 2020)

#### 🐛 Bug Fix

- attempt to construct the GitHub graphql root API endpoint if githubApi is provided [#1349](https://github.com/intuit/auto/pull/1349) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- attempt to construct the GitHub graphql root API endpoint if githubApi is provided ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.41.0 (Mon Jul 06 2020)

#### 🚀 Enhancement

- Enable easier "all-contributors" usage on non-javascript project + add extra contributors to changelogs [#1350](https://github.com/intuit/auto/pull/1350) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add contributors mentioned in PR body to changelogs ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.40.5 (Thu Jun 25 2020)

#### 🐛 Bug Fix

- standardize default label colors [#1324](https://github.com/intuit/auto/pull/1324) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- standardize default label colors ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.40.4 (Wed Jun 24 2020)

#### 🐛 Bug Fix

- Next - Adds intermediary check for newest release before releasing entire history [#1323](https://github.com/intuit/auto/pull/1323) ([@10hendersonm](https://github.com/10hendersonm))
- fix(next): Retrieves most recent tag before returning the entire git history ([@10hendersonm](https://github.com/10hendersonm))

#### Authors: 1

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))

---

# v9.40.3 (Wed Jun 24 2020)

#### 🐛 Bug Fix

- Correct some license issues and ignore snyk bot [#1321](https://github.com/intuit/auto/pull/1321) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.40.2 (Wed Jun 24 2020)

#### 🐛 Bug Fix

- stop parsing release notes when we hit an automated comment created by auto [#1320](https://github.com/intuit/auto/pull/1320) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- stop parsing release notes when we hit an automated comment created by auto ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/rest from 17.9.0 to 18.0.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 17.9.0 to 18.0.0 [#1301](https://github.com/intuit/auto/pull/1301) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/plugin-retry from 3.0.1 to 3.0.3 [#1304](https://github.com/intuit/auto/pull/1304) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-throttling from 3.2.1 to 3.2.2 [#1309](https://github.com/intuit/auto/pull/1309) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 25.4.2 to 27.0.7 [#1311](https://github.com/intuit/auto/pull/1311) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.2.6 to 10.2.11 [#1314](https://github.com/intuit/auto/pull/1314) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump all-contributors-cli from 6.15.0 to 6.16.0 [#1306](https://github.com/intuit/auto/pull/1306) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump type-fest from 0.15.0 to 0.15.1 [#1307](https://github.com/intuit/auto/pull/1307) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump chalk from 4.0.0 to 4.1.0 [#1310](https://github.com/intuit/auto/pull/1310) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-prettier from 3.1.3 to 3.1.4 [#1305](https://github.com/intuit/auto/pull/1305) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.40.1 (Wed Jun 24 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Snyk bot ([@snyk-bot](https://github.com/snyk-bot)), for all your work!

#### 🐛 Bug Fix

- Update makeRelease to support 'from' and 'useVersion' options with build part of semver [#1315](https://github.com/intuit/auto/pull/1315) ([@bnigh](https://github.com/bnigh))
- update makeRelease to support 'from' and 'useVersion' options with build part of semver ([@bnigh](https://github.com/bnigh))

#### 🔩 Dependency Updates

- [Snyk] Fix for 1 vulnerabilities [#1316](https://github.com/intuit/auto/pull/1316) ([@snyk-bot](https://github.com/snyk-bot))

#### Authors: 2

- [@bnigh](https://github.com/bnigh)
- Snyk bot ([@snyk-bot](https://github.com/snyk-bot))

---

# v9.40.0 (Wed Jun 24 2020)

### Release Notes

_From #1295_

This release removes the requirement for the `Maven Release Plugin` from maven projects. This is a breaking change but that maven plugin was quite experimental. This PR makes it a full featured `auto` experience. 

## Remove requirement for "maven-release-plugin" and other improvements

1. Remove requirement for "maven-release-plugin".
2. Support recursive changes to all `pom.xml` files in the project, with the following assumptions:
  a. The project is a multi-module project.
  b. The parent `pom.xml` file is located in the root directory of the repo.
  c. The parent `pom.xml` contains the version.
  d. Sub-modules have the same version as the parent `pom.xml`.
3. Support plugin options, with environment variable overrides:
  a. `MAVEN_COMMAND || mavenCommand` - the path to the maven executable to use. Defaults to `/usr/bin/mvn`.
  b. `MAVEN_OPTIONS || mavenOptions` - an array of arbitrary maven options, e.g. `-DskipTests -P some-profile`. No defaults.
  c. `MAVEN_RELEASE_GOALS || mavenReleaseGoals` - an array of maven goals to run when publishing. Defaults to `["deploy", "site-deploy"]`.
  d. `MAVEN_SETTINGS || mavenSettings` - the path to the maven settings file. No defaults.

**NOTE:** The `MAVEN_USERNAME` and `MAVEN_PASSWORD` environment variables are still supported, and have their counterparts as configuration options, but should are deprecated, and will be removed in a later release. This is because `MAVEN_SETTINGS` or `MAVEN_OPTIONS` can do the same work, but provide a much more flexible solution.

## Support both "versions-maven-plugin" and auto-native DOM/XML

`auto` will detect if the parent `pom.xml` file has the `versions-maven-plugin` configured, and if so, use it to set the version on the parent and all child `pom.xml` files. If not, then auto will modify the parent and all child `pom.xml` files using a DOM parser and XML serializer. This has the effect of losing formatting. Therefore it then runs the serialized XML through the `prettier` "html" pretty-printer.

This means that if the `versions-maven-plugin` isn't available, the `pom.xml` files will be pretty-printed using the `prettier` formatter with the following default settings:

* `printWidth: 120` (configurable - see below)
* `tabWidth: 4` (configurable - see below)
* `parser: "html"`

---

#### 🚀 Enhancement

- Remove maven release plugin requirement [#1295](https://github.com/intuit/auto/pull/1295) ([@rbellamy](https://github.com/rbellamy) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- change beforeRun hook from sync to async ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump tslib from 1.11.1 to 2.0.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump typescript from 3.9.3 to 3.9.5 [#1288](https://github.com/intuit/auto/pull/1288) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tslib from 1.11.1 to 2.0.0 [#1289](https://github.com/intuit/auto/pull/1289) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v9.39.0 (Thu Jun 04 2020)

#### 🐛 Bug Fix

- fix automated old branch creation [#1278](https://github.com/intuit/auto/pull/1278) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix automated old branch creation ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.38.2 (Wed Jun 03 2020)

#### 🐛 Bug Fix

- if canary --force provided default to patch [#1275](https://github.com/intuit/auto/pull/1275) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- if force provided default to patch ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.38.1 (Wed Jun 03 2020)

#### 🐛 Bug Fix

- fix next release start commit calculation when tags are package@version [#1273](https://github.com/intuit/auto/pull/1273) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix next release start commit calculation when tags are package@version ([@hipstersmoothie](https://github.com/hipstersmoothie))
- chore: accurately name variable within inOldVersionBranch() ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

#### 🏠 Internal

- chore: accurately name variable within inOldVersionBranch() [#1271](https://github.com/intuit/auto/pull/1271) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

#### 🔩 Dependency Updates

- Bump io-ts from 2.2.2 to 2.2.4 [#1269](https://github.com/intuit/auto/pull/1269) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Brian Muenzenmeyer ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

---

# v9.37.0 (Fri May 29 2020)

#### 🚀 Enhancement

- add more contextual information to next hook [#1265](https://github.com/intuit/auto/pull/1265) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add more contextual information to next hook ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.36.4 (Thu May 28 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Marty Henderson ([@10hendersonm](https://github.com/10hendersonm)), for all your work!

#### 🐛 Bug Fix

- fix(git): Prevents getLastTagNotInBaseBranch from returning a commit hash [#1262](https://github.com/intuit/auto/pull/1262) ([@10hendersonm](https://github.com/10hendersonm))
- fix(git): Prevents getLastTagNotInBaseBranch from returning a commit hash ([@10hendersonm](https://github.com/10hendersonm))

#### Authors: 1

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))

---

# v9.36.3 (Thu May 28 2020)

#### 🐛 Bug Fix

- calculate next release notes using the latest fork commit not the first [#1264](https://github.com/intuit/auto/pull/1264) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- calculate next release notes using the latest fork commit not the first ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump type-fest from 0.13.1 to 0.15.0 [#1259](https://github.com/intuit/auto/pull/1259) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.36.1 (Fri May 22 2020)

#### 🐛 Bug Fix

- fix reduce without initial value [#1249](https://github.com/intuit/auto/pull/1249) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add build ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix reduce without initial value ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.35.3 (Fri May 22 2020)

#### 🐛 Bug Fix

- Changelog formatting [#1246](https://github.com/intuit/auto/pull/1246) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Improve changelog formatting to be more compatible with pretter ([@hipstersmoothie](https://github.com/hipstersmoothie))
- changelog-formatting ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.35.2 (Fri May 22 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Kevin Wolf ([@kevinwolfdev](https://github.com/kevinwolfdev)), for all your work!

#### 🐛 Bug Fix

- Extend default labels [#1206](https://github.com/intuit/auto/pull/1206) ([@kevinwolfdev](https://github.com/kevinwolfdev) [@hipstersmoothie](https://github.com/hipstersmoothie))
- ensure user label order is respected if changelog titles match ([@hipstersmoothie](https://github.com/hipstersmoothie))
- reset changelog changes ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix failing tests ([@kevinwolfdev](https://github.com/kevinwolfdev))
- Merge branch 'master' into extend-default-labels ([@kevinwolfdev](https://github.com/kevinwolfdev))
- add patch releaseType to performance label ([@kevinwolfdev](https://github.com/kevinwolfdev))
- extend default labels ([@kevinwolfdev](https://github.com/kevinwolfdev))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Kevin Wolf ([@kevinwolfdev](https://github.com/kevinwolfdev))

---

# v9.34.0 (Tue May 19 2020)

#### 🚀 Enhancement

- allow more rc file types [#1235](https://github.com/intuit/auto/pull/1235) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- allow more rc file types ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump lerna from 3.20.2 to 3.21.0 [#1232](https://github.com/intuit/auto/pull/1232) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump io-ts from 2.2.1 to 2.2.2 [#1231](https://github.com/intuit/auto/pull/1231) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.31.0 to 2.34.0 [#1230](https://github.com/intuit/auto/pull/1230) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 25.2.0 to 25.4.2 [#1229](https://github.com/intuit/auto/pull/1229) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.9.0 to 23.13.1 [#1228](https://github.com/intuit/auto/pull/1228) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🏠 Internal

- add test that ensure bundled auto still works [#1226](https://github.com/intuit/auto/pull/1226) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.33.0 (Mon May 18 2020)

#### 🚀 Enhancement

- 💎 Ruby Gem Plugin [#1217](https://github.com/intuit/auto/pull/1217) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- fix(shipit): correct variable name isBaseBranch ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))
- remove dep on octokit types ([@hipstersmoothie](https://github.com/hipstersmoothie))
- finish octokit 17 upgrade ([@hipstersmoothie](https://github.com/hipstersmoothie))
- build almost works ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/rest from 16.43.1 to 17.2.1 ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add gem plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 16.43.1 to 17.2.1 [#1146](https://github.com/intuit/auto/pull/1146) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 24.0.0 to 25.2.0 [#1211](https://github.com/intuit/auto/pull/1211) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- [Security] Bump handlebars from 4.5.3 to 4.7.6 [#1213](https://github.com/intuit/auto/pull/1213) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🏠 Internal

- fix(shipit): correct variable name isBaseBranch [#1223](https://github.com/intuit/auto/pull/1223) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Brian Muenzenmeyer ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

---

# v9.32.1 (Fri May 15 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Till Weisser ([@whynotzoidberg](https://github.com/whynotzoidberg)), for all your work!

#### 🐛 Bug Fix

- Increase gitlog maximum buffer size to Infinity [#1212](https://github.com/intuit/auto/pull/1212) ([@whynotzoidberg](https://github.com/whynotzoidberg))
- Increase gitlog maximum buffer size to Infinity ([@whynotzoidberg](https://github.com/whynotzoidberg))

#### 🔩 Dependency Updates

- Bump fp-ts from 2.5.4 to 2.6.0 [#1209](https://github.com/intuit/auto/pull/1209) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 25.4.0 to 25.5.1 [#1208](https://github.com/intuit/auto/pull/1208) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Till Weisser ([@whynotzoidberg](https://github.com/whynotzoidberg))

---

# v9.31.2 (Mon May 11 2020)

#### 🐛 Bug Fix

- fix(auto): correct git porcelain error message [#1207](https://github.com/intuit/auto/pull/1207) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))
- fix(auto): correct git porcelain error message ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

#### 🔩 Dependency Updates

- Bump @typescript-eslint/parser from 2.27.0 to 2.31.0 [#1198](https://github.com/intuit/auto/pull/1198) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.10.1 to 6.11.0 [#1197](https://github.com/intuit/auto/pull/1197) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest from 25.4.0 to 25.5.4 [#1196](https://github.com/intuit/auto/pull/1196) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.8.2 to 23.9.0 [#1195](https://github.com/intuit/auto/pull/1195) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.27.0 to 2.31.0 [#1199](https://github.com/intuit/auto/pull/1199) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump semver from 7.2.2 to 7.3.2 [#1200](https://github.com/intuit/auto/pull/1200) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pkg from 4.4.7 to 4.4.8 [#1201](https://github.com/intuit/auto/pull/1201) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 14.2.0 to 14.3.0 [#1202](https://github.com/intuit/auto/pull/1202) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump prettier from 2.0.4 to 2.0.5 [#1203](https://github.com/intuit/auto/pull/1203) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Brian Muenzenmeyer ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

---

# v9.31.0 (Mon May 04 2020)

#### 🚀 Enhancement

- add --no-changelog option [#1193](https://github.com/intuit/auto/pull/1193) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add --no-changelog option ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.30.5 (Sat May 02 2020)

#### 🐛 Bug Fix

- Fix PR detection bug [#1191](https://github.com/intuit/auto/pull/1191) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- make sure number exists to avoid "undefined" string ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.30.4 (Sat May 02 2020)

#### 🐛 Bug Fix

- fix npm canary release w/o any tags [#1188](https://github.com/intuit/auto/pull/1188) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- improve error stack ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @types/node-fetch from 2.5.5 to 2.5.7 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump log-symbols from 3.0.0 to 4.0.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump log-symbols from 3.0.0 to 4.0.0 [#1178](https://github.com/intuit/auto/pull/1178) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest from 25.1.0 to 25.4.0 [#1183](https://github.com/intuit/auto/pull/1183) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node-fetch from 2.5.5 to 2.5.7 [#1182](https://github.com/intuit/auto/pull/1182) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 14.1.4 to 14.2.0 [#1181](https://github.com/intuit/auto/pull/1181) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 25.3.0 to 25.4.0 [#1180](https://github.com/intuit/auto/pull/1180) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.1.6 to 10.1.7 [#1179](https://github.com/intuit/auto/pull/1179) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump all-contributors-cli from 6.14.1 to 6.14.2 [#1177](https://github.com/intuit/auto/pull/1177) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 13.11.0 to 13.13.4 [#1176](https://github.com/intuit/auto/pull/1176) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.5.3 to 2.5.4 [#1175](https://github.com/intuit/auto/pull/1175) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.30.0 (Wed Apr 22 2020)

#### 🐛 Bug Fix

- Bump endent from 1.4.1 to 2.0.1 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump lint-staged from 10.0.8 to 10.1.6 [#1167](https://github.com/intuit/auto/pull/1167) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/free-solid-svg-icons from 5.12.1 to 5.13.0 [#1169](https://github.com/intuit/auto/pull/1169) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/signale from 1.4.0 to 1.4.1 [#1168](https://github.com/intuit/auto/pull/1168) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump endent from 1.4.1 to 2.0.1 [#1166](https://github.com/intuit/auto/pull/1166) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-prettier from 3.1.2 to 3.1.3 [#1165](https://github.com/intuit/auto/pull/1165) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-import from 2.20.1 to 2.20.2 [#1164](https://github.com/intuit/auto/pull/1164) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump io-ts from 2.1.2 to 2.2.1 [#1163](https://github.com/intuit/auto/pull/1163) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 22.1.0 to 24.0.0 [#1162](https://github.com/intuit/auto/pull/1162) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v9.28.3 (Mon Apr 20 2020)

#### 🐛 Bug Fix

- fix quiet flag in npm plugin. was always on [#1161](https://github.com/intuit/auto/pull/1161) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.28.2 (Mon Apr 20 2020)

#### 🐛 Bug Fix

- bug in silent flag [#1160](https://github.com/intuit/auto/pull/1160) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.28.1 (Mon Apr 20 2020)

#### 🐛 Bug Fix

- add verbose logs when branch is behind [#1159](https://github.com/intuit/auto/pull/1159) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add verbose logs when branch is behind ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.28.0 (Fri Apr 17 2020)

#### 🚀 Enhancement

- Add --quiet flag [#1155](https://github.com/intuit/auto/pull/1155) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- factor out reset into util ([@hipstersmoothie](https://github.com/hipstersmoothie))
- better -dq logs for canary and next ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add quiet flag ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.27.3 (Thu Apr 16 2020)

#### 🐛 Bug Fix

- upload-assets: update deprecated option [#1152](https://github.com/intuit/auto/pull/1152) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- print link to release ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.27.0 (Tue Apr 14 2020)

#### 🐛 Bug Fix

- update gitlog ([@hipstersmoothie](https://github.com/hipstersmoothie))
- unneeded ts-ignore ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update enquirer usage ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump chalk from 3.0.0 to 4.0.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump gitlog from 3.3.4 to 4.0.0 [#1145](https://github.com/intuit/auto/pull/1145) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump typescript from 3.7.5 to 3.8.3 [#1045](https://github.com/intuit/auto/pull/1045) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pkg from 4.4.6 to 4.4.7 [#1143](https://github.com/intuit/auto/pull/1143) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.26.0 to 2.27.0 [#1139](https://github.com/intuit/auto/pull/1139) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump chalk from 3.0.0 to 4.0.0 [#1140](https://github.com/intuit/auto/pull/1140) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.8 (Wed Apr 08 2020)

#### 🐛 Bug Fix

- Fix omitting merges from master into next when running "shipit" [#1137](https://github.com/intuit/auto/pull/1137) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- recreate logparse every time so we can dynamically tap ti ([@hipstersmoothie](https://github.com/hipstersmoothie))
- improve release note logging ([@hipstersmoothie](https://github.com/hipstersmoothie))
- reset git changes after next/canary ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.7 (Tue Apr 07 2020)

#### 🐛 Bug Fix

- Skip next commit hooks [#1136](https://github.com/intuit/auto/pull/1136) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- dont run commit hooks when publishing next ([@hipstersmoothie](https://github.com/hipstersmoothie))
- testing ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.6 (Tue Apr 07 2020)

#### 🐛 Bug Fix

- Next improvements [#1135](https://github.com/intuit/auto/pull/1135) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- use TS-refactor of gitlog ([@hipstersmoothie](https://github.com/hipstersmoothie))
- omit merge commits from next changelog ([@hipstersmoothie](https://github.com/hipstersmoothie))
- combine duplicate merge commits ([@hipstersmoothie](https://github.com/hipstersmoothie))
- dont omit unreleased commits ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.5 (Tue Apr 07 2020)

#### 🐛 Bug Fix

- fix creating canary with no Latest Release [#1134](https://github.com/intuit/auto/pull/1134) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.4 (Mon Apr 06 2020)

#### 🐛 Bug Fix

- pr-check: succeed on pre-release branch PRs [#1133](https://github.com/intuit/auto/pull/1133) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.3 (Mon Apr 06 2020)

#### 🐛 Bug Fix

- Improve next branch preview changelog [#1132](https://github.com/intuit/auto/pull/1132) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @types/jest from 25.1.4 to 25.2.1 [#1130](https://github.com/intuit/auto/pull/1130) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump graphql from 14.6.0 to 15.0.0 [#1129](https://github.com/intuit/auto/pull/1129) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.2 (Mon Apr 06 2020)

#### 🐛 Bug Fix

- ensure commits pushed directly to next branch are labelled correctly in next-PR changelog [#1123](https://github.com/intuit/auto/pull/1123) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.1 (Sun Apr 05 2020)

#### 🐛 Bug Fix

- fix: push to master w/--only-publish-with-release-label creating release [#1121](https://github.com/intuit/auto/pull/1121) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.0 (Sun Apr 05 2020)

#### 🚀 Enhancement

- Add most flags for version+changelog+release to shipit/latest [#1117](https://github.com/intuit/auto/pull/1117) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.4 (Sat Apr 04 2020)

#### 🐛 Bug Fix

- include first commit in changelogs [#1115](https://github.com/intuit/auto/pull/1115) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.3 (Sat Apr 04 2020)

#### 🐛 Bug Fix

- --dry-run improvements [#1114](https://github.com/intuit/auto/pull/1114) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- Turn on eslint rules that would have prevented last bug [#1112](https://github.com/intuit/auto/pull/1112) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.2 (Fri Apr 03 2020)

#### 🐛 Bug Fix

- Changelog bugs [#1111](https://github.com/intuit/auto/pull/1111) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.1 (Fri Apr 03 2020)

#### 🐛 Bug Fix

- Fix info command in fresh envs + list plugins in binary [#1110](https://github.com/intuit/auto/pull/1110) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.0 (Thu Apr 02 2020)

#### 🚀 Enhancement

- shipit: expose --only-publish-with-release-label [#1108](https://github.com/intuit/auto/pull/1108) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.24.0 (Thu Apr 02 2020)

#### 🚀 Enhancement

- Add `--list-plugins` flag to `info` command [#1103](https://github.com/intuit/auto/pull/1103) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.23.1 (Thu Apr 02 2020)

#### 🐛 Bug Fix

- next: add whitspace so markdown formats correctly [#1104](https://github.com/intuit/auto/pull/1104) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.23.0 (Wed Apr 01 2020)

#### 🚀 Enhancement

- Add Brew Plugin [#1099](https://github.com/intuit/auto/pull/1099) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.22.3 (Wed Apr 01 2020)

#### 🔩 Dependency Updates

- Bump @octokit/plugin-enterprise-compatibility from 1.2.1 to 1.2.2 [#1087](https://github.com/intuit/auto/pull/1087) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v9.22.1 (Fri Mar 27 2020)

#### 🐛 Bug Fix

- Exit with warning when canary or next is unimplemented [#1085](https://github.com/intuit/auto/pull/1085) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.22.0 (Fri Mar 27 2020)

#### 🚀 Enhancement

- Add --title flag to 'auto changelog' [#1084](https://github.com/intuit/auto/pull/1084) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.21.2 (Fri Mar 27 2020)

#### 🐛 Bug Fix

- always use tag version for release title, prevent using annotation [#1083](https://github.com/intuit/auto/pull/1083) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.21.1 (Fri Mar 27 2020)

#### 🐛 Bug Fix

- Respect Updated PR Titles [#1082](https://github.com/intuit/auto/pull/1082) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.20.0 (Wed Mar 18 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Harris Borawski ([@hborawski](https://github.com/hborawski)), for all your work!

#### 🚀 Enhancement

- Cocoapods plugin [#1066](https://github.com/intuit/auto/pull/1066) ([@hborawski](https://github.com/hborawski) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v9.19.4 (Tue Mar 10 2020)

#### 🔩 Dependency Updates

- Bump @octokit/core from 2.4.0 to 2.4.2 [#1046](https://github.com/intuit/auto/pull/1046) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 24.0.25 to 25.1.4 [#1041](https://github.com/intuit/auto/pull/1041) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v9.19.3 (Mon Mar 09 2020)

#### 🐛 Bug Fix

- try credentialed remotes first [#1039](https://github.com/intuit/auto/pull/1039) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.19.2 (Sun Mar 08 2020)

#### 🐛 Bug Fix

- When checking if remote commits ignore git error message [#1038](https://github.com/intuit/auto/pull/1038) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.19.1 (Sat Mar 07 2020)

#### 🐛 Bug Fix

- Better GitHub Actions support + docs for github action + handle GITHUB_TOKEN [#1036](https://github.com/intuit/auto/pull/1036) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.19.0 (Sat Mar 07 2020)

### Release Notes

_From #996_

The `gradle` plugin has enabled many Java and Android engineers to automate the versioning of their projects. While the old `gradle` plugin's features were primarily targeted at app developers, this release brings features that make `auto` ergonomic for library authors! :tada:

## `-SNAPSHOT` Versioning

A common versioning pattern for java projects is `-SNAPSHOT` Versioning. It is especially helpful for library authors and helps with testing their libraries.

All you have to do to start using this feature is add `-SNAPSHOT` to your version in `build.gradle` or `gradle.properties` and `auto` will start using`-snapshot` Versioning. If you want to configure the snapshot suffix just set `snapshotSuffix` in `gradle.properties`.

## Publish Support

Another useful feature for library authors, `auto` will now call the `publish` task if it is configured for your project. :rocket:

## `versionFile` deprecation

Previously this plugin had to use a `versionFile` to keep track of the version of the project. Now it will parse the `gradle properties` command for this information.

This is not a breaking change, you'll just have an extra file you can delete

---

#### 🚀 Enhancement

- 🐘 Gradle Plugin: Add support for snapshot versioning, publishing, and less configuration [#996](https://github.com/intuit/auto/pull/996) ([@sugarmanz](https://github.com/sugarmanz) Jeremiah_Zucker@Intuit.com [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Jeremiah (Jeremiah_Zucker@Intuit.com)
- Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz))

---

# v9.18.0 (Sat Mar 07 2020)

### Release Notes

_From #1033_

Install `@auto-it/exec` to easily run bash scripts during the `auto` release pipeline! Right now it doesn't handle every hook in `auto` but it exposes enough to quickly write plugins.

```jsonc
{
  "plugins": [
    [
      "exec",
      {
        "afterShipIt": "echo 'Do something cool'"
      }
    ]
    // other plugins
  ]
}
```

Here is an example of a super light weight version of the `npm` and `gh-pages` plugins (Note: This misses out on a lot of features that are in the official plugins)

```jsonc
{
  "plugins": [
    [
      "exec",
      {
        "version": "npm version $ARG_0",
        "publish": "npm publish && git push --tags",
        "afterRelease": "yarn docs && push-dir --dir=docs --branch=gh-pages"
      }
    ]
    // other plugins
  ]
}
```

---

#### 🚀 Enhancement

- Add Exec Plugin [#1033](https://github.com/intuit/auto/pull/1033) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.17.1 (Fri Mar 06 2020)

#### 🐛 Bug Fix

- 📦 🐈 Yarn 2 Compatibility [#1029](https://github.com/intuit/auto/pull/1029) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.17.0 (Fri Mar 06 2020)

#### 🚀 Enhancement

- Add GitHub Pages Plugin [#1031](https://github.com/intuit/auto/pull/1031) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.7 (Fri Mar 06 2020)

#### 🐛 Bug Fix

- "version" would be wrong with label-less PRs + 'none' release types [#1032](https://github.com/intuit/auto/pull/1032) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.6 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- add dep for parse-github-url ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.5 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- add bot-list dep to core ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.4 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- Make gitlog include merge commit files [#1028](https://github.com/intuit/auto/pull/1028) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.0 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.10 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- Fix loading canary versions of offical plugins ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.9 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- fix typo ([@hipstersmoothie](https://github.com/hipstersmoothie))
- no need for 2 try/catches ([@hipstersmoothie](https://github.com/hipstersmoothie))
- better comment ([@hipstersmoothie](https://github.com/hipstersmoothie))
- test for ancestor in windows freindly way ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.7 (Tue Mar 03 2020)

#### 🐛 Bug Fix

- add license to all sub-packages ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.6 (Tue Mar 03 2020)

#### 🐛 Bug Fix

- format ([@hipstersmoothie](https://github.com/hipstersmoothie))
- info: handle when there is no previous version ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.5 (Tue Mar 03 2020)

#### 🐛 Bug Fix

- fix "Push to master" on next branch ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.4 (Mon Mar 02 2020)

#### 🐛 Bug Fix

- update tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- make --force configurable in the .autorc ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Don't release canary on skip-release by default, add force flag ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.3 (Mon Mar 02 2020)

#### 🐛 Bug Fix

- don't force publish canary/next for independent lerna projects ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @types/node-fetch from 2.5.4 to 2.5.5

Bumps [@types/node-fetch](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/node-fetch) from 2.5.4 to 2.5.5.

- [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- [Commits](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/HEAD/types/node-fetch)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump tslib from 1.11.0 to 1.11.1

Bumps [tslib](https://github.com/Microsoft/tslib) from 1.11.0 to 1.11.1.

- [Release notes](https://github.com/Microsoft/tslib/releases)
- [Commits](https://github.com/Microsoft/tslib/compare/1.11.0...1.11.1)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.1 (Sun Mar 01 2020)

#### 🐛 Bug Fix

- only get default config in command that allow it, enables shipit to easily use sub-commands configs ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.0 (Sun Mar 01 2020)

#### 🐛 Bug Fix

- use fromEntries ponyfill until node 10 EOL ([@hipstersmoothie](https://github.com/hipstersmoothie))
- don't valide config with flag overrides ([@hipstersmoothie](https://github.com/hipstersmoothie))
- enable autorc configuration for some command flags ([@hipstersmoothie](https://github.com/hipstersmoothie))
- dont include intersections in valdation error path ([@hipstersmoothie](https://github.com/hipstersmoothie))
- dont match none labels. this fixes bug where releaseType none labels would get the internal label's description ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix label ordering for validation error paths ([@hipstersmoothie](https://github.com/hipstersmoothie))
- strip ansi codes from snapshots ([@hipstersmoothie](https://github.com/hipstersmoothie))
- layout validaiton erros with more space ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- validate fully loaded configuration ([@hipstersmoothie](https://github.com/hipstersmoothie))
- print objects better ([@hipstersmoothie](https://github.com/hipstersmoothie))
- print arrays better ([@hipstersmoothie](https://github.com/hipstersmoothie))
- dont report redundant errors ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add test to ensure command configuration doesn't throw errors ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add test to make sure auto exits with configuration errors ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix old tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- validate raw config ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix union type overriding ([@hipstersmoothie](https://github.com/hipstersmoothie))
- get array of objects working ([@hipstersmoothie](https://github.com/hipstersmoothie))
- recursively convert type to exact ([@hipstersmoothie](https://github.com/hipstersmoothie))
- make plugin configuration helper util ([@hipstersmoothie](https://github.com/hipstersmoothie))
- exit on invalid config ([@hipstersmoothie](https://github.com/hipstersmoothie))
- when validating stop at unknown top level keys ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove dead code, was never used anywher ([@hipstersmoothie](https://github.com/hipstersmoothie))
- validate autorc configuration + add validateConfig hook for plugins ([@hipstersmoothie](https://github.com/hipstersmoothie))
- refactor autorc type ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.14.0 (Tue Feb 25 2020)

#### 🐛 Bug Fix

- add scoped plugin support ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.13.1 (Mon Feb 24 2020)

#### 🐛 Bug Fix

- add fallback for when --is-ancestor fails ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump tslib from 1.10.0 to 1.11.0

Bumps [tslib](https://github.com/Microsoft/tslib) from 1.10.0 to 1.11.0.

- [Release notes](https://github.com/Microsoft/tslib/releases)
- [Commits](https://github.com/Microsoft/tslib/compare/1.10.0...1.11.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.13.0 (Sat Feb 22 2020)

#### 🐛 Bug Fix

- When parsing owner/repo fallback to parsing 'origin' ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add git version to 'auto info' output

! ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.12.0 (Fri Feb 21 2020)

#### 🐛 Bug Fix

- add tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- ensure remote can be pushed to ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.11.0 (Fri Feb 21 2020)

#### 🐛 Bug Fix

- Add new command 'latest' for easier testing and more flexibility ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.8 (Fri Feb 21 2020)

#### 🐛 Bug Fix

- configure agent on request ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Adding proxyagent to graphql ([@YogiKhan](https://github.com/YogiKhan))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- yogesh khandelwal ([@YogiKhan](https://github.com/YogiKhan))

---

# v9.10.7 (Tue Feb 18 2020)

#### 🐛 Bug Fix

- filter out bots in first-time contributor plugins ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.6 (Mon Feb 17 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]), for all your work!

#### 🐛 Bug Fix

- get node version in crash friendly way ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump https-proxy-agent from 4.0.0 to 5.0.0

Bumps [https-proxy-agent](https://github.com/TooTallNate/node-https-proxy-agent) from 4.0.0 to 5.0.0.

- [Release notes](https://github.com/TooTallNate/node-https-proxy-agent/releases)
- [Commits](https://github.com/TooTallNate/node-https-proxy-agent/compare/4.0.0...5.0.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump @octokit/core from 2.2.0 to 2.4.0

Bumps [@octokit/core](https://github.com/octokit/core.js) from 2.2.0 to 2.4.0.

- [Release notes](https://github.com/octokit/core.js/releases)
- [Commits](https://github.com/octokit/core.js/compare/v2.2.0...v2.4.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump @types/semver from 6.2.0 to 7.1.0

Bumps [@types/semver](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/semver) from 6.2.0 to 7.1.0.

- [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- [Commits](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/HEAD/types/semver)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.5 (Thu Feb 13 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]), for all your work!

#### 🐛 Bug Fix

- fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/rest from 16.38.3 to 16.43.1

Bumps [@octokit/rest](https://github.com/octokit/rest.js) from 16.38.3 to 16.43.1.

- [Release notes](https://github.com/octokit/rest.js/releases)
- [Commits](https://github.com/octokit/rest.js/compare/v16.38.3...v16.43.1)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.4 (Thu Feb 06 2020)

#### 🐛 Bug Fix

- dont exit process when calling info in core ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.3 (Thu Feb 06 2020)

#### 🐛 Bug Fix

- add user login ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add info about token permission ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.2 (Thu Feb 06 2020)

#### 🐛 Bug Fix

- handle repos with large amounts of labels ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.0 (Thu Feb 06 2020)

#### 🐛 Bug Fix

- remove space ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add "info" command ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.8.3 (Thu Jan 30 2020)

#### 🐛 Bug Fix

- move ICommit to "core" to fix external plugin TS build errors ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.8.1 (Wed Jan 29 2020)

#### 🐛 Bug Fix

- more descriptive message ([@hipstersmoothie](https://github.com/hipstersmoothie))
- better error message running release in repo w/o tags ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.8.0 (Mon Jan 27 2020)

#### 🐛 Bug Fix

- make unique GitHub releases for each package published in lerna independent monorepo ([@hipstersmoothie](https://github.com/hipstersmoothie))
- create new hook makeRelease and move current behavior into default tap ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.7.0 (Mon Jan 27 2020)

#### 🐛 Bug Fix

- enhance BeforeShipit hook to include the type of release that will be made ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.5.0 (Mon Jan 27 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]), for all your work!

#### 🐛 Bug Fix

- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add next steps ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Overhaul "auto init" experience + make it pluggable ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/plugin-throttling from 2.7.1 to 3.2.0

Bumps [@octokit/plugin-throttling](https://github.com/octokit/plugin-throttling.js) from 2.7.1 to 3.2.0.

- [Release notes](https://github.com/octokit/plugin-throttling.js/releases)
- [Commits](https://github.com/octokit/plugin-throttling.js/compare/v2.7.1...v3.2.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@hipstersmoothie](https://github.com/hipstersmoothie))

- Bump @octokit/plugin-retry from 2.2.0 to 3.0.1

Bumps [@octokit/plugin-retry](https://github.com/octokit/plugin-retry.js) from 2.2.0 to 3.0.1.

- [Release notes](https://github.com/octokit/plugin-retry.js/releases)
- [Commits](https://github.com/octokit/plugin-retry.js/compare/v2.2.0...v3.0.1)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump @octokit/rest from 16.37.0 to 16.38.3

Bumps [@octokit/rest](https://github.com/octokit/rest.js) from 16.37.0 to 16.38.3.

- [Release notes](https://github.com/octokit/rest.js/releases)
- [Commits](https://github.com/octokit/rest.js/compare/v16.37.0...v16.38.3)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.4.0 (Sat Jan 25 2020)

#### 🐛 Bug Fix

- format detail a little better ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Add html details option to canary hook + Use in npm plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.3.4 (Sat Jan 25 2020)

#### 🐛 Bug Fix

- fix test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add better messaging when pr number cannot be detected ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.3.3 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- Add :package: emoji to canary PR message to make it more noticeable ([@ericclemmons](https://github.com/ericclemmons))

#### Authors: 1

- Eric Clemmons ([@ericclemmons](https://github.com/ericclemmons))

---

# v9.3.2 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- better logging in dry runs ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.3.1 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- add test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Surface plugin syntax errors to user ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.2.2 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- Fix error on empty pr body ([@reckter](https://github.com/reckter))

#### Authors: 1

- Hannes Güdelhöfer ([@reckter](https://github.com/reckter))

---

# v9.2.1 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- fallback to 0.0.0 in git-tag plugin with no previous releases ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.2.0 (Thu Jan 23 2020)

#### 🐛 Bug Fix

- fix lint warning ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Add ability to manage sub-package contributor lists ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.2 (Thu Jan 23 2020)

#### 🐛 Bug Fix

- fix omitting renovate release notes when a user manually rebases the renovate PR ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.1 (Thu Jan 23 2020)

#### 🐛 Bug Fix

- Fix onlyPublishWithReleaseLabel w/o labels ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.0 (Tue Jan 21 2020)

#### 🐛 Bug Fix

- upgrade enquirer ([@hipstersmoothie](https://github.com/hipstersmoothie))
- canary: try to match commit to PR if not found in env ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @types/node from 12.12.21 to 13.1.8

Bumps [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/node) from 12.12.21 to 13.1.8.

- [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- [Commits](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/HEAD/types/node)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump @octokit/rest from 16.36.0 to 16.37.0

Bumps [@octokit/rest](https://github.com/octokit/rest.js) from 16.36.0 to 16.37.0.

- [Release notes](https://github.com/octokit/rest.js/releases)
- [Commits](https://github.com/octokit/rest.js/compare/v16.36.0...v16.37.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.0.1 (Mon Jan 13 2020)

#### 🐛 Bug Fix

- handle PR numbers that don't exist in repo/fork ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.0.0 (Mon Jan 13 2020)

#### 🐛 Bug Fix

- Bump env-ci from 4.5.2 to 5.0.1

Bumps [env-ci](https://github.com/pvdlg/env-ci) from 4.5.2 to 5.0.1.

- [Release notes](https://github.com/pvdlg/env-ci/releases)
- [Commits](https://github.com/pvdlg/env-ci/compare/v4.5.2...v5.0.1)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump @octokit/rest from 16.35.2 to 16.36.0

Bumps [@octokit/rest](https://github.com/octokit/rest.js) from 16.35.2 to 16.36.0.

- [Release notes](https://github.com/octokit/rest.js/releases)
- [Commits](https://github.com/octokit/rest.js/compare/v16.35.2...v16.36.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v8.8.0 (Thu Jan 02 2020)

#### 🐛 Bug Fix

- Update existing test so behavior matches name ([@bnigh](https://github.com/bnigh))
- Add tests to verify changelog section assignment behavior ([@bnigh](https://github.com/bnigh))

#### Authors: 1

- [@bnigh](https://github.com/bnigh)

---

# v8.7.3 (Fri Dec 20 2019)

#### 🐛 Bug Fix

- check origin head instead of local branch ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.7.2 (Fri Dec 20 2019)

#### 🐛 Bug Fix

- find the last greatest tag to help with botched releases ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.7.1 (Thu Dec 19 2019)

#### 🐛 Bug Fix

- add debug info ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.7.0 (Thu Dec 19 2019)

#### 🐛 Bug Fix

- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add context of what type of release was made during shipit ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.3 (Thu Dec 19 2019)

#### 🐛 Bug Fix

- fix execpromise logs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- determine next version using by omitting tags from master ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.2 (Wed Dec 18 2019)

#### 🐛 Bug Fix

- update snapshots ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- only access auto login if it all exists ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.1 (Wed Dec 18 2019)

#### 🐛 Bug Fix

- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))
- canary hook can return void to not bail ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.0 (Tue Dec 17 2019)

#### 🐛 Bug Fix

- make branch at last tag instead of head ([@hipstersmoothie](https://github.com/hipstersmoothie))
- finish update ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update versioning prelabel ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.5.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add ability to manage version branches ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.5.0 (Tue Dec 17 2019)

#### 🐛 Bug Fix

- Bump version to: v8.2.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add ability to manage version branches ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.3.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- version: detect prerelease branch ([@hipstersmoothie](https://github.com/hipstersmoothie))
- release: detect prerelease branch + be smarter about commit range ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- let modify config actually do something ([@hipstersmoothie](https://github.com/hipstersmoothie))
- ignore unknown labels during bump calc + fix none type release skipping ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.4.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix and add tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- release: add flag to publish prerelease ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- omit next branch PR Title from being in release notes ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump https-proxy-agent from 3.0.1 to 4.0.0

Bumps [https-proxy-agent](https://github.com/TooTallNate/node-https-proxy-agent) from 3.0.1 to 4.0.0.

- [Release notes](https://github.com/TooTallNate/node-https-proxy-agent/releases)
- [Commits](https://github.com/TooTallNate/node-https-proxy-agent/compare/3.0.1...4.0.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump @octokit/rest from 16.35.0 to 16.35.2

Bumps [@octokit/rest](https://github.com/octokit/rest.js) from 16.35.0 to 16.35.2.

- [Release notes](https://github.com/octokit/rest.js/releases)
- [Commits](https://github.com/octokit/rest.js/compare/v16.35.0...v16.35.2)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump semver from 6.3.0 to 7.0.0

Bumps [semver](https://github.com/npm/node-semver) from 6.3.0 to 7.0.0.

- [Release notes](https://github.com/npm/node-semver/releases)
- [Changelog](https://github.com/npm/node-semver/blob/master/CHANGELOG.md)
- [Commits](https://github.com/npm/node-semver/compare/v6.3.0...v7.0.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.5.0 (Tue Dec 17 2019)

#### 🐛 Bug Fix

- Bump version to: v8.2.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add ability to manage version branches ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.3.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- version: detect prerelease branch ([@hipstersmoothie](https://github.com/hipstersmoothie))
- release: detect prerelease branch + be smarter about commit range ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- let modify config actually do something ([@hipstersmoothie](https://github.com/hipstersmoothie))
- ignore unknown labels during bump calc + fix none type release skipping ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.4.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix and add tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- release: add flag to publish prerelease ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- omit next branch PR Title from being in release notes ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump https-proxy-agent from 3.0.1 to 4.0.0

Bumps [https-proxy-agent](https://github.com/TooTallNate/node-https-proxy-agent) from 3.0.1 to 4.0.0.

- [Release notes](https://github.com/TooTallNate/node-https-proxy-agent/releases)
- [Commits](https://github.com/TooTallNate/node-https-proxy-agent/compare/3.0.1...4.0.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump @octokit/rest from 16.35.0 to 16.35.2

Bumps [@octokit/rest](https://github.com/octokit/rest.js) from 16.35.0 to 16.35.2.

- [Release notes](https://github.com/octokit/rest.js/releases)
- [Commits](https://github.com/octokit/rest.js/compare/v16.35.0...v16.35.2)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump semver from 6.3.0 to 7.0.0

Bumps [semver](https://github.com/npm/node-semver) from 6.3.0 to 7.0.0.

- [Release notes](https://github.com/npm/node-semver/releases)
- [Changelog](https://github.com/npm/node-semver/blob/master/CHANGELOG.md)
- [Commits](https://github.com/npm/node-semver/compare/v6.3.0...v7.0.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.4.0 (Mon Dec 16 2019)

#### 🐛 Bug Fix

- version: detect prerelease branch ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.3.0 (Mon Dec 16 2019)

#### 🐛 Bug Fix

- release: detect prerelease branch + be smarter about commit range ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/rest from 16.35.0 to 16.35.2

Bumps [@octokit/rest](https://github.com/octokit/rest.js) from 16.35.0 to 16.35.2.

- [Release notes](https://github.com/octokit/rest.js/releases)
- [Commits](https://github.com/octokit/rest.js/compare/v16.35.0...v16.35.2)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump https-proxy-agent from 3.0.1 to 4.0.0

Bumps [https-proxy-agent](https://github.com/TooTallNate/node-https-proxy-agent) from 3.0.1 to 4.0.0.

- [Release notes](https://github.com/TooTallNate/node-https-proxy-agent/releases)
- [Commits](https://github.com/TooTallNate/node-https-proxy-agent/compare/3.0.1...4.0.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

- Bump semver from 6.3.0 to 7.0.0

Bumps [semver](https://github.com/npm/node-semver) from 6.3.0 to 7.0.0.

- [Release notes](https://github.com/npm/node-semver/releases)
- [Changelog](https://github.com/npm/node-semver/blob/master/CHANGELOG.md)
- [Commits](https://github.com/npm/node-semver/compare/v6.3.0...v7.0.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.2.0 (Sun Dec 15 2019)

#### 🐛 Bug Fix

- fix and add tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- release: add flag to publish prerelease ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.3 (Sat Dec 14 2019)

#### 🐛 Bug Fix

- add test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- omit next branch PR Title from being in release notes ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.2 (Sat Dec 14 2019)

#### 🐛 Bug Fix

- add test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- ignore unknown labels during bump calc + fix none type release skipping ([@hipstersmoothie](https://github.com/hipstersmoothie))
- let modify config actually do something ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.0 (Sat Dec 14 2019)

#### 🐛 Bug Fix

- fix bug where merging a none would skip previously meged semver label, ex: merge next into master and next has a none label ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.0.0 (Wed Dec 11 2019)

#### 🐛 Bug Fix

- change skip-release releaseType to just skip ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add hash ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix sub-pacakge changelogs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- only grant contributions for work in commit ([@hipstersmoothie](https://github.com/hipstersmoothie))
- display message when commit is omitted ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix bug where author would get matched incorrectly ([@hipstersmoothie](https://github.com/hipstersmoothie))
- handle unknown tag when supplying --from and --to ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- omit commits that have already been released ([@hipstersmoothie](https://github.com/hipstersmoothie))
- do not call afterRelease hooks during dry run ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update docs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- switch from dedent to endent to fix multitemplate indentation ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add release notes to prerelease PRs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove false type ([@hipstersmoothie](https://github.com/hipstersmoothie))
- post comment prerelase version on prerelease version PR branches ([@hipstersmoothie](https://github.com/hipstersmoothie))
- allow any "N > 2" of --verbose flags for very verbose ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Deprecate "--very-verbose, -w" in favor of "-vv" ([@hipstersmoothie](https://github.com/hipstersmoothie))
- more logs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix canary calcs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- reset versions ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.8 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- change to more explicit property name ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.7 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- move to top level util for ease of testing ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add email fallback back in ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add test for none ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add none release type ([@hipstersmoothie](https://github.com/hipstersmoothie))
- allow user to overwrite base label ([@hipstersmoothie](https://github.com/hipstersmoothie))
- check for depreacted config ([@hipstersmoothie](https://github.com/hipstersmoothie))
- get label refactor working ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.6 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- move determineNextVersion to core ([@hipstersmoothie](https://github.com/hipstersmoothie))
- move git clean check to core ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.5 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.4 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- change getPreviousVersion hook args. can access prefixRelease from root class instead ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- implment dry-run flag for next command ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- shipit: add flag to only publish to 'latest' tag when "release" label is present ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- allow user to configure what branches are treated as prerelease branches ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove prerelease label when released ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove old use of prerelease label + add prerelease label to released plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- must set git user before publishing so we know we can commit ([@hipstersmoothie](https://github.com/hipstersmoothie))
- call next from shipit on next branch ([@hipstersmoothie](https://github.com/hipstersmoothie))
- get next branch release working ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
