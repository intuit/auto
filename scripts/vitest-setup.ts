import { existsSync } from "node:fs";
import { createRequire, registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

vi.mock("requireg", () => ({ default: createRequire(import.meta.url) }));

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const workspaceSrcFile = new RegExp(
  `^${root.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")}/(packages|plugins)/([^/]+)/src/(.+)\\.ts$`
);

// In tests workspace packages run from their TypeScript source, but core loads
// plugins with a native `require` that Vitest can't intercept. Send those
// requires to the built dist, so tests need a prior `pnpm build`.
registerHooks({
  resolve(specifier, context, nextResolve) {
    const resolved = nextResolve(specifier, context);
    const match = resolved.url.startsWith("file:")
      ? workspaceSrcFile.exec(fileURLToPath(resolved.url))
      : null;

    if (!match) {
      return resolved;
    }

    const [, group, name, subpath] = match;
    const dist = path.join(root, group!, name!, "dist", `${subpath}.js`);

    return existsSync(dist)
      ? { ...resolved, url: pathToFileURL(dist).href, format: "commonjs" }
      : resolved;
  },
});
