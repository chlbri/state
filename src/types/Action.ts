import type { EventObject } from './Event';
import type { Out } from './Out';
import type { Props } from './Props';
import type { BaseType, DefaultTypes, WithString } from './_default';

type Types = 'void' | 'assign' | 'start';

export type ActionTypes = `${DefaultTypes['action']}.${Types}`;

export type ActionFunction<
  TC extends object,
  TE extends EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> = {
  bivarianceHack(props?: Props<TC, TE, PTC, PTE>): Out<TC, PTC>;
}['bivarianceHack'];

export interface ActionProps<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> extends BaseType {
  id: string;
  libraryType: ActionTypes;
  exec: ActionFunction<TC, TE, PTC, PTE>;
}

export class Action<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
  PTE extends EventObject = EventObject,
> implements BaseType
{
  get libraryType() {
    return this.props.libraryType;
  }

  get id() {
    return this.props.id;
  }

  get description() {
    return this.props.description;
  }

  readonly exec: typeof this.props.exec;
  constructor(private props: ActionProps<TC, TE, PTC, PTE>) {
    this.exec = props.exec;
  }
}

export type Action_JSON = WithString<{
  id: string;
  description?: string;
}>;
