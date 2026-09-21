/* Dependency-free checks for the deterministic task and decision modules. Run: node tests/logic.test.js */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
function load(relative) { vm.runInThisContext(fs.readFileSync(path.join(__dirname, '..', relative), 'utf8'), { filename: relative }); }
load('extension/pii/detector.js'); load('extension/task/analyzer.js'); load('extension/privacy/decision-engine.js'); load('extension/sanitizer/sanitizer.js');
const task = TaskAwareTask.analyze('Search Delhi to Mumbai flights.');
console.assert(task.taskType === 'flight_search' && task.origin === 'Delhi' && task.destination === 'Mumbai', 'Flight task must parse');
const email = { label: 'Email address', name: 'email', id: 'email', type: 'email', value: 'amit@gmail.com', role: '' }; email.pii = TaskAwarePII.classify(email); email.decision = TaskAwareDecision.decide(email, task);
console.assert(email.pii.kind === 'email' && email.decision.decision === 'TOKENIZE', 'Unneeded email must tokenize');
const origin = { label: 'From', name: 'from', id: 'from', type: 'text', value: 'Delhi', role: 'origin', pii: { sensitive:false } }; origin.decision = TaskAwareDecision.decide(origin, task);
console.assert(origin.decision.decision === 'ALLOW', 'Required origin must allow');
const password = { label: 'Website password', name: 'password', id: 'password', type: 'password', value: 'demo-secret', role: '' }; password.pii = TaskAwarePII.classify(password); password.decision = TaskAwareDecision.decide(password, task);
console.assert(password.decision.decision === 'LOCAL_ONLY', 'Password must stay local');
const context = TaskAwareSanitizer.build(task, [origin, email, password]);
console.assert(context.from === 'Delhi' && context.fields['Email address'] === '[EMAIL]' && context.fields['Website password'] === '[LOCAL_ONLY]', 'Sanitizer must preserve only allowed task data');
console.log('TaskAware Shield logic checks passed.');
