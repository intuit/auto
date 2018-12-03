import { ArgumentParser } from 'argparse';
import parseArgs, { addLabelParser } from '../args';

describe('root parser', () => {
  test('label', () => {
    expect(parseArgs('label --pr 2 --owner adam'.split(' '))).toEqual({
      pr: '2',
      owner: 'adam',
      repo: null,
      verbose: false,
      very_verbose: false,
      command: 'label',
      githubApi: null
    });
  });
});

describe('label', () => {
  let labelParser: ArgumentParser;

  beforeEach(() => {
    labelParser = new ArgumentParser({
      addHelp: true,
      description: 'label'
    });

    addLabelParser(labelParser);
  });

  test('gets the pr number', () => {
    expect(labelParser.parseArgs('--pr 100'.split(' ')).pr).toBe('100');
  });
  test('gets all the things', () => {
    expect(
      labelParser.parseArgs('--repo test-repo --pr 10 --owner adam'.split(' '))
    ).toEqual({
      repo: 'test-repo',
      pr: '10',
      owner: 'adam',
      verbose: false,
      very_verbose: false,
      githubApi: null
    });
  });
});
