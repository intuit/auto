import { VersionLabel } from './release';

enum SEMVER {
  major = 'major',
  premajor = 'premajor',
  minor = 'minor',
  preminor = 'preminor',
  patch = 'patch',
  prepatch = 'prepatch',
  noVersion = ''
}

export const preVersionMap = new Map([
  [SEMVER.major, SEMVER.premajor],
  [SEMVER.minor, SEMVER.preminor],
  [SEMVER.patch, SEMVER.prepatch]
]);

export type IVersionLabels = Map<VersionLabel | 'none', string[]>;

export default SEMVER;

/** Given two labels determine the next SEMVER bump. */
export function getHigherSemverTag(left: SEMVER, right: string): SEMVER {
  if (left === SEMVER.major || right === SEMVER.major) {
    return SEMVER.major;
  }

  if (left === SEMVER.minor || right === SEMVER.minor) {
    return SEMVER.minor;
  }

  return SEMVER.patch;
}

interface ISemVerOptions {
  /** Only publish changes when "release" label is present */
  onlyPublishWithReleaseLabel?: boolean;
}

/**
 * Determine the version bump from the labels on merged PRs.
 * Respects skip-release labels and the "onlyPublishWithReleaseLabel"
 * strategy.
 */
export function calculateSemVerBump(
  labels: string[][],
  labelMap: IVersionLabels,
  { onlyPublishWithReleaseLabel }: ISemVerOptions = {}
) {
  const labelSet = new Set<string>();
  const skipReleaseLabels = labelMap.get('skip') || [];

  labels.forEach(pr => {
    pr.forEach(label => {
      const userLabel = [...labelMap.entries()].find(pair =>
        pair[1].includes(label)
      );

      if (userLabel) {
        labelSet.add(userLabel[0]);
      }
    });
  });

  let skipRelease = false;

  if (labels.length > 0) {
    const releaseLabels = labelMap.get('release') || [];

    skipRelease = onlyPublishWithReleaseLabel
      ? !labels[0].some(label => releaseLabels.includes(label))
      : labels[0].some(label => skipReleaseLabels.includes(label));
  }

  // If PRs only have none or skip labels, skip the release
  const onlyNoReleaseLabels = [...labelSet].reduce(
    (condition, releaseType) =>
      condition && (releaseType === 'none' || releaseType === 'skip'),
    true
  );

  if (labelSet.size > 0 && onlyNoReleaseLabels) {
    return SEMVER.noVersion;
  }

  const version = [...labelSet].reduce(getHigherSemverTag, SEMVER.patch);

  if (skipRelease) {
    return SEMVER.noVersion;
  }

  return version;
}
