# Maven Plugin

Release a Java project to a [maven][maven] repository.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/maven
# or
yarn add -D @auto-it/maven
```

> WARNING: You can only use one "package manager" at a time!
> Mixing them will lead to undesired results.

## Usage

This plugin makes recursive changes to all `pom.xml` files in the project, with the following assumptions:
a. The project is a multi-module project.
b. The parent `pom.xml` file is located in the root directory of the repo.
c. The parent `pom.xml` contains the version.
d. Sub-modules have the same version as the parent `pom.xml`.

`auto` will detect if the parent `pom.xml` file has the [`versions-maven-plugin`][versions-maven-plugin] configured, and
if so, use it to set the version on the parent and all child `pom.xml` files. If not, then `auto` will modify the parent
and all child `pom.xml` files using a DOM parser and XML serializer. This has the effect of losing formatting. Therefore
it then runs the serialized XML through the `prettier` "html" pretty-printer.

This means that if the `versions-maven-plugin` isn't available, the `pom.xml` files will be pretty-printed using `prettier`
formatter with the following default settings:

- `printWidth: 120` (configurable - see below)
- `tabWidth: 4` (configurable - see below)
- `parser: "html"`

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
        "mavenSettings": "./.github/maven/settings.xml",

        // An optional printWidth for the prettier pretty-printer
        // @default 120
        "printWidth": 80,

        // An optional tabWidth for the prettier pretty-printer
        // @default 4
        "tabWidth": 4
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

**NOTE:** The `MAVEN_USERNAME` and `MAVEN_PASSWORD` environment variables are still supported, and have their
counterparts as configuration options, but should be deprecated, and will be removed in a later release. This is because
`MAVEN_SETTINGS` or `MAVEN_OPTIONS` can do the same work, but provide a much more flexible solution.

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
    <connection
  >scm:git:https://${env.GH_USER}:${env.GH_TOKEN}@github.com/${owner}/${repo}.git</connection>
    <developerConnection
  >scm:git:https://${env.GH_USER}:${env.GH_TOKEN}@github.com/${owner}/${repo}.git</developerConnection>
    <url>https://github.com/${owner}/${repo}</url>
    <tag>HEAD</tag>
</scm>
```

> :warning: Either replace `${owner}/${repo}` with the corresponding GitHub owner and repository for your project or ensure those are configured as properties within the `pom.xml`

3. Versions Maven Plugin **RECOMMENDED** (Optional)

```xml
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>versions-maven-plugin</artifactId>
    <version>2.7</version>
</plugin>
```

> :warning: Don't forget to set environment variables `GH_USER`, `GH_TOKEN`

4. Version

```xml
<version>1.0.0-SNAPSHOT</version>
```

[maven]: https://maven.apache.org/
[versions-maven-plugin]: https://www.mojohaus.org/versions-maven-plugin/
