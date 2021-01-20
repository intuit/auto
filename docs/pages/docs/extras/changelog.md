> :warning: This should be run before you version your project so the `CHANGELOG.md` changes are committed before the release gets tagged.

## Changelog Titles

You can customize the changelog titles and even add custom ones. To see configuration [go here](../configuration/autorc#changelog-titles).

## Additional Release notes

Sometimes a PR title is just not enough to capture what a user should know about that PR. That's why we've included the ability to put extra release notes right in your PRs. All you have to do is add a `Release Notes` section in your PR.

Take the following PR body:

```md
# What Changed

Change `shipit` behavior.

## Release Notes

`auto shipit` will only ship to `latest` on the base branch ([which is configurable]()). If ran locally or from a PR it will create a `canary` release that doesn't interfere with your `latest` release.
```

This will create a special section at the top of the changelog that collects all the additional release notes from merged PRs. Below is a sample of what it might look like.

---

# v5.0.0 (Sat May 04 2019)

### Release Notes

_From #371_

`auto shipit` will only ship to `latest` on the base branch ([which is configurable]()). If ran locally or from a PR it will create a `canary` release that doesn't interfere with your `latest` release.

---

#### 💥 Breaking Change

- shipit will publish a canary locally when not on `baseBranch` [#371](https://github.com/intuit/auto/pull/371) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
