# v9.1.3 (Thu Jan 23 2020)

#### 🐛  Bug Fix

- `@auto-it/npm`
  - Fix commiting sub-package changelogs [#885](https://github.com/intuit/auto/pull/885) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.2 (Thu Jan 23 2020)

#### 🐛  Bug Fix

- `@auto-it/core`
  - fix omitting renovate release notes when a user manually rebases the renovate PR [#884](https://github.com/intuit/auto/pull/884) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.1 (Thu Jan 23 2020)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Fix onlyPublishWithReleaseLabel w/o labels [#883](https://github.com/intuit/auto/pull/883) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- `@auto-it/chrome`, `@auto-it/maven`
  - add clearer docs around creating GH_TOKEN [#882](https://github.com/intuit/auto/pull/882) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.1.0 (Tue Jan 21 2020)

#### 🚀  Enhancement

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

#### 🐛  Bug Fix

- `@auto-it/all-contributors`
  - Fix running all-contributors when not installed [#871](https://github.com/intuit/auto/pull/871) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.0.1 (Mon Jan 13 2020)

#### 🐛  Bug Fix

- `@auto-it/core`
  - handle PR numbers that don't exist in repo/fork [#870](https://github.com/intuit/auto/pull/870) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v9.0.0 (Mon Jan 13 2020)

#### 💥  Breaking Change

- `auto`
  - require Node.js >=10.x [#869](https://github.com/intuit/auto/pull/869) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛  Bug Fix

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

#### 🚀  Enhancement

- `@auto-it/slack`
  - fix: prevent slack from default publishing on prerelease branches [#829](https://github.com/intuit/auto/pull/829) ([@Aghassi](https://github.com/Aghassi))

#### 📝  Documentation

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

#### 🐛  Bug Fix

- `@auto-it/core`
  - next: check origin head instead of local branch for tags [#827](https://github.com/intuit/auto/pull/827) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.7.2 (Fri Dec 20 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - find the last greatest tag to help with botched releases [#826](https://github.com/intuit/auto/pull/826) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.7.1 (Thu Dec 19 2019)

#### 🐛  Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - Add more logs for next release calculation [#824](https://github.com/intuit/auto/pull/824) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.7.0 (Thu Dec 19 2019)

#### 🚀  Enhancement

- `@auto-it/core`
  - add context of what type of release was made during shipit [#821](https://github.com/intuit/auto/pull/821) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.3 (Thu Dec 19 2019)

#### 🐛  Bug Fix

- `@auto-it/core`, `@auto-it/git-tag`, `@auto-it/npm`, `@auto-it/released`
  - determine next version using by omitting tags from master [#820](https://github.com/intuit/auto/pull/820) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.2 (Wed Dec 18 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - only access auto login if it all exists [#819](https://github.com/intuit/auto/pull/819) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.6.1 (Wed Dec 18 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - canary hook can return void to not bail [#817](https://github.com/intuit/auto/pull/817) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- update docs to show JS plugins and how to use versionBranches [#816](https://github.com/intuit/auto/pull/816) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.5.0 (Tue Dec 17 2019)

#### 🚀  Enhancement

- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Version branches [#814](https://github.com/intuit/auto/pull/814) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.4.1 (Mon Dec 16 2019)

#### 🐛  Bug Fix

- `auto`, `@auto-it/npm`
  - alias the canary scope [#813](https://github.com/intuit/auto/pull/813) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.4.0 (Mon Dec 16 2019)

#### 🚀  Enhancement

- `@auto-it/core`
  - version: detect prerelease branch [#811](https://github.com/intuit/auto/pull/811) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.3.0 (Mon Dec 16 2019)

#### 🚀  Enhancement

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

#### 🚀  Enhancement

- `auto`, `@auto-it/core`
  - release: add flag to publish prerelease [#800](https://github.com/intuit/auto/pull/800) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- Slight improvements to label configuration docs [#799](https://github.com/intuit/auto/pull/799) ([@bnigh](https://github.com/bnigh))

#### 📚 Blog Post

- touch up blog post [#798](https://github.com/intuit/auto/pull/798) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@bnigh](https://github.com/bnigh)
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.3 (Sat Dec 14 2019)

#### 🐛  Bug Fix

- `@auto-it/core`, `@auto-it/jira`, `@auto-it/npm`
  - omit next branch PR Title from being in release notes [#796](https://github.com/intuit/auto/pull/796) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.2 (Sat Dec 14 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Fix `none` releases: they were not handling extra labels [#797](https://github.com/intuit/auto/pull/797) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.1 (Sat Dec 14 2019)

#### 📝  Documentation

- `@auto-it/npm`
  - add diagrams [#795](https://github.com/intuit/auto/pull/795) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.0 (Sat Dec 14 2019)

#### 🚀  Enhancement

- `@auto-it/npm`
  - add canaryScope option for more secure PR builds [#792](https://github.com/intuit/auto/pull/792) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛  Bug Fix

- `@auto-it/core`
  - fix bug where merging a none would skip previously meged semver bump [#794](https://github.com/intuit/auto/pull/794) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

- add context [#790](https://github.com/intuit/auto/pull/790) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/npm`
  - V8.1 [#793](https://github.com/intuit/auto/pull/793) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

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
    { "releaseType": "patch", "name": "Version: Patch" },
  ]
}
```

2. Instead of using `skipReleaseLabels` just set the label's `type` to `skip`

```json
{
  "labels": [
    { "releaseType": "skip", "name": "NO!" }
  ]
}
```

3. Overwrite default labels using `overwrite`

```json
{
  "labels": [
    { "releaseType": "major", "name": "Version: Major", "overwrite": true },
  ]
}
```

4. Add `none` `releaseType`. This will act as a `skip-release` unless paired with a SEMVER label

```json
{
  "labels": [
    { "releaseType": "none", "name": "documentation" },
  ]
}
```

5. Changed `title` to `changelogTitle`.

```json
{
  "labels": [
    { "changelogTitle": "New Docs Yo!", "name": "documentation" },
  ]
}
```

---

#### 💥  Breaking Change

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

#### 🚀  Enhancement

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

#### 🐛  Bug Fix

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

#### 🏠  Internal

- reset monorepo version for next branch [#769](https://github.com/intuit/auto/pull/769) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/git-tag`, `@auto-it/npm`, `@auto-it/s3`
  - add tests [#779](https://github.com/intuit/auto/pull/779) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/upload-assets`
  - More resilient test case [#772](https://github.com/intuit/auto/pull/772) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

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

#### 🚀  Enhancement

- `@auto-it/all-contributors`
  - add more defaults to all-contributors plugin [#756](https://github.com/intuit/auto/pull/756) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

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

#### 🏠  Internal

- `@auto-it/core`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/released`
  - Upgrade to Typescript 3.7 [#711](https://github.com/intuit/auto/pull/711) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

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

#### 🐛  Bug Fix

- `@auto-it/npm`
  - More flexible monorepo publishing [#698](https://github.com/intuit/auto/pull/698) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.16.1 (Thu Nov 14 2019)

#### 🐛  Bug Fix

- `@auto-it/npm`
  - match behavior between lerna and npm when pushing git tags [#697](https://github.com/intuit/auto/pull/697) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.16.0 (Thu Nov 14 2019)

#### 🚀  Enhancement

- automatically update brew formula [#694](https://github.com/intuit/auto/pull/694) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛  Bug Fix

- correct grammar [#696](https://github.com/intuit/auto/pull/696) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- correct docs [#695](https://github.com/intuit/auto/pull/695) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.15.2 (Thu Nov 14 2019)

#### 🐛  Bug Fix

- `@auto-it/npm`
  - Fixed string interpolation on Lerna version bump [#693](https://github.com/intuit/auto/pull/693) ([@jrnail23](https://github.com/jrnail23))

#### Authors: 1

- James Nail ([@jrnail23](https://github.com/jrnail23))

---

# v7.15.1 (Wed Nov 13 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - add logs for where plugins were found [#691](https://github.com/intuit/auto/pull/691) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

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

#### 🚀  Enhancement

- `auto`, `@auto-it/core`, `@auto-it/git-tag`, `@auto-it/npm`
  - Default to `git-tag` plugin when run from binary [#684](https://github.com/intuit/auto/pull/684) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.14.1 (Tue Nov 12 2019)

#### 🐛  Bug Fix

- `@auto-it/all-contributors`
  - Fix bug where 'all-contributors' plugin wasn't picking up changes [#683](https://github.com/intuit/auto/pull/683) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.14.0 (Tue Nov 12 2019)

#### 🚀  Enhancement

- `@auto-it/core`
  - detect PR number when running  "auto label" without "--pr" [#682](https://github.com/intuit/auto/pull/682) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- `auto`
  - Rewrite README Issue #666 [#680](https://github.com/intuit/auto/pull/680) ([@karenclo](https://github.com/karenclo) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Karen Lo ([@karenclo](https://github.com/karenclo))

---

# v7.13.3 (Tue Nov 12 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - warn when canary not implemented [#678](https://github.com/intuit/auto/pull/678) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

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

#### 📝  Documentation

- clarify plugin docs [#664](https://github.com/intuit/auto/pull/664) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/crates`, `@auto-it/first-time-contributor`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/s3`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Add JSDoc comment to most everything [#665](https://github.com/intuit/auto/pull/665) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### ⚠️  Pushed to master

- skip ci when updating gh-pages  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- set git user  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.13.1 (Thu Nov 07 2019)

#### 🐛  Bug Fix

- `@auto-it/npm`
  - Fix GitHub Release's release notes for monorepo during shipit [#663](https://github.com/intuit/auto/pull/663) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.13.0 (Thu Nov 07 2019)

#### 🚀  Enhancement

- `@auto-it/core`, `@auto-it/all-contributors`, `@auto-it/npm`
  - NPM: manage a changelog for each sub-package in monorepo [#658](https://github.com/intuit/auto/pull/658) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.12.9 (Thu Nov 07 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Fix wrong author in changelog [#661](https://github.com/intuit/auto/pull/661) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.12.8 (Thu Nov 07 2019)

#### 🐛  Bug Fix

- `@auto-it/first-time-contributor`
  - Fix multiple first-time-contributor thank you [#660](https://github.com/intuit/auto/pull/660) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.12.7 (Thu Nov 07 2019)

#### 🐛  Bug Fix

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

#### 🐛  Bug Fix

- `@auto-it/core`
  - fix issue with latest enterprise compat plugin [#655](https://github.com/intuit/auto/pull/655) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - Update changelog to include prs without labels when using custom patch label [#640](https://github.com/intuit/auto/pull/640) ([@bnigh](https://github.com/bnigh))

#### 🏠  Internal

- more reliable docs publish [#642](https://github.com/intuit/auto/pull/642) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- Adds documentation for using auto with no plugins [#641](https://github.com/intuit/auto/pull/641) ([@athityakumar](https://github.com/athityakumar))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@bnigh](https://github.com/bnigh)
- Athitya Kumar ([@athityakumar](https://github.com/athityakumar))

---

# v7.12.5 (Wed Oct 30 2019)

:tada: This release contains work from a new contributor! :tada:

Thank you, Athitya Kumar ([@athityakumar](https://github.com/athityakumar)), for all your work!

#### 🐛  Bug Fix

- `@auto-it/core`
  - Update changelog to include prs without labels when using custom patch label [#640](https://github.com/intuit/auto/pull/640) ([@bnigh](https://github.com/bnigh))

#### 📝  Documentation

- Adds documentation for using auto with no plugins [#641](https://github.com/intuit/auto/pull/641) ([@athityakumar](https://github.com/athityakumar))

#### Authors: 2

- [@bnigh](https://github.com/bnigh)
- Athitya Kumar ([@athityakumar](https://github.com/athityakumar))

---

# v7.12.4 (Tue Oct 29 2019)

#### 🐛  Bug Fix

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

#### 🐛  Bug Fix

- `@auto-it/core`, `@auto-it/first-time-contributor`
  - better error messaging when tags aren't present [#626](https://github.com/intuit/auto/pull/626) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.12.2 (Wed Oct 23 2019)

:tada: This release contains work from a new contributor! :tada:

Thank you, Rocio Montes ([@roxiomontes](https://github.com/roxiomontes)), for all your work!

#### 🐛  Bug Fix

- adding Auto svg logo [#625](https://github.com/intuit/auto/pull/625) ([@roxiomontes](https://github.com/roxiomontes))

#### Authors: 1

- Rocio Montes ([@roxiomontes](https://github.com/roxiomontes))

---

# v7.12.1 (Wed Oct 23 2019)

#### 🐛  Bug Fix

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

#### 🚀  Enhancement

- `@auto-it/core`, `@auto-it/all-contributors`
  - New Plugin: All contributors [#612](https://github.com/intuit/auto/pull/612) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

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

#### 🚀  Enhancement

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

#### 🚀  Enhancement

- `@auto-it/core`, `@auto-it/crates`, `@auto-it/first-time-contributor`
  - New Plugin: "first-time-contributor" [#610](https://github.com/intuit/auto/pull/610) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### ⚠️  Pushed to master

- `@auto-it/first-time-contributor`
  - fix build  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.9.2 (Thu Oct 17 2019)

#### 🏠  Internal

- `auto`
  - Switch to command-line-application and command-line-docs [#585](https://github.com/intuit/auto/pull/585) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.9.1 (Thu Oct 17 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - only add hash to canary version if no pr or build detected [#609](https://github.com/intuit/auto/pull/609) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- `@auto-it/crates`, `@auto-it/maven`
  - fix install names in readmes [#608](https://github.com/intuit/auto/pull/608) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.9.0 (Wed Oct 16 2019)

#### 🚀  Enhancement

- `@auto-it/crates`
  - Crates (Rust language) plugin [#587](https://github.com/intuit/auto/pull/587) ([@Celeo](https://github.com/Celeo) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

- update plugin template [#606](https://github.com/intuit/auto/pull/606) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Modern build output [#607](https://github.com/intuit/auto/pull/607) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`, `@auto-it/chrome`, `@auto-it/conventional-commits`, `@auto-it/git-tag`, `@auto-it/jira`, `@auto-it/maven`, `@auto-it/npm`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Update Tooling [#605](https://github.com/intuit/auto/pull/605) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

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

#### 🚀  Enhancement

- `@auto-it/core`
  - proxy support in auto [#584](https://github.com/intuit/auto/pull/584) (ykhandelwal@intuit.com [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- ykhandelwal (ykhandelwal@intuit.com)

---

# v7.7.0 (Thu Oct 03 2019)

#### 🚀  Enhancement

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

#### 🏠  Internal

- `@auto-it/core`
  - Update Octokit [#574](https://github.com/intuit/auto/pull/574) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.6.1 (Fri Sep 27 2019)

#### 🐛  Bug Fix

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

#### 🚀  Enhancement

- `auto`, `@auto-it/core`
  - Add 'from' option for version command [#561](https://github.com/intuit/auto/pull/561) ([@bnigh](https://github.com/bnigh))

#### Authors: 1

- [@bnigh](https://github.com/bnigh)

---

# v7.5.0 (Thu Sep 12 2019)

#### 🚀  Enhancement

- `auto`, `@auto-it/core`
  - Add 'from' option for release command [#552](https://github.com/intuit/auto/pull/552) ([@bnigh](https://github.com/bnigh))

#### Authors: 1

- [@bnigh](https://github.com/bnigh)

---

# v7.4.5 (Mon Sep 09 2019)

#### 🐛  Bug Fix

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

#### 🐛  Bug Fix

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

#### 🐛  Bug Fix

- `@auto-it/npm`
  - set-token: handle when no name in root package.json [#549](https://github.com/intuit/auto/pull/549) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.4.2 (Mon Sep 02 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - label creation is case insensitive [#548](https://github.com/intuit/auto/pull/548) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.4.1 (Sun Sep 01 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Fix create-labels bug [#542](https://github.com/intuit/auto/pull/542) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.4.0 (Sat Aug 31 2019)

#### 🚀  Enhancement

- `@auto-it/core`, `@auto-it/conventional-commits`
  - add ability for configured labels to be an array [#540](https://github.com/intuit/auto/pull/540) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.3.6 (Wed Aug 28 2019)

#### 🐛  Bug Fix

- `@auto-it/core`, `@auto-it/released`
  - omit commit+prs that: aren't found in repo, are issues, or have the "released" label [#538](https://github.com/intuit/auto/pull/538) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- [Security] Bump mixin-deep from 1.3.1 to 1.3.2 [#536](https://github.com/intuit/auto/pull/536) ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])

---

# v7.3.5 (Wed Aug 28 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Ensure the release doesn't fail if a PR doesn't exist [#537](https://github.com/intuit/auto/pull/537) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.3.4 (Mon Aug 26 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Fix PRs with non-configured labels being omitted from changelogs [#533](https://github.com/intuit/auto/pull/533) ([@bnigh](https://github.com/bnigh))

#### Authors: 1

- [@bnigh](https://github.com/bnigh)

---

# v7.3.3 (Mon Aug 26 2019)

#### 🐛  Bug Fix

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

#### 🐛  Bug Fix

- `@auto-it/core`
  - attach sha to canary version if no (pr || build) [#519](https://github.com/intuit/auto/pull/519) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.3.1 (Fri Aug 16 2019)

#### 🐛  Bug Fix

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

#### 🚀  Enhancement

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

#### 🐛  Bug Fix

- `@auto-it/core`
  - fix logging error in pr-check [#497](https://github.com/intuit/auto/pull/497) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

- change to dependabot [#495](https://github.com/intuit/auto/pull/495) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

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

#### 🏠  Internal

- Remove pr semver check [#479](https://github.com/intuit/auto/pull/479) ([@zephraph](https://github.com/zephraph))

#### 📝  Documentation

- Fix links in docs [#486](https://github.com/intuit/auto/pull/486) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update README.md [#485](https://github.com/intuit/auto/pull/485) ([@RichieRunner](https://github.com/RichieRunner))

#### Authors: 3

- Justin Bennett ([@zephraph](https://github.com/zephraph))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Richie ([@RichieRunner](https://github.com/RichieRunner))

---

# v7.2.1 (Tue Jul 09 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Rework plugin importing logic [#480](https://github.com/intuit/auto/pull/480) ([@zephraph](https://github.com/zephraph))
- `@auto-it/core`
  - Fix type error with changelog hook [#478](https://github.com/intuit/auto/pull/478) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.2.0 (Thu Jul 04 2019)

#### 🚀  Enhancement

- `@auto-it/slack`
  - feat(slack): add custom slack at targets [#475](https://github.com/intuit/auto/pull/475) ([@hello-woof](https://github.com/hello-woof))

#### Authors: 1

- Zachary Sherwin ([@hello-woof](https://github.com/hello-woof))

---

# v7.1.4 (Wed Jul 03 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Add a little extra error handling around plugin loading [#474](https://github.com/intuit/auto/pull/474) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.1.3 (Sat Jun 29 2019)

#### 🐛  Bug Fix

- `@auto-it/git-tag`
  - Fix wording on Git tag plugin [#469](https://github.com/intuit/auto/pull/469) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.1.2 (Tue Jun 18 2019)

#### 🐛  Bug Fix

- `@auto-it/slack`
  - Slack Plugin: fix tag link [#464](https://github.com/intuit/auto/pull/464) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.1.1 (Mon Jun 17 2019)

#### 🐛  Bug Fix

- `@auto-it/conventional-commits`
  - Conventional Commits Plugin: fix looping issue [#461](https://github.com/intuit/auto/pull/461) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.1.0 (Fri Jun 14 2019)

#### 🚀  Enhancement

- `@auto-it/core`, `@auto-it/git-tag`
  - Git tag Plugin [#460](https://github.com/intuit/auto/pull/460) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.13 (Mon Jun 10 2019)

#### 🏠  Internal

- `@auto-it/core`, `@auto-it/upload-assets`
  - update octokit [#459](https://github.com/intuit/auto/pull/459) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.12 (Sat Jun 08 2019)

#### 📝  Documentation

- Update AutoChangeLog with Typo Fixes [#457](https://github.com/intuit/auto/pull/457) ([@jdfalko](https://github.com/jdfalko))

#### Authors: 1

- [@jdfalko](https://github.com/jdfalko)

---

# v7.0.11 (Thu Jun 06 2019)

#### 🏠  Internal

- Bump handlebars from 4.1.0 to 4.1.2 [#453](https://github.com/intuit/auto/pull/453) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 1

- [@dependabot[bot]](https://github.com/dependabot[bot])

---

# v7.0.10 (Thu Jun 06 2019)

#### 🐛  Bug Fix

- `@auto-it/npm`
  - NPM Plugin: fix canary versions [#456](https://github.com/intuit/auto/pull/456) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.9 (Thu Jun 06 2019)

#### 🏠  Internal

- Bump js-yaml from 3.12.0 to 3.13.1 [#454](https://github.com/intuit/auto/pull/454) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 1

- [@dependabot[bot]](https://github.com/dependabot[bot])

---

# v7.0.8 (Thu Jun 06 2019)

#### 🐛  Bug Fix

- `@auto-it/core`, `@auto-it/npm`
  - Independant Canary version reporting + Whitespace in pr-body [#455](https://github.com/intuit/auto/pull/455) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.7 (Thu May 30 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Changelog bugs [#452](https://github.com/intuit/auto/pull/452) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.6 (Thu May 30 2019)

#### 🐛  Bug Fix

- `@auto-it/core`, `@auto-it/jira`, `@auto-it/npm`, `@auto-it/omit-release-notes`
  - Lerna independent mode bugs [#451](https://github.com/intuit/auto/pull/451) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.5 (Thu May 30 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Respect author in config [#450](https://github.com/intuit/auto/pull/450) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- Get docs publishing [#448](https://github.com/intuit/auto/pull/448) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Update typescript-tslint-plugin to the latest version 🚀 [#447](https://github.com/intuit/auto/pull/447) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v7.0.4 (Mon May 20 2019)

#### 🐛  Bug Fix

- `@auto-it/npm`
  - stop using --canary flag in npm package [#446](https://github.com/intuit/auto/pull/446) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- Update README.md [#445](https://github.com/intuit/auto/pull/445) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.3 (Mon May 20 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - fall back to normal require for npx and global usage [#444](https://github.com/intuit/auto/pull/444) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v7.0.2 (Sun May 19 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - Remove bin entry from core [#441](https://github.com/intuit/auto/pull/441) ([@zephraph](https://github.com/zephraph))

#### 📝  Documentation

- Fix conventional commits link [#439](https://github.com/intuit/auto/pull/439) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v7.0.1 (Sat May 18 2019)

#### 🐛  Bug Fix

- `@auto-it/core`
  - fix changelog indentation [#438](https://github.com/intuit/auto/pull/438) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

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
auto.hooks.afterRelease.tap('MyPlugin', async (version, commits, releaseNotes) => {
// do something
});
```

new  `afterRelease`

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

#### 💥  Breaking Change

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

#### 🚀  Enhancement

- `@auto-it/core`, `@auto-it/omit-commits`, `@auto-it/omit-release-notes`
  - new hook: omit prs from release notes + add omit-release-notes plugin [#427](https://github.com/intuit/auto/pull/427) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/released`, `@auto-it/slack`, `@auto-it/twitter`, `@auto-it/upload-assets`
  - Add Twitter Plugin [#422](https://github.com/intuit/auto/pull/422) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/upload-assets`
  - add upload assets plugin [#421](https://github.com/intuit/auto/pull/421) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`
  - Bundle `auto` for all major platforms [#418](https://github.com/intuit/auto/pull/418) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛  Bug Fix

- add docs about omitReleaseNotes  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- run the correct command  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- start  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `auto`, `@auto-it/core`
  - fix bundling plugin issue [#435](https://github.com/intuit/auto/pull/435) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/npm`
  - Various Bug Fixes [#434](https://github.com/intuit/auto/pull/434) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`, `@auto-it/upload-assets`
  - rename ghub to github  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/omit-commits`
  - fix build  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/core`
  - fix problem where pr-body would only match after two were rendered [#431](https://github.com/intuit/auto/pull/431) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- `@auto-it/npm`
  - Parse monorepo packages outside of `packages` directory [#411](https://github.com/intuit/auto/pull/411) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update docs/pages/plugins.md

Co-Authored-By: Justin Bennett <zephraph@gmail.com>  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

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

#### 📝  Documentation

- typo [#405](https://github.com/intuit/auto/pull/405) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v6.5.0 (Fri May 10 2019)

#### 🚀  Enhancement

- Add --delete to `comment` and `pr-body` [#403](https://github.com/intuit/auto/pull/403) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.4.1 (Fri May 10 2019)

#### 🐛  Bug Fix

- fix jira PR titles without additional subject [#404](https://github.com/intuit/auto/pull/404) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- update docs for canary [#402](https://github.com/intuit/auto/pull/402) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.4.0 (Thu May 09 2019)

#### 🚀  Enhancement

- update canary to update pr body when there is a pr [#401](https://github.com/intuit/auto/pull/401) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Greenkeeper/@octokit/plugin throttling 2.5.0 [#400](https://github.com/intuit/auto/pull/400) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v6.3.5 (Thu May 09 2019)

#### 🐛  Bug Fix

- lerna no-force-publish release conflict [#399](https://github.com/intuit/auto/pull/399) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.3.4 (Thu May 09 2019)

#### 🐛  Bug Fix

- conventional-commit plugin: should omit PR merge commits when a commit in the PR has CC commit message [#395](https://github.com/intuit/auto/pull/395) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📚 Blog Post

- conventional-commits plugin blog post [#394](https://github.com/intuit/auto/pull/394) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.3.3 (Thu May 09 2019)

#### 📝  Documentation

- Fix grammar in getting started documentation [#396](https://github.com/intuit/auto/pull/396) ([@djpowers](https://github.com/djpowers))

#### Authors: 1

- Dave Powers ([@djpowers](https://github.com/djpowers))

---

# v6.3.1 (Wed May 08 2019)

#### 🐛  Bug Fix

- ensure major minor and patch get to changelog in that order [#392](https://github.com/intuit/auto/pull/392) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- add page for conventional-commits plugin [#393](https://github.com/intuit/auto/pull/393) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.3.0 (Wed May 08 2019)

#### 🚀  Enhancement

- Release notes [#380](https://github.com/intuit/auto/pull/380) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.2.6 (Wed May 08 2019)

#### ⚠️  Pushed to master

- add better logs when setting git user  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))

#### Authors: 1

- [@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com)

---

# v6.2.5 (Wed May 08 2019)

#### 📝  Documentation

- Fix typo in introduction documentation [#391](https://github.com/intuit/auto/pull/391) ([@djpowers](https://github.com/djpowers))

#### Authors: 1

- Dave Powers ([@djpowers](https://github.com/djpowers))

---

# v6.2.4 (Wed May 08 2019)

#### 🐛  Bug Fix

- remove getGitHubToken function [#386](https://github.com/intuit/auto/pull/386) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.2.3 (Wed May 08 2019)

#### 🐛  Bug Fix

- use correct variable in pr-body success message [#389](https://github.com/intuit/auto/pull/389) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.2.2 (Tue May 07 2019)

#### 🐛  Bug Fix

- must await posting to the PR body [#388](https://github.com/intuit/auto/pull/388) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.2.1 (Tue May 07 2019)

#### 🐛  Bug Fix

- split off useless hash from version [#387](https://github.com/intuit/auto/pull/387) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- update deps for things greenkeeper failed on [#385](https://github.com/intuit/auto/pull/385) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.2.0 (Tue May 07 2019)

#### 🚀  Enhancement

- Error on uncommited files when before running canary + version [#384](https://github.com/intuit/auto/pull/384) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.1.1 (Tue May 07 2019)

#### 🐛  Bug Fix

- Correct reported lerna independent version [#383](https://github.com/intuit/auto/pull/383) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.1.0 (Tue May 07 2019)

#### 🚀  Enhancement

- add `auto pr-body` to add info to pr bodies + canary posts to body instead of comment [#379](https://github.com/intuit/auto/pull/379) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.0.2 (Mon May 06 2019)

#### 🐛  Bug Fix

- report back correct versions when running canary [#378](https://github.com/intuit/auto/pull/378) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.0.1 (Mon May 06 2019)

#### 🐛  Bug Fix

- Better get by username/email error handling [#377](https://github.com/intuit/auto/pull/377) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v6.0.0 (Mon May 06 2019)

#### 💥  Breaking Change

- Restrict config type [#374](https://github.com/intuit/auto/pull/374) ([@zephraph](https://github.com/zephraph))

#### 🚀  Enhancement

- Support Lerna Independent mode [#373](https://github.com/intuit/auto/pull/373) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📚 Blog Post

- New Post: Merging PRs to other PRs [#372](https://github.com/intuit/auto/pull/372) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Justin Bennett ([@zephraph](https://github.com/zephraph))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v5.0.1 (Sat May 04 2019)

#### 🐛  Bug Fix

- shipit will publish a canary locally when not on master [#371](https://github.com/intuit/auto/pull/371) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v5.0.0 (Sat May 04 2019)

#### 💥  Breaking Change

- Calling `shipit` in PR in CI creates canary release [#351](https://github.com/intuit/auto/pull/351) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Configure base-branch + pushToMaster => pushToBaseBranch [#357](https://github.com/intuit/auto/pull/357) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

- skip releases for greenkeeper + make special changelog section [#366](https://github.com/intuit/auto/pull/366) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- add blog [#368](https://github.com/intuit/auto/pull/368) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.15.5 (Fri May 03 2019)

#### 🐛  Bug Fix

- fix bug when tying to publish canary for PR with skip-release label [#367](https://github.com/intuit/auto/pull/367) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.15.4 (Fri May 03 2019)

#### 🏠  Internal

- remove accidental log [#365](https://github.com/intuit/auto/pull/365) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update @types/node to the latest version 🚀 [#364](https://github.com/intuit/auto/pull/364) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.15.3 (Fri May 03 2019)

#### 🐛  Bug Fix

- Override any env var set in the .env [#362](https://github.com/intuit/auto/pull/362) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.15.2 (Fri May 03 2019)

#### 🐛  Bug Fix

- make logLevel available on the logger [#363](https://github.com/intuit/auto/pull/363) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.15.1 (Fri May 03 2019)

#### 📝  Documentation

- update docs [#361](https://github.com/intuit/auto/pull/361) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.15.0 (Fri May 03 2019)

#### 🚀  Enhancement

- when canary is run locally it uses the commits SHA instead of PR + Build [#360](https://github.com/intuit/auto/pull/360) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.14.1 (Fri May 03 2019)

#### 🐛  Bug Fix

- changelog includes any commit that has a PR parsed from the commit message [#359](https://github.com/intuit/auto/pull/359) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.14.0 (Thu May 02 2019)

#### 🚀  Enhancement

- enable loglevel silly for npm/lerna when in verbose or veryVerbose mode [#356](https://github.com/intuit/auto/pull/356) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.13.2 (Thu May 02 2019)

#### 🐛  Bug Fix

- increase buffer for situations when user has a LOT of unpublished work [#354](https://github.com/intuit/auto/pull/354) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.13.1 (Thu May 02 2019)



---

# v4.13.0 (Thu May 02 2019)

#### 🚀  Enhancement

- add forcePublish config option to npm plugin [#352](https://github.com/intuit/auto/pull/352) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.12.0 (Wed May 01 2019)

#### 🚀  Enhancement

- canary command [#349](https://github.com/intuit/auto/pull/349) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.11.0 (Wed May 01 2019)

#### 🚀  Enhancement

- Graphql url config [#350](https://github.com/intuit/auto/pull/350) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

- Update node-fetch to the latest version 🚀 [#347](https://github.com/intuit/auto/pull/347) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.10.0 (Wed May 01 2019)

#### 🚀  Enhancement

- comment, pr, and pr-check detect PR number in CI [#348](https://github.com/intuit/auto/pull/348) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.9.4 (Sat Apr 27 2019)

#### 🐛  Bug Fix

- Throw an error if extended config fails to load [#344](https://github.com/intuit/auto/pull/344) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v4.9.3 (Sat Apr 27 2019)

#### 🐛  Bug Fix

- fix bug when no labels exist [#343](https://github.com/intuit/auto/pull/343) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

- Update import-cwd to the latest version 🚀 [#342](https://github.com/intuit/auto/pull/342) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.9.2 (Sat Apr 27 2019)

#### 🐛  Bug Fix

- use graphql to get around search rate limits [#340](https://github.com/intuit/auto/pull/340) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

- Update node-fetch to the latest version 🚀 [#339](https://github.com/intuit/auto/pull/339) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update @types/node-fetch to the latest version 🚀 [#336](https://github.com/intuit/auto/pull/336) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.9.1 (Fri Apr 26 2019)

#### 🐛  Bug Fix

- Adjust rate limiting retries from 3 to 5 [#338](https://github.com/intuit/auto/pull/338) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v4.9.0 (Thu Apr 25 2019)

#### 🚀  Enhancement

- Add throttling, retry octokit plugins [#335](https://github.com/intuit/auto/pull/335) ([@zephraph](https://github.com/zephraph))

#### 🏠  Internal

- Update @hutson/set-npm-auth-token-for-ci to the latest version 🚀 [#330](https://github.com/intuit/auto/pull/330) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update husky to the latest version 🚀 [#333](https://github.com/intuit/auto/pull/333) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Justin Bennett ([@zephraph](https://github.com/zephraph))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.8.17 (Mon Apr 15 2019)

#### 🐛  Bug Fix

- use old addLabels praram because of bug in new one [#329](https://github.com/intuit/auto/pull/329) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.8.15 (Mon Apr 15 2019)

#### 🐛  Bug Fix

- update command line args [#328](https://github.com/intuit/auto/pull/328) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Octokit [#325](https://github.com/intuit/auto/pull/325) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🏠  Internal

- update node types [#326](https://github.com/intuit/auto/pull/326) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update ts-jest [#327](https://github.com/intuit/auto/pull/327) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update @types/node-fetch to the latest version 🚀 [#324](https://github.com/intuit/auto/pull/324) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.8.14 (Fri Apr 05 2019)

#### 🏠  Internal

- Update registry-url to the latest version 🚀 [#323](https://github.com/intuit/auto/pull/323) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update @types/semver to the latest version 🚀 [#321](https://github.com/intuit/auto/pull/321) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update @types/node to the latest version 🚀 [#320](https://github.com/intuit/auto/pull/320) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update semver to the latest version 🚀 [#315](https://github.com/intuit/auto/pull/315) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update @types/node to the latest version 🚀 [#314](https://github.com/intuit/auto/pull/314) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update cosmiconfig to the latest version 🚀 [#313](https://github.com/intuit/auto/pull/313) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update @types/node-fetch to the latest version 🚀 [#309](https://github.com/intuit/auto/pull/309) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update tslint-xo to the latest version 🚀 [#312](https://github.com/intuit/auto/pull/312) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### 📝  Documentation

- Fix issue with warning wrapping section [#322](https://github.com/intuit/auto/pull/322) ([@zephraph](https://github.com/zephraph))

#### Authors: 2

- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v4.8.13 (Wed Mar 20 2019)

#### 🐛  Bug Fix

- only add users once to changelog [#311](https://github.com/intuit/auto/pull/311) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.8.12 (Wed Mar 20 2019)

#### 🐛  Bug Fix

- last ditch search for related PRs [#310](https://github.com/intuit/auto/pull/310) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- fix typo in docs [#307](https://github.com/intuit/auto/pull/307) ([@solon](https://github.com/solon))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Brian Solon ([@solon](https://github.com/solon))

---

# v4.8.11 (Thu Mar 14 2019)

#### 🐛  Bug Fix

- Remove auth in error responses if it's present [#297](https://github.com/intuit/auto/pull/297) ([@zephraph](https://github.com/zephraph))

#### Authors: 1

- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v4.8.10 (Wed Mar 13 2019)

#### 🏠  Internal

- update deps [#306](https://github.com/intuit/auto/pull/306) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update @types/node to the latest version 🚀 [#303](https://github.com/intuit/auto/pull/303) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### 📝  Documentation

- fixing a typo [#302](https://github.com/intuit/auto/pull/302) ([@GGonryun](https://github.com/GGonryun))

#### Authors: 3

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])
- Miguel Campos ([@GGonryun](https://github.com/GGonryun))

---

# v4.8.9 (Mon Mar 04 2019)

#### 🏠  Internal

- update deps [#300](https://github.com/intuit/auto/pull/300) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update tslint-xo to the latest version 🚀 [#298](https://github.com/intuit/auto/pull/298) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update ts-jest to the latest version 🚀 [#295](https://github.com/intuit/auto/pull/295) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))
- Update cosmiconfig to the latest version 🚀 [#294](https://github.com/intuit/auto/pull/294) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.8.8 (Fri Feb 15 2019)

#### 🐛  Bug Fix

- Fix the formatting for slack messages [#292](https://github.com/intuit/auto/pull/292) ([@adierkens](https://github.com/adierkens))

#### Authors: 1

- Adam Dierkens ([@adierkens](https://github.com/adierkens))

---

# v4.8.7 (Fri Feb 15 2019)

#### 🐛  Bug Fix

- Fix Promise issue when creating changelog [#293](https://github.com/intuit/auto/pull/293) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.8.6 (Wed Feb 13 2019)

#### 🐛  Bug Fix

- check if released label has already been added [#290](https://github.com/intuit/auto/pull/290) (hipstersmoothie@users.noreply.github.com)

#### Authors: 1

- hipstersmoothie@users.noreply.github.com

---

# v4.8.5 (Wed Feb 13 2019)

#### 🐛  Bug Fix

- released plugin respects dry run flag [#289](https://github.com/intuit/auto/pull/289) (hipstersmoothie@users.noreply.github.com)

#### Authors: 1

- hipstersmoothie@users.noreply.github.com

---

# v4.8.4 (Wed Feb 13 2019)

#### 🐛  Bug Fix

- ShipIt - Get Slack URL from config [#288](https://github.com/intuit/auto/pull/288) (hipstersmoothie@users.noreply.github.com)

#### 🏠  Internal

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

#### 🏠  Internal

- Update all-contributors-cli to the latest version 🚀 [#284](https://github.com/intuit/auto/pull/284) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 1

- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.8.2 (Wed Feb 06 2019)

#### 🐛  Bug Fix

- Update @types/jest to the latest version 🚀 [#282](https://github.com/intuit/auto/pull/282) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]))

#### Authors: 1

- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])

---

# v4.8.1 (Thu Jan 31 2019)

#### 🐛  Bug Fix

- ensure that setRcToken is respected [#279](https://github.com/intuit/auto/pull/279) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.8.0 (Thu Jan 31 2019)

#### 🚀  Enhancement

- NPM Plugin: Allow user to turn off setting RC token [#278](https://github.com/intuit/auto/pull/278) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.5 (Wed Jan 30 2019)

#### 🐛  Bug Fix

- run git status in verbose mode for lerna [#277](https://github.com/intuit/auto/pull/277) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.4 (Wed Jan 30 2019)

#### 🐛  Bug Fix

- add more logging for lerna debugging [#276](https://github.com/intuit/auto/pull/276) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.3 (Tue Jan 29 2019)

#### 🐛  Bug Fix

- don't run commmit hooks. match npm version bahvior [#275](https://github.com/intuit/auto/pull/275) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.2 (Mon Jan 28 2019)

#### 🐛  Bug Fix

- can't warn here or else `version` will fail [#274](https://github.com/intuit/auto/pull/274) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.1 (Sat Jan 26 2019)

#### 🐛  Bug Fix

- Update dependencies to enable Greenkeeper 🌴 [#273](https://github.com/intuit/auto/pull/273) ([@greenkeeper[bot]](https://github.com/greenkeeper[bot]) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- [@greenkeeper[bot]](https://github.com/greenkeeper[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.7.0 (Fri Jan 25 2019)

#### 🚀  Enhancement

- `create-labels` update labels when the exist [#272](https://github.com/intuit/auto/pull/272) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.6.0 (Fri Jan 25 2019)

#### 🚀  Enhancement

- modifyConfig hook [#270](https://github.com/intuit/auto/pull/270) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.5.3 (Fri Jan 25 2019)

#### 🐛  Bug Fix

- Custom labels still resolve changelog titles [#269](https://github.com/intuit/auto/pull/269) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.5.2 (Fri Jan 25 2019)

#### 🐛  Bug Fix

- pushes to master should only include title in changelog [#267](https://github.com/intuit/auto/pull/267) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.5.1 (Fri Jan 25 2019)

#### 🐛  Bug Fix

- add addLabel enterprise compat [#265](https://github.com/intuit/auto/pull/265) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.5.0 (Fri Jan 25 2019)

#### 🚀  Enhancement

- afterRelease hook [#264](https://github.com/intuit/auto/pull/264) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.4.4 (Fri Jan 25 2019)

#### 🏠  Internal

- remove .only [#261](https://github.com/intuit/auto/pull/261) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.4.3 (Fri Jan 25 2019)

#### 🐛  Bug Fix

- load extends config from path [#260](https://github.com/intuit/auto/pull/260) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.4.2 (Fri Jan 25 2019)

#### 🐛  Bug Fix

- release plugin: do nothing when skip-release present [#259](https://github.com/intuit/auto/pull/259) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.4.1 (Thu Jan 24 2019)

#### 🐛  Bug Fix

- Better config debug [#257](https://github.com/intuit/auto/pull/257) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 📝  Documentation

- Add clarity to a few of the docs [#255](https://github.com/intuit/auto/pull/255) ([@zephraph](https://github.com/zephraph))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Justin Bennett ([@zephraph](https://github.com/zephraph))

---

# v4.4.0 (Thu Jan 24 2019)

#### 🚀  Enhancement

- Released plugin: add released label to issue too [#253](https://github.com/intuit/auto/pull/253) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.3.0 (Thu Jan 24 2019)

#### 🚀  Enhancement

- Released Plugin: lock merged issues [#252](https://github.com/intuit/auto/pull/252) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.2.2 (Thu Jan 24 2019)

#### 🐛  Bug Fix

- Released Plugin: add context to comments so they don't override other comments [#251](https://github.com/intuit/auto/pull/251) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v4.2.1 (Thu Jan 24 2019)

#### ⚠️  Pushed to master

- quick rename  ([@lisowski54@gmail.com](https://github.com/lisowski54@gmail.com))

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
