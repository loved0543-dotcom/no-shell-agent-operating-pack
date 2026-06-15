#!/usr/bin/env python3
"""Collect GitHub stars, issue feedback, live health, and MCP Registry signals."""
from __future__ import annotations

import argparse
import csv
import json
import re
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
OUTREACH = ROOT / "outreach"
TRACKER_MD = OUTREACH / "public_beta_tracker.md"
TRACKER_CSV = OUTREACH / "public_beta_tracker.csv"
SNAPSHOT_JSON = OUTREACH / "public_beta_signal_snapshot.json"

GITHUB_OWNER = "loved0543-dotcom"
GITHUB_REPO = "no-shell-agent-operating-pack"
FEEDBACK_ISSUE = 1
LIVE_ORIGIN = "https://ai-automation-operating-pack.vercel.app"
REGISTRY_SEARCH = "https://registry.modelcontextprotocol.io/v0/servers?search=no-shell-agent-architect-mcp"
SERVER_NAME = "io.github.loved0543-dotcom/no-shell-agent-architect-mcp"
PRIMARY_MCP_URL = f"{LIVE_ORIGIN}/api/mcp"

CSV_FIELDS = [
    "date",
    "source",
    "signal_type",
    "handle_or_org",
    "workflow_domain",
    "workflow_summary",
    "starred",
    "opened_issue",
    "shared_link",
    "main_feedback",
    "next_action",
    "status",
]

SECRET_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9_-]{12,}"),
    re.compile(r"gh[pousr]_[A-Za-z0-9_]{12,}"),
    re.compile(r"xox[baprs]-[A-Za-z0-9-]{12,}"),
    re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
]


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso_z(dt: datetime) -> str:
    return dt.isoformat(timespec="seconds").replace("+00:00", "Z")


def collapse(text: str, limit: int = 240) -> str:
    clean = " ".join((text or "").split())
    for pattern in SECRET_PATTERNS:
        clean = pattern.sub("[redacted]", clean)
    if len(clean) <= limit:
        return clean
    return clean[: limit - 3].rstrip() + "..."


def fetch_json(url: str) -> tuple[Any | None, dict[str, str], str | None]:
    headers = {
        "Accept": "application/vnd.github+json, application/json",
        "User-Agent": "no-shell-agent-public-beta-signal-collector",
    }
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=25) as res:
            body = res.read().decode("utf-8")
            return json.loads(body), dict(res.headers), None
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        return None, {}, str(exc)


def collect_github() -> dict[str, Any]:
    api_root = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
    repo, repo_headers, repo_error = fetch_json(api_root)
    issue, _, issue_error = fetch_json(f"{api_root}/issues/{FEEDBACK_ISSUE}")
    comments = None
    comments_error = None
    issue_comment_count = issue.get("comments", 0) if isinstance(issue, dict) else 0
    if issue_comment_count:
        comments, _, comments_error = fetch_json(f"{api_root}/issues/{FEEDBACK_ISSUE}/comments?per_page=100")

    result: dict[str, Any] = {
        "status": "ok",
        "repo": f"{GITHUB_OWNER}/{GITHUB_REPO}",
        "repo_url": f"https://github.com/{GITHUB_OWNER}/{GITHUB_REPO}",
        "feedback_issue_url": f"https://github.com/{GITHUB_OWNER}/{GITHUB_REPO}/issues/{FEEDBACK_ISSUE}",
        "errors": [],
        "rate_limit_remaining": repo_headers.get("X-RateLimit-Remaining"),
    }
    if repo_error:
        result["errors"].append(f"repo: {repo_error}")
    if issue_error:
        result["errors"].append(f"issue: {issue_error}")
    if comments_error:
        result["errors"].append(f"comments: {comments_error}")

    if isinstance(repo, dict):
        result.update(
            {
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "watchers_alias": repo.get("watchers_count", 0),
                "subscribers": repo.get("subscribers_count", 0),
                "open_issues": repo.get("open_issues_count", 0),
                "pushed_at": repo.get("pushed_at"),
            }
        )
    if isinstance(issue, dict):
        result["feedback_issue"] = {
            "number": issue.get("number"),
            "state": issue.get("state"),
            "title": issue.get("title"),
            "comments_count": issue.get("comments", 0),
            "updated_at": issue.get("updated_at"),
            "html_url": issue.get("html_url"),
        }
    else:
        result["feedback_issue"] = {"number": FEEDBACK_ISSUE, "comments_count": 0}

    parsed_comments = []
    if isinstance(comments, list):
        for item in comments:
            user = item.get("user") or {}
            parsed_comments.append(
                {
                    "user": user.get("login", "unknown"),
                    "association": item.get("author_association"),
                    "created_at": item.get("created_at"),
                    "updated_at": item.get("updated_at"),
                    "url": item.get("html_url"),
                    "body_preview": collapse(item.get("body", "")),
                }
            )
    result["comments"] = parsed_comments
    if result["errors"]:
        result["status"] = "warn" if (repo or issue or comments) else "fail"
    return result


def collect_live() -> dict[str, Any]:
    health, _, health_error = fetch_json(f"{LIVE_ORIGIN}/api/health")
    server, _, server_error = fetch_json(f"{LIVE_ORIGIN}/server.json")
    result: dict[str, Any] = {
        "status": "ok",
        "origin": LIVE_ORIGIN,
        "errors": [],
        "health_ok": False,
        "health_version": None,
        "server_version": None,
        "remote_url": None,
    }
    if health_error:
        result["errors"].append(f"health: {health_error}")
    if server_error:
        result["errors"].append(f"server.json: {server_error}")
    if isinstance(health, dict):
        result["health_ok"] = health.get("ok") is True
        result["health_version"] = health.get("version")
    if isinstance(server, dict):
        remotes = server.get("remotes") or []
        result["server_version"] = server.get("version")
        result["remote_url"] = remotes[0].get("url") if remotes else None
    if result["errors"] or result["health_ok"] is not True or result["remote_url"] != PRIMARY_MCP_URL:
        result["status"] = "warn" if result["health_ok"] else "fail"
    return result


def registry_items(data: Any) -> list[dict[str, Any]]:
    if isinstance(data, dict) and isinstance(data.get("servers"), list):
        return data["servers"]
    if isinstance(data, list):
        return data
    return []


def collect_registry() -> dict[str, Any]:
    data, _, error = fetch_json(REGISTRY_SEARCH)
    result: dict[str, Any] = {
        "status": "ok",
        "search_url": REGISTRY_SEARCH,
        "server_name": SERVER_NAME,
        "found": False,
        "is_latest": False,
        "version": None,
        "remote_url": None,
        "errors": [],
    }
    if error:
        result["errors"].append(error)
        result["status"] = "fail"
        return result

    for item in registry_items(data):
        server = item.get("server", item) if isinstance(item, dict) else {}
        meta = item.get("_meta", {}) if isinstance(item, dict) else {}
        official = meta.get("io.modelcontextprotocol.registry/official", {})
        if server.get("name") != SERVER_NAME:
            continue
        remotes = server.get("remotes") or []
        result.update(
            {
                "found": True,
                "is_latest": official.get("isLatest") is True,
                "version": server.get("version"),
                "remote_url": remotes[0].get("url") if remotes else None,
                "status": server.get("status") or "ok",
            }
        )
        if result["is_latest"]:
            break

    if not result["found"]:
        result["status"] = "fail"
        result["errors"].append("official registry entry not found")
    elif result["remote_url"] != PRIMARY_MCP_URL or result["is_latest"] is not True:
        result["status"] = "warn"
    return result


def beta_signal_status(github: dict[str, Any]) -> tuple[str, str]:
    stars = int(github.get("stars") or 0)
    forks = int(github.get("forks") or 0)
    issue = github.get("feedback_issue") or {}
    comments = int(issue.get("comments_count") or 0)
    if comments > 0:
        return "PASS", "feedback issue has public comments to review"
    if stars or forks:
        return "WARN", "public interest exists, but workflow feedback is still thin"
    return "WARN", "collector works, but public beta demand signal is still baseline/weak"


def collector_status(parts: list[dict[str, Any]]) -> str:
    statuses = {part.get("status") for part in parts}
    if "fail" in statuses:
        return "FAIL"
    if "warn" in statuses:
        return "WARN"
    return "PASS"


def build_snapshot() -> dict[str, Any]:
    now = utc_now()
    github = collect_github()
    live = collect_live()
    registry = collect_registry()
    signal_status, signal_reason = beta_signal_status(github)
    return {
        "collected_at": iso_z(now),
        "collector_status": collector_status([github, live, registry]),
        "beta_signal_status": signal_status,
        "beta_signal_reason": signal_reason,
        "github": github,
        "live": live,
        "registry": registry,
        "boundaries": {
            "public_read_only": True,
            "used_account_login": False,
            "used_secret": False,
            "posted_publicly": False,
            "payment_changed": False,
        },
    }


def csv_rows(snapshot: dict[str, Any]) -> list[dict[str, str]]:
    date = snapshot["collected_at"]
    github = snapshot["github"]
    issue = github.get("feedback_issue") or {}
    rows = [
        {
            "date": date,
            "source": "GitHub",
            "signal_type": "repo_snapshot",
            "handle_or_org": github.get("repo", ""),
            "workflow_domain": "",
            "workflow_summary": f"stars={github.get('stars', 0)} forks={github.get('forks', 0)} subscribers={github.get('subscribers', 0)} open_issues={github.get('open_issues', 0)}",
            "starred": str(github.get("stars", 0)),
            "opened_issue": str(github.get("open_issues", 0)),
            "shared_link": github.get("repo_url", ""),
            "main_feedback": snapshot["beta_signal_reason"],
            "next_action": "watch feedback issue",
            "status": snapshot["beta_signal_status"],
        },
        {
            "date": date,
            "source": "GitHub",
            "signal_type": "feedback_issue",
            "handle_or_org": github.get("repo", ""),
            "workflow_domain": "",
            "workflow_summary": f"issue #{issue.get('number', FEEDBACK_ISSUE)} {issue.get('state', 'unknown')} comments={issue.get('comments_count', 0)}",
            "starred": "",
            "opened_issue": "yes" if issue.get("state") else "",
            "shared_link": issue.get("html_url") or github.get("feedback_issue_url", ""),
            "main_feedback": issue.get("title", "Free public beta feedback issue"),
            "next_action": "review new comments",
            "status": "watching",
        },
        {
            "date": date,
            "source": "Live",
            "signal_type": "health",
            "handle_or_org": LIVE_ORIGIN,
            "workflow_domain": "",
            "workflow_summary": f"health_ok={snapshot['live'].get('health_ok')} version={snapshot['live'].get('health_version')}",
            "starred": "",
            "opened_issue": "",
            "shared_link": f"{LIVE_ORIGIN}/api/health",
            "main_feedback": f"collector_status={snapshot['live'].get('status')}",
            "next_action": "fix live contract if warn/fail",
            "status": snapshot["live"].get("status", ""),
        },
        {
            "date": date,
            "source": "MCP Registry",
            "signal_type": "discovery",
            "handle_or_org": SERVER_NAME,
            "workflow_domain": "",
            "workflow_summary": f"found={snapshot['registry'].get('found')} latest={snapshot['registry'].get('is_latest')} version={snapshot['registry'].get('version')}",
            "starred": "",
            "opened_issue": "",
            "shared_link": REGISTRY_SEARCH,
            "main_feedback": f"remote={snapshot['registry'].get('remote_url')}",
            "next_action": "fix registry metadata if warn/fail",
            "status": snapshot["registry"].get("status", ""),
        },
    ]
    for comment in github.get("comments", []):
        rows.append(
            {
                "date": date,
                "source": "GitHub",
                "signal_type": "feedback_comment",
                "handle_or_org": comment.get("user", ""),
                "workflow_domain": "",
                "workflow_summary": "",
                "starred": "",
                "opened_issue": "yes",
                "shared_link": comment.get("url", ""),
                "main_feedback": comment.get("body_preview", ""),
                "next_action": "triage comment",
                "status": "watching",
            }
        )
    return rows


def append_csv(snapshot: dict[str, Any]) -> None:
    TRACKER_CSV.parent.mkdir(parents=True, exist_ok=True)
    file_exists = TRACKER_CSV.exists() and TRACKER_CSV.stat().st_size > 0
    with TRACKER_CSV.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        if not file_exists:
            writer.writeheader()
        for row in csv_rows(snapshot):
            writer.writerow(row)


def render_markdown_snapshot(snapshot: dict[str, Any]) -> str:
    github = snapshot["github"]
    issue = github.get("feedback_issue") or {}
    live = snapshot["live"]
    registry = snapshot["registry"]
    comments = github.get("comments", [])
    lines = [
        "<!-- AUTO_PUBLIC_BETA_SIGNALS_START -->",
        "## Latest Automated Snapshot",
        "",
        f"- collected_at: `{snapshot['collected_at']}`",
        f"- collector_status: `{snapshot['collector_status']}`",
        f"- beta_signal_status: `{snapshot['beta_signal_status']}` - {snapshot['beta_signal_reason']}",
        f"- GitHub: stars `{github.get('stars', 0)}`, forks `{github.get('forks', 0)}`, subscribers/watchers `{github.get('subscribers', 0)}`, open issues `{github.get('open_issues', 0)}`",
        f"- Feedback issue: `#{issue.get('number', FEEDBACK_ISSUE)}` `{issue.get('state', 'unknown')}`, comments `{issue.get('comments_count', 0)}`",
        f"- Live health: `{live.get('status')}`, ok `{live.get('health_ok')}`, version `{live.get('health_version')}`, remote `{live.get('remote_url')}`",
        f"- MCP Registry: `{registry.get('status')}`, found `{registry.get('found')}`, latest `{registry.get('is_latest')}`, version `{registry.get('version')}`",
        "- Boundary: public read-only collection only; no account login, secret, paid API, payment change, or public posting.",
        "",
    ]
    if comments:
        lines.append("### Feedback Issue Comments")
        lines.append("")
        for comment in comments:
            lines.append(f"- `{comment.get('created_at')}` @{comment.get('user')}: {comment.get('body_preview')} ({comment.get('url')})")
        lines.append("")
    else:
        lines.extend(["### Feedback Issue Comments", "", "- No public comments collected yet.", ""])
    lines.append("<!-- AUTO_PUBLIC_BETA_SIGNALS_END -->")
    return "\n".join(lines)


def update_tracker_md(snapshot: dict[str, Any]) -> None:
    block = render_markdown_snapshot(snapshot)
    existing = TRACKER_MD.read_text(encoding="utf-8") if TRACKER_MD.exists() else "# Public Beta Signal Tracker\n"
    start = "<!-- AUTO_PUBLIC_BETA_SIGNALS_START -->"
    end = "<!-- AUTO_PUBLIC_BETA_SIGNALS_END -->"
    if start in existing and end in existing:
        before = existing.split(start, 1)[0].rstrip()
        after = existing.split(end, 1)[1].lstrip()
        updated = f"{before}\n\n{block}\n"
        if after:
            updated += f"\n{after}"
    else:
        updated = existing.rstrip() + "\n\n" + block + "\n"
    TRACKER_MD.write_text(updated, encoding="utf-8")


def write_snapshot(snapshot: dict[str, Any]) -> None:
    SNAPSHOT_JSON.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    append_csv(snapshot)
    update_tracker_md(snapshot)


def default_obsidian_vault() -> Path:
    return Path.home() / "Documents" / "Obsidian Vault"


def append_obsidian(snapshot: dict[str, Any], vault: Path) -> list[Path]:
    if not vault.exists():
        raise FileNotFoundError(f"Obsidian vault not found: {vault}")
    local_now = datetime.now().strftime("%H:%M")
    day = datetime.now().strftime("%Y-%m-%d")
    daily = vault / "40_작업로그" / f"{day}.md"
    project = vault / "10_프로젝트" / "No-Shell Agent Architect MCP.md"
    daily.parent.mkdir(parents=True, exist_ok=True)
    project.parent.mkdir(parents=True, exist_ok=True)

    github = snapshot["github"]
    issue = github.get("feedback_issue") or {}
    live = snapshot["live"]
    registry = snapshot["registry"]
    summary = (
        f"\n## {local_now} - No-Shell MCP 공개 베타 신호 자동 수집\n\n"
        f"- 작업: 공개 읽기 API로 GitHub/Vercel live/MCP Registry/feedback issue 댓글을 수집해 repo tracker를 갱신.\n"
        f"- 결과: stars `{github.get('stars', 0)}`, forks `{github.get('forks', 0)}`, subscribers/watchers `{github.get('subscribers', 0)}`, "
        f"open issues `{github.get('open_issues', 0)}`, feedback comments `{issue.get('comments_count', 0)}`, "
        f"live `{live.get('status')}`, registry `{registry.get('status')}`.\n"
        f"- 변경: `outreach/public_beta_tracker.md`, `outreach/public_beta_tracker.csv`, `outreach/public_beta_signal_snapshot.json`.\n"
        f"- 경계: public read-only 수집만 수행. 계정 로그인/비밀/유료 API/공개게시/결제 변경 없음.\n"
        f"- 상태: collector `{snapshot['collector_status']}`, beta_signal `{snapshot['beta_signal_status']}` - {snapshot['beta_signal_reason']}.\n"
    )
    for path in (daily, project):
        with path.open("a", encoding="utf-8") as f:
            f.write(summary)
    return [daily, project]


def main() -> int:
    parser = argparse.ArgumentParser(description="Collect public beta interest and health signals.")
    parser.add_argument("--no-write", action="store_true", help="Collect and print JSON without writing tracker files.")
    parser.add_argument("--write-obsidian", action="store_true", help="Append a concise summary to the local Obsidian vault.")
    parser.add_argument("--obsidian-vault", default=str(default_obsidian_vault()), help="Obsidian vault path for --write-obsidian.")
    args = parser.parse_args()

    snapshot = build_snapshot()
    if not args.no_write:
        write_snapshot(snapshot)
    if args.write_obsidian:
        append_obsidian(snapshot, Path(args.obsidian_vault))

    print(json.dumps(snapshot, ensure_ascii=False, indent=2))
    return 0 if snapshot["collector_status"] in {"PASS", "WARN"} else 1


if __name__ == "__main__":
    raise SystemExit(main())
