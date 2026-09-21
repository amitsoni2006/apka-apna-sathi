globalThis.TaskAwareVerification = (() => ({
  verify(task) {
    const results = document.querySelector('#results[data-search-verified="true"]');
    const expected = task.origin && task.destination && results?.textContent.toLowerCase().includes(task.origin.toLowerCase()) && results.textContent.toLowerCase().includes(task.destination.toLowerCase());
    return { passed: Boolean(expected), evidence: expected ? 'Rendered results contain the requested route.' : 'Expected results state was not observed.' };
  }
}));
