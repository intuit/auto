# Gradle Plugin

Release a Java project using [gradle](https://gradle.org/).

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @auto-it/gradle
# or
yarn add -D @auto-it/gradle
```

## Usage

```jsonc
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

This plugin uses the (gradle release plugin)[https://github.com/researchgate/gradle-release] to update the version. Make sure the the latest `gradle-release-plugin` is in your `build.gradle`.

```groovy
plugins {
  id 'net.researchgate.release' version '2.6.0' // gradle release plugin
}
```

It will also call the `publish` task with the release version, if configured in your project.
