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

- Uncomment git commit/push commands ([@rbellamy](https://github.com/rbellamy))
- Add comment describing magic number used by XPath evaluation ([@rbellamy](https://github.com/rbellamy))
- Update README to describe deprecation of MAVEN_USERNAME and MAVEN_PASSWORD. ([@rbellamy](https://github.com/rbellamy))
- Update README to describe assumptions. ([@rbellamy](https://github.com/rbellamy))
- Update for style and move some devDependencies to dependencies. ([@rbellamy](https://github.com/rbellamy))
- Support both "versions-maven-plugin" and auto-native DOM/XML ([@rbellamy](https://github.com/rbellamy))
- Update plugins/maven/README.md ([@rbellamy](https://github.com/rbellamy))
- Update README for grammar and style. ([@rbellamy](https://github.com/rbellamy))
- Support both "versions-maven-plugin" and auto-native DOM/XML ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Attempt to use regex to find/replace the previous/next version. ([@rbellamy](https://github.com/rbellamy))
- change beforeRun hook from sync to async ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Remove requirement for "maven-release-plugin" and other improvements ([@rbellamy](https://github.com/rbellamy))
- switch to next-ignite ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump tslib from 1.11.1 to 2.0.0 ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### 📝 Documentation

- switch to next-ignite [#1293](https://github.com/intuit/auto/pull/1293) ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v9.36.2 (Sat May 23 2020)

#### 🐛 Bug Fix

- Fix missing use of MAVEN_SNAPSHOT_BRANCH [#1242](https://github.com/intuit/auto/pull/1242) ([@rbellamy](https://github.com/rbellamy))
- Fix hard-coded reference to "master" ([@rbellamy](https://github.com/rbellamy))
- Fix missing use of MAVEN_SNAPSHOT_BRANCH ([@rbellamy](https://github.com/rbellamy))

#### Authors: 1

- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

---

# v9.36.1 (Fri May 22 2020)

#### 🐛 Bug Fix

- fix reduce without initial value [#1249](https://github.com/intuit/auto/pull/1249) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.35.3 (Fri May 22 2020)

#### 🐛 Bug Fix

- Changelog formatting [#1246](https://github.com/intuit/auto/pull/1246) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.35.2 (Fri May 22 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Kevin Wolf ([@kevinwolfdev](https://github.com/kevinwolfdev)), for all your work!

#### 🐛 Bug Fix

- Merge branch 'master' into extend-default-labels ([@kevinwolfdev](https://github.com/kevinwolfdev))

#### Authors: 1

- Kevin Wolf ([@kevinwolfdev](https://github.com/kevinwolfdev))

---

# v9.35.0 (Thu May 21 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy)), for all your work!

#### 🚀 Enhancement

- Maven plugin support for configurable SNAPSHOT branch [#1241](https://github.com/intuit/auto/pull/1241) ([@rbellamy](https://github.com/rbellamy))

#### 🐛 Bug Fix

- Maven plugin support for configurable SNAPSHOT branch ([@rbellamy](https://github.com/rbellamy))

#### Authors: 1

- G. Richard Bellamy ([@rbellamy](https://github.com/rbellamy))

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

#### 🔩 Dependency Updates

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

- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

# v9.12.0 (Fri Feb 21 2020)

#### 🐛 Bug Fix

- ensure remote can be pushed to ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.0 (Thu Feb 06 2020)

#### 🐛 Bug Fix

- add "info" command ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.8.4 (Fri Jan 31 2020)

#### 🐛 Bug Fix

- fix maven release creation ([@hipstersmoothie](https://github.com/hipstersmoothie))
- resolves #922

update maven & jenkins documentation (navjot_cheema@intuit.com)

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- ncheema (navjot_cheema@intuit.com)

---

# v9.1.1 (Thu Jan 23 2020)

#### 🐛 Bug Fix

- add clearer docs around creating GH_TOKEN ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

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
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.2.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
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

- Bump version to: v8.4.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.3.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.2.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.1.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
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

# v8.3.0 (Mon Dec 16 2019)

#### 🐛 Bug Fix

- Bump semver from 6.3.0 to 7.0.0

Bumps [semver](https://github.com/npm/node-semver) from 6.3.0 to 7.0.0.

- [Release notes](https://github.com/npm/node-semver/releases)
- [Changelog](https://github.com/npm/node-semver/blob/master/CHANGELOG.md)
- [Commits](https://github.com/npm/node-semver/compare/v6.3.0...v7.0.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com> ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 1

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v8.0.0 (Wed Dec 11 2019)

#### 🐛 Bug Fix

- Bump version to: v8.0.0-next.4 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- reset versions ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.7 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.6 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.5 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.8 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
