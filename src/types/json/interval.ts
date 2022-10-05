import { Extend } from '../_default';
import { Action_JSON } from './action';
import { Guards_JSON } from './guard';

export type Interval_JSON = {
  actions: Extend<Action_JSON>;
  delay?: string | number;
  guards?: Guards_JSON;
};
