#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
PACKAGE = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))

EXPECTED_VERSION = os.environ.get("EXPECTED_VERSION", PACKAGE["version"])
PRIMARY_ORIGIN = os.environ.get("PRIMARY_ORIGIN", "https://ai-automation-operating-pack.vercel.app").rstrip("/")
LEGACY_ORIGIN = os.environ.get("LEGACY_ORIGIN", "https://no-shell-agent-architect-mcp.vercel.app").rstrip("/")
REGISTRY_SEARCH = os.environ.get(
    "REGISTRY_SEARCH",
    "https://registry.modelcontextprotocol.io/v0/servers?search=no-shell-agent-architect-mcp",
)
SERVER_NAME = "io.github.loved0543-dotcom/no-shell-agent-architect-mcp"
PRIMARY_MCP_URL = f"{PRIMARY_ORIGIN}/api/mcp"
REQUIRED_TOOLS = {
    "design_automation_stack",
    "generate_no_shell_prompt",
    "recommend_agent_tools",
    "audit_automation_plan",
    "build_validation_pack",
    "build_customer_intake",
}


def fetch(method: str, url: str, body: bytes | None = None, headers: dict[str, str] | None = None) -> str:
    request_headers = {
        "User-Agent": "no-shell-agent-live-contract-check",
        **(headers or {}),
    }
    req = urllib.request.Request(url, data=body, headers=request_headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read().decode("utf-8")


def fetch_json(url: str) -> Any:
    return json.loads(fetch("GET", url))


def parse_mcp_response(raw: str) -> dict[str, Any]:
    raw = raw.strip()
    if raw.startswith("{"):
        return json.loads(raw)
    for line in raw.splitlines():
        if line.startswith("data: "):
            return json.loads(line[len("data: ") :])
    raise ValueError("MCP response did not contain JSON or SSE data")


def check_origin(origin: str, errors: list[str]) -> None:
    health = fetch_json(f"{origin}/api/health")
    if health.get("ok") is not True:
        errors.append(f"{origin}/api/health did not return ok=true")
    if health.get("version") != EXPECTED_VERSION:
        errors.append(f"{origin}/api/health version={health.get('version')} expected={EXPECTED_VERSION}")

    server = fetch_json(f"{origin}/server.json")
    if server.get("version") != EXPECTED_VERSION:
        errors.append(f"{origin}/server.json version={server.get('version')} expected={EXPECTED_VERSION}")
    remotes = server.get("remotes") or []
    remote_url = remotes[0].get("url") if remotes else None
    if remote_url != PRIMARY_MCP_URL:
        errors.append(f"{origin}/server.json remote={remote_url} expected={PRIMARY_MCP_URL}")


def check_mcp_tools(errors: list[str]) -> None:
    payload = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}).encode("utf-8")
    raw = fetch(
        "POST",
        PRIMARY_MCP_URL,
        body=payload,
        headers={"Content-Type": "application/json", "Accept": "application/json, text/event-stream"},
    )
    data = parse_mcp_response(raw)
    tools = data.get("result", {}).get("tools", [])
    names = {tool.get("name") for tool in tools}
    missing = REQUIRED_TOOLS - names
    if missing:
        errors.append(f"MCP tools/list missing: {', '.join(sorted(missing))}")


def check_registry(errors: list[str]) -> None:
    registry = fetch_json(REGISTRY_SEARCH)
    latest = None
    for item in registry.get("servers", []):
        server = item.get("server", {})
        meta = item.get("_meta", {}).get("io.modelcontextprotocol.registry/official", {})
        if server.get("name") == SERVER_NAME and meta.get("isLatest") is True:
            latest = server
            break

    if not latest:
        errors.append("MCP Registry latest entry was not found")
        return
    if latest.get("version") != EXPECTED_VERSION:
        errors.append(f"MCP Registry latest version={latest.get('version')} expected={EXPECTED_VERSION}")
    remotes = latest.get("remotes") or []
    remote_url = remotes[0].get("url") if remotes else None
    if remote_url != PRIMARY_MCP_URL:
        errors.append(f"MCP Registry remote={remote_url} expected={PRIMARY_MCP_URL}")


def run_once() -> list[str]:
    errors: list[str] = []
    check_origin(PRIMARY_ORIGIN, errors)
    check_origin(LEGACY_ORIGIN, errors)
    check_mcp_tools(errors)
    check_registry(errors)
    return errors


def main() -> int:
    attempts = int(os.environ.get("LIVE_CHECK_ATTEMPTS", "3"))
    delay = int(os.environ.get("LIVE_CHECK_DELAY_SECONDS", "20"))
    last_errors: list[str] = []

    for attempt in range(1, attempts + 1):
        try:
            last_errors = run_once()
        except (urllib.error.URLError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
            last_errors = [f"live contract check request failed: {exc}"]

        if not last_errors:
            print("PASS live contract check")
            print(f"primary={PRIMARY_ORIGIN}")
            print(f"legacy={LEGACY_ORIGIN}")
            print(f"version={EXPECTED_VERSION}")
            return 0

        if attempt < attempts:
            print(f"WARN live contract attempt {attempt}/{attempts} failed; retrying in {delay}s")
            for error in last_errors:
                print(f"- {error}")
            time.sleep(delay)

    print("FAIL live contract check")
    for error in last_errors:
        print(f"- {error}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
