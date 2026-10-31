/* oxlint-disable typescript/no-var-requires -- CommonJS on purpose: Vitest uses module.exports as the mocked module as-is. */
// `fs` for tests that call `vi.mock("fs")`, matching mock-fs's behavior: the
// in-memory volume is used between `mockFs(...)` and `mockFs.restore()` (see
// scripts/mock-fs.ts), and the real disk the rest of the time.
const realFs = require("node:fs");
const { Volume, createFsFromVolume } = require("memfs");

// memfs's default `vol` pins its cwd to "/". A fresh Volume resolves
// relative paths against the real process.cwd(), as mock-fs did.
const vol = new Volume();
const memFs = createFsFromVolume(vol);
let active = false;

const current = () => (active ? memFs : realFs);
const fs = {};

// Functions dispatch on every call, so references captured at import time
// (e.g. `promisify(fs.readFile)`) still follow mockFs/restore. Classes
// (`Stats`, `Dirent`, ...) are getters so `new` and `instanceof` keep working.
for (const key of new Set([...Object.keys(realFs), ...Object.keys(memFs)])) {
  if (key.startsWith("__")) continue;

  const isFunction =
    typeof realFs[key] === "function" || typeof memFs[key] === "function";

  if (isFunction && !/^[A-Z]/.test(key)) {
    fs[key] = function (...args) {
      return current()[key].apply(this, args);
    };
  } else {
    Object.defineProperty(fs, key, {
      enumerable: true,
      get: () => current()[key],
    });
  }
}

fs.__vol = vol;
fs.__setActive = (value) => {
  active = value;
};

module.exports = fs;
