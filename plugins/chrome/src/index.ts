import { Auto, execPromise, IPlugin } from '@auto-it/core';
import * as fs from 'fs';
import { inc, ReleaseType } from 'semver';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

interface IChromeWebStoreConfig {
  /** The id of the chrome extension */
  id?: string;
  /** The path to the manifest of the chrome extension */
  manifest?: string;
  /** A path to the packaged extension */
  build: string;
}

/** Get the chrome plugin manifest. */
async function getManifest(path: string) {
  return JSON.parse(await readFile(path, 'utf-8'));
}

/** This plugin allows you to automate the publishing of chrome extensions */
export default class ChromeWebStorePlugin implements IPlugin {
  /** The name of the plugin */
  readonly name = 'Chrome Web Store';

  /** The options of the plugin */
  private readonly options: Required<IChromeWebStoreConfig>;

  /** Initialize the plugin with it's options */
  constructor(config: IChromeWebStoreConfig) {
    this.options = {
      id: config.id || process.env.EXTENSION_ID!,
      manifest: config.manifest || 'manifest.json',
      build: config.build || process.env.EXTENSION_BUILD || 'extension.zip'
    };
  }

  /** Report a warning to the log */
  reportWarning(auto: Auto, message: string) {
    auto.logger.log.warn(`${this.name}: ${message}`);
  }

  /** Tap into auto plugin points. */
  apply(auto: Auto) {
    auto.hooks.beforeRun.tap(this.name, () => {
      if (!this.options.id) {
        this.reportWarning(
          auto,
          'EXTENSION_ID environment variable must be set or "id" in autorc'
        );
      }

      if (!fs.existsSync(this.options.manifest)) {
        this.reportWarning(
          auto,
          `"${this.options.manifest}" must exist to publish. Or provide a custom path in you autorc`
        );
      }

      if (!fs.existsSync(this.options.build)) {
        this.reportWarning(
          auto,
          `Path to either a zip file, or a directory to be zipped at ${this.options.build}`
        );
      }

      // Secrets
      auto.checkEnv(this.name, 'CLIENT_ID');
      auto.checkEnv(this.name, 'CLIENT_SECRET');
      auto.checkEnv(this.name, 'REFRESH_TOKEN');
    });

    auto.hooks.beforeShipIt.tap(this.name, () => {
      if (
        process.env.CLIENT_ID &&
        process.env.CLIENT_SECRET &&
        process.env.REFRESH_TOKEN &&
        fs.existsSync(this.options.manifest) &&
        this.options.id &&
        fs.existsSync(this.options.build)
      ) {
        return;
      }

      throw new Error(
        "You don't have all necessary config set up! Check the warnings."
      );
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      auto.logger.verbose.info(
        `${this.name}: Getting author information from manifest.json`
      );

      const manifest = await getManifest(this.options.manifest);

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

    auto.hooks.getPreviousVersion.tapPromise(this.name, async () => {
      const manifest = await getManifest(this.options.manifest);
      const version = auto.prefixRelease(manifest.version);

      auto.logger.verbose.info(
        `${this.name}: Got previous version from manifest.json`,
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
      const manifest = await getManifest(this.options.manifest);
      manifest.version = inc(manifest.version, version as ReleaseType);
      await writeFile(
        this.options.manifest,
        JSON.stringify(manifest, undefined, 2)
      );

      // commit new version
      await execPromise('git', ['add', this.options.manifest]);
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
        this.options.id,
        '--source',
        this.options.build,
        '--auto-publish'
      ]);

      // push to github
      await execPromise('git', [
        'push',
        '--follow-tags',
        '--set-upstream',
        'origin',
        auto.baseBranch
      ]);
    });
  }
}
