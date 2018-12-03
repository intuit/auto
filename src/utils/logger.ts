import { Signale } from 'signale';

export function dummyLog() {
  return {
    log: new Signale({ disabled: true }),
    verbose: new Signale({ disabled: true }),
    veryVerbose: new Signale({ disabled: true })
  };
}

export default function createLog(mode: 'verbose' | 'veryVerbose' | undefined) {
  return {
    log: new Signale(),
    verbose: new Signale({
      disabled: mode !== 'verbose' && mode !== 'veryVerbose'
    }),
    veryVerbose: new Signale({
      disabled: mode !== 'veryVerbose'
    })
  };
}
