# v11.0.7 (Thu Feb 22 2024)

:tada: This release contains work from a new contributor! :tada:

Thank you, Atte Huhtakangas ([@jazmon](https://github.com/jazmon)), for all your work!

#### 🐛 Bug Fix

- fix(npm): mark releases as latest with lerna [#2414](https://github.com/intuit/auto/pull/2414) ([@jazmon](https://github.com/jazmon))
- fix(npm): don't mark release as latest if in old version branch ([@jazmon](https://github.com/jazmon))
- fix(npm): mark releases as latest with lerna ([@jazmon](https://github.com/jazmon))

#### Authors: 1

- Atte Huhtakangas ([@jazmon](https://github.com/jazmon))

---

# v11.0.6 (Thu Feb 22 2024)

#### 🐛 Bug Fix

- NPM: Fix lerna version erroring with unknown registry arg [#2421](https://github.com/intuit/auto/pull/2421) ([@jackw](https://github.com/jackw))
- fix(npm): prevent lerna version erroring with unknown registry arg ([@jackw](https://github.com/jackw))

#### Authors: 1

- Jack Westbrook ([@jackw](https://github.com/jackw))

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

# v10.44.0 (Mon Apr 03 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, David Sheldrick ([@ds300](https://github.com/ds300)), for all your work!

#### 🚀 Enhancement

- add useVersion support to npm changelog [#2347](https://github.com/intuit/auto/pull/2347) ([@ds300](https://github.com/ds300))

#### 🐛 Bug Fix

- add useVersion support to npm changelog ([@ds300](https://github.com/ds300))

#### Authors: 1

- David Sheldrick ([@ds300](https://github.com/ds300))

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

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Dave Pringle ([@UncleDave](https://github.com/UncleDave))

:heart: Jason T Brown ([@vpipkt](https://github.com/vpipkt))

#### 🚀 Enhancement

- feat(npm): use version commit message from lerna.json [#2277](https://github.com/intuit/auto/pull/2277) ([@UncleDave](https://github.com/UncleDave))
- non-zero exit code if commit is behind [#2189](https://github.com/intuit/auto/pull/2189) ([@vpipkt](https://github.com/vpipkt))

#### 🐛 Bug Fix

- feat(npm): use version commit message from lerna.json ([@UncleDave](https://github.com/UncleDave))

#### 🏠 Internal

- run actions on PRs [#2318](https://github.com/intuit/auto/pull/2318) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Dave Pringle ([@UncleDave](https://github.com/UncleDave))
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

# v10.37.1 (Thu May 26 2022)

:tada: This release contains work from a new contributor! :tada:

Thank you, Anton Karpov ([@karpoff](https://github.com/karpoff)), for all your work!

#### 🐛 Bug Fix

- #2141: add missed --no-verify-access for lerna publish [#2205](https://github.com/intuit/auto/pull/2205) ([@karpoff](https://github.com/karpoff))
- #2141: add missed --no-verify-access for lerna publish ([@karpoff](https://github.com/karpoff))

#### Authors: 1

- Anton Karpov ([@karpoff](https://github.com/karpoff))

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
- fix object to array deprecation warning ([@hipstersmoothie](https://github.com/hipstersmoothie))
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

# v10.35.1 (Sun Mar 20 2022)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

:heart: Valentin Hervieu ([@ValentinH](https://github.com/ValentinH))

#### 🐛 Bug Fix

- fix(npm): remove quote in commit message for standalone packages [#2165](https://github.com/intuit/auto/pull/2165) ([@jBouyoud](https://github.com/jBouyoud))
- fix(npm): remove quote in commit message for standalone packages ([@jBouyoud](https://github.com/jBouyoud))
- docs: fix publishFolder example ([@ValentinH](https://github.com/ValentinH))

#### 📝 Documentation

- docs: add react-easy-crop to "Projects Using auto" [#2162](https://github.com/intuit/auto/pull/2162) ([@ValentinH](https://github.com/ValentinH))
- docs: fix publishFolder example [#2161](https://github.com/intuit/auto/pull/2161) ([@ValentinH](https://github.com/ValentinH))

#### Authors: 2

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))
- Valentin Hervieu ([@ValentinH](https://github.com/ValentinH))

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
- feat(plugins/npm): add support for passing publishFolder. ([@kclarkey](https://github.com/kclarkey))
- test(plugins/npm): test public pre-releases cannot be greater than local version ([@hydrosquall](https://github.com/hydrosquall))
- feat(plugins/npm): exclude pre-release branches from greaterRelease calculation ([@hydrosquall](https://github.com/hydrosquall))

#### Authors: 3

- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))
- Dalton Scharff ([@daltonscharff](https://github.com/daltonscharff))
- Ken Clarke ([@kclarkey](https://github.com/kclarkey))

---

# v10.32.2 (Tue Oct 26 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Lucas Shadler ([@sumwatshade](https://github.com/sumwatshade)), for all your work!

#### 🐛 Bug Fix

- fix: get latest maintenance major tag from github releases [#2076](https://github.com/intuit/auto/pull/2076) (lucas_shadler@intuit.com [@sumwatshade](https://github.com/sumwatshade))
- test: add unit test for maintenance npm calc (lucas_shadler@intuit.com)
- fix: pull logic to top apply level (lucas_shadler@intuit.com)
- fix: check if maintenance version (lucas_shadler@intuit.com)
- fix: check what is passed to changelog render (lucas_shadler@intuit.com)
- fix: verbose logging on commit details (lucas_shadler@intuit.com)

#### Authors: 2

- lshadler (lucas_shadler@intuit.com)
- Lucas Shadler ([@sumwatshade](https://github.com/sumwatshade))

---

# v10.32.0 (Wed Sep 15 2021)

#### 🚀 Enhancement

- Support --use-version argument with shipit [#2075](https://github.com/intuit/auto/pull/2075) ([@kelyvin](https://github.com/kelyvin))

#### 🐛 Bug Fix

- properly leverage useVersion parameter in npm hook and fix tests ([@kelyvin](https://github.com/kelyvin))

#### Authors: 1

- Kelvin Nguyen ([@kelyvin](https://github.com/kelyvin))

---

# v10.31.0 (Thu Aug 12 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Cameron Yick ([@hydrosquall](https://github.com/hydrosquall)), for all your work!

#### 🚀 Enhancement

- feat(plugins/npm): permit lerna publish to use automation tokens [#2032](https://github.com/intuit/auto/pull/2032) ([@hydrosquall](https://github.com/hydrosquall))

#### 🐛 Bug Fix

- Upgrade to GitHub-native Dependabot [#1970](https://github.com/intuit/auto/pull/1970) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- doc(plugins/npm): remove manual instructions for working with 2FA automation tokens ([@hydrosquall](https://github.com/hydrosquall))
- fix: update npx publish CLI flag tests ([@hydrosquall](https://github.com/hydrosquall))
- feat: permit lerna publish to use automation tokens ([@hydrosquall](https://github.com/hydrosquall))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))

---

# v10.30.0 (Thu Jul 22 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Cameron Yick ([@hydrosquall](https://github.com/hydrosquall)), for all your work!

#### 🚀 Enhancement

- feat(plugins/npm): exclude prelease versions when calculating monorepo project version [#2035](https://github.com/intuit/auto/pull/2035) ([@hydrosquall](https://github.com/hydrosquall))

#### 🐛 Bug Fix

- feat(plugins/npm): exclude prelease versions when calculating monorepo project version ([@hydrosquall](https://github.com/hydrosquall))

#### Authors: 1

- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))

---

# v10.29.3 (Tue Jun 08 2021)

#### 🐛 Bug Fix

- Revert #1997 [#2010](https://github.com/intuit/auto/pull/2010) (praxis@target.com [@10hendersonm](https://github.com/10hendersonm))
- fix(npm): Prevents canary releases with double dashed version numbers [#1997](https://github.com/intuit/auto/pull/1997) ([@10hendersonm](https://github.com/10hendersonm))

#### Authors: 2

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))
- Vela CI (praxis@target.com)

---

# v10.29.1 (Tue May 25 2021)

#### 🐛 Bug Fix

- fix(npm): Prevents canary releases with double dashed version numbers [#1997](https://github.com/intuit/auto/pull/1997) ([@10hendersonm](https://github.com/10hendersonm))
- fix(npm): Prevents canary releases with double dashed version numbers ([@10hendersonm](https://github.com/10hendersonm))

#### Authors: 1

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))

---

# v10.29.0 (Fri May 21 2021)

#### 🚀 Enhancement

- Feature/msteams [#1914](https://github.com/intuit/auto/pull/1914) ([@vincentbriglia](https://github.com/vincentbriglia) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
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

# v10.24.3 (Thu Apr 08 2021)

#### 🐛 Bug Fix

- Prefer npx over yarn for running lerna commands [#1936](https://github.com/intuit/auto/pull/1936) ([@zephraph](https://github.com/zephraph))
- Fix tests referencing yarn ([@zephraph](https://github.com/zephraph))
- Prefer npx over yarn for running lerna commands ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

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
- Bump await-to-js from 2.1.1 to 3.0.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

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
- trigger npmrc validation ([@hipstersmoothie](https://github.com/hipstersmoothie))
- better error message for no NPM_token in CI ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.20.1 (Sun Mar 14 2021)

#### 🐛 Bug Fix

- only ts-node/register for plugins if typescript is installed to the project [#1877](https://github.com/intuit/auto/pull/1877) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.7 (Thu Mar 11 2021)

#### 🐛 Bug Fix

- don't include private packages in canary install list [#1866](https://github.com/intuit/auto/pull/1866) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- don't include private packages in canary install list ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.6 (Thu Mar 11 2021)

#### 🐛 Bug Fix

- wrap canary identifier in quotes so terminal understands it's an argument to the --preid flag [#1864](https://github.com/intuit/auto/pull/1864) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lerna independent canary preid ([@hipstersmoothie](https://github.com/hipstersmoothie))
- wrap canary identifier in quotes so terminal understands it's an argument to the --preid flag ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- improve GitHub actions docs + remove unnecessary warning [#1828](https://github.com/intuit/auto/pull/1828) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Add note about verifyAccess config ([@zephraph](https://github.com/zephraph))
- improve GitHub actions docs + remove unnecessary warning ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Fix lint error ([@zephraph](https://github.com/zephraph))
- Use mock-fs for npm tests ([@zephraph](https://github.com/zephraph))

#### 🏠 Internal

- Use mock-fs for npm tests [#1827](https://github.com/intuit/auto/pull/1827) ([@zephraph](https://github.com/zephraph))

#### 📝 Documentation

- Add note about verifyAccess config [#1829](https://github.com/intuit/auto/pull/1829) ([@zephraph](https://github.com/zephraph))

#### 🔩 Dependency Updates

- Bump aws-cli-js from 2.0.6 to 2.1.0 [#1808](https://github.com/intuit/auto/pull/1808) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.9.3 to 2.9.5 [#1810](https://github.com/intuit/auto/pull/1810) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v10.16.7 (Sat Feb 20 2021)

#### 🐛 Bug Fix

- fix lerna independent commit message [#1819](https://github.com/intuit/auto/pull/1819) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lerna independent commit message ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

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

# v10.13.3 (Thu Jan 28 2021)

#### 🐛 Bug Fix

- fix commit message when using npx in non-monorepo [#1762](https://github.com/intuit/auto/pull/1762) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix commit message when using npx in non-monorepo ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.13.2 (Mon Jan 25 2021)

#### 🐛 Bug Fix

- fix commit message when using npx [#1752](https://github.com/intuit/auto/pull/1752) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix commit message when using npx ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.13.1 (Mon Jan 25 2021)

#### 🐛 Bug Fix

- format commit message [#1751](https://github.com/intuit/auto/pull/1751) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- format commit message ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.13.0 (Mon Jan 25 2021)

#### 🚀 Enhancement

- Add `@auto-it/magic-zero` Plugin [#1701](https://github.com/intuit/auto/pull/1701) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- make modifyConfig async ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v10.11.0 (Tue Jan 19 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Seth Thomas ([@sethomas](https://github.com/sethomas)), for all your work!

#### 🚀 Enhancement

- Properly setting env var _auth for legacyAuth case for npm publish [#1735](https://github.com/intuit/auto/pull/1735) ([@sethomas](https://github.com/sethomas))

#### 🐛 Bug Fix

- Properly setting env var _auth for legacyAuth case for npm publish fixes #1734 ([@sethomas](https://github.com/sethomas))

#### 🔩 Dependency Updates

- Bump @types/prettier from 2.1.5 to 2.1.6 [#1730](https://github.com/intuit/auto/pull/1730) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/conventional-commits-parser from 3.0.0 to 3.0.1 [#1708](https://github.com/intuit/auto/pull/1708) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/twitter-text from 2.0.0 to 3.1.0 [#1709](https://github.com/intuit/auto/pull/1709) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 30.7.8 to 31.0.3 [#1715](https://github.com/intuit/auto/pull/1715) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-prettier from 3.3.0 to 3.3.1 [#1727](https://github.com/intuit/auto/pull/1727) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 26.0.14 to 26.0.20 [#1728](https://github.com/intuit/auto/pull/1728) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.11.1 to 4.13.0 [#1729](https://github.com/intuit/auto/pull/1729) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.8.2 to 4.13.0 [#1731](https://github.com/intuit/auto/pull/1731) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Seth Thomas ([@sethomas](https://github.com/sethomas))

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
- fix npm plugin git tag splitting ([@AndrewLeedham](https://github.com/AndrewLeedham))

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

- fix and add tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- factor out package.json utils into a package ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

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

# v10.2.2 (Wed Nov 04 2020)

#### 🐛 Bug Fix

- handle multiple spaces in "lerna changed" output [#1633](https://github.com/intuit/auto/pull/1633) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- handle multiple spaces in "lerna changed" output ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.1 (Tue Nov 03 2020)

#### 🐛 Bug Fix

- NPM: independent next releases update dependency versions [#1631](https://github.com/intuit/auto/pull/1631) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- NPM: independent next releases update dependency versions ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.0 (Mon Nov 02 2020)

#### 🚀 Enhancement

- add "commitNextVersion" option to NPM plugin [#1630](https://github.com/intuit/auto/pull/1630) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add "commitNextVersion" option to NPM plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

#### 🐛 Bug Fix

- Git reset bugs on canary/next [#1618](https://github.com/intuit/auto/pull/1618) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- npm single package next dry-run: don't run "npm version" + git reset ([@hipstersmoothie](https://github.com/hipstersmoothie))
- simplify hook APIs for easier future extensibility ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- correct renderChangelogLine hook usage ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add quiet functionality to version hook ([@hipstersmoothie](https://github.com/hipstersmoothie))
- call version and afterVersion hook during dryRun ([@hipstersmoothie](https://github.com/hipstersmoothie))
- improve npm lerna independent makeRelease dry run ([@hipstersmoothie](https://github.com/hipstersmoothie))
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

#### 🐛 Bug Fix

- group monorepo changelog lines ([@hipstersmoothie](https://github.com/hipstersmoothie))

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
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- respect registry set in lerna publish command [#1519](https://github.com/intuit/auto/pull/1519) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- respect registry set in lerna publish command ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Richard Simpson ([@RichiCoder1](https://github.com/RichiCoder1))

---

# v9.52.0 (Fri Aug 21 2020)

#### 🚀 Enhancement

- expose option to disable monorepo package aware changelog [#1489](https://github.com/intuit/auto/pull/1489) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- render monorepoChangelog by default ([@hipstersmoothie](https://github.com/hipstersmoothie))
- expose option to disable monorepo package aware changelog ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

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
- add test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- correct behavior for lerna project with private packages ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

#### 🐛 Bug Fix

- correct enterprise upload assets baseUrl [#1466](https://github.com/intuit/auto/pull/1466) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add not about a private package in a monorepo ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add note in each package manager plugin that it should not be used with other package manager plugins ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Improve package manager plugin docs [#1465](https://github.com/intuit/auto/pull/1465) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.2 (Tue Aug 11 2020)

#### 🐛 Bug Fix

- Fix finding available canary version and add logging [#1460](https://github.com/intuit/auto/pull/1460) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Fix finding available canary version and add logging ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump tslib from 2.0.0 to 2.0.1 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 18.0.1 to 18.0.3 [#1455](https://github.com/intuit/auto/pull/1455) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump jest from 26.2.2 to 26.3.0 [#1452](https://github.com/intuit/auto/pull/1452) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tslib from 2.0.0 to 2.0.1 [#1457](https://github.com/intuit/auto/pull/1457) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.6 (Fri Aug 07 2020)

#### 🐛 Bug Fix

- Fix Independent `next` versioning [#1445](https://github.com/intuit/auto/pull/1445) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- match full package name in tag ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.5 (Thu Aug 06 2020)

#### 🐛 Bug Fix

- upgrade eslint + ensure all imported packages are in package.json [#1442](https://github.com/intuit/auto/pull/1442) ([@hipstersmoothie](https://github.com/hipstersmoothie))
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
- implement a lerna-like versioning function for independent next releases. Allows us more control of how the repo gets versioned ([@hipstersmoothie](https://github.com/hipstersmoothie))
- always create release ([@hipstersmoothie](https://github.com/hipstersmoothie))
- keep tags annotated while moving ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.3 (Fri Jul 31 2020)

#### 🐛 Bug Fix

- Fix various rate limiting issues [#1424](https://github.com/intuit/auto/pull/1424) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.2 (Fri Jul 31 2020)

#### 🐛 Bug Fix

- don't prefix tags in lerna independent mode [#1427](https://github.com/intuit/auto/pull/1427) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- don't prefix tags in lerna independent mode ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add note to npm readme ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add docs about running lengthy builds during publish [#1420](https://github.com/intuit/auto/pull/1420) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- update ignite [#1421](https://github.com/intuit/auto/pull/1421) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.1 (Wed Jul 29 2020)

#### 🐛 Bug Fix

- don't leak GH_TOKEN in exec promise output [#1419](https://github.com/intuit/auto/pull/1419) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.48.3 (Wed Jul 29 2020)

#### 🐛 Bug Fix

- respect registry set at top level for lerna [#1412](https://github.com/intuit/auto/pull/1412) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- respect registry set at top level ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.48.0 (Thu Jul 23 2020)

#### 🚀 Enhancement

- skip publish for private npm packages [#1397](https://github.com/intuit/auto/pull/1397) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- don't set token for private single npm packages ([@hipstersmoothie](https://github.com/hipstersmoothie))
- private packages dont need npm token ([@hipstersmoothie](https://github.com/hipstersmoothie))
- skip publish for private npm pacakges ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v9.46.0 (Tue Jul 14 2020)

#### 🚀 Enhancement

- push prerelease branch in addition to tags [#1382](https://github.com/intuit/auto/pull/1382) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- update tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- push prerelease branch in addition to tags ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

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

# v9.43.0 (Tue Jul 07 2020)

#### 🚀 Enhancement

- npm: find available canary version [#1361](https://github.com/intuit/auto/pull/1361) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- find available canary version ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

#### 🔩 Dependency Updates

- Bump @octokit/plugin-retry from 3.0.1 to 3.0.3 [#1304](https://github.com/intuit/auto/pull/1304) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-throttling from 3.2.1 to 3.2.2 [#1309](https://github.com/intuit/auto/pull/1309) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 25.4.2 to 27.0.7 [#1311](https://github.com/intuit/auto/pull/1311) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.2.6 to 10.2.11 [#1314](https://github.com/intuit/auto/pull/1314) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump all-contributors-cli from 6.15.0 to 6.16.0 [#1306](https://github.com/intuit/auto/pull/1306) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump type-fest from 0.15.0 to 0.15.1 [#1307](https://github.com/intuit/auto/pull/1307) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump chalk from 4.0.0 to 4.1.0 [#1310](https://github.com/intuit/auto/pull/1310) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-prettier from 3.1.3 to 3.1.4 [#1305](https://github.com/intuit/auto/pull/1305) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

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

# v9.38.0 (Sun May 31 2020)

#### 🚀 Enhancement

- add legacyAuth option [#1268](https://github.com/intuit/auto/pull/1268) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add legacy-auth option ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.37.0 (Fri May 29 2020)

#### 🚀 Enhancement

- add more contextual information to next hook [#1265](https://github.com/intuit/auto/pull/1265) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- really fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump typescript from 3.8.3 to 3.9.3 [#1255](https://github.com/intuit/auto/pull/1255) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.36.1 (Fri May 22 2020)

#### 🐛 Bug Fix

- fix reduce without initial value [#1249](https://github.com/intuit/auto/pull/1249) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix npm test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix reduce without initial value ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- reset changelog changes ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Merge branch 'master' into extend-default-labels ([@kevinwolfdev](https://github.com/kevinwolfdev))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Kevin Wolf ([@kevinwolfdev](https://github.com/kevinwolfdev))

---

# v9.34.1 (Tue May 19 2020)

#### 🐛 Bug Fix

- sub-package changelogs: Handle when no changes made to monorepo packages [#1236](https://github.com/intuit/auto/pull/1236) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- sub-package changelogs: Handle when no changes made to monorepo packages ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

#### 🔩 Dependency Updates

- Bump @octokit/rest from 16.43.1 to 17.2.1 [#1146](https://github.com/intuit/auto/pull/1146) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 24.0.0 to 25.2.0 [#1211](https://github.com/intuit/auto/pull/1211) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- [Security] Bump handlebars from 4.5.3 to 4.7.6 [#1213](https://github.com/intuit/auto/pull/1213) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.32.3 (Fri May 15 2020)

#### 🐛 Bug Fix

- only create sub-package changelogs for `lerna changed` packages [#1216](https://github.com/intuit/auto/pull/1216) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- only create sub-package changelogs for `lerna changed` pacakges ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.32.2 (Fri May 15 2020)

#### 🐛 Bug Fix

- pass exact flag to publish too [#1215](https://github.com/intuit/auto/pull/1215) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- pass exact flag to publish too ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

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

# v9.31.2 (Mon May 11 2020)

#### 🐛 Bug Fix

- fix(docs): mention correct key within forcePublish ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

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

#### 📝 Documentation

- fix(docs): mention correct key within forcePublish [#1205](https://github.com/intuit/auto/pull/1205) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Brian Muenzenmeyer ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

---

# v9.31.1 (Mon May 04 2020)

#### 🐛 Bug Fix

- Add log when exiting early on independent lerna projects [#1194](https://github.com/intuit/auto/pull/1194) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Add log when exiting early on independent lerna projects ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.30.4 (Sat May 02 2020)

#### 🐛 Bug Fix

- fix npm canary release w/o any tags [#1188](https://github.com/intuit/auto/pull/1188) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix npm canary release w/o any tags ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v9.30.2 (Sat Apr 25 2020)

#### 🐛 Bug Fix

- --silent is not a lerna flag [#1174](https://github.com/intuit/auto/pull/1174) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- --silent is not a lerna flag ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v9.29.0 (Tue Apr 21 2020)

#### 🚀 Enhancement

- set noVersionPrefix if tagVersionPrefix is set [#1170](https://github.com/intuit/auto/pull/1170) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- set noVersionPrefix if tagVersionPrefix is set ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.28.3 (Mon Apr 20 2020)

#### 🐛 Bug Fix

- fix quiet flag in npm plugin. was always on [#1161](https://github.com/intuit/auto/pull/1161) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix quiet flag in npm plugin. was always on ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.28.2 (Mon Apr 20 2020)

#### 🐛 Bug Fix

- bug in silent flag [#1160](https://github.com/intuit/auto/pull/1160) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- bug in silent flag ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.28.0 (Fri Apr 17 2020)

#### 🚀 Enhancement

- Add --quiet flag [#1155](https://github.com/intuit/auto/pull/1155) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- better -dq logs for canary and next ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add quiet flag ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.7 (Tue Apr 07 2020)

#### 🐛 Bug Fix

- Skip next commit hooks [#1136](https://github.com/intuit/auto/pull/1136) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- dont run commit hooks when publishing next ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.6 (Tue Apr 07 2020)

#### 🐛 Bug Fix

- Next improvements [#1135](https://github.com/intuit/auto/pull/1135) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.2 (Fri Apr 03 2020)

#### 🐛 Bug Fix

- Changelog bugs [#1111](https://github.com/intuit/auto/pull/1111) ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- add test and don't display non-canary packages in comment ([@hipstersmoothie](https://github.com/hipstersmoothie))
- don't force publish canary/next for independent lerna projects ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump tslib from 1.11.0 to 1.11.1

Bumps [tslib](https://github.com/Microsoft/tslib) from 1.11.0 to 1.11.1.

- [Release notes](https://github.com/Microsoft/tslib/releases)
- [Commits](https://github.com/Microsoft/tslib/compare/1.11.0...1.11.1)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.0 (Sun Mar 01 2020)

#### 🐛 Bug Fix

- update plugin and autorc docs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add fp and io-ts as deps ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix old tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
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

# v9.13.0 (Sat Feb 22 2020)

#### 🐛 Bug Fix

- When parsing owner/repo fallback to parsing 'origin' ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.12.1 (Sat Feb 22 2020)

#### 🐛 Bug Fix

- add warning about using npm plugin with noVersionPrefix ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.12.0 (Fri Feb 21 2020)

#### 🐛 Bug Fix

- ensure remote can be pushed to ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.6 (Mon Feb 17 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]), for all your work!

#### 🐛 Bug Fix

- Bump @types/semver from 6.2.0 to 7.1.0

Bumps [@types/semver](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/semver) from 6.2.0 to 7.1.0.

- [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- [Commits](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/HEAD/types/semver)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v9.10.5 (Thu Feb 13 2020)

#### 🐛 Bug Fix

- fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.1 (Thu Feb 06 2020)

#### 🐛 Bug Fix

- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- must create an annotated tag for it to be pushed with --follow-tags ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.9.1 (Tue Feb 04 2020)

#### 🐛 Bug Fix

- dont run git hooks when commiting the version for a single npm package ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.8.2 (Thu Jan 30 2020)

#### 🐛 Bug Fix

- fix test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add fallback to get lerna json ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.8.0 (Mon Jan 27 2020)

#### 🐛 Bug Fix

- add test ([@hipstersmoothie](https://github.com/hipstersmoothie))
- make unique GitHub releases for each package published in lerna independent monorepo ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.7.0 (Mon Jan 27 2020)

#### 🐛 Bug Fix

- use different version commit message for independent projects ([@hipstersmoothie](https://github.com/hipstersmoothie))
- abort release if lerna reports no unchanged packages ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.5.0 (Mon Jan 27 2020)

#### 🐛 Bug Fix

- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add next steps ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Overhaul "auto init" experience + make it pluggable ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.4.0 (Sat Jan 25 2020)

#### 🐛 Bug Fix

- clearer sentence ([@hipstersmoothie](https://github.com/hipstersmoothie))
- more emoji === better ([@hipstersmoothie](https://github.com/hipstersmoothie))
- include version for canary scope ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Add html details option to canary hook + Use in npm plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.3.2 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- do not include private packages in previous version calculation ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.3.0 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- add docs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add ability to publish exact versions in monorepo ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.2.0 (Thu Jan 23 2020)

#### 🐛 Bug Fix

- Add ability to manage sub-package contributor lists ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.3 (Thu Jan 23 2020)

#### 🐛 Bug Fix

- ensure promises are executed sequentially ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.0.0 (Mon Jan 13 2020)

#### 🐛 Bug Fix

- match npm behavior for scoped packages ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump env-ci from 4.5.2 to 5.0.1

Bumps [env-ci](https://github.com/pvdlg/env-ci) from 4.5.2 to 5.0.1.

- [Release notes](https://github.com/pvdlg/env-ci/releases)
- [Commits](https://github.com/pvdlg/env-ci/compare/v4.5.2...v5.0.1)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.7.1 (Thu Dec 19 2019)

#### 🐛 Bug Fix

- add debug info ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.3 (Thu Dec 19 2019)

#### 🐛 Bug Fix

- determine next version using by omitting tags from master ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.0 (Tue Dec 17 2019)

#### 🐛 Bug Fix

- Bump version to: v8.5.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- publish to specific tag ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add ability to manage version branches ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.5.0 (Tue Dec 17 2019)

#### 🐛 Bug Fix

- publish to specific tag ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove docs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.4.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.3.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- release: detect prerelease branch + be smarter about commit range ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add ability to manage version branches ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.2.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests? ([@hipstersmoothie](https://github.com/hipstersmoothie))
- alias the canary scope

use alias we define ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v8.4.1 (Mon Dec 16 2019)

#### 🐛 Bug Fix

- alias the canary scope

use alias we define ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.3.0 (Mon Dec 16 2019)

#### 🐛 Bug Fix

- release: detect prerelease branch + be smarter about commit range ([@hipstersmoothie](https://github.com/hipstersmoothie))
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

# v8.1.3 (Sat Dec 14 2019)

#### 🐛 Bug Fix

- fix tests? ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.1 (Sat Dec 14 2019)

#### 🐛 Bug Fix

- remove docs ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.0 (Sat Dec 14 2019)

#### 🐛 Bug Fix

- clean up docs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix message bugs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- write to correct file ([@hipstersmoothie](https://github.com/hipstersmoothie))
- correct paths ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add create user step ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add canaryScope option ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.0.0 (Wed Dec 11 2019)

#### 🐛 Bug Fix

- move determineNextVersion to core ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix sub-pacakge changelogs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- only need to push tags during prerelease ([@hipstersmoothie](https://github.com/hipstersmoothie))
- account for detatched head ([@hipstersmoothie](https://github.com/hipstersmoothie))
- use preid correctly ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix canary calcs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- better monorepo canary version ([@hipstersmoothie](https://github.com/hipstersmoothie))
- do not commit prerelease versions ([@hipstersmoothie](https://github.com/hipstersmoothie))
- reset versions ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.8 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.7 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- move to top level util for ease of testing ([@hipstersmoothie](https://github.com/hipstersmoothie))
- get label refactor working ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.6 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix undefined in changelogs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- move git clean check to core ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.5 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix canary reporting ([@hipstersmoothie](https://github.com/hipstersmoothie))
- ensure canary versions dont use extra bumps ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.4 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- change getPreviousVersion hook args. can access prefixRelease from root class instead ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- shipit: add flag to only publish to 'latest' tag when "release" label is present ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- allow user to configure what branches are treated as prerelease branches ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- get next branch release working ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
