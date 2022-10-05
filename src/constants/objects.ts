export const DEFAULT_TYPES = {
  action: 'state_manager.action',
  event: 'state_manager.event',
  guard: 'state_manager.guard',
  duration: 'state_manager.duration',
  service: {
    type: 'state_manager.service',
    object: {
      promise: 'state_manager.service.promise',
      subscribable: 'state_manager.service.subscribable',
    },
    array: [
      'state_manager.service.promise',
      'state_manager.service.subscribable',
    ],
  },
  state: 'state_manager.state',
  machine: 'state_manager.machine',
  node: {
    type: 'state_manager.node',
    types: {
      object: {
        parallel: 'parallel',
        atomic: 'atomic',
        compound: 'compound',
      },
      array: ['parallel', 'atomic', 'compound'],
    },
  },
  transition: {
    type: 'state_manager.transition',
    object: {
      event: 'state_manager.transition.event',
      now: 'state_manager.transition.now',
      after: 'state_manager.transition.after',
    },
    array: [
      'state_manager.transition.event',
      'state_manager.transition.now',
      'state_manager.transition.after',
    ],
  },
  transitionConfig: {
    type: 'state_manager.transition_config',
    options: {
      byEvent: 'state_manager.transition_config.event',
      now: 'state_manager.transition_config.now',
      after: 'state_manager.transition_config.after',
    },
  },
} as const;
