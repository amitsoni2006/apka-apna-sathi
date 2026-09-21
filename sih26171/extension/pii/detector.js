/* Local, rule-based detector. Values remain in this content-script execution context. */
globalThis.TaskAwarePII = (() => {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /(?:\+91[\s-]?)?[6-9]\d{9}$/,
    card: /(?:\d[ -]?){13,19}$/
  };
  const metadataTypes = [
    ['password', 'password', 0.99, 'high'], ['card', 'card', 0.96, 'high'],
    ['email', 'email', 0.97, 'high'], ['phone', 'phone', 0.95, 'high'],
    ['address', 'address', 0.86, 'medium'], ['name', 'name', 0.82, 'medium']
  ];
  function classify(field) {
    const value = field.value.trim(); const hint = `${field.name} ${field.id} ${field.label} ${field.type}`.toLowerCase();
    if (field.type === 'password') return { sensitive: true, kind: 'password', confidence: .99, risk: 'high' };
    if (patterns.email.test(value) || hint.includes('email')) return { sensitive: true, kind: 'email', confidence: .97, risk: 'high' };
    if (patterns.phone.test(value.replace(/[\s()-]/g, '')) || hint.includes('phone') || hint.includes('mobile')) return { sensitive: true, kind: 'phone', confidence: .95, risk: 'high' };
    if (patterns.card.test(value) || hint.includes('card')) return { sensitive: true, kind: 'card', confidence: .96, risk: 'high' };
    for (const [needle, kind, confidence, risk] of metadataTypes) if (hint.includes(needle)) return { sensitive: true, kind, confidence, risk };
    return { sensitive: false, kind: 'none', confidence: .94, risk: 'low' };
  }
  return { classify };
})();
