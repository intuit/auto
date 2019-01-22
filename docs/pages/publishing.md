# Publishing

`auto`'s main use it to automate the release process for your project This can be broken down into three core steps:

```text
pre: (optional) Check if new version

1. Generate CHANGELOG.md
2. Publish code
3. Generate github release notes
```

`auto` makes no assumptions about your publishing process. Each tool is a function that can be run in isolation and only does one thing really well. For instance, you could just use `auto changelog` to generate the changelog and nothing else or use `auto version` to calculate just the semver bump.
