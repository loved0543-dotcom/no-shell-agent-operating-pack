# Public Beta Signal Tracker

## Purpose

Track whether the free public beta attracts real interest before any paid packaging is considered.

Main public feedback thread: https://github.com/loved0543-dotcom/no-shell-agent-operating-pack/issues/1

## What To Track

- GitHub stars, watchers, forks, and issue activity.
- GitHub Release asset download counts when ZIPs are attached to Releases.
- Repo `dist/*.zip` presence, with the explicit note that raw/blob file download counts are not public.
- Visible public actors only: stargazers, fork owners, issue authors, and commenters. Do not claim to know raw downloaders or cloners.
- Real workflow examples people tried.
- Repeated domain requests.
- Repeated objections: too abstract, hard to connect, unclear output, missing examples, missing domain coverage.
- Public comments from launch posts, directories, or communities.

## CSV Fields

- `source`: GitHub, MCP Registry, Product Hunt, Hacker News, Reddit, LinkedIn, X, direct message, or directory.
- `signal_type`: star, issue, comment, share, fork, workflow_try, integration_request, objection.
- `workflow_domain`: email_docs, research_reporting, social_content, ecommerce_data, knowledge_base, browser_ops, coding, or other.
- `main_feedback`: the shortest honest summary of what they said.
- `next_action`: docs fix, tool output fix, example needed, domain support, no action, follow up.
- `status`: watching, responded, converted_to_issue, fixed, rejected, stale.

## Public Beta Decision Rules

- PASS: people open issues with real workflows, or repeated stars/shares come from relevant agent automation users.
- WARN: people star/download/fork it but do not try workflows or ask for examples.
- FAIL: people cannot tell what it does, or all feedback says it is just another prompt checklist.

## GitHub Download Visibility Boundary

- GitHub Releases expose aggregate `download_count` per attached asset.
- GitHub repo raw/blob ZIP files and tag zipball/tarball links do not expose public per-file download counts.
- GitHub traffic clone/view APIs require repo authentication and return aggregate counts only, not downloader identities.
- The tracker may list public stargazers, fork owners, issue authors, and commenters, but must not invent who downloaded a file.

## Paid Version Boundary

Do not add a payment flow during public beta. Future paid packaging should wait until there is repeated evidence that users want either domain packs, workflow audits, or hosted team features.

<!-- AUTO_PUBLIC_BETA_SIGNALS_START -->
## Latest Automated Snapshot

- collected_at: `2026-06-15T16:30:43Z`
- collector_status: `PASS`
- beta_signal_status: `WARN` - collector works, but public beta demand signal is still baseline/weak
- GitHub: stars `0`, forks `0`, subscribers/watchers `0`, open issues `1`
- Release asset downloads: releases `0`, total asset downloads `0`
- Repo ZIP files: dist ZIPs `2`, raw/blob download counter available `False`
- Tags: `2` tracked tags. GitHub tag zip/tarball downloads do not expose public download counts.
- Visible public actors: stargazers `0`, fork owners `0`
- GitHub traffic: `unauthorized`, clones aggregate available `False`, downloader identity available `False`
- Feedback issue: `#1` `open`, comments `0`
- Live health: `ok`, ok `True`, version `0.1.2`, remote `https://ai-automation-operating-pack.vercel.app/api/mcp`
- MCP Registry: `ok`, found `True`, latest `True`, version `0.1.2`
- Boundary: public read-only collection only; no account login, secret, paid API, payment change, public posting, or downloader de-anonymization.

### GitHub Release Assets

- No GitHub Releases exist yet, so Release asset download counts are `0/not available`.

### Repo ZIP Files

- `dist/no-shell-agent-operating-pack-starter-v1.zip` size `232749` raw download count `not available`
- `dist/no-shell-agent-operating-pack-workbench-v1.zip` size `366529` raw download count `not available`

### Feedback Issue Comments

- No public comments collected yet.

<!-- AUTO_PUBLIC_BETA_SIGNALS_END -->
