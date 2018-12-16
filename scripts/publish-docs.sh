chmod +x ./dist/bin/auto.js

export PATH=$(npm bin):$PATH

SHOULD_PUBLISH=`./dist/bin/auto.js label | grep -F 'documentation'`

if [ ! -z "$SHOULD_PUBLISH" ]; then
  ignite --publish
fi