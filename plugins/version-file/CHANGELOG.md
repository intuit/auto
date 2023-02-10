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
