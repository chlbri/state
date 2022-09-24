import { NOmit } from '@bemedev/core';
import { STRINGS } from '../constants';
import { DEFAULT_TYPES } from '../constants/objects';
import { BaseType, DefaultTypes } from './_default';

export type DefaultNodeType = DefaultTypes['node'];

export interface NodeProps extends NOmit<BaseType, 'libraryType'> {
  parentId?: string;
  _id: string;
  id?: string;
  children?: NodeProps[];
  delimiter?: string;
  // TODO: Define the Discriminated Union for Node
}

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

  constructor(private props: NodeProps) {
    // TODO:  Add a zod schema verification (id must not contains "#")
  }
}
