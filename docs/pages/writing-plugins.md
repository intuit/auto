# Writing Plugins

If you've ever written a webpack plugin it's a lot like that.

A plugin definition is:

- a class the has an `apply` function where a plugin hooks into various functions in auto (REQUIRED)
- a constructor where you can load plugin specific config

```ts
import { Auto, IPlugin } from 'auto';

export default class TestPlugin implements IPlugin {
  private readonly config: any;

  constructor(config: any) {
    this.config = config;
  }

  apply(auto: Auto) {
    // hook into auto
  }
}
```

Or in JavaScript:

```js
module.exports = class TestPlugin {
  constructor(config) {
    this.config = config;
  }

  /**
   * Setup the plugin
   * @param {import('@auto-it/core').default} auto
   */
  apply(auto) {
    // hook into auto
  }
};
```

## Constructor

In the constructor you have access to any plugin specific config provided in the `.autorc`. It might be useful to write a more type-safe interface for your config.

```ts
import { Auto, IPlugin } from 'auto';

interface ITestPluginConfig {
  foo?: string;
  bar?: boolean;
}

export default class TestPlugin implements IPlugin {
  private readonly config: ITestPluginConfig;

  constructor(config: ITestPluginConfig) {
    this.config = config;
  }
}
```

## Hooks

Plugins work by hooking into various actions that `auto` has to do in order to facilitate a release or interact with your GitHub repo. The hooks that it exposes are:

---

### Main Hooks

#### beforeRun

Happens before anything is done. This is a great place to check for platform specific secrets such as a npm token.

```ts
auto.hooks.beforeRun.tapPromise('NPM', async config => {
  if (!process.env.NPM_TOKEN) {
    auto.logger.log.warn('NPM Token is needed for the NPM plugin!');
  }
});
```

#### modifyConfig

Modify what is in the config. You must return the config in this hook.

```ts
auto.hooks.modifyConfig.tap('test', config => {
  config.labels.released = {
    name: 'released',
    description: 'This issue/pull request has been released'
  };

  return config;
});
```

#### beforeShipIt

Happens before `shipit` is run. This is a great way to throw an error if a token or key is not present.

```ts
auto.hooks.beforeRun.tapPromise('NPM', async config => {
  if (!process.env.NPM_TOKEN) {
    throw new Error('NPM Token is needed for the NPM plugin!');
  }
});
```

#### beforeCommitChangelog

Ran before the `changelog` command commits the new release notes to `CHANGELOG.md`.
Useful for modifying the changelog as a whole or creating extra `changelog` files. These files can be apart of the commit that updates the changelog.

- bump - the semver bump
- commits - the commits in the changelog
- currentVersion - version that was just released
- lastRelease - the version before the current version
- releaseNotes - generated release notes for the release

```ts
auto.hooks.beforeCommitChangelog.tap(
  'MyPlugin',
  async ({ currentVersion, commits, releaseNotes, lastRelease }) => {
    // do something
  }
);
```

#### afterAddToChangelog

Ran after the `changelog` command adds the new release notes to `CHANGELOG.md`.
Useful for getting extra commits into a release before publishing.

- bump - the semver bump
- commits - the commits in the changelog
- currentVersion - version that was just released
- lastRelease - the version before the current version
- releaseNotes - generated release notes for the release

```ts
auto.hooks.afterAddToChangelog.tap(
  'MyPlugin',
  async ({ currentVersion, commits, releaseNotes, lastRelease }) => {
    // do something
  }
);
```

#### afterRelease

Ran after the `release` command has run. This async hooks gets the following arguments:

- lastVersion - the version that existed prior to the current release
- nextVersion - version that was just released
- commits - the commits in the release
- releaseNotes - generated release notes for the release
- response - the response returned from making the release

```ts
auto.hooks.afterRelease.tap(
  'MyPlugin',
  async ({ lastVersion, nextVersion, commits, releaseNotes, response }) => {
    // do something
  }
);
```

#### afterShipIt

Ran after the `shipit` command has run.

- `newVersion` - The new version that was release
- `commits` - the commits in the release
- `data`
  - `context` - The type of release that was created (`latest`, `next`, `canary`, or `old`)

```ts
auto.hooks.afterShipIt.tap(
  'MyPlugin',
  async (newVersion, commits, { context }) => {
    // do something
  }
);
```

#### getAuthor

Get git author. Typically from a package distribution description file.

```ts
auto.hooks.getAuthor.tapPromise('NPM', async () => {
  const { author } = JSON.parse(await readFile('package.json', 'utf-8'));

  if (author) {
    return author;
  }
});
```

#### getPreviousVersion

Get the previous version. Typically from a package distribution description file.

```ts
auto.hooks.getPreviousVersion.tapPromise('NPM', async () => {
  const { version } = JSON.parse(await readFile('package.json', 'utf-8'));

  if (version) {
    return auto.prefixRelease(
      JSON.parse(await readFile('package.json', 'utf-8')).version
    );
  }
});
```

#### getRepository

Get owner and repository. Typically from a package distribution description file.

```ts
auto.hooks.getRepository.tapPromise('NPM', async () => {
  const owner = // get the owner from package.json
  const repo = // get the repo from package.json

  return {
    owner,
    repo
  }
});
```

#### onCreateRelease

Tap into the things the Release class makes. This isn't the same as `auto release`, but the main class that does most of the work.

Available hooks:

- onCreateLogParse (detailed [below]())
- onCreateChangelog (detailed [below]())

```ts
this.hooks.onCreateRelease.tap('MyPlugin', release => {
  release.hooks.onCreateLogParse.tap('Change log parseing', logParse =>
    // extend logParse
  );

  release.hooks.onCreateChangelog.tap(
    'Change changelog',
    changelog => {
      // extend changelog
    }
  );
});
```

#### onCreateChangelog

This is where you hook into the changelog's hooks. See usage [below](#changelog-hooks). This hook is exposed for convenience on during `this.hooks.onCreateRelease` and at the root `this.hooks`

#### onCreateLogParse

This is where you hook into the LogParse's hooks. See usage [below](#logparse-hooks). This hook is exposed for convenience on during `this.hooks.onCreateRelease` and at the root `this.hooks`

#### version

Version the package. This is a good opportunity to `git tag` the release also. Here `npm` does it for us.

```ts
auto.hooks.version.tapPromise('NPM', async (version: SEMVER) => {
  await execPromise('npm', [
    'version',
    version,
    '-m',
    'Bump version to: %s [skip ci]'
  ]);
});
```

#### afterVersion

Ran after the package has been versioned.

#### publish

Publish the package to some package distributor. You must push the tags to github!

```ts
auto.hooks.publish.tapPromise('NPM', async (version: SEMVER) => {
  await execPromise('npm', [
    'version',
    version,
    '-m',
    'Bump version to: %s [skip ci]'
  ]);
  await execPromise('npm', ['publish']);
  await execPromise('git', [
    'push',
    '--follow-tags',
    '--set-upstream',
    'origin',
    '$branch'
  ]);
});
```

#### afterPublish

Ran after the package has been published.

---

#### canary

Used to publish a canary release. In this hook you get the semver bump and the unique canary postfix ID.

```ts
auto.hooks.canary.tapPromise(this.name, async (version, postFix) => {
  const lastRelease = await auto.git!.getLatestRelease();
  const current = await auto.getCurrentVersion(lastRelease);
  const nextVersion = inc(current, version as ReleaseType);
  const isScopedPackage = name.match(/@\S+\/\S+/);
  const canaryVersion = `${nextVersion}-canary${postFix}`;

  await execPromise('npm', ['version', canaryVersion, '--no-git-tag-version']);
  await execPromise('npm', ['publish', '--tag', 'canary']);

  auto.logger.verbose.info('Successfully published canary version');
  return canaryVersion;
});
```

### Changelog Hooks

#### addToBody

Add extra content to your changelogs.
This hook provide all the current "extra" notes and all of the commits for the changelog.
You must return the notes array.

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

#### renderChangelogLine

Change how the changelog renders lines. This hook provides the commit and the current state of the line render. You must return the commit and the line string state as a tuple ([commit, line]).

The following plugin would change all the bullet points in the changelog to star emojis.

```ts
auto.hooks.onCreateChangelog.tapPromise('Stars', changelog =>
  changelog.hooks.renderChangelogLine.tapPromise(
    'Stars',
    async (commit, line) =>
      [commit, `${line.replace('-', ':star:')}\n`]
  );
);
```

#### renderChangelogTitle

Change how the changelog renders titles. The hook provides the current label for the section and all the configured changelog titles.

```ts
auto.hooks.onCreateChangelog.tapPromise('Stars', changelog =>
  changelog.hooks.renderChangelogTitle.tap(
    'My Titles',
    (label, changelogTitles) => `:heart: ${changelogTitles[label]} :heart:`
  );
);
```

#### renderChangelogAuthor

Change how the changelog renders authors. This is both the author on each commit note and the user in the author section (the part between parentheses). This is generally a link to some profile.

```ts
auto.hooks.onCreateChangelog.tapPromise('Stars', changelog =>
  changelog.hooks.renderChangelogAuthor.tap(
    'test',
    (author, commit) => `:heart: ${author.name}/${commit.authorEmail} :heart:`
  );
);
```

#### renderChangelogAuthorLine

Change how the changelog renders authors in the authors section. The hook provides the author object and the user created with `renderChangelogAuthor`. Here is where you might display extra info about the author, such as their full name.

```ts
auto.hooks.onCreateChangelog.tapPromise('Stars', changelog =>
  changelog.hooks.renderChangelogAuthorLine.tap(
    'test',
    (author, user) => `:shipit: ${author.name} (${user})\n`
  );
);
```

#### createChangelogTitle

Control the titles in the `CHANGELOG.md`

```ts
// Render only the date in the title
auto.hooks.onCreateRelease.tap(this.name, release => {
  release.hooks.createChangelogTitle.tap(
    `${this.name} - lerna independent`,
    () => ''
  );
});
```

---

#### omitReleaseNotes

Control what commits effect the additional release notes section.

```ts
auto.hooks.onCreateChangelog.tap(this.name, changelog => {
  changelog.hooks.omitReleaseNotes.tap(this.name, commit =>
    commit.subject.includes('WIP')
  );
});
```

---

### LogParse Hooks

#### parseCommit

Parse information about a commit from a commit. Here is where `auto` gets the PR number from the merge commits.

```ts
auto.hooks.onCreateLogParse.tapPromise('Stars', logParse =>
  logParse.hooks.parseCommit.tap(
    'test',
    (commit) => {
      const bump = getBump(commit.subject, logParse.options.versionLabels);
      commit.labels = [bump]
      return commit;
    }
  );
);
```

#### omitCommit

Choose to omit certain commits. If you return true the commit will be omitted. Be sure to return nothing if you don't want the commit omitted.

```ts
auto.hooks.onCreateLogParse.tapPromise('Stars', changelog =>
  changelog.hooks.omitCommit.tap(
    'test',
    (commit) => {
      if (someTest(commit.subject)) {
        return true;
      }
    }
  );
);
```

## Example Plugin - NPM (simple)

To create a plugin simply make a class with an `apply` method and tap into the hooks you need.

```ts
import * as fs from 'fs';
import { promisify } from 'util';

import { IAutoHooks, Auto, SEMVER, execPromise } from 'auto';
import getConfigFromPackageJson from './package-config';

const readFile = promisify(fs.readFile);

export default class NPMPlugin {
  public apply(auto: Auto) {
    auto.hooks.getAuthor.tapPromise('NPM', async () => {
      const { author } = JSON.parse(await readFile('package.json', 'utf-8'));

      if (author) {
        auto.logger.log.info('NPM: Got author information from package.json');
        return author;
      }
    });

    auto.hooks.getPreviousVersion.tapPromise('NPM', async () => {
      const { version } = JSON.parse(await readFile('package.json', 'utf-8'));

      auto.logger.log.info(
        'NPM: Got previous version from package.json - ',
        version
      );

      if (version) {
        return auto.prefixRelease(
          JSON.parse(await readFile('package.json', 'utf-8')).version
        );
      }
    });

    auto.hooks.getRepository.tapPromise('NPM', async () => {
      auto.logger.log.info('NPM: getting repo information from package.json');
      return getConfigFromPackageJson();
    });

    auto.hooks.publish.tapPromise('NPM', async (version: SEMVER) => {
      await execPromise('npm', [
        'version',
        version,
        '-m',
        'Bump version to: %s [skip ci]'
      ]);
      await execPromise('npm', ['publish']);
      await execPromise('git', [
        'push',
        '--follow-tags',
        '--set-upstream',
        'origin',
        '$branch'
      ]);
    });
  }
}
```
