export function toArray<T>(data?: T) {
  return data ? [data] : ([] as Exclude<T, undefined>[]);
}
