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

# v9.15.2 (Sun Mar 01 2020)

#### 🐛 Bug Fix

- Respect PR label when conventional commit message is present ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
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
- Bump version to: v7.17.0-next.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.8 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.7 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- get label refactor working ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.6 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.5 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- reset versions ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.3 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.2 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.1 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update README to include required npm plugin

see https://github.com/intuit/auto/issues/775 ([@sarah-vanderlaan](https://github.com/sarah-vanderlaan))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
