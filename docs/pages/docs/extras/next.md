### Setting up Protected Branches

You should make your pre-release branches protected on GitHub. This will prevent a bunch of unwanted behavior from happening.

1. Go to you project's setting on [GitHub](https://github.com)
2. Click `Branches`
3. Click `Add Rule`
4. Enter the name of your prerelease branch (ex: `next`)
5. Configure extra branch protection settings
6. (Optional) Set the base branch in GitHub to your prerelease branch (this ensure new PRs go to this branch)
