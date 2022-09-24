import cloneDeep from 'lodash.clonedeep';

export function cloneFunction<F extends (...args: any[]) => any>(
  func?: F,
) {
  if (!func) return;
  return (...args: Parameters<F>) => {
    const _args = cloneDeep(args);
    return func(..._args);
  };
}
