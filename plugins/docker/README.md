# Docker Plugin

This plugin automates tagging and publishing images to a docker registry.

## Prerequisites

To publish to a docker registry, you'll first need to authenticate with the target registry. For example, the [Docker Login Action](https://github.com/docker/login-action) for GitHub, or [the `withRegistry` helper](https://www.jenkins.io/doc/book/pipeline/docker/#custom-registry) in Jenkins.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/docker
# or
yarn add -D @auto-it/docker
```

## Usage

**IMPORTANT:** You must first must build the desired image to publish.

The following options are available for this plugin:

|option|required|default|environment variable|description|
|-|-|-|-|-|
| `image` | X | | `IMAGE` | The image ID, digest, or tag of the locally available image to tag and publish (must be built before this plugin is run) |
| `registry` | X | | `REGISTRY` | Docker registry to publish to |
| `tagLatest` | | `false` | `TAG_LATEST` | Tag latest release with `latest` tag |
| `tagPullRequestAliases` | | `false` | `TAG_PULL_REQUEST_ALIASES` | Tag pull requests with `pr-<number>` tag |
| `tagPrereleaseAliases` | | `false` | `TAG_PRERELEASE_ALIASES` | Tag prerelease branches
| `prereleaseAliasMappings` | | `{}` | | Tag prerelease branches with different names (e.g. `{"develop": "next"}`) |

### Example 1: Tag releases only
```json
{
  "plugins": [
    ["docker", { "registry": "ghcr.io/my/app", "image": "someLocalImage:myLocalTag" }]
    // other plugins
  ]
}
```

This will publish releases from the local docker image `someLocalImage:myLocalTag` to: - `ghcr.io/my/app:<version>`

### Example 2: Tag latest releases
```json
{
  "plugins": [
    ["docker", { "registry": "ghcr.io/my/app", "image": "someLocalImage:myLocalTag", "tagLatest": true }]
    // other plugins
  ]
}
```

This will publish releases from the local docker image `someLocalImage:myLocalTag` to: - `ghcr.io/my/app:<version>`
- `ghcr.io/my/app:latest`

### Example 3: Tag Prereleases (with Custom Tags)
```json
{
  "prereleaseBranches": ["develop", "someOtherPrereleaseBranch"],
  "plugins": [
    ["docker", { "registry": "ghcr.io/my/app", "image": "someLocalImage:myLocalTag", "tagPrereleases": true, "prereleaseTagMapping": { "develop": "next" } }]
    // other plugins
  ]
}
```

For pushes to `develop` branch this will create the following tags:
- `ghcr.io/my/app:<prereleaseVersion>`
- `ghcr.io/my/app:next`

For pushes to `someOtherReleaseBranch` this will create the following tags:
- `ghcr.io/my/app:<prereleaseVersion>`
- `ghcr.io/my/app:someOtherReleaseBranch`

### Example 4: Tag Pull Requests
```json
{
  "plugins": [
    ["docker", { "registry": "ghcr.io/my/app", "image": "someLocalImage:myLocalTag", "tagPullRequests": true }]
    // other plugins
  ]
}
```

If this is run against a pull request the following tags will be created against `someLocalImage:myLocalTag`:
- `ghcr.io/my/app:<canaryVersion>`
- `ghcr.io/my/app:pr-<prNumber>`
