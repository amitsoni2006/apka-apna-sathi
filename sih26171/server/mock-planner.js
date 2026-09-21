/*
 * Deliberately small local planner service for the SIH demo.
 * It receives sanitized JSON, rejects obvious raw PII, and returns an allow-listed action.
 * No LLM is claimed or used; replace this boundary with an open-weight LLM/VLM later.
 */
const http = require('http');
const forbidden = [/@/, /(?:\+91[\s-]?)?[6-9]\d{9}/, /(?:\d[ -]?){13,19}/];
function readBody(request) { return new Promise((resolve, reject) => { let body = ''; request.on('data', chunk => body += chunk); request.on('end', () => resolve(body)); request.on('error', reject); }); }
http.createServer(async (request, response) => {
  response.setHeader('access-control-allow-origin', '*'); response.setHeader('content-type', 'application/json');
  if (request.method !== 'POST' || request.url !== '/plan') { response.writeHead(404).end(JSON.stringify({ error: 'Use POST /plan.' })); return; }
  try {
    const raw = await readBody(request); if (raw.length > 10_000) throw new Error('Context exceeds demo limit.');
    if (forbidden.some(pattern => pattern.test(raw))) throw new Error('Rejected: raw PII-like content crossed the planner boundary.');
    const context = JSON.parse(raw);
    if (context.task !== 'flight_search' || !context.from || !context.to || context.action !== 'search_flights') throw new Error('No allow-listed plan is available for this sanitized context.');
    response.writeHead(200).end(JSON.stringify({ action: 'click_search', planner: 'local-deterministic-planner', received: { task: context.task, from: context.from, to: context.to } }));
  } catch (error) { response.writeHead(400).end(JSON.stringify({ error: error.message })); }
}).listen(8787, '127.0.0.1', () => console.log('Sanitized planner listening at http://127.0.0.1:8787'));
