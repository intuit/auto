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
