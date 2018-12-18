import { VersionLabel } from './github-release';

enum SEMVER {
  major = 'major',
  premajor = 'premajor',
  minor = 'minor',
  preminor = 'preminor',
  patch = 'patch',
  prepatch = 'prepatch',
  noVersion = ''
}

export type IVersionLabels = Map<VersionLabel, string>;

export default SEMVER;

export function getHigherSemverTag(left: string, right: string): SEMVER {
  if (left === SEMVER.major || right === SEMVER.major) {
    return SEMVER.major;
  }

  if (left === SEMVER.minor || right === SEMVER.minor) {
    return SEMVER.minor;
  }

  return SEMVER.patch;
}

interface ISemVerOptions {
  onlyPublishWithReleaseLabel?: boolean;
  skipReleaseLabels?: string[];
}

export function calculateSemVerBump(
  labels: string[][],
  labelMap: IVersionLabels,
  { onlyPublishWithReleaseLabel, skipReleaseLabels = [] }: ISemVerOptions = {}
) {
  const labelSet = new Set<string>();

  if (!skipReleaseLabels.includes(labelMap.get('skip-release')!)) {
    skipReleaseLabels.push(labelMap.get('skip-release')!);
  }

  labels.map(pr =>
    pr.forEach(label => {
      const userLabel = [...labelMap.entries()].find(pair => pair[1] === label);
      labelSet.add(userLabel ? userLabel[0] : label);
    })
  );

  let skipRelease = false;
  let isPrerelease = false;

  if (labels.length > 0 && labels[0].length > 0) {
    isPrerelease = labels[0].includes(labelMap.get('prerelease')!);
    skipRelease = onlyPublishWithReleaseLabel
      ? !labels[0].includes(labelMap.get('release')!)
      : !!labels[0].find(label => skipReleaseLabels.includes(label));
  }

  const version = [...labelSet].reduce(
    (semver: SEMVER, nextLabel) => getHigherSemverTag(semver, nextLabel),
    SEMVER.patch
  );

  if (skipRelease) {
    return SEMVER.noVersion;
  }

  if (isPrerelease) {
    if (version === SEMVER.major) {
      return SEMVER.premajor;
    }

    if (version === SEMVER.minor) {
      return SEMVER.preminor;
    }

    return SEMVER.prepatch;
  }

  return version;
}
