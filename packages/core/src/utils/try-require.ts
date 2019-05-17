import importCwd from 'import-cwd';

export default function tryRequire(tryPath: string) {
  try {
    return importCwd(tryPath);
  } catch (error) {
    return;
  }
}
