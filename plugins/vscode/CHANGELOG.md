# v11.1.0 (Fri Feb 23 2024)

#### 🚀 Enhancement

- [Feature Request] Allow opting out of ts-node [#2420](https://github.com/intuit/auto/pull/2420) ([@ds300](https://github.com/ds300))

#### Authors: 1

- David Sheldrick ([@ds300](https://github.com/ds300))

---

# v11.0.5 (Thu Feb 22 2024)

#### 🔩 Dependency Updates

- Bump strip-ansi from 6.0.0 to 7.0.1 [#2307](https://github.com/intuit/auto/pull/2307) ([@dependabot[bot]](https://github.com/dependabot[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@dependabot[bot]](https://github.com/dependabot[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v11.0.3 (Sun Sep 10 2023)

#### 🐛 Bug Fix

- Bump version to: v11.0.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.46.0 (Wed Apr 26 2023)

### Release Notes

#### Add --from latest option to release and changelog commands ([#2356](https://github.com/intuit/auto/pull/2356))

You can now use `--from latest` in both the `changelog`and `release` commands. 

This is useful if you want to generate a changelog for a prerelease that includes  all changes since the `latest` release.

```sh
auto release --from latest --prerelease
```

---

#### 🚀 Enhancement

- Add --from latest option to release and changelog commands [#2356](https://github.com/intuit/auto/pull/2356) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.45.2 (Wed Apr 26 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@ld-codes](https://github.com/ld-codes), for all your work!

#### 🐛 Bug Fix

- fix typo for empty git user message [#2354](https://github.com/intuit/auto/pull/2354) ([@ld-codes](https://github.com/ld-codes))

#### Authors: 1

- [@ld-codes](https://github.com/ld-codes)

---

# v10.45.1 (Wed Apr 26 2023)

#### 🐛 Bug Fix

- fixes "some peer dependencies are incorrectly met" when installing via yarn [#2348](https://github.com/intuit/auto/pull/2348) ([@snebjorn](https://github.com/snebjorn))

#### Authors: 1

- Eskild Diderichsen ([@snebjorn](https://github.com/snebjorn))

---

# v10.43.0 (Wed Mar 01 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, Adil Malik ([@amalik2](https://github.com/amalik2)), for all your work!

#### 🚀 Enhancement

- feat: add in beforeVersion lifecycle hook [#2334](https://github.com/intuit/auto/pull/2334) (adil_malik@intuit.com)

#### Authors: 1

- Adil Malik ([@amalik2](https://github.com/amalik2))

---

# v10.42.0 (Fri Feb 10 2023)

#### 🚀 Enhancement

- Feat add `afterRun` hook [#2182](https://github.com/intuit/auto/pull/2182) ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 1

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v10.40.0 (Wed Feb 08 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, Bruno Nardini ([@megatroom](https://github.com/megatroom)), for all your work!

#### 🚀 Enhancement

- Add `--no-git-commit` option to `changelog` command [#2258](https://github.com/intuit/auto/pull/2258) ([@megatroom](https://github.com/megatroom))

#### Authors: 1

- Bruno Nardini ([@megatroom](https://github.com/megatroom))

---

# v10.39.0 (Wed Feb 08 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, Jason T Brown ([@vpipkt](https://github.com/vpipkt)), for all your work!

#### 🚀 Enhancement

- non-zero exit code if commit is behind [#2189](https://github.com/intuit/auto/pull/2189) ([@vpipkt](https://github.com/vpipkt))

#### 🏠 Internal

- run actions on PRs [#2318](https://github.com/intuit/auto/pull/2318) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Jason T Brown ([@vpipkt](https://github.com/vpipkt))

---

# v10.37.6 (Tue Sep 13 2022)

:tada: This release contains work from a new contributor! :tada:

Thank you, Ikko Ashimine ([@eltociear](https://github.com/eltociear)), for all your work!

#### 🐛 Bug Fix

- chore: fix typo in auto.ts [#2223](https://github.com/intuit/auto/pull/2223) ([@eltociear](https://github.com/eltociear))
- version: take into account current PR labels [#2252](https://github.com/intuit/auto/pull/2252) ([@laughedelic](https://github.com/laughedelic))

#### Authors: 2

- Alexey Alekhin ([@laughedelic](https://github.com/laughedelic))
- Ikko Ashimine ([@eltociear](https://github.com/eltociear))

---

# v10.36.5 (Sun Mar 20 2022)

#### 🐛 Bug Fix

- create major version at last release tag [#2175](https://github.com/intuit/auto/pull/2175) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.36.3 (Sun Mar 20 2022)

#### 🐛 Bug Fix

- add mergify[bot] to the bot-list [#1972](https://github.com/intuit/auto/pull/1972) ([@laughedelic](https://github.com/laughedelic))

#### 🔩 Dependency Updates

- Bump path-parse from 1.0.6 to 1.0.7 [#2050](https://github.com/intuit/auto/pull/2050) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- Bump tmpl from 1.0.4 to 1.0.5 [#2078](https://github.com/intuit/auto/pull/2078) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- Bump trim-off-newlines from 1.0.1 to 1.0.3 [#2133](https://github.com/intuit/auto/pull/2133) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- Bump simple-get from 3.1.0 to 3.1.1 [#2154](https://github.com/intuit/auto/pull/2154) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- Bump tar from 4.4.15 to 4.4.19 [#2066](https://github.com/intuit/auto/pull/2066) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- Bump nanoid from 3.1.22 to 3.3.1 [#2155](https://github.com/intuit/auto/pull/2155) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- Bump nth-check from 2.0.0 to 2.0.1 [#2079](https://github.com/intuit/auto/pull/2079) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 2

- [@dependabot[bot]](https://github.com/dependabot[bot])
- Alexey Alekhin ([@laughedelic](https://github.com/laughedelic))

---

# v10.36.1 (Sun Mar 20 2022)

#### 🐛 Bug Fix

- Fix loading object author from auto rc [#2172](https://github.com/intuit/auto/pull/2172) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update octokit [#2171](https://github.com/intuit/auto/pull/2171) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.36.0 (Sun Mar 20 2022)

#### 🚀 Enhancement

- Allow load npm module as extends [#2164](https://github.com/intuit/auto/pull/2164) ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 1

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

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

#### 🐛 Bug Fix

- upgrade prettier ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 18.1.0 to 18.2.0 [#1823](https://github.com/intuit/auto/pull/1823) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump type-fest from 0.20.2 to 0.21.1 [#1825](https://github.com/intuit/auto/pull/1825) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.15.0 to 8.0.0 [#1822](https://github.com/intuit/auto/pull/1822) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump aws-cli-js from 2.0.6 to 2.1.0 [#1808](https://github.com/intuit/auto/pull/1808) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.9.3 to 2.9.5 [#1810](https://github.com/intuit/auto/pull/1810) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- remove "master" from docs ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v10.5.0 (Mon Dec 21 2020)

#### 🚀 Enhancement

- VSCode marketplace publishing plugin [#1696](https://github.com/intuit/auto/pull/1696) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- use vsce directly ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix commit message ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix and add tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add vscode plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
