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

        // An optional properties file where shared properties can be read/written from.to.
        // @default ./gradle.properties
        "gradlePropertiesFile": "./gradle.properties",

        // An optional properties file where the version can be read/written from.to.
        // @default ${gradlePropertiesFile}
        "versionFile": "./gradle.properties",

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

Your project must be using the gradle release plugin. Make sure the the latest `gradle-release-plugin` is in your `build.gradle`.

```groovy
import java.util.regex.Matcher

plugins {
  id "org.sonarqube" version "2.7.1"
  id 'net.researchgate.release' version '2.6.0' // gradle release plugin
}

task build {}
build.dependsOn('app:build')
build.dependsOn('app:assembleRelease')

release {
    failOnCommitNeeded = false
    buildTasks = ['build']
    versionPatterns = [
        /(\d+)([^\d]*$)/: { Matcher m, Project p -> m.replaceAll("${(m[0][1] as int) + 1}${m[0][2]}")}
    ]
....
```

You will also need all of the following configuration blocks for all parts of `auto` to function:

1. Version defined inside `gradlePropertiesFile` or `versionFile`

```java-properties
version=1.0.0
```
