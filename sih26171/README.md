# TaskAware Shield — SIH26171 Prototype

**Problem statement:** SIH26171, *On-device Visual Perception for Light-weight Browser Agents* (ISRO, Software).

TaskAware Shield is a dependency-free Chrome/Chromium extension and local travel-search demo. It demonstrates a precise proposition: a browser agent should receive the minimum context required for its current task, rather than all visible page data.

For the demo request, “Search Delhi to Mumbai flights,” route values and the search control are allowed. Visible traveller name, email, phone, address, card-like value, and password-style field remain local or are represented semantically. All demo information is synthetic.

## Official PS171 alignment

The [official SIH portal](https://www.sih.gov.in/sih2026PS) describes PS171 as a browser privacy-preserving vision agent: local visual processing, local sanitization before any network request, central-server interpretation of anonymized context, and locally executed browser actions. Its stated evaluation weighting is visual-context accuracy 25%, PII recall/precision 20%, redaction precision 20%, client resources 20%, and end-to-end latency 15%.

This MVP maps to that pipeline. It uses DOM plus rendered visual geometry now, enforces a sanitized-only local planner boundary, and executes/verifies an allow-listed browser action. OCR and an on-device ViT/WebGPU model are intentionally presented as future adapters, not falsely claimed as present.

## What is actually implemented

- A local, realistic travel form with an **actual** `Search flights` behavior and rendered result state.
- Manifest V3 extension with popup, content script, and background audit persistence.
- On-demand, change-aware DOM scan of visible form controls and buttons.
- Lightweight visual evidence: visible rendered-element geometry, size, and visibility state are collected locally beside DOM data. This supports UI perception for normal HTML controls and is displayed in the popup.
- Rule-based local detection of name, email, phone, address, card-like numbers, and password inputs through labels, metadata, input type, and regex.
- Natural-language flight task parser for origin, destination, and permitted search action.
- Explicit per-element task-aware decisions: `ALLOW`, `TOKENIZE`, `BLOCK`, and `LOCAL_ONLY`.
- Semantic tokens such as `[EMAIL]`; high-risk card/password values become `[LOCAL_ONLY]`.
- A local planner server that accepts only sanitized JSON, rejects obvious raw PII-like data, and returns an allow-listed action; actual local click of the page's search button and actual verification that the expected route appears in the rendered results.
- Popup dashboard with decision table, sanitized JSON, audit trail, visual evidence status, and measured scan time/context byte sizes.
- Dependency-free unit checks for the core deterministic logic.

## Proposed future work (not claimed as implemented)

- OCR and screenshot/image perception for canvas, PDF, and image-only text.
- A lightweight on-device vision or local-language model for arbitrary sites and tasks.
- Quantitative precision/recall/visual-accuracy benchmarking on a labeled test corpus.
- A real remote-agent connector. The supplied prototype intentionally uses no network AI call; it demonstrates the privacy boundary and local agent controller.
- Production browser permissions, policy controls, cryptographic audit storage, and broader website compatibility.

## Architecture

1. The user enters a natural-language task in the extension popup.
2. The content script performs a user-triggered scan of visible page controls; a `MutationObserver` only marks page state dirty and does **not** continuously scan.
3. DOM extraction captures labels, values, types, control roles, and rendered geometry.
4. The local PII detector classifies values using deterministic heuristics.
5. The local task parser extracts a flight-search intent, origin, destination, and required action.
6. The privacy decision engine combines sensitivity, task relevance, confidence, and risk.
7. The sanitizer generates an AI-allowed JSON object; only `ALLOW` values can appear raw.
8. The popup renders tokens and decisions; it never renders sensitive raw values.
9. The local agent controller clicks the permitted `Search flights` button.
10. The verifier checks the results DOM for the expected origin and destination.

```text
User task → local DOM + visual-map scan → PII detection + task parsing
          → task-aware decision engine → sanitized context → local action → DOM verification
```

## Decision logic

| Condition | Decision |
| --- | --- |
| Non-sensitive and required route/action | `ALLOW` |
| Sensitive and not required | `TOKENIZE` |
| Password or card-like value | `LOCAL_ONLY` |
| Sensitive data with low task confidence | `BLOCK` |
| Unneeded unknown control | `BLOCK` |

Fail-safe default: when task confidence is below 60%, sensitive data is blocked. The extension has no ability or claim to access a browser password vault; it only sees values visibly present in the demo page's DOM.

## Run the demo

Use a Chromium-based browser. From this directory:

```bash
cd demo-site
python3 -m http.server 8080
```

In another terminal, start the planner that demonstrates the sanitized network boundary:

```bash
node server/mock-planner.js
```

Open [http://localhost:8080](http://localhost:8080). The demo must be served from localhost because content scripts are intentionally restricted to local demo origins.

### Load the extension

1. Go to `chrome://extensions` (or Chromium equivalent).
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select the absolute folder `/home/amitsoni/Documents/ChatGPT/codex.project/sih26171/extension`.
5. Open the TaskAware Shield extension popup while the local demo page is active.

The editable, Slide-2-ready architecture visual is [sih26171-slide2-architecture.svg](/home/amitsoni/Documents/ChatGPT/codex.project/sih26171/assets/sih26171-slide2-architecture.svg). It is also rendered inside the demo webpage.

### Two-minute SIH demo script

1. Point out the visible traveller details in the SkyRoute page.
2. Leave the default task: `Search Delhi to Mumbai flights.`
3. Click **Scan page**.
4. Show that From/To are `ALLOW`, while name/email/phone/address are `TOKENIZE`, and card/password are `LOCAL_ONLY`.
5. Open **AI-allowed context**: it has route data and semantic placeholders, never the visible private values.
6. Click **Run agent**.
7. Show the actual search results and the green verification result.
8. Point to scan latency, elements analyzed, PII found, protected fields, and raw-vs-sanitized context byte measurement.

## Metrics and honesty

The popup shows **prototype measurements**, collected using `performance.now()` and serialized-context byte counts: elements analyzed, PII count, task-relevant fields, sensitive fields protected, local scan time, and original/sanitized context size.

These are not benchmark claims. The prototype does not display fabricated accuracy, CPU, or memory values. It exposes the structure needed for future labeled accuracy and resource benchmarking.

## Validate core logic

```bash
cd /home/amitsoni/Documents/ChatGPT/codex.project/sih26171
node tests/logic.test.js
```

## Project layout

```text
sih26171/
├── demo-site/                 # local functional travel webpage
├── extension/
│   ├── content/               # local DOM + visual-map extraction
│   ├── pii/ task/ privacy/    # analysis and task-aware policy modules
│   ├── sanitizer/ agent/ verification/
│   ├── popup/                 # operator dashboard
│   └── background/            # local audit persistence
└── tests/                     # deterministic module checks
```

## Limitations

This is an SIH MVP focused on one deterministic, reproducible travel-search flow. Rule-based matching will not provide production-grade semantic understanding, the visual layer is not OCR, and extension security should be hardened before non-demo use. The intended result is demonstrable task-aware minimization—not a claim of universal privacy, perfect detection, or production readiness.
