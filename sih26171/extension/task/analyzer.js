globalThis.TaskAwareTask = (() => {
  const cities = ['delhi','mumbai','bengaluru','bangalore','chennai','kolkata','hyderabad','pune','goa'];
  const title = value => value ? value[0].toUpperCase() + value.slice(1) : value;
  function analyze(task) {
    const normalized = task.toLowerCase();
    const mentioned = cities.filter(city => new RegExp(`\\b${city}\\b`).test(normalized));
    const fromMatch = normalized.match(/(?:from|origin)\s+([a-z]+)/); const toMatch = normalized.match(/(?:to|destination)\s+([a-z]+)/);
    const origin = title(fromMatch?.[1] || mentioned[0] || ''); const destination = title(toMatch?.[1] || mentioned[1] || '');
    const flightSearch = /flight|fly|airfare|search/.test(normalized) && Boolean(origin && destination);
    return { taskType: flightSearch ? 'flight_search' : 'unknown', origin, destination,
      requiredFields: flightSearch ? ['origin','destination'] : [],
      requiredAction: flightSearch ? 'search_flights' : null,
      confidence: flightSearch ? .92 : .32,
      explanation: flightSearch ? 'Route values and the search action are necessary; traveller details are not.' : 'Task intent is uncertain; sensitive data defaults to local-only.' };
  }
  return { analyze };
})();
