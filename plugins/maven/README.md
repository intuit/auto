# Maven Plugin

Release a Java project to a [maven](https://maven.apache.org/) instance.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
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
</plugin
```

You will also need all of the following configuration blocks for all parts of `auto` to function:

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
  ::: message is-info
  Don't forget to set enviornment variables `GH_USER`, `GH_TOKEN`
  :::

3. Version

   ```xml
   <version>1.0.0-SNAPSHOT</version>
   ```
