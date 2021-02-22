declare module "fromentries" {
  export default function fromEntries<T = any>(
    entries: Iterable<readonly [PropertyKey, T]>
  ): { [k in PropertyKey]: T };
}
