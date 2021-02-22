# Gem Plugin

A plugin that automates publishing ruby gems.

## Prerequisites

To publish to your gem you will need you your environment authenticated.
You can either create a `~/.gem/credentials` yourself or provide `RUBYGEMS_API_KEY` as an environment variable.

This plugin also looks in your `.gemspec` and `lib/**/version.rb` for a version.
`auto` will use this value and keep it up to date.

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/gem
# or
yarn add -D @auto-it/gem
```

> WARNING: You can only use one "package manager" at a time!
> Mixing them will lead to undesired results.

## Usage

```json
{
  "plugins": ["gem"]
}
```

## Options

### Release Command

When `auto` publishes your gem it does it by running a command.
The default for this is `bundle exec rake release`.

The following is an example of using [gem-release](https://github.com/svenfuchs/gem-release) to publish the gem.

> Make sure to tag and push in this command!

**.autorc:**

```json
{
  "plugins": [
    [
      "gem",
      {
        "releaseCommand": "gem release --tag --push"
      }
    ]
  ]
}
```
