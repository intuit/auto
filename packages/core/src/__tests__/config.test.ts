import Config, { normalizeLabel, normalizeLabels } from "../config";
import { dummyLog } from "../utils/logger";
import SEMVER, { ILabelDefinition } from "../semver";

const fetchSpy = jest.fn();

// @ts-ignore
jest.mock("node-fetch", () => (...args) => fetchSpy(...args));

beforeEach(() => {
  fetchSpy.mockClear();
});

const log = dummyLog();

const importMock = jest.fn();
jest.mock("import-cwd", () => {
  return (path: any) => importMock(path);
});

describe("normalizeLabel", () => {
  test("should extend base label", () => {
    const label: ILabelDefinition = {
      name: "foo",
      releaseType: SEMVER.major,
    };

    expect(normalizeLabel(label)).toStrictEqual({
      description: "Increment the major version when merged",
      color: "#C5000B",
      name: "foo",
      changelogTitle: "💥 Breaking Change",
      releaseType: SEMVER.major,
    });
  });
});

describe("normalizeLabels", () => {
  test("user labels should override defaults", () => {
    expect(normalizeLabels({}).find((l) => l.name === "minor")).toStrictEqual({
      description: "Increment the minor version when merged",
      color: "#F1A60E",
      name: "minor",
      changelogTitle: "🚀 Enhancement",
      releaseType: SEMVER.minor,
    });

    expect(
      normalizeLabels({ labels: [{ name: "foo", releaseType: "minor" }] }).find(
        (l) => l.name === "foo"
      )
    ).toStrictEqual({
      description: "Increment the minor version when merged",
      color: "#F1A60E",
      name: "foo",
      changelogTitle: "🚀 Enhancement",
      releaseType: SEMVER.minor,
    });
  });
});

describe("loadExtendConfig", () => {
  test("should reject when no config found", async () => {
    const config = new Config(log);
    await expect(config.loadExtendConfig("nothing")).rejects.toBeInstanceOf(
      Error
    );
  });

  test("should load file path", async () => {
    const config = new Config(log);

    importMock.mockImplementation((path) =>
      path === "../fake/path.json" ? { someOption: "url" } : undefined
    );
    expect(await config.loadExtendConfig("../fake/path.json")).toStrictEqual({
      someOption: "url",
    });
  });

  test("should load package.json file from path", async () => {
    const config = new Config(log);

    importMock.mockImplementation((path) =>
      path === "./package.json" ? { auto: { someOption: "url" } } : undefined
    );
    expect(await config.loadExtendConfig("./package.json")).toStrictEqual({
      someOption: "url",
    });
  });

  test("should fail if file path points to js file", async () => {
    const config = new Config(log);
    importMock.mockImplementation((path) =>
      path === "../fake/path.js" ? { someOption: "url" } : undefined
    );
    await expect(
      config.loadExtendConfig("../fake/path.js")
    ).rejects.toBeInstanceOf(Error);
  });

  test("should call fetch on URL with config", async () => {
    const config = new Config(log);
    const mockFetchJson = jest.fn();
    mockFetchJson.mockReturnValue({});

    fetchSpy.mockResolvedValueOnce({
      json: mockFetchJson,
    });

    await config.loadExtendConfig("http://www.test.com/config.json");
    expect(fetchSpy).toHaveBeenCalled();
    expect(mockFetchJson).toHaveBeenCalled();
  });

  test("should reject if extends URL fails to fetch", async () => {
    const config = new Config(log);

    fetchSpy.mockRejectedValueOnce(new Error());
    await expect(
      config.loadExtendConfig("http://www.test.com/config.json")
    ).rejects.toBeInstanceOf(Error);
  });

  test("should load @NAME/auto-config", async () => {
    const config = new Config(log);

    importMock.mockImplementation((path) =>
      path === "@artsy/auto-config/package.json"
        ? { auto: { onlyPublishWithReleaseLabel: true } }
        : undefined
    );

    expect(await config.loadExtendConfig("@artsy")).toStrictEqual({
      extends: "@artsy/auto-config/package.json",
      onlyPublishWithReleaseLabel: true,
    });
  });

  test("should load auto-config-NAME", async () => {
    const config = new Config(log);

    importMock.mockImplementation((path) =>
      path === "auto-config-fuego/package.json"
        ? { auto: { noVersionPrefix: true } }
        : undefined
    );

    expect(await config.loadExtendConfig("fuego")).toStrictEqual({
      extends: "auto-config-fuego/package.json",
      noVersionPrefix: true,
    });
  });

  test("should load an npm module", async () => {
    const config = new Config(log);

    importMock.mockImplementation((path) =>
        path === "auto-config-from-module"
            ? { noVersionPrefix: true }
            : undefined
    );

    expect(await config.loadExtendConfig("auto-config-from-module")).toStrictEqual({
      extends: "auto-config-from-module",
      noVersionPrefix: true,
    });
  });
});
