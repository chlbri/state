export const toArray = <T>(data?: T) =>
  data ? [data] : ([] as Exclude<T, undefined>[]);
