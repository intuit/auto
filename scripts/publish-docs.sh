chmod +x ./dist/bin/auto.js

export PATH=$(npm bin):$PATH

SHOULD_PUBLISH=`git diff --name-only master | grep -F 'docs/'`

echo $SHOULD_PUBLISH

# if [ ! -z "$SHOULD_PUBLISH" ]; then
ignite --publish
# fi