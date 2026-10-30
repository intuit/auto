// dotenv@8 ships types, but its "exports" map hides them from bundler resolution
declare module "dotenv" {
  /** Parse a .env file's contents into an object */
  export function parse(src: string | Buffer): Record<string, string>;

  const dotenv: { parse: typeof parse };
  export default dotenv;
}
