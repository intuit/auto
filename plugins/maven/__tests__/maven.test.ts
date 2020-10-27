import * as Auto from "@auto-it/core";
import { dummyLog } from "@auto-it/core/dist/utils/logger";
import { makeHooks } from "@auto-it/core/dist/utils/make-hooks";
import MavenPlugin, { IMavenPluginOptions } from "../src";
import { execSync } from "child_process";
import * as glob from "fast-glob";

const exec = jest.fn();
const existsSync = jest.fn();
const mkdirSync = jest.fn();
const readFile = jest.fn();
const readFileSync = jest.fn();
const writeFile = jest.fn();
const writeFileSync = jest.fn();

jest.mock("fs", () => ({
  // @ts-ignore
  existsSync: (...args) => existsSync(...args),
  // @ts-ignore
  mkdirSync: (...args) => mkdirSync(...args),
  // @ts-ignore
  readFileSync: (...args) => readFileSync(...args),
  // @ts-ignore
  writeFileSync: (...args) => writeFileSync(...args),
  // @ts-ignore
  readFile: (...args) => readFile(...args),
  // @ts-ignore
  writeFile: (...args) => writeFile(...args),
  ReadStream: function () {},
  WriteStream: function () {},
  // @ts-ignore
  closeSync: () => undefined,
}));

jest.mock("child_process");
jest.mock("fast-glob");

const mockGlob = (result: string[]) =>
  jest.spyOn(glob, "sync").mockImplementation(() => result);

const mockReadFile = (result: string) =>
  readFile.mockImplementation((path, options, callback) =>
    callback(undefined, result)
  );

// @ts-ignore
execSync.mockImplementation(exec);

jest.mock(
  "../../../packages/core/dist/utils/exec-promise",
  () => (...args: any[]) => exec(...args)
);

describe("maven", () => {
  let hooks: Auto.IAutoHooks;
  const prefixRelease: (a: string) => string = jest.fn(
    (version) => `v${version}`
  );
  const options: IMavenPluginOptions = {};

  beforeEach(() => {
    jest.clearAllMocks();
    const plugin = new MavenPlugin(options);
    hooks = makeHooks();
    plugin.apply({ hooks, logger: dummyLog(), prefixRelease } as Auto.Auto);
  });

  describe("getAuthor", () => {
    test("should get author from pom.xml", async () => {
      mockReadFile(`
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
      mockReadFile(`
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

    test("author should be undefined if not found in pom.xml", async () => {
      mockReadFile(`
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
      mockReadFile(`
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
      mockReadFile(`
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
      mockReadFile(`
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
      mockReadFile(`
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
      mockReadFile(`
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
      mockReadFile("");
      expect(await hooks.getPreviousVersion.promise()).toBe("v0.0.0");
    });
  });

  describe("version", () => {
    test("should version release - not versioned because of pre-patched snapshot", async () => {
      mockReadFile(`
          <project
            xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
            <version>1.0.0-SNAPSHOT</version>
          </project>
        `);

      await hooks.beforeRun.promise({} as any);

      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      const call = exec.mock.calls[0][1];
      expect(call).toContain("tag");
      expect(call).toContain("v1.0.0");
      expect(call).toContain('"Update version to v1.0.0"');
    });

    test("should version release", async () => {
      mockReadFile(`
          <project
            xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
            <version>1.0.0</version>
          </project>
        `);

      await hooks.beforeRun.promise({} as any);

      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      const call = exec.mock.calls[0][1];
      expect(call).toContain("tag");
      expect(call).toContain("v1.0.1");
      expect(call).toContain('"Update version to v1.0.1"');
    });

    test("should replace the previousVersion with the newVersion", async () => {
      const oldPomXml = `<project
                  xmlns="http://maven.apache.org/POM/4.0.0"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
                  <version>1.0.0-SNAPSHOT</version>
                </project>`;
      const newPomXml = `<project
    xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd"
>
    <version>1.0.0</version>
</project>
`;

      mockGlob(["pom.xml"]);
      mockReadFile(oldPomXml);

      await hooks.beforeRun.promise({} as any);
      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(await readFile).toHaveBeenCalledTimes(4);
      expect(await readFile).toHaveBeenLastCalledWith(
        "pom.xml",
        { encoding: "utf8" },
        expect.anything()
      );
      expect(await writeFile).toHaveBeenCalledWith(
        "pom.xml",
        newPomXml,
        { encoding: "utf8" },
        expect.anything()
      );
    });

    test("should detect the versions-maven-plugin and use the newVersion", async () => {
      mockReadFile(`<project
                  xmlns="http://maven.apache.org/POM/4.0.0"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
                  <version>1.0.0-SNAPSHOT</version>
                  <build>
                    <plugins>
                      <plugin>
                        <groupId>org.codehaus.mojo</groupId>
                        <artifactId>versions-maven-plugin</artifactId>
                        <version>2.7</version>
                      </plugin>
                    </plugins>
                  </build>
                </project>`);

      await hooks.beforeRun.promise({} as any);
      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(await readFile).toHaveBeenCalledTimes(3);
      expect(await readFile).toHaveBeenLastCalledWith(
        "pom.xml",
        { encoding: "utf8" },
        expect.anything()
      );

      const call = exec.mock.calls[0][1];
      expect(call).toContain("versions:set");
      expect(call).toContain("-DgenerateBackupPoms=false");
      expect(call).toContain("-DnewVersion=1.0.0");
    });

    test("should replace the parent previousVersion with the newVersion", async () => {
      const oldParentPomXml = `<project
                  xmlns="http://maven.apache.org/POM/4.0.0"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
                  <version>1.0.0-SNAPSHOT</version>
                </project>`;

      const oldChildPomXml = `<project
                  xmlns="http://maven.apache.org/POM/4.0.0"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
                  <parent>
                    <version>1.0.0-SNAPSHOT</version>
                  </parent>
                </project>`;

      const newPomXml = `<project
    xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd"
>
    <parent>
        <version>1.0.0</version>
    </parent>
</project>
`;

      mockGlob(["pom.xml", "child/pom.xml"]);
      readFile.mockImplementation((path, options, callback) => {
        if (path === "pom.xml") {
          callback(undefined, oldParentPomXml);
          // eslint-disable-next-line jest/no-if
        } else if (path === "child/pom.xml") {
          callback(undefined, oldChildPomXml);
        }
      });

      await hooks.beforeRun.promise({} as any);
      await hooks.version.promise({ bump: Auto.SEMVER.patch });

      expect(await readFile).toHaveBeenCalledTimes(5);
      expect(await readFile).toHaveBeenLastCalledWith(
        "child/pom.xml",
        { encoding: "utf8" },
        expect.anything()
      );
      expect(await writeFile).toHaveBeenCalledTimes(2);
      expect(await writeFile).toHaveBeenLastCalledWith(
        "child/pom.xml",
        newPomXml,
        { encoding: "utf8" },
        expect.anything()
      );
    });

    test("should be undefined when failing to increment previous version", async () => {
      mockReadFile(`
          <project
            xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
            <version>1.0.a-SNAPSHOT</version>
          </project>
        `);

      await hooks.beforeRun.promise({} as any);

      expect(
        await hooks.version.promise({ bump: Auto.SEMVER.minor })
      ).toBeUndefined();
    });
  });

  describe("publish", () => {
    test("should publish release", async () => {
      mockReadFile(`
        <project
          xmlns="http://maven.apache.org/POM/4.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
          <version>1.0.0-SNAPSHOT</version>
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
          <scm>
            <connection>scm:git:https://foo.com</connection>
            <url>https://foo.com</url>
            <tag>HEAD</tag>
          </scm>
        </project>
      `);

      await hooks.beforeRun.promise({} as any);

      await hooks.publish.promise({ bump: Auto.SEMVER.patch });

      expect(exec.mock.calls[0][1]).toContain("deploy");
    });
  });
});
