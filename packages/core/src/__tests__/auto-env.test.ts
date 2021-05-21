import { Auto } from "../auto";

jest.mock("fs", () => ({
  read: () => undefined,
  readFileSync: () => 'FOO="test value"',
  closeSync: () => undefined,
  existsSync: () => true,
  readFile: () => undefined,
  ReadStream: function () {},
  WriteStream: function () {},
  writeFile: () => undefined,
}));

test("should load .env file and override and env vars that are already set", async () => {
  process.env.FOO = "old value";

  const auto = new Auto({
    owner: "foo",
    repo: "bar",
  });

  expect(auto).toBeDefined();
  expect(process.env.FOO).toBe("test value");
});
