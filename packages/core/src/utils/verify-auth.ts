import { spawn } from "child_process";

/**
 *
 */
export default function verifyAuth(remote: string, branch: string) {
  return new Promise<boolean>((resolve) => {
    try {
      const child = spawn(
        `git push --dry-run --no-verify ${remote} HEAD:${branch} -q`,
        {
          cwd: process.cwd(),
          env: process.env,
          detached: true,
          shell: true,
        }
      );

      let err = "";

      child.stderr.on("data", (data) => {
        err += data.toString();
      });

      child.on("exit", () => {
        resolve(
          !err.startsWith("fatal: could not read Username") &&
            !err.startsWith("ssh_askpass") &&
            !err.includes("fatal")
        );
      });
    } catch (error) {
      resolve(false);
    }
  });
}
