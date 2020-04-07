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

# v9.21.1 (Fri Mar 27 2020)

#### 🐛 Bug Fix

- Respect Updated PR Titles [#1082](https://github.com/intuit/auto/pull/1082) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.21.0 (Fri Mar 20 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Shelby Cohen ([@ShelbyCohen](https://github.com/ShelbyCohen)), for all your work!

#### 🚀 Enhancement

- Re-introduce `build` option back, but make it configurable so that [#1067](https://github.com/intuit/auto/pull/1067) ([@unknownerror404](https://github.com/unknownerror404) [@ShelbyCohen](https://github.com/ShelbyCohen))

#### Authors: 2

- Brandon Miller ([@unknownerror404](https://github.com/unknownerror404))
- Shelby Cohen ([@ShelbyCohen](https://github.com/ShelbyCohen))

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

- 🐘 Gradle Plugin: Add support for snapshot versioning, publishing, and less configuration [#996](https://github.com/intuit/auto/pull/996) ([@sugarmanz](https://github.com/sugarmanz) Jeremiah_Zucker@Intuit.com [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Jeremiah (Jeremiah_Zucker@Intuit.com)
- Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz))

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

# v9.12.0 (Fri Feb 21 2020)

#### 🐛 Bug Fix

- ensure remote can be pushed to ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.10.8 (Fri Feb 21 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz)), for all your work!

#### 🐛 Bug Fix

- fix: gradle readme use jsonc syntax highlighting

allows comments ([@sugarmanz](https://github.com/sugarmanz))

#### Authors: 1

- Jeremiah Zucker ([@sugarmanz](https://github.com/sugarmanz))

---

# v7.17.0 (Fri Jan 31 2020)

#### 🐛 Bug Fix

- PR Fixes: Docs + Required + Consts (brandon_miller3@intuit.com)
- Re-name test files to be consistent with plugin/comments. (brandon_miller3@intuit.com)
- Fix Documenation Section Title to Gradle. (brandon_miller3@intuit.com)
- Documentation + Tests + Gradle Custom Options. (brandon_miller3@intuit.com)
- Gradle Release Plugin Contribution. (brandon_miller3@intuit.com)

#### Authors: 1

- svc-mobile (brandon_miller3@intuit.com)
