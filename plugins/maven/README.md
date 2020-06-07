# Maven Plugin

Release a Java project to a [maven](https://maven.apache.org/) repository.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bashell script
npm i --save-dev @auto-it/maven
# or
yarn add -D @auto-it/maven
```

## Usage

```jsonc
{
  "plugins": [
    [
      "maven",
      {
        // An optional maven binary cmd/path
        // @default /usr/bin/mvn
        "mavenCommand": "mvn",

        // An optional maven argument list - e.g. any maven option allowed for the version
        // of maven you're using
        // @default []
        "mavenOptions": ["-DskipTests", "-P some-profile"],

        // An optional set of goals to execute for release
        // @default ["deploy", "site-deploy"]
        "mavenReleaseGoals": ["deploy"],

        // An optional path to a maven settings.xml file
        // @default ""
        "mavenSettings": "./.github/maven/settings.xml"
      }
    ]
    // other plugins
  ]
}
```

## Environment Variables

| Name                  | Description                                                                  | Default value               |
| --------------------- | ---------------------------------------------------------------------------- | --------------------------- |
| `MAVEN_COMMAND`       | The Maven command to use.                                                    | `/usr/bin/mvn`              |
| `MAVEN_OPTIONS`       | A list of maven command customizations to pass to maven.                     | `null`                      |
| `MAVEN_RELEASE_GOALS` | A list of maven goals to pass to maven for release.                          | `["deploy", "site-deploy"]` |
| `MAVEN_SETTINGS`      | The maven `settings.xml` file used by maven.                                 | `null`                      |
| `MAVEN_USERNAME`      | (DEPRECATED IN 9.38.0 ) The deploy username used to login to the repository. | `null`                      |
| `MAVEN_PASSWORD`      | (DEPRECATED IN 9.38.0 ) The deploy password used to login to the repository. | `null`                      |

## Maven Project Configuration

You will need all the following configuration blocks for all parts of `auto` to function:

1. Author

```xml
<developers>
 <developer>
   <name>Andrew Lisowski</name>
   <email>test@email.com</email>
 </developer>
</developers>
```

2. SCM

```xml
<scm>
 <connection>scm:git:https://${env.GH_USER}:${env.GH_TOKEN}@github.com/Fuego-Tools/java-test-project.git</connection>
 <developerConnection>scm:git:https://${env.GH_USER}:${env.GH_TOKEN}@github.com/Fuego-Tools/java-test-project.git</developerConnection>
 <url>https://github.com/Fuego-Tools/java-test-project</url>
 <tag>HEAD</tag>
</scm>
```

> :warning: Don't forget to set enviornment variables `GH_USER`, `GH_TOKEN`

3. Version

```xml
<version>1.0.0-SNAPSHOT</version>
```
