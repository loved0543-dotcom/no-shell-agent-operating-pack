# No-Shell Agent Operating Pack

An open-source operating pack for people who already use AI agents but keep getting "empty-shell automation": files, buttons, or dashboards that look finished but do not actually run a real workflow.

This is not a prompt-pack that promises magic. It is a plain-language operating system for delegating work to ChatGPT, Claude, Codex, Gemini, Hermes, and similar agents with a real objective, inputs, tool choice, validation, recovery, and human boundary.

## No-Shell Agent Architect MCP

This repository now also ships a remote MCP/API product: **No-Shell Agent Architect MCP**.

It takes a plain-language automation goal and returns:

- the recommended MCP/plugin/skill/tool stack;
- a copy-paste no-shell agent command;
- dry-run steps;
- QA and audit checks;
- recovery guidance;
- human boundaries for secrets, accounts, payments, publishing, and irreversible actions.

Local API preview:

```powershell
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

Remote MCP endpoint after deployment:

```text
https://no-shell-agent-architect-mcp.vercel.app/api/mcp
```

Official MCP Registry:

```text
https://registry.modelcontextprotocol.io/v0/servers?search=no-shell-agent-architect-mcp
```

Client config:

```json
{
  "mcpServers": {
    "no-shell-agent-architect": {
      "url": "https://no-shell-agent-architect-mcp.vercel.app/api/mcp"
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
- Starter pack: Email and document automation workflow.
- Before/After demo: a shallow command vs a no-shell operating command.
- Customer intake sheet.
- Tool/router sheet for choosing agents, plugins, skills, MCP, browser, documents, spreadsheets, or manual review.
- Copy-paste command cards written in natural language.
- Result scorecard for catching fake completion.
- Recovery playbook: fix the upstream cause instead of stopping at one more gate.
- Validation tracker for a 20-person usefulness test.
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

## Current status

This repository is public and open source. It is early-stage and still needs real external validation. The local package is complete enough to show to users, but market demand is not proven until the 20-person validation tracker has real responses.

No payment connection, storefront publish, account login, secret, or private customer data is included in this repository.

## License

MIT. See `LICENSE`.
