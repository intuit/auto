# v10.12.1 (Thu Jan 21 2021)

#### 🐛 Bug Fix

- respect `skip` and `none` releases for prereleases [#1738](https://github.com/intuit/auto/pull/1738) ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.10.1 (Tue Jan 19 2021)

#### 🐛 Bug Fix

- properly kill spawned node child processes [#1732](https://github.com/intuit/auto/pull/1732) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.9.0 (Thu Jan 14 2021)

#### 🚀 Enhancement

- default `name` and `email` to the token user if no author config is found in autorc or plugin [#1720](https://github.com/intuit/auto/pull/1720) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.7.0 (Thu Jan 14 2021)

#### 🚀 Enhancement

- Attempt to resolve relative plugin paths from extended config location [#1717](https://github.com/intuit/auto/pull/1717) ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

#### Authors: 2

- Andrew Leedham ([@AndrewLeedham](https://github.com/AndrewLeedham))
- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v10.5.1 (Fri Jan 08 2021)

#### 🐛 Bug Fix

- update snapshots ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

#### 🏠 Internal

- fix url pr-check uses for auto's CI [#1663](https://github.com/intuit/auto/pull/1663) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

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

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.4 (Fri Nov 06 2020)

#### 🐛 Bug Fix

- Truncate commit hash for shorter canary versions [#1635](https://github.com/intuit/auto/pull/1635) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.3 (Wed Nov 04 2020)

#### 🐛 Bug Fix

- add timeout when verifying auth to remote [#1632](https://github.com/intuit/auto/pull/1632) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.1.0 (Mon Nov 02 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Tim Ottewell ([@tinytim84](https://github.com/tinytim84)), for all your work!

#### 🚀 Enhancement

- feat: add ssh support for connecting to github [#1590](https://github.com/intuit/auto/pull/1590) ([@tinytim84](https://github.com/tinytim84) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- Fix non-ssh release [#1629](https://github.com/intuit/auto/pull/1629) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump tslib from 2.0.1 to 2.0.3 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

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

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.0.0 (Thu Oct 29 2020)

#### 🐛 Bug Fix


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

# v9.55.0 (Tue Oct 27 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Mukul Chaware ([@mukul13](https://github.com/mukul13)), for all your work!

#### 🚀 Enhancement

- Microsoft Teams plugin for auto [#1570](https://github.com/intuit/auto/pull/1570) ([@mukul13](https://github.com/mukul13) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- use MICROSOFT_TEAMS_WEBHOOK_URL env var ([@hipstersmoothie](https://github.com/hipstersmoothie))
- PR review changes ([@mukul13](https://github.com/mukul13))
- change microsoft-teams plugin to extend from slack plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))
- removing @channel targeting and updating readme ([@mukul13](https://github.com/mukul13))
- readmed updated ([@mukul13](https://github.com/mukul13))
- tests updated ([@mukul13](https://github.com/mukul13))
- code cleanup ([@mukul13](https://github.com/mukul13))
- add tests for microsoft teams plugin and comment redundant code ([@mukul13](https://github.com/mukul13))
- feat: plugin for microsoft teams ([@mukul13](https://github.com/mukul13))
- base setup for microsoft teams ([@mukul13](https://github.com/mukul13))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Mukul Chaware ([@mukul13](https://github.com/mukul13))
