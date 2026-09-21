const form = document.querySelector('#flightForm');
const results = document.querySelector('#results');
form.addEventListener('submit', event => {
  event.preventDefault();
  const from = document.querySelector('#from').value.trim();
  const to = document.querySelector('#to').value.trim();
  results.hidden = false;
  results.dataset.searchVerified = 'true';
  results.innerHTML = `<h2>Flights found: ${escapeHtml(from)} → ${escapeHtml(to)}</h2><p>Showing a synthetic result list for this local prototype.</p><p><b>SR 261</b> &nbsp; 08:15 — 10:20 &nbsp; Direct</p>`;
  results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
function escapeHtml(value) { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; }
