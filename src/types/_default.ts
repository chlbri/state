export interface BaseType {
  description?: string;
  type: string;
}

export type SingleOrArray<T> = T[] | T;

export type DefaultTypes = {
  action: 'state_manager.action';
  event: 'state_manager.event';
  guard: 'state_manager.guard';
  service: 'state_manager.service';
  state: 'state_manager.state';
  transition: 'state_manager.transition';
};
