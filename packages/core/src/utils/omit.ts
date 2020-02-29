/** Omit properties from an object */
export const omit = <Props, Prop extends keyof Props>(obj: Props, keys: Prop[]) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as Prop))
  ) as Omit<Props, Prop>;
  