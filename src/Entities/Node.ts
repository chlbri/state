import { NOmit } from '@bemedev/core';
import { STRINGS } from '../constants';
import { DEFAULT_TYPES } from '../constants/objects';
import { BaseType, DefaultTypes } from './_default';

export type DefaultNodeType = DefaultTypes['node'];

export type NodeProps = {
  parentId?: string;
  _id: string;
  id?: string;
  children?: NodeProps[];
  description?: string;
  type?: 'atomic' | 'compound' | 'parallel';
  initial?: string;
  delimiter?: string;
} & (
  | {
      type: 'parallel';
      initial?: undefined;
      children: NodeProps[];
      // promise?: undefined;
    }
  | {
      type?: 'compound';
      initial: string;
      children: NodeProps[];
      // promise?: undefined;
    }
  | {
      type?: 'atomic';
      initial?: undefined;
      children?: undefined;
      // promise?: undefined;
    }
) &
  // | { type?: 'promise'; initial?: undefined; promise: ServicePromise_JSON }
  NOmit<BaseType, 'libraryType'>;

export class Node implements BaseType {
  get libraryType() {
    return DEFAULT_TYPES.node;
  }

  private get delimiter() {
    return this.props.delimiter ?? STRINGS.DEFAULT_STATE_DELIMITER;
  }

  private get parentId() {
    return this.props.parentId ?? '';
  }

  get id() {
    return this.props.id
      ? `#${this.props.id}`
      : `${this.parentId}${this.delimiter}${this.props._id}`;
  }

  constructor(private props: NodeProps) {}
}
