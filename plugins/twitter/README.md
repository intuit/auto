# Twitter Plugin

Post tweets after a release is made.

## Installation

This plugin is not included with the `auto` CLI. To install:

```sh
npm i --save-dev @intuit-auto/twitter
# or
yarn add -D @intuit-auto/twitter
```

## Usage

Simply supply the names of the account to filter

```json
{
  "plugins": [
    [
      "twitter",
      {
        /* options */
      }
    ]
  ]
}
```

## Options

### Message

You can configure the message posted to twitter. The `message` option should use the following special tokens to create a tweet.

- `%release` - The version bump (major, minor, patch)
- `%package` - The name of the package
- `%notes` - Your release notes truncated to fit in the tweet
- `%link` - A link to your the release on GitHub
- `%version` - The latest version number

Default:

```txt
A new %release version of %package was released!

%notes

%link
```

```json
{
  "plugins": [
    ["twitter", { "message": "v%version of %package was released!\n\n%link" }]
  ]
}
```

### Threshold

By default the `twitter` plugin will only tweet if the version difference between the latest and the last release is greater than a `minor`.

```json
{
  "plugins": [["twitter", { "threshold": "major" }]]
}
```
