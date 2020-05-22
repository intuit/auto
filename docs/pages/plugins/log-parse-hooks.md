# Log Parser Hooks

The core of `auto` is built around parsing information from the output of `git log` in your repository.
We take that output and iterate over it to extract information from the commits.
The construct that does that work is the `LogParse` class.

The `LogParse` class is involved in any command that interacts with the git log.
You can use its hooks to attach information to the commit object ([parseCommit](#parsecommit)) or make `auto` ignore commits entirely ([omitCommit](#omitcommit)).

- [onCreateLogParse](#oncreatelogparse)
- [parseCommit](#parsecommit)
- [omitCommit](#omitcommit)

## onCreateLogParse

This is where you hook into the log parser's hooks.
See examples below.

## parseCommit

Parse information about a commit from a commit.
Here is where `auto` gets the PR number from the merge commits.

```ts
auto.hooks.onCreateLogParse.tapPromise('Stars', logParse =>
  logParse.hooks.parseCommit.tap(
    'test',
    (commit) => {
      const bump = getBump(commit.subject, logParse.options.versionLabels);
      commit.labels = [bump]
      return commit;
    }
  );
);
```

_Other examples:_

- In core:
  - Find PR number from commits message
  - Attaches labels from pull requests
  - Attaches GitHub author information
- [conventional-commits](../../../plugins/conventional-commits/README.md) - Parse change types from commit messages

## omitCommit

Choose to omit certain commits.
If you return true the commit will be omitted.
Be sure to return nothing if you don't want the commit omitted.

```ts
auto.hooks.onCreateLogParse.tapPromise('Stars', changelog =>
  changelog.hooks.omitCommit.tap(
    'test',
    (commit) => {
      if (someTest(commit.subject)) {
        return true;
      }
    }
  );
);
```

_Other examples:_

- [gradle](../../../plugins/gradle/README.md) - Omit commits from the Gradle Release plugin
- [maven](../../../plugins/maven/README.md) - Omit commits from the Maven Release plugin
- [omit-commit](../../../plugins/omit-commit/README.md) - Omit commits from authors, labels, and more
