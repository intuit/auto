# Version File Plugin

For managing versions in a repository that maintains the version primarily in a flat file.
Agnostic to the primary language of the repository. 
Optional input for a release script to call during the publish/canary/next hooks.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/version-file
# or
yarn add -D @auto-it/version-file
```

## Options

- versionFile (optional, default="VERSION"): Path to where the version is stored in the repository. It should be a file containing just the semver. 
- releaseScript: (optional, default=None): Path to script that runs the publish actions in your repository. If not supplied nothing will be called. If supplied will be called during the `publish`,`canary` and `next` hooks. For the `publish` hook the first parameter passed to the script will be `release` to indicate that a regular release is being called. For `canary` and `next` hooks the first parameter will be `snapshot` to indicate a prerelease version. 

## Usage

### With default options
```json
{
  "plugins": [
    "version-file"
    // other plugins
  ]
}
```
### With optional arguments
```json
{
  "plugins": [
    "version-file", {"versionFile": "./tools/Version.txt", "releaseScript":"./tools/publish.sh"}
  ]
}