export function initPlugins(on, plugins) {
  const eventCallbacks = {};

  const customOn = (eventName, callback) => {
    if (!eventCallbacks[eventName]) {
      eventCallbacks[eventName] = [];
      // Register a single handler for each event that will execute all registered callbacks
      on(eventName, async (...args) => {
        for (const cb of eventCallbacks[eventName]) {
          await cb(...args);
        }
      });
    }
    eventCallbacks[eventName].push(callback);
  };

  // Initialize each plugin with the custom `on` handler
  plugins.forEach((plugin) => plugin(customOn));
}
