globalThis.TaskAwareAgent = (() => {
  async function run(task) {
    if (task.taskType !== 'flight_search') return { ok: false, message: 'No safe action is available for an unrecognized task.' };
    const button = document.querySelector('[data-agent-action="search_flights"]');
    if (!button) return { ok: false, message: 'Search action was not found in the active page.' };
    button.click();
    return { ok: true, message: 'Local browser action: clicked Search flights.' };
  }
  return { run };
})();
