import type { EventObject } from './Event';
import type { Out } from './Out';
import type { Props } from './Props';
import type { BaseType, DefaultTypes } from './_default';

type Types = 'void' | 'assign' | 'start';

export type ActionTypes = `${DefaultTypes['action']}.${Types}`;

export type ActionFunction<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> = {
  bivarianceHack(props?: Props<TC, TE, PTC>): Out<TC, PTC>;
}['bivarianceHack'];

export interface ActionProps<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> extends BaseType {
  id: string;
  type: ActionTypes;
  exec: ActionFunction<TC, TE, PTC>;
}

export class Action<
  TC extends object,
  TE extends EventObject,
  PTC extends object,
> implements BaseType
{
  get type() {
    return this.props.type;
  }

  get id() {
    return this.props.id;
  }

  get description() {
    return this.props.description;
  }

  readonly exec = this.props.exec;
  constructor(private props: ActionProps<TC, TE, PTC>) {}
}

export type Action_JSON = {
  id: string;
  description?: string;
};
