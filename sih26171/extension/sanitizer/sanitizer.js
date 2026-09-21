globalThis.TaskAwareSanitizer = (() => {
  const token = { name: '[NAME]', email: '[EMAIL]', phone: '[PHONE]', address: '[ADDRESS]', card: '[CARD]', password: '[PASSWORD]' };
  function build(task, fields) {
    const context = { task: task.taskType, action: task.requiredAction || 'none', fields: {} };
    for (const field of fields) {
      if (field.decision.decision === 'ALLOW' && field.role === 'origin') context.from = field.value;
      else if (field.decision.decision === 'ALLOW' && field.role === 'destination') context.to = field.value;
      else if (field.decision.decision === 'TOKENIZE') context.fields[field.label] = token[field.pii.kind] || '[SENSITIVE]';
      else if (field.pii.sensitive) context.fields[field.label] = '[LOCAL_ONLY]';
    }
    return context;
  }
  return { build };
})();
