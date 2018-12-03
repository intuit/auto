chmod +x ./dist/bin/auto.js

if [ ! -z "$CIRCLE_PR_NUMBER" ]; then
  ./dist/bin/auto.js pr-check --pr $CIRCLE_PR_NUMBER --url $CIRCLE_PULL_REQUEST
fi
