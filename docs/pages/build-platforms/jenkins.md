# Jenkins 2

The following config declares the `release` action that run on all branches. The job will either release:

- a new `latest` version from `master`
- a `canary` build from a pull request (only on the main fork and if your package manager plugin implements them)

**`Jenkinsfile`**

::: message is-warning
You must use some sort of step that implements `skip ci` functionality. Otherwise you will get stuck in a release loop!
:::

```groovy

pipeline {
  environment {
    NPM_TOKEN = credentials('NPM_TOKEN')
    GH_TOKEN = credentials('GH_TOKEN')
  }
  stages {
    stage('Check Skip CI') {
      steps {
        script {
          result = sh (script: "git log -1 | grep '.*\\[skip ci\\].*'", returnStatus: true)
          if (result == 0) {
              echo ("'Skip CI' spotted in git commit. Aborting.")
              currentBuild.result = 'ABORTED'
              error('Exiting job');
          }
        }
      }
    }
    stage('Auth') {
      steps {
        sh '''
          echo "https://${GITHUB_TOKEN}@github.com" >> /tmp/gitcredfile
          git config --global user.name "Andrew Lisowski"
          git config --global user.email "lisowski54@gmail.com"
          git config --global credential.helper "store --file=/tmp/gitcredfile"
        '''
      }
    }
    stage('Install') {
      steps {
        sh 'yarn install --frozen-lockfile'
      }
    }
    stage('Build') {
      steps {
          sh 'yarn build'
      }
    }
    stage('Publish') {
        when { branch 'master' }
        steps {
          sh 'auto shipit'
        }
    }
    stage('Canary') {
      when { changeRequest() }
      steps {
        sh 'auto canary --pr $CHANGE_ID --build $BUILD_NUMBER'
      }
    }
  }
}
```

## Troubleshooting

If you are having problems make sure you have done the following:

- `GH_TOKEN` is set
- Any other secrets for plugins are set (Ex; `NPM_TOKEN` with the NPM plugin)
