const Focus = require('../index');

describe('Focus API Initialization', () => {
  test('Focus can be initialized', () => {
    const focus = new Focus();
    expect(focus).toBeDefined();
    expect(focus).toBeInstanceOf(Focus);

    // If you have default properties set in your constructor, you can also check for those
    expect(focus.closed).toBe(true);
    expect(focus.debug).toBe(false);
    // Add any other initial state checks here
  });
});
