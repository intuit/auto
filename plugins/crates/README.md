# Crates Plugin

Deploy Rust crates to [crates.io](https://crates.io/).

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```bash
npm i --save-dev @auto-it/crates
# or
yarn add -D @auto-it/crates
```

## Usage

```json
{
  "plugins": ["crates"]
}
```

## Crates Project Configuration

This plugin handles incrementing the crate version, but it requires that your crate be ready for publishing. You can view [the publishing reference](https://doc.rust-lang.org/cargo/reference/publishing.html) for more information on that process.

When ran on a machine with `~/cargo/credentials`, that file will automatically be used by Cargo. For machines that do not have this file (like CI builds), the `CARGO_REGISTRY_TOKEN` environment variable is expected for Cargo's publish command as per the [publish options](https://doc.rust-lang.org/cargo/commands/cargo-publish.html#cargo_publish_options).
