import signale, { Signale } from 'signale';

export interface ILogger {
  /** The level at which to log messages */
  logLevel: LogLevel;
  /** The default logger. Always on */
  log: signale.Signale<signale.DefaultMethods>;
  /** The verbose log. Has more debug logs */
  verbose: signale.Signale<signale.DefaultMethods>;
  /** The very verbose log. Has all debug logs */
  veryVerbose: signale.Signale<signale.DefaultMethods>;
}

/** Create a dummy logger for testing. */
export function dummyLog(): ILogger {
  return {
    logLevel: undefined,
    log: new Signale({ disabled: true }),
    verbose: new Signale({ disabled: true }),
    veryVerbose: new Signale({ disabled: true })
  };
}

export type LogLevel = 'verbose' | 'veryVerbose' | undefined;

/** Create a logger the the given log level. */
export default function createLog(mode: LogLevel): ILogger {
  return {
    logLevel: mode,
    log: new Signale(),
    verbose: new Signale({
      disabled: mode !== 'verbose' && mode !== 'veryVerbose'
    }),
    veryVerbose: new Signale({
      disabled: mode !== 'veryVerbose'
    })
  };
}
