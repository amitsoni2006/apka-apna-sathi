chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SAVE_AUDIT') {
    chrome.storage.local.set({ latestAudit: message.payload, latestAuditAt: Date.now() }).then(() => sendResponse({ ok: true }));
    return true;
  }
  if (message.type === 'REQUEST_SANITIZED_PLAN') {
    // This is the network boundary. The caller passes only sanitizer output, never DOM values.
    fetch('http://127.0.0.1:8787/plan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(message.sanitizedContext) })
      .then(async response => ({ ok: response.ok, body: await response.json() }))
      .then(({ ok, body }) => sendResponse(ok ? { ok: true, plan: body } : { ok: false, error: body.error || 'Planner rejected the sanitized context.' }))
      .catch(() => sendResponse({ ok: false, error: 'Local planner server is offline. Start it with: node server/mock-planner.js' }));
    return true;
  }
});
