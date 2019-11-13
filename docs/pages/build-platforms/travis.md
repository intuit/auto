# Travis CI

The following config declares the `deploy` job that run on all branches. The job will either release:

- a new `latest` version from `master`
- a `canary` build from a pull request (if your package manager plugin implements them)

**`.circleci/config.yml`**

```yaml
language: node_js
node_js: '10'
env:
  global:
    - GIT_NAME="Andrew Lisowski"
    - GIT_EMAIL="lisowski54@gmail.com"

script:
  - yarn lint
  - yarn test
  - yarn build

before_deploy:
  - git config --local user.name "${GIT_NAME}"
  - git config --local user.email "${GIT_EMAIL}"
  - git remote rm origin
  - git remote add origin https://${GH_TOKEN}@github.com/hipstersmoothie/my-test-project
  - git fetch origin --tags
  - git checkout master
  - git branch --set-upstream-to origin/master master
deploy:
  skip_cleanup: true
  provider: script
  script: npx auto shipit
  on:
    all_branches: true
```

## Troubleshooting

If you are having problems make sure you have done the following:

- `GH_TOKEN` is set
- Any other secrets for plugins are set (Ex; `NPM_TOKEN` with the NPM plugin)

## Examples

- [`relay-compiler-language-typescript`](https://github.com/relay-tools/relay-compiler-language-typescript/blob/master/.travis.yml)
