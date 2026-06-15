# Operations

## Canonical endpoints

Use these URLs for docs, registries, and client setup:

- Live app: https://ai-automation-operating-pack.vercel.app
- Remote MCP: https://ai-automation-operating-pack.vercel.app/api/mcp
- Server metadata: https://ai-automation-operating-pack.vercel.app/server.json
- Registry search: https://registry.modelcontextprotocol.io/v0/servers?search=no-shell-agent-architect-mcp

The compatibility alias `https://no-shell-agent-architect-mcp.vercel.app` is kept only so old shared links do not go stale. New links should use `https://ai-automation-operating-pack.vercel.app`.

## Deployment

The Vercel project is connected to GitHub. A push to `main` deploys production automatically.

Before product changes are pushed:

```powershell
npm run selfcheck
npm run test
npm run build
```

After deployment:

```powershell
python validation/check_live_contract.py
vercel logs https://ai-automation-operating-pack.vercel.app --level error --since 1h --json
```

## GitHub Actions

- `Publish MCP Registry`: validates and publishes `server.json` to the official MCP Registry when `server.json` changes.
- `Monitor Production Contract`: checks the primary URL, compatibility alias, MCP tools list, and Registry latest entry every 6 hours and after a successful registry publish.

The monitor uses no secrets. It fails if:

- `/api/health` is not healthy.
- `/server.json` is not the expected version.
- either URL points at stale MCP metadata.
- `tools/list` is missing one of the six public MCP tools.
- the official Registry latest entry points at the wrong remote URL.

## Compatibility alias recovery

If `https://no-shell-agent-architect-mcp.vercel.app` drifts to an old deployment, find the latest production deployment and reassign the alias:

```powershell
vercel alias ls --scope parkhyunyung-s-projects
vercel alias set <latest-production-deployment>.vercel.app no-shell-agent-architect-mcp.vercel.app --scope parkhyunyung-s-projects
```

Then rerun:

```powershell
python validation/check_live_contract.py
```

## Launch boundary

Launch drafts are in `docs/LAUNCH_KIT.md`. Codex may prepare copy and verify links, but public posting to Product Hunt, Hacker News, Reddit, LinkedIn, or X must be done by the logged-in owner account after checking each community's rules.
