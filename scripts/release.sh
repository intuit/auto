git config --global user.email "lisowski54@gmail.com"
git config --global user.name "Andrew Lisowski"
git config --global push.default matching

chmod +x ./dist/bin/auto.js

VERSION=`./dist/bin/auto.js version`

if [ ! -z "$VERSION" ]; then
  echo SemVer Bump: $VERSION

  ## Update Changelog
  ./dist/bin/auto.js changelog

  ## Publish Package
  npm version $VERSION -m "Bump version to: %s [skip ci]"
  npm publish

  ## Create Gitub Release
  git push --follow-tags --set-upstream origin $branch
  ./dist/bin/auto.js release
fi