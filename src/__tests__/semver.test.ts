import { defaultLabels } from '../release';
import SEMVER, { calculateSemVerBump, getHigherSemverTag } from '../semver';

test('ranks releases right', () => {
  expect(getHigherSemverTag(SEMVER.major, 'minor')).toBe('major');
  expect(getHigherSemverTag(SEMVER.noVersion, 'bar')).toBe('patch');
  expect(getHigherSemverTag(SEMVER.minor, 'patch')).toBe('minor');
});

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

  test('should be able to use multiple labels for skip-release', () => {
    expect(
      calculateSemVerBump([['skip-release', 'major']], defaultLabels, {
        skipReleaseLabels: ['documentation']
      })
    ).toBe(SEMVER.noVersion);

    expect(
      calculateSemVerBump([['documentation', 'major']], defaultLabels, {
        skipReleaseLabels: ['documentation']
      })
    ).toBe(SEMVER.noVersion);

    expect(
      calculateSemVerBump([['major']], defaultLabels, {
        skipReleaseLabels: ['documentation']
      })
    ).toBe(SEMVER.major);
  });
});
