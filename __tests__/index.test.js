const Focus = require('../index');

describe('Focus API Initialization', () => {
  test('Focus can be initialized', () => {
    const focus = new Focus();
    expect(focus).toBeDefined();
    expect(focus).toBeInstanceOf(Focus);
  });
});
