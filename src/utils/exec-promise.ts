import { spawn } from 'child_process';

/**
 * Wraps up running a command into a single promise,
 * returning the stdout as a string if the command succeeds
 * and throwing if it does not.
 *
 * @param cmd the command as a string to pass in
 */
export default async function execPromise(cmd: string, args?: string[]) {
  return new Promise<string>((completed, reject) => {
    const child = spawn(cmd, args || [], {
      cwd: process.cwd(),
      env: process.env,
      shell: true
    });

    let allStdout = '';
    child.stdout.on('data', async data => {
      const stdout = data.toString();
      allStdout += stdout;
    });

    let allStderr = '';
    child.stderr.on('data', data => {
      const stderr = data.toString();
      allStderr += stderr;
    });

    // This usually occurs during dev-time, when you have the wrong command
    child.on('error', err => {
      reject(
        new Error(`Failed to run '${cmd}' - ${err.message} \n\n\n${allStderr}`)
      );
    });

    child.on('exit', code => {
      // No code, no errors
      if (!code) {
        // Tools can occasionally print to stderr but not fail, so print that just in case.
        if (allStderr.length) {
          console.log(allStderr);
        }
        // Resolve the string of the whole stdout
        completed(allStdout.trim());
      } else {
        // The command bailed for whatever reason, print a verbose error message
        // with the stdout underneath
        let appendedStdErr = '';
        appendedStdErr = allStdout.length ? `\n\n${allStdout}` : '';
        appendedStdErr = allStderr.length ? `\n\n${allStderr}` : '';

        reject(new Error(`Running command '${cmd}' failed${appendedStdErr}`));
      }
    });
  });
}
