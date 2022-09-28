export type SchedulerOptions = {
  deferEvents: boolean;
};

type VF = () => Promise<void>;

type Queue = {
  later: VF[];
  soon: VF[];
  immediate: VF[];
  required: VF[];
};

export type Priority = keyof Queue;

const _priorities = ['later', 'soon', 'immediate', 'required'] as const;
const _defaultOptions = { deferEvents: false } as const;

export class Scheduler {
  // #region STATIC MEMBERS
  static get priorities() {
    return _priorities;
  }

  static get defaultOptions(): SchedulerOptions {
    return _defaultOptions;
  }
  // #endregion

  private processingEvent = false;
  private queue: Queue = {
    later: [],
    soon: [],
    immediate: [],
    required: [],
  };

  private push(action?: VF, priority: Priority = 'soon') {
    action && this.queue[priority].push(action);
  }

  get initialized() {
    return this._initialized;
  }

  private _initialized = false;

  // deferred feature
  private options: SchedulerOptions;

  constructor(options?: Partial<SchedulerOptions>) {
    this.options = { ...Scheduler.defaultOptions, ...options };
  }

  public initialize(action?: VF) {
    this._initialized = true;
    if (action) {
      if (!this.options.deferEvents) {
        this.schedule(action);
        return;
      }
      this.process(action);
    }
    this.flushEvents();
  }

  public schedule = (action?: VF, priority: Priority = 'soon') => {
    if (this._initialized && !this.processingEvent) {
      this.process(action);
      return;
    }

    this.push(action, priority);
    this.flushEvents();
  };

  private clearActions(priority: Priority) {
    this.queue[priority] = [];
  }

  private isActionEmpty(priority: Priority) {
    return this.queue[priority].length < 1; //?
  }

  public clear = () => {
    Scheduler.priorities.forEach(priority => this.clearActions(priority));
  };

  public get isEmpty() {
    return Scheduler.priorities
      .map(priority => this.isActionEmpty(priority))
      .every(isEmpty => isEmpty === true);
  }

  private getTask(priority: Priority) {
    return this.queue[priority].shift();
  }

  private async performAction(priority: Priority) {
    const task = this.getTask(priority);
    this.isEmpty;
    await this.process(task);
  }

  private _actionsPerformed = 0;

  get actionsPerformed() {
    return this._actionsPerformed;
  }

  private flushEvents() {
    while (!this.isEmpty) {
      Scheduler.priorities.forEach(priority =>
        this.performAction(priority),
      );
    }
  }

  private process(action?: VF) {
    if (!action) return;
    this.processingEvent = true;
    return action()
      .then(() => {
        this._actionsPerformed++;
      })
      .catch(e => {
        this.clear();
        throw e;
      })
      .finally(() => {
        this.processingEvent = false;
      });
  }
}
