import path from "path";
import { execSync } from "child_process";

test("bundle should function", () => {
  const binary =
    (process.platform === "win32" && "win.exe") ||
    (process.platform === "darwin" && "macos") ||
    "linux";

  // Using this command because it is unlikely to change very much
  expect(
    execSync(
      path.join(__dirname, `../binary/auto-${binary} create-labels --help`),
      {
        encoding: "utf8",
      }
    )
  ).toMatchSnapshot();
});
