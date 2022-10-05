import { BaseType, DefaultTypes, NExtract, NOmit } from './_default';

export type EventType = `${DefaultTypes['event']}.${
  | 'emit'
  | 'then'
  | 'catch'}`;

interface _EventObject extends BaseType {
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

export type Event<TE extends EventEmit> =
  | TE['event']
  | NOmit<TE, 'libraryType' | 'description'>;

export type EventExtend<Payload = any, Data = any> =
  | EventEmit<Payload>
  | EventData<Data>
  | EventError;
