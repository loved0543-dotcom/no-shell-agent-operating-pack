# MCP Registration Notes

## Public endpoint

Remote MCP endpoint:

```text
https://no-shell-agent-architect-mcp.vercel.app/api/mcp
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
      "url": "https://no-shell-agent-architect-mcp.vercel.app/api/mcp"
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
      "args": ["-y", "mcp-remote", "https://no-shell-agent-architect-mcp.vercel.app/api/mcp"]
    }
  }
}
```

## Directory submission copy

Name: No-Shell Agent Architect MCP

Description:
Turns vague automation requests into tool stacks, prompts, QA checks, and human boundaries.

Repository:
https://github.com/loved0543-dotcom/no-shell-agent-operating-pack

Remote:
https://no-shell-agent-architect-mcp.vercel.app/api/mcp
