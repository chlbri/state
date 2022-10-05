import { Config_JSON, config_JSON } from '../../types';

export function createInitials<
  TC extends object = object,
  PTC extends object = object,
>(value: any) {
  return config_JSON.parse(value) as Pick<
    Config_JSON<TC, PTC>,
    'context' | 'privateContext'
  >;
}
