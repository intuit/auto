Useful in conjunction with `npm version` to auto-version releases.

## Skip Release

To not create a release for a pull request add the `skip-release` label. Any pull request with this tag will make `auto version` return `''`.

::: message is-warning
:warning: You must check the return value of `auto version` in a bash script like in the example configuration for the `skip-release` label to function properly.
:::

### Multiple

You can configure multiple labels to skip releasing as well. To do this use the `skipReleaseLabels` options. This can also be configured via the [.autorc](./autorc.md#multiple-no-version).

```sh
auto version --skip-release-labels project-files --skip-release-labels documentation
```

## Configure Versioning Labels

You can customize the versioning labels in the `.autorc`. To see configuration [go here](./autorc.md#versioning-labels).
