import { getVersionMap } from '../release';
import SEMVER, { calculateSemVerBump, getHigherSemverTag } from '../semver';

const semverMap = getVersionMap();

test('ranks releases right', () => {
  expect(getHigherSemverTag(SEMVER.major, 'minor')).toBe('major');
  expect(getHigherSemverTag(SEMVER.noVersion, 'bar')).toBe('patch');
  expect(getHigherSemverTag(SEMVER.minor, 'patch')).toBe('minor');
});

describe('calculateSemVerBump', () => {
  test('should be able to use multiple labels for skip-release', () => {
    expect(
      calculateSemVerBump([['skip-release', 'major']], semverMap, {
        skipReleaseLabels: ['documentation']
      })
    ).toBe(SEMVER.noVersion);

    expect(
      calculateSemVerBump([['documentation', 'major']], semverMap, {
        skipReleaseLabels: ['documentation']
      })
    ).toBe(SEMVER.noVersion);

    expect(
      calculateSemVerBump([['major']], semverMap, {
        skipReleaseLabels: ['documentation']
      })
    ).toBe(SEMVER.major);
  });
});
