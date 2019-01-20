export default function tryRequire(tryPath: string) {
  try {
    return require(tryPath);
  } catch (error) {
    return null;
  }
}
