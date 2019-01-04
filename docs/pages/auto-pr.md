# `auto pr`

Set the status on a PR commit

## Options

```bash
>  auto pr -h

Options

  --sha string                      Specify a custom git sha. Defaults to the HEAD for a git repo in the current
                                    repository
  --pr number [required]            The pull request number you want the labels of
  --url string                      URL to associate with this status
  --state string [required]         State of the PR. ['pending', 'success', 'error', 'failure']
  --description string [required]   A description of the status
  --context string [required]       A string label to differentiate this status from others

Global Options

  -h, --help            Display the help output for the command
  -v, --verbose         Show some more logs
  -w, --very-verbose    Show a lot more logs
  --repo string         The repo to set the status on. Defaults to looking in the package.json
  --owner string        Version number to publish as. Defaults to reading from the package.json
  --githubApi string    GitHub API to use
  --platform string     Platform to interact with (supported: NPM <- default)

Examples

$ auto pr \
   --pr 32 \
   --url http://your-ci.com/build/123 \
   --state pending \
   --description "Build still running..." \
   --context build-check
```
