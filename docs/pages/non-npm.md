# Non-npm Usage

`auto` by distributed through [npm](https://npmjs.com) but you can use it with a variety of package management platforms.

## Installation

If you're on some platform other than [npm](https://npmjs.com) it doesn't make sense to download `auto` through [npm](https://npmjs.com). For these situations we package `auto` for all major operating systems (`linux`, `osx`, `windows`).

Simply download the appropriate version for your operating system and make it executable.

```sh
# Download a platform specific version of auto
curl -vkL -o - https://github.com/intuit/auto/releases/download/v7.2.0/auto-linux.gz | gunzip > ~/auto
# Make auto executable
chmod a+x ~/auto
```

This executable contains all of the official `auto` plugins so you do not have to download anything extra. This version of `auto` uses the [git-tag](../../plugins/git-tag/README.md) plugins as the default instead of [npm](../../plugins/npm/README.md). If you specify any plugins this will be overriden.

### Installation via brew (OSX)

If you are on OSX you can install `auto` with brew.

```sh
brew tap intuit/auto https://github.com/intuit/auto
brew install auto
```

## Configuration

To configure `auto` to work with your project you will need to do two things

1. Create and configure a [`GH_TOKEN`](https://github.com/settings/tokens) environment variable
2. Create an `.autorc` for your project

### Making an `.autorc`

Using `auto` with any other package manager than [npm](https://npmjs.com) requires that you create an [`.autorc`](./autorc.md) at the root of your project.

1. `.autorc` - No plugins, `shipit` doesn't work. Enables [advanced setup](https://intuit.github.io/auto/pages/getting-started.html#detailed-setup)

   ```json
   {
     "repo": "my-project",
     "owner": "hipstersmoothie",
     "name": "Andrew Lisowski",
     "email": "lisowski54@gmail.com",
     "plugins": []
   }
   ```

2. `.autorc` - `git-tag` plugin compatible with any platform. Enables [`shipit` usage](https://intuit.github.io/auto/pages/generated/shipit.html)

   ```json
   {
     "repo": "my-project",
     "owner": "hipstersmoothie",
     "name": "Andrew Lisowski",
     "email": "lisowski54@gmail.com",
     "plugins": ["git-tag"]
   }
   ```

3. `.autorc` - With package manager plugin. [`shipit`](https://intuit.github.io/auto/pages/generated/shipit.html) works, some configuration picked up from package manager package definition files. In the following `repo`, `owner`, `name`, and `email` are picked up from the `pom.xml`

   ```json
   {
     "plugins": ["maven"]
   }
   ```

## Usage

Now that you have `auto` all set up you can use all of it's commands!

```sh
~/auto shipit
```

::: message is-info
ℹ️ Tip: Using `auto` locally with an `.env` file is a great experience. See how [here](./getting-started.md#local-.env).
:::
