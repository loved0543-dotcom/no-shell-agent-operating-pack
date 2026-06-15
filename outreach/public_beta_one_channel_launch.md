# Public Beta One-Channel Launch

## Decision

Start with one staged public feedback post, not a multi-channel blast.

- Target channel: Hacker News `Show HN`
- Status: `staged_not_posted`
- Reason: the product is a working public URL and open-source MCP/API, but the account login and final live submission belong to the owner.
- Live boundary: post only through the user's logged-in HN session after final title/body approval. Do not bypass login, cookies, 2FA, or HN rules.

## Preflight

- Live app: https://ai-automation-operating-pack.vercel.app
- Source: https://github.com/loved0543-dotcom/no-shell-agent-operating-pack
- MCP endpoint: https://ai-automation-operating-pack.vercel.app/api/mcp
- Feedback issue: https://github.com/loved0543-dotcom/no-shell-agent-operating-pack/issues/1
- Required local check before posting: `npm run check:live`
- Required observation after posting or after staging review: `npm run collect:beta:obsidian`

## Staged Show HN Draft

Title:

```text
Show HN: I made an MCP that tells agents how not to build empty-shell automation
```

Body:

```text
I kept seeing the same AI automation failure: people ask an agent to "automate this", and it produces a file, button, or dashboard that looks finished but does not actually run the workflow.

So I made a small remote MCP/API that sits before execution. It takes one plain-language automation goal and returns the operating pieces the agent should use before building: tool route, permissioned account route, copy-paste command, dry-run, QA checks, recovery path, and live-action boundary.

Live demo: https://ai-automation-operating-pack.vercel.app

MCP endpoint: https://ai-automation-operating-pack.vercel.app/api/mcp

Source: https://github.com/loved0543-dotcom/no-shell-agent-operating-pack

It is free during this public beta. I am watching stars, issues, and real workflow examples before deciding whether anything should become paid.

I would like feedback on two things:
1. Is this useful as an MCP tool, or should it just be a static checklist/template?
2. Which automation domains should be covered first: email/docs, browser ops, coding, research, or knowledge bases?
```

## Action Ledger Entry

```csv
timestamp,connector,mode,allowed_scope,target_id_or_url,draft_or_staged_artifact,validation_result,live_action_sent,remaining_human_step
2026-06-15T12:25:00Z,community,staged_draft,Hacker News Show HN,https://news.ycombinator.com/submit,outreach/public_beta_one_channel_launch.md,staged_not_posted,no,Owner logs in to HN and approves final title/body before submit
```

## Why Not Post Automatically Here

The user's current instruction is enough to build the launch packet and stage the action. It is not enough to choose or use an account session, bypass login, or submit a post through a third-party community. That live step needs the exact logged-in destination and final copy confirmation at the moment of posting.
