# v9.21.1 (Fri Mar 27 2020)

#### 🐛 Bug Fix

- Respect Updated PR Titles [#1082](https://github.com/intuit/auto/pull/1082) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.19.4 (Tue Mar 10 2020)

#### 🐛 Bug Fix

- Only trim exec output if its a string [#1052](https://github.com/intuit/auto/pull/1052) ([@adierkens](https://github.com/adierkens))

#### 📝 Documentation

- add exec plugin to docs [#1051](https://github.com/intuit/auto/pull/1051) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Adam Dierkens ([@adierkens](https://github.com/adierkens))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- Add Exec Plugin [#1033](https://github.com/intuit/auto/pull/1033) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
