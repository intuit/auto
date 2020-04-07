import { determineNextVersion } from "../auto";
import SEMVER from "../semver";

describe("determineNextVersion", () => {
  test("should make a incremented canary version", () => {
    expect(
      determineNextVersion("v3.0.0", "v3.2.0", SEMVER.patch, "canary.5b2e7d3")
    ).toBe("3.2.1-canary.5b2e7d3.0");
  });

  test("should make a incremented canary version without any previous release", () => {
    expect(
      determineNextVersion(
        "7dd0b07625203f69cd55d779d873f1adcffaa84a",
        "v3.2.0",
        SEMVER.patch,
        "canary.5b2e7d3"
      )
    ).toBe("3.2.1-canary.5b2e7d3.0");
  });

  test("should make a incremented canary version of latest", () => {
    expect(
      determineNextVersion("v4.0.0", "v3.2.0", SEMVER.patch, "canary.5b2e7d3")
    ).toBe("4.0.1-canary.5b2e7d3.0");
  });

  test("should make a incremented next version", () => {
    expect(determineNextVersion("1.0.0", "2.0.0-next.0", SEMVER.patch)).toBe(
      "2.0.0-next.1"
    );
  });
});
