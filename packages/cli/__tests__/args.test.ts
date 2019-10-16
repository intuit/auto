import parseArgs from '../src/parse-args';

const log = jest.fn();
// @ts-ignore
global.console = { log };

describe('root parser', () => {
  beforeEach(() => {
    log.mockClear();
  });

  test('should print version', () => {
    parseArgs('--version'.split(' '));
    expect(log).toHaveBeenCalled();
  });

  test('should print help', () => {
    parseArgs('--help'.split(' '));
    expect(log).toHaveBeenCalled();
  });

  test('should print help for simple command', () => {
    parseArgs('init --help'.split(' '));
    expect(log).toHaveBeenCalled();
  });

  test('should print help for complex command', () => {
    parseArgs('pr --help'.split(' '));
    expect(log).toHaveBeenCalled();
  });

  test('should exit when required arg is not included', () => {
    process.exit = jest.fn() as any;
    parseArgs(['pr-status']);
    expect(process.exit).toHaveBeenCalled();
  });

  test('should exit when required string is provided as flag', () => {
    process.exit = jest.fn() as any;
    parseArgs(['pr-check', '--pr', '24', '--url']);
    expect(process.exit).toHaveBeenCalled();
  });

  test('should parse just provided args', () => {
    expect(parseArgs('label --pr 2 --owner adam'.split(' '))).toStrictEqual([
      'label',
      {
        pr: 2,
        owner: 'adam'
      }
    ]);
  });

  test('should parse args as camelCase', () => {
    expect(parseArgs('changelog -d'.split(' '))).toStrictEqual([
      'changelog',
      {
        dryRun: true
      }
    ]);
  });

  test('error when on in array of options to is not present', () => {
    process.exit = jest.fn() as any;
    parseArgs(['comment']);
    expect(process.exit).toHaveBeenCalled();
  });

  test('allow array of options to or', () => {
    expect(parseArgs(['comment', '--message', 'foo'])).toStrictEqual([
      'comment',
      {
        message: 'foo'
      }
    ]);
  });

  test('allow edit in comment', () => {
    expect(parseArgs(['comment', '--edit', '--message', 'foo'])).toStrictEqual([
      'comment',
      {
        edit: true,
        message: 'foo'
      }
    ]);
  });
});
