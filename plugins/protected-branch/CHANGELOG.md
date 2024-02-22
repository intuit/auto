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
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Fix release creation on oldVersions [#2391](https://github.com/intuit/auto/pull/2391) ([@jBouyoud](https://github.com/jBouyoud))
- fix: open release PR on current branch instead of base [#2389](https://github.com/intuit/auto/pull/2389) ([@jBouyoud](https://github.com/jBouyoud))
- fix: open release PR on current branch instead of base ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v11.0.2 (Wed Sep 06 2023)

#### 🐛 Bug Fix

- Fix release creation on oldVersions [#2391](https://github.com/intuit/auto/pull/2391) ([@jBouyoud](https://github.com/jBouyoud))
- fix: open release PR on current branch instead of base [#2389](https://github.com/intuit/auto/pull/2389) ([@jBouyoud](https://github.com/jBouyoud))
- fix: open release PR on current branch instead of base ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 1

- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))

---

# v11.0.1 (Thu Aug 10 2023)

:tada: This release contains work from a new contributor! :tada:

Thank you, Paul Aldrich ([@aldrichdev](https://github.com/aldrichdev)), for all your work!

#### 🐛 Bug Fix

- [CocoaPods] switch Promise.all for reduce to avoid git lock [#2327](https://github.com/intuit/auto/pull/2327) ([@hborawski](https://github.com/hborawski))
- Update README.md ([@aldrichdev](https://github.com/aldrichdev))

#### 📝 Documentation

- Update Protected-Branch README.md [#2383](https://github.com/intuit/auto/pull/2383) ([@aldrichdev](https://github.com/aldrichdev))

#### Authors: 2

- Harris Borawski ([@hborawski](https://github.com/hborawski))
- Paul Aldrich ([@aldrichdev](https://github.com/aldrichdev))

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

# v10.41.0 (Thu Feb 09 2023)

#### 🚀 Enhancement

- Improve protected branch plugin [#2317](https://github.com/intuit/auto/pull/2317) ([@jBouyoud](https://github.com/jBouyoud))

#### 🐛 Bug Fix

- feat(protected-branch): silently ignore ref not found when deleting ([@jBouyoud](https://github.com/jBouyoud))
- feat(protected-branch): rely on internal git object instead of external program ([@jBouyoud](https://github.com/jBouyoud))

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

# v10.38.5 (Sun Feb 05 2023)

#### 🐛 Bug Fix

- delete branch after release [#2301](https://github.com/intuit/auto/pull/2301) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- delete branch after release ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v10.38.0 (Sat Feb 04 2023)

#### 🚀 Enhancement

- Create Protected branch plugin [#2210](https://github.com/intuit/auto/pull/2210) ([@jBouyoud](https://github.com/jBouyoud) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- feat(protected-branch): initial release ([@jBouyoud](https://github.com/jBouyoud))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Julien Bouyoud ([@jBouyoud](https://github.com/jBouyoud))
