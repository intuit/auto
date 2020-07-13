import { ReleaseCalculationOptions } from "./types";
import * as t from "io-ts";

export type VersionLabel =
  | SEMVER.major
  | SEMVER.minor
  | SEMVER.patch
  | "skip"
  | "release";

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

export const releaseLabels: VersionLabel[] = [
  SEMVER.major,
  SEMVER.minor,
  SEMVER.patch,
  "skip",
  "release",
];

/** Determine if a label is a label used for versioning */
export const isVersionLabel = (label: string): label is VersionLabel =>
  releaseLabels.includes(label as VersionLabel);

const labelDefinitionRequired = t.type({
  /** The label text */
  name: t.string,
});

const labelDefinitionOptional = t.partial({
  /** A title to put in the changelog for the label */
  changelogTitle: t.string,
  /** The color of the label */
  color: t.string,
  /** The description of the label */
  description: t.string,
  /** What type of release this label signifies */
  releaseType: t.union([
    t.literal("none"),
    t.literal("skip"),
    ...releaseLabels.map((l) => t.literal(l)),
  ]),
  /** Whether to overwrite the base label */
  overwrite: t.boolean,
  /** Marks this label as the default label for unlabelled PRs */
  default: t.boolean,
});

export const labelDefinition = t.intersection([
  labelDefinitionOptional,
  labelDefinitionRequired,
]);
export type ILabelDefinition = t.TypeOf<typeof labelDefinition>;

export const defaultLabels: ILabelDefinition[] = [
  {
    name: "major",
    changelogTitle: "💥 Breaking Change",
    description: "Increment the major version when merged",
    releaseType: SEMVER.major,
    color: "#C5000B",
  },
  {
    name: "minor",
    changelogTitle: "🚀 Enhancement",
    description: "Increment the minor version when merged",
    releaseType: SEMVER.minor,
    color: "#F1A60E",
  },
  {
    name: "patch",
    changelogTitle: "🐛 Bug Fix",
    description: "Increment the patch version when merged",
    releaseType: SEMVER.patch,
    color: "#870048",
  },
  {
    name: "skip-release",
    description: "Preserve the current version when merged",
    releaseType: "skip",
    color: "#bf5416",
  },
  {
    name: "release",
    description: "Create a release when this pr is merged",
    releaseType: "release",
    color: "#007f70",
  },
  {
    name: "internal",
    changelogTitle: "🏠 Internal",
    description: "Changes only affect the internal API",
    releaseType: "none",
    color: "#696969",
  },
  {
    name: "documentation",
    changelogTitle: "📝 Documentation",
    description: "Changes only affect the documentation",
    releaseType: "none",
    color: "#cfd3d7",
  },
  {
    name: "tests",
    changelogTitle: "🧪 Tests",
    description: "Add or improve existing tests",
    releaseType: "none",
    color: "#ffd3cc",
  },
  {
    name: "dependencies",
    changelogTitle: "🔩 Dependency Updates",
    description: "Update one or more dependencies version",
    releaseType: "none",
    color: "#8732bc",
  },
  {
    name: "performance",
    changelogTitle: "🏎 Performance",
    description: "Improve performance of an existing feature",
    releaseType: SEMVER.patch,
    color: "#f4b2d8",
  },
];

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
  prLabels: string[][],
  labelMap: IVersionLabels,
  {
    onlyPublishWithReleaseLabel,
    labels = defaultLabels,
  }: ReleaseCalculationOptions & {
    /** The project's labels */
    labels?: ILabelDefinition[];
  } = {}
) {
  const defaultLabel =
    labels.find((l) => l.default)?.releaseType || SEMVER.patch;
  const labelSet = new Set<string>();
  const skipReleaseLabels = labelMap.get("skip") || [];

  prLabels.forEach((pr, index) => {
    // If the head pr has no labels we default to a patch
    if (pr.length === 0 && index === 0) {
      labelSet.add(defaultLabel);
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

  const lastMergedCommitLabels = prLabels[0] || [];
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
