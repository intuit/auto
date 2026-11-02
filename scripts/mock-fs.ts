import fs from "fs";
import type { NestedDirectoryJSON, Volume } from "memfs";

interface FsMock {
  __vol: Volume;
  __setActive: (active: boolean) => void;
}

/** The controls exposed by `__mocks__/fs.cjs`. */
const fsMock = (): FsMock => {
  const mock = fs as unknown as Partial<FsMock>;

  if (!mock.__vol || !mock.__setActive) {
    throw new Error('mockFs needs `vi.mock("fs")` in the test file');
  }

  return mock as FsMock;
};

/**
 * Swap the file system for an in-memory one holding `files`, with relative
 * paths resolved against the current working directory. Needs
 * `vi.mock("fs")` in the test file, which swaps in `__mocks__/fs.cjs`.
 */
export const mockFs = (files: NestedDirectoryJSON = {}) => {
  const { __vol: vol, __setActive } = fsMock();

  vol.reset();
  vol.fromNestedJSON(files, process.cwd());
  __setActive(true);
};

/** Go back to the real file system. */
mockFs.restore = () => {
  const { __vol: vol, __setActive } = fsMock();

  __setActive(false);
  vol.reset();
};
