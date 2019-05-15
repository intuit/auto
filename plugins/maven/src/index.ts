import { Auto, execPromise, IPlugin, SEMVER } from '@intuit-auto/core';
import parseGitHubUrl from 'parse-github-url';
import path from 'path';
import { promisify } from 'util';

import { parse } from 'pom-parser';
import { inc, ReleaseType } from 'semver';

const arrayify = <T>(arg: T | T[]): T[] => (Array.isArray(arg) ? arg : [arg]);
const parsePom = promisify(parse);
const getPom = async () =>
  parsePom({ filePath: path.join(process.cwd(), 'pom.xml') });

async function getPreviousVersion(auto: Auto): Promise<string> {
  const pom = await getPom();
  const previousVersion = pom.pomObject && pom.pomObject.project.version;

  if (!previousVersion) {
    throw new Error('Cannot read version from the pom.xml.');
  }

  auto.logger.verbose.info(
    'Maven: Got previous version from package.json',
    previousVersion
  );

  return previousVersion.replace('-SNAPSHOT', '');
}

export default class MavenPlugin implements IPlugin {
  name = 'maven';

  apply(auto: Auto) {
    auto.hooks.beforeShipIt.tap(this.name, async () => {
      // check for release env vars in the CI
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
      const developers =
        pom.pomObject.project.developers &&
        pom.pomObject.project.developers.developer;
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

    auto.hooks.version.tapPromise(this.name, async (version: SEMVER) => {
      const previousVersion = await getPreviousVersion(auto);
      const newVersion = inc(previousVersion, version as ReleaseType);

      if (!newVersion) {
        throw new Error(
          `Could not increment previous version: ${previousVersion}`
        );
      }

      await execPromise('mvn', [
        'release:prepare',
        `-DreleaseVersion=${newVersion}`,
        `-DdevelopmentVersion=${inc(newVersion, 'patch')}-SNAPSHOT`,
        '-DpushChanges=false'
      ]);
    });

    // auto.hooks.canary.tapPromise(this.name, async (version, postFix) => {});

    auto.hooks.publish.tapPromise(this.name, async () => {
      await execPromise('mvn', ['release:perform']);
    });
  }
}
