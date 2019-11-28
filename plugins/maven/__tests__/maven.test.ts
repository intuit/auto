import fs from 'fs';

import * as Auto from '@auto-it/core';
import { dummyLog } from '@auto-it/core/dist/utils/logger';
import { makeHooks } from '@auto-it/core/dist/utils/make-hooks';
import MavenPlugin from '../src';

const mockRead = (result: string) =>
  jest
    .spyOn(fs, 'readFile')
    // @ts-ignore
    .mockImplementationOnce((a, b, cb) => cb(undefined, result));

describe('maven', () => {
  let hooks: Auto.IAutoHooks;

  beforeEach(() => {
    const plugin = new MavenPlugin();
    hooks = makeHooks();
    plugin.apply({
      hooks,
      logger: dummyLog(),
      prefixRelease: r => r
    } as Auto.Auto);
  });

  describe('getAuthor', () => {
    test('should get author from pom.xml', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <developers>
            <developer>
              <name>Andrew Lisowski</name>
              <email>test@email.com</email>
            </developer>
          </developers>
        </project>
      `);

      expect(await hooks.getAuthor.promise()).toStrictEqual(
        expect.objectContaining({
          email: 'test@email.com',
          name: 'Andrew Lisowski'
        })
      );
    });

    test('should support multiple developers', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <developers>
            <developer>
              <name>Andrew Lisowski</name>
              <email>test@email.com</email>
            </developer>
            <developer>
              <name>Adam Dierkens</name>
              <email>adam@dierkens.com</email>
            </developer>
          </developers>
        </project>
      `);

      expect(await hooks.getAuthor.promise()).toStrictEqual(
        expect.objectContaining({
          email: 'test@email.com',
          name: 'Andrew Lisowski'
        })
      );
    });

    test('should get author from pom.xml - simple', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
        </project>
      `);

      await expect(hooks.getAuthor.promise()).rejects.toBeInstanceOf(Error);
    });
  });

  describe('getRepository', () => {
    test('should get repo from pom.xml', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <scm>
            <connection>scm:git:https://github.com/Fuego-Tools/java-test-project.git</connection>
            <url>https://github.com/Fuego-Tools/java-test-project</url>
            <tag>HEAD</tag>
          </scm>
        </project>
      `);

      expect(await hooks.getRepository.promise()).toStrictEqual(
        expect.objectContaining({
          owner: 'Fuego-Tools',
          repo: 'java-test-project'
        })
      );
    });

    test('should throw if no repo found', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
        </project>
      `);

      await expect(hooks.getRepository.promise()).rejects.toBeInstanceOf(Error);
    });

    test('should throw if cannot find github URL', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <scm>
            <connection>scm:git:https://foo.com</connection>
            <url>https://foo.com</url>
            <tag>HEAD</tag>
          </scm>
        </project>
      `);

      await expect(hooks.getRepository.promise()).rejects.toBeInstanceOf(Error);
    });

    test('should throw if cannot parse github URL', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <scm>
            <connection>scm:git:https://github.com</connection>
            <url>https://github.com</url>
            <tag>HEAD</tag>
          </scm>
        </project>
      `);

      await expect(hooks.getRepository.promise()).rejects.toBeInstanceOf(Error);
    });
  });

  describe('getPreviousVersion', () => {
    test('should get previous version from pom.xml', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <version>1.0.0-SNAPSHOT</version>
        </project>
      `);

      expect(await hooks.getPreviousVersion.promise()).toBe('1.0.0');
    });

    test('should throw when no version in pom.xml', async () => {
      mockRead('');
      await expect(hooks.getPreviousVersion.promise()).rejects.toBeInstanceOf(
        Error
      );
    });
  });

  describe('version', () => {
    test('should version release - not versioned because of prepatched snapshot', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <version>1.0.0-SNAPSHOT</version>
        </project>
      `);
      const spy = jest.fn();
      jest.spyOn(Auto, 'execPromise').mockImplementation(spy);

      await hooks.version.promise(Auto.SEMVER.patch);
      const call = spy.mock.calls[1][1];
      expect(call).toContain('-DreleaseVersion=1.0.0');
      expect(call).toContain('-Dtag=v1.0.0');
    });

    test('should error when failing to increment previous version', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <version>1.0.a-SNAPSHOT</version>
        </project>
      `);

      await expect(
        hooks.version.promise(Auto.SEMVER.minor)
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe('publish', () => {
    test('should publish release', async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <version>1.0.0-SNAPSHOT</version>
        </project>
      `);
      const spy = jest.fn();
      jest.spyOn(Auto, 'execPromise').mockImplementation(spy);

      await hooks.publish.promise(Auto.SEMVER.patch);
      expect(spy.mock.calls[1][1]).toContain('release:perform');
    });
  });
});
