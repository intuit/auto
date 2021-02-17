## Release Pipeline

Below is the basics steps auto takes when releasing your code through the `shipit` command.

![The default shipit workflow](/default-auto.png)

You can customize how this pipeline operates with various flags.
The following shows how those flags can effect the workflow.

![The entire shipit workflow](/complete-auto.png)

## Managing Old Major Versions

This command also has the ability to help you manage old major versions too!
This feature is off by default, to enable set `versionBranches` to `true` in your [.autorc](../configuration/autorc#versionbranches).

With this feature enabled `auto shipit` will:

- Create a version branch when a `major` happens (prefixed with `version-`)
- When ran from a `versionBranch` make a release to that version

Now that you have a branch for an old major release, it is super easy to release patches to it!
People can make PRs to the the `version-` branch and once merged create a new release of that version.

### Customize Branch Prefix

You can customize what the branch names will be by setting `versionBranches` to a string.

```json
{
  "versionBranches": "Major-"
}
```

## Prereleases

If you are interested in pre-releases (ex: `alpha`, `beta`, `next`) `auto` has the ability to publish pre-releases in various ways.

Read more about preparing you project for pre-releases [here](./next#setting-up-protected-branches).

### Strategies

#### "next" Branch (default)

The suggested way to create pre-releases is by managing 2 branches for your repo: `baseBranch` and `next`.
`baseBranch` contains the `latest` stable version of the code, and `next` contains future updates.

You can change what branches `auto` treats as pre-release branches in your [`.autorc`](../configuration/autorc#prerelease-branches).

![Example git tree](/next-branch.png)

To update the `latest` stable version simply merge your pre-release branch into your `baseBranch`.

#### Without "next" Branch (`--only-graduate-with-release-label`)

If you use the `--only-graduate-with-release-label` flag, you do not have to manage 2 branches.
Instead you only have a `baseBranch` and do all work and pull requests there.
`auto` will only publish pre-releases when PRs are merged.
To update the `latest` stable version add the `released` label to the PR.

While this setup may be simpler, it restricts you from updating latest while development is happening for the pre-release.
With 2 branches you can easily merge update to the latest release, with 1 this is not possible.

#### Multiple "next" Branches

Sometimes you might want to have more rigorous release lines.
This can help test out bugs on a smaller set of users.

One setup you could use to accomplish this is by creating 3 `prereleaseBranches`

```json
{
  "prereleaseBranches": ["alpha", "beta", "rc"]
}
```

You could then set you default to `alpha` and `auto` would publish updates merged to that branch under the `alpha` release tag.
When you are ready for the update to get used by more users just merge `alpha` into `beta`.
This will publish a `beta` release to the matching release tag.
Repeat this same process when graduating to `rc` or `latest`.

#### Feature Pre-releases

Sometimes you are working on a large feature that requires a lot of work.
Instead of making a giant PR with a bunch of updates, you can create a `prereleaseBranch` to track the work.

```json
{
  "prereleaseBranches": ["next", "my-cool-feature"]
}
```

Now instead of just getting a canary version when merging into the `my-cool-feature` branch, a prerelease version is published under the `my-cool-feature` release tag!
This enables other to consume just this line of work and enables your work to be more flexible.
