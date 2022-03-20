# Pr-Body-Labels Plugin

Allow outside contributors to indicate what semver label should be applied to the Pull Request.
If you run `auto pr-check` from your CI this plugin will look at the PR body to find what label to apply.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/pr-body-labels
# or
yarn add -D @auto-it/pr-body-labels
```

## Usage

```json
{
  "plugins": [
    ["pr-body-labels"]
    // other plugins
  ]
}
```

Then something like the following to your `.github/PULL_REQUEST_TEMPLATE.md`.
The only part of this that really matters is a markdown checkbox + one of your labels.
You control what labels an outside contributor can apply through the PR body.
This example only exposes the semantic versioning labels but you can include any label in your project.

```md
## Change Type

Indicate the type of change your pull request is:

- [ ] `patch`
- [ ] `minor`
- [ ] `major`
```

## Options

### `disabledLabels`

Labels the user cannot apply through the PR.

```json
{
  "plugins": [["pr-body-labels", { "disabledLabels": ["release"] }]]
}
```

### `removeStaleLabels`

When using the plugin it will use the checklist in your PR body as the source of truth. This means that manually added label that are present in the pr-body will be removed when `pr-check` runs again. To disable this behavior use the `removeStaleLabels` option.

```json
{
  "plugins": [["pr-body-labels", { "removeStaleLabels": false }]]
}
```
