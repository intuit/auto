# S3 Plugin

Post your built artifacts to s3.

## Prerequisites

Must have the [aws-cli](https://docs.aws.amazon.com/cli/index.html) on your machine and all of the following environment variables set:

- `AWS_ACCESS_KEY`
- `AWS_SECRET_KEY`
- `AWS_SESSION_TOKEN`

## Installation

This plugin is not included with the `auto` CLI installed via NPM. To install:

```sh
npm i --save-dev @auto-it/s3
# or
yarn add -D @auto-it/s3
```

## Usage

Publish a single asset to s3.

`bucket`: Bucket to deploy to
`region`: Region to deploy to
`files`: An array of tuples mapping local build files to remote deploy paths.

```txt
EX:

given: `[["components/button/dist", "components/button"]]`

=> Deploy the files in "components/button/dist" to s3://bucket/components/button on `region`
```

**Full**:

```json
{
  "plugins": [
    [
      "s3",
      {
        "bucket": "BUCKET_NAME",
        "region": "REGION_NAME",
        "files": [["components/button/dist", "components/button"]]
      }
    ]
    // other plugins
  ]
}
```

### Versioning Deploys

To version your deployed assets simply add `$VERSION` in the `remote` path. This will be replaced with the new version being released.

```json
{
  "plugins": [
    [
      "s3",
      {
        "bucket": "BUCKET_NAME",
        "region": "REGION_NAME",
        "files": [["components/button/dist", "$VERSION/components/button"]]
      }
    ]
    // other plugins
  ]
}
```

### Multiple Files

Publish multiple assets to s3.

```json
{
  "plugins": [
    [
      "s3",
      {
        "bucket": "BUCKET_NAME",
        "region": "REGION_NAME",
        "files": [
          ["components/button/dist", "components/button"],
          ["components/card/dist", "components/card"],
          ["components/select/dist", "components/select"]
        ]
      }
    ]
  ]
}
```

### Multiple Buckets

Publish assets to multiple s3 buckets.

```json
{
  "plugins": [
    [
      "s3",
      [
        {
          "bucket": "BUCKET_NAME",
          "region": "REGION_NAME",
          "files": [["components/button/dist", "components/button"]]
        },
        {
          "bucket": "ANOTHER_BUCKET_NAME",
          "region": "REGION_NAME",
          "files": [["components/card/dist", "components/card"]]
        }
      ]
    ]
  ]
}
```

### Overwrite

By default this plugin will overwrite any bucket path you give it. To prevent it from overwriting your bucket path if it already exists set `overwrite` to false

```json
{
  "plugins": [
    [
      "s3",
      {
        "bucket": "BUCKET_NAME",
        "region": "REGION_NAME",
        "overwrite": false,
        ...
      }
    ]
  ]
}
```
