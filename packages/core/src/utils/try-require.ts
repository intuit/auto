import importCwd from 'import-cwd';

export default function tryRequire(tryPath: string) {
  try {
    // Require from CWD
    return importCwd(tryPath);
  } catch (error) {
    // if we try to actually require npm we will import something that is the actual npm API
    // not the plugin that we want
    if (tryPath === 'npm') {
      return;
    }

    try {
      // Require from __dirname. Needed for npx and global installs
      return require(tryPath);
    } catch (error) {
      return;
    }
  }
}
