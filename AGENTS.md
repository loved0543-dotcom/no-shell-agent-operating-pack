# No-Shell Agent Operating Pack AGENTS

This repository is both a plain-language AI automation operating pack and the
No-Shell Agent Architect MCP/API.

## Product rule

Do not make vague prompt-pack content. Every feature must help a user move from
"automate this" to a concrete stack, command, dry run, QA/audit check, recovery
path, and human boundary.

## Safety

- Do not store API keys, cookies, customer secrets, private transcripts, or real
  account data in this repo.
- Do not activate payments, public publishing, account changes, or external paid
  APIs from this repo.
- Directory submissions and deployment are allowed when the user directly asks,
  but report account/login steps that cannot be completed locally.

## Validation

Run before reporting product changes:

```powershell
npm run selfcheck
npm run test
npm run build
```

For registry or MCP changes, also check `server.json`, `/api/health`, and the
remote `/api/mcp` endpoint after deployment.
