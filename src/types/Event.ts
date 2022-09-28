import type { NExtract, NOmit } from '@bemedev/core';
import type { DefaultTypes } from './_default';

type Types = 'emit' | 'then' | 'catch';

export type EventType = `${DefaultTypes['event']}.${Types}`;

export interface EventObject {
  libraryType: EventType;
}

export interface EventData<Data = any> extends EventObject {
  libraryType: NExtract<EventType, 'state_manager.event.then'>;
  data: Data;
}

export interface EventError extends EventObject {
  libraryType: NExtract<EventType, 'state_manager.event.catch'>;
  error: Error;
}

export interface EventEmit<Payload = any> extends EventObject {
  libraryType: NExtract<EventType, 'state_manager.event.emit'>;
  event: string;
  payload: Payload;
}

export type Events<TE extends EventEmit, PTE extends EventEmit> = {
  event?: TE;
  privateEvent?: PTE;
};

export type Event<TE extends EventEmit> =
  | TE['event']
  | NOmit<TE, 'libraryType'>;
