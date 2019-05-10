import parseArgs from '../args';

describe('root parser', () => {
  test('should print version', () => {
    console.log = jest.fn();

    parseArgs('--version'.split(' '));

    expect(console.log).toHaveBeenCalled();
  });

  test('should print help', () => {
    console.log = jest.fn();

    parseArgs('--help'.split(' '));

    expect(console.log).toHaveBeenCalled();
  });

  test('should print help for simple command', () => {
    console.log = jest.fn();

    parseArgs('init --help'.split(' '));

    expect(console.log).toHaveBeenCalled();
  });

  test('should print help for complex command', () => {
    console.log = jest.fn();

    parseArgs('pr --help'.split(' '));

    expect(console.log).toHaveBeenCalled();
  });

  test('should exit when required arg is not included', () => {
    process.exit = jest.fn() as any;
    parseArgs(['pr']);
    expect(process.exit).toHaveBeenCalled();
  });

  test('should exit when required string is provided as flag', () => {
    console.log = jest.fn() as any;
    process.exit = jest.fn() as any;
    parseArgs(['pr-check', '--pr', '24', '--url']);
    expect(process.exit).toHaveBeenCalled();
  });

  test('should parse just provided args', () => {
    expect(parseArgs('label --pr 2 --owner adam'.split(' '))).toEqual({
      pr: 2,
      owner: 'adam',
      command: 'label'
    });
  });

  test('should parse args as camelCase', () => {
    expect(parseArgs('changelog -d'.split(' '))).toEqual({
      command: 'changelog',
      dryRun: true
    });
  });

  test('error when on in array of options to is not present', () => {
    process.exit = jest.fn() as any;
    parseArgs(['comment']);
    expect(process.exit).toHaveBeenCalled();
  });

  test('allow array of options to or', () => {
    expect(parseArgs(['comment', '--message', 'foo'])).toEqual({
      command: 'comment',
      message: 'foo'
    });
  });
});
