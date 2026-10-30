import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const workspaceDist = new RegExp(
  `^${root.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")}/(packages|plugins)/([^/]+)/dist/(.+)\\.js$`
);

/**
 * Resolve workspace packages to their TypeScript source instead of their
 * built dist, so that vi.mock reaches core's internals. Covers package
 * names, `<package>/dist/*` subpaths and relative `../packages/*\/dist/*`
 * paths, since all of them resolve into a dist folder.
 */
const resolveToSource = (): Plugin => ({
  name: "resolve-to-source",
  enforce: "pre",
  async resolveId(source, importer, options) {
    const resolved = await this.resolve(source, importer, {
      ...options,
      skipSelf: true,
    });
    const match = resolved && workspaceDist.exec(resolved.id);

    if (!match) {
      return resolved;
    }

    const [, group, name, subpath] = match;
    const src = path.join(root, group!, name!, "src", `${subpath}.ts`);

    return existsSync(src) ? src : resolved;
  },
});

export default defineConfig({
  plugins: [resolveToSource()],
  test: {
    globals: true,
    environment: "node",
    include: ["**/__tests__/*.test.{ts,tsx,js}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/scripts/**"],
    setupFiles: [path.join(root, "scripts/vitest-setup.ts")],
    snapshotSerializers: [
      require.resolve("jest-serializer-path"),
      require.resolve("jest-snapshot-serializer-ansi"),
    ],
    coverage: {
      provider: "v8",
      reportsDirectory: path.join(root, "coverage"),
      reporter: ["cobertura", "html", "lcov", "text"],
      include: ["packages/**/*.ts", "plugins/**/*.ts"],
      exclude: ["**/dist/**", "**/*.test.ts", "**/__tests__/**"],
      // Jest wrote coverage even when tests failed.
      reportOnFailure: true,
    },
  },
});
