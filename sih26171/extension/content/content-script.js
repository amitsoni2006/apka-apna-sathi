(() => {
  let pageDirty = true;
  let observer;
  function observeChanges() {
    observer = new MutationObserver(mutations => {
      if (mutations.some(m => m.type === 'childList' || m.type === 'attributes' || m.type === 'characterData')) pageDirty = true;
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['value','style','class','hidden'] });
  }
  function visible(element) { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'; }
  function labelFor(input) { return input.labels?.[0]?.textContent?.trim() || document.querySelector(`label[for="${CSS.escape(input.id)}"]`)?.textContent?.trim() || input.getAttribute('aria-label') || input.name || input.id || 'Unlabeled field'; }
  function roleFor(input) { return input.dataset.agentField || ({ from: 'origin', to: 'destination' }[input.name] || ''); }
  function extract() {
    const inputs = [...document.querySelectorAll('input, textarea, select')].filter(visible).map((input, index) => {
      const rect = input.getBoundingClientRect(); const field = { id: input.id || `field-${index}`, name: input.name || '', label: labelFor(input), value: input.value || '', type: input.type || input.tagName.toLowerCase(), role: roleFor(input), rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) } };
      field.pii = TaskAwarePII.classify(field); return field;
    });
    const actions = [...document.querySelectorAll('button, [role="button"]')].filter(visible).map((button, index) => ({ id: button.id || `action-${index}`, label: button.textContent.trim().replace(/\s+/g,' '), value: '', type: 'button', action: button.dataset.agentAction || '', role: '', pii: { sensitive: false, kind: 'none', confidence: .97, risk: 'low' }, rect: (() => { const r = button.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }; })() }));
    return [...inputs, ...actions];
  }
  function process(taskText) {
    const started = performance.now(); const fields = extract(); const task = TaskAwareTask.analyze(taskText);
    fields.forEach(field => field.decision = TaskAwareDecision.decide(field, task));
    const sanitizedContext = TaskAwareSanitizer.build(task, fields);
    const pii = fields.filter(field => field.pii.sensitive);
    const allowed = fields.filter(field => field.decision.decision === 'ALLOW');
    const originalSize = new Blob([JSON.stringify(fields.map(({ value, label }) => ({ label, value })))], { type: 'application/json' }).size;
    const sanitizedSize = new Blob([JSON.stringify(sanitizedContext)], { type: 'application/json' }).size;
    const result = { taskText, task, fields, sanitizedContext, visualEvidence: { mode: 'implemented_lightweight_visual_map', description: 'Visible element geometry and rendered-state checks are captured locally. OCR/screenshot model is a future adapter.', visibleElements: fields.map(f => ({ label: f.label, rect: f.rect, kind: f.type })) }, metrics: { elementsAnalyzed: fields.length, piiDetected: pii.length, relevantFields: allowed.filter(f => !f.action).length, sensitiveProtected: pii.filter(f => f.decision.decision !== 'ALLOW').length, originalContextBytes: originalSize, sanitizedContextBytes: sanitizedSize, localProcessingMs: Math.round((performance.now() - started) * 10) / 10, processingTrigger: pageDirty ? 'user-requested scan after page change' : 'user-requested scan; DOM unchanged' }, audit: fields.map(field => ({ time: new Date().toISOString(), field: field.label, sensitivity: field.pii.kind, confidence: field.pii.confidence, required: field.decision.required, decision: field.decision.decision, rationale: field.decision.rationale })) };
    pageDirty = false; return result;
  }
  observeChanges();
  chrome.runtime.onMessage.addListener((message, _sender, respond) => {
    if (message.type === 'TASK_AWARE_SCAN') { try { respond({ ok: true, result: process(message.taskText) }); } catch (error) { respond({ ok: false, error: error.message }); } }
    if (message.type === 'TASK_AWARE_RUN') { TaskAwareAgent.run(message.task).then(action => respond({ ok: action.ok, action, verification: action.ok ? TaskAwareVerification.verify(message.task) : null })); return true; }
  });
})();
