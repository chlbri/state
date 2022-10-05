export type Priority = 'high' | 'medium' | 'low';

export type Settings = {
  promiseTimeout?: number;
  interval?: number;
  priorities?: Record<Priority, string[]>;
  syncEvents?: string[];
};
