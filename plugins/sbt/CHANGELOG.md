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

# v10.32.6 (Thu Jan 20 2022)

:tada: This release contains work from a new contributor! :tada:

Thank you, Torkjel Hongve ([@torkjel](https://github.com/torkjel)), for all your work!

#### 🐛 Bug Fix

- sbt: Avoid clobbering unrelated version settings [#2067](https://github.com/intuit/auto/pull/2067) ([@torkjel](https://github.com/torkjel))
- Fix tests ([@torkjel](https://github.com/torkjel))
- sbt: Avoid clobbering unrelated version settings ([@torkjel](https://github.com/torkjel))

#### Authors: 1

- Torkjel Hongve ([@torkjel](https://github.com/torkjel))

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

# v10.26.0 (Fri May 07 2021)

:tada: This release contains work from a new contributor! :tada:

Thank you, Alexey Alekhin ([@laughedelic](https://github.com/laughedelic)), for all your work!

#### 🚀 Enhancement

- add sbt plugin [#1962](https://github.com/intuit/auto/pull/1962) ([@laughedelic](https://github.com/laughedelic))

#### 🐛 Bug Fix

- add link to sbt's readme ([@laughedelic](https://github.com/laughedelic))
- unused import ([@laughedelic](https://github.com/laughedelic))
- moar tests! ([@laughedelic](https://github.com/laughedelic))
- tests for sbtGetVersion ([@laughedelic](https://github.com/laughedelic))
- first test for cleaning sbt client output ([@laughedelic](https://github.com/laughedelic))
- pull sbt helpers out for testing ([@laughedelic](https://github.com/laughedelic))
- rename manageVersion to setCanaryVersion ([@laughedelic](https://github.com/laughedelic))
- always set version on release ([@laughedelic](https://github.com/laughedelic))
- adjust sbtClient interface ([@laughedelic](https://github.com/laughedelic))
- switch sbt-specific logs to verbose logger ([@laughedelic](https://github.com/laughedelic))
- add publishCommand option ([@laughedelic](https://github.com/laughedelic))
- downgrade strip-ansi ([@laughedelic](https://github.com/laughedelic))
- trim version output ([@laughedelic](https://github.com/laughedelic))
- don't aggregate version ([@laughedelic](https://github.com/laughedelic))
- remove unused test ([@laughedelic](https://github.com/laughedelic))
- note about sbt version ([@laughedelic](https://github.com/laughedelic))
- linting ([@laughedelic](https://github.com/laughedelic))
- docs ([@laughedelic](https://github.com/laughedelic))
- add manageVersion config option ([@laughedelic](https://github.com/laughedelic))
- clean output log ([@laughedelic](https://github.com/laughedelic))
- cut off v prefix ([@laughedelic](https://github.com/laughedelic))
- use strip-ansi ([@laughedelic](https://github.com/laughedelic))
- add SNAPSHOT suffix to the canary version ([@laughedelic](https://github.com/laughedelic))
- refactor ([@laughedelic](https://github.com/laughedelic))
- add semver dependency ([@laughedelic](https://github.com/laughedelic))
- blank lines ([@laughedelic](https://github.com/laughedelic))
- add publish logs to the canary details ([@laughedelic](https://github.com/laughedelic))
- add code from git-tag, implement publish/canary hooks ([@laughedelic](https://github.com/laughedelic))
- generate sbt plugin ([@laughedelic](https://github.com/laughedelic))

#### Authors: 1

- Alexey Alekhin ([@laughedelic](https://github.com/laughedelic))
