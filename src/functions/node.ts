import { STRINGS } from '@-constants';
import { EventObject, NodeOutput } from '@-types';

export const compoundNodeLengthError = {
  message: 'Initial must be one child',
};

export function generateChildID(
  id: string,
  parentID: string = STRINGS.DEFAULT_STATE_DELIMITER,
) {
  return `${parentID}${
    parentID === STRINGS.DEFAULT_STATE_DELIMITER ? '' : '/'
  }${id}`;
}

export function transformNode<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  node: any,
  id: string = STRINGS.DEFAULT_STATE_DELIMITER,
  parentID?: string,
) {
  const nodes: NodeOutput<TC, TE, PTC>[] = [];

  nodes.push({
    ...node,
    parentID,
    id,
  });

  const children = node.children;
  if (children) {
    for (const key in children) {
      if (Object.prototype.hasOwnProperty.call(children, key)) {
        const childNode = children[key];
        const childID = generateChildID(key, id);
        childNode.id = childID;
        childNode.parentID = id;
        nodes.push(...transformNode(childNode, childID, id));
      }
    }
  }

  return nodes;
}
