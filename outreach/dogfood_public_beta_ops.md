# Dogfood Public Beta Ops

- collected_at: `2026-06-15T12:39:18Z`
- architect_origin: `https://ai-automation-operating-pack.vercel.app`
- status: `PASS`
- goal: Use No-Shell Agent Architect MCP to operate its own free public beta: collect GitHub and MCP Registry signals, stage one safe public feedback post, triage feedback into product fixes, and design a Gmail/community permissioned connector v1 without using secrets, cookies, paid APIs, or live posting.
- interpreted_domain: `social_content`
- risk: `high`
- account_automation: `permissioned_connector_required`

## Recommended Stack

- `human-boundary`: Human boundary checkpoint - Real money, public publishing, account changes, and credential exposure need a visible live-action boundary.
- `chrome`: Chrome plugin - Use the user’s logged-in browser state only when a task genuinely depends on cookies or account UI.
- `permissioned-account-automation`: Permissioned account automation pattern - Lets agents read, draft, stage, submit, or post through approved account sessions while preserving scope, allowlists, dry-run mode, and an action ledger.
- `browser`: Browser plugin - Use it to open localhost, click through the UI, and catch layout/runtime breakage before calling work finished.
- `dynamic-workflow-orchestrator`: Dynamic workflow orchestrator skill - Splits large work into phases, bounded side tasks, integration, validation, and Obsidian trace.
- `github`: GitHub plugin - Handles repo, PR, issue, CI, and code review work without manual browser wandering.

## Execution Phases

- 1. Intake: Restate the real outcome, inputs, target user, available accounts, and forbidden actions.
- 2. Stack route: Choose the smallest tool stack that can actually complete the workflow, not just produce files.
- 3. Permission route: Define the OAuth/plugin/session source, read filters, destination allowlist, draft-vs-live split, and action ledger before touching account data.
- 4. Dry run: Run the workflow on a safe sample input and capture the evidence.
- 5. QA/audit: Check output correctness, missing source data, human boundary, and recovery path.
- 6. Handoff: Return a copy-paste command, result scorecard, and next-run checklist.

## Boundary

- Dogfood run used the Architect API only.
- No account login, secret, paid API, public post, or payment change was performed.
- External community posting remains staged until platform, destination, and final copy are exact.

## Validation

- PASS: dogfood output includes stack, permission route, phases, QA, and live-action boundary.
