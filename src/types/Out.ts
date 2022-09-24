export type Out<TC extends object, PTC extends object> = {
  context?: TC;
  privateContext?: PTC;
  target?: string;
};
