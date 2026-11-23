import parseArgs from "../src/parse-args";
import { runCli } from "../src/run";

vi.mock("../src/run", () => ({ runCli: vi.fn() }));

const run = vi.mocked(runCli);
const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
const exit = vi
  .spyOn(process, "exit")
  .mockImplementation((() => undefined) as never);

/** Everything printed with console.info, e.g. help */
const printed = () => info.mock.calls.flat().join("\n");

/** The options the command ran with */
const optionsFor = async (args: string) => {
  await parseArgs(args.split(" "));
  expect(run).toHaveBeenCalledTimes(1);

  return run.mock.calls[0][1] as Record<string, unknown>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("help and version", () => {
  test("should print version", async () => {
    await parseArgs(["--version"]);
    expect(printed()).toMatch(/^auto\/\d+\.\d+\.\d+/);
    expect(run).not.toHaveBeenCalled();
  });

  test("should print grouped help", async () => {
    await parseArgs(["--help"]);
    const help = printed();

    expect(help).toContain("Setup Command:");
    expect(help).toContain("Pull Request Interaction Commands:");
    expect(help).toContain("Release Commands:");
    expect(help).toContain("Global Options:");
    // Only the first line of a multi-line description
    expect(help).toContain("Context aware publishing.");
    expect(help).not.toContain("call from base branch");
    expect(run).not.toHaveBeenCalled();
  });

  test("should print help for simple command", async () => {
    await parseArgs(["init", "--help"]);
    expect(printed()).toContain(
      "Interactive setup for minimum working configuration."
    );
    expect(run).not.toHaveBeenCalled();
  });

  test("should print help for complex command", async () => {
    await parseArgs(["shipit", "--help"]);
    const help = printed();

    expect(help).toContain("call from base branch");
    const own = help.indexOf("\nOptions:");
    const global = help.indexOf("Global Options:");

    // shipit's own options, then the global ones
    expect(own).toBeGreaterThan(-1);
    expect(help.indexOf("--dry-run")).toBeGreaterThan(own);
    expect(help.indexOf("--dry-run")).toBeLessThan(global);
    expect(help.indexOf("--verbose")).toBeGreaterThan(global);
    expect(help).not.toContain("(default: true)");
    expect(help).toContain("$ auto shipit");
  });
});

describe("bad input", () => {
  test("should exit when required arg is not included", async () => {
    await parseArgs(["pr-status"]);
    expect(log).toHaveBeenCalledWith(
      "Missing required args: --state, --url, --description, --context"
    );
    expect(exit).toHaveBeenCalledWith(1);
    expect(run).not.toHaveBeenCalled();
  });

  test("should exit when required string is provided as flag", async () => {
    await parseArgs(["pr-check", "--pr", "24", "--url"]);
    expect(exit).toHaveBeenCalledWith(1);
    expect(run).not.toHaveBeenCalled();
  });

  test("error when on in array of options to is not present", async () => {
    await parseArgs(["comment"]);
    expect(log).toHaveBeenCalledWith(
      "Missing required arg: (--message or --delete)"
    );
    expect(exit).toHaveBeenCalledWith(1);
  });

  test("should exit on an unknown command", async () => {
    await parseArgs(["shpit"]);
    expect(log).toHaveBeenCalledWith('Found unknown command: "shpit"');
    expect(printed()).toContain("Release Commands:");
    expect(exit).toHaveBeenCalledWith(1);
    expect(run).not.toHaveBeenCalled();
  });

  test("should exit with no command", async () => {
    await parseArgs([]);
    expect(printed()).toContain("Release Commands:");
    expect(exit).toHaveBeenCalledWith(1);
    expect(run).not.toHaveBeenCalled();
  });

  test("should exit on an unknown flag", async () => {
    await parseArgs(["shipit", "--foo"]);
    expect(error).toHaveBeenCalled();
    expect(error.mock.calls[0][1]).toContain("--foo");
    expect(exit).toHaveBeenCalledWith(1);
    expect(run).not.toHaveBeenCalled();
  });

  test("should not take space separated values for one flag", async () => {
    await parseArgs(["shipit", "--plugins", "a", "b"]);
    expect(error.mock.calls[0][1]).toContain("Unused args");
    expect(exit).toHaveBeenCalledWith(1);
  });
});

describe("parsed options", () => {
  test("should parse just provided args", async () => {
    expect(await optionsFor("label --pr 2 --owner adam")).toStrictEqual(
      expect.objectContaining({ pr: 2, owner: "adam" })
    );
    expect(run.mock.calls[0][0]).toBe("label");
  });

  test("should parse args as camelCase", async () => {
    expect(await optionsFor("changelog -d")).toStrictEqual(
      expect.objectContaining({ dryRun: true })
    );
  });

  test("allow array of options to or", async () => {
    expect(await optionsFor("comment --message foo")).toStrictEqual(
      expect.objectContaining({ message: "foo" })
    );
  });

  test("allow edit in comment", async () => {
    expect(await optionsFor("comment --edit --message foo")).toStrictEqual(
      expect.objectContaining({ edit: true, message: "foo" })
    );
  });

  test("verbose is a list, counted per flag", async () => {
    expect((await optionsFor("shipit -v")).verbose).toStrictEqual([true]);
    run.mockClear();
    expect((await optionsFor("shipit -vv")).verbose).toStrictEqual([
      true,
      true,
    ]);
  });

  test("global options work before the command", async () => {
    expect((await optionsFor("-v shipit")).verbose).toStrictEqual([true]);
  });

  test("plugins is a list", async () => {
    expect((await optionsFor("shipit --plugins a")).plugins).toStrictEqual([
      "a",
    ]);
    run.mockClear();
    expect(
      (await optionsFor("shipit --plugins a --plugins b")).plugins
    ).toStrictEqual(["a", "b"]);
  });

  test("--no-* flags pass both forms when typed", async () => {
    expect(await optionsFor("changelog --no-git-commit")).toStrictEqual(
      expect.objectContaining({ gitCommit: false, noGitCommit: true })
    );
  });

  test("--no-* flags pass neither form when not typed", async () => {
    const options = await optionsFor("shipit");

    // `changelog: true` would replace the .autorc changelog section
    expect(options).not.toHaveProperty("changelog");
    expect(options).not.toHaveProperty("noChangelog");
    expect(options).not.toHaveProperty("versionPrefix");
    expect(options).not.toHaveProperty("noVersionPrefix");
  });

  test("text values that look like numbers stay text", async () => {
    const options = await optionsFor("canary --message 123 --build 5 --pr 123");

    expect(options.message).toBe("123");
    expect(options.build).toBe("5");
    expect(options.pr).toBe(123);
  });

  test("declared defaults are passed", async () => {
    expect((await optionsFor("canary")).target).toBe("pr-body");
    run.mockClear();
    expect((await optionsFor("pr-check --url foo")).context).toBe(
      "ci/pr-check"
    );
    run.mockClear();
    expect((await optionsFor("shipit")).onlyGraduateWithReleaseLabel).toBe(
      false
    );
  });
});
