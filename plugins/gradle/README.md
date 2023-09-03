# Gradle Plugin

Release a Java project using [gradle](https://gradle.org/).

- supports both `-snapshot` and `-snapshot`-less versioning

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/gradle
# or
yarn add -D @auto-it/gradle
```

> WARNING: You can only use one "package manager" at a time!
> Mixing them will lead to undesired results.

## Usage

```json
{
  "plugins": [
    [
      "gradle",
      {
        // An optional gradle binary cmd/path relative to your project
        // @default /usr/bin/gradle
        "gradleCommand": "./gradlew",

        // An optional gradle argument list -- IE any gradle option allowed for the version
        // of gradle you're using
        // @default []
        "gradleOptions": ["-P someProp=someVal"]
      }
    ]
    // other plugins
  ]
}
```

## Gradle Project Configuration

This plugin uses the [gradle release plugin](https://github.com/researchgate/gradle-release) to update the version. Make sure the the latest `gradle-release-plugin` is in your `build.gradle`.

```groovy
plugins {
  id 'net.researchgate.release' version '2.6.0' // gradle release plugin
}
```

### Publish

This plugin will also call the `publish` task with the release version, if configured in your project.

### Configure `snapshotSuffix`

This plugin will use the `snapshotSuffix` in `gradle.properties` or `build.gradle` if configured.

### Build After Version Bump Automatically

This plugin will run a release build to create release artifacts.
