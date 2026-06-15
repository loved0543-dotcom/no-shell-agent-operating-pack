# Public Beta One-Channel Launch

## Decision

Start with one staged public feedback post, not a multi-channel blast.

- Target channel: Hacker News `Show HN`
- Status: `ready_for_owner_login`
- Reason: the product is a working public URL and open-source MCP/API, but the account login and final live submission belong to the owner.
- Live boundary: post only through the user's logged-in HN session with the staged title/body below. Do not bypass login, cookies, 2FA, or HN rules.

## Preflight

- Live app: https://ai-automation-operating-pack.vercel.app
- Source: https://github.com/loved0543-dotcom/no-shell-agent-operating-pack
- MCP endpoint: https://ai-automation-operating-pack.vercel.app/api/mcp
- Feedback issue: https://github.com/loved0543-dotcom/no-shell-agent-operating-pack/issues/1
- Required local check before posting: `npm run check:live`
- Required observation after posting or after staging review: `npm run collect:beta:obsidian`

## Rule Check

- Checked source: https://news.ycombinator.com/showhn.html
- Show HN fit: acceptable because this is a working public MCP/API and open-source repository that users can try.
- Required title form: title must begin with `Show HN`.
- Do not ask for upvotes or coordinated comments.
- Make it easy to try without barriers; the live demo, source, and MCP endpoint are included.

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
2026-06-15T12:44:00Z,community,ready_for_owner_login,Hacker News Show HN,https://news.ycombinator.com/submit,outreach/public_beta_one_channel_launch.md,rule_check_passed_chrome_extension_disabled,no,Enable Codex Chrome Extension or manually submit after HN login
2026-06-15T14:12:00Z,community,chrome_session_autonomy_retry,Hacker News Show HN,https://news.ycombinator.com/submit,outreach/public_beta_one_channel_launch.md,chrome_pages_opened_but_automation_unavailable,no,Codex Chrome Extension must be enabled and plugin native host repaired, or owner submits from the opened Chrome tab
2026-06-15T14:15:00Z,community,owner_hn_login_completed,Hacker News Show HN,https://news.ycombinator.com/submit,outreach/public_beta_one_channel_launch.md,owner_logged_in_but_codex_chrome_control_still_unavailable,no,Enable/repair Codex Chrome Extension control surface or submit from opened Chrome tab
```

## Why Not Post Automatically Here

The launch packet and final copy are ready. Live submission could not be completed in this run because the Codex Chrome Extension is installed but disabled, the Chrome native host registry entry is missing, and the Computer Use native pipe is unavailable in this Codex session. Codex opened the user's Chrome to the HN submit pages and the Codex extension manager, but it cannot safely press through the logged-in session without one of those control surfaces working. Do not bypass login, cookies, 2FA, or community rules.

Owner path:

1. Enable the Codex Chrome Extension in Chrome and reinstall/repair the Codex Chrome plugin from the Codex plugin UI if native-host communication still fails, then ask Codex to continue the HN submit step; or
2. Use the Chrome tabs already opened by Codex and paste the title/body above after logging in.

After posting, run:

```powershell
npm run collect:beta:obsidian
```
