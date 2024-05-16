import path from "path";
import { execSync } from "child_process";

test("bundle should function", () => {
  const type =
    (process.platform === "win32" && "win.exe") ||
    (process.platform === "darwin" && "macos") ||
    "linux";

  const { arch } = process;
  const zip = path.join(__dirname, `../binary/auto-${type}-${arch}`);
  const binary = path.join(__dirname, "../auto");

  execSync(`gunzip -c ${zip} > ${binary}`);
  execSync(`chmod +x ${binary}`);

  expect(
    // Using this command because it is unlikely to change very much
    execSync(`${binary} create-labels --help`, {
      encoding: "utf8",
    })
  ).toMatchSnapshot();

  execSync(`rm ${binary}`);
});
