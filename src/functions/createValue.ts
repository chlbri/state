import { STRINGS } from '@-constants';
import { EventObject, NOmit } from '@-types';
import { StateValue } from '@bemedev/decompose';
import { NodeOutput } from '../types/output';

type GetNode =
  | NOmit<NodeOutput, 'id'> & {
      id?: string | undefined;
    };

type Options<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = {
  child?: boolean;
  nodes?: NodeOutput<TC, TE, PTC>[];
  last: string;
};

export function getNode(key: string, node: GetNode): GetNode | undefined {
  let out: GetNode | undefined = undefined;
  if (key === node.id) {
    out = node;
  } else {
    const children = node.children;
    if (children) {
      for (const key2 in children) {
        if (Object.prototype.hasOwnProperty.call(children, key2)) {
          const element = children[key2];
          if (key2 === key) {
            out = element;
            break;
          } else {
            /* if (element.children) */
            out = getNode(key, element);
            if (out) break;
          }
        }
      }
    }
  }
  return out;
}

function getNodeProps<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(options: Options<TC, TE, PTC>, safeParentID: string) {
  const findNode = options?.nodes?.find(node => node.id === safeParentID);
  const type = findNode?.type;
  const children = findNode?.children;
  return { children, type, findNode };
}

function generateProps(id: string) {
  const splits = id.split(STRINGS.DEFAULT_STATE_DELIMITER);

  const parentID = splits.shift();
  const safeParentID = `${STRINGS.DEFAULT_STATE_DELIMITER}${parentID}`;
  const out = { [safeParentID]: {} };
  return { safeParentID, out };
}

function assignParallel<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  entries: [
    string,
    NOmit<NodeOutput<TC, TE, PTC>, 'id'> & {
      id?: string | undefined;
    },
  ][],
  _out: any,
  safeParentID: string,
  options: Options<TC, TE, PTC>,
) {
  entries.forEach(([key, node]) => {
    const subChildren = node.children;
    if (!subChildren) _out[key] = {};
    else {
      const subId = node.id?.replace(safeParentID, '');
      _out[key] = createStateValueFromID_Recursive(subId, {
        ...options,
        child: true,
      });
    }
  });
}

function computeCompound<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  options: Options<TC, TE, PTC>,
  findNode: NodeOutput<TC, TE, PTC>,
  _out: any,
) {
  const last = options.last;
  const node = getNode(options.last, findNode)?.children?.[last];
  const hasChildren = !!node?.children;

  _out = hasChildren
    ? createStateValueFromID_Recursive(node.id, {
        ...options,
        child: true,
      })
    : last;
  return _out;
}

function createStateValueFromID_Recursive<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  id: string = STRINGS.DEFAULT_STATE_DELIMITER,
  options: Options<TC, TE, PTC>,
): StateValue {
  const props = generateProps(id);
  const safeParentID = props.safeParentID;
  let out = props.out;

  const { children, type, findNode } = getNodeProps<TC, TE, PTC>(
    options,
    safeParentID,
  );

  if (findNode && children && type) {
    let _out: any = {};
    const entries = Object.entries(children);
    switch (type) {
      case 'parallel': {
        assignParallel<TC, TE, PTC>(entries, _out, safeParentID, options);
        break;
      }
      case 'compound': {
        _out = computeCompound<TC, TE, PTC>(options, findNode, _out);
        break;
      }
    }

    if (options?.child) {
      out = _out;
    } else {
      out[safeParentID] = _out;
    }
  }

  return out as StateValue;
}

export function createStateValueFromID<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
>(
  id: string = STRINGS.DEFAULT_STATE_DELIMITER,
  ...nodes: NodeOutput<TC, TE, PTC>[]
) {
  const lastStartIndex =
    id.lastIndexOf(STRINGS.DEFAULT_STATE_DELIMITER) + 1;
  const last = id.substring(lastStartIndex);
  return createStateValueFromID_Recursive(id, { nodes, last });
}
