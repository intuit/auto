import parseArgs from '../args';

describe('root parser', () => {
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

  test('should throw when required arg is not included', () => {
    expect(() => parseArgs(['pr'])).toThrow();
  });

  test('should parse just provided args', () => {
    expect(parseArgs('label --pr 2 --owner adam'.split(' '))).toEqual({
      pr: 2,
      owner: 'adam',
      command: 'label'
    });
  });
});

// describe('label', () => {
//   let labelParser: ArgumentParser;

//   beforeEach(() => {
//     labelParser = new ArgumentParser({
//       addHelp: true,
//       description: 'label'
//     });

//     addLabelParser(labelParser);
//   });

//   test('gets the pr number', () => {
//     expect(labelParser.parseArgs('--pr 100'.split(' ')).pr).toBe('100');
//   });
//   test('gets all the things', () => {
//     expect(
//       labelParser.parseArgs('--repo test-repo --pr 10 --owner adam'.split(' '))
//     ).toEqual({
//       repo: 'test-repo',
//       pr: '10',
//       owner: 'adam',
//       verbose: false,
//       very_verbose: false,
//       githubApi: null
//     });
//   });
// });
