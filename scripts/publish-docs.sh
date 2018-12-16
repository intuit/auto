chmod +x ./dist/bin/auto.js

SHOULD_PUBLISH=`./dist/bin/auto.js label | grep -F 'documentation'`

if [ ! -z "$SHOULD_PUBLISH" ]; then
  npm run docs:publish
fi