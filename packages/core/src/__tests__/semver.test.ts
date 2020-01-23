import { getVersionMap, defaultLabels } from '../release';
import SEMVER, { calculateSemVerBump, getHigherSemverTag } from '../semver';

const semverMap = getVersionMap([
  ...defaultLabels,
  { name: 'documentation', releaseType: 'skip' },
  { name: 'none', releaseType: 'none' }
]);

test('ranks releases right', () => {
  expect(getHigherSemverTag(SEMVER.major, 'minor')).toBe('major');
  expect(getHigherSemverTag(SEMVER.noVersion, 'bar')).toBe('patch');
  expect(getHigherSemverTag(SEMVER.minor, 'patch')).toBe('minor');
});

describe('calculateSemVerBump', () => {
  test('should be able to use multiple labels for skip-release', () => {
    expect(calculateSemVerBump([['skip-release', 'major']], semverMap)).toBe(
      SEMVER.noVersion
    );

    expect(calculateSemVerBump([['documentation', 'major']], semverMap)).toBe(
      SEMVER.noVersion
    );

    expect(calculateSemVerBump([['major']], semverMap)).toBe(SEMVER.major);
  });

  test('should skip none sometimes', () => {
    expect(calculateSemVerBump([['none']], semverMap)).toBe(SEMVER.noVersion);

    expect(calculateSemVerBump([['none', 'major']], semverMap)).toBe(
      SEMVER.major
    );

    expect(
      calculateSemVerBump([['none'], ['unknown'], ['documentation']], semverMap)
    ).toBe(SEMVER.noVersion);
  });

  test('should not skip things before none', () => {
    expect(calculateSemVerBump([['none'], ['major']], semverMap)).toBe(
      SEMVER.major
    );
  });

  test('should respect onlyPublishWithReleaseLabel when no labels present', () => {
    expect(
      calculateSemVerBump([[]], semverMap, {
        onlyPublishWithReleaseLabel: true
      })
    ).toBe(SEMVER.noVersion);
  });
});
