# Maven Plugin

Release a Java project to a [maven](https://maven.apache.org/) instance.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bashell script
npm i --save-dev @auto-it/maven
# or
yarn add -D @auto-it/maven
```

## Usage

```json
{
  "plugins": ["maven"]
}
```

## Environment Variables

| Name                    | Description                                                                                      | Default value  |
| ----------------------- | ------------------------------------------------------------------------------------------------ | -------------- |
| `MAVEN_USERNAME`        | The deploy username used to login to the repository.                                             | `null`         |
| `MAVEN_PASSWORD`        | The deploy password used to login to the repository.                                             | `null`         |
| `MAVEN_SETTINGS`        | The maven `settings.xml` file used by maven.                                                     | `null`         |
| `MAVEN_SNAPSHOT_BRANCH` | The branch on which the `SNAPSHOT` version lives. Must be different than the Auto "base branch." | `dev-snapshot` |

## Maven Project Configuration

Your project must be using the maven release plugin. Make sure the the latest `maven-release-plugin` is in your `pom.xml`.

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-release-plugin</artifactId>
  <version>3.0.0-M1</version>
  <configuration>
    <preparationGoals>initialize</preparationGoals>
    <goals>deploy</goals>
  </configuration>
</plugin>
```

You will also need all the following configuration blocks for all parts of `auto` to function:

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
