# Update-Repo Plugin

Update github repos with a pull request.

Currently this plugin only works with NPM packages (and monorepos) updating other NPM packages.
This plugin is built in such a way that it should be easy to add other types of package update.
If you would like this functionality please file and issue or, better yet, open a pull request!

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @auto-it/update-repo
# or
yarn add -D @auto-it/update-repo
```

## Usage

```json
{
  "plugins": [
    ["update-repo", { "repo": "my/project" }],
    // or multiple repos
    [
      "update-repo",
      [
        { "repo": "my/project" },
        { "repo": "my/other" },
        { "repo": "my/another" }
      ]
    ]
  ]
}
```

### Options

Each repo configuration supports a few additional options not listed above.

#### targetBranch

The branch to make a PR against.

#### assignees

People to assign to the opened PR.

#### labels

Labels to assign to the opened P.
