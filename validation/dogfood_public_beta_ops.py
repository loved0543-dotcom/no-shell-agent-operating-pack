#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
OUTREACH = ROOT / "outreach"
DOGFOOD_JSON = OUTREACH / "dogfood_public_beta_ops.json"
DOGFOOD_MD = OUTREACH / "dogfood_public_beta_ops.md"

ORIGIN = os.environ.get("ARCHITECT_ORIGIN", "https://ai-automation-operating-pack.vercel.app").rstrip("/")

DOGFOOD_GOAL = (
    "Use No-Shell Agent Architect MCP to operate its own free public beta: collect GitHub and MCP Registry signals, "
    "stage one safe public feedback post, triage feedback into product fixes, and design a Gmail/community "
    "permissioned connector v1 without using secrets, cookies, paid APIs, or live posting."
)


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def post_architect() -> dict[str, Any]:
    payload = {
        "goal": DOGFOOD_GOAL,
        "userType": "solo operator",
        "domain": "social_content",
        "risk": "high",
        "language": "ko",
        "currentTools": ["GitHub", "MCP Registry", "Vercel", "Gmail connector", "Browser plugin"],
    }
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{ORIGIN}/api/architect",
        data=body,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "no-shell-agent-dogfood-public-beta-ops",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as res:
        data = json.loads(res.read().decode("utf-8"))
    return {"request": payload, "response": data}


def validate(result: dict[str, Any]) -> list[str]:
    response = result.get("response") or {}
    errors: list[str] = []
    if response.get("interpreted_domain") != "social_content":
        errors.append("dogfood did not route to social_content")
    if response.get("risk") != "high":
        errors.append("dogfood did not preserve high risk")
    if response.get("status") != "ready_to_run_as_dry_plan":
        errors.append("dogfood response is not a dry-run plan")
    if response.get("account_automation", {}).get("status") != "permissioned_connector_required":
        errors.append("dogfood did not require permissioned connector automation")
    if not response.get("recommended_stack"):
        errors.append("dogfood recommended stack is empty")
    if len(response.get("execution_phases") or []) < 5:
        errors.append("dogfood execution phases are too thin")
    prompt = response.get("copy_paste_prompt") or ""
    for needle in ["권한형 계정 자동화", "완료 보고", "PASS/WARN/FAIL"]:
        if needle not in prompt:
            errors.append(f"copy-paste prompt missing {needle}")
    validation = response.get("validation") or {}
    if "community posting" not in " ".join(validation.get("qa_checks") or []):
        errors.append("validation pack does not mention community posting")
    return errors


def render_markdown(result: dict[str, Any], errors: list[str]) -> str:
    response = result["response"]
    stack = response.get("recommended_stack") or []
    phases = response.get("execution_phases") or []
    account = response.get("account_automation") or {}
    return "\n".join(
        [
            "# Dogfood Public Beta Ops",
            "",
            f"- collected_at: `{result['collected_at']}`",
            f"- architect_origin: `{ORIGIN}`",
            f"- status: `{'PASS' if not errors else 'FAIL'}`",
            f"- goal: {result['request']['goal']}",
            f"- interpreted_domain: `{response.get('interpreted_domain')}`",
            f"- risk: `{response.get('risk')}`",
            f"- account_automation: `{account.get('status')}`",
            "",
            "## Recommended Stack",
            "",
            *[f"- `{item.get('id')}`: {item.get('label')} - {item.get('why')}" for item in stack[:6]],
            "",
            "## Execution Phases",
            "",
            *[f"- {phase.get('name')}: {phase.get('action')}" for phase in phases],
            "",
            "## Boundary",
            "",
            "- Dogfood run used the Architect API only.",
            "- No account login, secret, paid API, public post, or payment change was performed.",
            "- External community posting remains staged until platform, destination, and final copy are exact.",
            "",
            "## Validation",
            "",
            *([f"- FAIL: {error}" for error in errors] if errors else ["- PASS: dogfood output includes stack, permission route, phases, QA, and live-action boundary."]),
            "",
        ]
    )


def main() -> int:
    try:
        result = post_architect()
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        print(f"FAIL dogfood public beta ops: {exc}")
        return 1
    result["collected_at"] = iso_now()
    result["boundary"] = {
        "used_public_api": True,
        "used_account_login": False,
        "used_secret": False,
        "used_paid_api": False,
        "posted_publicly": False,
        "payment_changed": False,
    }
    errors = validate(result)
    OUTREACH.mkdir(parents=True, exist_ok=True)
    DOGFOOD_JSON.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    DOGFOOD_MD.write_text(render_markdown(result, errors), encoding="utf-8")
    if errors:
        print("FAIL dogfood public beta ops")
        for error in errors:
            print(f"- {error}")
        return 1
    print("PASS dogfood public beta ops")
    print(f"origin={ORIGIN}")
    print(f"dogfood_md={DOGFOOD_MD}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
