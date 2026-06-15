# No-Shell Agent Operating Pack

An open-source operating pack for people who already use AI agents but keep getting "empty-shell automation": files, buttons, or dashboards that look finished but do not actually run a real workflow.

This is not a prompt-pack that promises magic. It is a plain-language operating system for delegating work to ChatGPT, Claude, Codex, Gemini, Hermes, and similar agents with a real objective, inputs, tool choice, permissioned account route, validation, recovery, and live-action boundary.

## No-Shell Agent Architect MCP

This repository now also ships a remote MCP/API product: **No-Shell Agent Architect MCP**.

Current launch mode: **free public beta**. There is no payment flow, usage gate, paid API call, or private customer data collection in this version. The goal is to observe GitHub stars, issues, workflow feedback, and real usage before deciding whether a paid version should exist later.

It takes a plain-language automation goal and returns:

- the recommended MCP/plugin/skill/tool stack;
- a copy-paste no-shell agent command;
- dry-run steps;
- QA and audit checks;
- recovery guidance;
- permissioned account routes and live-action boundaries for secrets, accounts, payments, publishing, and irreversible actions.

Local API preview:

```powershell
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

Canonical remote MCP endpoint:

```text
https://ai-automation-operating-pack.vercel.app/api/mcp
```

Live demo:

```text
https://ai-automation-operating-pack.vercel.app
```

Launch kit:

```text
https://ai-automation-operating-pack.vercel.app/launch
```

Public beta feedback:

```text
https://github.com/loved0543-dotcom/no-shell-agent-operating-pack/issues/1
```

Official MCP Registry:

```text
https://registry.modelcontextprotocol.io/v0/servers?search=no-shell-agent-architect-mcp
```

Compatibility URL:

```text
https://no-shell-agent-architect-mcp.vercel.app
```

The compatibility URL is kept for old shared links only. New docs, client config, and registry metadata should use `https://ai-automation-operating-pack.vercel.app`.

Client config:

```json
{
  "mcpServers": {
    "no-shell-agent-architect": {
      "url": "https://ai-automation-operating-pack.vercel.app/api/mcp"
    }
  }
}
```

## Who this is for

- Non-developers, solo operators, freelancers, and small teams who want practical AI automation.
- People who know AI can code or automate, but do not know which plugin, skill, command, or workflow to start with.
- People who need "make this business workflow actually work", not only "generate some code".

## What's included

- Free diagnostic: 10 reasons AI automations become empty shells.
- Free beta starter pack: Email and document automation workflow.
- Before/After demo: a shallow command vs a no-shell operating command.
- Customer intake sheet.
- Tool/router sheet for choosing agents, plugins, skills, MCP, browser, documents, spreadsheets, permissioned account connectors, or live-action review.
- Copy-paste command cards written in natural language.
- Result scorecard for catching fake completion.
- Recovery playbook: fix the upstream cause instead of stopping at one more gate.
- Permissioned connector v1 contract for Gmail/community account automation without password, cookie, or posting bypass.
- Validation tracker for a 20-person usefulness test.
- Public beta signal tracker for stars, issues, shares, and workflow feedback.
- Local landing mockup, PDF exports, and ZIP packages.

## Quick start

1. Read `free/ai_automation_failure_diagnostic_card.md`.
2. Open `demo/before_after_email_document_demo.md`.
3. Use `delivery/01_customer_intake.md` to describe one real workflow.
4. Pick the tool path in `delivery/02_tool_router.md`.
5. Run the command card in `delivery/03_command_cards.md`.
6. Check the result with `delivery/04_result_scorecard.md`.
7. If it fails, use `delivery/05_recovery_playbook.md`.

## Rendered artifacts

- Local landing mockup: `landing/index.html`
- Free PDF: `pdf/free-diagnostic-card.pdf`
- Demo PDF: `pdf/before-after-demo.pdf`
- Customer ZIP: `dist/no-shell-agent-operating-pack-starter-v1.zip`
- Workbench ZIP: `dist/no-shell-agent-operating-pack-workbench-v1.zip`
- Validation tracker: `outreach/validation_tracker.csv`
- Public beta tracker: `outreach/public_beta_tracker.csv`
- Public feedback issue: https://github.com/loved0543-dotcom/no-shell-agent-operating-pack/issues/1

Collect current public beta signals without any account login or paid API:

```powershell
npm run collect:beta
```

For the local operator's Obsidian vault, use:

```powershell
npm run collect:beta:obsidian
```

Dogfood the product against its own public beta operation:

```powershell
npm run dogfood:beta
npm run check:beta-ops
```

This writes `outreach/dogfood_public_beta_ops.md`, stages one public feedback post packet in `outreach/public_beta_one_channel_launch.md`, and verifies the action ledger and permissioned connector v1 contract.

## Validation

Run the package selfcheck:

```powershell
npm run selfcheck
npm run test
npm run build
```

Expected result:

```text
PASS package selfcheck
PASS mcp product selfcheck
```

The selfcheck verifies required files, rendered PDF/PNG artifacts, ZIP contents, landing copy, README/manifest, validation-tracker fields, MCP metadata, tool coverage, and secret-pattern safety.

It also checks the public beta operations loop: signal collector, dogfood output, one-channel staged launch packet, action ledger, and permissioned connector v1 runbook.

After production deploys, verify the live contract:

```powershell
npm run check:live
```

This checks the canonical URL, compatibility URL, MCP `tools/list`, and the official Registry latest entry.

## Marketing

Launch copy, community drafts, Product Hunt copy, Show HN copy, Reddit/LinkedIn/X drafts, and directory submission text live in `docs/LAUNCH_KIT.md`.

Public posting is not a bypass. It may be automated only through an approved API, connector, or logged-in browser session with an allowlisted destination, draft/staging mode, an action ledger, and an exact live-action instruction after checking each community's rules.

## Operations

Deployment, monitoring, compatibility alias recovery, and post-deploy checks are documented in `docs/OPERATIONS.md`.

## Current status

This repository is public, open source, and free to use as a public beta. It is early-stage and still needs real external validation. The product is complete enough to show to users, but demand is not proven until public usage signals and the validation trackers have real responses.

No payment connection, storefront publish, customer credential, secret, or private customer data is included in this repository. The product describes permissioned connector architecture, not stored account access. Future paid packaging is intentionally postponed until there is clear usage and feedback.

## License

MIT. See `LICENSE`.
