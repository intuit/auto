# Writing a Publishing Plugin

The main use for plugins is to automate your release process.
This page will walk you through implementing the `git-tag` plugin.

> It is recommended that you use TypeScript for the best development experience.
> `auto` is written in TypeScript and has extensive jsDoc comments throughout the code.
> To make the following code work without compilation, just remove the types!

## Setup

First create a file for your plugins.

> Make sure to set the name! It must be consistent with your packages name.

**`my-plugin.ts`:**

```ts
import { Auto, IPlugin } from "@auto-it/core";

export default class GitTagPlugin implements IPlugin {
  /** The name of the plugin */
  name = "my-git-tag";

  /** Tap into auto plugin points. */
  apply(auto: Auto) {}
}
```

## Tap Required Hooks

Plugins work by "hooking" into various parts of `auto` to control or add to its behavior.
The following hooks you must implement to get a publishing plugin working.

### `getPreviousVersion`

This plugin will manage the version of the project solely using the tag.
Set up this hook to tell `auto` the last release version of your project

```ts
export default class GitTagPlugin implements IPlugin {
  // ...
  apply(auto: Auto) {
    /** Get the latest tag in the repo, if none then the first commit */
    async function getTag() {
      try {
        return await auto.git!.getLatestTagInBranch();
      } catch (error) {
        return auto.prefixRelease("0.0.0");
      }
    }

    auto.hooks.getPreviousVersion.tapPromise(this.name, getTag);
  }
}
```

### `version`

In this hook you should increment the version of your project, tag it, and if necessary commit a file (ex: `package.json`).

```ts
import { inc, ReleaseType } from "semver";

export default class GitTagPlugin implements IPlugin {
  // ...
  apply(auto: Auto) {
    // ...
    auto.hooks.version.tapPromise(this.name, async (version) => {
      const lastTag = await getTag();
      const newTag = inc(lastTag, version as ReleaseType);

      if (!newTag) {
        auto.logger.log.info("No release found, doing nothing");
        return;
      }

      const prefixedTag = auto.prefixRelease(newTag);

      auto.logger.log.info(`Tagging new tag: ${lastTag} => ${prefixedTag}`);
      await execPromise("git", [
        "tag",
        prefixedTag,
        "-m",
        `"Update version to ${prefixedTag}"`,
      ]);
    });
  }
}
```

### `publish`

Finally publish your new version to a package management platform and push the new tag to GitHub.
In the case of the `git-tag` plugin pushing the tag to GitHub is the only thing we need to do.

```ts
export default class GitTagPlugin implements IPlugin {
  // ...
  apply(auto: Auto) {
    // ...
    auto.hooks.publish.tapPromise(this.name, async () => {
      auto.logger.log.info("Pushing new tag to GitHub");

      await execPromise("git", [
        "push",
        "--follow-tags",
        "--set-upstream",
        auto.remote,
        getCurrentBranch() || auto.baseBranch,
      ]);
    });
  }
}
```

---

Once you have the above hooks implemented you should be able to successfully use `auto` to publish a release!

The above plugins is pretty simple and there are a bunch of features you can add to your plugin through hooks or functions that `auto` exports.

## Adding Options

Most plugins will find the need to some some options from the user.
The constructor of the plugin gets access to the options passed in the `.autorc`.

```ts
import { Auto, IPlugin } from "@auto-it/core";

interface IGitTagPluginOptions {
  someOption?: boolean;
}

export default class GitTagPlugin implements IPlugin {
  /** The name of the plugin */
  name = "my-git-tag";

  /** The options of the plugin */
  readonly options: IGitTagPluginOptions;

  /** Initialize the plugin with it's options */
  constructor(options: IGitTagPluginOptions) {
    this.options = options;
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    console.log(this.options.someOption);
  }
}
```

### Validation

To get validate of the options passed to plugins, `auto` uses [io-ts](https://github.com/gcanti/io-ts) and exports a utility function to validate the structured produced by `io-ts`.
It lets you defined your interfaces in JavaScript and easily convert them to TypeScript.
This means it's super simple to have type-safe code and runtime validation checking!

First install the following:

```sh
npm i --save io-ts fp-ts
# or
yarn add io-ts fp-ts
```

Then convert your options interface to the equivalent `io-ts` structure.

```ts
import * as t from "io-ts";

const pluginOptions = t.partial({
  someOption: t.boolean,
});

export type IGitTagPluginOptions = t.TypeOf<typeof pluginOptions>;
```

Then tap into the `validateConfig` hook and use the `validatePluginConfiguration` utility.

```ts
import { validatePluginConfiguration } from "@auto-it/core";

export default class GitTagPlugin implements IPlugin {
  // ...
  apply(auto: Auto) {
    auto.hooks.validateConfig.tapPromise(this.name, async (name, options) => {
      if (name === this.name || name === `@auto-it/${this.name}`) {
        return validatePluginConfiguration(this.name, pluginOptions, options);
      }
    });
  }
}
```

And that's it!
Now `auto` will validate your plugins configuration before running.

## Advanced Release Hooks

### `canary`

This hook enables `canary` releases for your projects.
A `canary` version is a test version you publish for PRs or to test changes.

Your package management platform needs to support a few things for canaries to be possible

1. Separate Releases Lines - you should be able to publish to a release line that doesn't effect your main users (ex: when installing for the first time they should never get a `canary`)
2. Lots of releases - it must support a lot of releases, especially if you make a bunch of PRs

[Read more about the `canary` hook.](./hook-api-docs.md#canary)

### `next`

This hook enables `next` releases for your projects.
A `next` release is the next version of your project.
Think of it like an `alpha` or `beta` release line.

Like the `canary` hook your package management platform must support separate release lines.

[Read more about the `next` hook.](./hook-api-docs.md#next)

## Other Useful Hooks

These hooks are not required for publishing plugins, but can really improve the developer experience of it.

### beforeRun

Happens before anything is done.
This is a great place to check for platform specific secrets such as a npm token.

```ts
export default class GitTagPlugin implements IPlugin {
  // ...
  apply(auto: Auto) {
    auto.hooks.beforeRun.tap(this.name, () => {
      // Use the `checkEnv` function to warn about missing ENV variables
      auto.checkEnv(this.name, "CLIENT_ID");
    });
  }
}
```

### getAuthor

Get git author to commit with.
Typically from a package distribution description file.

```ts
auto.hooks.getAuthor.tapPromise("NPM", async () => {
  const { author } = JSON.parse(await readFile("package.json", "utf-8"));

  if (author) {
    return author;
  }
});
```

### getRepository

Get owner and repository for the project to automate releases for.
Typically from a package distribution description file.
Falls back to global `git config` author.

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
