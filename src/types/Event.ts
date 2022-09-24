import type { NExtract, NOmit } from '@bemedev/core';
import type { BaseType, DefaultTypes } from './_default';

type Types = 'emit' | 'then' | 'catch';

export type EventType = `${DefaultTypes['event']}.${Types}`;

export interface EventObject extends BaseType {
  libraryType: EventType;
}

export interface EventData<D = any> extends EventObject {
  libraryType: NExtract<EventType, 'state_manager.event.then'>;
  data: D;
}

export interface EventError extends EventObject {
  libraryType: NExtract<EventType, 'state_manager.event.catch'>;
  error: Error;
}

export interface EventEmit<D = any> extends EventObject {
  libraryType: NExtract<EventType, 'state_manager.event.emit'>;
  event: string;
  data: D;
}

export type Event<TE extends EventEmit> =
  | TE['event']
  | NOmit<TE, 'libraryType'>;
