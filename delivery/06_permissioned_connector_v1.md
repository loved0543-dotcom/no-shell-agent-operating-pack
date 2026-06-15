# Permissioned Connector V1

## Purpose

This is the first safe account-automation contract for the public beta. It lets an agent use a user-approved connector or logged-in session to read, draft, stage, and log account work without turning the product into a password, cookie, or posting bypass.

## V1 Modes

- `read_only`: inspect only the allowlisted label, query, page, community, or destination.
- `scoped_draft`: read, classify, summarize, and create drafts or staged outputs.
- `read_only_then_draft`: start read-only, then create one draft after the scope is confirmed.
- `live_action`: send, post, submit, edit, delete, schedule, or change account state only after the exact live action is requested.

## Gmail Connector V1

### Scope Contract

- Connector source: Gmail or Google Workspace connector through OAuth/plugin permissions.
- Read filters: label, search query, sender/domain, date range, max results.
- Write targets: draft reply, draft new email, task extraction note, summary report.
- Live boundary: send only when the user approved the exact recipient/thread and final wording.

### Run Card

1. Select one label/search query and a max result count.
2. Summarize matching threads with private content redacted from logs.
3. Create draft replies or a follow-up queue.
4. Validate recipients, missing context, tone, and forbidden live send.
5. Write the action ledger and report the exact remaining send/review step.

## Community Connector V1

### Scope Contract

- Connector source: official API, approved platform connector, or logged-in browser session owned by the user.
- Read filters: platform, community/subreddit/group, rules URL, allowed post type, target date.
- Write targets: staged post draft, comment draft, launch checklist, feedback triage queue.
- Live boundary: publish, comment, edit, delete, or schedule only after the exact platform, destination, and final copy are approved.

### Run Card

1. Choose exactly one public destination.
2. Read or open the destination rules before staging copy.
3. Create one feedback-seeking post draft with no fake traction claims.
4. Stage the draft and record `not_posted` unless the live action is explicitly approved.
5. Run the public beta signal collector after posting or after the scheduled observation window.

## Action Ledger Schema

```csv
timestamp,connector,mode,allowed_scope,target_id_or_url,draft_or_staged_artifact,validation_result,live_action_sent,remaining_human_step
```

## PASS Before Live Action

- The allowed scope is narrow enough that the agent cannot wander through unrelated account data.
- Draft/staging is separate from live send/post/submit.
- The action ledger exists and does not store tokens, cookies, recovery codes, or raw private content.
- The user can see the exact live action that remains.

## Hard No

- No password, cookie, recovery-code, or 2FA bypass.
- No unrestricted inbox, account, browser, or community scraping.
- No public, billing, identity, financial, or irreversible action without exact live-action instruction.
