import { VersionLabel } from "./release";
import { ReleaseCalculationOptions } from "./types";

enum SEMVER {
  major = "major",
  premajor = "premajor",
  minor = "minor",
  preminor = "preminor",
  patch = "patch",
  prepatch = "prepatch",
  noVersion = "",
}

export const preVersionMap = new Map([
  [SEMVER.major, SEMVER.premajor],
  [SEMVER.minor, SEMVER.preminor],
  [SEMVER.patch, SEMVER.prepatch],
]);

export type IVersionLabels = Map<VersionLabel | "none", string[]>;

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

/**
 * Determine the version bump from the labels on merged PRs.
 * Respects skip-release labels and the "onlyPublishWithReleaseLabel"
 * strategy.
 */
export function calculateSemVerBump(
  labels: string[][],
  labelMap: IVersionLabels,
  { onlyPublishWithReleaseLabel }: ReleaseCalculationOptions = {}
) {
  const labelSet = new Set<string>();
  const skipReleaseLabels = labelMap.get("skip") || [];

  labels.forEach((pr, index) => {
    // If the head pr has no labels we default to a patch
    if (pr.length === 0 && index === 0) {
      labelSet.add(SEMVER.patch);
    }

    pr.forEach((label) => {
      const userLabel = [...labelMap.entries()].find((pair) =>
        pair[1].includes(label)
      );

      if (userLabel) {
        labelSet.add(userLabel[0]);
      }
    });
  });

  const lastMergedCommitLabels = labels[0] || [];
  const releaseLabels = labelMap.get("release") || [];
  const skipRelease = onlyPublishWithReleaseLabel
    ? !lastMergedCommitLabels.some((label) => releaseLabels.includes(label))
    : lastMergedCommitLabels.some((label) => skipReleaseLabels.includes(label));

  // If PRs only have none or skip labels, skip the release
  const onlyNoReleaseLabels = [...labelSet].reduce(
    (condition, releaseType) =>
      condition && (releaseType === "none" || releaseType === "skip"),
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
