## Using in scripts

The following will only run the test:visual script when the PR has has the  
 Visual label.

```sh
export PATH=$(npm bin):$PATH

if [ auto label --pr $PR_NUMBER | grep -c '^Visual' -ne 0 ];
then
  npm run test:visual
fi
```

## Without PR Number

Running `auto label` without the PR number enables it to run in master after a PR has been merged. You can use these labels to automate more things in your merge build pipeline other than the release.
