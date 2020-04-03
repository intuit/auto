/** Determine if auto is installed as a binary */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default () => (process as any).pkg;
