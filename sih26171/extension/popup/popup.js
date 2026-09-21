let scanResult;
const $ = selector => document.querySelector(selector);
function setStatus(message, error = false) { $('#status').textContent = message; $('#status').style.color = error ? '#a93b5e' : ''; }
async function activeTab() { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); return tab; }
async function scan() {
  const taskText = $('#task').value.trim(); if (!taskText) return setStatus('Enter a task before scanning.', true);
  setStatus('Scanning page locally…');
  try { const tab = await activeTab(); const response = await chrome.tabs.sendMessage(tab.id, { type: 'TASK_AWARE_SCAN', taskText }); if (!response?.ok) throw new Error(response?.error || 'The content script is unavailable. Open the local demo page and reload it.'); scanResult = response.result; renderScan(); await chrome.runtime.sendMessage({ type: 'SAVE_AUDIT', payload: scanResult }); setStatus(`Local scan completed in ${scanResult.metrics.localProcessingMs} ms.`); } catch (error) { setStatus(error.message, true); }
}
function renderScan() {
  const { metrics, task, fields, sanitizedContext, visualEvidence, audit } = scanResult;
  $('#summary').innerHTML = [[metrics.elementsAnalyzed,'elements'],[metrics.piiDetected,'PII found'],[metrics.relevantFields,'allowed'],[metrics.sensitiveProtected,'protected']].map(([value,label]) => `<div class="metric"><b>${value}</b><span>${label}</span></div>`).join(''); $('#summary').classList.remove('hidden');
  $('#taskExplanation').textContent = `${task.taskType.replace('_',' ')} · ${Math.round(task.confidence * 100)}% parser confidence. ${task.explanation}`; $('#taskAnalysis').classList.remove('hidden');
  $('#decisionCount').textContent = `${fields.length} visible elements`;
  $('#decisionRows').innerHTML = fields.map(f => `<tr><td>${safe(f.label)}</td><td>${f.pii.sensitive ? `${f.pii.kind} · ${Math.round(f.pii.confidence*100)}%` : 'no'}</td><td>${f.decision.required ? 'yes' : 'no'}</td><td><span class="pill ${f.decision.decision.toLowerCase()}">${f.decision.decision}</span></td></tr>`).join(''); $('#decisions').classList.remove('hidden');
  $('#context').textContent = JSON.stringify(sanitizedContext, null, 2); $('#contextPanel').classList.remove('hidden');
  $('#visual').textContent = `${visualEvidence.description} ${visualEvidence.visibleElements.length} visible controls mapped.`; $('#visualPanel').classList.remove('hidden');
  $('#agentStatus').textContent = task.requiredAction ? `Plan: ${task.requiredAction}; only sanitized route context is used.` : 'No safe action available for this task.'; $('#run').disabled = !task.requiredAction; $('#agentPanel').classList.remove('hidden');
  $('#audit').innerHTML = audit.map(a => `<li><b>${safe(a.field)}</b> → ${a.decision}: ${safe(a.rationale)}</li>`).join(''); $('#auditPanel').classList.remove('hidden');
}
async function runAgent() {
  if (!scanResult) return; setStatus('Sending sanitized context to the local planner…');
  try {
    const planner = await chrome.runtime.sendMessage({ type: 'REQUEST_SANITIZED_PLAN', sanitizedContext: scanResult.sanitizedContext });
    if (!planner?.ok) throw new Error(planner?.error || 'Planner did not return a safe action.');
    if (planner.plan.action !== 'click_search') throw new Error('Planner action is not permitted by the local policy.');
    $('#agentStatus').textContent = `Planner received sanitized context only; returned: ${planner.plan.action}. Executing locally…`;
    const tab = await activeTab(); const response = await chrome.tabs.sendMessage(tab.id, { type: 'TASK_AWARE_RUN', task: scanResult.task });
    if (!response.ok) throw new Error(response.action?.message || 'Agent action failed.');
    const verification = response.verification; $('#agentStatus').textContent = `${response.action.message} Planner path: ${planner.plan.planner}.`;
    $('#verification').textContent = verification.passed ? `Verified: ${verification.evidence}` : `Not verified: ${verification.evidence}`;
    $('#verification').className = `verification ${verification.passed ? '' : 'fail'}`;
    setStatus(verification.passed ? 'Sanitized planner → local action → verification completed.' : 'Action was attempted but verification failed.', !verification.passed);
  } catch (error) { setStatus(error.message, true); }
}
function safe(value) { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; }
$('#scan').addEventListener('click', scan); $('#run').addEventListener('click', runAgent);
