export type Domain =
  | 'email_docs'
  | 'research_reporting'
  | 'social_content'
  | 'ecommerce_data'
  | 'knowledge_base'
  | 'browser_ops'
  | 'coding'
  | 'custom';

export type CatalogEntry = {
  id: string;
  label: string;
  kind: 'codex_plugin' | 'mcp_registry' | 'skill' | 'workflow' | 'manual_boundary';
  bestFor: Domain[];
  why: string;
  setup: string;
  caution?: string;
};

export const CATALOG: CatalogEntry[] = [
  {
    id: 'browser',
    label: 'Browser plugin',
    kind: 'codex_plugin',
    bestFor: ['browser_ops', 'coding'],
    why: 'Use it to open localhost, click through the UI, and catch layout/runtime breakage before calling work finished.',
    setup: 'Use the installed Browser plugin when a local web target or screenshot QA is needed.',
    caution: 'Do not use it as a replacement for API tests or source-code review.'
  },
  {
    id: 'chrome',
    label: 'Chrome plugin',
    kind: 'codex_plugin',
    bestFor: ['browser_ops', 'social_content'],
    why: 'Use the user’s logged-in browser state only when a task genuinely depends on cookies or account UI.',
    setup: 'Prefer APIs first; use Chrome only for logged-in site state.',
    caution: 'Account changes, public publishing, or credential inspection need explicit user direction.'
  },
  {
    id: 'documents',
    label: 'Documents plugin',
    kind: 'codex_plugin',
    bestFor: ['email_docs', 'research_reporting'],
    why: 'Turns a workflow into polished DOCX/Docs artifacts with render-and-verify QA.',
    setup: 'Use for document creation, redlines, visual render QA, and deliverable docs.',
    caution: 'Private source material should be summarized, not dumped into prompts.'
  },
  {
    id: 'spreadsheets',
    label: 'Spreadsheets plugin',
    kind: 'codex_plugin',
    bestFor: ['research_reporting', 'ecommerce_data'],
    why: 'Best path for CSV cleanup, trackers, formulas, charts, and validation sheets.',
    setup: 'Use for structured workflow tracking and result scorecards.',
    caution: 'Do not treat calculated estimates as verified business outcomes.'
  },
  {
    id: 'github',
    label: 'GitHub plugin',
    kind: 'codex_plugin',
    bestFor: ['coding'],
    why: 'Handles repo, PR, issue, CI, and code review work without manual browser wandering.',
    setup: 'Use for repository inspection, PR feedback, or CI failures.',
    caution: 'Repository creation may still need account/session support if CLI access is missing.'
  },
  {
    id: 'codex-security',
    label: 'Codex Security plugin',
    kind: 'codex_plugin',
    bestFor: ['coding', 'browser_ops'],
    why: 'Adds a real security pass for auth, secret handling, upload, order, and external-action paths.',
    setup: 'Run before shipping code that handles secrets, credentials, webhooks, or external accounts.',
    caution: 'Security scan is not a substitute for business or UX validation.'
  },
  {
    id: 'ultra-execution-architecture',
    label: 'Ultra execution skill',
    kind: 'skill',
    bestFor: ['custom', 'coding', 'research_reporting', 'ecommerce_data', 'knowledge_base'],
    why: 'Prevents average answers by forcing purpose, target, hidden components, risk, and validation.',
    setup: 'Use for any non-trivial automation design or business workflow.',
    caution: 'Depth should improve the artifact, not inflate the report.'
  },
  {
    id: 'dynamic-workflow-orchestrator',
    label: 'Dynamic workflow orchestrator skill',
    kind: 'skill',
    bestFor: ['custom', 'knowledge_base', 'coding'],
    why: 'Splits large work into phases, bounded side tasks, integration, validation, and Obsidian trace.',
    setup: 'Use when the work spans multiple modules, notes, or agents.',
    caution: 'Keep the main agent responsible for final judgment and integration.'
  },
  {
    id: 'kdata-gate',
    label: 'K-Data Gate data pack',
    kind: 'mcp_registry',
    bestFor: ['ecommerce_data', 'research_reporting'],
    why: 'Use when an automation needs Korean product, market, macro, company, or compliance source data.',
    setup: 'Remote MCP: https://kdata-gate.vercel.app/mcp or API docs on the K-Data Gate site.',
    caution: 'Treat commerce/margin outputs as estimate-only unless target-market comparable sources are verified.'
  },
  {
    id: 'human-boundary',
    label: 'Human boundary checkpoint',
    kind: 'manual_boundary',
    bestFor: ['custom', 'social_content', 'browser_ops', 'coding'],
    why: 'Real money, public publishing, account changes, and credential exposure need a visible human boundary.',
    setup: 'Write exactly what the agent can do automatically and what the human must do manually.',
    caution: 'A boundary is not the finish line; fix upstream causes and prepare everything up to the boundary.'
  }
];

export function domainFromGoal(goal: string, explicit?: string): Domain {
  const raw = `${explicit ?? ''} ${goal}`.toLowerCase();
  if (/mail|gmail|email|doc|document|contract|proposal|invoice|word/.test(raw)) return 'email_docs';
  if (/research|report|brief|market|analysis|data|spreadsheet|csv|sheet/.test(raw)) return 'research_reporting';
  if (/youtube|sns|instagram|tiktok|post|content|blog|thumbnail|script/.test(raw)) return 'social_content';
  if (/shopify|amazon|seller|commerce|product|listing|korea|k-beauty|sourcing/.test(raw)) return 'ecommerce_data';
  if (/obsidian|notion|wiki|knowledge|vault|note|learning/.test(raw)) return 'knowledge_base';
  if (/browser|chrome|website|click|form|dashboard|localhost/.test(raw)) return 'browser_ops';
  if (/code|repo|github|ci|test|deploy|mcp|api|sdk/.test(raw)) return 'coding';
  return 'custom';
}

export function recommendedCatalog(goal: string, explicitDomain?: string, availableTools: string[] = []) {
  const domain = domainFromGoal(goal, explicitDomain);
  const available = new Set(availableTools.map((item) => item.toLowerCase()));
  const scored = CATALOG.map((entry) => {
    let score = entry.bestFor.includes(domain) ? 5 : entry.bestFor.includes('custom') ? 2 : 0;
    if (available.has(entry.id.toLowerCase()) || available.has(entry.label.toLowerCase())) score += 2;
    if (entry.kind === 'manual_boundary') score += 1;
    return { ...entry, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  return { domain, entries: scored.slice(0, 6) };
}
