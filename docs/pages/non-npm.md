# Non-npm Usage

`auto` by default works with [npm](https://npmjs.com) but you can configure it to work with a variety of package management platforms.

## Installation

If you're on some platform other than [npm](https://npmjs.com) it doesn't make sense to download `auto` through [npm](https://npmjs.com). For these situations we package `auto` for all major operating systems (`linux`, `osx`, `windows`).

Simply download the appropriate executable for you operating system and make it executable.

```sh
# Download a platform specific version of auto. All official plugins included.
curl -vkL -o - https://github.com/intuit/auto/releases/download/v7.2.0/auto-linux.gz | gunzip > ~/linux-auto
# Make auto executable
chmod a+x ~/linux-auto
```

## Configuration

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
