# v10.33.0 (Fri Mar 04 2022)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Ken Clarke ([@kclarkey](https://github.com/kclarkey))

:heart: Dalton Scharff ([@daltonscharff](https://github.com/daltonscharff))

#### 🚀 Enhancement

- feat(plugins/npm): exclude pre-release branches from greaterRelease calculation [#2036](https://github.com/intuit/auto/pull/2036) ([@hydrosquall](https://github.com/hydrosquall))
- feat(plugins/npm): add support for passing publishFolder. [#2115](https://github.com/intuit/auto/pull/2115) ([@kclarkey](https://github.com/kclarkey))

#### 🐛 Bug Fix

- fix(@octokit/request-error) Fixes depreciation error when accessing error.headers [#2064](https://github.com/intuit/auto/pull/2064) (dalton.scharff@segment.com)
- Merge branch 'main' into daltonscharff/change-git-error-header (dalton.scharff@segment.com)

#### Authors: 3

- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))
- Dalton Scharff ([@daltonscharff](https://github.com/daltonscharff))
- Ken Clarke ([@kclarkey](https://github.com/kclarkey))

---

# v10.32.2 (Tue Oct 26 2021)

#### 🐛 Bug Fix

- fix: get latest maintenance major tag from github releases [#2076](https://github.com/intuit/auto/pull/2076) (lucas_shadler@intuit.com [@sumwatshade](https://github.com/sumwatshade))

#### Authors: 2

- lshadler (lucas_shadler@intuit.com)
- Lucas Shadler ([@sumwatshade](https://github.com/sumwatshade))

---

# v10.29.0 (Fri May 21 2021)

#### 🚀 Enhancement

- Feature/msteams [#1914](https://github.com/intuit/auto/pull/1914) ([@vincentbriglia](https://github.com/vincentbriglia) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- Merge branch 'main' into feature/msteams ([@vincentbriglia](https://github.com/vincentbriglia))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Vincent Briglia ([@vincentbriglia](https://github.com/vincentbriglia))

---

# v10.26.0 (Wed Apr 28 2021)

#### 🚀 Enhancement

- add noDefaultLabels config flag [#1966](https://github.com/intuit/auto/pull/1966) ([@laughedelic](https://github.com/laughedelic))

#### Authors: 1

- Alexey Alekhin ([@laughedelic](https://github.com/laughedelic))

---

# v10.24.1 (Mon Mar 29 2021)

#### 🐛 Bug Fix

- Enable using globally installed plugins [#1930](https://github.com/intuit/auto/pull/1930) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.22.1 (Tue Mar 23 2021)

#### 🐛 Bug Fix

- fix rendering long lines in slack plugin [#1913](https://github.com/intuit/auto/pull/1913) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- update skip docs [#1912](https://github.com/intuit/auto/pull/1912) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @fortawesome/fontawesome-svg-core from 1.2.34 to 1.2.35 [#1897](https://github.com/intuit/auto/pull/1897) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump aws-cli-js from 2.1.0 to 2.2.1 [#1898](https://github.com/intuit/auto/pull/1898) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump await-to-js from 2.1.1 to 3.0.0 [#1899](https://github.com/intuit/auto/pull/1899) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 4.3.8 to 5.2.0 [#1900](https://github.com/intuit/auto/pull/1900) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 7.16.0 to 7.22.0 [#1901](https://github.com/intuit/auto/pull/1901) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 26.0.20 to 26.0.21 [#1902](https://github.com/intuit/auto/pull/1902) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump simple-react-lightbox from 3.3.4 to 3.6.4 [#1903](https://github.com/intuit/auto/pull/1903) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript-memoize from 1.0.0-alpha.4 to 1.0.0 [#1904](https://github.com/intuit/auto/pull/1904) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 24.3.1 to 24.3.2 [#1905](https://github.com/intuit/auto/pull/1905) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.15.0 to 4.18.0 [#1906](https://github.com/intuit/auto/pull/1906) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.20.3 (Mon Mar 15 2021)

#### 🐛 Bug Fix

- better error message for no NPM_token in CI [#1878](https://github.com/intuit/auto/pull/1878) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.20.1 (Sun Mar 14 2021)

#### 🐛 Bug Fix

- only ts-node/register for plugins if typescript is installed to the project [#1877](https://github.com/intuit/auto/pull/1877) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.17.0 (Tue Mar 02 2021)

#### 🚀 Enhancement

- Use Block Kit for slack messages [#1815](https://github.com/intuit/auto/pull/1815) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.16.8 (Wed Feb 24 2021)

#### 🔩 Dependency Updates

- Bump aws-cli-js from 2.0.6 to 2.1.0 [#1808](https://github.com/intuit/auto/pull/1808) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.9.3 to 2.9.5 [#1810](https://github.com/intuit/auto/pull/1810) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v10.16.6 (Thu Feb 18 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Lucas Shadler ([@lshadler](https://github.com/lshadler)), for all your work!

#### 🐛 Bug Fix

- Merge branch 'main' into fix-prefer-prerelease-tags ([@lshadler](https://github.com/lshadler))
- Bump tslib from 2.0.3 to 2.1.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump typescript from 4.0.5 to 4.1.5 [#1800](https://github.com/intuit/auto/pull/1800) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.13.0 to 4.15.0 [#1799](https://github.com/intuit/auto/pull/1799) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump conventional-changelog-core from 4.2.1 to 4.2.2 [#1788](https://github.com/intuit/auto/pull/1788) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.5.3 to 10.5.4 [#1787](https://github.com/intuit/auto/pull/1787) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/prettier from 2.1.6 to 2.2.0 [#1786](https://github.com/intuit/auto/pull/1786) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump vsce from 1.83.0 to 1.85.0 [#1785](https://github.com/intuit/auto/pull/1785) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node-fetch from 2.5.7 to 2.5.8 [#1784](https://github.com/intuit/auto/pull/1784) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tapable from 2.0.0 to 2.2.0 [#1781](https://github.com/intuit/auto/pull/1781) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tslib from 2.0.3 to 2.1.0 [#1779](https://github.com/intuit/auto/pull/1779) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Lucas Shadler ([@lshadler](https://github.com/lshadler))

---

# v10.16.2 (Thu Feb 11 2021)

#### 📝 Documentation

- improve jenkins/next docs [#1794](https://github.com/intuit/auto/pull/1794) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.15.0 (Wed Feb 03 2021)

#### 🚀 Enhancement

- add --force flag/config option to "next" command [#1776](https://github.com/intuit/auto/pull/1776) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.14.0 (Wed Feb 03 2021)

#### 🚀 Enhancement

- feat: conventional commit plugin will label an unlabeled PR [#1758](https://github.com/intuit/auto/pull/1758) ([@hborawski](https://github.com/hborawski) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Fluff up home page [#1773](https://github.com/intuit/auto/pull/1773) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump title-case from 3.0.2 to 3.0.3 [#1766](https://github.com/intuit/auto/pull/1766) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/react-fontawesome from 0.1.12 to 0.1.14 [#1763](https://github.com/intuit/auto/pull/1763) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump chrome-webstore-upload-cli from 1.2.0 to 1.2.1 [#1764](https://github.com/intuit/auto/pull/1764) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.14.0 to 4.14.1 [#1767](https://github.com/intuit/auto/pull/1767) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/fontawesome-svg-core from 1.2.32 to 1.2.34 [#1770](https://github.com/intuit/auto/pull/1770) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest-circus from 26.4.2 to 26.6.3 [#1771](https://github.com/intuit/auto/pull/1771) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v10.13.0 (Mon Jan 25 2021)

#### 🚀 Enhancement

- Add `@auto-it/magic-zero` Plugin [#1701](https://github.com/intuit/auto/pull/1701) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.12.2 (Thu Jan 21 2021)

#### 🐛 Bug Fix

- handle case where auto isn't used in a git repo [#1739](https://github.com/intuit/auto/pull/1739) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

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

#### 🐛 Bug Fix

- use `main` branch if it exists ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

---

#### 💥 Breaking Change

- simplify hook APIs for easier future extensibility [#1609](https://github.com/intuit/auto/pull/1609) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Run various hooks in a --dry-run [#1604](https://github.com/intuit/auto/pull/1604) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- simplify hook APIs for easier future extensibility ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add quiet functionality to version hook ([@hipstersmoothie](https://github.com/hipstersmoothie))
- call version and afterVersion hook during dryRun ([@hipstersmoothie](https://github.com/hipstersmoothie))
- call next hook during dry run ([@hipstersmoothie](https://github.com/hipstersmoothie))
- call canary hook during dry-run ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.54.5 (Tue Oct 06 2020)

#### 🐛 Bug Fix

- add invalid-email-address to botlist [#1569](https://github.com/intuit/auto/pull/1569) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.54.0 (Thu Oct 01 2020)

#### 🐛 Bug Fix

- update tests ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump eslint-plugin-jest from 23.20.0 to 24.0.1 [#1532](https://github.com/intuit/auto/pull/1532) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @types/jest from 26.0.10 to 26.0.13 [#1516](https://github.com/intuit/auto/pull/1516) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.53.0 (Tue Sep 08 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Richard Simpson ([@RichiCoder1](https://github.com/RichiCoder1)), for all your work!

#### 🚀 Enhancement

- Add Docker Publish Plugin [#1510](https://github.com/intuit/auto/pull/1510) ([@RichiCoder1](https://github.com/RichiCoder1))

#### 🐛 Bug Fix

- fix publish and test coverage for publish ([@RichiCoder1](https://github.com/RichiCoder1))
- improve test coverage ([@RichiCoder1](https://github.com/RichiCoder1))
- fix tests and remove unnecessary code ([@RichiCoder1](https://github.com/RichiCoder1))
- add docker plugin ([@RichiCoder1](https://github.com/RichiCoder1))

#### Authors: 1

- Richard Simpson ([@RichiCoder1](https://github.com/RichiCoder1))
