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

# v10.45.0 (Wed Apr 19 2023)

#### 🚀 Enhancement

- allow channel to be passed to slack plugin [#2352](https://github.com/intuit/auto/pull/2352) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- allow channel to be passed to slack plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v10.38.0 (Sat Feb 04 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, Jack Westbrook ([@jackw](https://github.com/jackw)), for all your work!

#### 🚀 Enhancement

- Slack: Update atTarget option to disable tagging messages [#2272](https://github.com/intuit/auto/pull/2272) ([@jackw](https://github.com/jackw))

#### 🐛 Bug Fix

- style(slack): revert unnecessary formatting change ([@jackw](https://github.com/jackw))
- docs(slack): add example of disabling tagging a message ([@jackw](https://github.com/jackw))
- feat(slack): allow passing false to atTarget to disable notifications ([@jackw](https://github.com/jackw))

#### Authors: 1

- Jack Westbrook ([@jackw](https://github.com/jackw))

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
- fix octokit deprecation warning ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.36.0 (Sun Mar 20 2022)

#### 🚀 Enhancement

- Allow load npm module as extends [#2164](https://github.com/intuit/auto/pull/2164) ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 1

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v10.33.1 (Fri Mar 04 2022)

:tada: This release contains work from a new contributor! :tada:

Thank you, Corentin Ardeois ([@ardeois](https://github.com/ardeois)), for all your work!

#### 🐛 Bug Fix

- fix: update node-fetch [#2158](https://github.com/intuit/auto/pull/2158) ([@ardeois](https://github.com/ardeois))
- fix: update node-fetch ([@ardeois](https://github.com/ardeois))

#### Authors: 1

- Corentin Ardeois ([@ardeois](https://github.com/ardeois))

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

# v10.27.1 (Tue May 11 2021)

#### 🐛 Bug Fix

- Remove `text` from non-app authed slack response [#1947](https://github.com/intuit/auto/pull/1947) ([@adierkens](https://github.com/adierkens))
- Update index.ts ([@adierkens](https://github.com/adierkens))

#### Authors: 1

- Adam Dierkens ([@adierkens](https://github.com/adierkens))

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
- fix rendering long lines in slack plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v10.21.1 (Mon Mar 22 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@sentony93](https://github.com/sentony93), for all your work!

#### 🐛 Bug Fix

- add slack release notes screenshot ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Small gradle plugin enhancement [#1896](https://github.com/intuit/auto/pull/1896) (tony_lin@intuit.com [@sentony93](https://github.com/sentony93))

#### 📝 Documentation

- add slack release notes screenshot [#1908](https://github.com/intuit/auto/pull/1908) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- [Security] Bump elliptic from 6.5.3 to 6.5.4 [#1859](https://github.com/intuit/auto/pull/1859) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump prism-react-renderer from 1.1.1 to 1.2.0 [#1841](https://github.com/intuit/auto/pull/1841) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 26.5.0 to 26.5.3 [#1858](https://github.com/intuit/auto/pull/1858) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 31.0.3 to 32.3.0 [#1882](https://github.com/intuit/auto/pull/1882) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump vsce from 1.85.0 to 1.87.0 [#1883](https://github.com/intuit/auto/pull/1883) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 24.1.3 to 24.3.1 [#1884](https://github.com/intuit/auto/pull/1884) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.14.1 to 4.18.0 [#1888](https://github.com/intuit/auto/pull/1888) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 8.0.0 to 8.1.0 [#1835](https://github.com/intuit/auto/pull/1835) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 4

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- [@sentony93](https://github.com/sentony93)
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- slin8 (tony_lin@intuit.com)

---

# v10.20.4 (Mon Mar 15 2021)

#### 🐛 Bug Fix

- Slack link bug [#1887](https://github.com/intuit/auto/pull/1887) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- upgrade slack message package ([@hipstersmoothie](https://github.com/hipstersmoothie))
- use slack url helper ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

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

# v10.18.4 (Tue Mar 09 2021)

#### 🐛 Bug Fix

- Slack message spacing + notification text [#1862](https://github.com/intuit/auto/pull/1862) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add notification text ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add spacing to slack message ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.1 (Tue Mar 02 2021)

#### 🐛 Bug Fix

- groups authors [#1847](https://github.com/intuit/auto/pull/1847) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- groups authors ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.0 (Tue Mar 02 2021)

#### 🚀 Enhancement

- Expose username, iconUrl, and iconEmoji validation bug + collapse markdown lists into 1 section [#1846](https://github.com/intuit/auto/pull/1846) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- render lists in one markdown section ([@hipstersmoothie](https://github.com/hipstersmoothie))
- expose username, iconUrl, and iconEmoji ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.17.0 (Tue Mar 02 2021)

#### 🚀 Enhancement

- Use Block Kit for slack messages [#1815](https://github.com/intuit/auto/pull/1815) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- actually make it work ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- finalize block setup ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add app instructions ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update plugins/slack/src/index.ts ([@hipstersmoothie](https://github.com/hipstersmoothie))
- implement new auth + file uploading ([@hipstersmoothie](https://github.com/hipstersmoothie))
- document atTarget and old + new auth ([@hipstersmoothie](https://github.com/hipstersmoothie))
- go back to old format for webhook only auth ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add function to convert message to slack blocks ([@hipstersmoothie](https://github.com/hipstersmoothie))

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
- Bump @types/node-fetch from 2.5.7 to 2.5.8 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

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

# v10.16.0 (Thu Feb 04 2021)

#### 🚀 Enhancement

- add title option [#1777](https://github.com/intuit/auto/pull/1777) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add title option ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v9.61.0 (Tue Oct 27 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Mukul Chaware ([@mukul13](https://github.com/mukul13)), for all your work!

#### 🚀 Enhancement

- Microsoft Teams plugin for auto [#1570](https://github.com/intuit/auto/pull/1570) ([@mukul13](https://github.com/mukul13) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- make slack plugin more generic ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Mukul Chaware ([@mukul13](https://github.com/mukul13))

---

# v9.60.0 (Wed Oct 21 2020)

#### 🐛 Bug Fix

- Bump @atomist/slack-messages from 1.1.1 to 1.2.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump tinycolor2 from 1.4.1 to 1.4.2 [#1582](https://github.com/intuit/auto/pull/1582) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @atomist/slack-messages from 1.1.1 to 1.2.0 [#1583](https://github.com/intuit/auto/pull/1583) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.3.0 to 4.4.0 [#1565](https://github.com/intuit/auto/pull/1565) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

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

# v9.54.3 (Tue Oct 06 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Sanjay Johny ([@san45](https://github.com/san45)), for all your work!

#### 🐛 Bug Fix

- add extra padding to nested lists in slack message [#1566](https://github.com/intuit/auto/pull/1566) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add extra padding to nested lists in slack message ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Added emojis to README.md [#1559](https://github.com/intuit/auto/pull/1559) ([@san45](https://github.com/san45))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Sanjay Johny ([@san45](https://github.com/san45))

---

# v9.54.0 (Thu Oct 01 2020)

#### 🐛 Bug Fix

- Bump node-fetch from 2.6.0 to 2.6.1 in /plugins/slack ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### 🔩 Dependency Updates

- Bump @types/jest from 26.0.10 to 26.0.13 [#1516](https://github.com/intuit/auto/pull/1516) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump node-fetch from 2.6.0 to 2.6.1 in /packages/core [#1523](https://github.com/intuit/auto/pull/1523) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- Bump node-fetch from 2.6.0 to 2.6.1 in /plugins/slack [#1524](https://github.com/intuit/auto/pull/1524) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- [@dependabot[bot]](https://github.com/dependabot[bot])

---

# v9.50.9 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- Fix label initialization [#1473](https://github.com/intuit/auto/pull/1473) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.8 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- correct behavior for lerna project with private packages [#1472](https://github.com/intuit/auto/pull/1472) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.7 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- fix default bump type [#1470](https://github.com/intuit/auto/pull/1470) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.4 (Thu Aug 13 2020)

#### 📝 Documentation

- Improve package manager plugin docs [#1465](https://github.com/intuit/auto/pull/1465) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.2 (Tue Aug 11 2020)

#### 🐛 Bug Fix

- Fix finding available canary version and add logging [#1460](https://github.com/intuit/auto/pull/1460) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump tslib from 2.0.0 to 2.0.1 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 18.0.1 to 18.0.3 [#1455](https://github.com/intuit/auto/pull/1455) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump jest from 26.2.2 to 26.3.0 [#1452](https://github.com/intuit/auto/pull/1452) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tslib from 2.0.0 to 2.0.1 [#1457](https://github.com/intuit/auto/pull/1457) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.5 (Thu Aug 06 2020)

#### 🔩 Dependency Updates

- Bump jest from 26.1.0 to 26.2.2 [#1431](https://github.com/intuit/auto/pull/1431) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v9.49.3 (Fri Jul 31 2020)

#### 🐛 Bug Fix

- Fix various rate limiting issues [#1424](https://github.com/intuit/auto/pull/1424) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.1 (Wed Jul 29 2020)

#### 🐛 Bug Fix

- don't leak GH_TOKEN in exec promise output [#1419](https://github.com/intuit/auto/pull/1419) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.47.2 (Wed Jul 22 2020)

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

# v9.41.1 (Mon Jul 06 2020)

#### 🐛 Bug Fix

- attempt to construct the GitHub graphql root API endpoint if githubApi is provided [#1349](https://github.com/intuit/auto/pull/1349) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

#### 🔩 Dependency Updates

- [Snyk] Fix for 1 vulnerabilities [#1316](https://github.com/intuit/auto/pull/1316) ([@snyk-bot](https://github.com/snyk-bot))

#### Authors: 2

- [@bnigh](https://github.com/bnigh)
- Snyk bot ([@snyk-bot](https://github.com/snyk-bot))

---

# v9.40.0 (Wed Jun 24 2020)

#### 🐛 Bug Fix

- switch to next-ignite ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump tslib from 1.11.1 to 2.0.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 📝 Documentation

- switch to next-ignite [#1293](https://github.com/intuit/auto/pull/1293) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump typescript from 3.9.3 to 3.9.5 [#1288](https://github.com/intuit/auto/pull/1288) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tslib from 1.11.1 to 2.0.0 [#1289](https://github.com/intuit/auto/pull/1289) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.39.0 (Thu Jun 04 2020)

#### 🐛 Bug Fix

- fix automated old branch creation [#1278](https://github.com/intuit/auto/pull/1278) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.36.4 (Thu May 28 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Marty Henderson ([@10hendersonm](https://github.com/10hendersonm)), for all your work!

#### 🐛 Bug Fix

- fix(git): Prevents getLastTagNotInBaseBranch from returning a commit hash [#1262](https://github.com/intuit/auto/pull/1262) ([@10hendersonm](https://github.com/10hendersonm))

#### Authors: 1

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))

---

# v9.36.3 (Thu May 28 2020)

#### 🐛 Bug Fix

- update version: 0.0.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump typescript from 3.8.3 to 3.9.3 [#1255](https://github.com/intuit/auto/pull/1255) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.36.1 (Fri May 22 2020)

#### 🐛 Bug Fix

- fix reduce without initial value [#1249](https://github.com/intuit/auto/pull/1249) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.36.0 (Fri May 22 2020)

#### 🚀 Enhancement

- Slack code blocks [#1247](https://github.com/intuit/auto/pull/1247) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- include code type as heading before code block ([@hipstersmoothie](https://github.com/hipstersmoothie))
- strip code type from slack code blocks ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.35.3 (Fri May 22 2020)

#### 🐛 Bug Fix

- Changelog formatting [#1246](https://github.com/intuit/auto/pull/1246) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Improve changelog formatting to be more compatible with pretter ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.35.2 (Fri May 22 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Kevin Wolf ([@kevinwolfdev](https://github.com/kevinwolfdev)), for all your work!

#### 🐛 Bug Fix

- Extend default labels [#1206](https://github.com/intuit/auto/pull/1206) ([@kevinwolfdev](https://github.com/kevinwolfdev) [@hipstersmoothie](https://github.com/hipstersmoothie))
- reset changelog changes ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Merge branch 'master' into extend-default-labels ([@kevinwolfdev](https://github.com/kevinwolfdev))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Kevin Wolf ([@kevinwolfdev](https://github.com/kevinwolfdev))

---

# v9.35.1 (Thu May 21 2020)

#### 🐛 Bug Fix

- fallback to tag name when the release has no name [#1243](https://github.com/intuit/auto/pull/1243) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fallback to tag name when the release has no name ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.34.0 (Tue May 19 2020)

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

- finish octokit 17 upgrade ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/rest from 16.43.1 to 17.2.1 ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 16.43.1 to 17.2.1 [#1146](https://github.com/intuit/auto/pull/1146) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 24.0.0 to 25.2.0 [#1211](https://github.com/intuit/auto/pull/1211) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- [Security] Bump handlebars from 4.5.3 to 4.7.6 [#1213](https://github.com/intuit/auto/pull/1213) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.32.1 (Fri May 15 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Till Weisser ([@whynotzoidberg](https://github.com/whynotzoidberg)), for all your work!

#### 🐛 Bug Fix

- Increase gitlog maximum buffer size to Infinity [#1212](https://github.com/intuit/auto/pull/1212) ([@whynotzoidberg](https://github.com/whynotzoidberg))

#### 🔩 Dependency Updates

- Bump fp-ts from 2.5.4 to 2.6.0 [#1209](https://github.com/intuit/auto/pull/1209) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 25.4.0 to 25.5.1 [#1208](https://github.com/intuit/auto/pull/1208) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Till Weisser ([@whynotzoidberg](https://github.com/whynotzoidberg))

---

# v9.32.0 (Mon May 11 2020)

#### 🚀 Enhancement

- Slack Plugin HTTP Proxy support [#1210](https://github.com/intuit/auto/pull/1210) ([@hborawski](https://github.com/hborawski))

#### 🐛 Bug Fix

- feat: add http proxy to slack plugin ([@hborawski](https://github.com/hborawski))

#### Authors: 1

- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v9.31.2 (Mon May 11 2020)

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

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v9.30.4 (Sat May 02 2020)

#### 🐛 Bug Fix

- Bump @types/node-fetch from 2.5.5 to 2.5.7 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

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

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v9.30.0 (Wed Apr 22 2020)

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

# v9.26.6 (Tue Apr 07 2020)

#### 🐛 Bug Fix

- Next improvements [#1135](https://github.com/intuit/auto/pull/1135) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.3 (Sat Apr 04 2020)

#### 🏠 Internal

- Turn on eslint rules that would have prevented last bug [#1112](https://github.com/intuit/auto/pull/1112) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.22.4 (Wed Apr 01 2020)

#### 🐛 Bug Fix

- use release URL from response for an accurate URL [#1096](https://github.com/intuit/auto/pull/1096) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.21.1 (Fri Mar 27 2020)

#### 🐛 Bug Fix

- Respect Updated PR Titles [#1082](https://github.com/intuit/auto/pull/1082) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.7 (Tue Mar 03 2020)

#### 🐛 Bug Fix

- add license to all sub-packages ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.3 (Mon Mar 02 2020)

#### 🐛 Bug Fix

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

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v9.15.0 (Sun Mar 01 2020)

#### 🐛 Bug Fix

- add fp and io-ts as deps ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add plugin configuration validation ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.13.1 (Mon Feb 24 2020)

#### 🐛 Bug Fix

- Bump tslib from 1.10.0 to 1.11.0

Bumps [tslib](https://github.com/Microsoft/tslib) from 1.10.0 to 1.11.0.

- [Release notes](https://github.com/Microsoft/tslib/releases)
- [Commits](https://github.com/Microsoft/tslib/compare/1.10.0...1.11.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v9.6.0 (Mon Jan 27 2020)

#### 🐛 Bug Fix

- add ability to store slack hook url in environment variable ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.5.0 (Mon Jan 27 2020)

#### 🐛 Bug Fix

- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Overhaul "auto init" experience + make it pluggable ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.8.0 (Thu Jan 02 2020)

#### 🐛 Bug Fix

- test: added a test to assure prerelease branches don't trigger a slack ([@Aghassi](https://github.com/Aghassi))
- refactor: ensure the fetch call is never made ([@Aghassi](https://github.com/Aghassi))
- refactor: fixed incorrect logic for prerelease check ([@Aghassi](https://github.com/Aghassi))
- refactor: removed unecessary console logs ([@Aghassi](https://github.com/Aghassi))
- test: added tests for when publishPreRelease is set ([@Aghassi](https://github.com/Aghassi))
- docs: updated slack plugin docs on publishPreRelease usage ([@Aghassi](https://github.com/Aghassi))
- fix: prevent slack from default publishing on prerelease branches ([@Aghassi](https://github.com/Aghassi))
- refactor: removed ternary per @hipstersmoothie feedback

Co-Authored-By: Andrew Lisowski <lisowski54@gmail.com> ([@Aghassi](https://github.com/Aghassi))

#### Authors: 1

- David ([@Aghassi](https://github.com/Aghassi))

---

# v8.6.0 (Tue Dec 17 2019)

#### 🐛 Bug Fix

- Bump version to: v8.5.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.5.0 (Tue Dec 17 2019)

#### 🐛 Bug Fix

- Bump version to: v8.4.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.3.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.2.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.0.0 (Wed Dec 11 2019)

#### 🐛 Bug Fix

- Bump version to: v8.0.0-next.4 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- do not call afterRelease hooks during dry run ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.8 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.7 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- change skip-release releaseType to just skip ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add none release type ([@hipstersmoothie](https://github.com/hipstersmoothie))
- get label refactor working ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.6 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.5 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- reset versions ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- allow user to configure what branches are treated as prerelease branches ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
