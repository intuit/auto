import fs from "fs";

import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import MavenPlugin, { IMavenPluginOptions } from "../src";

const exec = jest.fn();

jest.mock("../../../packages/core/dist/utils/exec-promise", () => ({
  // @ts-ignore
  default: (...args) => exec(...args),
}));

const mockRead = (result: string) =>
  jest
    .spyOn(fs, "readFile")
    // @ts-ignore
    .mockImplementationOnce((a, b, cb) => cb(undefined, result));

describe("maven", () => {
  let hooks: Auto.IAutoHooks;
  const prefixRelease: (a: string) => string = jest.fn(
    (version) => `v${version}`
  );
  const options: IMavenPluginOptions = {};

  beforeEach(() => {
    exec.mockClear();
    const plugin = new MavenPlugin(options);
    hooks = makeHooks();
    plugin.apply({ hooks, logger: dummyLog(), prefixRelease } as Auto.Auto);
  });

  describe("getAuthor", () => {
    test("should get author from pom.xml", async () => {
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

      await hooks.beforeRun.promise({} as any);

      expect(await hooks.getAuthor.promise()).toStrictEqual(
        expect.objectContaining({
          email: "test@email.com",
          name: "Andrew Lisowski",
        })
      );
    });

    test("should support multiple developers", async () => {
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

      await hooks.beforeRun.promise({} as any);

      expect(await hooks.getAuthor.promise()).toStrictEqual(
        expect.objectContaining({
          email: "test@email.com",
          name: "Andrew Lisowski",
        })
      );
    });

    test("should get author from pom.xml - simple", async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
        </project>
      `);

      await hooks.beforeRun.promise({} as any);

      await expect(hooks.getAuthor.promise()).resolves.toBeUndefined();
    });
  });

  describe("getRepository", () => {
    test("should get repo from pom.xml", async () => {
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

      await hooks.beforeRun.promise({} as any);

      expect(await hooks.getRepository.promise()).toStrictEqual(
        expect.objectContaining({
          owner: "Fuego-Tools",
          repo: "java-test-project",
        })
      );
    });

    test("should be undefined if no repo found", async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
        </project>
      `);

      await hooks.beforeRun.promise({} as any);

      expect(await hooks.getRepository.promise()).toStrictEqual(
        expect.objectContaining({
          owner: undefined,
          repo: undefined,
        })
      );
    });

    test("should be undefined if cannot find github URL", async () => {
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

      await hooks.beforeRun.promise({} as any);

      expect(await hooks.getRepository.promise()).toStrictEqual(
        expect.objectContaining({
          owner: undefined,
          repo: undefined,
        })
      );
    });

    test("should be undefined if cannot parse github URL", async () => {
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

      await hooks.beforeRun.promise({} as any);

      expect(await hooks.getRepository.promise()).toStrictEqual(
        expect.objectContaining({
          owner: undefined,
          repo: undefined,
        })
      );
    });
  });

  describe("getPreviousVersion", () => {
    test("should get previous version from pom.xml", async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <version>1.0.0-SNAPSHOT</version>
        </project>
      `);

      await hooks.beforeRun.promise({} as any);

      expect(await hooks.getPreviousVersion.promise()).toBe("v1.0.0");
    });

    test("should be undefined when no version in pom.xml", async () => {
      mockRead("");
      expect(await hooks.getPreviousVersion.promise()).toBe("v0.0.0.0");
    });
  });

  describe("version", () => {
    test("should version release - not versioned because of pre-patched snapshot", async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <version>1.0.0-SNAPSHOT</version>
        </project>
      `);

      await hooks.beforeRun.promise({} as any);

      await hooks.version.promise(Auto.SEMVER.patch);

      const call = exec.mock.calls[1][1];
      expect(call).toContain("tag");
      expect(call).toContain("v1.0.0");
      expect(call).toContain('"Update version to v1.0.1"');
    });

    test("should be undefined when failing to increment previous version", async () => {
      mockRead(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <version>1.0.a-SNAPSHOT</version>
        </project>
      `);

      await hooks.beforeRun.promise({} as any);

      expect(await hooks.version.promise(Auto.SEMVER.minor)).toBeUndefined();
    });
  });

  describe("publish", () => {
    test("should publish release", async () => {
      await hooks.beforeRun.promise({} as any);

      await hooks.publish.promise(Auto.SEMVER.patch);

      expect(exec.mock.calls[1][1]).toContain("deploy");
    });
  });
});
