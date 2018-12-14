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
}

export function calculateSemVerBump(
  labels: string[][],
  labelMap: IVersionLabels,
  { onlyPublishWithReleaseLabel }: ISemVerOptions = {}
) {
  const labelSet = new Set<string>();

  labels.map(pr =>
    pr.forEach(label => {
      const userLabel = [...labelMap.entries()].find(pair => pair[1] === label);
      labelSet.add(userLabel ? userLabel[0] : label);
    })
  );

  let noRelease = false;
  let isPrerelease = false;

  if (labels.length > 0 && labels[0].length > 0) {
    isPrerelease = labels[0].includes(labelMap.get('prerelease')!);
    noRelease = onlyPublishWithReleaseLabel
      ? !labels[0].includes(labelMap.get('release')!)
      : labels[0].includes(labelMap.get('no-release')!);
  }

  const version = [...labelSet].reduce(
    (semver: SEMVER, nextLabel) => getHigherSemverTag(semver, nextLabel),
    SEMVER.patch
  );

  if (noRelease) {
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
