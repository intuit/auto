import { getRepo } from "../src";

const readFile = vi.fn();

vi.mock("fs", () => ({
  readFile: (...args: unknown[]) => readFile(...args),
}));

/** Make the next package.json read return this object */
const mockPackageJson = (json: Record<string, unknown>) =>
  readFile.mockImplementationOnce(
    (
      _path: string,
      _encoding: string,
      callback: (error: null, data: string) => void
    ) => callback(null, JSON.stringify(json))
  );

test("should return nothing without a repo", async () => {
  mockPackageJson({});
  expect(await getRepo()).toBeUndefined();
});

test("should return nothing without an owner", async () => {
  mockPackageJson({
    repository: { url: "fake.com" },
  });

  expect(await getRepo()).toBeUndefined();
});

test("should return nothing without an package name", async () => {
  mockPackageJson({
    repository: { url: "fake.com" },
  });

  expect(await getRepo()).toBeUndefined();
});

test("should correctly parse package info", async () => {
  mockPackageJson({
    version: "1.0.0",
    repository: { url: "https://github.com/black-panther/operation-foo" },
  });

  expect(await getRepo()).toStrictEqual({
    repo: "operation-foo",
    owner: "black-panther",
  });
});

test("should correctly parse package info - string", async () => {
  mockPackageJson({
    version: "1.0.0",
    repository: "black-panther/operation-foo",
  });

  expect(await getRepo()).toStrictEqual({
    repo: "operation-foo",
    owner: "black-panther",
  });
});
