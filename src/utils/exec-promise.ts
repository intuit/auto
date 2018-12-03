import * as childProcess from 'child_process';
import { promisify } from 'util';

const exec = promisify(childProcess.exec);

export default async function execPromise(cmd: string) {
  const { stdout, stderr } = await exec(cmd, { maxBuffer: 1024 * 1000 });

  if (stderr) {
    console.log(stderr);
  }

  return stdout.trim();
}
