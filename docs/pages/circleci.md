# CircleCI

The following config declares the `release` job and uses it in the `build_and_release` workflow. The `release` job will only run on commits to master.

```yaml
version: 2

defaults: &defaults
  working_directory: ~/auto-release-test
  docker:
    - image: circleci/node:latest-browsers

jobs:
  install: # your install job

  release:
    <<: *defaults
    steps:
      - attach_workspace:
          at: ~/auto-release-test
      - run:
          name: Release
          command: npm run release

workflows:
  version: 2
  build_and_release:
    jobs:
      - install:
          filters:
            tags:
              only: /.*/

      - release:
          requires:
            - install
          filters:
            branches:
              only:
                - master
```
