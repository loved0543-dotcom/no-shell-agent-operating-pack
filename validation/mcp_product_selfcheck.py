#!/usr/bin/env python3
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "package.json",
    "tsconfig.json",
    "next.config.mjs",
    "app/page.tsx",
    "app/ArchitectClient.tsx",
    "app/api/[transport]/route.ts",
    "app/api/architect/route.ts",
    "app/api/health/route.ts",
    "lib/architect.ts",
    "lib/catalog.ts",
    "server.json",
    "public/server.json",
    "public/llms.txt",
    "public/og.svg",
    "app/robots.ts",
    "app/sitemap.ts",
    "app/launch/page.tsx",
    "app/show-hn/page.tsx",
    "docs/LAUNCH_KIT.md",
    "docs/OPERATIONS.md",
    "docs/_evidence/no-shell-agent-architect-mcp.md",
    "docs/MCP_REGISTRATION.md",
    ".github/workflows/monitor-production.yml",
    ".github/ISSUE_TEMPLATE/workflow-feedback.yml",
    ".github/ISSUE_TEMPLATE/bug.yml",
    "validation/check_live_contract.py",
    "tests/architect.test.ts",
]

NEEDLES = {
    "docs/_evidence/no-shell-agent-architect-mcp.md": [
        "Customer Dossier",
        "Competitor Teardown",
        "Willingness-To-Pay",
        "Category-#1 Thesis",
        "GTM",
        "Price Ladder",
        "Kill Criteria",
        "https://modelcontextprotocol.io/registry/remote-servers",
        "https://zapier.com/agents",
    ],
    "app/api/[transport]/route.ts": [
        "design_automation_stack",
        "generate_no_shell_prompt",
        "recommend_agent_tools",
        "audit_automation_plan",
        "build_validation_pack",
        "build_customer_intake",
    ],
    "lib/architect.ts": [
        "human_boundaries",
        "dry_run_tests",
        "upstream",
        "PASS",
        "WARN",
        "FAIL",
    ],
    "README.md": [
        "No-Shell Agent Architect MCP",
        "/api/mcp",
        "docs/LAUNCH_KIT.md",
    ],
    "docs/LAUNCH_KIT.md": [
        "Product Hunt Draft",
        "Show HN Draft",
        "Reddit / Community Draft",
        "LinkedIn Draft",
        "Directory Submission Copy",
        "Pre-Post Verification",
        "Signals To Watch",
    ],
    "docs/OPERATIONS.md": [
        "Canonical endpoints",
        "Compatibility alias recovery",
        "Monitor Production Contract",
        "Launch boundary",
    ],
    ".github/workflows/monitor-production.yml": [
        "Monitor Production Contract",
        "validation/check_live_contract.py",
    ],
    ".github/ISSUE_TEMPLATE/workflow-feedback.yml": [
        "Public beta workflow feedback",
        "What workflow did you try?",
        "Would you use this again?",
    ],
}

SECRET_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9_-]{20,}"),
    re.compile(r"ghp_[A-Za-z0-9_]{20,}"),
    re.compile(r"xox[baprs]-[A-Za-z0-9-]{20,}"),
]

GENERATED_DIRS = {
    ".git",
    ".next",
    ".vercel",
    "node_modules",
    "coverage",
    "dist",
    "build",
}


def load_json(rel: str):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))


def main() -> int:
    errors = []
    for rel in REQUIRED:
        path = ROOT / rel
        if not path.exists():
            errors.append(f"missing {rel}")
            continue
        if path.suffix.lower() in {".ts", ".tsx", ".md", ".json", ".txt", ".mjs"} and len(path.read_text(encoding="utf-8").strip()) < 80:
            errors.append(f"too short {rel}")

    for rel, needles in NEEDLES.items():
        path = ROOT / rel
        text = path.read_text(encoding="utf-8") if path.exists() else ""
        for needle in needles:
            if needle not in text:
                errors.append(f"{rel} missing {needle}")

    try:
        root_server = load_json("server.json")
        public_server = load_json("public/server.json")
        if root_server != public_server:
            errors.append("server.json and public/server.json differ")
        if not root_server.get("remotes") or root_server["remotes"][0].get("type") != "streamable-http":
            errors.append("server.json missing streamable-http remote")
        if "/api/mcp" not in root_server["remotes"][0].get("url", ""):
            errors.append("server.json remote is not /api/mcp")
    except Exception as exc:
        errors.append(f"server.json invalid: {exc}")

    for path in ROOT.rglob("*"):
        if path.is_dir() or any(part in GENERATED_DIRS for part in path.parts):
            continue
        if path.suffix.lower() not in {".ts", ".tsx", ".md", ".json", ".txt", ".mjs", ".css"}:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for pattern in SECRET_PATTERNS:
            if pattern.search(text):
                errors.append(f"possible secret in {path.relative_to(ROOT)}")

    if errors:
        print("FAIL mcp product selfcheck")
        for error in errors:
            print("-", error)
        return 1
    print("PASS mcp product selfcheck")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
