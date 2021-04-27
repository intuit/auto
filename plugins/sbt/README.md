# sbt plugin

Publish Scala projects with sbt

> :warning: only sbt 1.4+ is supported at the moment because this plugin uses `sbt --client` functionality

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/sbt
# or
yarn add -D @auto-it/sbt
```

## Usage

```json
{
  "plugins": [
    "sbt"
  ]
}
```

It is strongly recommended to use an sbt plugin to manage the version. There are a few options, but the most reliable and well maintained is [sbt-dynver](https://github.com/dwijnand/sbt-dynver). To enable it in your project add this line to `project/plugins.sbt`:

```scala
addSbtPlugin("com.dwijnand" % "sbt-dynver" % "x.y.z")
```

and then, depending on the publishing repository (e.g. if you are publishing to Sonatype Nexus), you might want to add

```scala
ThisBuild / dynverSeparator := "-"
ThisBuild / dynverSonatypeSnapshots := true
```

to your `build.sbt`.

With this setup canary versions will look like this: `{last_tag}-{number_of_commits}-{commit_sha}-SNAPSHOT`, for example:

```
0.1.2-5-fcdf268c-SNAPSHOT
```

## Options

### `manageVersion: boolean` (default: `false`)

If you don't want to use an sbt plugin for version management, you can let Auto manage the version:

```json
{
  "plugins": [
    [
      "sbt",
      {
        "manageVersion": true
      }
    ]
  ]
}
```

With this option Auto will override the version in sbt during the release process.

Canary versions will look like this: `{last_tag}-canary.{pr_number}.{build_number}-SNAPSHOT`, for example:

```
0.1.2-canary.47.5fa1736-SNAPSHOT
```

Here build number is the git commit SHA.

### `publishCommand: string` (default: `publish`)

If you need to run some custom publishing command, you can change this option. For example, to cross-publish a library:

```json
{
  "plugins": [
    [
      "sbt",
      {
        "publishCommand": "+publish"
      }
    ]
  ]
}
```
