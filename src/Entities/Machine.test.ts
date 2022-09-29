import { Machine } from './Machine';

describe('Acceptance', () => {
  test('Class exists', () => {
    expect(Machine).toBeDefined();
    expect(Machine).toBeTypeOf('function');
  });
});
