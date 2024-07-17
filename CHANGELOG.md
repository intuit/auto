# v11.2.0 (Wed Jul 17 2024)

:tada: This release contains work from a new contributor! :tada:

Thank you, Martin Elias ([@LittleGreenYoda42](https://github.com/LittleGreenYoda42)), for all your work!

#### 🚀 Enhancement

- `@auto-it/version-file`
  - [Version File] Remove assumption that canary and next should be snapshots [#2467](https://github.com/intuit/auto/pull/2467) ([@sugarmanz](https://github.com/sugarmanz))

#### 🐛 Bug Fix

- `@auto-it/slack`
  - fix: handling of long strings in slack plugin [#2464](https://github.com/intuit/auto/pull/2464) ([@LittleGreenYoda42](https://github.com/LittleGreenYoda42))

#### Authors: 2

- Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz))
- Martin Elias ([@LittleGreenYoda42](https://github.com/LittleGreenYoda42))

---

# v11.1.6 (Thu Apr 04 2024)

#### ⚠️ Pushed to `main`

- `@auto-it/slack`
  - improve long slack message chunking by chunking at newlines ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v11.1.5 (Thu Apr 04 2024)

#### 🐛 Bug Fix

- `@auto-it/slack`
  - fix chunking large changelogs [#2453](https://github.com/intuit/auto/pull/2453) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v11.1.4 (Thu Apr 04 2024)

#### 🐛 Bug Fix

- `@auto-it/upload-assets`
  - Fix uploading conflicting canary assets [#2451](https://github.com/intuit/auto/pull/2451) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v11.1.3 (Wed Apr 03 2024)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix rare issue with canary id from git sha [#2448](https://github.com/intuit/auto/pull/2448) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))

#### Authors: 1

- [@MichaelRyanWebber](https://github.com/MichaelRyanWebber)

---

# v11.1.2 (Wed Mar 20 2024)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - fix: remove extra quotes surrounding commitMessage [#2445](https://github.com/intuit/auto/pull/2445) ([@UpstartMPotnick](https://github.com/UpstartMPotnick))

#### Authors: 1

- Mark Potnick ([@UpstartMPotnick](https://github.com/UpstartMPotnick))

---

# v11.1.1 (Sat Feb 24 2024)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix: next version calculation for tags that contain a name/prefix [#2436](https://github.com/intuit/auto/pull/2436) ([@restfulhead](https://github.com/restfulhead))

#### 📝 Documentation

- `@auto-it/gh-pages`
  - Update index.ts [#2437](https://github.com/intuit/auto/pull/2437) ([@eltociear](https://github.com/eltociear))

#### Authors: 2

- Ikko Eltociear Ashimine ([@eltociear](https://github.com/eltociear))
- Patrick Ruhkopf ([@restfulhead](https://github.com/restfulhead))

---

# v11.1.0 (Fri Feb 23 2024)

#### 🚀 Enhancement

- `@auto-it/core`
  - [Feature Request] Allow opting out of ts-node [#2420](https://github.com/intuit/auto/pull/2420) ([@ds300](https://github.com/ds300))

#### Authors: 1

- David Sheldrick ([@ds300](https://github.com/ds300))

---

# v11.0.7 (Thu Feb 22 2024)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - fix(npm): mark releases as latest with lerna [#2414](https://github.com/intuit/auto/pull/2414) ([@jazmon](https://github.com/jazmon))

#### Authors: 1

- Atte Huhtakangas ([@jazmon](https://github.com/jazmon))

---

# v11.0.6 (Thu Feb 22 2024)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - NPM: Fix lerna version erroring with unknown registry arg [#2421](https://github.com/intuit/auto/pull/2421) ([@jackw](https://github.com/jackw))

#### Authors: 1

- Jack Westbrook ([@jackw](https://github.com/jackw))

---

# v11.0.5 (Thu Feb 22 2024)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Niccolò Olivieri Achille ([@NiccoloOlivieriAchille](https://github.com/NiccoloOlivieriAchille))

:heart: Niccolò Olivieri Achille ([@Zweer](https://github.com/Zweer))

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fixing git `2.43.0` max number issue #2425 [#2426](https://github.com/intuit/auto/pull/2426) ([@NiccoloOlivieriAchille](https://github.com/NiccoloOlivieriAchille))

#### 🔩 Dependency Updates

- `@auto-it/sbt`
  - Bump strip-ansi from 6.0.0 to 7.0.1 [#2307](https://github.com/intuit/auto/pull/2307) ([@dependabot[bot]](https://github.com/dependabot[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 3

- [@dependabot[bot]](https://github.com/dependabot[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Niccolò Olivieri Achille ([@NiccoloOlivieriAchille](https://github.com/NiccoloOlivieriAchille))

---

# v11.0.4 (Sun Sep 10 2023)

#### 🐛 Bug Fix

- `@auto-it/pr-body-labels`
  - only remove labels if they exist on the PR [#2396](https://github.com/intuit/auto/pull/2396) ([@hborawski](https://github.com/hborawski))

#### Authors: 1

- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v11.0.2 (Sun Sep 10 2023)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix value type [#2397](https://github.com/intuit/auto/pull/2397) ([@hipstersmoothie](https://github.com/hipstersmoothie))
  - Fix release creation on oldVersions [#2391](https://github.com/intuit/auto/pull/2391) ([@jBouyoud](https://github.com/jBouyoud))
  - fix(core): fix configuration extends overrides order [#2387](https://github.com/intuit/auto/pull/2387) ([@jBouyoud](https://github.com/jBouyoud))
  - fix: allow pr check on old version branches [#2388](https://github.com/intuit/auto/pull/2388) ([@jBouyoud](https://github.com/jBouyoud))
- `@auto-it/protected-branch`
  - fix: open release PR on current branch instead of base [#2389](https://github.com/intuit/auto/pull/2389) ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v11.0.2 (Wed Sep 06 2023)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix release creation on oldVersions [#2391](https://github.com/intuit/auto/pull/2391) ([@jBouyoud](https://github.com/jBouyoud))
  - fix(core): fix configuration extends overrides order [#2387](https://github.com/intuit/auto/pull/2387) ([@jBouyoud](https://github.com/jBouyoud))
  - fix: allow pr check on old version branches [#2388](https://github.com/intuit/auto/pull/2388) ([@jBouyoud](https://github.com/jBouyoud))
- `@auto-it/protected-branch`
  - fix: open release PR on current branch instead of base [#2389](https://github.com/intuit/auto/pull/2389) ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 1

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v11.0.1 (Thu Aug 10 2023)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Paul Aldrich ([@aldrichdev](https://github.com/aldrichdev))

:heart: Satish Pokala ([@Satishpokala124](https://github.com/Satishpokala124))

#### 🐛 Bug Fix

- `@auto-it/cocoapods`
  - [CocoaPods] switch Promise.all for reduce to avoid git lock [#2327](https://github.com/intuit/auto/pull/2327) ([@hborawski](https://github.com/hborawski))

#### 📝 Documentation

- Fix typo in FAQ [#2381](https://github.com/intuit/auto/pull/2381) ([@Satishpokala124](https://github.com/Satishpokala124))
- `@auto-it/protected-branch`
  - Update Protected-Branch README.md [#2383](https://github.com/intuit/auto/pull/2383) ([@aldrichdev](https://github.com/aldrichdev))

#### Authors: 3

- Harris Borawski ([@hborawski](https://github.com/hborawski))
- Paul Aldrich ([@aldrichdev](https://github.com/aldrichdev))
- Satish Pokala ([@Satishpokala124](https://github.com/Satishpokala124))

---

# v11.0.0 (Fri Jul 28 2023)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Ashik Vetrivelu ([@ashik94vc](https://github.com/ashik94vc))

:heart: Chris ([@ccremer](https://github.com/ccremer))

### Release Notes

#### upgrade lerna ([#2378](https://github.com/intuit/auto/pull/2378))

This releases upgrades the lerna package in the npm plugin to latest. This is a big upgrade and constitutes a breaking change.

---

#### 💥 Breaking Change

- upgrade lerna [#2378](https://github.com/intuit/auto/pull/2378) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Update GitHub actions usage example [#2366](https://github.com/intuit/auto/pull/2366) ([@ccremer](https://github.com/ccremer))
- `@auto-it/gradle`
  - feat: update broken markdown for gradle-release plugin link [#2374](https://github.com/intuit/auto/pull/2374) ([@ashik94vc](https://github.com/ashik94vc))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Ashik Vetrivelu ([@ashik94vc](https://github.com/ashik94vc))
- Chris ([@ccremer](https://github.com/ccremer))

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

- `auto`, `@auto-it/core`
  - Add --from latest option to release and changelog commands [#2356](https://github.com/intuit/auto/pull/2356) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.45.2 (Wed Apr 26 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@ld-codes](https://github.com/ld-codes), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix typo for empty git user message [#2354](https://github.com/intuit/auto/pull/2354) ([@ld-codes](https://github.com/ld-codes))

#### Authors: 1

- [@ld-codes](https://github.com/ld-codes)

---

# v10.45.1 (Wed Apr 26 2023)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fixes "some peer dependencies are incorrectly met" when installing via yarn [#2348](https://github.com/intuit/auto/pull/2348) ([@snebjorn](https://github.com/snebjorn))

#### Authors: 1

- Eskild Diderichsen ([@snebjorn](https://github.com/snebjorn))

---

# v10.45.0 (Wed Apr 19 2023)

#### 🚀 Enhancement

- `@auto-it/slack`
  - allow channel to be passed to slack plugin [#2352](https://github.com/intuit/auto/pull/2352) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.44.0 (Mon Apr 03 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, David Sheldrick ([@ds300](https://github.com/ds300)), for all your work!

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/npm`
  - add useVersion support to npm changelog [#2347](https://github.com/intuit/auto/pull/2347) ([@ds300](https://github.com/ds300))

#### Authors: 1

- David Sheldrick ([@ds300](https://github.com/ds300))

---

# v10.43.0 (Wed Mar 01 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, Adil Malik ([@amalik2](https://github.com/amalik2)), for all your work!

#### 🚀 Enhancement

- `@auto-it/core`
  - feat: add in beforeVersion lifecycle hook [#2334](https://github.com/intuit/auto/pull/2334) (adil_malik@intuit.com)

#### Authors: 1

- Adil Malik ([@amalik2](https://github.com/amalik2))

---

# v10.42.2 (Wed Feb 22 2023)

#### 🐛 Bug Fix

- `auto`
  - fix examples for release command [#2332](https://github.com/intuit/auto/pull/2332) ([@AndreyBozhko](https://github.com/AndreyBozhko))

#### Authors: 1

- Andrey Bozhko ([@AndreyBozhko](https://github.com/AndreyBozhko))

---

# v10.42.1 (Tue Feb 21 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, Andrey Bozhko ([@AndreyBozhko](https://github.com/AndreyBozhko)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - chore: fix prompt message [#2330](https://github.com/intuit/auto/pull/2330) ([@AndreyBozhko](https://github.com/AndreyBozhko))

#### 🏠 Internal

- fix PR number detection in build action [#2329](https://github.com/intuit/auto/pull/2329) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Andrey Bozhko ([@AndreyBozhko](https://github.com/AndreyBozhko))

---

# v10.42.0 (Fri Feb 10 2023)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Feat add `afterRun` hook [#2182](https://github.com/intuit/auto/pull/2182) ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 1

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v10.41.0 (Thu Feb 09 2023)

#### 🚀 Enhancement

- `@auto-it/protected-branch`
  - Improve protected branch plugin [#2317](https://github.com/intuit/auto/pull/2317) ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 1

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v10.40.0 (Wed Feb 08 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, Bruno Nardini ([@megatroom](https://github.com/megatroom)), for all your work!

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Add `--no-git-commit` option to `changelog` command [#2258](https://github.com/intuit/auto/pull/2258) ([@megatroom](https://github.com/megatroom))

#### Authors: 1

- Bruno Nardini ([@megatroom](https://github.com/megatroom))

---

# v10.39.1 (Wed Feb 08 2023)

#### 🐛 Bug Fix

- `@auto-it/all-contributors`
  - fix test [#2322](https://github.com/intuit/auto/pull/2322) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.39.0 (Wed Feb 08 2023)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Dave Pringle ([@UncleDave](https://github.com/UncleDave))

:heart: Jason T Brown ([@vpipkt](https://github.com/vpipkt))

#### 🚀 Enhancement

- `@auto-it/npm`
  - feat(npm): use version commit message from lerna.json [#2277](https://github.com/intuit/auto/pull/2277) ([@UncleDave](https://github.com/UncleDave))
- `@auto-it/core`
  - non-zero exit code if commit is behind [#2189](https://github.com/intuit/auto/pull/2189) ([@vpipkt](https://github.com/vpipkt))

#### ⚠️ Pushed to `main`

- `@auto-it/all-contributors`
  - add more logging to all contributors plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))
  - don't try to update an all-contributorrc that isn't there ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- run actions on PRs [#2318](https://github.com/intuit/auto/pull/2318) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Dave Pringle ([@UncleDave](https://github.com/UncleDave))
- Jason T Brown ([@vpipkt](https://github.com/vpipkt))

---

# v10.38.5 (Sun Feb 05 2023)

#### 🐛 Bug Fix

- `@auto-it/protected-branch`
  - delete branch after release [#2301](https://github.com/intuit/auto/pull/2301) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### ⚠️ Pushed to `main`

- try to fix publish ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.38.1 (Sat Feb 04 2023)

#### 🐛 Bug Fix

- `@auto-it/core`
  - this was throwing an error when it didn't have to causing an odd error in the magic zero plugin [#2298](https://github.com/intuit/auto/pull/2298) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### ⚠️ Pushed to `main`

- add permission ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix env var ([@hipstersmoothie](https://github.com/hipstersmoothie))
- move plugin earlier ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add protected branch plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))
- full checkout ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- `auto`, `@auto-it/core`, `@auto-it/gradle`
  - switch to github actions [#2299](https://github.com/intuit/auto/pull/2299) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.38.0 (Sat Feb 04 2023)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Jack Westbrook ([@jackw](https://github.com/jackw))

:heart: Damien Cornu ([@damiencornu](https://github.com/damiencornu))

:heart: Dominik Moritz ([@domoritz](https://github.com/domoritz))

#### 🚀 Enhancement

- `@auto-it/protected-branch`
  - Create Protected branch plugin [#2210](https://github.com/intuit/auto/pull/2210) ([@jBouyoud](https://github.com/jBouyoud) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/slack`
  - Slack: Update atTarget option to disable tagging messages [#2272](https://github.com/intuit/auto/pull/2272) ([@jackw](https://github.com/jackw))

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix: init command add .env to .gitignore [#2262](https://github.com/intuit/auto/pull/2262) ([@damiencornu](https://github.com/damiencornu))
- `@auto-it/docker`
  - (docker plugin) fix git tagging command [#2256](https://github.com/intuit/auto/pull/2256) ([@ejhayes](https://github.com/ejhayes))

#### 📝 Documentation

- `auto`
  - chore: fix typo [#2288](https://github.com/intuit/auto/pull/2288) ([@domoritz](https://github.com/domoritz))

#### Authors: 6

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Damien Cornu ([@damiencornu](https://github.com/damiencornu))
- Dominik Moritz ([@domoritz](https://github.com/domoritz))
- Eric Hayes ([@ejhayes](https://github.com/ejhayes))
- Jack Westbrook ([@jackw](https://github.com/jackw))
- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v10.37.6 (Tue Sep 13 2022)

:tada: This release contains work from a new contributor! :tada:

Thank you, Ikko Ashimine ([@eltociear](https://github.com/eltociear)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - chore: fix typo in auto.ts [#2223](https://github.com/intuit/auto/pull/2223) ([@eltociear](https://github.com/eltociear))
  - version: take into account current PR labels [#2252](https://github.com/intuit/auto/pull/2252) ([@laughedelic](https://github.com/laughedelic))

#### Authors: 2

- Alexey Alekhin ([@laughedelic](https://github.com/laughedelic))
- Ikko Ashimine ([@eltociear](https://github.com/eltociear))

---

# v10.37.5 (Tue Sep 13 2022)

:tada: This release contains work from a new contributor! :tada:

Thank you, Dominik Moritz ([@domoritz](https://github.com/domoritz)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - Bump ts-node [#2255](https://github.com/intuit/auto/pull/2255) ([@domoritz](https://github.com/domoritz))

#### Authors: 1

- Dominik Moritz ([@domoritz](https://github.com/domoritz))

---

# v10.37.4 (Mon Jul 25 2022)

#### 🐛 Bug Fix

- `@auto-it/core`
  - add missing peer deps [#2240](https://github.com/intuit/auto/pull/2240) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.37.3 (Sun Jul 24 2022)

#### 🐛 Bug Fix

- `@auto-it/docker`
  - (docker plugin) Additional tag alias support [#2232](https://github.com/intuit/auto/pull/2232) ([@ejhayes](https://github.com/ejhayes))

#### Authors: 1

- Eric Hayes ([@ejhayes](https://github.com/ejhayes))

---

# v10.37.2 (Fri Jul 15 2022)

#### 🐛 Bug Fix

- `@auto-it/version-file`
  - Get correct next version when using onlyGraduateWithReleaseLabel [#2229](https://github.com/intuit/auto/pull/2229) ([@adierkens](https://github.com/adierkens))

#### 📝 Documentation

- `@auto-it/maven`
  - Remove old references in maven instructions [#2226](https://github.com/intuit/auto/pull/2226) ([@sugarmanz](https://github.com/sugarmanz))

#### Authors: 2

- Adam Dierkens ([@adierkens](https://github.com/adierkens))
- Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz))

---

# v10.37.1 (Thu May 26 2022)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - #2141: add missed --no-verify-access for lerna publish [#2205](https://github.com/intuit/auto/pull/2205) ([@karpoff](https://github.com/karpoff))

#### Authors: 1

- Anton Karpov ([@karpoff](https://github.com/karpoff))

---

# v10.37.0 (Fri May 20 2022)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Ketan Reddy ([@KetanReddy](https://github.com/KetanReddy))

:heart: Josh Biddick ([@sonic-knuckles](https://github.com/sonic-knuckles))

#### 🚀 Enhancement

- `auto`, `@auto-it/version-file`
  - Version File Plugin [#2107](https://github.com/intuit/auto/pull/2107) (ketan_reddy@intuit.com)

#### 🐛 Bug Fix

- Update index.mdx [#2184](https://github.com/intuit/auto/pull/2184) ([@sonic-knuckles](https://github.com/sonic-knuckles))

#### Authors: 2

- Josh Biddick ([@sonic-knuckles](https://github.com/sonic-knuckles))
- Ketan Reddy ([@KetanReddy](https://github.com/KetanReddy))

---

# v10.36.6 (Fri May 20 2022)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Agustin Polo ([@poloagustin](https://github.com/poloagustin))

:heart: Ikko Ashimine ([@eltociear](https://github.com/eltociear))

#### 🐛 Bug Fix

- Fix release [#2204](https://github.com/intuit/auto/pull/2204) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add github to known hosts in CI config [#2204](https://github.com/intuit/auto/pull/2204) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - fix(git): #2049 removes the use of deprecated error.headers [#2202](https://github.com/intuit/auto/pull/2202) ([@poloagustin](https://github.com/poloagustin))

#### 📝 Documentation

- `@auto-it/maven`
  - Fix typo in maven/README.md [#2176](https://github.com/intuit/auto/pull/2176) ([@eltociear](https://github.com/eltociear))

#### Authors: 3

- Agustin Polo ([@poloagustin](https://github.com/poloagustin))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Ikko Ashimine ([@eltociear](https://github.com/eltociear))

---

# v10.36.5 (Sun Mar 20 2022)

#### 🐛 Bug Fix

- `@auto-it/core`
  - create major version at last release tag [#2175](https://github.com/intuit/auto/pull/2175) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.36.4 (Sun Mar 20 2022)

#### 🐛 Bug Fix

- `@auto-it/gem`
  - Gem: use releaseCommand in canary release [#2174](https://github.com/intuit/auto/pull/2174) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump shelljs from 0.8.4 to 0.8.5 [#2132](https://github.com/intuit/auto/pull/2132) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 2

- [@dependabot[bot]](https://github.com/dependabot[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.36.3 (Sun Mar 20 2022)

#### 🐛 Bug Fix

- `@auto-it/bot-list`
  - add mergify[bot] to the bot-list [#1972](https://github.com/intuit/auto/pull/1972) ([@laughedelic](https://github.com/laughedelic))

#### 🔩 Dependency Updates

- Bump ws from 6.2.1 to 6.2.2 [#2009](https://github.com/intuit/auto/pull/2009) ([@dependabot[bot]](https://github.com/dependabot[bot]))
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

# v10.36.2 (Sun Mar 20 2022)

#### 🐛 Bug Fix

- `@auto-it/pr-body-labels`
  - Remove unchecked labels when pr-check runs [#2173](https://github.com/intuit/auto/pull/2173) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.36.1 (Sun Mar 20 2022)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix loading object author from auto rc [#2172](https://github.com/intuit/auto/pull/2172) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/cocoapods`, `@auto-it/conventional-commits`, `@auto-it/exec`, `@auto-it/first-time-contributor`, `@auto-it/gem`, `@auto-it/gh-pages`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Update octokit [#2171](https://github.com/intuit/auto/pull/2171) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.36.0 (Sun Mar 20 2022)

#### 🚀 Enhancement

- `@auto-it/core`
  - Allow load npm module as extends [#2164](https://github.com/intuit/auto/pull/2164) ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 1

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v10.35.1 (Sun Mar 20 2022)

:tada: This release contains work from a new contributor! :tada:

Thank you, Valentin Hervieu ([@ValentinH](https://github.com/ValentinH)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/npm`
  - fix(npm): remove quote in commit message for standalone packages [#2165](https://github.com/intuit/auto/pull/2165) ([@jBouyoud](https://github.com/jBouyoud))

#### 📝 Documentation

- docs: add react-easy-crop to "Projects Using auto" [#2162](https://github.com/intuit/auto/pull/2162) ([@ValentinH](https://github.com/ValentinH))
- `@auto-it/npm`
  - docs: fix publishFolder example [#2161](https://github.com/intuit/auto/pull/2161) ([@ValentinH](https://github.com/ValentinH))

#### Authors: 2

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))
- Valentin Hervieu ([@ValentinH](https://github.com/ValentinH))

---

# v10.35.0 (Sun Mar 20 2022)

#### 🚀 Enhancement

- `@auto-it/released`
  - Add `lockPrs` option for released plugin [#2166](https://github.com/intuit/auto/pull/2166) ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 1

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v10.34.2 (Thu Mar 17 2022)

#### 🐛 Bug Fix

- `@auto-it/cocoapods`
  - CocoaPods swap promise.all for reduce to avoid git locking problem [#2169](https://github.com/intuit/auto/pull/2169) ([@hborawski](https://github.com/hborawski))

#### Authors: 1

- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v10.34.1 (Sat Mar 05 2022)

#### 🐛 Bug Fix

- `@auto-it/gradle`
  - [Gradle] Fix canary version reporting [#2160](https://github.com/intuit/auto/pull/2160) ([@sugarmanz](https://github.com/sugarmanz))

#### Authors: 1

- Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz))

---

# v10.34.0 (Sat Mar 05 2022)

#### 🚀 Enhancement

- `@auto-it/gem`
  - Improve gem deployment [#2152](https://github.com/intuit/auto/pull/2152) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v10.33.1 (Fri Mar 04 2022)

:tada: This release contains work from a new contributor! :tada:

Thank you, Corentin Ardeois ([@ardeois](https://github.com/ardeois)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/microsoft-teams`, `@auto-it/slack`
  - fix: update node-fetch [#2158](https://github.com/intuit/auto/pull/2158) ([@ardeois](https://github.com/ardeois))

#### Authors: 1

- Corentin Ardeois ([@ardeois](https://github.com/ardeois))

---

# v10.33.0 (Fri Mar 04 2022)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Ken Clarke ([@kclarkey](https://github.com/kclarkey))

:heart: Dalton Scharff ([@daltonscharff](https://github.com/daltonscharff))

#### 🚀 Enhancement

- `@auto-it/npm`
  - feat(plugins/npm): exclude pre-release branches from greaterRelease calculation [#2036](https://github.com/intuit/auto/pull/2036) ([@hydrosquall](https://github.com/hydrosquall))
  - feat(plugins/npm): add support for passing publishFolder. [#2115](https://github.com/intuit/auto/pull/2115) ([@kclarkey](https://github.com/kclarkey))

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix(@octokit/request-error) Fixes depreciation error when accessing error.headers [#2064](https://github.com/intuit/auto/pull/2064) (dalton.scharff@segment.com)

#### Authors: 3

- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))
- Dalton Scharff ([@daltonscharff](https://github.com/daltonscharff))
- Ken Clarke ([@kclarkey](https://github.com/kclarkey))

---

# v10.32.6 (Thu Jan 20 2022)

#### 🐛 Bug Fix

- `@auto-it/sbt`
  - sbt: Avoid clobbering unrelated version settings [#2067](https://github.com/intuit/auto/pull/2067) ([@torkjel](https://github.com/torkjel))

#### Authors: 1

- Torkjel Hongve ([@torkjel](https://github.com/torkjel))

---

# v10.32.5 (Fri Dec 10 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, yogesh khandelwal ([@ykhandelwal913](https://github.com/ykhandelwal913)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/gradle`
  - Reordering the task to avoid the snapshotCheck failure [#2118](https://github.com/intuit/auto/pull/2118) ([@yogeshkhandelwal](https://github.com/yogeshkhandelwal) [@ykhandelwal913](https://github.com/ykhandelwal913))

#### Authors: 2

- [@yogeshkhandelwal](https://github.com/yogeshkhandelwal)
- yogesh khandelwal ([@ykhandelwal913](https://github.com/ykhandelwal913))

---

# v10.32.4 (Fri Dec 10 2021)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: null[@yogeshkhandelwal](https://github.com/yogeshkhandelwal)

:heart: yogesh khandelwal ([@ykhandelwal913](https://github.com/ykhandelwal913))

:heart: Andreas Weichselbaum ([@AndreasWeichselbaum](https://github.com/AndreasWeichselbaum))

### Release Notes

#### fixing gradle issue ([#2116](https://github.com/intuit/auto/pull/2116))

This release fixes the Gradle plugin ([#2608](https://github.com/intuit/auto/issues/2068)) for Gradle 6.8+.

---

#### 🐛 Bug Fix

- `@auto-it/gradle`
  - fixing gradle issue [#2116](https://github.com/intuit/auto/pull/2116) ([@yogeshkhandelwal](https://github.com/yogeshkhandelwal) [@ykhandelwal913](https://github.com/ykhandelwal913))

#### 📝 Documentation

- Expand default label configuration by default in Docs [#2060](https://github.com/intuit/auto/pull/2060) ([@AndreasWeichselbaum](https://github.com/AndreasWeichselbaum))

#### Authors: 3

- [@yogeshkhandelwal](https://github.com/yogeshkhandelwal)
- Andreas Weichselbaum ([@AndreasWeichselbaum](https://github.com/AndreasWeichselbaum))
- yogesh khandelwal ([@ykhandelwal913](https://github.com/ykhandelwal913))

---

# v10.32.3 (Mon Nov 22 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Mathieu Bergeron ([@mathieubergeron](https://github.com/mathieubergeron)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/microsoft-teams`
  - fix(plugin/microsoft-teams): incorrect markdown rendering [#2080](https://github.com/intuit/auto/pull/2080) ([@mathieubergeron](https://github.com/mathieubergeron))

#### 📝 Documentation

- Minor README.md typo [#2106](https://github.com/intuit/auto/pull/2106) ([@orta](https://github.com/orta))

#### Authors: 2

- Mathieu Bergeron ([@mathieubergeron](https://github.com/mathieubergeron))
- Orta Therox ([@orta](https://github.com/orta))

---

# v10.32.2 (Tue Oct 26 2021)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - fix: get latest maintenance major tag from github releases [#2076](https://github.com/intuit/auto/pull/2076) (lucas_shadler@intuit.com [@sumwatshade](https://github.com/sumwatshade))

#### Authors: 2

- lshadler (lucas_shadler@intuit.com)
- Lucas Shadler ([@sumwatshade](https://github.com/sumwatshade))

---

# v10.32.1 (Thu Sep 30 2021)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/conventional-commits`
  - use strict check so SEMVER.noVersion can add skip-release [#2086](https://github.com/intuit/auto/pull/2086) ([@hborawski](https://github.com/hborawski))

#### Authors: 1

- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v10.32.0 (Wed Sep 15 2021)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`, `@auto-it/npm`
  - Support --use-version argument with shipit [#2075](https://github.com/intuit/auto/pull/2075) ([@kelyvin](https://github.com/kelyvin))

#### Authors: 1

- Kelvin Nguyen ([@kelyvin](https://github.com/kelyvin))

---

# v10.31.0 (Thu Aug 12 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Cameron Yick ([@hydrosquall](https://github.com/hydrosquall)), for all your work!

#### 🚀 Enhancement

- `@auto-it/npm`
  - feat(plugins/npm): permit lerna publish to use automation tokens [#2032](https://github.com/intuit/auto/pull/2032) ([@hydrosquall](https://github.com/hydrosquall))

#### 🐛 Bug Fix

- Upgrade to GitHub-native Dependabot [#1970](https://github.com/intuit/auto/pull/1970) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump tar from 4.4.13 to 4.4.15 [#2048](https://github.com/intuit/auto/pull/2048) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))

---

# v10.30.0 (Thu Jul 22 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Cameron Yick ([@hydrosquall](https://github.com/hydrosquall)), for all your work!

#### 🚀 Enhancement

- `@auto-it/npm`
  - feat(plugins/npm): exclude prelease versions when calculating monorepo project version [#2035](https://github.com/intuit/auto/pull/2035) ([@hydrosquall](https://github.com/hydrosquall))

#### Authors: 1

- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))

---

# v10.29.3 (Tue Jun 08 2021)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - Revert #1997 [#2010](https://github.com/intuit/auto/pull/2010) (praxis@target.com [@10hendersonm](https://github.com/10hendersonm))
  - fix(npm): Prevents canary releases with double dashed version numbers [#1997](https://github.com/intuit/auto/pull/1997) ([@10hendersonm](https://github.com/10hendersonm))

#### 📝 Documentation

- Fix broken link to /generated/omit-commits [#2001](https://github.com/intuit/auto/pull/2001) ([@hasparus](https://github.com/hasparus))

#### Authors: 3

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))
- Piotr Monwid-Olechnowicz ([@hasparus](https://github.com/hasparus))
- Vela CI (praxis@target.com)

---

# v10.29.2 (Tue May 25 2021)

#### 🐛 Bug Fix

- fix publish [#1998](https://github.com/intuit/auto/pull/1998) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.29.1 (Tue May 25 2021)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - fix(npm): Prevents canary releases with double dashed version numbers [#1997](https://github.com/intuit/auto/pull/1997) ([@10hendersonm](https://github.com/10hendersonm))

#### Authors: 1

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))

---

# v10.29.0 (Fri May 21 2021)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/brew`, `@auto-it/crates`, `@auto-it/maven`, `@auto-it/microsoft-teams`, `@auto-it/npm`
  - Feature/msteams [#1914](https://github.com/intuit/auto/pull/1914) ([@vincentbriglia](https://github.com/vincentbriglia) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Vincent Briglia ([@vincentbriglia](https://github.com/vincentbriglia))

---

# v10.28.0 (Wed May 19 2021)

#### 🚀 Enhancement

- `@auto-it/cocoapods`
  - feat: push multiple podspecs [#1982](https://github.com/intuit/auto/pull/1982) ([@hborawski](https://github.com/hborawski))

#### Authors: 1

- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v10.27.1 (Tue May 11 2021)

#### 🐛 Bug Fix

- `@auto-it/slack`
  - Remove `text` from non-app authed slack response [#1947](https://github.com/intuit/auto/pull/1947) ([@adierkens](https://github.com/adierkens))

#### Authors: 1

- Adam Dierkens ([@adierkens](https://github.com/adierkens))

---

# v10.27.0 (Fri May 07 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Spencer Hamm ([@spentacular](https://github.com/spentacular)), for all your work!

#### 🚀 Enhancement

- `@auto-it/sbt`
  - add sbt plugin [#1962](https://github.com/intuit/auto/pull/1962) ([@laughedelic](https://github.com/laughedelic))

#### 🐛 Bug Fix

- `@auto-it/git-tag`
  - rearrange to allow dryrun to leverage prefixed tag [#1976](https://github.com/intuit/auto/pull/1976) (spencer_hamm@intuit.com)

#### Authors: 2

- Alexey Alekhin ([@laughedelic](https://github.com/laughedelic))
- Spencer Hamm ([@spentacular](https://github.com/spentacular))

---

# v10.26.1 (Mon May 03 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - add noDefaultLabels config option to the globalOptions type [#1971](https://github.com/intuit/auto/pull/1971) ([@laughedelic](https://github.com/laughedelic))

#### Authors: 1

- Alexey Alekhin ([@laughedelic](https://github.com/laughedelic))

---

# v10.26.0 (Wed Apr 28 2021)

#### 🚀 Enhancement

- `@auto-it/core`
  - add noDefaultLabels config flag [#1966](https://github.com/intuit/auto/pull/1966) ([@laughedelic](https://github.com/laughedelic))

#### Authors: 1

- Alexey Alekhin ([@laughedelic](https://github.com/laughedelic))

---

# v10.25.2 (Tue Apr 27 2021)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Alexey Alekhin ([@laughedelic](https://github.com/laughedelic))

:heart: John T. Wodder II ([@jwodder](https://github.com/jwodder))

#### 🐛 Bug Fix

- `@auto-it/core`
  - canary shouldn't make changes on dry run [#1969](https://github.com/intuit/auto/pull/1969) ([@laughedelic](https://github.com/laughedelic))
- `auto`
  - export CLI API [#1967](https://github.com/intuit/auto/pull/1967) ([@laughedelic](https://github.com/laughedelic))

#### 📝 Documentation

- Update docs for "afterAddToChangelog" → "afterChangelog" rename [#1951](https://github.com/intuit/auto/pull/1951) ([@jwodder](https://github.com/jwodder))

#### Authors: 2

- Alexey Alekhin ([@laughedelic](https://github.com/laughedelic))
- John T. Wodder II ([@jwodder](https://github.com/jwodder))

---

# v10.25.1 (Thu Apr 15 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Piotr Monwid-Olechnowicz ([@hasparus](https://github.com/hasparus)), for all your work!

#### 🐛 Bug Fix

- `auto`
  - fix(types): point to dist/index.d.ts instead of non-existing file [#1944](https://github.com/intuit/auto/pull/1944) ([@hasparus](https://github.com/hasparus))

#### 📝 Documentation

- docs: import INpmConfig from npm package, not from core [#1942](https://github.com/intuit/auto/pull/1942) ([@hasparus](https://github.com/hasparus))

#### Authors: 1

- Piotr Monwid-Olechnowicz ([@hasparus](https://github.com/hasparus))

---

# v10.25.0 (Tue Apr 13 2021)

#### 🚀 Enhancement

- `@auto-it/gem`
  - feat(gem): add canary hook [#1916](https://github.com/intuit/auto/pull/1916) ([@angeliski](https://github.com/angeliski))

#### Authors: 1

- Rogerio Angeliski ([@angeliski](https://github.com/angeliski))

---

# v10.24.3 (Thu Apr 08 2021)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - Prefer npx over yarn for running lerna commands [#1936](https://github.com/intuit/auto/pull/1936) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v10.24.2 (Thu Apr 08 2021)

#### 🐛 Bug Fix

- `@auto-it/all-contributors`
  - Update index.ts [#1938](https://github.com/intuit/auto/pull/1938) ([@kharrop](https://github.com/kharrop))

#### 📝 Documentation

- `@auto-it/all-contributors`
  - Update README.md [#1937](https://github.com/intuit/auto/pull/1937) ([@kharrop](https://github.com/kharrop))

#### Authors: 1

- Kelly Harrop ([@kharrop](https://github.com/kharrop))

---

# v10.24.1 (Mon Mar 29 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Enable using globally installed plugins [#1930](https://github.com/intuit/auto/pull/1930) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.24.0 (Mon Mar 29 2021)

### Release Notes

#### Release Command: Tag creation fallback. ([#1929](https://github.com/intuit/auto/pull/1929))

When creating a release for a tag that isn't on the remote, fallback to creating a tag pointing at the --to option.

## Why

closes #1917

Todo:

- [x] Add tests
- [x] Add docs

## Change Type

Indicate the type of change your pull request is:

- [ ] `documentation`
- [ ] `patch`
- [x] `minor`
- [ ] `major`

---

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Release Command: Tag creation fallback. [#1929](https://github.com/intuit/auto/pull/1929) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.23.0 (Fri Mar 26 2021)

#### 🚀 Enhancement

- `@auto-it/conventional-commits`
  - Fix conventional commits releaseType calculation to include all conventionally committed commits in PR [#1723](https://github.com/intuit/auto/pull/1723) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.22.1 (Tue Mar 23 2021)

#### 🐛 Bug Fix

- `@auto-it/slack`
  - fix rendering long lines in slack plugin [#1913](https://github.com/intuit/auto/pull/1913) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- update skip docs [#1912](https://github.com/intuit/auto/pull/1912) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @fortawesome/fontawesome-svg-core from 1.2.34 to 1.2.35 [#1897](https://github.com/intuit/auto/pull/1897) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump aws-cli-js from 2.1.0 to 2.2.1 [#1898](https://github.com/intuit/auto/pull/1898) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 4.3.8 to 5.2.0 [#1900](https://github.com/intuit/auto/pull/1900) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 7.16.0 to 7.22.0 [#1901](https://github.com/intuit/auto/pull/1901) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 26.0.20 to 26.0.21 [#1902](https://github.com/intuit/auto/pull/1902) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump simple-react-lightbox from 3.3.4 to 3.6.4 [#1903](https://github.com/intuit/auto/pull/1903) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript-memoize from 1.0.0-alpha.4 to 1.0.0 [#1904](https://github.com/intuit/auto/pull/1904) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 24.3.1 to 24.3.2 [#1905](https://github.com/intuit/auto/pull/1905) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.15.0 to 4.18.0 [#1906](https://github.com/intuit/auto/pull/1906) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/npm`
  - Bump await-to-js from 2.1.1 to 3.0.0 [#1899](https://github.com/intuit/auto/pull/1899) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.22.0 (Mon Mar 22 2021)

#### 🚀 Enhancement

- `@auto-it/conventional-commits`
  - add defaultReleaseType option [#1911](https://github.com/intuit/auto/pull/1911) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.21.3 (Mon Mar 22 2021)

#### ⚠️ Pushed to `main`

- fix docs build ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add skip label docs [#1909](https://github.com/intuit/auto/pull/1909) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.21.1 (Mon Mar 22 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@sentony93](https://github.com/sentony93), for all your work!

#### 🐛 Bug Fix

- `@auto-it/gradle`
  - Small gradle plugin enhancement [#1896](https://github.com/intuit/auto/pull/1896) (tony_lin@intuit.com [@sentony93](https://github.com/sentony93))

#### 📝 Documentation

- `@auto-it/slack`
  - add slack release notes screenshot [#1908](https://github.com/intuit/auto/pull/1908) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/microsoft-teams`
  - add Microsoft teams plugins to sidebar and root readme [#1907](https://github.com/intuit/auto/pull/1907) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Upgrade next-ignite [#1895](https://github.com/intuit/auto/pull/1895) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/rest from 18.2.0 to 18.3.5 [#1873](https://github.com/intuit/auto/pull/1873) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript from 4.1.5 to 4.2.3 [#1857](https://github.com/intuit/auto/pull/1857) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
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

# v10.21.0 (Fri Mar 19 2021)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - add canary target flag/option [#1893](https://github.com/intuit/auto/pull/1893) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.20.6 (Thu Mar 18 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@sentony93](https://github.com/sentony93), for all your work!

#### 🐛 Bug Fix

- `@auto-it/gradle`
  - Next/Canary Support for Gradle [#1842](https://github.com/intuit/auto/pull/1842) (tony_lin@intuit.com [@sentony93](https://github.com/sentony93))

#### Authors: 2

- [@sentony93](https://github.com/sentony93)
- slin8 (tony_lin@intuit.com)

---

# v10.20.5 (Thu Mar 18 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@myndelx](https://github.com/myndelx), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix ts-node peer deps [#1891](https://github.com/intuit/auto/pull/1891) ([@myndelx](https://github.com/myndelx))

#### Authors: 1

- [@myndelx](https://github.com/myndelx)

---

# v10.20.4 (Mon Mar 15 2021)

#### 🐛 Bug Fix

- `@auto-it/slack`
  - Slack link bug [#1887](https://github.com/intuit/auto/pull/1887) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.20.3 (Mon Mar 15 2021)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - better error message for no NPM_token in CI [#1878](https://github.com/intuit/auto/pull/1878) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.20.2 (Mon Mar 15 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix typescript require [#1885](https://github.com/intuit/auto/pull/1885) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.20.1 (Sun Mar 14 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - only ts-node/register for plugins if typescript is installed to the project [#1877](https://github.com/intuit/auto/pull/1877) ([@hipstersmoothie](https://github.com/hipstersmoothie))
  - better exclude for lerna private packages [#1876](https://github.com/intuit/auto/pull/1876) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.20.0 (Sat Mar 13 2021)

### Release Notes

#### Write auto configuration in TypeScript ([#1875](https://github.com/intuit/auto/pull/1875))

You can now author you `auto` configuration in TypeScript 🎉  

This makes it a bit easier to validate your configuration as you write it. All of the options come with jsDoc so you can get documentation super easy. 

You can even pull in the options types for plugins!

```ts
import { AutoRc } from "auto";

import { INpmConfig } from "@auto-it/core";
import { IAllContributorsPluginOptions } from "@auto-it/all-contributors";

const npmOptions: INpmConfig = {
  exact: true,
  canaryScope: "@auto-canary",
};

const allContributorsOptions: IAllContributorsPluginOptions = {
  types: {
    plugin: "**/plugin/**/*",
    code: ["**/src/**/*", "**/package.json", "**/tsconfig.json"],
  },
};

/** Auto configuration */
export default function rc(): AutoRc {
  return {
    plugins: [
      "released",
      ["npm", npmOptions],
      ["all-contributors", allContributorsOptions],
    ],
    labels: [
      {
        name: "blog-post",
        changelogTitle: "📚 Blog Post",
        releaseType: "none",
      },
    ],
  };
}
```

## Why

The more validation of configuration the better!

Todo:

- [x] Add docs

## Change Type

Indicate the type of change your pull request is:

- [ ] `documentation`
- [ ] `patch`
- [x] `minor`
- [ ] `major`

---

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Write auto configuration in TypeScript [#1875](https://github.com/intuit/auto/pull/1875) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.19.0 (Sat Mar 13 2021)

#### 🚀 Enhancement

- `@auto-it/core`
  - Enable authoring pure TypeScript plugins [#1872](https://github.com/intuit/auto/pull/1872) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.9 (Fri Mar 12 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - next: handle baseBranch not on remote on fresh repo [#1871](https://github.com/intuit/auto/pull/1871) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.8 (Fri Mar 12 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix using --dry-run and --quiet together with the changelog command [#1870](https://github.com/intuit/auto/pull/1870) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.7 (Thu Mar 11 2021)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - don't include private packages in canary install list [#1866](https://github.com/intuit/auto/pull/1866) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.6 (Thu Mar 11 2021)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - wrap canary identifier in quotes so terminal understands it's an argument to the --preid flag [#1864](https://github.com/intuit/auto/pull/1864) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.5 (Thu Mar 11 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix PR label calculation [#1865](https://github.com/intuit/auto/pull/1865) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.4 (Tue Mar 09 2021)

#### 🐛 Bug Fix

- `@auto-it/slack`
  - Slack message spacing + notification text [#1862](https://github.com/intuit/auto/pull/1862) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.3 (Wed Mar 03 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Add leading hyphen to canary identifier so that canaries always sort before any other release type [#1851](https://github.com/intuit/auto/pull/1851) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.2 (Wed Mar 03 2021)

#### 🐛 Bug Fix

- `@auto-it/pr-body-labels`
  - handle capital X in semver bump list [#1849](https://github.com/intuit/auto/pull/1849) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- update getting started docs [#1848](https://github.com/intuit/auto/pull/1848) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.1 (Tue Mar 02 2021)

#### 🐛 Bug Fix

- `@auto-it/slack`
  - groups authors [#1847](https://github.com/intuit/auto/pull/1847) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.18.0 (Tue Mar 02 2021)

#### 🚀 Enhancement

- `@auto-it/slack`
  - Expose username, iconUrl, and iconEmoji validation bug + collapse markdown lists into 1 section [#1846](https://github.com/intuit/auto/pull/1846) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.17.1 (Tue Mar 02 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix validating slack config with mixed options [#1844](https://github.com/intuit/auto/pull/1844) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.17.0 (Tue Mar 02 2021)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/microsoft-teams`, `@auto-it/slack`
  - Use Block Kit for slack messages [#1815](https://github.com/intuit/auto/pull/1815) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.16.8 (Wed Feb 24 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Dorian Marié ([@dorianmariefr](https://github.com/dorianmariefr)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/npm`
  - improve GitHub actions docs + remove unnecessary warning [#1828](https://github.com/intuit/auto/pull/1828) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- `@auto-it/npm`
  - Use mock-fs for npm tests [#1827](https://github.com/intuit/auto/pull/1827) ([@zephraph](https://github.com/zephraph))

#### 📝 Documentation

- `@auto-it/npm`
  - Add note about verifyAccess config [#1829](https://github.com/intuit/auto/pull/1829) ([@zephraph](https://github.com/zephraph))
- `@auto-it/gem`
  - gem's README, typo: you -> your [#1820](https://github.com/intuit/auto/pull/1820) ([@dorianmariefr](https://github.com/dorianmariefr))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 18.1.0 to 18.2.0 [#1823](https://github.com/intuit/auto/pull/1823) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump graphql from 15.4.0 to 15.5.0 [#1824](https://github.com/intuit/auto/pull/1824) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump aws-cli-js from 2.0.6 to 2.1.0 [#1808](https://github.com/intuit/auto/pull/1808) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.9.3 to 2.9.5 [#1810](https://github.com/intuit/auto/pull/1810) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump type-fest from 0.20.2 to 0.21.1 [#1825](https://github.com/intuit/auto/pull/1825) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`, `@auto-it/package-json-utils`, `@auto-it/gh-pages`, `@auto-it/magic-zero`, `@auto-it/microsoft-teams`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/upload-assets`, `@auto-it/vscode`
  - Bump eslint-config-prettier from 6.15.0 to 8.0.0 [#1822](https://github.com/intuit/auto/pull/1822) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 4

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Dorian Marié ([@dorianmariefr](https://github.com/dorianmariefr))
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v10.16.7 (Sat Feb 20 2021)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - fix lerna independent commit message [#1819](https://github.com/intuit/auto/pull/1819) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Revert "fix typo" [#1817](https://github.com/intuit/auto/pull/1817) ([@zephraph](https://github.com/zephraph) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v10.16.6 (Thu Feb 18 2021)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Lucas Shadler ([@lshadler](https://github.com/lshadler))

:heart: Evan Lovely ([@EvanLovely](https://github.com/EvanLovely))

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix: prefer prerelease tags when determining latest [#1812](https://github.com/intuit/auto/pull/1812) (lucas_shadler@intuit.com)

#### 📝 Documentation

- fix typo [#1814](https://github.com/intuit/auto/pull/1814) ([@zephraph](https://github.com/zephraph))
- `@auto-it/all-contributors`
  - docs: fix broken link on all-contributors page [#1813](https://github.com/intuit/auto/pull/1813) ([@EvanLovely](https://github.com/EvanLovely))
- `@auto-it/jira`
  - better docs for jira plugin [#1811](https://github.com/intuit/auto/pull/1811) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump typescript from 4.0.5 to 4.1.5 [#1800](https://github.com/intuit/auto/pull/1800) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.13.0 to 4.15.0 [#1799](https://github.com/intuit/auto/pull/1799) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump conventional-changelog-core from 4.2.1 to 4.2.2 [#1788](https://github.com/intuit/auto/pull/1788) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.5.3 to 10.5.4 [#1787](https://github.com/intuit/auto/pull/1787) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/prettier from 2.1.6 to 2.2.0 [#1786](https://github.com/intuit/auto/pull/1786) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump vsce from 1.83.0 to 1.85.0 [#1785](https://github.com/intuit/auto/pull/1785) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tapable from 2.0.0 to 2.2.0 [#1781](https://github.com/intuit/auto/pull/1781) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/slack`
  - Bump @types/node-fetch from 2.5.7 to 2.5.8 [#1784](https://github.com/intuit/auto/pull/1784) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/brew`, `@auto-it/chrome`, `@auto-it/cocoapods`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/docker`, `@auto-it/exec`, `@auto-it/first-time-contributor`, `@auto-it/gem`, `@auto-it/gh-pages`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/magic-zero`, `@auto-it/microsoft-teams`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/pr-body-labels`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`, `@auto-it/vscode`
  - Bump tslib from 2.0.3 to 2.1.0 [#1779](https://github.com/intuit/auto/pull/1779) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 5

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Evan Lovely ([@EvanLovely](https://github.com/EvanLovely))
- Justin Bennett ([@zephraph](https://github.com/zephraph))
- Lucas Shadler ([@lshadler](https://github.com/lshadler))

---

# v10.16.5 (Thu Feb 11 2021)

#### 🐛 Bug Fix

- build the s3 plugin [#1804](https://github.com/intuit/auto/pull/1804) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.16.4 (Thu Feb 11 2021)

#### 🐛 Bug Fix

- `@auto-it/upload-assets`
  - make canary assets tag at the start of history to avoid tag calculation bugs [#1803](https://github.com/intuit/auto/pull/1803) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.16.3 (Thu Feb 11 2021)

### Release Notes

#### Don't create "Canary Release Assets" during non-canary builds + Change that releases tag to valid semver ([#1802](https://github.com/intuit/auto/pull/1802))

This release changes the tag used for the "Canary Releases Assets" created by the `upload-assets` plugin to be `0.0.0-canary`.
This new tag is a valid semantic version and can be used with other auto commands.

If you already have a canary release assets releases this change will create another under a different tag.
This mean you'll have an old "Canary Releases Assets" release that never updates, feel free to delete the tag/release or just ignore it if you want the urls to the old assets to still exist.

---

#### 🐛 Bug Fix

- `@auto-it/upload-assets`
  - Don't create "Canary Release Assets" during non-canary builds + Change that releases tag to valid semver [#1802](https://github.com/intuit/auto/pull/1802) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add automated TOC to hooks documentation [#1801](https://github.com/intuit/auto/pull/1801) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update docs to always have latest default labels [#1798](https://github.com/intuit/auto/pull/1798) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.16.2 (Thu Feb 11 2021)

#### 🐛 Bug Fix

- `@auto-it/gh-pages`
  - Do not execute gh-pages build during a dry run [#1797](https://github.com/intuit/auto/pull/1797) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `auto`, `@auto-it/core`
  - improve jenkins/next docs [#1794](https://github.com/intuit/auto/pull/1794) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.16.1 (Thu Feb 11 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - When calculating "next" lastTag, fallback to latest tag in baseBranch before first commit [#1791](https://github.com/intuit/auto/pull/1791) ([@hipstersmoothie](https://github.com/hipstersmoothie))
  - fix running version on prerelease branch with no reachable tags [#1792](https://github.com/intuit/auto/pull/1792) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/conventional-commits`
  - add more logging to conventional commits [#1793](https://github.com/intuit/auto/pull/1793) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.16.0 (Thu Feb 04 2021)

#### 🚀 Enhancement

- `@auto-it/slack`
  - add title option [#1777](https://github.com/intuit/auto/pull/1777) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.15.0 (Wed Feb 03 2021)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - add --force flag/config option to "next" command [#1776](https://github.com/intuit/auto/pull/1776) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.14.2 (Wed Feb 03 2021)

#### 🐛 Bug Fix

- `auto`
  - inject next version into bundled "auto" [#1775](https://github.com/intuit/auto/pull/1775) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.14.1 (Wed Feb 03 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - don't check if git clean during dry run [#1774](https://github.com/intuit/auto/pull/1774) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.14.0 (Wed Feb 03 2021)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/conventional-commits`
  - feat: conventional commit plugin will label an unlabeled PR [#1758](https://github.com/intuit/auto/pull/1758) ([@hborawski](https://github.com/hborawski) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Fluff up home page [#1773](https://github.com/intuit/auto/pull/1773) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump ts-jest from 26.4.4 to 26.5.0 [#1765](https://github.com/intuit/auto/pull/1765) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/free-solid-svg-icons from 5.14.0 to 5.15.2 [#1768](https://github.com/intuit/auto/pull/1768) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump title-case from 3.0.2 to 3.0.3 [#1766](https://github.com/intuit/auto/pull/1766) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/react-fontawesome from 0.1.12 to 0.1.14 [#1763](https://github.com/intuit/auto/pull/1763) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump chrome-webstore-upload-cli from 1.2.0 to 1.2.1 [#1764](https://github.com/intuit/auto/pull/1764) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.14.0 to 4.14.1 [#1767](https://github.com/intuit/auto/pull/1767) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/fontawesome-svg-core from 1.2.32 to 1.2.34 [#1770](https://github.com/intuit/auto/pull/1770) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest-circus from 26.4.2 to 26.6.3 [#1771](https://github.com/intuit/auto/pull/1771) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/pr-body-labels`
  - Bump @octokit/rest from 18.0.6 to 18.0.15 [#1769](https://github.com/intuit/auto/pull/1769) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v10.13.4 (Mon Feb 01 2021)

#### 🐛 Bug Fix

- `@auto-it/released`
  - released plugin: handle PR numbers that dont exist [#1772](https://github.com/intuit/auto/pull/1772) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.13.3 (Thu Jan 28 2021)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - fix commit message when using npx in non-monorepo [#1762](https://github.com/intuit/auto/pull/1762) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- fix docs meta descriptions [#1760](https://github.com/intuit/auto/pull/1760) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update ignite [#1759](https://github.com/intuit/auto/pull/1759) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update ignite [#1757](https://github.com/intuit/auto/pull/1757) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- modify docs site colors [#1756](https://github.com/intuit/auto/pull/1756) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update docs site [#1755](https://github.com/intuit/auto/pull/1755) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.13.2 (Mon Jan 25 2021)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - fix commit message when using npx [#1752](https://github.com/intuit/auto/pull/1752) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.13.1 (Mon Jan 25 2021)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - format commit message [#1751](https://github.com/intuit/auto/pull/1751) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.13.0 (Mon Jan 25 2021)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/cocoapods`, `@auto-it/magic-zero`, `@auto-it/npm`
  - Add `@auto-it/magic-zero` Plugin [#1701](https://github.com/intuit/auto/pull/1701) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- fix jenkins setup [#1740](https://github.com/intuit/auto/pull/1740) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @typescript-eslint/eslint-plugin from 4.13.0 to 4.14.0 [#1747](https://github.com/intuit/auto/pull/1747) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jsdom from 16.2.5 to 16.2.6 [#1750](https://github.com/intuit/auto/pull/1750) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 4.3.0 to 4.3.8 [#1749](https://github.com/intuit/auto/pull/1749) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump gitlog from 4.0.3 to 4.0.4 [#1748](https://github.com/intuit/auto/pull/1748) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 16.0.1 to 16.2.0 [#1746](https://github.com/intuit/auto/pull/1746) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump change-case from 4.1.1 to 4.1.2 [#1745](https://github.com/intuit/auto/pull/1745) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.8.2 to 2.9.3 [#1743](https://github.com/intuit/auto/pull/1743) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fast-glob from 3.2.4 to 3.2.5 [#1742](https://github.com/intuit/auto/pull/1742) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump type-fest from 0.18.0 to 0.20.2 [#1744](https://github.com/intuit/auto/pull/1744) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.12.2 (Thu Jan 21 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - handle case where auto isn't used in a git repo [#1739](https://github.com/intuit/auto/pull/1739) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.12.1 (Thu Jan 21 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
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

- `auto`, `@auto-it/core`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/docker`, `@auto-it/jira`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/vscode`
  - Support "main" as a default "baseBranch" [#1736](https://github.com/intuit/auto/pull/1736) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.11.0 (Tue Jan 19 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Seth Thomas ([@sethomas](https://github.com/sethomas)), for all your work!

#### 🚀 Enhancement

- `@auto-it/npm`
  - Properly setting env var _auth for legacyAuth case for npm publish [#1735](https://github.com/intuit/auto/pull/1735) ([@sethomas](https://github.com/sethomas))

#### 🔩 Dependency Updates

- Bump @types/prettier from 2.1.5 to 2.1.6 [#1730](https://github.com/intuit/auto/pull/1730) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/conventional-commits-parser from 3.0.0 to 3.0.1 [#1708](https://github.com/intuit/auto/pull/1708) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 30.7.8 to 31.0.3 [#1715](https://github.com/intuit/auto/pull/1715) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-prettier from 3.3.0 to 3.3.1 [#1727](https://github.com/intuit/auto/pull/1727) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 26.0.14 to 26.0.20 [#1728](https://github.com/intuit/auto/pull/1728) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.11.1 to 4.13.0 [#1729](https://github.com/intuit/auto/pull/1729) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.8.2 to 4.13.0 [#1731](https://github.com/intuit/auto/pull/1731) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/twitter`
  - Bump @types/twitter-text from 2.0.0 to 3.1.0 [#1709](https://github.com/intuit/auto/pull/1709) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Seth Thomas ([@sethomas](https://github.com/sethomas))

---

# v10.10.1 (Tue Jan 19 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - properly kill spawned node child processes [#1732](https://github.com/intuit/auto/pull/1732) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.10.0 (Sat Jan 16 2021)

#### 🚀 Enhancement

- `auto`, `@auto-it/git-tag`, `@auto-it/upload-assets`
  - enable canary releases for upload-assets plugin [#1725](https://github.com/intuit/auto/pull/1725) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- `@auto-it/upload-assets`
  - set title on canary release [#1726](https://github.com/intuit/auto/pull/1726) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.9.1 (Thu Jan 14 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - take into account labels on next+canary PRs [#1722](https://github.com/intuit/auto/pull/1722) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.9.0 (Thu Jan 14 2021)

#### 🚀 Enhancement

- `@auto-it/core`
  - default `name` and `email` to the token user if no author config is found in autorc or plugin [#1720](https://github.com/intuit/auto/pull/1720) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.8.0 (Thu Jan 14 2021)

#### 🚀 Enhancement

- `@auto-it/cocoapods`
  - tap the next hook and tag prerelease versions for cocoapods [#1713](https://github.com/intuit/auto/pull/1713) ([@hborawski](https://github.com/hborawski))

#### Authors: 1

- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v10.7.0 (Thu Jan 14 2021)

#### 🚀 Enhancement

- `@auto-it/core`
  - Attempt to resolve relative plugin paths from extended config location [#1717](https://github.com/intuit/auto/pull/1717) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.6.2 (Wed Jan 13 2021)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`
  - add missing configurable option validation [#1716](https://github.com/intuit/auto/pull/1716) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- upgrade ignite [#1714](https://github.com/intuit/auto/pull/1714) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.6.1 (Tue Jan 12 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Lucas Shadler ([@lshadler](https://github.com/lshadler)), for all your work!

#### 🐛 Bug Fix

- `auto`, `@auto-it/exec`
  - fix: add debugging and error handling to exec [#1710](https://github.com/intuit/auto/pull/1710) ([@lshadler](https://github.com/lshadler))

#### Authors: 1

- Lucas Shadler ([@lshadler](https://github.com/lshadler))

---

# v10.6.0 (Mon Jan 11 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Andrew Leedham ([@AndrewLeedham](https://github.com/AndrewLeedham)), for all your work!

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/cocoapods`
  - feat: tag canaries for cocoapods plugin [#1702](https://github.com/intuit/auto/pull/1702) ([@hborawski](https://github.com/hborawski))

#### 🐛 Bug Fix

- `@auto-it/npm`
  - fix npm plugin git tag splitting [#1705](https://github.com/intuit/auto/pull/1705) ([@AndrewLeedham](https://github.com/AndrewLeedham))

#### Authors: 2

- Andrew Leedham ([@AndrewLeedham](https://github.com/AndrewLeedham))
- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v10.5.1 (Fri Jan 08 2021)

#### 🐛 Bug Fix

- `@auto-it/core`
  - default to patch for 0 non-auto labels on head PR [#1703](https://github.com/intuit/auto/pull/1703) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump eslint-plugin-prettier from 3.1.4 to 3.3.0 [#1691](https://github.com/intuit/auto/pull/1691) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/fontawesome-svg-core from 1.2.30 to 1.2.32 [#1685](https://github.com/intuit/auto/pull/1685) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.8.2 to 4.11.1 [#1700](https://github.com/intuit/auto/pull/1700) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 7.12.1 to 7.16.0 [#1697](https://github.com/intuit/auto/pull/1697) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump node-notifier from 8.0.0 to 8.0.1 [#1695](https://github.com/intuit/auto/pull/1695) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump ini from 1.3.5 to 1.3.8 [#1689](https://github.com/intuit/auto/pull/1689) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.5.2 to 10.5.3 [#1686](https://github.com/intuit/auto/pull/1686) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump array.prototype.flatmap from 1.2.3 to 1.2.4 [#1681](https://github.com/intuit/auto/pull/1681) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 24.1.0 to 24.1.3 [#1680](https://github.com/intuit/auto/pull/1680) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/microsoft-teams`, `@auto-it/slack`
  - Bump @atomist/slack-messages from 1.2.0 to 1.2.1 [#1676](https://github.com/intuit/auto/pull/1676) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.5.0 (Mon Dec 21 2020)

#### 🚀 Enhancement

- `@auto-it/package-json-utils`, `@auto-it/npm`, `@auto-it/vscode`
  - VSCode marketplace publishing plugin [#1696](https://github.com/intuit/auto/pull/1696) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- fix blog links [#1666](https://github.com/intuit/auto/pull/1666) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @types/prettier from 2.1.1 to 2.1.5 [#1655](https://github.com/intuit/auto/pull/1655) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fromentries from 1.2.1 to 1.3.2 [#1675](https://github.com/intuit/auto/pull/1675) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jsdom from 16.2.4 to 16.2.5 [#1673](https://github.com/intuit/auto/pull/1673) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.4.2 to 10.5.2 [#1672](https://github.com/intuit/auto/pull/1672) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump prettier from 2.2.0 to 2.2.1 [#1671](https://github.com/intuit/auto/pull/1671) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 16.0.0 to 16.0.1 [#1670](https://github.com/intuit/auto/pull/1670) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.6.1 to 4.8.2 [#1668](https://github.com/intuit/auto/pull/1668) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript-memoize from 1.0.0-alpha.3 to 1.0.0-alpha.4 [#1674](https://github.com/intuit/auto/pull/1674) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 30.7.7 to 30.7.8 [#1652](https://github.com/intuit/auto/pull/1652) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.4.0 to 4.8.2 [#1667](https://github.com/intuit/auto/pull/1667) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest from 26.4.2 to 26.6.3 [#1661](https://github.com/intuit/auto/pull/1661) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump prettier from 2.1.2 to 2.2.0 [#1653](https://github.com/intuit/auto/pull/1653) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 26.4.3 to 26.4.4 [#1658](https://github.com/intuit/auto/pull/1658) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump highlight.js from 9.18.1 to 9.18.5 [#1665](https://github.com/intuit/auto/pull/1665) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.17.4 to 6.19.0 [#1659](https://github.com/intuit/auto/pull/1659) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.4.2 (Mon Nov 23 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Improve release notes section rendering in npm monorepos [#1664](https://github.com/intuit/auto/pull/1664) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- fix url pr-check uses for auto's CI [#1663](https://github.com/intuit/auto/pull/1663) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.4.1 (Mon Nov 23 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Improve readability of release notes [#1662](https://github.com/intuit/auto/pull/1662) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.4.0 (Wed Nov 18 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/gradle`, `@auto-it/maven`
  - add dry-run info to afterShipIt hook [#1650](https://github.com/intuit/auto/pull/1650) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump conventional-changelog-core from 4.2.0 to 4.2.1 [#1643](https://github.com/intuit/auto/pull/1643) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump conventional-commits-parser from 3.1.0 to 3.2.0 [#1639](https://github.com/intuit/auto/pull/1639) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 30.7.6 to 30.7.7 [#1647](https://github.com/intuit/auto/pull/1647) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.14.0 to 6.15.0 [#1646](https://github.com/intuit/auto/pull/1646) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-retry from 3.0.3 to 3.0.4 [#1645](https://github.com/intuit/auto/pull/1645) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-enterprise-compatibility from 1.2.5 to 1.2.6 [#1644](https://github.com/intuit/auto/pull/1644) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-throttling from 3.3.0 to 3.3.1 [#1642](https://github.com/intuit/auto/pull/1642) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.6.0 to 4.6.1 [#1640](https://github.com/intuit/auto/pull/1640) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump type-fest from 0.16.0 to 0.18.0 [#1641](https://github.com/intuit/auto/pull/1641) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.3.0 (Fri Nov 06 2020)

#### 🚀 Enhancement

- `@auto-it/released`
  - Don't add release comment to PRs created by bots [#1637](https://github.com/intuit/auto/pull/1637) ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- `auto`, `@auto-it/core`
  - improve pr-check usage + don't fail on runs in CI base branch [#1636](https://github.com/intuit/auto/pull/1636) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.4 (Fri Nov 06 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Truncate commit hash for shorter canary versions [#1635](https://github.com/intuit/auto/pull/1635) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.3 (Wed Nov 04 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`
  - add timeout when verifying auth to remote [#1632](https://github.com/intuit/auto/pull/1632) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.2 (Wed Nov 04 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - handle multiple spaces in "lerna changed" output [#1633](https://github.com/intuit/auto/pull/1633) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.1 (Tue Nov 03 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - NPM: independent next releases update dependency versions [#1631](https://github.com/intuit/auto/pull/1631) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.2.0 (Mon Nov 02 2020)

#### 🚀 Enhancement

- `@auto-it/npm`
  - add "commitNextVersion" option to NPM plugin [#1630](https://github.com/intuit/auto/pull/1630) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.1.0 (Mon Nov 02 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Tim Ottewell ([@tinytim84](https://github.com/tinytim84)), for all your work!

#### 🚀 Enhancement

- `@auto-it/core`
  - feat: add ssh support for connecting to github [#1590](https://github.com/intuit/auto/pull/1590) ([@tinytim84](https://github.com/tinytim84) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix non-ssh release [#1629](https://github.com/intuit/auto/pull/1629) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump ts-jest from 26.4.0 to 26.4.3 [#1627](https://github.com/intuit/auto/pull/1627) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump graphql from 15.3.0 to 15.4.0 [#1625](https://github.com/intuit/auto/pull/1625) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript from 4.0.3 to 4.0.5 [#1624](https://github.com/intuit/auto/pull/1624) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/react-fontawesome from 0.1.11 to 0.1.12 [#1623](https://github.com/intuit/auto/pull/1623) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 30.7.3 to 30.7.6 [#1622](https://github.com/intuit/auto/pull/1622) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-xo from 0.32.1 to 0.33.1 [#1621](https://github.com/intuit/auto/pull/1621) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/brew`, `@auto-it/chrome`, `@auto-it/cocoapods`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/docker`, `@auto-it/exec`, `@auto-it/first-time-contributor`, `@auto-it/gem`, `@auto-it/gh-pages`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/microsoft-teams`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/pr-body-labels`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Bump tslib from 2.0.1 to 2.0.3 [#1626](https://github.com/intuit/auto/pull/1626) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Tim Ottewell ([@tinytim84](https://github.com/tinytim84))

---

# v10.0.2 (Thu Oct 29 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - make version, afterVersion, publish, and afterPublish series hooks [#1620](https://github.com/intuit/auto/pull/1620) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.0.1 (Thu Oct 29 2020)

#### 🐛 Bug Fix

- `@auto-it/first-time-contributor`
  - better first-time-contributor thanking [#1619](https://github.com/intuit/auto/pull/1619) ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- `@auto-it/core`, `@auto-it/cocoapods`, `@auto-it/crates`, `@auto-it/docker`, `@auto-it/exec`, `@auto-it/first-time-contributor`, `@auto-it/gem`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-release-notes`
  - simplify hook APIs for easier future extensibility [#1609](https://github.com/intuit/auto/pull/1609) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/brew`, `@auto-it/chrome`, `@auto-it/cocoapods`, `@auto-it/crates`, `@auto-it/docker`, `@auto-it/exec`, `@auto-it/gem`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/maven`, `@auto-it/npm`
  - Run various hooks in a --dry-run [#1604](https://github.com/intuit/auto/pull/1604) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/jira`, `@auto-it/npm`
  - correct renderChangelogLine hook usage [#1607](https://github.com/intuit/auto/pull/1607) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/all-contributors`
  - rename afterAddToChangelog hook to afterChangelog [#1606](https://github.com/intuit/auto/pull/1606) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - Git reset bugs on canary/next [#1618](https://github.com/intuit/auto/pull/1618) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump tapable from 2.0.0-beta.11 to 2.0.0 [#1615](https://github.com/intuit/auto/pull/1615) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump next-ignite from 0.6.7 to 0.7.1 [#1585](https://github.com/intuit/auto/pull/1585) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.13.0 to 6.14.0 [#1610](https://github.com/intuit/auto/pull/1610) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-import from 2.22.0 to 2.22.1 [#1611](https://github.com/intuit/auto/pull/1611) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 24.0.2 to 24.1.0 [#1612](https://github.com/intuit/auto/pull/1612) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 7.9.0 to 7.12.1 [#1613](https://github.com/intuit/auto/pull/1613) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.5.0 to 4.6.0 [#1614](https://github.com/intuit/auto/pull/1614) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/upload-assets`
  - Bump file-type from 15.0.1 to 16.0.0 [#1616](https://github.com/intuit/auto/pull/1616) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.61.0 (Tue Oct 27 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Mukul Chaware ([@mukul13](https://github.com/mukul13)), for all your work!

#### 🚀 Enhancement

- `@auto-it/microsoft-teams`, `@auto-it/slack`
  - Microsoft Teams plugin for auto [#1570](https://github.com/intuit/auto/pull/1570) ([@mukul13](https://github.com/mukul13) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Mukul Chaware ([@mukul13](https://github.com/mukul13))

---

# v9.60.1 (Fri Oct 23 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Philippe Boyd ([@philippeboyd](https://github.com/philippeboyd)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/released`
  - fix parsing PR body when it's empty [#1603](https://github.com/intuit/auto/pull/1603) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/conventional-commits`
  - doc: breaking change should bump major not minor [#1601](https://github.com/intuit/auto/pull/1601) ([@philippeboyd](https://github.com/philippeboyd))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Philippe Boyd ([@philippeboyd](https://github.com/philippeboyd))

---

# v9.60.0 (Wed Oct 21 2020)

#### 🚀 Enhancement

- `@auto-it/conventional-commits`
  - Support `!` for conventional commits and allow for any conventional-changelog preset [#1599](https://github.com/intuit/auto/pull/1599) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump tinycolor2 from 1.4.1 to 1.4.2 [#1582](https://github.com/intuit/auto/pull/1582) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.11.0 to 6.13.0 [#1594](https://github.com/intuit/auto/pull/1594) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 4.3.0 to 4.5.0 [#1595](https://github.com/intuit/auto/pull/1595) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.3.0 to 10.4.2 [#1596](https://github.com/intuit/auto/pull/1596) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 30.3.3 to 30.7.3 [#1598](https://github.com/intuit/auto/pull/1598) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.3.0 to 4.4.0 [#1565](https://github.com/intuit/auto/pull/1565) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/slack`
  - Bump @atomist/slack-messages from 1.1.1 to 1.2.0 [#1583](https://github.com/intuit/auto/pull/1583) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.59.1 (Thu Oct 15 2020)

#### 🐛 Bug Fix

- `@auto-it/gh-pages`
  - Add better verbose logging in gh-pages plugin [#1591](https://github.com/intuit/auto/pull/1591) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.59.0 (Wed Oct 14 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/npm`
  - Group monorepo changelog lines if possivle [#1589](https://github.com/intuit/auto/pull/1589) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.58.0 (Tue Oct 13 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Drew Cortright ([@dcortright](https://github.com/dcortright)), for all your work!

#### 🚀 Enhancement

- `@auto-it/cocoapods`
  - feat: adding cocoapod verbose logging [#1580](https://github.com/intuit/auto/pull/1580) ([@dcortright](https://github.com/dcortright))

#### Authors: 1

- Drew Cortright ([@dcortright](https://github.com/dcortright))

---

# v9.57.0 (Thu Oct 08 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Kendall Gassner ([@kendallgassner](https://github.com/kendallgassner)), for all your work!

#### 🚀 Enhancement

- `@auto-it/all-contributors`
  - auto generate contributors if a contributors list exists but none are… [#1575](https://github.com/intuit/auto/pull/1575) ([@kendallgassner](https://github.com/kendallgassner) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add noVersionPrefix to docs [#1577](https://github.com/intuit/auto/pull/1577) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Kendall Gassner ([@kendallgassner](https://github.com/kendallgassner))

---

# v9.56.0 (Thu Oct 08 2020)

#### 🚀 Enhancement

- `@auto-it/cocoapods`
  - feat: run pod lib lint during dryrun [#1576](https://github.com/intuit/auto/pull/1576) ([@hborawski](https://github.com/hborawski))

#### Authors: 1

- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v9.55.0 (Wed Oct 07 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/all-contributors`
  - add dryRun to BeforeShipItContext [#1572](https://github.com/intuit/auto/pull/1572) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- `@auto-it/all-contributors`
  - fix erroneous log [#1573](https://github.com/intuit/auto/pull/1573) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.54.6 (Wed Oct 07 2020)

#### 🐛 Bug Fix

- `@auto-it/all-contributors`
  - add logging if all-contributors rc isn't found or has errors [#1571](https://github.com/intuit/auto/pull/1571) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.54.5 (Tue Oct 06 2020)

#### 🐛 Bug Fix

- `@auto-it/bot-list`
  - add invalid-email-address to botlist [#1569](https://github.com/intuit/auto/pull/1569) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.54.4 (Tue Oct 06 2020)

#### 🐛 Bug Fix

- `@auto-it/git-tag`
  - fix `next` release prefixing in git-tag plugin [#1568](https://github.com/intuit/auto/pull/1568) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.54.3 (Tue Oct 06 2020)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Sanjay Johny ([@san45](https://github.com/san45))

:heart: Check your git settings! ([@invalid-email-address](https://github.com/invalid-email-address))

#### 🐛 Bug Fix

- add auto release to CI [#1](https://github.com/intuit/auto/pull/1) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/slack`
  - add extra padding to nested lists in slack message [#1566](https://github.com/intuit/auto/pull/1566) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Added emojis to README.md [#1559](https://github.com/intuit/auto/pull/1559) ([@san45](https://github.com/san45))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Sanjay Johny ([@san45](https://github.com/san45))

---

# v9.54.2 (Mon Oct 05 2020)

#### 🐛 Bug Fix

- `@auto-it/all-contributors`
  - fix diff limit warning in all-contributors plugin [#1562](https://github.com/intuit/auto/pull/1562) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.54.1 (Mon Oct 05 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Christy Jacob ([@christyjacob4](https://github.com/christyjacob4)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - upgrade gitlog [#1561](https://github.com/intuit/auto/pull/1561) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- chore: updated docs:watch script [#1557](https://github.com/intuit/auto/pull/1557) ([@christyjacob4](https://github.com/christyjacob4))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Christy Jacob ([@christyjacob4](https://github.com/christyjacob4))

---

# v9.54.0 (Thu Oct 01 2020)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: null[@agarwali4411](https://github.com/agarwali4411)

:heart: Arturo Silva ([@artmsilva](https://github.com/artmsilva))

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/pr-body-labels`
  - Add pr-body-labels plugin [#1554](https://github.com/intuit/auto/pull/1554) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Improved Docs [#1555](https://github.com/intuit/auto/pull/1555) ([@agarwali4411](https://github.com/agarwali4411))
- docs: fix typo [#1547](https://github.com/intuit/auto/pull/1547) ([@artmsilva](https://github.com/artmsilva))
- `@auto-it/pr-body-labels`
  - Pr label body Docs update [#1556](https://github.com/intuit/auto/pull/1556) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`
  - Fix docs [#1548](https://github.com/intuit/auto/pull/1548) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 18.0.3 to 18.0.6 [#1528](https://github.com/intuit/auto/pull/1528) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @typescript-eslint/eslint-plugin from 4.1.1 to 4.3.0 [#1549](https://github.com/intuit/auto/pull/1549) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pretty-ms from 7.0.0 to 7.0.1 [#1550](https://github.com/intuit/auto/pull/1550) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 7.8.0 to 7.9.0 [#1529](https://github.com/intuit/auto/pull/1529) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump prettier from 2.0.5 to 2.1.2 [#1544](https://github.com/intuit/auto/pull/1544) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 26.2.0 to 26.4.0 [#1543](https://github.com/intuit/auto/pull/1543) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/prettier from 2.0.2 to 2.1.1 [#1542](https://github.com/intuit/auto/pull/1542) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 26.0.13 to 26.0.14 [#1539](https://github.com/intuit/auto/pull/1539) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 24.0.1 to 24.0.2 [#1538](https://github.com/intuit/auto/pull/1538) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.2.11 to 10.3.0 [#1530](https://github.com/intuit/auto/pull/1530) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 4.1.1 to 4.3.0 [#1551](https://github.com/intuit/auto/pull/1551) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump node-fetch from 2.6.0 to 2.6.1 [#1522](https://github.com/intuit/auto/pull/1522) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- Bump @types/jest from 26.0.10 to 26.0.13 [#1516](https://github.com/intuit/auto/pull/1516) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump next-ignite from 0.4.2 to 0.6.6 [#1531](https://github.com/intuit/auto/pull/1531) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/semver from 7.3.3 to 7.3.4 [#1533](https://github.com/intuit/auto/pull/1533) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 15.0.0 to 15.0.1 [#1534](https://github.com/intuit/auto/pull/1534) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump bl from 1.2.2 to 1.2.3 [#1526](https://github.com/intuit/auto/pull/1526) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/slack`
  - Bump node-fetch from 2.6.0 to 2.6.1 in /plugins/slack [#1524](https://github.com/intuit/auto/pull/1524) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- `@auto-it/core`
  - Bump node-fetch from 2.6.0 to 2.6.1 in /packages/core [#1523](https://github.com/intuit/auto/pull/1523) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/cocoapods`, `@auto-it/crates`, `@auto-it/docker`, `@auto-it/first-time-contributor`, `@auto-it/gem`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/maven`, `@auto-it/npm`
  - Bump eslint-plugin-jest from 23.20.0 to 24.0.1 [#1532](https://github.com/intuit/auto/pull/1532) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.17.2 to 6.17.4 [#1545](https://github.com/intuit/auto/pull/1545) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 5

- [@agarwali4411](https://github.com/agarwali4411)
- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- [@dependabot[bot]](https://github.com/dependabot[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Arturo Silva ([@artmsilva](https://github.com/artmsilva))

---

# v9.53.1 (Tue Sep 08 2020)

#### 🐛 Bug Fix

- `@auto-it/gradle`
  - remove log from beforeRun so `version` command only prints version [#1520](https://github.com/intuit/auto/pull/1520) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.53.0 (Tue Sep 08 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Richard Simpson ([@RichiCoder1](https://github.com/RichiCoder1)), for all your work!

#### 🚀 Enhancement

- `auto`, `@auto-it/docker`
  - Add Docker Publish Plugin [#1510](https://github.com/intuit/auto/pull/1510) ([@RichiCoder1](https://github.com/RichiCoder1))

#### 🐛 Bug Fix

- `@auto-it/npm`
  - respect registry set in lerna publish command [#1519](https://github.com/intuit/auto/pull/1519) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @typescript-eslint/parser from 3.9.1 to 3.10.1 [#1505](https://github.com/intuit/auto/pull/1505) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 30.3.0 to 30.3.3 [#1518](https://github.com/intuit/auto/pull/1518) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.8.1 to 2.8.2 [#1513](https://github.com/intuit/auto/pull/1513) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jsdom from 16.2.3 to 16.2.4 [#1515](https://github.com/intuit/auto/pull/1515) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump io-ts from 2.2.9 to 2.2.10 [#1495](https://github.com/intuit/auto/pull/1495) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 3.9.1 to 4.0.0 [#1506](https://github.com/intuit/auto/pull/1506) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest-circus from 26.4.0 to 26.4.2 [#1499](https://github.com/intuit/auto/pull/1499) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 4.2.5 to 4.3.0 [#1517](https://github.com/intuit/auto/pull/1517) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 7.6.0 to 7.8.0 [#1502](https://github.com/intuit/auto/pull/1502) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 30.2.1 to 30.3.0 [#1504](https://github.com/intuit/auto/pull/1504) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump simple-react-lightbox from 3.2.3 to 3.3.4 [#1497](https://github.com/intuit/auto/pull/1497) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jsdom from 16.3.0 to 16.4.0 [#1496](https://github.com/intuit/auto/pull/1496) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest from 26.3.0 to 26.4.2 [#1494](https://github.com/intuit/auto/pull/1494) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/upload-assets`
  - Bump file-type from 14.7.1 to 15.0.0 [#1512](https://github.com/intuit/auto/pull/1512) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Richard Simpson ([@RichiCoder1](https://github.com/RichiCoder1))

---

# v9.52.0 (Fri Aug 21 2020)

#### 🚀 Enhancement

- `@auto-it/npm`
  - expose option to disable monorepo package aware changelog [#1489](https://github.com/intuit/auto/pull/1489) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.51.0 (Thu Aug 20 2020)

#### 🚀 Enhancement

- `@auto-it/cocoapods`
  - feat: option to specify a different command to use for pod [#1487](https://github.com/intuit/auto/pull/1487) ([@hborawski](https://github.com/hborawski) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v9.50.12 (Thu Aug 20 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, rachana ([@rachanamamillapalli](https://github.com/rachanamamillapalli)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/gradle`
  - return 0.0.0 as default when no version found in gradle properties [#1396](https://github.com/intuit/auto/pull/1396) ([@rachanamamillapalli](https://github.com/rachanamamillapalli))

#### 🔩 Dependency Updates

- Bump @types/array.prototype.flatmap from 1.2.1 to 1.2.2 [#1477](https://github.com/intuit/auto/pull/1477) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 3.8.0 to 3.9.1 [#1478](https://github.com/intuit/auto/pull/1478) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/semver from 7.3.1 to 7.3.3 [#1479](https://github.com/intuit/auto/pull/1479) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest-circus from 26.3.0 to 26.4.0 [#1481](https://github.com/intuit/auto/pull/1481) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 3.8.0 to 3.9.1 [#1482](https://github.com/intuit/auto/pull/1482) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 26.1.3 to 26.2.0 [#1484](https://github.com/intuit/auto/pull/1484) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.17.0 to 6.17.2 [#1485](https://github.com/intuit/auto/pull/1485) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- rachana ([@rachanamamillapalli](https://github.com/rachanamamillapalli))

---

# v9.50.11 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- `@auto-it/all-contributors`
  - Fix adding multiple contributors at once [#1476](https://github.com/intuit/auto/pull/1476) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.10 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - only post partial release notes to next releases [#1474](https://github.com/intuit/auto/pull/1474) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- fix some links in docs [#1475](https://github.com/intuit/auto/pull/1475) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.9 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix label initialization [#1473](https://github.com/intuit/auto/pull/1473) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.8 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - correct behavior for lerna project with private packages [#1472](https://github.com/intuit/auto/pull/1472) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.7 (Fri Aug 14 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`
  - fix default bump type [#1470](https://github.com/intuit/auto/pull/1470) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.6 (Thu Aug 13 2020)

#### 🐛 Bug Fix

- `@auto-it/upload-assets`
  - don't set baseUrl for public asset upload [#1468](https://github.com/intuit/auto/pull/1468) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.5 (Thu Aug 13 2020)

#### 🐛 Bug Fix

- `@auto-it/first-time-contributor`
  - 🤖 don't thank any of the bots in bot-list [#1467](https://github.com/intuit/auto/pull/1467) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.4 (Thu Aug 13 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/upload-assets`
  - correct enterprise upload assets baseUrl [#1466](https://github.com/intuit/auto/pull/1466) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/chrome`, `@auto-it/cocoapods`, `@auto-it/crates`, `@auto-it/gem`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/maven`, `@auto-it/npm`
  - Improve package manager plugin docs [#1465](https://github.com/intuit/auto/pull/1465) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.3 (Thu Aug 13 2020)

#### 🐛 Bug Fix

- `@auto-it/cocoapods`
  - feat: add option to pass additional flags to pod repo push [#1464](https://github.com/intuit/auto/pull/1464) ([@hborawski](https://github.com/hborawski))

#### Authors: 1

- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v9.50.2 (Tue Aug 11 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - Fix finding available canary version and add logging [#1460](https://github.com/intuit/auto/pull/1460) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 18.0.1 to 18.0.3 [#1455](https://github.com/intuit/auto/pull/1455) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump jest from 26.2.2 to 26.3.0 [#1452](https://github.com/intuit/auto/pull/1452) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 26.0.7 to 26.0.9 [#1459](https://github.com/intuit/auto/pull/1459) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.7.0 to 2.8.1 [#1458](https://github.com/intuit/auto/pull/1458) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 14.7.0 to 14.7.1 [#1456](https://github.com/intuit/auto/pull/1456) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest-circus from 26.2.2 to 26.3.0 [#1451](https://github.com/intuit/auto/pull/1451) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/brew`, `@auto-it/chrome`, `@auto-it/cocoapods`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/exec`, `@auto-it/first-time-contributor`, `@auto-it/gem`, `@auto-it/gh-pages`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Bump tslib from 2.0.0 to 2.0.1 [#1457](https://github.com/intuit/auto/pull/1457) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump cosmiconfig from 6.0.0 to 7.0.0 [#1454](https://github.com/intuit/auto/pull/1454) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.1 (Mon Aug 10 2020)

#### 🐛 Bug Fix

- publish auto with 'exact' versioning [#1450](https://github.com/intuit/auto/pull/1450) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- improve jenkins docs [#1447](https://github.com/intuit/auto/pull/1447) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.50.0 (Fri Aug 07 2020)

#### 🚀 Enhancement

- `@auto-it/all-contributors`
  - fix: use GH_TOKEN if PRIVATE_TOKEN is not set [#1446](https://github.com/intuit/auto/pull/1446) ([@hborawski](https://github.com/hborawski))

#### Authors: 1

- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v9.49.6 (Fri Aug 07 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - Fix Independent `next` versioning [#1445](https://github.com/intuit/auto/pull/1445) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Revert "Merge pull request #1439 from intuit/docss" [#1444](https://github.com/intuit/auto/pull/1444) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- upgrade ignite for purgeCSS [#1439](https://github.com/intuit/auto/pull/1439) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.5 (Thu Aug 06 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/exec`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/upload-assets`
  - upgrade eslint + ensure all imported packages are in package.json [#1442](https://github.com/intuit/auto/pull/1442) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- upgrade ignite for purgeCSS [#1439](https://github.com/intuit/auto/pull/1439) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- anonimize IPs for analytics [#1438](https://github.com/intuit/auto/pull/1438) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Make non-npm docs clearer [#1437](https://github.com/intuit/auto/pull/1437) ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- `@auto-it/core`, `@auto-it/maven`, `@auto-it/npm`
  - Fix lerna independent "next" releases [#1429](https://github.com/intuit/auto/pull/1429) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump io-ts from 2.2.7 to 2.2.9 [#1430](https://github.com/intuit/auto/pull/1430) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 14.6.2 to 14.7.0 [#1432](https://github.com/intuit/auto/pull/1432) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript from 3.9.6 to 3.9.7 [#1433](https://github.com/intuit/auto/pull/1433) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 30.0.2 to 30.1.0 [#1434](https://github.com/intuit/auto/pull/1434) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.19.0 to 23.20.0 [#1435](https://github.com/intuit/auto/pull/1435) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest-circus from 26.1.0 to 26.2.2 [#1436](https://github.com/intuit/auto/pull/1436) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.3 (Fri Jul 31 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`, `@auto-it/first-time-contributor`, `@auto-it/released`
  - Fix various rate limiting issues [#1424](https://github.com/intuit/auto/pull/1424) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.2 (Fri Jul 31 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - don't prefix tags in lerna independent mode [#1427](https://github.com/intuit/auto/pull/1427) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/npm`
  - add docs about running lengthy builds during publish [#1420](https://github.com/intuit/auto/pull/1420) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- [Security] Bump elliptic from 6.4.1 to 6.5.3 [#1417](https://github.com/intuit/auto/pull/1417) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- update ignite [#1421](https://github.com/intuit/auto/pull/1421) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.1 (Wed Jul 29 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - don't leak GH_TOKEN in exec promise output [#1419](https://github.com/intuit/auto/pull/1419) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.49.0 (Wed Jul 29 2020)

#### 🚀 Enhancement

- `@auto-it/maven`
  - Implement full maven release workflow [#1413](https://github.com/intuit/auto/pull/1413) ([@stabbylambda](https://github.com/stabbylambda) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- David Stone ([@stabbylambda](https://github.com/stabbylambda))

---

# v9.48.3 (Wed Jul 29 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - respect registry set at top level for lerna [#1412](https://github.com/intuit/auto/pull/1412) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/conventional-commits`
  - add Github Package Registry docs [#1414](https://github.com/intuit/auto/pull/1414) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.48.2 (Tue Jul 28 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Stream logs in verbose mode [#1409](https://github.com/intuit/auto/pull/1409) ([@stabbylambda](https://github.com/stabbylambda))
- `@auto-it/gh-pages`
  - add helpful error message when git state isn't clean for gh-pages plugin [#1410](https://github.com/intuit/auto/pull/1410) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - catch errors when finding tags on next [#1402](https://github.com/intuit/auto/pull/1402) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump eslint-plugin-jest from 23.18.0 to 23.19.0 [#1404](https://github.com/intuit/auto/pull/1404) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/fontawesome-svg-core from 1.2.29 to 1.2.30 [#1407](https://github.com/intuit/auto/pull/1407) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest from 25.5.4 to 26.1.0 [#1406](https://github.com/intuit/auto/pull/1406) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.16.1 to 6.17.0 [#1405](https://github.com/intuit/auto/pull/1405) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/maven`
  - Bump @types/jest from 26.0.0 to 26.0.7 [#1403](https://github.com/intuit/auto/pull/1403) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- David Stone ([@stabbylambda](https://github.com/stabbylambda))

---

# v9.48.1 (Thu Jul 23 2020)

#### 🐛 Bug Fix

- `auto`
  - add error message around mistmatched auto versions [#1399](https://github.com/intuit/auto/pull/1399) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.48.0 (Thu Jul 23 2020)

#### 🚀 Enhancement

- `@auto-it/npm`
  - skip publish for private npm packages [#1397](https://github.com/intuit/auto/pull/1397) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.47.2 (Wed Jul 22 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Lucas Curti ([@lucascurti](https://github.com/lucascurti)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/chrome`
  - fix Chrome manifest copy to build folder [#1395](https://github.com/intuit/auto/pull/1395) ([@lucascurti](https://github.com/lucascurti))

#### 🔩 Dependency Updates

- Bump @octokit/rest from 18.0.0 to 18.0.1 [#1390](https://github.com/intuit/auto/pull/1390) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/graphql from 4.5.1 to 4.5.2 [#1391](https://github.com/intuit/auto/pull/1391) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pkg from 4.4.8 to 4.4.9 [#1389](https://github.com/intuit/auto/pull/1389) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.6.1 to 2.7.0 [#1388](https://github.com/intuit/auto/pull/1388) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fromentries from 1.2.0 to 1.2.1 [#1387](https://github.com/intuit/auto/pull/1387) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-import from 2.21.1 to 2.22.0 [#1386](https://github.com/intuit/auto/pull/1386) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/free-solid-svg-icons from 5.13.0 to 5.14.0 [#1384](https://github.com/intuit/auto/pull/1384) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`
  - Bump eslint-plugin-jsdoc from 28.6.1 to 30.0.2 [#1385](https://github.com/intuit/auto/pull/1385) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/maven`
  - Bump ts-jest from 25.5.1 to 26.1.3 [#1392](https://github.com/intuit/auto/pull/1392) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Lucas Curti ([@lucascurti](https://github.com/lucascurti))

---

# v9.47.1 (Mon Jul 20 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fixes baseBranch from config [#1393](https://github.com/intuit/auto/pull/1393) ([@10hendersonm](https://github.com/10hendersonm))

#### Authors: 1

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))

---

# v9.47.0 (Thu Jul 16 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, David Stone ([@stabbylambda](https://github.com/stabbylambda)), for all your work!

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Add `--exists $LABEL` to label command [#1383](https://github.com/intuit/auto/pull/1383) ([@stabbylambda](https://github.com/stabbylambda))

#### Authors: 1

- David Stone ([@stabbylambda](https://github.com/stabbylambda))

---

# v9.46.0 (Tue Jul 14 2020)

#### 🚀 Enhancement

- `@auto-it/git-tag`, `@auto-it/npm`
  - push prerelease branch in addition to tags [#1382](https://github.com/intuit/auto/pull/1382) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Bump next-ignite from 0.3.3 to 0.4.1 [#1376](https://github.com/intuit/auto/pull/1376) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump @types/prettier from 2.0.1 to 2.0.2 [#1379](https://github.com/intuit/auto/pull/1379) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fast-glob from 3.2.2 to 3.2.4 [#1378](https://github.com/intuit/auto/pull/1378) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump type-fest from 0.15.1 to 0.16.0 [#1377](https://github.com/intuit/auto/pull/1377) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jsdom from 16.2.2 to 16.3.0 [#1375](https://github.com/intuit/auto/pull/1375) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.13.1 to 23.18.0 [#1373](https://github.com/intuit/auto/pull/1373) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest-circus from 26.0.1 to 26.1.0 [#1372](https://github.com/intuit/auto/pull/1372) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.16.0 to 6.16.1 [#1374](https://github.com/intuit/auto/pull/1374) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

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

- `@auto-it/core`, `@auto-it/conventional-commits`, `@auto-it/jira`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/slack`
  - allow default SEMVER label to be configured [#1371](https://github.com/intuit/auto/pull/1371) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.44.0 (Sat Jul 11 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - add .autorc "author" option that combines email + name [#1370](https://github.com/intuit/auto/pull/1370) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.43.2 (Sat Jul 11 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - exit in CI when no valid git email + name found [#1369](https://github.com/intuit/auto/pull/1369) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Update bug_report.md [#1368](https://github.com/intuit/auto/pull/1368) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update contributor count [#1364](https://github.com/intuit/auto/pull/1364) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.43.1 (Tue Jul 07 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Lucas Shadler ([@lshadler](https://github.com/lshadler)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix: prioritize base branch head ref [#1363](https://github.com/intuit/auto/pull/1363) ([@lshadler](https://github.com/lshadler) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Lucas Shadler ([@lshadler](https://github.com/lshadler))

---

# v9.43.0 (Tue Jul 07 2020)

#### 🚀 Enhancement

- `@auto-it/npm`
  - npm: find available canary version [#1361](https://github.com/intuit/auto/pull/1361) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.42.0 (Tue Jul 07 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - add --to flag to "auto release" [#1362](https://github.com/intuit/auto/pull/1362) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.41.1 (Mon Jul 06 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - attempt to construct the GitHub graphql root API endpoint if githubApi is provided [#1349](https://github.com/intuit/auto/pull/1349) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @fortawesome/fontawesome-svg-core from 1.2.28 to 1.2.29 [#1360](https://github.com/intuit/auto/pull/1360) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 28.5.1 to 28.6.1 [#1359](https://github.com/intuit/auto/pull/1359) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript from 3.9.5 to 3.9.6 [#1358](https://github.com/intuit/auto/pull/1358) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/react-fontawesome from 0.1.9 to 0.1.11 [#1357](https://github.com/intuit/auto/pull/1357) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/semver from 7.2.0 to 7.3.1 [#1356](https://github.com/intuit/auto/pull/1356) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 14.3.0 to 14.6.2 [#1354](https://github.com/intuit/auto/pull/1354) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump graphql from 15.2.0 to 15.3.0 [#1353](https://github.com/intuit/auto/pull/1353) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump enquirer from 2.3.5 to 2.3.6 [#1352](https://github.com/intuit/auto/pull/1352) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump simple-react-lightbox from 3.1.2-3 to 3.2.3 [#1351](https://github.com/intuit/auto/pull/1351) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.41.0 (Mon Jul 06 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/all-contributors`
  - Enable easier "all-contributors" usage on non-javascript project + add extra contributors to changelogs [#1350](https://github.com/intuit/auto/pull/1350) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- don't generate docs for node_modules [#1348](https://github.com/intuit/auto/pull/1348) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix docs dark mode [#1347](https://github.com/intuit/auto/pull/1347) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update ignite [#1346](https://github.com/intuit/auto/pull/1346) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- docs: fix mobile search [#1345](https://github.com/intuit/auto/pull/1345) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix search breaking on nav [#1344](https://github.com/intuit/auto/pull/1344) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update ignite [#1343](https://github.com/intuit/auto/pull/1343) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add docsearch [#1342](https://github.com/intuit/auto/pull/1342) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.40.6 (Thu Jul 02 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Spencer Hamm ([@spentacular](https://github.com/spentacular)), for all your work!

#### 🐛 Bug Fix

- `auto`
  - log full error [#1341](https://github.com/intuit/auto/pull/1341) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- update ignite [#1338](https://github.com/intuit/auto/pull/1338) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update ignite + fix open in new tab [#1337](https://github.com/intuit/auto/pull/1337) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Updates afterRelease documented parameters [#1334](https://github.com/intuit/auto/pull/1334) ([@10hendersonm](https://github.com/10hendersonm))
- better dark mode [#1328](https://github.com/intuit/auto/pull/1328) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add dark mode favicon [#1327](https://github.com/intuit/auto/pull/1327) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix flash of unstyled paragraph + add title to home page [#1326](https://github.com/intuit/auto/pull/1326) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`
  - fix: command example for pr-status [#1339](https://github.com/intuit/auto/pull/1339) ([@spentacular](https://github.com/spentacular))
- `@auto-it/exec`
  - Fix docs links [#1336](https://github.com/intuit/auto/pull/1336) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump lerna from 3.22.0 to 3.22.1 [#1332](https://github.com/intuit/auto/pull/1332) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump io-ts from 2.2.4 to 2.2.7 [#1331](https://github.com/intuit/auto/pull/1331) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump graphql from 15.1.0 to 15.2.0 [#1333](https://github.com/intuit/auto/pull/1333) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.31.0 to 2.34.0 [#1330](https://github.com/intuit/auto/pull/1330) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-throttling from 3.2.2 to 3.3.0 [#1329](https://github.com/intuit/auto/pull/1329) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 4

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))
- Spencer Hamm ([@spentacular](https://github.com/spentacular))

---

# v9.40.5 (Thu Jun 25 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - standardize default label colors [#1324](https://github.com/intuit/auto/pull/1324) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- upgrade next-ignite - adds page titles and favicon [#1325](https://github.com/intuit/auto/pull/1325) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.40.4 (Wed Jun 24 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Next - Adds intermediary check for newest release before releasing entire history [#1323](https://github.com/intuit/auto/pull/1323) ([@10hendersonm](https://github.com/10hendersonm))

#### Authors: 1

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))

---

# v9.40.3 (Wed Jun 24 2020)

#### 🐛 Bug Fix

- `@auto-it/bot-list`, `@auto-it/maven`
  - Correct some license issues and ignore snyk bot [#1321](https://github.com/intuit/auto/pull/1321) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.40.2 (Wed Jun 24 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - stop parsing release notes when we hit an automated comment created by auto [#1320](https://github.com/intuit/auto/pull/1320) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump eslint-plugin-jsdoc from 25.4.2 to 28.5.1 [#1319](https://github.com/intuit/auto/pull/1319) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-retry from 3.0.1 to 3.0.3 [#1304](https://github.com/intuit/auto/pull/1304) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-throttling from 3.2.1 to 3.2.2 [#1309](https://github.com/intuit/auto/pull/1309) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 25.4.2 to 27.0.7 [#1311](https://github.com/intuit/auto/pull/1311) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.2.6 to 10.2.11 [#1314](https://github.com/intuit/auto/pull/1314) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump all-contributors-cli from 6.15.0 to 6.16.0 [#1306](https://github.com/intuit/auto/pull/1306) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump type-fest from 0.15.0 to 0.15.1 [#1307](https://github.com/intuit/auto/pull/1307) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump chalk from 4.0.0 to 4.1.0 [#1310](https://github.com/intuit/auto/pull/1310) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-prettier from 3.1.3 to 3.1.4 [#1305](https://github.com/intuit/auto/pull/1305) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/first-time-contributor`, `@auto-it/slack`, `@auto-it/upload-assets`
  - Bump @octokit/rest from 17.9.0 to 18.0.0 [#1301](https://github.com/intuit/auto/pull/1301) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.40.1 (Wed Jun 24 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Snyk bot ([@snyk-bot](https://github.com/snyk-bot)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - Update makeRelease to support 'from' and 'useVersion' options with build part of semver [#1315](https://github.com/intuit/auto/pull/1315) ([@bnigh](https://github.com/bnigh))

#### 🔩 Dependency Updates

- `@auto-it/maven`
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

- `@auto-it/core`, `@auto-it/exec`, `@auto-it/maven`, `@auto-it/s3`
  - Remove maven release plugin requirement [#1295](https://github.com/intuit/auto/pull/1295) ([@rbellamy](https://github.com/rbellamy) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- fix curl version update [#1318](https://github.com/intuit/auto/pull/1318) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### ⚠️ Pushed to `master`

- actually fix docs path ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- fix home page icons first load [#1308](https://github.com/intuit/auto/pull/1308) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix blog [#1302](https://github.com/intuit/auto/pull/1302) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add image lightboxes and fix some bugs in ignite [#1300](https://github.com/intuit/auto/pull/1300) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Fix images in docs [#1299](https://github.com/intuit/auto/pull/1299) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add logos and frontmatters to docs [#1297](https://github.com/intuit/auto/pull/1297) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- better docs theming [#1296](https://github.com/intuit/auto/pull/1296) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add hook overview image [#1281](https://github.com/intuit/auto/pull/1281) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/cocoapods`, `@auto-it/exec`, `@auto-it/gradle`, `@auto-it/omit-commits`
  - docs design review [#1298](https://github.com/intuit/auto/pull/1298) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/all-contributors`, `@auto-it/brew`, `@auto-it/chrome`, `@auto-it/cocoapods`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/exec`, `@auto-it/first-time-contributor`, `@auto-it/gem`, `@auto-it/gh-pages`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - switch to next-ignite [#1293](https://github.com/intuit/auto/pull/1293) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump typescript from 3.9.3 to 3.9.5 [#1288](https://github.com/intuit/auto/pull/1288) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump graphql from 15.0.0 to 15.1.0 [#1290](https://github.com/intuit/auto/pull/1290) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tapable from 2.0.0-beta.10 to 2.0.0-beta.11 [#1291](https://github.com/intuit/auto/pull/1291) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 25.2.1 to 25.2.3 [#1286](https://github.com/intuit/auto/pull/1286) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-import from 2.20.2 to 2.21.1 [#1283](https://github.com/intuit/auto/pull/1283) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/brew`, `@auto-it/chrome`, `@auto-it/cocoapods`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/exec`, `@auto-it/first-time-contributor`, `@auto-it/gem`, `@auto-it/gh-pages`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Bump tslib from 1.11.1 to 2.0.0 [#1289](https://github.com/intuit/auto/pull/1289) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.15.0 to 6.16.0 [#1284](https://github.com/intuit/auto/pull/1284) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`
  - Bump command-line-application from 0.9.6 to 0.10.1 [#1282](https://github.com/intuit/auto/pull/1282) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v9.39.0 (Thu Jun 04 2020)

#### 🚀 Enhancement

- `@auto-it/cocoapods`
  - check for autoPublishRepo before trying to add it [#1277](https://github.com/intuit/auto/pull/1277) ([@hborawski](https://github.com/hborawski))

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix automated old branch creation [#1278](https://github.com/intuit/auto/pull/1278) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v9.38.2 (Wed Jun 03 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - if canary --force provided default to patch [#1275](https://github.com/intuit/auto/pull/1275) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.38.1 (Wed Jun 03 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix next release start commit calculation when tags are package@version [#1273](https://github.com/intuit/auto/pull/1273) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- `@auto-it/core`
  - chore: accurately name variable within inOldVersionBranch() [#1271](https://github.com/intuit/auto/pull/1271) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

#### 🔩 Dependency Updates

- Bump io-ts from 2.2.2 to 2.2.4 [#1269](https://github.com/intuit/auto/pull/1269) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Brian Muenzenmeyer ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

---

# v9.38.0 (Sun May 31 2020)

#### 🚀 Enhancement

- `@auto-it/npm`
  - add legacyAuth option [#1268](https://github.com/intuit/auto/pull/1268) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.37.0 (Fri May 29 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/git-tag`, `@auto-it/npm`
  - add more contextual information to next hook [#1265](https://github.com/intuit/auto/pull/1265) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.36.4 (Thu May 28 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Marty Henderson ([@10hendersonm](https://github.com/10hendersonm)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix(git): Prevents getLastTagNotInBaseBranch from returning a commit hash [#1262](https://github.com/intuit/auto/pull/1262) ([@10hendersonm](https://github.com/10hendersonm))

#### Authors: 1

- Marty Henderson ([@10hendersonm](https://github.com/10hendersonm))

---

# v9.36.3 (Thu May 28 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - calculate next release notes using the latest fork commit not the first [#1264](https://github.com/intuit/auto/pull/1264) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump lint-staged from 10.1.7 to 10.2.6 [#1256](https://github.com/intuit/auto/pull/1256) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-throttling from 3.2.0 to 3.2.1 [#1257](https://github.com/intuit/auto/pull/1257) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/semver from 7.1.0 to 7.2.0 [#1252](https://github.com/intuit/auto/pull/1252) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-enterprise-compatibility from 1.2.2 to 1.2.4 [#1253](https://github.com/intuit/auto/pull/1253) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.6.0 to 2.6.1 [#1254](https://github.com/intuit/auto/pull/1254) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lerna from 3.21.0 to 3.22.0 [#1250](https://github.com/intuit/auto/pull/1250) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`, `@auto-it/cocoapods`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/gem`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/slack`
  - Bump typescript from 3.8.3 to 3.9.3 [#1255](https://github.com/intuit/auto/pull/1255) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump type-fest from 0.13.1 to 0.15.0 [#1259](https://github.com/intuit/auto/pull/1259) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.14.2 to 6.15.0 [#1251](https://github.com/intuit/auto/pull/1251) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.36.2 (Sat May 23 2020)

#### 🐛 Bug Fix

- `@auto-it/maven`
  - Fix missing use of MAVEN_SNAPSHOT_BRANCH [#1242](https://github.com/intuit/auto/pull/1242) ([@rbellamy](https://github.com/rbellamy))

#### Authors: 1

- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v9.36.1 (Fri May 22 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/npm`
  - fix reduce without initial value [#1249](https://github.com/intuit/auto/pull/1249) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.36.0 (Fri May 22 2020)

#### 🚀 Enhancement

- `@auto-it/slack`
  - Slack code blocks [#1247](https://github.com/intuit/auto/pull/1247) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- move updating curl version to an auto plugin [#1248](https://github.com/intuit/auto/pull/1248) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.35.3 (Fri May 22 2020)

#### 🐛 Bug Fix

- `@auto-it/bot-list`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/brew`, `@auto-it/first-time-contributor`, `@auto-it/gem`, `@auto-it/git-tag`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/upload-assets`
  - Changelog formatting [#1246](https://github.com/intuit/auto/pull/1246) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.35.2 (Fri May 22 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Kevin Wolf ([@kevinwolfdev](https://github.com/kevinwolfdev)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/conventional-commits`, `@auto-it/slack`
  - Extend default labels [#1206](https://github.com/intuit/auto/pull/1206) ([@kevinwolfdev](https://github.com/kevinwolfdev) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- automatically update install version in docs [#1244](https://github.com/intuit/auto/pull/1244) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Kevin Wolf ([@kevinwolfdev](https://github.com/kevinwolfdev))

---

# v9.35.1 (Thu May 21 2020)

#### 🐛 Bug Fix

- `@auto-it/released`, `@auto-it/slack`
  - fallback to tag name when the release has no name [#1243](https://github.com/intuit/auto/pull/1243) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.35.0 (Thu May 21 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy)), for all your work!

#### 🚀 Enhancement

- `@auto-it/maven`
  - Maven plugin support for configurable SNAPSHOT branch [#1241](https://github.com/intuit/auto/pull/1241) ([@rbellamy](https://github.com/rbellamy))

#### Authors: 1

- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v9.34.1 (Tue May 19 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - sub-package changelogs: Handle when no changes made to monorepo packages [#1236](https://github.com/intuit/auto/pull/1236) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.34.0 (Tue May 19 2020)

#### 🚀 Enhancement

- `@auto-it/core`
  - allow more rc file types [#1235](https://github.com/intuit/auto/pull/1235) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump lerna from 3.20.2 to 3.21.0 [#1232](https://github.com/intuit/auto/pull/1232) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump io-ts from 2.2.1 to 2.2.2 [#1231](https://github.com/intuit/auto/pull/1231) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.31.0 to 2.34.0 [#1230](https://github.com/intuit/auto/pull/1230) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 25.2.0 to 25.4.2 [#1229](https://github.com/intuit/auto/pull/1229) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.9.0 to 23.13.1 [#1228](https://github.com/intuit/auto/pull/1228) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🏠 Internal

- `auto`
  - add test that ensure bundled auto still works [#1226](https://github.com/intuit/auto/pull/1226) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.33.2 (Mon May 18 2020)

#### 🐛 Bug Fix

- `@auto-it/upload-assets`
  - fix upload-assets plugin [#1227](https://github.com/intuit/auto/pull/1227) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.33.1 (Mon May 18 2020)

#### 🐛 Bug Fix

- `auto`
  - align octokit types [#1225](https://github.com/intuit/auto/pull/1225) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.33.0 (Mon May 18 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/gem`, `@auto-it/git-tag`
  - 💎 Ruby Gem Plugin [#1217](https://github.com/intuit/auto/pull/1217) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- [Security] Bump handlebars from 4.5.3 to 4.7.6 [#1213](https://github.com/intuit/auto/pull/1213) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/first-time-contributor`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/upload-assets`
  - Bump @octokit/rest from 16.43.1 to 17.2.1 [#1146](https://github.com/intuit/auto/pull/1146) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/first-time-contributor`
  - Bump eslint-plugin-jsdoc from 24.0.0 to 25.2.0 [#1211](https://github.com/intuit/auto/pull/1211) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- `@auto-it/core`
  - fix(shipit): correct variable name isBaseBranch [#1223](https://github.com/intuit/auto/pull/1223) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

#### 📝 Documentation

- fix(docs): correct typo in release lifecycle hooks [#1222](https://github.com/intuit/auto/pull/1222) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))
- remove dead link in docs [#1221](https://github.com/intuit/auto/pull/1221) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- clean up writing plugin docs [#1220](https://github.com/intuit/auto/pull/1220) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix links in plugin docs [#1219](https://github.com/intuit/auto/pull/1219) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Improve Plugin Docs [#1218](https://github.com/intuit/auto/pull/1218) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Brian Muenzenmeyer ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

---

# v9.32.3 (Fri May 15 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - only create sub-package changelogs for `lerna changed` packages [#1216](https://github.com/intuit/auto/pull/1216) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.32.2 (Fri May 15 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - pass exact flag to publish too [#1215](https://github.com/intuit/auto/pull/1215) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.32.1 (Fri May 15 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Till Weisser ([@whynotzoidberg](https://github.com/whynotzoidberg)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
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

- `@auto-it/slack`
  - Slack Plugin HTTP Proxy support [#1210](https://github.com/intuit/auto/pull/1210) ([@hborawski](https://github.com/hborawski))

#### Authors: 1

- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v9.31.2 (Mon May 11 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix(auto): correct git porcelain error message [#1207](https://github.com/intuit/auto/pull/1207) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

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

- `@auto-it/npm`
  - fix(docs): mention correct key within forcePublish [#1205](https://github.com/intuit/auto/pull/1205) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Brian Muenzenmeyer ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

---

# v9.31.1 (Mon May 04 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - Add log when exiting early on independent lerna projects [#1194](https://github.com/intuit/auto/pull/1194) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.31.0 (Mon May 04 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - add --no-changelog option [#1193](https://github.com/intuit/auto/pull/1193) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.30.5 (Sat May 02 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix PR detection bug [#1191](https://github.com/intuit/auto/pull/1191) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.30.4 (Sat May 02 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - fix npm canary release w/o any tags [#1188](https://github.com/intuit/auto/pull/1188) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump jest from 25.1.0 to 25.4.0 [#1183](https://github.com/intuit/auto/pull/1183) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 14.1.4 to 14.2.0 [#1181](https://github.com/intuit/auto/pull/1181) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 25.3.0 to 25.4.0 [#1180](https://github.com/intuit/auto/pull/1180) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.1.6 to 10.1.7 [#1179](https://github.com/intuit/auto/pull/1179) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 13.11.0 to 13.13.4 [#1176](https://github.com/intuit/auto/pull/1176) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fp-ts from 2.5.3 to 2.5.4 [#1175](https://github.com/intuit/auto/pull/1175) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump log-symbols from 3.0.0 to 4.0.0 [#1178](https://github.com/intuit/auto/pull/1178) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/slack`
  - Bump @types/node-fetch from 2.5.5 to 2.5.7 [#1182](https://github.com/intuit/auto/pull/1182) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.14.1 to 6.14.2 [#1177](https://github.com/intuit/auto/pull/1177) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.30.3 (Mon Apr 27 2020)

#### 🐛 Bug Fix

- `@auto-it/gradle`
  - pass Gradle options to getProperties helper function [#1184](https://github.com/intuit/auto/pull/1184) ([@sugarmanz](https://github.com/sugarmanz))

#### Authors: 1

- Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz))

---

# v9.30.2 (Sat Apr 25 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - --silent is not a lerna flag [#1174](https://github.com/intuit/auto/pull/1174) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- actually fix docs publish [#1172](https://github.com/intuit/auto/pull/1172) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.30.1 (Wed Apr 22 2020)

#### ⚠️ Pushed to `master`

- add missing root devdep ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.30.0 (Wed Apr 22 2020)

#### 🚀 Enhancement

- `@auto-it/chrome`
  - Include Chrome manifest in build folder + ensure correct version is used [#1171](https://github.com/intuit/auto/pull/1171) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump lint-staged from 10.0.8 to 10.1.6 [#1167](https://github.com/intuit/auto/pull/1167) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/free-solid-svg-icons from 5.12.1 to 5.13.0 [#1169](https://github.com/intuit/auto/pull/1169) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/signale from 1.4.0 to 1.4.1 [#1168](https://github.com/intuit/auto/pull/1168) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-prettier from 3.1.2 to 3.1.3 [#1165](https://github.com/intuit/auto/pull/1165) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-import from 2.20.1 to 2.20.2 [#1164](https://github.com/intuit/auto/pull/1164) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump io-ts from 2.1.2 to 2.2.1 [#1163](https://github.com/intuit/auto/pull/1163) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 22.1.0 to 24.0.0 [#1162](https://github.com/intuit/auto/pull/1162) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`, `@auto-it/first-time-contributor`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Bump endent from 1.4.1 to 2.0.1 [#1166](https://github.com/intuit/auto/pull/1166) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.29.0 (Tue Apr 21 2020)

#### 🚀 Enhancement

- `@auto-it/npm`
  - set noVersionPrefix if tagVersionPrefix is set [#1170](https://github.com/intuit/auto/pull/1170) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.28.3 (Mon Apr 20 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - fix quiet flag in npm plugin. was always on [#1161](https://github.com/intuit/auto/pull/1161) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.28.2 (Mon Apr 20 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - bug in silent flag [#1160](https://github.com/intuit/auto/pull/1160) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.28.1 (Mon Apr 20 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - add verbose logs when branch is behind [#1159](https://github.com/intuit/auto/pull/1159) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.28.0 (Fri Apr 17 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`, `@auto-it/npm`
  - Add --quiet flag [#1155](https://github.com/intuit/auto/pull/1155) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.27.3 (Thu Apr 16 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/upload-assets`
  - upload-assets: update deprecated option [#1152](https://github.com/intuit/auto/pull/1152) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.27.2 (Wed Apr 15 2020)

#### 🐛 Bug Fix

- `@auto-it/bot-list`
  - Add renovate-pro[bot] to bot list [#1150](https://github.com/intuit/auto/pull/1150) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.27.1 (Tue Apr 14 2020)

#### 🐛 Bug Fix

- `@auto-it/first-time-contributor`
  - first-time-contributor: cache results of graphql queries [#1149](https://github.com/intuit/auto/pull/1149) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.27.0 (Tue Apr 14 2020)

#### 🚀 Enhancement

- `@auto-it/all-contributors`
  - all contributors: add ability to add non-code contributions [#1148](https://github.com/intuit/auto/pull/1148) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump pkg from 4.4.6 to 4.4.7 [#1143](https://github.com/intuit/auto/pull/1143) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.26.0 to 2.27.0 [#1139](https://github.com/intuit/auto/pull/1139) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 4.2.3 to 4.2.5 [#1141](https://github.com/intuit/auto/pull/1141) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump semver from 7.1.3 to 7.2.2 [#1138](https://github.com/intuit/auto/pull/1138) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump gitlog from 3.3.4 to 4.0.0 [#1145](https://github.com/intuit/auto/pull/1145) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Bump typescript from 3.7.5 to 3.8.3 [#1045](https://github.com/intuit/auto/pull/1045) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`
  - Bump chalk from 3.0.0 to 4.0.0 [#1140](https://github.com/intuit/auto/pull/1140) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.8 (Wed Apr 08 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix omitting merges from master into next when running "shipit" [#1137](https://github.com/intuit/auto/pull/1137) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.7 (Tue Apr 07 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - Skip next commit hooks [#1136](https://github.com/intuit/auto/pull/1136) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.6 (Tue Apr 07 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Next improvements [#1135](https://github.com/intuit/auto/pull/1135) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.5 (Tue Apr 07 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix creating canary with no Latest Release [#1134](https://github.com/intuit/auto/pull/1134) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.4 (Mon Apr 06 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - pr-check: succeed on pre-release branch PRs [#1133](https://github.com/intuit/auto/pull/1133) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.3 (Mon Apr 06 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Improve next branch preview changelog [#1132](https://github.com/intuit/auto/pull/1132) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump pkg from 4.4.5 to 4.4.6 [#1127](https://github.com/intuit/auto/pull/1127) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 13.9.3 to 13.11.0 [#1131](https://github.com/intuit/auto/pull/1131) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump twitter-text from 3.0.1 to 3.1.0 [#1128](https://github.com/intuit/auto/pull/1128) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump prettier from 2.0.2 to 2.0.4 [#1126](https://github.com/intuit/auto/pull/1126) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.26.0 to 2.27.0 [#1124](https://github.com/intuit/auto/pull/1124) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @types/jest from 25.1.4 to 25.2.1 [#1130](https://github.com/intuit/auto/pull/1130) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump graphql from 14.6.0 to 15.0.0 [#1129](https://github.com/intuit/auto/pull/1129) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.14.0 to 6.14.1 [#1125](https://github.com/intuit/auto/pull/1125) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.2 (Mon Apr 06 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - ensure commits pushed directly to next branch are labelled correctly in next-PR changelog [#1123](https://github.com/intuit/auto/pull/1123) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.26.1 (Sun Apr 05 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix: push to master w/--only-publish-with-release-label creating release [#1121](https://github.com/intuit/auto/pull/1121) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/cocoapods`
  - Cocoapods -> CocoaPods [#1120](https://github.com/intuit/auto/pull/1120) ([@orta](https://github.com/orta) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Orta ([@orta](https://github.com/orta))

---

# v9.26.0 (Sun Apr 05 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Add most flags for version+changelog+release to shipit/latest [#1117](https://github.com/intuit/auto/pull/1117) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.4 (Sat Apr 04 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - include first commit in changelogs [#1115](https://github.com/intuit/auto/pull/1115) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.3 (Sat Apr 04 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - --dry-run improvements [#1114](https://github.com/intuit/auto/pull/1114) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- `@auto-it/core`, `@auto-it/cocoapods`, `@auto-it/first-time-contributor`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/released`, `@auto-it/slack`
  - Turn on eslint rules that would have prevented last bug [#1112](https://github.com/intuit/auto/pull/1112) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.2 (Fri Apr 03 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - Changelog bugs [#1111](https://github.com/intuit/auto/pull/1111) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.1 (Fri Apr 03 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix info command in fresh envs + list plugins in binary [#1110](https://github.com/intuit/auto/pull/1110) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.25.0 (Thu Apr 02 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - shipit: expose --only-publish-with-release-label [#1108](https://github.com/intuit/auto/pull/1108) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.24.0 (Thu Apr 02 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Add `--list-plugins` flag to `info` command [#1103](https://github.com/intuit/auto/pull/1103) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.23.1 (Thu Apr 02 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - next: add whitspace so markdown formats correctly [#1104](https://github.com/intuit/auto/pull/1104) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/brew`
  - fix docs syntax highlighting [#1101](https://github.com/intuit/auto/pull/1101) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.23.0 (Wed Apr 01 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/brew`
  - Add Brew Plugin [#1099](https://github.com/intuit/auto/pull/1099) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- `@auto-it/brew`
  - fix default formula path [#1100](https://github.com/intuit/auto/pull/1100) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.22.4 (Wed Apr 01 2020)

#### 🐛 Bug Fix

- `@auto-it/slack`
  - use release URL from response for an accurate URL [#1096](https://github.com/intuit/auto/pull/1096) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.22.3 (Wed Apr 01 2020)

#### 🐛 Bug Fix

- `@auto-it/released`
  - add link in released comment + handle multiple releases [#1097](https://github.com/intuit/auto/pull/1097) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @typescript-eslint/parser from 2.25.0 to 2.26.0 [#1094](https://github.com/intuit/auto/pull/1094) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.25.0 to 2.26.0 [#1089](https://github.com/intuit/auto/pull/1089) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pkg from 4.4.4 to 4.4.5 [#1095](https://github.com/intuit/auto/pull/1095) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump prettier from 2.0.1 to 2.0.2 [#1092](https://github.com/intuit/auto/pull/1092) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 25.2.1 to 25.3.0 [#1091](https://github.com/intuit/auto/pull/1091) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @fortawesome/fontawesome-svg-core from 1.2.27 to 1.2.28 [#1090](https://github.com/intuit/auto/pull/1090) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 14.1.3 to 14.1.4 [#1088](https://github.com/intuit/auto/pull/1088) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-enterprise-compatibility from 1.2.1 to 1.2.2 [#1087](https://github.com/intuit/auto/pull/1087) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.22.2 (Mon Mar 30 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Kyle Brown ([@krohrsb](https://github.com/krohrsb)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/conventional-commits`
  - fix(conventional-commits): skip release when no increment detected [#1086](https://github.com/intuit/auto/pull/1086) ([@krohrsb](https://github.com/krohrsb))

#### Authors: 1

- Kyle Brown ([@krohrsb](https://github.com/krohrsb))

---

# v9.22.1 (Fri Mar 27 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Exit with warning when canary or next is unimplemented [#1085](https://github.com/intuit/auto/pull/1085) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.22.0 (Fri Mar 27 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Add --title flag to 'auto changelog' [#1084](https://github.com/intuit/auto/pull/1084) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.21.2 (Fri Mar 27 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - always use tag version for release title, prevent using annotation [#1083](https://github.com/intuit/auto/pull/1083) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.21.1 (Fri Mar 27 2020)

#### 🐛 Bug Fix

- `@auto-it/bot-list`, `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/cocoapods`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/exec`, `@auto-it/first-time-contributor`, `@auto-it/gh-pages`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Respect Updated PR Titles [#1082](https://github.com/intuit/auto/pull/1082) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump prettier from 1.19.1 to 2.0.1 [#1079](https://github.com/intuit/auto/pull/1079) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 22.0.1 to 22.1.0 [#1078](https://github.com/intuit/auto/pull/1078) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.10.0 to 6.10.1 [#1076](https://github.com/intuit/auto/pull/1076) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/signale from 1.2.1 to 1.4.0 [#1072](https://github.com/intuit/auto/pull/1072) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.23.0 to 2.25.0 [#1077](https://github.com/intuit/auto/pull/1077) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.23.0 to 2.25.0 [#1073](https://github.com/intuit/auto/pull/1073) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 13.9.0 to 13.9.3 [#1074](https://github.com/intuit/auto/pull/1074) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump env-ci from 5.0.1 to 5.0.2 [#1071](https://github.com/intuit/auto/pull/1071) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.21.0 (Fri Mar 20 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Shelby Cohen ([@ShelbyCohen](https://github.com/ShelbyCohen)), for all your work!

#### 🚀 Enhancement

- `@auto-it/gradle`
  - Re-introduce `build` option back, but make it configurable so that [#1067](https://github.com/intuit/auto/pull/1067) ([@unknownerror404](https://github.com/unknownerror404) [@ShelbyCohen](https://github.com/ShelbyCohen))

#### Authors: 2

- Brandon Miller ([@unknownerror404](https://github.com/unknownerror404))
- Shelby Cohen ([@ShelbyCohen](https://github.com/ShelbyCohen))

---

# v9.20.1 (Thu Mar 19 2020)

#### 🐛 Bug Fix

- `@auto-it/all-contributors`
  - All contributors bug [#1070](https://github.com/intuit/auto/pull/1070) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add Cocoapod to docs [#1068](https://github.com/intuit/auto/pull/1068) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.20.0 (Wed Mar 18 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Harris Borawski ([@hborawski](https://github.com/hborawski)), for all your work!

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/cocoapods`
  - Cocoapods plugin [#1066](https://github.com/intuit/auto/pull/1066) ([@hborawski](https://github.com/hborawski) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump tapable from 2.0.0-beta.9 to 2.0.0-beta.10 [#1063](https://github.com/intuit/auto/pull/1063) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 22.0.0 to 22.0.1 [#1064](https://github.com/intuit/auto/pull/1064) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump acorn from 6.1.1 to 6.4.1 [#1062](https://github.com/intuit/auto/pull/1062) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 📝 Documentation

- grammer [#1061](https://github.com/intuit/auto/pull/1061) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Fix some docs bugs [#1060](https://github.com/intuit/auto/pull/1060) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix homepage images [#1059](https://github.com/intuit/auto/pull/1059) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update github-actions.md [#1058](https://github.com/intuit/auto/pull/1058) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- refresh home page [#1057](https://github.com/intuit/auto/pull/1057) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update jenkins.md [#1056](https://github.com/intuit/auto/pull/1056) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Harris Borawski ([@hborawski](https://github.com/hborawski))

---

# v9.19.5 (Wed Mar 11 2020)

#### 🐛 Bug Fix

- `@auto-it/first-time-contributor`
  - fix first time contributor plugin validation [#1055](https://github.com/intuit/auto/pull/1055) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.19.4 (Tue Mar 10 2020)

#### 🐛 Bug Fix

- `@auto-it/exec`
  - Only trim exec output if its a string [#1052](https://github.com/intuit/auto/pull/1052) ([@adierkens](https://github.com/adierkens))

#### 🔩 Dependency Updates

- Bump @typescript-eslint/eslint-plugin from 2.20.0 to 2.23.0 [#1050](https://github.com/intuit/auto/pull/1050) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.21.0 to 2.23.0 [#1049](https://github.com/intuit/auto/pull/1049) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 10.0.7 to 10.0.8 [#1047](https://github.com/intuit/auto/pull/1047) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.8.1 to 23.8.2 [#1043](https://github.com/intuit/auto/pull/1043) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 13.7.7 to 13.9.0 [#1042](https://github.com/intuit/auto/pull/1042) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @octokit/core from 2.4.0 to 2.4.2 [#1046](https://github.com/intuit/auto/pull/1046) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @types/jest from 24.0.25 to 25.1.4 [#1041](https://github.com/intuit/auto/pull/1041) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.13.0 to 6.14.0 [#1040](https://github.com/intuit/auto/pull/1040) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 📝 Documentation

- add docs for GitHub action branch protection [#1053](https://github.com/intuit/auto/pull/1053) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add exec plugin to docs [#1051](https://github.com/intuit/auto/pull/1051) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Adam Dierkens ([@adierkens](https://github.com/adierkens))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.19.3 (Mon Mar 09 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - try credentialed remotes first [#1039](https://github.com/intuit/auto/pull/1039) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.19.2 (Sun Mar 08 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - When checking if remote commits ignore git error message [#1038](https://github.com/intuit/auto/pull/1038) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Update github-actions.md to match actions/checkout@v2 [#1037](https://github.com/intuit/auto/pull/1037) ([@ericclemmons](https://github.com/ericclemmons))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Eric Clemmons ([@ericclemmons](https://github.com/ericclemmons))

---

# v9.19.1 (Sat Mar 07 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`
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

- `auto`, `@auto-it/core`, `@auto-it/conventional-commits`, `@auto-it/gradle`
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

- `@auto-it/core`, `@auto-it/exec`, `@auto-it/omit-commits`
  - Add Exec Plugin [#1033](https://github.com/intuit/auto/pull/1033) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.17.1 (Fri Mar 06 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`, `@auto-it/first-time-contributor`
  - 📦 🐈 Yarn 2 Compatibility [#1029](https://github.com/intuit/auto/pull/1029) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.17.0 (Fri Mar 06 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/gh-pages`
  - Add GitHub Pages Plugin [#1031](https://github.com/intuit/auto/pull/1031) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.7 (Fri Mar 06 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - "version" would be wrong with label-less PRs + 'none' release types [#1032](https://github.com/intuit/auto/pull/1032) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.6 (Thu Mar 05 2020)

#### ⚠️ Pushed to `master`

- `@auto-it/core`
  - add dep for parse-github-url ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.5 (Thu Mar 05 2020)

#### ⚠️ Pushed to `master`

- `@auto-it/core`
  - add bot-list dep to core ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.4 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Make gitlog include merge commit files [#1028](https://github.com/intuit/auto/pull/1028) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.3 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Changelog formatting [#1026](https://github.com/intuit/auto/pull/1026) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.2 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- `@auto-it/bot-list`, `@auto-it/core`, `@auto-it/all-contributors`
  - move botlist to package and use it in release notes exclusion [#1027](https://github.com/intuit/auto/pull/1027) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.1 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - npm: respect subPackageChangelogs false [#1025](https://github.com/intuit/auto/pull/1025) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.16.0 (Thu Mar 05 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`, `@auto-it/git-tag`
  - determine if branch behind remote and exit before trying to publish [#1018](https://github.com/intuit/auto/pull/1018) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- `@auto-it/core`
  - fix tests [#1024](https://github.com/intuit/auto/pull/1024) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.11 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix plugin loading from absolute windows paths [#1022](https://github.com/intuit/auto/pull/1022) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.10 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix loading canary versions of official plugins [#1021](https://github.com/intuit/auto/pull/1021) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.9 (Thu Mar 05 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - test for ancestor in windows friendly way [#1019](https://github.com/intuit/auto/pull/1019) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.8 (Tue Mar 03 2020)

#### 🐛 Bug Fix

- `auto`
  - set license on CLI [#1017](https://github.com/intuit/auto/pull/1017) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.7 (Tue Mar 03 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - add license to all sub-packages [#1016](https://github.com/intuit/auto/pull/1016) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.6 (Tue Mar 03 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - info: handle when there is no previous version [#1015](https://github.com/intuit/auto/pull/1015) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.5 (Tue Mar 03 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix "Push to master" on next branch [#1013](https://github.com/intuit/auto/pull/1013) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.4 (Mon Mar 02 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`
  - Don't release canary on skip-release by default, add force flag [#993](https://github.com/intuit/auto/pull/993) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@zephraph](https://github.com/zephraph))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v9.15.3 (Mon Mar 02 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - don't force publish canary/next for independent lerna projects [#1012](https://github.com/intuit/auto/pull/1012) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump eslint-plugin-jest from 23.8.0 to 23.8.1 [#1011](https://github.com/intuit/auto/pull/1011) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.20.0 to 2.21.0 [#1008](https://github.com/intuit/auto/pull/1008) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 13.7.4 to 13.7.7 [#1007](https://github.com/intuit/auto/pull/1007) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/fs-extra from 8.0.1 to 8.1.0 [#1006](https://github.com/intuit/auto/pull/1006) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pkg from 4.4.3 to 4.4.4 [#1005](https://github.com/intuit/auto/pull/1005) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 21.0.0 to 22.0.0 [#1004](https://github.com/intuit/auto/pull/1004) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 14.1.2 to 14.1.3 [#1002](https://github.com/intuit/auto/pull/1002) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/slack`
  - Bump @types/node-fetch from 2.5.4 to 2.5.5 [#1010](https://github.com/intuit/auto/pull/1010) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Bump tslib from 1.11.0 to 1.11.1 [#1009](https://github.com/intuit/auto/pull/1009) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.2 (Sun Mar 01 2020)

#### 🐛 Bug Fix

- `@auto-it/conventional-commits`
  - Respect PR label when conventional commit message is present [#1001](https://github.com/intuit/auto/pull/1001) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.1 (Sun Mar 01 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`
  - Default Config When running shipit [#1000](https://github.com/intuit/auto/pull/1000) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.15.0 (Sun Mar 01 2020)

### Release Notes

_From #998_

Configs are now fully validated including plugins 🎉

<img width="1171" alt="Screen Shot 2020-02-29 at 10 19 01 PM" src="https://user-images.githubusercontent.com/1192452/75620907-b8864d80-5b42-11ea-84e0-15292696185d.png">

### 🚀 Command Configuration 🚀

With the inclusion of configuration validation we decided to restrict valid root level keys to only options that are shared between commands. All of these options are called out in the [`.autorc` docs](https://intuit.github.io/auto/pages/autorc.html).

But for some commands it still makes sense to configure flag permanently in the `.autorc`. For those commands you can now supply defaults for flags using the following format.

**Example:** Adding the following to you `.autorc` will make `auto` only release pre-releases to GitHub.

```json
{
  "release": {
    "prerelease": true
  }
}
```

Please refer to each command's documentation to see which options are configurable.

### New Hook

For plugins configuration validation a new hook `validateConfiguration` was added for plugins to tap into and report configuration errors. [Read more](https://intuit.github.io/auto/pages/writing-plugins.html#validateconfig)

---

#### 🚀 Enhancement

- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Config Validation + Command Defaults [#998](https://github.com/intuit/auto/pull/998) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Add @unknownerror404 as a contributor [#997](https://github.com/intuit/auto/pull/997) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.14.0 (Tue Feb 25 2020)

#### 🚀 Enhancement

- `@auto-it/core`
  - add scoped plugin support [#992](https://github.com/intuit/auto/pull/992) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.13.1 (Mon Feb 24 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - add fallback for when --is-ancestor fails [#989](https://github.com/intuit/auto/pull/989) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Better Travis Docs [#990](https://github.com/intuit/auto/pull/990) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump ts-jest from 25.2.0 to 25.2.1 [#987](https://github.com/intuit/auto/pull/987) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump fast-glob from 3.1.1 to 3.2.2 [#984](https://github.com/intuit/auto/pull/984) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.7.0 to 23.8.0 [#986](https://github.com/intuit/auto/pull/986) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.19.2 to 2.20.0 [#985](https://github.com/intuit/auto/pull/985) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.19.2 to 2.20.0 [#983](https://github.com/intuit/auto/pull/983) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 13.7.1 to 13.7.4 [#982](https://github.com/intuit/auto/pull/982) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 20.3.1 to 21.0.0 [#981](https://github.com/intuit/auto/pull/981) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump endent from 1.4.0 to 1.4.1 [#980](https://github.com/intuit/auto/pull/980) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-xo from 0.27.2 to 0.29.1 [#978](https://github.com/intuit/auto/pull/978) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Bump tslib from 1.10.0 to 1.11.0 [#979](https://github.com/intuit/auto/pull/979) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.13.0 (Sat Feb 22 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/npm`
  - When parsing owner/repo fallback to parsing 'origin' [#975](https://github.com/intuit/auto/pull/975) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- `@auto-it/core`
  - add git version to 'auto info' output [#977](https://github.com/intuit/auto/pull/977) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Update bug_report.md [#974](https://github.com/intuit/auto/pull/974) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.12.1 (Sat Feb 22 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/npm`
  - add warning about using npm plugin with noVersionPrefix [#972](https://github.com/intuit/auto/pull/972) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/all-contributors`
  - Make all-contributors plugin work for non-lerna packages again [#971](https://github.com/intuit/auto/pull/971) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.12.0 (Fri Feb 21 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/chrome`, `@auto-it/crates`, `@auto-it/git-tag`, `@auto-it/gradle`, `@auto-it/maven`, `@auto-it/npm`
  - ensure remote can be pushed to [#969](https://github.com/intuit/auto/pull/969) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.11.0 (Fri Feb 21 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Add new command 'latest' for easier testing and more flexibility [#968](https://github.com/intuit/auto/pull/968) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.8 (Fri Feb 21 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/all-contributors`
  - fix case sensitive username bug and handle git errors [#967](https://github.com/intuit/auto/pull/967) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Adding proxyagent to graphql [#963](https://github.com/intuit/auto/pull/963) ([@YogiKhan](https://github.com/YogiKhan) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/gradle`
  - fix: gradle readme use jsonc syntax highlighting [#965](https://github.com/intuit/auto/pull/965) ([@sugarmanz](https://github.com/sugarmanz))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz))
- yogesh khandelwal ([@YogiKhan](https://github.com/YogiKhan))

---

# v9.10.7 (Tue Feb 18 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/first-time-contributor`
  - filter out bots in first-time contributor plugins [#961](https://github.com/intuit/auto/pull/961) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.6 (Mon Feb 17 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - get node version in crash friendly way [#960](https://github.com/intuit/auto/pull/960) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add clearer docs around github token permissions [#958](https://github.com/intuit/auto/pull/958) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Add gradle to root readme [#957](https://github.com/intuit/auto/pull/957) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @typescript-eslint/parser from 2.19.0 to 2.19.2 [#956](https://github.com/intuit/auto/pull/956) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 13.1.8 to 13.7.1 [#953](https://github.com/intuit/auto/pull/953) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 4.2.1 to 4.2.3 [#955](https://github.com/intuit/auto/pull/955) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.17.0 to 2.19.2 [#954](https://github.com/intuit/auto/pull/954) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pkg from 4.4.2 to 4.4.3 [#948](https://github.com/intuit/auto/pull/948) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 14.1.1 to 14.1.2 [#949](https://github.com/intuit/auto/pull/949) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump semver from 7.1.1 to 7.1.3 [#950](https://github.com/intuit/auto/pull/950) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/semver from 6.2.0 to 7.1.0 [#947](https://github.com/intuit/auto/pull/947) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump https-proxy-agent from 4.0.0 to 5.0.0 [#952](https://github.com/intuit/auto/pull/952) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Bump @octokit/core from 2.2.0 to 2.4.0 [#951](https://github.com/intuit/auto/pull/951) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.5 (Thu Feb 13 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]), for all your work!

#### 🐛 Bug Fix

- Add gradle to tsconfig. [#946](https://github.com/intuit/auto/pull/946) (brandon_miller3@intuit.com [@unknownerror404](https://github.com/unknownerror404))

#### 🔩 Dependency Updates

- Bump lint-staged from 9.5.0 to 10.0.7 [#944](https://github.com/intuit/auto/pull/944) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump rimraf from 3.0.0 to 3.0.2 [#943](https://github.com/intuit/auto/pull/943) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-import from 2.20.0 to 2.20.1 [#942](https://github.com/intuit/auto/pull/942) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.6.0 to 23.7.0 [#941](https://github.com/intuit/auto/pull/941) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 25.0.0 to 25.2.0 [#940](https://github.com/intuit/auto/pull/940) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/array.prototype.flatmap from 1.2.0 to 1.2.1 [#939](https://github.com/intuit/auto/pull/939) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.9.0 to 6.10.0 [#938](https://github.com/intuit/auto/pull/938) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.17.0 to 2.19.0 [#936](https://github.com/intuit/auto/pull/936) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/first-time-contributor`, `@auto-it/npm`, `@auto-it/upload-assets`
  - Bump @octokit/rest from 16.38.3 to 16.43.1 [#935](https://github.com/intuit/auto/pull/935) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/upload-assets`
  - Bump file-type from 13.1.1 to 14.1.1 [#937](https://github.com/intuit/auto/pull/937) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 4

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Brandon Miller ([@unknownerror404](https://github.com/unknownerror404))
- svc-mobile (brandon_miller3@intuit.com)

---

# v9.10.4 (Thu Feb 06 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`
  - Run `auto info` when any command is run with --verbose [#934](https://github.com/intuit/auto/pull/934) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.3 (Thu Feb 06 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - add info about token permission [#933](https://github.com/intuit/auto/pull/933) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.2 (Thu Feb 06 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - create-labels: handle repos with large amounts of labels [#932](https://github.com/intuit/auto/pull/932) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.1 (Thu Feb 06 2020)

#### 🐛 Bug Fix

- `@auto-it/chrome`, `@auto-it/git-tag`, `@auto-it/npm`
  - Fix manual git tagging [#930](https://github.com/intuit/auto/pull/930) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.0 (Thu Feb 06 2020)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`, `@auto-it/maven`
  - add "info" command [#931](https://github.com/intuit/auto/pull/931) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.9.1 (Tue Feb 04 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - dont run git hooks when commiting the version for a single npm package [#929](https://github.com/intuit/auto/pull/929) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Add gradle plugin to docs website [#928](https://github.com/intuit/auto/pull/928) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.9.0 (Fri Jan 31 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Brandon Miller ([@unknownerror404](https://github.com/unknownerror404)), for all your work!

#### 🚀 Enhancement

- `@auto-it/gradle`
  - Gradle Release Plugin [#924](https://github.com/intuit/auto/pull/924) (brandon_miller3@intuit.com [@unknownerror404](https://github.com/unknownerror404))

#### Authors: 2

- Brandon Miller ([@unknownerror404](https://github.com/unknownerror404))
- svc-mobile (brandon_miller3@intuit.com)

---

# v9.8.4 (Fri Jan 31 2020)

#### 🐛 Bug Fix

- fix GH_USER in jenkins documentation [#925](https://github.com/intuit/auto/pull/925) (navjot_cheema@intuit.com [@ncheema](https://github.com/ncheema))
- `@auto-it/maven`
  - fix maven release creation [#927](https://github.com/intuit/auto/pull/927) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/maven`
  - Update maven and jenkins documentation (resolves #922) [#923](https://github.com/intuit/auto/pull/923) (navjot_cheema@intuit.com [@ncheema](https://github.com/ncheema))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Navjot Cheema ([@ncheema](https://github.com/ncheema))
- ncheema (navjot_cheema@intuit.com)

---

# v9.8.3 (Thu Jan 30 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - move ICommit to "core" to fix external plugin TS build errors [#921](https://github.com/intuit/auto/pull/921) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.8.2 (Thu Jan 30 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - add fallback to get lerna json [#920](https://github.com/intuit/auto/pull/920) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.8.1 (Wed Jan 29 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - better error message running release in repo w/o tags [#919](https://github.com/intuit/auto/pull/919) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.8.0 (Mon Jan 27 2020)

### Release Notes

_From #916_

This PR adds a new hook for plugin developers.

`makeRelease` - This hook is called when `auto shipit` or `auto release` tries to make a release. If untapped auto will run the default behavior. Otherwise it is up to the plugin tapping the hook to call `auto.git.publish` to make releases on GitHub.

---

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Independent releases [#916](https://github.com/intuit/auto/pull/916) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.7.0 (Mon Jan 27 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/crates`
  - enhance BeforeShipit hook to include the type of release that will be made [#913](https://github.com/intuit/auto/pull/913) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- `@auto-it/npm`
  - abort release if lerna reports no unchanged packages [#914](https://github.com/intuit/auto/pull/914) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/npm`
  - use different version commit message for independent projects [#915](https://github.com/intuit/auto/pull/915) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.6.0 (Mon Jan 27 2020)

#### 🚀 Enhancement

- `@auto-it/slack`
  - add ability to store slack hook url in environment variable [#912](https://github.com/intuit/auto/pull/912) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.5.0 (Mon Jan 27 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]), for all your work!

#### 🚀 Enhancement

- `auto`, `@auto-it/core`, `@auto-it/jira`, `@auto-it/npm`, `@auto-it/slack`
  - Overhaul "auto init" experience + make it pluggable [#901](https://github.com/intuit/auto/pull/901) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @typescript-eslint/eslint-plugin from 2.12.0 to 2.17.0 [#905](https://github.com/intuit/auto/pull/905) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest and ts-jest [#911](https://github.com/intuit/auto/pull/911) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 4.0.10 to 4.2.1 [#909](https://github.com/intuit/auto/pull/909) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump graphql from 14.5.8 to 14.6.0 [#907](https://github.com/intuit/auto/pull/907) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump command-line-application from 0.9.5 to 0.9.6 [#906](https://github.com/intuit/auto/pull/906) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.16.0 to 2.17.0 [#904](https://github.com/intuit/auto/pull/904) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump endent from 1.3.0 to 1.4.0 [#903](https://github.com/intuit/auto/pull/903) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @octokit/plugin-throttling from 2.7.1 to 3.2.0 [#902](https://github.com/intuit/auto/pull/902) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @octokit/plugin-retry from 2.2.0 to 3.0.1 [#910](https://github.com/intuit/auto/pull/910) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Bump @octokit/rest from 16.37.0 to 16.38.3 [#908](https://github.com/intuit/auto/pull/908) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.4.1 (Sat Jan 25 2020)

#### 🐛 Bug Fix

- `@auto-it/released`
  - Wrap version in code [#900](https://github.com/intuit/auto/pull/900) ([@ericclemmons](https://github.com/ericclemmons))

#### 📝 Documentation

- Updated GitHub Action [#899](https://github.com/intuit/auto/pull/899) ([@ericclemmons](https://github.com/ericclemmons))

#### Authors: 1

- Eric Clemmons ([@ericclemmons](https://github.com/ericclemmons))

---

# v9.4.0 (Sat Jan 25 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/npm`
  - Add html details option to canary hook + Use in npm plugin [#898](https://github.com/intuit/auto/pull/898) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.3.4 (Sat Jan 25 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - add better messaging when pr number cannot be detected [#896](https://github.com/intuit/auto/pull/896) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.3.3 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Add 📦 emoji to canary PR message to make it more noticeable [#897](https://github.com/intuit/auto/pull/897) ([@ericclemmons](https://github.com/ericclemmons))

#### 📝 Documentation

- `@auto-it/all-contributors`
  - Explicitly add npm & yarn step for all-contributors [#895](https://github.com/intuit/auto/pull/895) ([@ericclemmons](https://github.com/ericclemmons))

#### Authors: 1

- Eric Clemmons ([@ericclemmons](https://github.com/ericclemmons))

---

# v9.3.2 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - Fix private package previous version calculation + Improve dry run messaging [#894](https://github.com/intuit/auto/pull/894) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.3.1 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Surface plugin syntax errors to user [#892](https://github.com/intuit/auto/pull/892) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.3.0 (Fri Jan 24 2020)

#### 🚀 Enhancement

- `@auto-it/npm`
  - add ability to publish exact versions in monorepo [#891](https://github.com/intuit/auto/pull/891) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.2.3 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- `@auto-it/first-time-contributor`
  - determine first time contributor by using PR count instead of git history [#890](https://github.com/intuit/auto/pull/890) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.2.2 (Fri Jan 24 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Hannes Güdelhöfer ([@reckter](https://github.com/reckter)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix error on empty pr body [#889](https://github.com/intuit/auto/pull/889) ([@reckter](https://github.com/reckter))

#### Authors: 1

- Hannes Güdelhöfer ([@reckter](https://github.com/reckter))

---

# v9.2.1 (Fri Jan 24 2020)

#### 🐛 Bug Fix

- `auto`, `@auto-it/core`, `@auto-it/git-tag`
  - fallback to 0.0.0 in git-tag plugin with no previous releases [#888](https://github.com/intuit/auto/pull/888) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.2.0 (Thu Jan 23 2020)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/npm`
  - Add ability to manage sub-package contributor lists [#887](https://github.com/intuit/auto/pull/887) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.3 (Thu Jan 23 2020)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - Fix commiting sub-package changelogs [#885](https://github.com/intuit/auto/pull/885) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.2 (Thu Jan 23 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix omitting renovate release notes when a user manually rebases the renovate PR [#884](https://github.com/intuit/auto/pull/884) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.1 (Thu Jan 23 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix onlyPublishWithReleaseLabel w/o labels [#883](https://github.com/intuit/auto/pull/883) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/chrome`, `@auto-it/maven`
  - add clearer docs around creating GH_TOKEN [#882](https://github.com/intuit/auto/pull/882) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.0 (Tue Jan 21 2020)

#### 🚀 Enhancement

- `@auto-it/core`
  - canary: try to match commit to PR if not found in env [#812](https://github.com/intuit/auto/pull/812) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump file-type from 13.0.3 to 13.1.1 [#879](https://github.com/intuit/auto/pull/879) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-import from 2.19.1 to 2.20.0 [#878](https://github.com/intuit/auto/pull/878) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump enquirer from 2.3.2 to 2.3.4 [#876](https://github.com/intuit/auto/pull/876) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.15.0 to 2.16.0 [#875](https://github.com/intuit/auto/pull/875) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 20.3.0 to 20.3.1 [#874](https://github.com/intuit/auto/pull/874) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript from 3.7.4 to 3.7.5 [#873](https://github.com/intuit/auto/pull/873) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 4.0.7 to 4.0.10 [#872](https://github.com/intuit/auto/pull/872) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @types/node from 12.12.21 to 13.1.8 [#881](https://github.com/intuit/auto/pull/881) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.12.0 to 6.13.0 [#880](https://github.com/intuit/auto/pull/880) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @octokit/rest from 16.36.0 to 16.37.0 [#877](https://github.com/intuit/auto/pull/877) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.0.2 (Tue Jan 14 2020)

#### 🐛 Bug Fix

- `@auto-it/all-contributors`
  - Fix running all-contributors when not installed [#871](https://github.com/intuit/auto/pull/871) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.0.1 (Mon Jan 13 2020)

#### 🐛 Bug Fix

- `@auto-it/core`
  - handle PR numbers that don't exist in repo/fork [#870](https://github.com/intuit/auto/pull/870) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.0.0 (Mon Jan 13 2020)

#### 💥 Breaking Change

- `auto`
  - require Node.js >=10.x [#869](https://github.com/intuit/auto/pull/869) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- `@auto-it/npm`
  - match npm behavior for scoped packages [#868](https://github.com/intuit/auto/pull/868) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump eslint-plugin-jsdoc from 20.0.0 to 20.3.0 [#865](https://github.com/intuit/auto/pull/865) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump semver from 7.0.0 to 7.1.1 [#837](https://github.com/intuit/auto/pull/837) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 3.1.0 to 4.0.7 [#862](https://github.com/intuit/auto/pull/862) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump tapable from 2.0.0-beta.8 to 2.0.0-beta.9 [#847](https://github.com/intuit/auto/pull/847) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.12.0 to 2.15.0 [#860](https://github.com/intuit/auto/pull/860) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.1.1 to 23.6.0 [#861](https://github.com/intuit/auto/pull/861) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 24.2.0 to 24.3.0 [#863](https://github.com/intuit/auto/pull/863) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.7.0 to 6.9.0 [#849](https://github.com/intuit/auto/pull/849) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 6.7.2 to 6.8.0 [#851](https://github.com/intuit/auto/pull/851) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 18.4.4 to 20.0.0 [#856](https://github.com/intuit/auto/pull/856) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lerna from 3.19.0 to 3.20.2 [#854](https://github.com/intuit/auto/pull/854) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 24.0.24 to 24.0.25 [#852](https://github.com/intuit/auto/pull/852) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-throttling from 2.7.0 to 2.7.1 [#846](https://github.com/intuit/auto/pull/846) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/upload-assets`
  - Bump file-type from 12.4.2 to 13.0.3 [#859](https://github.com/intuit/auto/pull/859) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Bump @octokit/rest from 16.35.2 to 16.36.0 [#850](https://github.com/intuit/auto/pull/850) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.11.2 to 6.12.0 [#866](https://github.com/intuit/auto/pull/866) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/crates`, `@auto-it/npm`
  - Bump env-ci from 4.5.2 to 5.0.1 [#867](https://github.com/intuit/auto/pull/867) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.8.0 (Thu Jan 02 2020)

#### 🚀 Enhancement

- `@auto-it/slack`
  - fix: prevent slack from default publishing on prerelease branches [#829](https://github.com/intuit/auto/pull/829) ([@Aghassi](https://github.com/Aghassi))

#### 📝 Documentation

- docs: fixed incorrect afterRelease hook object [#842](https://github.com/intuit/auto/pull/842) ([@Aghassi](https://github.com/Aghassi))
- `@auto-it/core`
  - Add documentation and tests for label changelog label section assignment behavior [#822](https://github.com/intuit/auto/pull/822) ([@bnigh](https://github.com/bnigh))

#### 🔩 Dependency Updates

- Bump @types/jest from 24.0.23 to 24.0.24 [#838](https://github.com/intuit/auto/pull/838) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.11.0 to 2.12.0 [#839](https://github.com/intuit/auto/pull/839) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 18.4.3 to 18.4.4 [#840](https://github.com/intuit/auto/pull/840) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump handlebars from 4.1.2 to 4.5.3 [#843](https://github.com/intuit/auto/pull/843) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 12.12.18 to 12.12.21 [#836](https://github.com/intuit/auto/pull/836) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump env-ci from 4.5.1 to 4.5.2 [#835](https://github.com/intuit/auto/pull/835) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.11.0 to 2.12.0 [#834](https://github.com/intuit/auto/pull/834) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript from 3.7.3 to 3.7.4 [#833](https://github.com/intuit/auto/pull/833) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump change-case from 4.1.0 to 4.1.1 [#832](https://github.com/intuit/auto/pull/832) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 12.4.0 to 12.4.2 [#831](https://github.com/intuit/auto/pull/831) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@bnigh](https://github.com/bnigh)
- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- David ([@Aghassi](https://github.com/Aghassi))

---

# v8.7.3 (Fri Dec 20 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - next: check origin head instead of local branch for tags [#827](https://github.com/intuit/auto/pull/827) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.7.2 (Fri Dec 20 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - find the last greatest tag to help with botched releases [#826](https://github.com/intuit/auto/pull/826) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.7.1 (Thu Dec 19 2019)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - Add more logs for next release calculation [#824](https://github.com/intuit/auto/pull/824) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.7.0 (Thu Dec 19 2019)

#### 🚀 Enhancement

- `@auto-it/core`
  - add context of what type of release was made during shipit [#821](https://github.com/intuit/auto/pull/821) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.3 (Thu Dec 19 2019)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/git-tag`, `@auto-it/npm`, `@auto-it/released`
  - determine next version using by omitting tags from master [#820](https://github.com/intuit/auto/pull/820) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.2 (Wed Dec 18 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - only access auto login if it all exists [#819](https://github.com/intuit/auto/pull/819) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.1 (Wed Dec 18 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - canary hook can return void to not bail [#817](https://github.com/intuit/auto/pull/817) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- update docs to show JS plugins and how to use versionBranches [#816](https://github.com/intuit/auto/pull/816) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.5.0 (Tue Dec 17 2019)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Version branches [#814](https://github.com/intuit/auto/pull/814) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.4.1 (Mon Dec 16 2019)

#### 🐛 Bug Fix

- `auto`, `@auto-it/npm`
  - alias the canary scope [#813](https://github.com/intuit/auto/pull/813) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.4.0 (Mon Dec 16 2019)

#### 🚀 Enhancement

- `@auto-it/core`
  - version: detect prerelease branch [#811](https://github.com/intuit/auto/pull/811) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.3.0 (Mon Dec 16 2019)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/git-tag`, `@auto-it/npm`
  - release: detect prerelease branch + be smarter about commit range [#810](https://github.com/intuit/auto/pull/810) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @types/node from 12.12.15 to 12.12.18 [#808](https://github.com/intuit/auto/pull/808) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-prettier from 3.1.1 to 3.1.2 [#807](https://github.com/intuit/auto/pull/807) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.10.0 to 2.11.0 [#806](https://github.com/intuit/auto/pull/806) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pkg from 4.4.1 to 4.4.2 [#805](https://github.com/intuit/auto/pull/805) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.10.0 to 2.11.0 [#803](https://github.com/intuit/auto/pull/803) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump array.prototype.flatmap from 1.2.2 to 1.2.3 [#801](https://github.com/intuit/auto/pull/801) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @octokit/rest from 16.35.0 to 16.35.2 [#809](https://github.com/intuit/auto/pull/809) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/chrome`, `@auto-it/crates`, `@auto-it/git-tag`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/twitter`
  - Bump semver from 6.3.0 to 7.0.0 [#804](https://github.com/intuit/auto/pull/804) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump https-proxy-agent from 3.0.1 to 4.0.0 [#802](https://github.com/intuit/auto/pull/802) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.2.0 (Sun Dec 15 2019)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - release: add flag to publish prerelease [#800](https://github.com/intuit/auto/pull/800) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Slight improvements to label configuration docs [#799](https://github.com/intuit/auto/pull/799) ([@bnigh](https://github.com/bnigh))

#### 📚 Blog Post

- touch up blog post [#798](https://github.com/intuit/auto/pull/798) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@bnigh](https://github.com/bnigh)
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.3 (Sat Dec 14 2019)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/jira`, `@auto-it/npm`
  - omit next branch PR Title from being in release notes [#796](https://github.com/intuit/auto/pull/796) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.2 (Sat Dec 14 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix `none` releases: they were not handling extra labels [#797](https://github.com/intuit/auto/pull/797) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.1 (Sat Dec 14 2019)

#### 📝 Documentation

- `@auto-it/npm`
  - add diagrams [#795](https://github.com/intuit/auto/pull/795) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.0 (Sat Dec 14 2019)

#### 🚀 Enhancement

- `@auto-it/npm`
  - add canaryScope option for more secure PR builds [#792](https://github.com/intuit/auto/pull/792) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix bug where merging a none would skip previously meged semver bump [#794](https://github.com/intuit/auto/pull/794) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- add context [#790](https://github.com/intuit/auto/pull/790) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/npm`
  - V8.1 [#793](https://github.com/intuit/auto/pull/793) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- docs(publishing): add period after sentence [#788](https://github.com/intuit/auto/pull/788) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Brian Muenzenmeyer ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))

---

# v8.0.0 (Wed Dec 11 2019)

### Release Notes

_From #758_

![Final-banner-REd (1)](https://user-images.githubusercontent.com/1192452/70372434-e20d4100-1893-11ea-97a4-047aeec86db9.png)

<!-- GITHUB_RELEASE PR BODY: prerelease-version -->

_From #751_

Label configuration just got a whole lot simpler 🎉

1. Labels can now only be supplied as an array of label objects.

```json
{
  "labels": [
    { "releaseType": "major", "name": "Version: Major" },
    { "releaseType": "minor", "name": "Version: Minor" },
    { "releaseType": "patch", "name": "Version: Patch" }
  ]
}
```

2. Instead of using `skipReleaseLabels` just set the label's `type` to `skip`

```json
{
  "labels": [{ "releaseType": "skip", "name": "NO!" }]
}
```

3. Overwrite default labels using `overwrite`

```json
{
  "labels": [
    { "releaseType": "major", "name": "Version: Major", "overwrite": true }
  ]
}
```

4. Add `none` `releaseType`. This will act as a `skip-release` unless paired with a SEMVER label

```json
{
  "labels": [{ "releaseType": "none", "name": "documentation" }]
}
```

5. Changed `title` to `changelogTitle`.

```json
{
  "labels": [{ "changelogTitle": "New Docs Yo!", "name": "documentation" }]
}
```

---

#### 💥 Breaking Change

- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Release v8 [#758](https://github.com/intuit/auto/pull/758) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@adierkens](https://github.com/adierkens))
- `auto`, `@auto-it/core`
  - Deprecate "--very-verbose, -w" in favor of "-vv" [#771](https://github.com/intuit/auto/pull/771) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/conventional-commits`, `@auto-it/jira`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/slack`
  - Simplify label configuration [#751](https://github.com/intuit/auto/pull/751) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/npm`
  - move git clean check to core [#746](https://github.com/intuit/auto/pull/746) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/chrome`, `@auto-it/crates`, `@auto-it/git-tag`, `@auto-it/maven`, `@auto-it/npm`
  - change getPreviousVersion hook args. can access prefixRelease from root class instead [#734](https://github.com/intuit/auto/pull/734) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/released`
  - remove old use of prerelease label + add prerelease label to released plugin [#729](https://github.com/intuit/auto/pull/729) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🚀 Enhancement

- `@auto-it/core`
  - add release notes to prerelease PRs [#777](https://github.com/intuit/auto/pull/777) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`
  - next: post comment w/prerelease version on prerelease PR branches [#773](https://github.com/intuit/auto/pull/773) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/upload-assets`
  - Add glob support to the upload-assets plugin [#770](https://github.com/intuit/auto/pull/770) ([@adierkens](https://github.com/adierkens))
- `@auto-it/core`, `@auto-it/git-tag`, `@auto-it/npm`
  - move determineNextVersion to core [#747](https://github.com/intuit/auto/pull/747) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`
  - implment dry-run flag for next command [#733](https://github.com/intuit/auto/pull/733) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/git-tag`
  - implement prerelease branches for git-tag plugin [#732](https://github.com/intuit/auto/pull/732) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/npm`
  - shipit: add flag to only publish to 'latest' tag when "release" label is present [#731](https://github.com/intuit/auto/pull/731) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/slack`
  - allow user to configure what branches are treated as prerelease branches [#730](https://github.com/intuit/auto/pull/730) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/npm`
  - Add ability for "next" branch publishing [#726](https://github.com/intuit/auto/pull/726) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/npm`
  - only grant contributions for work in commit [#786](https://github.com/intuit/auto/pull/786) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Fix some changelog bugs [#784](https://github.com/intuit/auto/pull/784) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - omit commits that have already been released [#783](https://github.com/intuit/auto/pull/783) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/released`, `@auto-it/slack`
  - do not call afterRelease hooks during dry run [#780](https://github.com/intuit/auto/pull/780) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - do not add labels or comments to prerelease branch PRs [#778](https://github.com/intuit/auto/pull/778) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie) [@zephraph](https://github.com/zephraph) [@bmuenzenmeyer](https://github.com/bmuenzenmeyer) [@sarah-vanderlaan](https://github.com/sarah-vanderlaan))
- `@auto-it/npm`
  - fix branch detection in NPM plugin [#774](https://github.com/intuit/auto/pull/774) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Don't create a version commit for prereleases [#768](https://github.com/intuit/auto/pull/768) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/npm`
  - ensure canary versions dont use extra bumps [#735](https://github.com/intuit/auto/pull/735) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/released`
  - don't run released plugin on "next" branch PRs [#728](https://github.com/intuit/auto/pull/728) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - must set git user before publishing so we know we can commit [#727](https://github.com/intuit/auto/pull/727) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- reset monorepo version for next branch [#769](https://github.com/intuit/auto/pull/769) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/git-tag`, `@auto-it/npm`, `@auto-it/s3`
  - add tests [#779](https://github.com/intuit/auto/pull/779) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/upload-assets`
  - More resilient test case [#772](https://github.com/intuit/auto/pull/772) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/conventional-commits`
  - Update README to include required npm plugin [#776](https://github.com/intuit/auto/pull/776) ([@sarah-vanderlaan](https://github.com/sarah-vanderlaan))

#### 🔩 Dependency Updates

- Bump eslint-plugin-import from 2.18.2 to 2.19.1 [#767](https://github.com/intuit/auto/pull/767) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump change-case from 4.0.0 to 4.1.0 [#766](https://github.com/intuit/auto/pull/766) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 12.12.14 to 12.12.15 [#765](https://github.com/intuit/auto/pull/765) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.9.0 to 2.10.0 [#764](https://github.com/intuit/auto/pull/764) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript from 3.7.2 to 3.7.3 [#763](https://github.com/intuit/auto/pull/763) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.9.0 to 2.10.0 [#762](https://github.com/intuit/auto/pull/762) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pkg from 4.4.0 to 4.4.1 [#760](https://github.com/intuit/auto/pull/760) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 18.4.1 to 18.4.3 [#759](https://github.com/intuit/auto/pull/759) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.11.1 to 6.11.2 [#761](https://github.com/intuit/auto/pull/761) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 📚 Blog Post

- create v8 announcement blog [#782](https://github.com/intuit/auto/pull/782) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 6

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Adam Dierkens ([@adierkens](https://github.com/adierkens))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Brian Muenzenmeyer ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))
- Justin Bennett ([@zephraph](https://github.com/zephraph))
- Sarah van der Laan ([@sarah-vanderlaan](https://github.com/sarah-vanderlaan))

---

# v7.17.0 (Fri Dec 06 2019)

#### 🚀 Enhancement

- `@auto-it/all-contributors`
  - add more defaults to all-contributors plugin [#756](https://github.com/intuit/auto/pull/756) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- docs(introduction): fix typo [#755](https://github.com/intuit/auto/pull/755) ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))
- fix docs build issue [#753](https://github.com/intuit/auto/pull/753) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Making the docs a little more solid... [#752](https://github.com/intuit/auto/pull/752) ([@zephraph](https://github.com/zephraph))
- Slight improvements to GitHub actions docs [#750](https://github.com/intuit/auto/pull/750) ([@zephraph](https://github.com/zephraph))
- Update autorc.md [#713](https://github.com/intuit/auto/pull/713) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/released`
  - remove references to "npm" plugin in "released" docs [#712](https://github.com/intuit/auto/pull/712) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump eslint-plugin-jsdoc from 18.1.4 to 18.1.5 [#725](https://github.com/intuit/auto/pull/725) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.0.4 to 23.1.1 [#745](https://github.com/intuit/auto/pull/745) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 9.4.3 to 9.5.0 [#737](https://github.com/intuit/auto/pull/737) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump change-case from 3.1.0 to 4.0.0 [#744](https://github.com/intuit/auto/pull/744) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 6.7.1 to 6.7.2 [#738](https://github.com/intuit/auto/pull/738) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 12.12.12 to 12.12.14 [#736](https://github.com/intuit/auto/pull/736) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.8.0 to 2.9.0 [#741](https://github.com/intuit/auto/pull/741) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump ts-jest from 24.1.0 to 24.2.0 [#742](https://github.com/intuit/auto/pull/742) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump pom-parser from 1.1.1 to 1.2.0 [#740](https://github.com/intuit/auto/pull/740) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 18.1.5 to 18.4.1 [#739](https://github.com/intuit/auto/pull/739) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.7.0 to 2.9.0 [#724](https://github.com/intuit/auto/pull/724) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 6.6.0 to 6.7.1 [#719](https://github.com/intuit/auto/pull/719) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 18.0.1 to 18.1.4 [#718](https://github.com/intuit/auto/pull/718) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.7.0 to 2.8.0 [#720](https://github.com/intuit/auto/pull/720) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lerna from 3.18.4 to 3.19.0 [#714](https://github.com/intuit/auto/pull/714) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 9.4.2 to 9.4.3 [#717](https://github.com/intuit/auto/pull/717) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.7.0 to 2.8.0 [#716](https://github.com/intuit/auto/pull/716) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 12.12.8 to 12.12.12 [#722](https://github.com/intuit/auto/pull/722) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.5.0 to 6.7.0 [#723](https://github.com/intuit/auto/pull/723) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/slack`
  - Bump @types/node-fetch from 2.5.3 to 2.5.4 [#721](https://github.com/intuit/auto/pull/721) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.10.0 to 6.11.0 [#715](https://github.com/intuit/auto/pull/715) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.11.0 to 6.11.1 [#743](https://github.com/intuit/auto/pull/743) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 4

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Brian Muenzenmeyer ([@bmuenzenmeyer](https://github.com/bmuenzenmeyer))
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.16.3 (Mon Nov 18 2019)

#### 🏠 Internal

- `@auto-it/core`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/released`
  - Upgrade to Typescript 3.7 [#711](https://github.com/intuit/auto/pull/711) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- force docs publish [#700](https://github.com/intuit/auto/pull/700) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`
  - Modified packages/cli README [#701](https://github.com/intuit/auto/pull/701) ([@rdipika](https://github.com/rdipika) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump typescript from 3.6.4 to 3.7.2 [#710](https://github.com/intuit/auto/pull/710) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.0.3 to 23.0.4 [#709](https://github.com/intuit/auto/pull/709) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 24.0.22 to 24.0.23 [#708](https://github.com/intuit/auto/pull/708) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.6.1 to 2.7.0 [#707](https://github.com/intuit/auto/pull/707) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 3.0.9 to 3.1.0 [#706](https://github.com/intuit/auto/pull/706) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 12.12.5 to 12.12.8 [#704](https://github.com/intuit/auto/pull/704) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jsdoc from 17.1.1 to 18.0.1 [#703](https://github.com/intuit/auto/pull/703) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lerna from 3.18.3 to 3.18.4 [#702](https://github.com/intuit/auto/pull/702) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- update ignite [#699](https://github.com/intuit/auto/pull/699) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Bump @octokit/rest from 16.34.1 to 16.35.0 [#705](https://github.com/intuit/auto/pull/705) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- rdipika94 ([@rdipika](https://github.com/rdipika))

---

# v7.16.2 (Thu Nov 14 2019)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - More flexible monorepo publishing [#698](https://github.com/intuit/auto/pull/698) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.16.1 (Thu Nov 14 2019)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - match behavior between lerna and npm when pushing git tags [#697](https://github.com/intuit/auto/pull/697) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.16.0 (Thu Nov 14 2019)

#### 🚀 Enhancement

- automatically update brew formula [#694](https://github.com/intuit/auto/pull/694) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- correct grammar [#696](https://github.com/intuit/auto/pull/696) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- correct docs [#695](https://github.com/intuit/auto/pull/695) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.15.2 (Thu Nov 14 2019)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - Fixed string interpolation on Lerna version bump [#693](https://github.com/intuit/auto/pull/693) ([@jrnail23](https://github.com/jrnail23))

#### Authors: 1

- James Nail ([@jrnail23](https://github.com/jrnail23))

---

# v7.15.1 (Wed Nov 13 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - add logs for where plugins were found [#691](https://github.com/intuit/auto/pull/691) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add non-npm docs [#679](https://github.com/intuit/auto/pull/679) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add jenkins usage [#690](https://github.com/intuit/auto/pull/690) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add more platform docs [#689](https://github.com/intuit/auto/pull/689) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- modernize circleci docs [#688](https://github.com/intuit/auto/pull/688) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add docs on merging quickly [#686](https://github.com/intuit/auto/pull/686) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add docs on how to use within a lerna monorepo [#685](https://github.com/intuit/auto/pull/685) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.15.0 (Tue Nov 12 2019)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`, `@auto-it/git-tag`, `@auto-it/npm`
  - Default to `git-tag` plugin when run from binary [#684](https://github.com/intuit/auto/pull/684) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.14.1 (Tue Nov 12 2019)

#### 🐛 Bug Fix

- `@auto-it/all-contributors`
  - Fix bug where 'all-contributors' plugin wasn't picking up changes [#683](https://github.com/intuit/auto/pull/683) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.14.0 (Tue Nov 12 2019)

#### 🚀 Enhancement

- `@auto-it/core`
  - detect PR number when running "auto label" without "--pr" [#682](https://github.com/intuit/auto/pull/682) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `auto`
  - Rewrite README Issue #666 [#680](https://github.com/intuit/auto/pull/680) ([@karenclo](https://github.com/karenclo) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Karen Lo ([@karenclo](https://github.com/karenclo))

---

# v7.13.3 (Tue Nov 12 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - warn when canary not implemented [#678](https://github.com/intuit/auto/pull/678) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- must trust github for docs to publish [#667](https://github.com/intuit/auto/pull/667) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @octokit/graphql from 4.3.0 to 4.3.1 [#676](https://github.com/intuit/auto/pull/676) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 12.3.1 to 12.4.0 [#675](https://github.com/intuit/auto/pull/675) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.5.0 to 2.6.1 [#674](https://github.com/intuit/auto/pull/674) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 23.0.1 to 23.0.3 [#673](https://github.com/intuit/auto/pull/673) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump prettier from 1.18.2 to 1.19.1 [#672](https://github.com/intuit/auto/pull/672) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 24.0.21 to 24.0.22 [#671](https://github.com/intuit/auto/pull/671) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node-fetch from 2.5.2 to 2.5.3 [#669](https://github.com/intuit/auto/pull/669) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`
  - Bump chalk from 2.4.2 to 3.0.0 [#670](https://github.com/intuit/auto/pull/670) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/all-contributors`
  - Bump all-contributors-cli from 6.9.3 to 6.10.0 [#677](https://github.com/intuit/auto/pull/677) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.13.2 (Sun Nov 10 2019)

#### 📝 Documentation

- clarify plugin docs [#664](https://github.com/intuit/auto/pull/664) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Add JSDoc comment to most everything [#665](https://github.com/intuit/auto/pull/665) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### ⚠️ Pushed to master

- skip ci when updating gh-pages ([@hipstersmoothie](https://github.com/hipstersmoothie))
- set git user ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.13.1 (Thu Nov 07 2019)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - Fix GitHub Release's release notes for monorepo during shipit [#663](https://github.com/intuit/auto/pull/663) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.13.0 (Thu Nov 07 2019)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/npm`
  - NPM: manage a changelog for each sub-package in monorepo [#658](https://github.com/intuit/auto/pull/658) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.12.9 (Thu Nov 07 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix wrong author in changelog [#661](https://github.com/intuit/auto/pull/661) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.12.8 (Thu Nov 07 2019)

#### 🐛 Bug Fix

- `@auto-it/first-time-contributor`
  - Fix multiple first-time-contributor thank you [#660](https://github.com/intuit/auto/pull/660) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.12.7 (Thu Nov 07 2019)

#### 🐛 Bug Fix

- `@auto-it/released`
  - Fix creating old changelogs [#659](https://github.com/intuit/auto/pull/659) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @types/node from 12.11.1 to 12.12.5 [#643](https://github.com/intuit/auto/pull/643) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump twitter-text from 3.0.0 to 3.0.1 [#651](https://github.com/intuit/auto/pull/651) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint from 6.5.1 to 6.6.0 [#649](https://github.com/intuit/auto/pull/649) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-prettier from 6.4.0 to 6.5.0 [#652](https://github.com/intuit/auto/pull/652) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 24.0.19 to 24.0.21 [#647](https://github.com/intuit/auto/pull/647) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump deepmerge from 4.1.1 to 4.2.2 [#646](https://github.com/intuit/auto/pull/646) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/eslint-plugin from 2.5.0 to 2.6.0 [#645](https://github.com/intuit/auto/pull/645) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump env-ci from 4.5.0 to 4.5.1 [#644](https://github.com/intuit/auto/pull/644) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump cosmiconfig from 5.2.1 to 6.0.0 [#650](https://github.com/intuit/auto/pull/650) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Bump @octokit/rest from 16.34.0 to 16.34.1 [#653](https://github.com/intuit/auto/pull/653) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @types/dotenv from 6.1.1 to 8.2.0 [#648](https://github.com/intuit/auto/pull/648) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.12.5 (Tue Nov 05 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix issue with latest enterprise compat plugin [#655](https://github.com/intuit/auto/pull/655) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Update changelog to include prs without labels when using custom patch label [#640](https://github.com/intuit/auto/pull/640) ([@bnigh](https://github.com/bnigh))

#### 🏠 Internal

- more reliable docs publish [#642](https://github.com/intuit/auto/pull/642) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Adds documentation for using auto with no plugins [#641](https://github.com/intuit/auto/pull/641) ([@athityakumar](https://github.com/athityakumar))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@bnigh](https://github.com/bnigh)
- Athitya Kumar ([@athityakumar](https://github.com/athityakumar))

---

# v7.12.5 (Wed Oct 30 2019)

:tada: This release contains work from a new contributor! :tada:

Thank you, Athitya Kumar ([@athityakumar](https://github.com/athityakumar)), for all your work!

#### 🐛 Bug Fix

- `@auto-it/core`
  - Update changelog to include prs without labels when using custom patch label [#640](https://github.com/intuit/auto/pull/640) ([@bnigh](https://github.com/bnigh))

#### 📝 Documentation

- Adds documentation for using auto with no plugins [#641](https://github.com/intuit/auto/pull/641) ([@athityakumar](https://github.com/athityakumar))

#### Authors: 2

- [@bnigh](https://github.com/bnigh)
- Athitya Kumar ([@athityakumar](https://github.com/athityakumar))

---

# v7.12.4 (Tue Oct 29 2019)

#### 🐛 Bug Fix

- `@auto-it/released`
  - Update released plugin message creation to replace all tokens [#638](https://github.com/intuit/auto/pull/638) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 🔩 Dependency Updates

- Bump @typescript-eslint/eslint-plugin from 2.4.0 to 2.5.0 [#636](https://github.com/intuit/auto/pull/636) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/graphql from 4.2.2 to 4.3.0 [#637](https://github.com/intuit/auto/pull/637) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-plugin-jest from 22.19.0 to 23.0.1 [#634](https://github.com/intuit/auto/pull/634) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump command-line-application from 0.9.3 to 0.9.5 [#635](https://github.com/intuit/auto/pull/635) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @typescript-eslint/parser from 2.4.0 to 2.5.0 [#633](https://github.com/intuit/auto/pull/633) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump https-proxy-agent from 3.0.0 to 3.0.1 [#632](https://github.com/intuit/auto/pull/632) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lerna from 3.18.1 to 3.18.3 [#630](https://github.com/intuit/auto/pull/630) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 12.3.0 to 12.3.1 [#629](https://github.com/intuit/auto/pull/629) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/semver from 6.0.2 to 6.2.0 [#628](https://github.com/intuit/auto/pull/628) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @octokit/rest from 16.33.1 to 16.34.0 [#631](https://github.com/intuit/auto/pull/631) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.12.3 (Thu Oct 24 2019)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/first-time-contributor`
  - better error messaging when tags aren't present [#626](https://github.com/intuit/auto/pull/626) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.12.2 (Wed Oct 23 2019)

:tada: This release contains work from a new contributor! :tada:

Thank you, Rocio Montes ([@roxiomontes](https://github.com/roxiomontes)), for all your work!

#### 🐛 Bug Fix

- adding Auto svg logo [#625](https://github.com/intuit/auto/pull/625) ([@roxiomontes](https://github.com/roxiomontes))

#### Authors: 1

- Rocio Montes ([@roxiomontes](https://github.com/roxiomontes))

---

# v7.12.1 (Wed Oct 23 2019)

#### 🐛 Bug Fix

- `@auto-it/chrome`, `@auto-it/crates`, `@auto-it/git-tag`, `@auto-it/maven`, `@auto-it/npm`
  - Fix windows git refspec problem [#613](https://github.com/intuit/auto/pull/613) ([@adierkens](https://github.com/adierkens))

#### Authors: 1

- Adam Dierkens ([@adierkens](https://github.com/adierkens))

---

# v7.12.0 (Mon Oct 21 2019)

### Release Notes

_From #612_

### Commit Files

Plugin authors can now write plugins that do things based on the files in a commit. Anywhere you can receive a `commit` object you will also receive the files changed in that commit.

### `afterAddToChangelog`

A new hook is available to plugin developers. the `afterAddToChangelog` enables developers to run bits of automation after the new changelog is created. This is useful for getting extra commits into a release before publishing. The `all-contributors` plugin utilizes this hook.

---

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/all-contributors`
  - New Plugin: All contributors [#612](https://github.com/intuit/auto/pull/612) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Move git-tag to "Package Manager Plugins" [#611](https://github.com/intuit/auto/pull/611) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump env-ci from 4.1.3 to 4.5.0 [#619](https://github.com/intuit/auto/pull/619) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump all-contributors-cli from 6.9.1 to 6.9.3 [#623](https://github.com/intuit/auto/pull/623) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @octokit/plugin-throttling from 2.6.0 to 2.7.0 [#622](https://github.com/intuit/auto/pull/622) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 3.0.8 to 3.0.9 [#621](https://github.com/intuit/auto/pull/621) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 24.0.18 to 24.0.19 [#620](https://github.com/intuit/auto/pull/620) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lerna from 3.17.0 to 3.18.1 [#618](https://github.com/intuit/auto/pull/618) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump eslint-config-xo from 0.27.1 to 0.27.2 [#617](https://github.com/intuit/auto/pull/617) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump dotenv from 8.1.0 to 8.2.0 [#616](https://github.com/intuit/auto/pull/616) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 12.7.12 to 12.11.1 [#615](https://github.com/intuit/auto/pull/615) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump lodash from 4.17.11 to 4.17.15 [#614](https://github.com/intuit/auto/pull/614) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.11.0 (Fri Oct 18 2019)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/chrome`, `@auto-it/git-tag`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/s3`, `@auto-it/twitter`
  - New Plugin: Amazon S3 [#466](https://github.com/intuit/auto/pull/466) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.10.0 (Fri Oct 18 2019)

### Release Notes

_From #610_

This PR also introduces the `changelog.addToBody` hook. This can be used to add whatever extra content you want to a changelog.

The following adds a random GIF from [giphy](https://giphy.com) to each new changelog.

```ts
auto.hooks.onCreateChangelog.tapPromise('Giphy', changelog =>
  changelog.hooks.renderChangelogLine.tapPromise(
    'Giphy',
    async (notes, commits) => {
      const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_KEY}`);
      const json = await response.json();
      const { data: gif } = json;

      return [...notes, `![${gif.title}](${gif.url})\n`]
    }
  );
);
```

---

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/crates`, `@auto-it/first-time-contributor`
  - New Plugin: "first-time-contributor" [#610](https://github.com/intuit/auto/pull/610) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### ⚠️ Pushed to master

- `@auto-it/first-time-contributor`
  - fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.9.2 (Thu Oct 17 2019)

#### 🏠 Internal

- `auto`
  - Switch to command-line-application and command-line-docs [#585](https://github.com/intuit/auto/pull/585) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.9.1 (Thu Oct 17 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - only add hash to canary version if no pr or build detected [#609](https://github.com/intuit/auto/pull/609) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- `@auto-it/crates`, `@auto-it/maven`
  - fix install names in readmes [#608](https://github.com/intuit/auto/pull/608) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.9.0 (Wed Oct 16 2019)

#### 🚀 Enhancement

- `@auto-it/crates`
  - Crates (Rust language) plugin [#587](https://github.com/intuit/auto/pull/587) ([@Celeo](https://github.com/Celeo) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- update plugin template [#606](https://github.com/intuit/auto/pull/606) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Modern build output [#607](https://github.com/intuit/auto/pull/607) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Update Tooling [#605](https://github.com/intuit/auto/pull/605) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- update README.md [#586](https://github.com/intuit/auto/pull/586) ([@Celeo](https://github.com/Celeo))

#### 🔩 Dependency Updates

- Bump lerna from 3.16.5 to 3.17.0 [#598](https://github.com/intuit/auto/pull/598) ([@Celeo](https://github.com/Celeo))
- Bump lint-staged from 9.4.0 to 9.4.1 [#595](https://github.com/intuit/auto/pull/595) ([@Celeo](https://github.com/Celeo))
- Bump @types/node from 12.7.11 to 12.7.12 [#600](https://github.com/intuit/auto/pull/600) ([@Celeo](https://github.com/Celeo))
- Bump lint-staged from 9.4.1 to 9.4.2 [#601](https://github.com/intuit/auto/pull/601) ([@Celeo](https://github.com/Celeo))
- Bump deepmerge from 4.0.0 to 4.1.1 [#597](https://github.com/intuit/auto/pull/597) ([@Celeo](https://github.com/Celeo))
- Bump ts-jest from 24.0.2 to 24.1.0 [#580](https://github.com/intuit/auto/pull/580) ([@Celeo](https://github.com/Celeo))
- Bump @octokit/graphql from 4.2.0 to 4.2.2 [#599](https://github.com/intuit/auto/pull/599) ([@Celeo](https://github.com/Celeo))
- Bump lerna from 3.16.4 to 3.16.5 [#589](https://github.com/intuit/auto/pull/589) ([@Celeo](https://github.com/Celeo))
- Bump @types/node from 12.7.8 to 12.7.11 [#590](https://github.com/intuit/auto/pull/590) ([@Celeo](https://github.com/Celeo))
- Bump deepmerge from 4.0.0 to 4.1.0 [#591](https://github.com/intuit/auto/pull/591) ([@Celeo](https://github.com/Celeo))
- Bump ignite from 1.10.2 to 1.10.5 [#592](https://github.com/intuit/auto/pull/592) ([@Celeo](https://github.com/Celeo))
- Bump husky from 3.0.7 to 3.0.8 [#594](https://github.com/intuit/auto/pull/594) ([@Celeo](https://github.com/Celeo))
- `@auto-it/core`
  - Bump @octokit/rest from 16.30.1 to 16.32.0 [#593](https://github.com/intuit/auto/pull/593) ([@Celeo](https://github.com/Celeo))
- `@auto-it/core`
  - Bump @octokit/rest from 16.32.0 to 16.33.1 [#602](https://github.com/intuit/auto/pull/602) ([@Celeo](https://github.com/Celeo))
- `@auto-it/core`
  - Bump https-proxy-agent from 2.2.2 to 3.0.0 [#588](https://github.com/intuit/auto/pull/588) ([@Celeo](https://github.com/Celeo))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Matt Boulanger ([@Celeo](https://github.com/Celeo))

---

# v7.8.0 (Fri Oct 04 2019)

#### 🚀 Enhancement

- `@auto-it/core`
  - proxy support in auto [#584](https://github.com/intuit/auto/pull/584) (ykhandelwal@intuit.com [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- ykhandelwal (ykhandelwal@intuit.com)

---

# v7.7.0 (Thu Oct 03 2019)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Ability to edit comments [#583](https://github.com/intuit/auto/pull/583) (alex_sutedja@intuit.com [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump graphql from 14.5.4 to 14.5.8 [#582](https://github.com/intuit/auto/pull/582) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump env-ci from 4.1.1 to 4.1.3 [#581](https://github.com/intuit/auto/pull/581) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 3.0.5 to 3.0.7 [#579](https://github.com/intuit/auto/pull/579) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 12.7.5 to 12.7.8 [#578](https://github.com/intuit/auto/pull/578) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lint-staged from 8.1.6 to 9.4.0 [#577](https://github.com/intuit/auto/pull/577) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump all-contributors-cli from 6.8.1 to 6.9.1 [#575](https://github.com/intuit/auto/pull/575) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @octokit/rest from 16.30.0 to 16.30.1 [#576](https://github.com/intuit/auto/pull/576) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- asutedja (alex_sutedja@intuit.com)

---

# v7.6.2 (Mon Sep 30 2019)

#### 🏠 Internal

- `@auto-it/core`
  - Update Octokit [#574](https://github.com/intuit/auto/pull/574) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.6.1 (Fri Sep 27 2019)

#### 🐛 Bug Fix

- `@auto-it/jira`
  - Fix jira plugin regex [#572](https://github.com/intuit/auto/pull/572) (velu_ganapathy@intuit.com [@vganapat](https://github.com/vganapat))

#### 🔩 Dependency Updates

- Bump enquirer from 2.3.1 to 2.3.2 [#569](https://github.com/intuit/auto/pull/569) ([@vganapat](https://github.com/vganapat))
- Bump typescript from 3.6.2 to 3.6.3 [#568](https://github.com/intuit/auto/pull/568) ([@vganapat](https://github.com/vganapat))
- Bump typescript-tslint-plugin from 0.4.0 to 0.5.4 [#566](https://github.com/intuit/auto/pull/566) ([@vganapat](https://github.com/vganapat))
- Bump @types/node from 12.7.4 to 12.7.5 [#565](https://github.com/intuit/auto/pull/565) ([@vganapat](https://github.com/vganapat))
- Bump husky from 3.0.4 to 3.0.5 [#564](https://github.com/intuit/auto/pull/564) ([@vganapat](https://github.com/vganapat))
- Bump tslint from 5.18.0 to 5.20.0 [#563](https://github.com/intuit/auto/pull/563) ([@vganapat](https://github.com/vganapat))
- `@auto-it/core`, `@auto-it/slack`
  - Bump @types/node-fetch from 2.5.0 to 2.5.2 [#570](https://github.com/intuit/auto/pull/570) ([@vganapat](https://github.com/vganapat))

#### Authors: 2

- [@vganapat](https://github.com/vganapat)
- Velu Ganapathy (velu_ganapathy@intuit.com)

---

# v7.6.0 (Thu Sep 12 2019)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Add 'from' option for version command [#561](https://github.com/intuit/auto/pull/561) ([@bnigh](https://github.com/bnigh))

#### Authors: 1

- [@bnigh](https://github.com/bnigh)

---

# v7.5.0 (Thu Sep 12 2019)

#### 🚀 Enhancement

- `auto`, `@auto-it/core`
  - Add 'from' option for release command [#552](https://github.com/intuit/auto/pull/552) ([@bnigh](https://github.com/bnigh))

#### Authors: 1

- [@bnigh](https://github.com/bnigh)

---

# v7.4.5 (Mon Sep 09 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Canary: fallback to first commit if now tags exist [#560](https://github.com/intuit/auto/pull/560) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @types/node from 12.7.2 to 12.7.4 [#559](https://github.com/intuit/auto/pull/559) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/semver from 6.0.1 to 6.0.2 [#558](https://github.com/intuit/auto/pull/558) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump file-type from 12.1.0 to 12.3.0 [#557](https://github.com/intuit/auto/pull/557) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `auto`
  - Bump rimraf from 2.6.3 to 3.0.0 [#556](https://github.com/intuit/auto/pull/556) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v7.4.4 (Tue Sep 03 2019)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - Fix setting npm token with a URL that doesn't end in / [#551](https://github.com/intuit/auto/pull/551) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump jest from 24.8.0 to 24.9.0 [#547](https://github.com/intuit/auto/pull/547) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/graphql from 14.2.3 to 14.5.0 [#545](https://github.com/intuit/auto/pull/545) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump dotenv from 8.0.0 to 8.1.0 [#544](https://github.com/intuit/auto/pull/544) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump typescript from 3.5.3 to 3.6.2 [#543](https://github.com/intuit/auto/pull/543) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/slack`
  - Bump node-fetch from 2.5.0 to 2.6.0 [#546](https://github.com/intuit/auto/pull/546) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v7.4.3 (Mon Sep 02 2019)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - set-token: handle when no name in root package.json [#549](https://github.com/intuit/auto/pull/549) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.4.2 (Mon Sep 02 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - label creation is case insensitive [#548](https://github.com/intuit/auto/pull/548) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.4.1 (Sun Sep 01 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix create-labels bug [#542](https://github.com/intuit/auto/pull/542) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.4.0 (Sat Aug 31 2019)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/conventional-commits`
  - add ability for configured labels to be an array [#540](https://github.com/intuit/auto/pull/540) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.3.6 (Wed Aug 28 2019)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/released`
  - omit commit+prs that: aren't found in repo, are issues, or have the "released" label [#538](https://github.com/intuit/auto/pull/538) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- [Security] Bump mixin-deep from 1.3.1 to 1.3.2 [#536](https://github.com/intuit/auto/pull/536) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v7.3.5 (Wed Aug 28 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Ensure the release doesn't fail if a PR doesn't exist [#537](https://github.com/intuit/auto/pull/537) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.3.4 (Mon Aug 26 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Fix PRs with non-configured labels being omitted from changelogs [#533](https://github.com/intuit/auto/pull/533) ([@bnigh](https://github.com/bnigh))

#### Authors: 1

- [@bnigh](https://github.com/bnigh)

---

# v7.3.3 (Mon Aug 26 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Improve Author Reporting [#531](https://github.com/intuit/auto/pull/531) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @types/node from 12.6.8 to 12.7.2 [#520](https://github.com/intuit/auto/pull/520) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 3.0.3 to 3.0.4 [#530](https://github.com/intuit/auto/pull/530) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump url-join from 4.0.0 to 4.0.1 [#527](https://github.com/intuit/auto/pull/527) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 24.0.17 to 24.0.18 [#522](https://github.com/intuit/auto/pull/522) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump typescript from 3.3.4000 to 3.5.3 [#528](https://github.com/intuit/auto/pull/528) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/chrome`, `@auto-it/maven`, `@auto-it/npm`
  - Bump tapable from 2.0.0-beta.4 to 2.0.0-beta.8 [#515](https://github.com/intuit/auto/pull/515) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`
  - Bump command-line-usage from 5.0.5 to 6.0.2 [#524](https://github.com/intuit/auto/pull/524) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/npm`
  - Bump env-ci from 3.2.2 to 4.1.1 [#523](https://github.com/intuit/auto/pull/523) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump @octokit/graphql from 2.1.2 to 4.0.0 [#529](https://github.com/intuit/auto/pull/529) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Bump @octokit/rest from 16.28.1 to 16.28.7 [#521](https://github.com/intuit/auto/pull/521) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/slack`
  - Bump @types/node-fetch from 2.3.3 to 2.5.0 [#526](https://github.com/intuit/auto/pull/526) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.3.2 (Sat Aug 17 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - attach sha to canary version if no (pr || build) [#519](https://github.com/intuit/auto/pull/519) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.3.1 (Fri Aug 16 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - add extra logs [#517](https://github.com/intuit/auto/pull/517) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump @types/jest from 24.0.15 to 24.0.17 [#511](https://github.com/intuit/auto/pull/511) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump husky from 2.0.0 to 3.0.3 [#512](https://github.com/intuit/auto/pull/512) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump lerna from 3.13.4 to 3.16.4 [#508](https://github.com/intuit/auto/pull/508) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump prettier from 1.16.4 to 1.18.2 [#514](https://github.com/intuit/auto/pull/514) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`
  - Bump cosmiconfig from 5.2.0 to 5.2.1 [#513](https://github.com/intuit/auto/pull/513) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v7.3.0 (Thu Aug 15 2019)

#### 🚀 Enhancement

- `auto`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Add Maven Plugin [#510](https://github.com/intuit/auto/pull/510) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump graphql from 14.2.1 to 14.4.2 [#507](https://github.com/intuit/auto/pull/507) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump jest from 24.5.0 to 24.8.0 [#505](https://github.com/intuit/auto/pull/505) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump enquirer from 2.3.0 to 2.3.1 [#504](https://github.com/intuit/auto/pull/504) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump semver from 6.1.1 to 6.3.0 [#499](https://github.com/intuit/auto/pull/499) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/node from 12.0.7 to 12.6.8 [#500](https://github.com/intuit/auto/pull/500) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/semver from 6.0.0 to 6.0.1 [#501](https://github.com/intuit/auto/pull/501) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump tslint from 5.14.0 to 5.18.0 [#502](https://github.com/intuit/auto/pull/502) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/core`, `@auto-it/released`
  - Bump deepmerge from 3.2.0 to 4.0.0 [#506](https://github.com/intuit/auto/pull/506) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- `@auto-it/upload-assets`
  - Bump file-type from 11.1.0 to 12.1.0 [#498](https://github.com/intuit/auto/pull/498) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v7.2.3 (Mon Jul 29 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix logging error in pr-check [#497](https://github.com/intuit/auto/pull/497) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- change to dependabot [#495](https://github.com/intuit/auto/pull/495) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- fix docs [#496](https://github.com/intuit/auto/pull/496) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Bump all-contributors-cli from 6.4.0 to 6.8.1 [#493](https://github.com/intuit/auto/pull/493) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @atomist/slack-messages from 1.1.0 to 1.1.1 [#491](https://github.com/intuit/auto/pull/491) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/graphql from 14.2.0 to 14.2.3 [#494](https://github.com/intuit/auto/pull/494) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump @types/jest from 24.0.13 to 24.0.15 [#492](https://github.com/intuit/auto/pull/492) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- [Security] Bump lodash.template from 4.4.0 to 4.5.0 [#489](https://github.com/intuit/auto/pull/489) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v7.2.2 (Wed Jul 24 2019)

#### 🏠 Internal

- Remove pr semver check [#479](https://github.com/intuit/auto/pull/479) ([@zephraph](https://github.com/zephraph))

#### 📝 Documentation

- Fix links in docs [#486](https://github.com/intuit/auto/pull/486) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update README.md [#485](https://github.com/intuit/auto/pull/485) ([@RichieRunner](https://github.com/RichieRunner))

#### Authors: 3

- Justin Bennett ([@zephraph](https://github.com/zephraph))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Richie ([@RichieRunner](https://github.com/RichieRunner))

---

# v7.2.1 (Tue Jul 09 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Rework plugin importing logic [#480](https://github.com/intuit/auto/pull/480) ([@zephraph](https://github.com/zephraph))
- `@auto-it/core`
  - Fix type error with changelog hook [#478](https://github.com/intuit/auto/pull/478) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.2.0 (Thu Jul 04 2019)

#### 🚀 Enhancement

- `@auto-it/slack`
  - feat(slack): add custom slack at targets [#475](https://github.com/intuit/auto/pull/475) ([@hello-woof](https://github.com/hello-woof))

#### Authors: 1

- Zachary Sherwin ([@hello-woof](https://github.com/hello-woof))

---

# v7.1.4 (Wed Jul 03 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Add a little extra error handling around plugin loading [#474](https://github.com/intuit/auto/pull/474) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.1.3 (Sat Jun 29 2019)

#### 🐛 Bug Fix

- `@auto-it/git-tag`
  - Fix wording on Git tag plugin [#469](https://github.com/intuit/auto/pull/469) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.1.2 (Tue Jun 18 2019)

#### 🐛 Bug Fix

- `@auto-it/slack`
  - Slack Plugin: fix tag link [#464](https://github.com/intuit/auto/pull/464) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.1.1 (Mon Jun 17 2019)

#### 🐛 Bug Fix

- `@auto-it/conventional-commits`
  - Conventional Commits Plugin: fix looping issue [#461](https://github.com/intuit/auto/pull/461) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.1.0 (Fri Jun 14 2019)

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/git-tag`
  - Git tag Plugin [#460](https://github.com/intuit/auto/pull/460) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.13 (Mon Jun 10 2019)

#### 🏠 Internal

- `@auto-it/core`, `@auto-it/upload-assets`
  - update octokit [#459](https://github.com/intuit/auto/pull/459) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.12 (Sat Jun 08 2019)

#### 📝 Documentation

- Update AutoChangeLog with Typo Fixes [#457](https://github.com/intuit/auto/pull/457) ([@jdfalko](https://github.com/jdfalko))

#### Authors: 1

- [@jdfalko](https://github.com/jdfalko)

---

# v7.0.11 (Thu Jun 06 2019)

#### 🏠 Internal

- Bump handlebars from 4.1.0 to 4.1.2 [#453](https://github.com/intuit/auto/pull/453) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 1

- [@dependabot[bot]](https://github.com/dependabot[bot])

---

# v7.0.10 (Thu Jun 06 2019)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - NPM Plugin: fix canary versions [#456](https://github.com/intuit/auto/pull/456) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.9 (Thu Jun 06 2019)

#### 🏠 Internal

- Bump js-yaml from 3.12.0 to 3.13.1 [#454](https://github.com/intuit/auto/pull/454) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 1

- [@dependabot[bot]](https://github.com/dependabot[bot])

---

# v7.0.8 (Thu Jun 06 2019)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - Independant Canary version reporting + Whitespace in pr-body [#455](https://github.com/intuit/auto/pull/455) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.7 (Thu May 30 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Changelog bugs [#452](https://github.com/intuit/auto/pull/452) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.6 (Thu May 30 2019)

#### 🐛 Bug Fix

- `@auto-it/core`, `@auto-it/jira`, `@auto-it/npm`, `@auto-it/omit-release-notes`
  - Lerna independent mode bugs [#451](https://github.com/intuit/auto/pull/451) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.5 (Thu May 30 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Respect author in config [#450](https://github.com/intuit/auto/pull/450) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Get docs publishing [#448](https://github.com/intuit/auto/pull/448) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Update typescript-tslint-plugin to the latest version 🚀 [#447](https://github.com/intuit/auto/pull/447) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v7.0.4 (Mon May 20 2019)

#### 🐛 Bug Fix

- `@auto-it/npm`
  - stop using --canary flag in npm package [#446](https://github.com/intuit/auto/pull/446) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Update README.md [#445](https://github.com/intuit/auto/pull/445) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.3 (Mon May 20 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fall back to normal require for npx and global usage [#444](https://github.com/intuit/auto/pull/444) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.2 (Sun May 19 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - Remove bin entry from core [#441](https://github.com/intuit/auto/pull/441) ([@zephraph](https://github.com/zephraph))

#### 📝 Documentation

- Fix conventional commits link [#439](https://github.com/intuit/auto/pull/439) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.0.1 (Sat May 18 2019)

#### 🐛 Bug Fix

- `@auto-it/core`
  - fix changelog indentation [#438](https://github.com/intuit/auto/pull/438) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- `auto`
  - fix bundle step, must gzip correct folder [#437](https://github.com/intuit/auto/pull/437) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.0 (Fri May 17 2019)

### Release Notes

    _From #420_

    old `afterRelease`

```js
auto.hooks.afterRelease.tap(
  "MyPlugin",
  async (version, commits, releaseNotes) => {
    // do something
  }
);
```

new `afterRelease`

```js
auto.hooks.afterRelease.tap( 'MyPlugin', async ({ version, commits, releaseNotes, response }) => {
// do something
);
```

_From #408_

    Previously a user would have the following configuration in their `.autorc`:

```json
{
  "jira": "https://url-to-jira"
}
```

this should be changed to:

```json
{
  "plugins": [
    ["jira", { "url": "https://url-to-jira" }],
    // or
    ["jira", "https://url-to-jira"]
  ]
}
```

## Plugin Authors

If you are a plugin author that uses the `renderChangelogLine` hook you must change your usage.

Before it was a bail hook. meaning on 1 plugin could effect the changelog message. The first to return would be the message.

```ts
auto.hooks.onCreateChangelog.tapPromise('Stars', changelog =>
changelog.hooks.renderChangelogLine.tapPromise(
'Stars',
async (commits, renderLine) =>
  commits.map(commit => `${renderLine(commit).replace('-', ':star:')}
`)
);
);
```

Now it is a waterfall hook. Each plugin has the chance to change the commit message in some way, but it must return the args for the next plugin in the waterfall.

```ts
auto.hooks.onCreateChangelog.tapPromise('Stars', changelog =>
changelog.hooks.renderChangelogLine.tapPromise(
'Stars',
async (commit, line) =>
  [commit, `${line.replace('-', ':star:')}
`]
);
);
```

_From #407_

    Previously a user would have the following configuration in their `.autorc`:

```json
{
  "slack": "https://url-to-slack"
}
```

this should be changed to:

```json
{
  "plugins": [
    ["slack", { "url": "https://url-to-your-slack-hook.com" }],
    // or
    ["slack", "https://url-to-your-slack-hook.com"]
  ]
}
```

---

#### 💥 Breaking Change

- Factor out filter accounts plugin [#409](https://github.com/intuit/auto/pull/409) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Move jira functionality to plugin [#408](https://github.com/intuit/auto/pull/408) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Move slack functionality to a plugin [#407](https://github.com/intuit/auto/pull/407) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/jira`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - V7 Release [#406](https://github.com/intuit/auto/pull/406) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`
  - switch auto.args to auto.options on core [#432](https://github.com/intuit/auto/pull/432) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/jira`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Use @auto-it scope [#428](https://github.com/intuit/auto/pull/428) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/omit-commits`
  - Change filter-accounts plugin to omit-commits plugin [#425](https://github.com/intuit/auto/pull/425) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/released`, `@auto-it/slack`
  - afterRelease returns an object so future updates will be easier [#420](https://github.com/intuit/auto/pull/420) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`
  - Rename `auto pr` to `auto pr-status` [#413](https://github.com/intuit/auto/pull/413) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/jira`, `@auto-it/npm`, `@auto-it/released`, `@auto-it/slack`
  - Restructure to Monorepo [#410](https://github.com/intuit/auto/pull/410) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🚀 Enhancement

- `@auto-it/core`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`
  - new hook: omit prs from release notes + add omit-release-notes plugin [#427](https://github.com/intuit/auto/pull/427) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Add Twitter Plugin [#422](https://github.com/intuit/auto/pull/422) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/upload-assets`
  - add upload assets plugin [#421](https://github.com/intuit/auto/pull/421) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`
  - Bundle `auto` for all major platforms [#418](https://github.com/intuit/auto/pull/418) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- add docs about omitReleaseNotes ([@hipstersmoothie](https://github.com/hipstersmoothie))
- run the correct command ([@hipstersmoothie](https://github.com/hipstersmoothie))
- start ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`
  - fix bundling plugin issue [#435](https://github.com/intuit/auto/pull/435) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/npm`
  - Various Bug Fixes [#434](https://github.com/intuit/auto/pull/434) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/upload-assets`
  - rename ghub to github ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/omit-commits`
  - fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - fix problem where pr-body would only match after two were rendered [#431](https://github.com/intuit/auto/pull/431) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/npm`
  - Parse monorepo packages outside of `packages` directory [#411](https://github.com/intuit/auto/pull/411) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update docs/pages/plugins.md

Co-Authored-By: Justin Bennett <zephraph@gmail.com> ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- Add monorepo plugin create command [#430](https://github.com/intuit/auto/pull/430) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/released`
  - Split args type between core and cli [#416](https://github.com/intuit/auto/pull/416) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Update @types/node-fetch to the latest version 🚀 [#426](https://github.com/intuit/auto/pull/426) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update node-fetch to the latest version 🚀 [#423](https://github.com/intuit/auto/pull/423) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update cosmiconfig to the latest version 🚀 [#417](https://github.com/intuit/auto/pull/417) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v6.5.1 (Mon May 13 2019)

#### 📝 Documentation

- typo [#405](https://github.com/intuit/auto/pull/405) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v6.5.0 (Fri May 10 2019)

#### 🚀 Enhancement

- Add --delete to `comment` and `pr-body` [#403](https://github.com/intuit/auto/pull/403) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.4.1 (Fri May 10 2019)

#### 🐛 Bug Fix

- fix jira PR titles without additional subject [#404](https://github.com/intuit/auto/pull/404) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- update docs for canary [#402](https://github.com/intuit/auto/pull/402) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.4.0 (Thu May 09 2019)

#### 🚀 Enhancement

- update canary to update pr body when there is a pr [#401](https://github.com/intuit/auto/pull/401) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Greenkeeper/@octokit/plugin throttling 2.5.0 [#400](https://github.com/intuit/auto/pull/400) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v6.3.5 (Thu May 09 2019)

#### 🐛 Bug Fix

- lerna no-force-publish release conflict [#399](https://github.com/intuit/auto/pull/399) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.3.4 (Thu May 09 2019)

#### 🐛 Bug Fix

- conventional-commit plugin: should omit PR merge commits when a commit in the PR has CC commit message [#395](https://github.com/intuit/auto/pull/395) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📚 Blog Post

- conventional-commits plugin blog post [#394](https://github.com/intuit/auto/pull/394) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.3.3 (Thu May 09 2019)

#### 📝 Documentation

- Fix grammar in getting started documentation [#396](https://github.com/intuit/auto/pull/396) ([@djpowers](https://github.com/djpowers))

#### Authors: 1

- Dave Powers ([@djpowers](https://github.com/djpowers))

---

# v6.3.1 (Wed May 08 2019)

#### 🐛 Bug Fix

- ensure major minor and patch get to changelog in that order [#392](https://github.com/intuit/auto/pull/392) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add page for conventional-commits plugin [#393](https://github.com/intuit/auto/pull/393) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.3.0 (Wed May 08 2019)

#### 🚀 Enhancement

- Release notes [#380](https://github.com/intuit/auto/pull/380) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.2.6 (Wed May 08 2019)

#### ⚠️ Pushed to master

- add better logs when setting git user ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))

#### Authors: 1

- [@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com)

---

# v6.2.5 (Wed May 08 2019)

#### 📝 Documentation

- Fix typo in introduction documentation [#391](https://github.com/intuit/auto/pull/391) ([@djpowers](https://github.com/djpowers))

#### Authors: 1

- Dave Powers ([@djpowers](https://github.com/djpowers))

---

# v6.2.4 (Wed May 08 2019)

#### 🐛 Bug Fix

- remove getGitHubToken function [#386](https://github.com/intuit/auto/pull/386) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.2.3 (Wed May 08 2019)

#### 🐛 Bug Fix

- use correct variable in pr-body success message [#389](https://github.com/intuit/auto/pull/389) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.2.2 (Tue May 07 2019)

#### 🐛 Bug Fix

- must await posting to the PR body [#388](https://github.com/intuit/auto/pull/388) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.2.1 (Tue May 07 2019)

#### 🐛 Bug Fix

- split off useless hash from version [#387](https://github.com/intuit/auto/pull/387) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- update deps for things greenkeeper failed on [#385](https://github.com/intuit/auto/pull/385) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.2.0 (Tue May 07 2019)

#### 🚀 Enhancement

- Error on uncommited files when before running canary + version [#384](https://github.com/intuit/auto/pull/384) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.1.1 (Tue May 07 2019)

#### 🐛 Bug Fix

- Correct reported lerna independent version [#383](https://github.com/intuit/auto/pull/383) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.1.0 (Tue May 07 2019)

#### 🚀 Enhancement

- add `auto pr-body` to add info to pr bodies + canary posts to body instead of comment [#379](https://github.com/intuit/auto/pull/379) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.0.2 (Mon May 06 2019)

#### 🐛 Bug Fix

- report back correct versions when running canary [#378](https://github.com/intuit/auto/pull/378) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.0.1 (Mon May 06 2019)

#### 🐛 Bug Fix

- Better get by username/email error handling [#377](https://github.com/intuit/auto/pull/377) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.0.0 (Mon May 06 2019)

#### 💥 Breaking Change

- Restrict config type [#374](https://github.com/intuit/auto/pull/374) ([@zephraph](https://github.com/zephraph))

#### 🚀 Enhancement

- Support Lerna Independent mode [#373](https://github.com/intuit/auto/pull/373) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📚 Blog Post

- New Post: Merging PRs to other PRs [#372](https://github.com/intuit/auto/pull/372) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Justin Bennett ([@zephraph](https://github.com/zephraph))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v5.0.1 (Sat May 04 2019)

#### 🐛 Bug Fix

- shipit will publish a canary locally when not on master [#371](https://github.com/intuit/auto/pull/371) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v5.0.0 (Sat May 04 2019)

#### 💥 Breaking Change

- Calling `shipit` in PR in CI creates canary release [#351](https://github.com/intuit/auto/pull/351) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Configure base-branch + pushToMaster => pushToBaseBranch [#357](https://github.com/intuit/auto/pull/357) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- skip releases for greenkeeper + make special changelog section [#366](https://github.com/intuit/auto/pull/366) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add blog [#368](https://github.com/intuit/auto/pull/368) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.15.5 (Fri May 03 2019)

#### 🐛 Bug Fix

- fix bug when tying to publish canary for PR with skip-release label [#367](https://github.com/intuit/auto/pull/367) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.15.4 (Fri May 03 2019)

#### 🏠 Internal

- remove accidental log [#365](https://github.com/intuit/auto/pull/365) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update @types/node to the latest version 🚀 [#364](https://github.com/intuit/auto/pull/364) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.15.3 (Fri May 03 2019)

#### 🐛 Bug Fix

- Override any env var set in the .env [#362](https://github.com/intuit/auto/pull/362) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.15.2 (Fri May 03 2019)

#### 🐛 Bug Fix

- make logLevel available on the logger [#363](https://github.com/intuit/auto/pull/363) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.15.1 (Fri May 03 2019)

#### 📝 Documentation

- update docs [#361](https://github.com/intuit/auto/pull/361) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.15.0 (Fri May 03 2019)

#### 🚀 Enhancement

- when canary is run locally it uses the commits SHA instead of PR + Build [#360](https://github.com/intuit/auto/pull/360) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.14.1 (Fri May 03 2019)

#### 🐛 Bug Fix

- changelog includes any commit that has a PR parsed from the commit message [#359](https://github.com/intuit/auto/pull/359) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.14.0 (Thu May 02 2019)

#### 🚀 Enhancement

- enable loglevel silly for npm/lerna when in verbose or veryVerbose mode [#356](https://github.com/intuit/auto/pull/356) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.13.2 (Thu May 02 2019)

#### 🐛 Bug Fix

- increase buffer for situations when user has a LOT of unpublished work [#354](https://github.com/intuit/auto/pull/354) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.13.1 (Thu May 02 2019)

---

# v4.13.0 (Thu May 02 2019)

#### 🚀 Enhancement

- add forcePublish config option to npm plugin [#352](https://github.com/intuit/auto/pull/352) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.12.0 (Wed May 01 2019)

#### 🚀 Enhancement

- canary command [#349](https://github.com/intuit/auto/pull/349) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.11.0 (Wed May 01 2019)

#### 🚀 Enhancement

- Graphql url config [#350](https://github.com/intuit/auto/pull/350) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- Update node-fetch to the latest version 🚀 [#347](https://github.com/intuit/auto/pull/347) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.10.0 (Wed May 01 2019)

#### 🚀 Enhancement

- comment, pr, and pr-check detect PR number in CI [#348](https://github.com/intuit/auto/pull/348) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.9.4 (Sat Apr 27 2019)

#### 🐛 Bug Fix

- Throw an error if extended config fails to load [#344](https://github.com/intuit/auto/pull/344) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v4.9.3 (Sat Apr 27 2019)

#### 🐛 Bug Fix

- fix bug when no labels exist [#343](https://github.com/intuit/auto/pull/343) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- Update import-cwd to the latest version 🚀 [#342](https://github.com/intuit/auto/pull/342) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.9.2 (Sat Apr 27 2019)

#### 🐛 Bug Fix

- use graphql to get around search rate limits [#340](https://github.com/intuit/auto/pull/340) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- Update node-fetch to the latest version 🚀 [#339](https://github.com/intuit/auto/pull/339) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update @types/node-fetch to the latest version 🚀 [#336](https://github.com/intuit/auto/pull/336) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.9.1 (Fri Apr 26 2019)

#### 🐛 Bug Fix

- Adjust rate limiting retries from 3 to 5 [#338](https://github.com/intuit/auto/pull/338) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v4.9.0 (Thu Apr 25 2019)

#### 🚀 Enhancement

- Add throttling, retry octokit plugins [#335](https://github.com/intuit/auto/pull/335) ([@zephraph](https://github.com/zephraph))

#### 🏠 Internal

- Update @hutson/set-npm-auth-token-for-ci to the latest version 🚀 [#330](https://github.com/intuit/auto/pull/330) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update husky to the latest version 🚀 [#333](https://github.com/intuit/auto/pull/333) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Justin Bennett ([@zephraph](https://github.com/zephraph))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.8.17 (Mon Apr 15 2019)

#### 🐛 Bug Fix

- use old addLabels praram because of bug in new one [#329](https://github.com/intuit/auto/pull/329) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.8.15 (Mon Apr 15 2019)

#### 🐛 Bug Fix

- update command line args [#328](https://github.com/intuit/auto/pull/328) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Octokit [#325](https://github.com/intuit/auto/pull/325) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- update node types [#326](https://github.com/intuit/auto/pull/326) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update ts-jest [#327](https://github.com/intuit/auto/pull/327) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update @types/node-fetch to the latest version 🚀 [#324](https://github.com/intuit/auto/pull/324) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.8.14 (Fri Apr 05 2019)

#### 🏠 Internal

- Update registry-url to the latest version 🚀 [#323](https://github.com/intuit/auto/pull/323) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update @types/semver to the latest version 🚀 [#321](https://github.com/intuit/auto/pull/321) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update @types/node to the latest version 🚀 [#320](https://github.com/intuit/auto/pull/320) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update semver to the latest version 🚀 [#315](https://github.com/intuit/auto/pull/315) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update @types/node to the latest version 🚀 [#314](https://github.com/intuit/auto/pull/314) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update cosmiconfig to the latest version 🚀 [#313](https://github.com/intuit/auto/pull/313) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update @types/node-fetch to the latest version 🚀 [#309](https://github.com/intuit/auto/pull/309) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update tslint-xo to the latest version 🚀 [#312](https://github.com/intuit/auto/pull/312) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### 📝 Documentation

- Fix issue with warning wrapping section [#322](https://github.com/intuit/auto/pull/322) ([@zephraph](https://github.com/zephraph))

#### Authors: 2

- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v4.8.13 (Wed Mar 20 2019)

#### 🐛 Bug Fix

- only add users once to changelog [#311](https://github.com/intuit/auto/pull/311) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.8.12 (Wed Mar 20 2019)

#### 🐛 Bug Fix

- last ditch search for related PRs [#310](https://github.com/intuit/auto/pull/310) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- fix typo in docs [#307](https://github.com/intuit/auto/pull/307) ([@solon](https://github.com/solon))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Brian Solon ([@solon](https://github.com/solon))

---

# v4.8.11 (Thu Mar 14 2019)

#### 🐛 Bug Fix

- Remove auth in error responses if it's present [#297](https://github.com/intuit/auto/pull/297) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v4.8.10 (Wed Mar 13 2019)

#### 🏠 Internal

- update deps [#306](https://github.com/intuit/auto/pull/306) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update @types/node to the latest version 🚀 [#303](https://github.com/intuit/auto/pull/303) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### 📝 Documentation

- fixing a typo [#302](https://github.com/intuit/auto/pull/302) ([@GGonryun](https://github.com/GGonryun))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])
- Miguel Campos ([@GGonryun](https://github.com/GGonryun))

---

# v4.8.9 (Mon Mar 04 2019)

#### 🏠 Internal

- update deps [#300](https://github.com/intuit/auto/pull/300) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update tslint-xo to the latest version 🚀 [#298](https://github.com/intuit/auto/pull/298) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update ts-jest to the latest version 🚀 [#295](https://github.com/intuit/auto/pull/295) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update cosmiconfig to the latest version 🚀 [#294](https://github.com/intuit/auto/pull/294) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.8.8 (Fri Feb 15 2019)

#### 🐛 Bug Fix

- Fix the formatting for slack messages [#292](https://github.com/intuit/auto/pull/292) ([@adierkens](https://github.com/adierkens))

#### Authors: 1

- Adam Dierkens ([@adierkens](https://github.com/adierkens))

---

# v4.8.7 (Fri Feb 15 2019)

#### 🐛 Bug Fix

- Fix Promise issue when creating changelog [#293](https://github.com/intuit/auto/pull/293) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.8.6 (Wed Feb 13 2019)

#### 🐛 Bug Fix

- check if released label has already been added [#290](https://github.com/intuit/auto/pull/290) (hipstersmoothie@users.noreply.github.com)

#### Authors: 1

- hipstersmoothie@users.noreply.github.com

---

# v4.8.5 (Wed Feb 13 2019)

#### 🐛 Bug Fix

- released plugin respects dry run flag [#289](https://github.com/intuit/auto/pull/289) (hipstersmoothie@users.noreply.github.com)

#### Authors: 1

- hipstersmoothie@users.noreply.github.com

---

# v4.8.4 (Wed Feb 13 2019)

#### 🐛 Bug Fix

- ShipIt - Get Slack URL from config [#288](https://github.com/intuit/auto/pull/288) (hipstersmoothie@users.noreply.github.com)

#### 🏠 Internal

- Update @types/node to the latest version 🚀 [#287](https://github.com/intuit/auto/pull/287) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Update @types/node-fetch to the latest version 🚀 [#286](https://github.com/intuit/auto/pull/286) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Add license scan report and status [#283](https://github.com/intuit/auto/pull/283) ([@fossabot](https://github.com/fossabot))

#### Authors: 4

- hipstersmoothie@users.noreply.github.com
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fossabot ([@fossabot](https://github.com/fossabot))

---

# v4.8.3 (Wed Feb 06 2019)

#### 🏠 Internal

- Update all-contributors-cli to the latest version 🚀 [#284](https://github.com/intuit/auto/pull/284) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 1

- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.8.2 (Wed Feb 06 2019)

#### 🐛 Bug Fix

- Update @types/jest to the latest version 🚀 [#282](https://github.com/intuit/auto/pull/282) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 1

- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.8.1 (Thu Jan 31 2019)

#### 🐛 Bug Fix

- ensure that setRcToken is respected [#279](https://github.com/intuit/auto/pull/279) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.8.0 (Thu Jan 31 2019)

#### 🚀 Enhancement

- NPM Plugin: Allow user to turn off setting RC token [#278](https://github.com/intuit/auto/pull/278) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.5 (Wed Jan 30 2019)

#### 🐛 Bug Fix

- run git status in verbose mode for lerna [#277](https://github.com/intuit/auto/pull/277) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.4 (Wed Jan 30 2019)

#### 🐛 Bug Fix

- add more logging for lerna debugging [#276](https://github.com/intuit/auto/pull/276) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.3 (Tue Jan 29 2019)

#### 🐛 Bug Fix

- don't run commmit hooks. match npm version bahvior [#275](https://github.com/intuit/auto/pull/275) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.2 (Mon Jan 28 2019)

#### 🐛 Bug Fix

- can't warn here or else `version` will fail [#274](https://github.com/intuit/auto/pull/274) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.1 (Sat Jan 26 2019)

#### 🐛 Bug Fix

- Update dependencies to enable Greenkeeper 🌴 [#273](https://github.com/intuit/auto/pull/273) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.0 (Fri Jan 25 2019)

#### 🚀 Enhancement

- `create-labels` update labels when the exist [#272](https://github.com/intuit/auto/pull/272) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.6.0 (Fri Jan 25 2019)

#### 🚀 Enhancement

- modifyConfig hook [#270](https://github.com/intuit/auto/pull/270) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.5.3 (Fri Jan 25 2019)

#### 🐛 Bug Fix

- Custom labels still resolve changelog titles [#269](https://github.com/intuit/auto/pull/269) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.5.2 (Fri Jan 25 2019)

#### 🐛 Bug Fix

- pushes to master should only include title in changelog [#267](https://github.com/intuit/auto/pull/267) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.5.1 (Fri Jan 25 2019)

#### 🐛 Bug Fix

- add addLabel enterprise compat [#265](https://github.com/intuit/auto/pull/265) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.5.0 (Fri Jan 25 2019)

#### 🚀 Enhancement

- afterRelease hook [#264](https://github.com/intuit/auto/pull/264) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.4.4 (Fri Jan 25 2019)

#### 🏠 Internal

- remove .only [#261](https://github.com/intuit/auto/pull/261) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.4.3 (Fri Jan 25 2019)

#### 🐛 Bug Fix

- load extends config from path [#260](https://github.com/intuit/auto/pull/260) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.4.2 (Fri Jan 25 2019)

#### 🐛 Bug Fix

- release plugin: do nothing when skip-release present [#259](https://github.com/intuit/auto/pull/259) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.4.1 (Thu Jan 24 2019)

#### 🐛 Bug Fix

- Better config debug [#257](https://github.com/intuit/auto/pull/257) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Add clarity to a few of the docs [#255](https://github.com/intuit/auto/pull/255) ([@zephraph](https://github.com/zephraph))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v4.4.0 (Thu Jan 24 2019)

#### 🚀 Enhancement

- Released plugin: add released label to issue too [#253](https://github.com/intuit/auto/pull/253) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.3.0 (Thu Jan 24 2019)

#### 🚀 Enhancement

- Released Plugin: lock merged issues [#252](https://github.com/intuit/auto/pull/252) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.2.2 (Thu Jan 24 2019)

#### 🐛 Bug Fix

- Released Plugin: add context to comments so they don't override other comments [#251](https://github.com/intuit/auto/pull/251) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.2.1 (Thu Jan 24 2019)

#### ⚠️ Pushed to master

- quick rename ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))

#### Authors: 1

- [@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com)

---

# v4.2.0 (Thu Jan 24 2019)

#### 🚀 Enhancement

- released plugin [#250](https://github.com/intuit/auto/pull/250) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.1.0 (Thu Jan 24 2019)

#### 🚀 Enhancement

- afterShipit hook [#249](https://github.com/intuit/auto/pull/249) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.0.0 (Thu Jan 24 2019)

#### 💥 Breaking Change

- Split up `publish` hook into `version` and `publish` [#247](https://github.com/intuit/auto/pull/247) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Label Refactor: custom colors, descriptions, arbitrary labels, deprecate changelogTitles [#246](https://github.com/intuit/auto/pull/246) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🚀 Enhancement

- add afterVersion and afterPublish hooks [#248](https://github.com/intuit/auto/pull/248) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v3.1.2 (Wed Jan 23 2019)

#### 🐛 Bug Fix

- Pin parse-commit-message to v4.0.0 [#245](https://github.com/intuit/auto/pull/245) ([@zephraph](https://github.com/zephraph))

#### 🏠 Internal

- update contributor count [#243](https://github.com/intuit/auto/pull/243) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Fix docs publishing [#242](https://github.com/intuit/auto/pull/242) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- test publishing docs [#241](https://github.com/intuit/auto/pull/241) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Justin Bennett ([@zephraph](https://github.com/zephraph))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v3.1.1 (Tue Jan 22 2019)

#### ⚠️ Pushed to master

- fix docs publishing ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))

#### Authors: 1

- [@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com)

---

# v3.1.0 (Tue Jan 22 2019)

#### 🚀 Enhancement

- Conventional Commit Plugin [#238](https://github.com/intuit/auto/pull/238) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v3.0.2 (Tue Jan 22 2019)

#### 🐛 Bug Fix

- Fix `Push to Master` Changelog entries newline [#240](https://github.com/intuit/auto/pull/240) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v3.0.1 (Tue Jan 22 2019)

#### 🏠 Internal

- Updates Octokit Usage [#239](https://github.com/intuit/auto/pull/239) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v3.0.0 (Tue Jan 22 2019)

#### 💥 Breaking Change

- Rename package from `auto-release-cli` to `auto` [#237](https://github.com/intuit/auto/pull/237) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Rename onCreateGitHubRelease to onCreateRelease [#235](https://github.com/intuit/auto/pull/235) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Rename onCreateLogParse to onCreateChangelog [#228](https://github.com/intuit/auto/pull/228) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🚀 Enhancement

- Tappable parse log [#229](https://github.com/intuit/auto/pull/229) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- Update deps and move git class [#236](https://github.com/intuit/auto/pull/236) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add some comments to the code [#234](https://github.com/intuit/auto/pull/234) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.10.4 (Sun Jan 20 2019)

#### 🐛 Bug Fix

- test switching registry back [#233](https://github.com/intuit/auto-release/pull/233) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.10.3 (Sun Jan 20 2019)

#### 🐛 Bug Fix

- remove debug logs [#232](https://github.com/intuit/auto-release/pull/232) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.10.2 (Sun Jan 20 2019)

#### ⚠️ Pushed to master

- :pray:
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))
- increase debugging further
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))
- run debug another way
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))
- run debug
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))
- this seems flaky?
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))
- catch the errors
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))
- more logging
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))
- hope and pray
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))

#### Authors: 1

- [@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com)

---

# v2.10.1 (Sun Jan 20 2019)

#### ⚠️ Pushed to master

- test out manually setting root
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))

#### Authors: 1

- [@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com)

---

# v2.10.0 (Sun Jan 20 2019)

#### 🚀 Enhancement

- NPM Plugin: Inject NPM_TOKEN into `.npmrc` during `shipit` [#223](https://github.com/intuit/auto-release/pull/223) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- use "inlineSourceMap" [#231](https://github.com/intuit/auto-release/pull/231) ([@aleclarson](https://github.com/aleclarson))

#### ⚠️ Pushed to master

- another test
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))
- test local rc
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))
- test code
  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Alec Larson ([@aleclarson](https://github.com/aleclarson))
- [@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com)

---

# v2.9.0 (Sun Jan 20 2019)

#### 🚀 Enhancement

- Shared Configuration [#215](https://github.com/intuit/auto-release/pull/215) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.8.0 (Sat Jan 19 2019)

#### 🚀 Enhancement

- load env vars from .env file [#227](https://github.com/intuit/auto-release/pull/227) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.7.0 (Sat Jan 19 2019)

#### 🚀 Enhancement

- Add dry-run flag for the rest of the commands [#226](https://github.com/intuit/auto-release/pull/226) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.6.2 (Sat Jan 19 2019)

#### 🐛 Bug Fix

- add label description for `release` label back [#225](https://github.com/intuit/auto-release/pull/225) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.6.1 (Sat Jan 19 2019)

#### 🐛 Bug Fix

- improve default label descriptions [#219](https://github.com/intuit/auto-release/pull/219) ([@aleclarson](https://github.com/aleclarson))

#### Authors: 1

- Alec Larson ([@aleclarson](https://github.com/aleclarson))

---

# v2.6.0 (Sat Jan 19 2019)

#### 🚀 Enhancement

- Pushes to master create changelog entry [#204](https://github.com/intuit/auto-release/pull/204) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@zephraph](https://github.com/zephraph))

#### 🏠 Internal

- fix test [#214](https://github.com/intuit/auto-release/pull/214) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v2.5.8 (Fri Jan 18 2019)

#### 📝 Documentation

- Proper Error Catching [#213](https://github.com/intuit/auto-release/pull/213) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.5.7 (Fri Jan 18 2019)

#### 🐛 Bug Fix

- When there are no releases use first commit date for rebased PRs [#212](https://github.com/intuit/auto-release/pull/212) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.5.6 (Fri Jan 18 2019)

#### 🐛 Bug Fix

- fix rebased PRs [#209](https://github.com/intuit/auto-release/pull/209) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.5.5 (Thu Jan 17 2019)

#### 🐛 Bug Fix

- NPM Plugin: increment published version if available [#208](https://github.com/intuit/auto-release/pull/208) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.5.4 (Thu Jan 17 2019)

#### 🐛 Bug Fix

- NPM Plugin: to publish a scoped package `--access public` is needed [#207](https://github.com/intuit/auto-release/pull/207) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.5.3 (Thu Jan 17 2019)

#### 🐛 Bug Fix

- NPM Plugin: if there is no published version default to package.json version [#205](https://github.com/intuit/auto-release/pull/205) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- release documentation only when files in `docs/` have changed [#200](https://github.com/intuit/auto-release/pull/200) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.5.2 (Thu Jan 17 2019)

#### 🐛 Bug Fix

- correct help message for owner [#199](https://github.com/intuit/auto-release/pull/199) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.5.1 (Wed Jan 16 2019)

#### 🐛 Bug Fix

- `auto label`: must sort PRs first because they can get merged out of order [#197](https://github.com/intuit/auto-release/pull/197) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.5.0 (Wed Jan 16 2019)

#### 🚀 Enhancement

- Plugin Config [#192](https://github.com/intuit/auto-release/pull/192) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.4.2 (Wed Jan 16 2019)

#### 🐛 Bug Fix

- Fix github repo lookup [#193](https://github.com/intuit/auto-release/pull/193) ([@adierkens](https://github.com/adierkens))

#### Authors: 1

- Adam Dierkens ([@adierkens](https://github.com/adierkens))

---

# v2.4.1 (Tue Jan 15 2019)

#### 🐛 Bug Fix

- add shipit to docs [#190](https://github.com/intuit/auto-release/pull/190) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.4.0 (Tue Jan 15 2019)

#### 🚀 Enhancement

- Chrome Web Store Plugin [#182](https://github.com/intuit/auto-release/pull/182) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.3.2 (Tue Jan 15 2019)

#### 🐛 Bug Fix

- Pad color to be 6 digits long [#189](https://github.com/intuit/auto-release/pull/189) ([@adierkens](https://github.com/adierkens))

#### Authors: 1

- Adam Dierkens ([@adierkens](https://github.com/adierkens))

---

# v2.3.1 (Sun Jan 13 2019)

#### 🐛 Bug Fix

- also log stdout on errors [#185](https://github.com/intuit/auto-release/pull/185) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.3.0 (Fri Jan 11 2019)

#### 🚀 Enhancement

- Tappable Changelog [#178](https://github.com/intuit/auto-release/pull/178) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- Switch to circleCI 2.1 [#181](https://github.com/intuit/auto-release/pull/181) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add docs deploy note [#179](https://github.com/intuit/auto-release/pull/179) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.2.0 (Wed Jan 09 2019)

#### 🚀 Enhancement

- NPM Plugin: getPreviousVersion compare against published version [#173](https://github.com/intuit/auto-release/pull/173) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.1.4 (Wed Jan 09 2019)

#### 🐛 Bug Fix

- String arg parse fail on null [#174](https://github.com/intuit/auto-release/pull/174) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.1.3 (Tue Jan 08 2019)

#### 🐛 Bug Fix

- When errors are caught fail the process [#171](https://github.com/intuit/auto-release/pull/171) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- update contributors badge [#168](https://github.com/intuit/auto-release/pull/168) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.1.2 (Tue Jan 08 2019)

#### 🐛 Bug Fix

- Fix generating the changelog with custom labels [#167](https://github.com/intuit/auto-release/pull/167) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.1.1 (Mon Jan 07 2019)

#### 🐛 Bug Fix

- Config takes precedence for author and repo [#166](https://github.com/intuit/auto-release/pull/166) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.1.0 (Mon Jan 07 2019)

#### 🚀 Enhancement

- Parse string authors [#165](https://github.com/intuit/auto-release/pull/165) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.0.4 (Mon Jan 07 2019)

#### 🐛 Bug Fix

- Improve setGitUser messaging [#163](https://github.com/intuit/auto-release/pull/163) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.0.3 (Mon Jan 07 2019)

#### 🐛 Bug Fix

- Only warn about git user when it isn't set [#160](https://github.com/intuit/auto-release/pull/160) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.0.2 (Mon Jan 07 2019)

#### 🐛 Bug Fix

- Await all hook promises [#162](https://github.com/intuit/auto-release/pull/162) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.0.1 (Mon Jan 07 2019)

#### 🐛 Bug Fix

- Ensure commit messages are strings [#158](https://github.com/intuit/auto-release/pull/158) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Maintain context when spawning git process [#157](https://github.com/intuit/auto-release/pull/157) ([@zephraph](https://github.com/zephraph))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v2.0.0 (Mon Jan 07 2019)

#### 💥 Breaking Change

- Flags all snake-case and autorc options all camelCase [#138](https://github.com/intuit/auto-release/pull/138) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Tappable Auto - Plugin System [#131](https://github.com/intuit/auto-release/pull/131) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🚀 Enhancement

- Only set git user in CI env [#151](https://github.com/intuit/auto-release/pull/151) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Plugins Options: load official, npm package, or path [#144](https://github.com/intuit/auto-release/pull/144) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- A few missed "await exec" refactors [#154](https://github.com/intuit/auto-release/pull/154) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Raise an error, and fail execution when a sub-command fails [#146](https://github.com/intuit/auto-release/pull/146) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@orta](https://github.com/orta))
- Ensure semVerLabels stays a map as expected [#148](https://github.com/intuit/auto-release/pull/148) ([@zephraph](https://github.com/zephraph))
- convert subcommand flags camelcase too [#152](https://github.com/intuit/auto-release/pull/152) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Increase number of commits to scan for [#150](https://github.com/intuit/auto-release/pull/150) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Get test Coverage back above 80% [#145](https://github.com/intuit/auto-release/pull/145) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Actually load plugins [#149](https://github.com/intuit/auto-release/pull/149) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Improve API Usage, Better Args Typing [#139](https://github.com/intuit/auto-release/pull/139) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Orta ([@orta](https://github.com/orta))
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# 1.0.0 (Sat Jan 05 2019)

#### 💥 Breaking Change

- Release v1.0.0 [#137](https://github.com/intuit/auto-release/pull/137) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- Update PULL_REQUEST_TEMPLATE.md [#133](https://github.com/intuit/auto-release/pull/133) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Add Prior Art section to Readme [#136](https://github.com/intuit/auto-release/pull/136) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Add artsy/reaction to the list of projects using auto [#134](https://github.com/intuit/auto-release/pull/134) ([@adierkens](https://github.com/adierkens))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Adam Dierkens ([@adierkens](https://github.com/adierkens))

---

# 0.37.9 (Thu Jan 03 2019)

#### 🐛 Bug Fix

- Changes the verbose logging so that it doesn't leak tokens [#130](https://github.com/intuit/auto-release/pull/130) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.37.8 (Thu Jan 03 2019)

#### 🐛 Bug Fix

- Fix custom labels not respected by the semver checker [#128](https://github.com/intuit/auto-release/pull/128) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.37.7 (Thu Jan 03 2019)

#### 🐛 Bug Fix

- print only email when name is not present [#126](https://github.com/intuit/auto-release/pull/126) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.37.6 (Thu Jan 03 2019)

#### 🐛 Bug Fix

- only set git user if one isn't already set [#125](https://github.com/intuit/auto-release/pull/125) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.37.5 (Thu Jan 03 2019)

#### 🐛 Bug Fix

- Move @types into devDependencies [#123](https://github.com/intuit/auto-release/pull/123) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@orta](https://github.com/orta))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Orta ([@orta](https://github.com/orta))

---

# 0.37.4 (Thu Jan 03 2019)

#### 🐛 Bug Fix

- Include a log when creating a new labels about what those labels are [#121](https://github.com/intuit/auto-release/pull/121) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@orta](https://github.com/orta))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Orta ([@orta](https://github.com/orta))

---

# 0.37.3 (Wed Jan 02 2019)

#### 🐛 Bug Fix

- Don't crash when there is no author hash in the package.json [#119](https://github.com/intuit/auto-release/pull/119) ([@orta](https://github.com/orta))

#### Authors: 1

- Orta ([@orta](https://github.com/orta))

---

# 0.37.2 (Wed Jan 02 2019)

#### 🐛 Bug Fix

- Convert 'Github' to 'GitHub' [#120](https://github.com/intuit/auto-release/pull/120) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- More Repo Usage [#118](https://github.com/intuit/auto-release/pull/118) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update ignite [#117](https://github.com/intuit/auto-release/pull/117) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add snyk badge [#116](https://github.com/intuit/auto-release/pull/116) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.37.1 (Mon Dec 31 2018)

#### 🐛 Bug Fix

- trim subjects for commit messages [#115](https://github.com/intuit/auto-release/pull/115) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.37.0 (Mon Dec 31 2018)

#### 🚀 Enhancement

-

add --version flag [#113](https://github.com/intuit/auto-release/pull/113) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

-

Add @Aghassi as a contributor [#112](https://github.com/intuit/auto-release/pull/112) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.36.6 (Mon Dec 31 2018)

#### 🐛 Bug Fix

-

update deps [#111](https://github.com/intuit/auto-release/pull/111) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.36.5 (Mon Dec 31 2018)

#### 🐛 Bug Fix

-

fix dry run [#109](https://github.com/intuit/auto-release/pull/109) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.36.4 (Mon Dec 31 2018)

#### 🐛 Bug Fix

-

fix version parsing [#110](https://github.com/intuit/auto-release/pull/110) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.36.3 (Mon Dec 24 2018)

---

# 0.36.2 (Tue Dec 18 2018)

---

# 0.36.1 (Tue Dec 18 2018)

#### 🐛 Bug Fix

- print link to token create when there is no GH_TOKEN. [#104](https://github.com/intuit/auto-release/pull/104) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.36.0 (Tue Dec 18 2018)

#### 🚀 Enhancement

- slack CLI flag can be the slack url [#103](https://github.com/intuit/auto-release/pull/103) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.35.0 (Mon Dec 17 2018)

#### 🚀 Enhancement

- Change `no-release` to `skip-release` [#101](https://github.com/intuit/auto-release/pull/101) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.34.0 (Mon Dec 17 2018)

#### 🚀 Enhancement

- Deprecate --major --minor --patch flags [#100](https://github.com/intuit/auto-release/pull/100) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.33.6 (Mon Dec 17 2018)

#### 🐛 Bug Fix

- url isn't required for pr or pr-check [#99](https://github.com/intuit/auto-release/pull/99) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.33.5 (Mon Dec 17 2018)

#### 🐛 Bug Fix

- pr-check wasn't getting semver labelTexts correctly [#98](https://github.com/intuit/auto-release/pull/98) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.33.4 (Mon Dec 17 2018)

#### 🐛 Bug Fix

- Change slack flag to boolean [#96](https://github.com/intuit/auto-release/pull/96) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.33.3 (Sun Dec 16 2018)

#### 🐛 Bug Fix

- only error if there are actually missing args [#95](https://github.com/intuit/auto-release/pull/95) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.33.1 (Sun Dec 16 2018)

#### 🐛 Bug Fix

- missed adding no release labels to `pr-check` [#89](https://github.com/intuit/auto-release/pull/89) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update deps [#85](https://github.com/intuit/auto-release/pull/85) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- fix version number [#92](https://github.com/intuit/auto-release/pull/92) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- only publish docs with documentation label [#86](https://github.com/intuit/auto-release/pull/86) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- fix docs publish [#88](https://github.com/intuit/auto-release/pull/88) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Clearer wording [#87](https://github.com/intuit/auto-release/pull/87) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.33.0 (Sun Dec 16 2018)

#### 🚀 Enhancement

- Default `label` to last merged PR [#83](https://github.com/intuit/auto-release/pull/83) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.32.2 (Sun Dec 16 2018)

#### 🐛 Bug Fix

- unneeded long desc on chengelog cli [#81](https://github.com/intuit/auto-release/pull/81) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- doc ordering [#80](https://github.com/intuit/auto-release/pull/80) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.32.1 (Sun Dec 16 2018)

#### 🐛 Bug Fix

- Formatted Changelogs [#79](https://github.com/intuit/auto-release/pull/79) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Document process for onboarding an already published repo [#78](https://github.com/intuit/auto-release/pull/78) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.32.0 (Sun Dec 16 2018)

#### 🚀 Enhancement

- Configure changelog labels with create-labels [#76](https://github.com/intuit/auto-release/pull/76) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.31.0 (Sun Dec 16 2018)

#### 🚀 Enhancement

- init flag to just get labels [#74](https://github.com/intuit/auto-release/pull/74) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.30.0 (Sun Dec 16 2018)

#### 🚀 Enhancement

- Init prompt for changelog labels [#71](https://github.com/intuit/auto-release/pull/71) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.29.0 (Sun Dec 16 2018)

#### 🚀 Enhancement

- print help or missing flag + print all missing flags [#69](https://github.com/intuit/auto-release/pull/69) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.28.0 (Sun Dec 16 2018)

#### 🚀 Enhancement

- rename init-labels -> create-labels [#68](https://github.com/intuit/auto-release/pull/68) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.27.0 (Sat Dec 15 2018)

#### 🚀 Enhancement

- Cli [#65](https://github.com/intuit/auto-release/pull/65) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Add docs for `skipReleaseLabels` [#57](https://github.com/intuit/auto-release/pull/57) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Badge [#56](https://github.com/intuit/auto-release/pull/56) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.26.2 (Fri Dec 14 2018)

#### 🐛 Bug Fix

- use config for version [#55](https://github.com/intuit/auto-release/pull/55) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.26.1 (Fri Dec 14 2018)

#### 📝 Documentation

- add shield icons [#54](https://github.com/intuit/auto-release/pull/54) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.26.0 (Fri Dec 14 2018)

#### 🚀 Enhancement

- Allow user to configure multiple labels to `no-release` [#53](https://github.com/intuit/auto-release/pull/53) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- typos in docs [#52](https://github.com/intuit/auto-release/pull/52) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.25.0 (Fri Dec 14 2018)

#### 🚀 Enhancement

- Add createLabels tool [#51](https://github.com/intuit/auto-release/pull/51) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Add CircleCI Troubleshooting [#49](https://github.com/intuit/auto-release/pull/49) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update README.md [#48](https://github.com/intuit/auto-release/pull/48) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- more troubleshooting docs [#47](https://github.com/intuit/auto-release/pull/47) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.24.0 (Thu Dec 13 2018)

#### 🚀 Enhancement

- repository as just a string [#46](https://github.com/intuit/auto-release/pull/46) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.23.1 (Tue Dec 11 2018)

#### 🐛 Bug Fix

- Fix Single new project [#45](https://github.com/intuit/auto-release/pull/45) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@adierkens](https://github.com/adierkens))

#### 🏠 Internal

- fix: removed vscode folder and updated gitignore [#44](https://github.com/intuit/auto-release/pull/44) ([@Aghassi](https://github.com/Aghassi))
- update ignite [#43](https://github.com/intuit/auto-release/pull/43) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Adam Dierkens ([@adierkens](https://github.com/adierkens))
- David ([@Aghassi](https://github.com/Aghassi))

---

# 0.23.0 (Fri Dec 07 2018)

#### 🚀 Enhancement

- add init script [#42](https://github.com/intuit/auto-release/pull/42) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- center badges [#40](https://github.com/intuit/auto-release/pull/40) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- switch to tiny badges [#39](https://github.com/intuit/auto-release/pull/39) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- add shipit to home page [#41](https://github.com/intuit/auto-release/pull/41) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Add Contributor documentation [#38](https://github.com/intuit/auto-release/pull/38) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.22.0 (Fri Dec 07 2018)

#### 🚀 Enhancement

- Add git user options [#37](https://github.com/intuit/auto-release/pull/37) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# 0.21.0 (Fri Dec 07 2018)

#### 🚀 Enhancement

- Add shipit tool [#35](https://github.com/intuit/auto-release/pull/35) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@adierkens](https://github.com/adierkens))

#### 🐛 Bug Fix

- add shipit parser [#36](https://github.com/intuit/auto-release/pull/36) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Adam Dierkens ([@adierkens](https://github.com/adierkens))

# v0.20.20 (Fri Dec 07 2018)

#### 🐛 Bug Fix

- Move login out of CLI [#33](https://github.com/intuit/auto-release/pull/33) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- update ignite [#30](https://github.com/intuit/auto-release/pull/30) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix header and theme sidebar [#27](https://github.com/intuit/auto-release/pull/27) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add base url [#25](https://github.com/intuit/auto-release/pull/25) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add correct author ;) [#24](https://github.com/intuit/auto-release/pull/24) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- remove weird border [#29](https://github.com/intuit/auto-release/pull/29) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update README.md [#28](https://github.com/intuit/auto-release/pull/28) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Polish [#26](https://github.com/intuit/auto-release/pull/26) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.20.19 (Thu Dec 06 2018)

#### 🏠 Internal

- getting codecov working [#20](https://github.com/intuit/auto-release/pull/20) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- more badges [#19](https://github.com/intuit/auto-release/pull/19) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝 Documentation

- Add documentation website [#21](https://github.com/intuit/auto-release/pull/21) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.20.18 (Thu Dec 06 2018)

#### 🐛 Bug Fix

- badge [#18](https://github.com/intuit/auto-release/pull/18) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠 Internal

- Contributors [#16](https://github.com/intuit/auto-release/pull/16) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.20.17 (Thu Dec 06 2018)

#### 🐛 Bug Fix

- Move typescript-memoize to dependencies [#17](https://github.com/intuit/auto-release/pull/17) ([@adierkens](https://github.com/adierkens))

#### Authors: 1

- Adam Dierkens ([@adierkens](https://github.com/adierkens))

---

# v0.20.16 (Thu Dec 06 2018)

#### 🐛 Bug Fix

- Check prCommit.author is defined. [#14](https://github.com/intuit/auto-release/pull/14) ([@adierkens](https://github.com/adierkens))

#### 🏠 Internal

- Rename CONTRIBUTING.md to CODE_OF_CONDUCT.md [#13](https://github.com/intuit/auto-release/pull/13) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Create CONTRIBUTING.md [#12](https://github.com/intuit/auto-release/pull/12) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update issue templates [#11](https://github.com/intuit/auto-release/pull/11) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Create PULL_REQUEST_TEMPLATE.md [#10](https://github.com/intuit/auto-release/pull/10) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove bad changelog [#9](https://github.com/intuit/auto-release/pull/9) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Adam Dierkens ([@adierkens](https://github.com/adierkens))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.20.15 (Wed Dec 05 2018)

#### 🐛 Bug Fix

- memoize all the user functions [#5](https://github.com/intuit/auto-release/pull/5) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.20.10 (Wed Dec 05 2018)

#### 🐛 Bug Fix

- ignore invalid user [#3](https://github.com/intuit/auto-release/pull/3) (hipstersmoothie@users.noreply.github.com)
- use correct url [#2](https://github.com/intuit/auto-release/pull/2) (hipstersmoothie@users.noreply.github.com)
- add auto release to CI [#1](https://github.com/intuit/auto-release/pull/1) (hipstersmoothie@users.noreply.github.com)

#### Authors: 1

- Andrew Lisowski (hipstersmoothie@users.noreply.github.com)

---

# v0.20.10 (Wed Dec 05 2018)

#### 🐛 Bug Fix

- ignore invalid user [#3](https://github.com/intuit/auto-release/pull/3) (hipstersmoothie@users.noreply.github.com)
- use correct url [#2](https://github.com/intuit/auto-release/pull/2) (hipstersmoothie@users.noreply.github.com)
- add auto release to CI [#1](https://github.com/intuit/auto-release/pull/1) (hipstersmoothie@users.noreply.github.com)

#### Authors: 1

- Andrew Lisowski (hipstersmoothie@users.noreply.github.com)

---

# v0.20.10 (Wed Dec 05 2018)

#### 🐛 Bug Fix

- ignore invalid user [#3](https://github.com/intuit/auto-release/pull/3) (hipstersmoothie@users.noreply.github.com)
- use correct url [#2](https://github.com/intuit/auto-release/pull/2) (hipstersmoothie@users.noreply.github.com)
- add auto release to CI [#1](https://github.com/intuit/auto-release/pull/1) (hipstersmoothie@users.noreply.github.com)

#### Authors: 1

- Andrew Lisowski (hipstersmoothie@users.noreply.github.com)

---

# v0.20.10 (Wed Dec 05 2018)

#### 🐛 Bug Fix

- ignore invalid user [#3](https://github.com/intuit/auto-release/pull/3) (hipstersmoothie@users.noreply.github.com)
- use correct url [#2](https://github.com/intuit/auto-release/pull/2) (hipstersmoothie@users.noreply.github.com)
- add auto release to CI [#1](https://github.com/intuit/auto-release/pull/1) (hipstersmoothie@users.noreply.github.com)

#### Authors: 1

- Andrew Lisowski (hipstersmoothie@users.noreply.github.com)

---

# v0.20.10 (Wed Dec 05 2018)

#### 🐛 Bug Fix

- ignore invalid user [#3](https://github.com/intuit/auto-release/pull/3) (hipstersmoothie@users.noreply.github.com)
- use correct url [#2](https://github.com/intuit/auto-release/pull/2) (hipstersmoothie@users.noreply.github.com)
- add auto release to CI [#1](https://github.com/intuit/auto-release/pull/1) (hipstersmoothie@users.noreply.github.com)

#### Authors: 1

- Andrew Lisowski (hipstersmoothie@users.noreply.github.com)

---

# v0.20.10 (Wed Dec 05 2018)

#### 🐛 Bug Fix

- ignore invalid user [#3](https://github.com/intuit/auto-release/pull/3) (hipstersmoothie@users.noreply.github.com)
- use correct url [#2](https://github.com/intuit/auto-release/pull/2) (hipstersmoothie@users.noreply.github.com)
- add auto release to CI [#1](https://github.com/intuit/auto-release/pull/1) (hipstersmoothie@users.noreply.github.com)

#### Authors: 1

- Andrew Lisowski (hipstersmoothie@users.noreply.github.com)

---

# v0.20.8 (Mon Dec 03 2018)

#### 🐛 Bug Fix

- Create note for PR commits without labels #101 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.20.7 (Sun Dec 02 2018)

#### 🏠 Internal

- Open Source Review #100 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.20.6 (Sat Nov 24 2018)

#### 🐛 Bug Fix

- update deps #98 (@alisowski)

#### 📝 Documentation

- Update README.md #95 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.20.5 (Thu Nov 15 2018)

#### 🐛 Bug Fix

- add no-verify to git commit so we skip githook (intuit-githooks) #94 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.20.4 (Thu Nov 15 2018)

#### 🐛 Bug Fix

- context is not required for pr-check #93 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.20.3 (Thu Nov 15 2018)

#### 🐛 Bug Fix

- remove all references to `--use-version lerna` #91 (@alisowski)
- Last Version doesn't need to have bump calculated #90 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.20.3 (Thu Nov 15 2018)

#### 🐛 Bug Fix

- Last Version doesn't need to have bump calculated #90 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.20.1 (Thu Nov 15 2018)

#### 🐛 Bug Fix

- Better version calculating #88 (@alisowski)

#### 📝 Documentation

- Add Projects Using auto-release #87 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.20.0 (Wed Nov 14 2018)

#### 🚀 Enhancement

- using lerna version to release #85 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.19.0 (Wed Nov 14 2018)

#### 🚀 Enhancement

- switch to --pr to match the rest of the API #82 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.18.0 (Wed Nov 14 2018)

#### 🚀 Enhancement

- ability to parse multiple jira stories in a commit message #81 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.17.0 (Wed Nov 14 2018)

#### 🚀 Enhancement

- get all authors for a pR #76 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.16.0 (Wed Nov 14 2018)

#### 🚀 Enhancement

- Change all github- to auto #79 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.15.0 (Wed Nov 07 2018)

#### 🚀 Enhancement

- OSS Preparation #72 (@adierkens)

#### 🐛 Bug Fix

- filter out null values from args so they dont override the config #74 (@alisowski)

#### 📝 Documentation

- update readme #73 (@alisowski)

#### Authors: 2

- Adam Dierkens (@adierkens)
- Andrew Lisowski (@alisowski)

---

# v0.14.0 (Mon Nov 05 2018)

#### 🚀 Enhancement

- add dry run to changelog #70 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.13.0 (Mon Nov 05 2018)

#### 🚀 Enhancement

- Verbose Log #69 (@alisowski)

#### 🏠 Internal

- Update Dependancies + Remove extra files #68 (@alisowski)

#### 📝 Documentation

- Add CircleCI setup #67 (@alisowski)
- Update README.md #66 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.12.8 (Tue Oct 30 2018)

#### 🐛 Bug Fix

- debug info #65 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.12.6 (Tue Oct 30 2018)

#### 🏠 Internal

- fix version path in release script #64 (@alisowski)
- Use github-version to calculate version instead in release.sh #62 (@alisowski)

#### 📝 Documentation

- add important setup line #63 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# vnull (Tue Oct 30 2018)

---

# vnull (Tue Oct 30 2018)

#### 🐛 Bug Fix

- prefix the github release too #58 (@alisowski)

#### 🏠 Internal

- remove token and actually run the thing #59 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.12.4 (Tue Oct 30 2018)

#### 🐛 Bug Fix

- prefix the github release too #58 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.12.3 (Tue Oct 30 2018)

---

# v0.12.2 (Tue Oct 30 2018)

#### 🐛 Bug Fix

- use pr check #57 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.12.1 (Tue Oct 30 2018)

---

# v0.12.0 (Tue Oct 30 2018)

#### 🚀 Enhancement

- - Monorepo aware changelogs #55 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.11.0 (Tue Oct 30 2018)

#### 🚀 Enhancement

- Rely on package.json less #54 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.10.6 (Fri Oct 26 2018)

#### 🐛 Bug Fix

- onlyPublishWIthReleaseLabel default value bug #53 (@alisowski)
- fix no version script #51 (@alisowski)
- latest commit is actually first #50 (@alisowski)

#### 📝 Documentation

- add more docs #52 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.10.5 (Fri Oct 26 2018)

#### 🐛 Bug Fix

- add missing bin scripts #48 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.10.4 (Fri Oct 26 2018)

#### 📝 Documentation

- re-org readme #49 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.10.3 (Fri Oct 26 2018)

#### 🐛 Bug Fix

- must prefix release if needed. #47 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.10.2 (Fri Oct 26 2018)

#### 🐛 Bug Fix

- Gugs #46 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.10.1 (Fri Oct 26 2018)

#### 🐛 Bug Fix

- Update README.md #45 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.10.0 (Fri Oct 26 2018)

#### 🚀 Enhancement

- Link to PR in changelog #42 (@alisowski)

#### 🐛 Bug Fix

- just use use version to get it right? #44 (@alisowski)
- Put changelog generation in correct place #43 (@alisowski)
- add more logging #41 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.9.0 (Fri Oct 26 2018)

#### 🚀 Enhancement

- Link to PR in changelog #42 (@alisowski)

#### 🐛 Bug Fix

- just use use version to get it right? #44 (@alisowski)
- Put changelog generation in correct place #43 (@alisowski)
- add more logging #41 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.8.0 (Fri Oct 26 2018)

#### 🚀 Enhancement

- Link to PR in changelog #42 (@alisowski)

#### 🐛 Bug Fix

- Put changelog generation in correct place #43 (@alisowski)
- add more logging #41 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.6.2 (Fri Oct 26 2018)

#### 🐛 Bug Fix

- add more logging #41]()[@alisowski

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.6.1 (Fri Oct 26 2018)

#### 🐛 Bug Fix

- add more logging #41 (@alisowski)

#### Authors: 1

- Andrew Lisowski (@alisowski)

---

# v0.6.0 (Fri Oct 26 2018)

#### 🚀 Enhancement

- add release script #34 (@adierkens)
- github-comment #33 (@alisowski)
- add authors to changelog #22 (@alisowski)
- Version and Author Bug #40 (@alisowski)

#### 🐛 Bug Fix

- change the name #39 (@alisowski)

#### Authors: 2

- Adam Dierkens (@adierkens)
- Andrew Lisowski (@alisowski)
