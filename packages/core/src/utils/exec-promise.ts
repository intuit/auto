import { spawn } from 'child_process';
import createLog from './logger';

const log = createLog();

/**
 * Wraps up running a command into a single promise,
 * returning the stdout as a string if the command succeeds
 * and throwing if it does not.
 *
 * @param cmd - the command as a string to pass in
 */
export default async function execPromise(
  cmd: string,
  args: (string | undefined | false)[] = []
) {
  const callSite = new Error().stack;
  const filteredArgs = args.filter(
    (arg): arg is string => typeof arg === 'string'
  );

  return new Promise<string>((completed, reject) => {
    const child = spawn(cmd, filteredArgs, {
      cwd: process.cwd(),
      env: process.env,
      shell: true
    });

    let allStdout = '';
    let allStderr = '';

    if (child.stdout) {
      child.stdout.on('data', async (data: Buffer) => {
        const stdout = data.toString();
        allStdout += stdout;
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (data: Buffer) => {
        const stderr = data.toString();
        allStderr += stderr;
      });
    }

    // This usually occurs during dev-time, when you have the wrong command
    child.on('error', err => {
      reject(
        new Error(`Failed to run '${cmd}' - ${err.message} \n\n\n${allStderr}`)
      );
    });

    child.on('exit', code => {
      // No code, no errors
      if (code) {
        // The command bailed for whatever reason, print a verbose error message
        // with the stdout underneath
        let appendedStdErr = '';
        appendedStdErr += allStdout.length ? `\n\n${allStdout}` : '';
        appendedStdErr += allStderr.length ? `\n\n${allStderr}` : '';

        reject(
          new Error(
            `Running command '${cmd}' with args [${args.join(
              ', '
            )}] failed${appendedStdErr}`
          )
        );
        log.verbose.error('Called from:', callSite);
      } else {
        // Tools can occasionally print to stderr but not fail, so print that just in case.
        if (allStderr.length) {
          log.log.warn(allStderr);
        }

        // Resolve the string of the whole stdout
        completed(allStdout.trim());
      }
    });
  });
}
