#!/usr/bin/env bash
# Writes the PR number for this run to the `number` output (empty if none):
# the event's own PR if it has one, otherwise the first PR associated with
# $COMMIT_SHA, considering only open PRs when $ONLY_OPEN is "true".
set -euo pipefail

number="$(jq -r '.pull_request.number // empty' "$GITHUB_EVENT_PATH")"

if [ -z "$number" ]; then
  number="$(gh api "repos/$GITHUB_REPOSITORY/commits/$COMMIT_SHA/pulls" |
    jq -r --arg only_open "$ONLY_OPEN" \
      'map(select($only_open != "true" or .state == "open")) | .[0].number // empty')"
fi

echo "number=$number" >> "$GITHUB_OUTPUT"
