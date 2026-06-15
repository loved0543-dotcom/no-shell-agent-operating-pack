# MCP Registration Notes

## Public endpoint

Remote MCP endpoint:

```text
https://ai-automation-operating-pack.vercel.app/api/mcp
```

## Registry status

Published to the official MCP Registry through GitHub Actions OIDC. The latest registered version should match `package.json` and point to:

```text
https://ai-automation-operating-pack.vercel.app/api/mcp
```

Registry search:

```text
https://registry.modelcontextprotocol.io/v0/servers?search=no-shell-agent-architect-mcp
```

## Registry metadata

Use `server.json` at the repository root. The same file is also served from `/server.json` for crawlers and directory reviewers.

Official MCP Registry remote-server docs support the `remotes` property with `streamable-http` endpoints. The registry is preview, so metadata may need to be refreshed after deployment.

## Client examples

Streamable HTTP:

```json
{
  "mcpServers": {
    "no-shell-agent-architect": {
      "url": "https://ai-automation-operating-pack.vercel.app/api/mcp"
    }
  }
}
```

Stdio-only clients can use `mcp-remote`:

```json
{
  "mcpServers": {
    "no-shell-agent-architect": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://ai-automation-operating-pack.vercel.app/api/mcp"]
    }
  }
}
```

## Directory submission copy

Name: No-Shell Agent Architect MCP

Description:
Turns vague automation requests into tool stacks, permissioned account routes, prompts, QA checks, live-action boundaries, and M2M package contracts.

Repository:
https://github.com/loved0543-dotcom/no-shell-agent-operating-pack

Remote:
https://ai-automation-operating-pack.vercel.app/api/mcp

## Live verification

Before sending the endpoint to a directory or reviewer:

```powershell
npm run check:live
```

This verifies the canonical endpoint, compatibility alias, MCP `tools/list`, and official Registry latest entry.

The public tool list includes `build_m2m_package_contract` for agencies, SaaS builders, and other agents that need a machine-readable integration and delivery contract.

The old compatibility URL `https://no-shell-agent-architect-mcp.vercel.app` may be used only for previously shared links. New submissions should use the canonical `ai-automation-operating-pack.vercel.app` URL.
