import { NExtract } from '@bemedev/core';
import { ServicePromise_JSON, Subscribable_JSON } from './Service';
import { TransitionExtend } from './Transition';
import { TransitionMap_JSON } from './TransitionConfig';
import { DefaultTypes, SingleOrArray } from './_default';

export type DefaultNodeType = DefaultTypes['node'];

type JSONTypes = DefaultTypes['node']['types']['array'][number];
type TyE<K extends JSONTypes> = NExtract<JSONTypes, K>;

export type NodeJSON = {
  parentId?: string;
  id?: string;
  children?: Record<string, NodeJSON>;
  description?: string;
  type?: JSONTypes;
  initial?: string;
  delimiter?: string;
  promises?: SingleOrArray<ServicePromise_JSON>;
  subscribables?: SingleOrArray<Subscribable_JSON>;
  events?: TransitionMap_JSON;
  now?: SingleOrArray<TransitionExtend>;
  after?: SingleOrArray<TransitionExtend>;
} & (
  | {
      type: TyE<'parallel'>;
      initial?: undefined;
      children: Record<string, NodeJSON>;
    }
  | {
      type?: TyE<'compound'>;
      initial: string;
      children: Record<string, NodeJSON>;
    }
  | {
      type?: TyE<'atomic'>;
      initial?: undefined;
      children?: undefined;
    }
);
// export class Node implements BaseType {
//   get libraryType() {
//     return DEFAULT_TYPES.node;
//   }

//   private get delimiter() {
//     return this.props.delimiter ?? STRINGS.DEFAULT_STATE_DELIMITER;
//   }

//   private get parentId() {
//     return this.props.parentId ?? '';
//   }

//   get id() {
//     return this.props.id
//       ? `#${this.props.id}`
//       : `${this.parentId}${this.delimiter}${this.props._id}`;
//   }

//   constructor(private props: NodeProps) {}
// }
