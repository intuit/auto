import { spawn } from "child_process";
import createLog from "./logger";

const log = createLog();

/**
 *
 */
export default function verifyAuth(
  remote: string,
  branch: string,
  timeoutSeconds = 5
) {
  return new Promise<boolean>((resolve) => {
    let timeout: NodeJS.Timeout | null = null;

    /** Clear the timeout timeout */
    const clear = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };

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

      timeout = setTimeout(() => {
        // Kill the spawned process and it's children
        process.kill(-child.pid);
        log.veryVerbose.info(
          `verifyAuth timed out after ${timeoutSeconds}s`
        );
        resolve(false);
      }, timeoutSeconds * 1000);

      let err = "";

      child.stderr.on("data", (data) => {
        err += data.toString();
      });

      child.on("exit", () => {
        clear();
        resolve(
          !err.startsWith("fatal: could not read Username") &&
            !err.startsWith("ssh_askpass") &&
            !err.includes("fatal")
        );
      });
    } catch (error) {
      clear();
      resolve(false);
    }
  });
}
