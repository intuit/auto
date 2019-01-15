import * as fs from 'fs';
import { promisify } from 'util';

import { inc, ReleaseType } from 'semver';
import { AutoRelease, IPlugin } from '../../main';
import SEMVER from '../../semver';
import execPromise from '../../utils/exec-promise';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const DEFAULT_ZIP = 'extension.zip';

const zipExists = () =>
  fs.existsSync(DEFAULT_ZIP) ||
  (process.env.EXTENSION_ZIP && fs.existsSync(process.env.EXTENSION_ZIP));

export default class ChromeWebStorePlugin implements IPlugin {
  public name = 'Chrome Web Store';

  public apply(auto: AutoRelease) {
    auto.hooks.beforeRun.tap(this.name, () => {
      if (!process.env.CLIENT_ID) {
        auto.logger.log.warn(
          `${this.name}: CLIENT_ID environment variable must be set`
        );
      }

      if (!process.env.CLIENT_SECRET) {
        auto.logger.log.warn(
          `${this.name}: CLIENT_SECRET environment variable must be set`
        );
      }

      if (!process.env.REFRESH_TOKEN) {
        auto.logger.log.warn(
          `${this.name}: REFRESH_TOKEN environment variable must be set`
        );
      }

      if (!fs.existsSync('manifest.json')) {
        auto.logger.log.warn(
          `${this.name}: "manifest.json" must exist to publish`
        );
      }

      if (!process.env.EXTENSION_ID) {
        auto.logger.log.warn(
          `${this.name}: EXTENSION_ID environment variable must be set`
        );
      }

      if (!zipExists()) {
        auto.logger.log.warn(
          `${this.name}: Plugin must already be built as "${process.env
            .EXTENSION_ZIP || DEFAULT_ZIP}"`
        );
      }
    });

    auto.hooks.beforeShipit.tap(this.name, () => {
      if (
        !process.env.CLIENT_ID ||
        !process.env.CLIENT_SECRET ||
        !process.env.REFRESH_TOKEN ||
        !fs.existsSync('manifest.json') ||
        !process.env.EXTENSION_ID ||
        !zipExists()
      ) {
        throw new Error(
          "You don't have all necessary config set up! Check the warnings."
        );
      }
    });

    auto.hooks.getAuthor.tapPromise(this.name, async () => {
      auto.logger.verbose.info(
        `${this.name}: Getting author information from package.json`
      );

      const manifest = JSON.parse(await readFile('manifest.json', 'utf-8'));

      if (manifest.author) {
        const { author } = manifest;

        auto.logger.log.info(
          `${
            this.name
          }: You will need to manually set the author email in the .autorc.`
        );

        return author;
      }

      auto.logger.log.info(
        `${
          this.name
        }: No author found in manifest You will need to manually set the author email and name in the .autorc.`
      );
    });

    auto.hooks.getPreviousVersion.tapPromise(this.name, async prefixRelease => {
      const manifest = JSON.parse(await readFile('manifest.json', 'utf-8'));
      const version = prefixRelease(manifest.version);

      auto.logger.verbose.info(
        `${this.name}: Got previous version from package.json`,
        version
      );

      return version;
    });

    auto.hooks.getRepository.tap(this.name, () => {
      auto.logger.verbose.info(
        `${
          this.name
        }: Manifest.json has no field to store repo information. Use the .autorc to specify these options.`
      );
    });

    auto.hooks.publish.tapPromise(this.name, async (version: SEMVER) => {
      // increment version
      const manifestPath = 'manifest.json';
      const manifest = JSON.parse(await readFile(manifestPath, 'utf-8'));
      manifest.version = inc(manifest.version, version as ReleaseType);
      await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

      // commit new version
      await execPromise('git', ['add', manifestPath]);
      await execPromise('git', [
        'commit',
        '-m',
        `"Bump version to ${manifest.version} [skip ci]"`,
        '--no-verify'
      ]);

      // publish extension
      await execPromise('webstore', [
        'upload',
        '--extension-id',
        process.env.EXTENSION_ID!,
        '--source',
        process.env.EXTENSION_ZIP || DEFAULT_ZIP,
        '--auto-publish'
      ]);

      // push to github
      await execPromise('git', ['tag', manifest.version]);
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
