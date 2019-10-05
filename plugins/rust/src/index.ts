import { Auto, execPromise, IPlugin } from '@auto-it/core';
import envCi from 'env-ci';
import fs from 'fs';
import path from 'path';
import { inc } from 'semver';
import toml from 'toml';
import userHome from 'user-home';

const { isCi } = envCi();

export const getCargoConfig = () => {
  const content = fs
    .readFileSync(path.join(process.cwd(), 'Cargo.toml'))
    .toString();
  return toml.parse(content);
};

export function checkForCreds() {
  if (isCi) {
    return process.env.CARGO_REGISTRY_TOKEN;
  }
  const credsFile = path.join(userHome, '.cargo', 'credentials');
  return fs.existsSync(credsFile);
}

export function bumpVersion(bumpBy: any) {
  if (!bumpBy) {
    throw new Error(`Unknown bump-by: ${bumpBy}`);
  }
  const filePath = path.join(process.cwd(), 'Cargo.toml');
  const content = fs.readFileSync(filePath).toString();
  const config = toml.parse(content);
  const versionOld = config.package.version;
  const versionNew = inc(versionOld, bumpBy);
  if (!versionNew) {
    throw new Error(`Could not increment previous version: ${versionOld}`);
  }
  const replaceOld = `version = "${versionOld}"`;
  const replaceNew = `version = "${versionNew}"`;
  const contentNew = content.replace(replaceOld, replaceNew);
  fs.writeFileSync(filePath, contentNew);
  return versionNew;
}

interface IRustPluginOptions {
  dryRun?: boolean;
}

export default class RustPlugin implements IPlugin {
  name = 'Rust';

  readonly options: IRustPluginOptions;

  constructor(options: IRustPluginOptions = {}) {
    this.options = options;
  }

  apply(auto: Auto) {
    auto.hooks.beforeShipIt.tap(this.name, () => {
      if (!checkForCreds()) {
        throw new Error('Cargo token is needed for the Rust plugin!');
      }
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      const config = await getCargoConfig();
      const authors = config.package.authors;
      auto.logger.log.info(`Crate authors: ${authors}`);
      return authors;
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async prefixRelease => {
      const config = await getCargoConfig();
      const version = prefixRelease(config.package.version);
      auto.logger.log.info(`Crate version: ${version}`);
      return version;
    });

    auto.hooks.version.tapPromise(this.name, async version => {
      const versionNew = bumpVersion(version);
      auto.logger.log.info(`Bumped version to: ${versionNew}`);
      await execPromise('git', ['add', 'Cargo.toml']);
      await execPromise('git', [
        'commit',
        '-m',
        `Bump version to: ${versionNew} [skip ci]`,
        '--no-verify'
      ]);
      auto.logger.log.info('Create git commit for new version');
    });

    auto.hooks.publish.tapPromise(this.name, async version => {
      auto.logger.log.info('Publishing via cargo');
      await execPromise('cargo', ['publish']);
      auto.logger.log.info('Publish complete');
      auto.logger.log.info('Pushing local git changes to origin remote');
      await execPromise('git', [
        'push',
        '--follow-tags',
        '--set-upstream',
        'origin',
        '$branch'
      ]);
      auto.logger.log.info('Push complete');
    });
  }
}
