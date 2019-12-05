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

export type IVersionLabels = Map<VersionLabel, string[]>;

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
  const skipReleaseLabels = labelMap.get('skip-release') || [];

  labels.forEach(pr => {
    pr.forEach(label => {
      const userLabel = [...labelMap.entries()].find(pair =>
        pair[1].includes(label)
      );
      labelSet.add(userLabel ? userLabel[0] : label);
    });
  });

  let skipRelease = false;

  if (labels.length > 0 && labels[0].length > 0) {
    const releaseLabels = labelMap.get('release') || [];

    skipRelease = onlyPublishWithReleaseLabel
      ? !labels[0].some(label => releaseLabels.includes(label))
      : labels[0].some(label => skipReleaseLabels.includes(label));
  }

  const version = [...labelSet].reduce(getHigherSemverTag, SEMVER.patch);

  if (skipRelease) {
    return SEMVER.noVersion;
  }

  return version;
}
