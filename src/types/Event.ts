import type { NExtract, NOmit } from '@bemedev/core';
import type { BaseType, DefaultTypes } from './_default';

type Types = 'emit' | 'then' | 'catch';

export type EventType = `${DefaultTypes['event']}.${Types}`;

export interface _EventObject extends BaseType {
  libraryType: EventType;
  event: string;
}

export interface EventData<Data = any> extends _EventObject {
  libraryType: NExtract<EventType, 'state_manager.event.then'>;
  event: NExtract<EventType, 'state_manager.event.then'>;
  data: Data;
}

export interface EventError extends _EventObject {
  libraryType: NExtract<EventType, 'state_manager.event.catch'>;
  event: NExtract<EventType, 'state_manager.event.catch'>;
  error: Error;
}

export interface EventEmit<Payload = any> extends _EventObject {
  libraryType: NExtract<EventType, 'state_manager.event.emit'>;
  event: string;
  payload: Payload;
}

export type ExtenalEvent<TE extends EventObject> = TE extends EventEmit
  ? TE
  : never;

export type EventObject<D = any> =
  | EventData<D>
  | EventError
  | EventEmit<D>;

type test = ExtenalEvent<
  | {
      libraryType: 'state_manager.event.emit';
      event: '';
      payload: 'ert';
    }
  | {
      libraryType: 'state_manager.event.emit';
      event: 'DOWNLOAD';
      payload: 'erte';
    }
  | {
      libraryType: 'state_manager.event.catch';
      event: 'state_manager.event.catch';
      error: Error;
    }
  | {
      libraryType: 'state_manager.event.then';
      event: 'state_manager.event.then';
      data: Error;
    }
>;

export type Event<TE extends EventEmit> =
  | TE['event']
  | NOmit<TE, 'libraryType' | 'description'>;
