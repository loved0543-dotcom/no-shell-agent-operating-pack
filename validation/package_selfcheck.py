#!/usr/bin/env python3
from pathlib import Path
import zipfile
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "README.md",
    "LICENSE",
    "CONTRIBUTING.md",
    "SECURITY.md",
    ".gitignore",
    "docs/_evidence/no-shell-agent-operating-pack.md",
    "docs/CODEX_FOR_OSS_APPLICATION.md",
    "free/ai_automation_failure_diagnostic_card.md",
    "starter/email_document_automation_pack.md",
    "demo/before_after_email_document_demo.md",
    "delivery/START_HERE.md",
    "delivery/01_customer_intake.md",
    "delivery/02_tool_router.md",
    "delivery/03_command_cards.md",
    "delivery/04_result_scorecard.md",
    "delivery/05_recovery_playbook.md",
    "delivery/06_permissioned_connector_v1.md",
    "delivery/07_m2m_package_contract.md",
    "offer/sales_page.md",
    "offer/pricing_and_gtm.md",
    "offer/platform_listing_copy.md",
    "outreach/20_person_test_list.md",
    "outreach/message_templates.md",
    "outreach/validation_tracker.csv",
    "outreach/validation_tracker.md",
    "outreach/public_beta_tracker.csv",
    "outreach/public_beta_tracker.md",
    "outreach/public_beta_signal_snapshot.json",
    "outreach/dogfood_public_beta_ops.md",
    "outreach/dogfood_public_beta_ops.json",
    "outreach/public_beta_one_channel_launch.md",
    "outreach/public_beta_action_ledger.md",
    "validation/collect_public_beta_signals.py",
    "validation/dogfood_public_beta_ops.py",
    "validation/check_public_beta_ops.py",
    "visual/hero_workflow_mockup.html",
    "visual/free_diagnostic_card.html",
    "visual/before_after_demo.html",
    "landing/index.html",
    "assets/hero-workflow.png",
    "assets/landing-screenshot.png",
    "pdf/free-diagnostic-card.pdf",
    "pdf/before-after-demo.pdf",
    "dist/no-shell-agent-operating-pack-starter-v1.zip",
    "dist/no-shell-agent-operating-pack-workbench-v1.zip",
]

MUST_CONTAIN = {
    "docs/_evidence/no-shell-agent-operating-pack.md": [
        "Customer Dossier",
        "Competitor Teardown",
        "Willingness-To-Pay",
        "Category-#1 Thesis",
        "GTM",
        "Price Ladder",
        "Kill Criteria",
        "https://n8n.io/workflows/categories/ai/",
        "https://zapier.com/agents",
    ],
    "delivery/04_result_scorecard.md": ["즉시 FAIL", "실패복구", "사람 경계"],
    "delivery/06_permissioned_connector_v1.md": ["Gmail Connector V1", "Community Connector V1", "Action Ledger Schema"],
    "delivery/07_m2m_package_contract.md": ["M2M Package Contract", "m2m_package_contract_v1", "Paid Readiness Gates", "/api/m2m-package"],
    "offer/pricing_and_gtm.md": ["free public beta", "$29", "$99", "$300", "Kill condition"],
    "free/ai_automation_failure_diagnostic_card.md": ["10가지 진단", "즉시 고치는 문장"],
    "starter/email_document_automation_pack.md": ["테스트 입력 3개", "사람이 확인할 경계"],
    "demo/before_after_email_document_demo.md": ["Before", "After", "껍데기"],
    "offer/platform_listing_copy.md": ["Gumroad", "Lemon Squeezy", "Ko-fi", "Free public beta"],
    "outreach/20_person_test_list.md": ["20명", "성공 기준", "실패 기준"],
    "outreach/validation_tracker.md": ["PASS", "WARN", "FAIL", "not_asked"],
    "outreach/public_beta_tracker.md": ["Public Beta Signal Tracker", "GitHub stars", "Paid Version Boundary", "Latest Automated Snapshot"],
    "outreach/dogfood_public_beta_ops.md": ["Dogfood Public Beta Ops", "permissioned_connector_required"],
    "outreach/public_beta_one_channel_launch.md": ["staged_not_posted", "Show HN", "Live boundary"],
    "outreach/public_beta_action_ledger.md": ["live_external_action", "Owner login"],
    "validation/collect_public_beta_signals.py": ["GitHub stars", "MCP Registry", "write-obsidian"],
    "validation/dogfood_public_beta_ops.py": ["DOGFOOD_GOAL", "permissioned connector v1", "posted_publicly"],
    "validation/check_public_beta_ops.py": ["public beta ops check", "delivery/06_permissioned_connector_v1.md"],
    "landing/index.html": ["Download ZIP", "무료 공개 베타", "Before / After"],
    "README.md": ["Customer ZIP", "Public beta tracker", "No payment connection", "collect:beta", "dogfood:beta", "/api/m2m-package"],
    "MANIFEST.md": ["Customer upload candidate", "Internal workbench archive"],
    "LICENSE": ["MIT License", "Copyright"],
    "CONTRIBUTING.md": ["Quality bar", "validation/package_selfcheck.py"],
    "SECURITY.md": ["Do not submit", "API keys", "private customer data"],
    "docs/CODEX_FOR_OSS_APPLICATION.md": [
        "https://openai.com/form/codex-for-oss/",
        "https://developers.openai.com/community/codex-for-oss",
        "loved0543-dotcom",
        "org-prCxbIDBJQkfSv7ZJkoz3w4t",
    ],
}

ZIP_REQUIRED = {
    "dist/no-shell-agent-operating-pack-starter-v1.zip": [
        "README.md",
        "MANIFEST.md",
        "LICENSE",
        "free/ai_automation_failure_diagnostic_card.md",
        "starter/email_document_automation_pack.md",
        "demo/before_after_email_document_demo.md",
        "delivery/START_HERE.md",
        "delivery/04_result_scorecard.md",
        "delivery/05_recovery_playbook.md",
        "pdf/free-diagnostic-card.pdf",
        "pdf/before-after-demo.pdf",
    ],
    "dist/no-shell-agent-operating-pack-workbench-v1.zip": [
        "README.md",
        "LICENSE",
        "CONTRIBUTING.md",
        "SECURITY.md",
        "landing/index.html",
        "assets/landing-screenshot.png",
        "docs/_evidence/no-shell-agent-operating-pack.md",
        "offer/platform_listing_copy.md",
        "outreach/20_person_test_list.md",
        "outreach/validation_tracker.csv",
        "validation/package_selfcheck.py",
    ],
}

def main() -> int:
    errors = []
    for rel in REQUIRED:
        path = ROOT / rel
        if not path.exists():
            errors.append(f"missing {rel}")
            continue
        if path.suffix.lower() in {".png", ".pdf"}:
            if path.stat().st_size < 1000:
                errors.append(f"binary artifact too small {rel}")
            continue
        if path.suffix.lower() == ".zip":
            if path.stat().st_size < 1000:
                errors.append(f"zip too small {rel}")
            try:
                with zipfile.ZipFile(path) as zf:
                    names = {n.replace("\\", "/") for n in zf.namelist() if not n.endswith("/")}
                for need in ZIP_REQUIRED.get(rel, []):
                    if not any(n.endswith(need) for n in names):
                        errors.append(f"{rel} missing zip member {need}")
            except zipfile.BadZipFile:
                errors.append(f"bad zip {rel}")
            continue
        text = path.read_text(encoding="utf-8")
        if ("TO" + "DO") in text or ("T" + "BD") in text:
            errors.append(f"placeholder in {rel}")
        if path.name != ".gitignore" and len(text.strip()) < 300:
            errors.append(f"too short {rel}")
    for rel, needles in MUST_CONTAIN.items():
        text = (ROOT / rel).read_text(encoding="utf-8")
        for needle in needles:
            if needle not in text:
                errors.append(f"{rel} missing {needle}")
    if errors:
        print("FAIL package selfcheck")
        for e in errors:
            print("-", e)
        return 1
    print("PASS package selfcheck")
    print(f"root={ROOT}")
    print(f"files={len(REQUIRED)}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
