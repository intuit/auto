export PATH=$(npm bin):$PATH

SHOULD_PUBLISH=`git diff \`git tag --sort version:refname | tail -n 1\` HEAD --name-only | grep -F 'docs/'`

if [ ! -z "$SHOULD_PUBLISH" ]; then
  echo publishing $SHOULD_PUBLISH
  ./docs/generate-command-docs.js
  ignite
  git config --global user.name "Andrew Lisowski"
  git config --global user.email "lisowski54@gmail.com"
  npx push-dir --cleanup --dir=_ignite/auto --branch=gh-pages
else
  echo No documentation files changed since last tagged release.
fi