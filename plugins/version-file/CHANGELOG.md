# v11.2.0 (Wed Jul 17 2024)

#### 🚀 Enhancement

- [Version File] Remove assumption that canary and next should be snapshots [#2467](https://github.com/intuit/auto/pull/2467) ([@sugarmanz](https://github.com/sugarmanz))

#### 🐛 Bug Fix

- lint ([@sugarmanz](https://github.com/sugarmanz))
- readme formatting ([@sugarmanz](https://github.com/sugarmanz))
- make it non-breaking ([@sugarmanz](https://github.com/sugarmanz))
- update version-file tests to reflect change ([@sugarmanz](https://github.com/sugarmanz))
- update version-file docs to reflect change ([@sugarmanz](https://github.com/sugarmanz))
- let publish script know more about the type of release, instead of hardcoding snapshot for next ([@sugarmanz](https://github.com/sugarmanz))

#### Authors: 1

- Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz))

---

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

# v10.37.2 (Fri Jul 15 2022)

#### 🐛 Bug Fix

- Get correct next version when using onlyGraduateWithReleaseLabel [#2229](https://github.com/intuit/auto/pull/2229) ([@adierkens](https://github.com/adierkens))
- Get correct next version when using onlyGraduateWithReleaseLabel shipit option ([@adierkens](https://github.com/adierkens))

#### Authors: 1

- Adam Dierkens ([@adierkens](https://github.com/adierkens))

---

# v10.33.0 (Fri May 20 2022)

:tada: This release contains work from a new contributor! :tada:

Thank you, Ketan Reddy ([@KetanReddy](https://github.com/KetanReddy)), for all your work!

#### 🚀 Enhancement

- Version File Plugin [#2107](https://github.com/intuit/auto/pull/2107) (ketan_reddy@intuit.com)

#### 🐛 Bug Fix

- Fix more tests (ketan_reddy@intuit.com)
- Make sure quotes are included in commit message (ketan_reddy@intuit.com)
- Fix version in commit string not being replaced. Align versioning scheme with other plugins (ketan_reddy@intuit.com)
- fix failing test (ketan_reddy@intuit.com)
- remove duplicate dash in canary version names (ketan_reddy@intuit.com)
- change plugin name to match convention (ketan_reddy@intuit.com)
- Fix issue with getting last release in canary builds with no previous versions (ketan_reddy@intuit.com)
- rename releaseScript to publishScript to keep naming consistant (ketan_reddy@intuit.com)
- include the version-file plugin with the cli (ketan_reddy@intuit.com)
- Rename to be more accurate. Make releaseScript optional, update tests. (ketan_reddy@intuit.com)

#### Authors: 1

- Ketan Reddy ([@KetanReddy](https://github.com/KetanReddy))
