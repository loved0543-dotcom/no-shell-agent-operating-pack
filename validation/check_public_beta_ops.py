#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = {
    "validation/collect_public_beta_signals.py": ["GitHub stars", "MCP Registry", "write-obsidian"],
    "validation/dogfood_public_beta_ops.py": ["DOGFOOD_GOAL", "permissioned connector v1", "posted_publicly"],
    "outreach/public_beta_signal_snapshot.json": ["collector_status", "beta_signal_status"],
    "outreach/public_beta_tracker.md": ["Latest Automated Snapshot", "beta_signal_status"],
    "outreach/public_beta_tracker.csv": ["repo_snapshot", "MCP Registry"],
    "outreach/dogfood_public_beta_ops.md": ["Dogfood Public Beta Ops", "permissioned_connector_required"],
    "outreach/dogfood_public_beta_ops.json": ["permissioned_connector_required", "ready_to_run_as_dry_plan"],
    "outreach/public_beta_one_channel_launch.md": ["staged_not_posted", "Show HN", "Live boundary"],
    "outreach/public_beta_action_ledger.md": ["live_external_action", "Owner login"],
    "delivery/06_permissioned_connector_v1.md": ["Gmail Connector V1", "Community Connector V1", "Action Ledger Schema"],
}

SECRET_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9_-]{12,}"),
    re.compile(r"gh[pousr]_[A-Za-z0-9_]{12,}"),
    re.compile(r"xox[baprs]-[A-Za-z0-9-]{12,}"),
]


def main() -> int:
    errors: list[str] = []
    for rel, needles in REQUIRED.items():
        path = ROOT / rel
        if not path.exists():
            errors.append(f"missing {rel}")
            continue
        text = path.read_text(encoding="utf-8")
        if len(text.strip()) < 120:
            errors.append(f"too short {rel}")
        for needle in needles:
            if needle not in text:
                errors.append(f"{rel} missing {needle}")
        for pattern in SECRET_PATTERNS:
            if pattern.search(text):
                errors.append(f"possible secret pattern in {rel}")

    snapshot_path = ROOT / "outreach/public_beta_signal_snapshot.json"
    if snapshot_path.exists():
        snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
        boundary = snapshot.get("boundaries", {})
        if boundary.get("posted_publicly") is not False:
            errors.append("signal snapshot must record posted_publicly=false")
        if boundary.get("used_secret") is not False:
            errors.append("signal snapshot must record used_secret=false")

    dogfood_path = ROOT / "outreach/dogfood_public_beta_ops.json"
    if dogfood_path.exists():
        dogfood = json.loads(dogfood_path.read_text(encoding="utf-8"))
        boundary = dogfood.get("boundary", {})
        response = dogfood.get("response", {})
        if boundary.get("posted_publicly") is not False:
            errors.append("dogfood must record posted_publicly=false")
        if response.get("account_automation", {}).get("status") != "permissioned_connector_required":
            errors.append("dogfood account automation status mismatch")

    if errors:
        print("FAIL public beta ops check")
        for error in errors:
            print(f"- {error}")
        return 1
    print("PASS public beta ops check")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
