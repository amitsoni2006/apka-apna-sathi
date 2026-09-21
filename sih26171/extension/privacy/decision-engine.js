globalThis.TaskAwareDecision = (() => {
  function decide(field, task) {
    const required = task.requiredFields.includes(field.role) || field.action === task.requiredAction;
    if (field.pii.kind === 'password' || field.pii.kind === 'card') return { decision: 'LOCAL_ONLY', required, rationale: 'High-risk visible value never enters agent context.' };
    if (task.confidence < .6 && field.pii.sensitive) return { decision: 'BLOCK', required: false, rationale: 'Task confidence is low; fail-safe privacy gate applied.' };
    if (required && !field.pii.sensitive) return { decision: 'ALLOW', required: true, rationale: 'Required to complete the current task.' };
    if (field.pii.sensitive) return { decision: 'TOKENIZE', required: false, rationale: 'Sensitive but not required for this task.' };
    if (field.action) return { decision: required ? 'ALLOW' : 'BLOCK', required, rationale: required ? 'Required local action.' : 'Action is not needed by the parsed task.' };
    return { decision: 'BLOCK', required: false, rationale: 'Not needed for the recognized task.' };
  }
  return { decide };
})();
