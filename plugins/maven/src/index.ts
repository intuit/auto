import { Auto, execPromise, IPlugin } from '@auto-it/core';
import parseGitHubUrl from 'parse-github-url';
import path from 'path';
import { promisify } from 'util';

import { parse } from 'pom-parser';
import { inc, ReleaseType } from 'semver';

/** Ensure a value is an array */
const arrayify = <T>(arg: T | T[]): T[] => (Array.isArray(arg) ? arg : [arg]);
const parsePom = promisify(parse);

/** Get the maven pom.xml for a project */
const getPom = async () =>
  parsePom({ filePath: path.join(process.cwd(), 'pom.xml') });

/** Get the previous version from the pom.xml */
async function getPreviousVersion(auto: Auto): Promise<string> {
  const pom = await getPom();
  const previousVersion = pom.pomObject?.project.version;

  if (!previousVersion) {
    throw new Error('Cannot read version from the pom.xml.');
  }

  auto.logger.verbose.info(
    'Maven: Got previous version from pom.xml',
    previousVersion
  );

  return previousVersion.replace('-SNAPSHOT', '');
}

/** Deploy project to maven */
export default class MavenPlugin implements IPlugin {
  /** The name of the plugin */
  name = 'maven';

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.onCreateLogParse.tap(this.name, logParse => {
      logParse.hooks.omitCommit.tap(this.name, commit => {
        if (commit.subject.includes('[maven-release-plugin]')) {
          return true;
        }
      });
    });

    auto.hooks.beforeShipIt.tap(this.name, async () => {
      const { MAVEN_PASSWORD, MAVEN_USERNAME, MAVEN_SETTINGS } = process.env;

      if (!MAVEN_PASSWORD && !MAVEN_SETTINGS) {
        auto.logger.log.warn(
          'No password detected in the environment. You may need this to publish.'
        );
      }

      if (!MAVEN_USERNAME && !MAVEN_SETTINGS) {
        auto.logger.log.warn(
          'No username detected in the environment. You may need this to publish.'
        );
      }
    });

    auto.hooks.getRepository.tapPromise(this.name, async () => {
      auto.logger.verbose.info('Maven: getting repo information from pom.xml');

      const pom = await getPom();
      const { scm } = pom.pomObject.project;

      if (!scm) {
        throw new Error(
          'Could not find scm settings in pom.xml. Make sure you set one up that points to your project on GitHub or set owner+repo in your .autorc'
        );
      }

      const github = arrayify(pom.pomObject.project.scm).find(remote =>
        Boolean(remote.url.includes('github'))
      );

      if (!github) {
        throw new Error(
          'Could not find GitHub scm settings in pom.xml. Make sure you set one up that points to your project on GitHub or set owner+repo in your .autorc'
        );
      }

      const repoInfo = parseGitHubUrl(github.url);

      if (!repoInfo || !repoInfo.owner || !repoInfo.name) {
        throw new Error(
          'Cannot read owner and project name from GitHub URL in pom.xml'
        );
      }

      return {
        owner: repoInfo.owner,
        repo: repoInfo.name
      };
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      auto.logger.verbose.info('Maven: Getting repo information from pom.xml');

      const pom = await getPom();
      const developers = pom.pomObject.project.developers?.developer;
      const developer = developers ? arrayify(developers)[0] : undefined;

      if (!developer || !developer.name || !developer.email) {
        throw new Error(
          'Cannot read author from the pom.xml. Please include at least 1 developer in the developers section.'
        );
      }

      return developer;
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, () =>
      getPreviousVersion(auto)
    );

    auto.hooks.version.tapPromise(this.name, async version => {
      const previousVersion = await getPreviousVersion(auto);
      const newVersion =
        // After release we bump the version by a patch and add -SNAPSHOT
        // Given that we do not need to increment when versioning, since
        // it has already been done
        version === 'patch'
          ? previousVersion
          : inc(previousVersion, version as ReleaseType);

      if (!newVersion) {
        throw new Error(
          `Could not increment previous version: ${previousVersion}`
        );
      }

      await execPromise('mvn', ['clean']);
      await execPromise('mvn', [
        '-B',
        'release:prepare',
        `-Dtag=v${newVersion}`,
        `-DreleaseVersion=${newVersion}`,
        '-DpushChanges=false'
      ]);
      await execPromise('git', ['checkout', '-b', 'dev-snapshot']);
      await execPromise('git', ['checkout', 'master']);
      await execPromise('git', ['reset', '--hard', 'HEAD~1']);
    });

    auto.hooks.publish.tapPromise(this.name, async () => {
      const { MAVEN_PASSWORD, MAVEN_USERNAME, MAVEN_SETTINGS } = process.env;

      auto.logger.log.await('Performing maven release...');

      await execPromise('git', [
        'push',
        '--follow-tags',
        '--set-upstream',
        'origin',
        auto.baseBranch
      ]);

      await execPromise('mvn', [
        MAVEN_PASSWORD && `-Dpassword=${MAVEN_PASSWORD}`,
        MAVEN_USERNAME && `-Dusername=${MAVEN_USERNAME}`,
        MAVEN_SETTINGS && `-s=${MAVEN_SETTINGS}`,
        'release:perform'
      ]);

      auto.logger.log.success('Published code to maven!');
    });

    auto.hooks.afterShipIt.tapPromise(this.name, async () => {
      // prepare for next development iteration
      await execPromise('git', ['reset', '--hard', 'dev-snapshot']);
      await execPromise('git', ['branch', '-d', 'dev-snapshot']);
      await execPromise('git', ['push', 'origin', auto.baseBranch]);
    });
  }
}
