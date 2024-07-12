# Version File Plugin

For managing versions in a repository that maintains the version primarily in a flat file.
Agnostic to the primary language of the repository. 
Optional input for a release script to call during the publish/canary/next hooks.

## Installation

This plugin is included with the `auto` CLI so you do not have to install it. To install if you are using the `auto` API directly:

```bash
npm i --save-dev @auto-it/version-file
# or
yarn add -D @auto-it/version-file
```

## Options

- versionFile (optional, default="VERSION"): Path to where the version is stored in the repository. It should be a file containing just the semver. 
- publishScript: (optional, default=None): Path to script that runs the publish actions in your repository. If not supplied nothing will be called. If supplied will be called during the `publish`,`canary` and `next` hooks with the arguments defined in `publishScriptReleaseTypeArgs` for that release type.
- publishScriptReleaseTypeArgs: (optional, default=```{
  "publish": ["release"],
  "canary": ["snapshot"],
  "next": ["snapshot"]
}```): Mapping of arguments to pass to the `publishScript` for each release type (`publish`, `canary`, `next`)

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
    "version-file", {"versionFile": "./tools/Version.txt", "publishScript":"./tools/publish.sh", "publishScriptReleaseTypeArgs": {
      "publish": ["release"], // (default)
      "canary": ["snapshot"],
      "next": ["some", "other", "args"],
    }}
  ]
}
