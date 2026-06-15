# M2M Package Contract

## Purpose

This contract lets another agent, agency, SaaS builder, or solo operator consume the No-Shell Agent Operating Pack as a machine-readable workflow product, not only as a human-readable prompt pack.

## Package Stage

`m2m_package_contract_v1`

## Primary Surfaces

| Surface | Location | Use |
|---|---|---|
| Remote MCP | `https://ai-automation-operating-pack.vercel.app/api/mcp` | Agent-to-agent tool access. |
| Architect API | `https://ai-automation-operating-pack.vercel.app/api/architect` | HTTP workflow stack design. |
| M2M Package API | `https://ai-automation-operating-pack.vercel.app/api/m2m-package` | One-call package contract for integrators. |
| Starter ZIP | `dist/no-shell-agent-operating-pack-starter-v1.zip` | Human delivery pack. |
| Workbench ZIP | `dist/no-shell-agent-operating-pack-workbench-v1.zip` | Internal review and customization pack. |

## Required Input

- `goal`: the real workflow outcome in plain language.
- `buyerType`: agency, freelancer, SaaS builder, internal ops team, or solo operator.
- `domain`: optional domain hint such as `email_docs`, `social_content`, `browser_ops`, `coding`, `research_reporting`, `knowledge_base`, `ecommerce_data`, or `custom`.
- `risk`: `low`, `medium`, or `high`.
- `currentTools`: tools, MCPs, plugins, connectors, or account routes already available.

## Guaranteed Output Blocks

- `interpreted_domain`
- `recommended_stack`
- `execution_phases`
- `copy_paste_prompt`
- `validation`
- `human_boundaries`
- `account_automation`
- `permissioned_connector_v1` when account or session work is needed
- `delivery_contract`
- `paid_readiness_gates`

## Buyer Handoff

Each package handoff must include:

1. One workflow goal.
2. One allowed tool or account scope.
3. One dry-run sample.
4. One PASS/WARN/FAIL scorecard.
5. One recovery path.
6. One remaining live-action boundary.

## Paid Readiness Gates

Do not treat the package as paid-ready until:

- at least 20 real workflow attempts are logged;
- at least 3 users say the output made their first automation command clearer;
- at least 2 repeated buyer objections are addressed in the package;
- no live account, payment, or public-posting action is required to test the free package.

## Not Included

- No payment activation.
- No customer secrets.
- No raw mailbox, password, token, cookie, or recovery-code export.
- No public posting without exact live-action instruction.
- No claim that weak beta signals prove willingness to pay.

## Validation

Before shipping a package change:

```powershell
npm run collect:beta
npm run dogfood:beta
npm run selfcheck
npm run test
npm run build
```

`PASS` means the package contract is runnable and internally consistent. It does not mean the market has validated paid demand.
