import { Auto, execPromise, IPlugin } from '@auto-it/core';
import * as fs from 'fs';
import { inc, ReleaseType } from 'semver';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

interface IChromeWebStoreConfig {
  id?: string;
  manifest?: string;
  build: string;
}

async function getManifest(path: string) {
  return JSON.parse(await readFile(path, 'utf-8'));
}

export default class ChromeWebStorePlugin implements IPlugin {
  readonly name = 'Chrome Web Store';

  private readonly id: string;
  private readonly manifest: string;
  private readonly build: string;

  constructor(config: IChromeWebStoreConfig) {
    this.id = config.id || process.env.EXTENSION_ID!;
    this.manifest = config.manifest || 'manifest.json';
    this.build = config.build || process.env.EXTENSION_BUILD || 'extension.zip';
  }

  reportWarning(auto: Auto, message: string) {
    auto.logger.log.warn(`${this.name}: ${message}`);
  }

  apply(auto: Auto) {
    auto.hooks.beforeRun.tap(this.name, () => {
      if (!this.id) {
        this.reportWarning(
          auto,
          'EXTENSION_ID environment variable must be set or "id" in autorc'
        );
      }

      if (!fs.existsSync(this.manifest)) {
        this.reportWarning(
          auto,
          `"${this.manifest}" must exist to publish. Or provide a custom path in you autorc`
        );
      }

      if (!fs.existsSync(this.build)) {
        this.reportWarning(
          auto,
          `Path to either a zip file, or a directory to be zipped at ${this.build}`
        );
      }

      // Secrets

      if (!process.env.CLIENT_ID) {
        this.reportWarning(auto, 'CLIENT_ID environment variable must be set');
      }

      if (!process.env.CLIENT_SECRET) {
        this.reportWarning(
          auto,
          'CLIENT_SECRET environment variable must be set'
        );
      }

      if (process.env.REFRESH_TOKEN) {
        return;
      }

      this.reportWarning(
        auto,
        'REFRESH_TOKEN environment variable must be set'
      );
    });

    auto.hooks.beforeShipIt.tap(this.name, () => {
      if (
        process.env.CLIENT_ID &&
        process.env.CLIENT_SECRET &&
        process.env.REFRESH_TOKEN &&
        fs.existsSync(this.manifest) &&
        this.id &&
        fs.existsSync(this.build)
      ) {
        return;
      }

      throw new Error(
        "You don't have all necessary config set up! Check the warnings."
      );
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      auto.logger.verbose.info(
        `${this.name}: Getting author information from package.json`
      );

      const manifest = await getManifest(this.manifest);

      if (manifest.author) {
        const { author } = manifest;

        auto.logger.log.info(
          `${this.name}: You will need to manually set the author email in the .autorc.`
        );

        return author;
      }

      auto.logger.log.info(
        `${this.name}: No author found in manifest You will need to manually set the author email and name in the .autorc.`
      );
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async prefixRelease => {
      const manifest = await getManifest(this.manifest);
      const version = prefixRelease(manifest.version);

      auto.logger.verbose.info(
        `${this.name}: Got previous version from package.json`,
        version
      );

      return version;
    });

    auto.hooks.getRepository.tap(this.name, () => {
      auto.logger.verbose.info(
        `${this.name}: Manifest.json has no field to store repo information. Use the .autorc to specify these options.`
      );
    });

    auto.hooks.version.tapPromise(this.name, async version => {
      // increment version
      const manifest = await getManifest(this.manifest);
      manifest.version = inc(manifest.version, version as ReleaseType);
      await writeFile(this.manifest, JSON.stringify(manifest, undefined, 2));

      // commit new version
      await execPromise('git', ['add', this.manifest]);
      await execPromise('git', [
        'commit',
        '-m',
        `"Bump version to ${manifest.version} [skip ci]"`,
        '--no-verify'
      ]);

      await execPromise('git', ['tag', manifest.version]);
    });

    auto.hooks.publish.tapPromise(this.name, async () => {
      // publish extension
      await execPromise('webstore', [
        'upload',
        '--extension-id',
        this.id,
        '--source',
        this.build,
        '--auto-publish'
      ]);

      // push to github
      await execPromise('git', [
        'push',
        '--follow-tags',
        '--set-upstream',
        'origin',
        '$branch'
      ]);
    });
  }
}
