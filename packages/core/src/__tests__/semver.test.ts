import { getVersionMap } from "../release";
import SEMVER, {
  calculateSemVerBump,
  getHigherSemverTag,
  defaultLabels,
} from "../semver";

const semverMap = getVersionMap([
  ...defaultLabels,
  { name: "documentation", releaseType: "skip" },
  { name: "none", releaseType: "none" },
]);

test("ranks releases right", () => {
  expect(getHigherSemverTag(SEMVER.major, SEMVER.minor)).toBe("major");
  expect(getHigherSemverTag(SEMVER.noVersion, SEMVER.patch)).toBe("patch");
  expect(getHigherSemverTag(SEMVER.minor, SEMVER.patch)).toBe("minor");
});

describe("calculateSemVerBump", () => {
  test("should be able to use multiple labels for skip-release", () => {
    expect(calculateSemVerBump([["skip-release", "major"]], semverMap)).toBe(
      SEMVER.noVersion
    );

    expect(calculateSemVerBump([["documentation", "major"]], semverMap)).toBe(
      SEMVER.noVersion
    );

    expect(calculateSemVerBump([["major"]], semverMap)).toBe(SEMVER.major);
  });

  test("should skip none sometimes", () => {
    expect(calculateSemVerBump([["none"]], semverMap)).toBe(SEMVER.noVersion);

    expect(calculateSemVerBump([["none", "major"]], semverMap)).toBe(
      SEMVER.major
    );

    expect(
      calculateSemVerBump([["none"], ["unknown"], ["documentation"]], semverMap)
    ).toBe(SEMVER.noVersion);
  });

  test("should release a patch for unlabeled pr merged along with none releases", () => {
    expect(calculateSemVerBump([[], ["documentation"]], semverMap)).toBe(
      SEMVER.patch
    );
  });

  test("should release a patch for pr with non-auto labels", () => {
    expect(calculateSemVerBump([["a", "b", "c"], []], semverMap)).toBe(
      SEMVER.patch
    );
  });

  test("should be able to configure default label", () => {
    expect(
      calculateSemVerBump([[], ["documentation"]], semverMap, {
        labels: [{ default: true, name: "minor", releaseType: SEMVER.minor }],
      })
    ).toBe(SEMVER.minor);
  });

  test("should be able to configure default no-version clean", () => {
    expect(
      calculateSemVerBump([[], []], semverMap, {
        labels: [{ default: true, name: "docs", releaseType: "none" }],
      })
    ).toBe(SEMVER.noVersion);
  });

  test("should not skip things before none", () => {
    expect(calculateSemVerBump([["none"], ["major"]], semverMap)).toBe(
      SEMVER.major
    );
  });

  test("should respect onlyPublishWithReleaseLabel when no labels present on PR", () => {
    expect(
      calculateSemVerBump([[]], semverMap, {
        onlyPublishWithReleaseLabel: true,
      })
    ).toBe(SEMVER.noVersion);
  });

  test("should respect onlyPublishWithReleaseLabel when no labels present on push to baseBranch", () => {
    expect(
      calculateSemVerBump([], semverMap, {
        onlyPublishWithReleaseLabel: true,
      })
    ).toBe(SEMVER.noVersion);
  });
});
