type StateMap = {
  [key: string]: StateValue;
};

export type StateValue = string | StateMap;

export type State<TC extends object = object> = {
  context: TC;
  hasTags?: (...searches: string[]) => boolean;
  matches: (...searches: string[]) => boolean;
};
