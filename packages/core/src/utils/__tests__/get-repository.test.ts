import execPromise from "../exec-promise";
import getRepository from "../get-repository";

const execSpy = execPromise as jest.Mock;
// @ts-ignore
jest.mock("../exec-promise.ts");

describe("getRepository", () => {
  test("should do nothing without a configured remote", async () => {
    execSpy.mockReturnValueOnce(Promise.resolve(""));
    expect(await getRepository()).toBeUndefined();
  });

  test("should do nothing if parsing origin fails", async () => {
    execSpy.mockReturnValueOnce(Promise.resolve("foo"));
    expect(await getRepository()).toBeUndefined();
  });

  test("should return owner/repo if possible", async () => {
    execSpy.mockReturnValueOnce(Promise.resolve("foo/bar"));
    expect(await getRepository()).toStrictEqual({
      owner: "foo",
      repo: "bar",
    });
  });
});
