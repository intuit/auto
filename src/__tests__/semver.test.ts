import SEMVER, { calculateSemVerBump, getHigherSemverTag } from '../semver';

test('ranks releases right', () => {
  expect(getHigherSemverTag('major', 'minor')).toBe('major');
  expect(getHigherSemverTag('foo', 'bar')).toBe('patch');
  expect(getHigherSemverTag('minor', 'patch')).toBe('minor');
});

const defaultLabels = {
  major: 'major',
  minor: 'minor',
  patch: 'patch',
  'no-release': 'no-release',
  release: 'release',
  prerelease: 'prerelease'
};

describe('calculateSemVerBump', () => {
  test('publishes pre-releases', () => {
    expect(calculateSemVerBump([['minor', 'prerelease']], defaultLabels)).toBe(
      SEMVER.preminor
    );
    expect(calculateSemVerBump([['patch', 'prerelease']], defaultLabels)).toBe(
      SEMVER.prepatch
    );
    expect(calculateSemVerBump([['major', 'prerelease']], defaultLabels)).toBe(
      SEMVER.premajor
    );
  });
});
