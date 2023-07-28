import fromEntries from "fromentries";

/** Omit properties from an object */
export const omit = <Props, Prop extends keyof Props>(
  obj: Props,
  keys: Prop[]
) =>
  fromEntries(
    Object.entries(obj as {}).filter(([key]) => !keys.includes(key as Prop))
  ) as Omit<Props, Prop>;
