import { recommendedCatalog, type Domain } from './catalog';

export type ArchitectInput = {
  goal: string;
  userType?: string;
  domain?: string;
  currentTools?: string[];
  risk?: 'low' | 'medium' | 'high';
  language?: 'ko' | 'en';
};

const DOMAIN_LABEL: Record<Domain, string> = {
  email_docs: 'email/document automation',
  research_reporting: 'research/reporting automation',
  social_content: 'content/social automation',
  ecommerce_data: 'commerce/data automation',
  knowledge_base: 'knowledge-base automation',
  browser_ops: 'browser/UI automation',
  coding: 'coding/deployment automation',
  custom: 'custom workflow automation'
};

function normalizeGoal(goal: string) {
  return goal.replace(/\s+/g, ' ').trim().slice(0, 900);
}

function riskLevel(input: ArchitectInput, domain: Domain) {
  if (input.risk) return input.risk;
  if (['social_content', 'browser_ops', 'coding'].includes(domain)) return 'medium';
  return 'low';
}

function humanBoundaries(domain: Domain, risk: string) {
  const base = [
    'Do not expose API keys, cookies, or private customer data.',
    'Do not bypass login, 2FA, OAuth consent, or account permissions.',
    'Do not present a blocked gate as completion; repair the upstream cause first.',
    'Keep a short audit trace: input, tools used, validation, remaining manual step.'
  ];
  if (domain === 'email_docs') base.push('Email read, classify, summarize, and draft actions may run through a permissioned connector with label/search filters; live send needs an exact live-action instruction.');
  if (domain === 'social_content') base.push('Public publish or schedule actions may run only through an approved connector/session, an allowlisted destination, and an exact live-action instruction; draft and staging can be automated first.');
  if (domain === 'browser_ops') base.push('Browser account work may run only inside the declared task path; account settings, billing, identity, or live production changes need the exact live-action instruction.');
  if (domain === 'coding') base.push('Do not push, deploy, or change production secrets until tests and a minimal security pass are complete.');
  if (risk === 'high') base.push('Split the workflow into dry-run, review, and live phases.');
  return base;
}

function accountAutomationPlan(domain: Domain, risk: string) {
  const applies = ['email_docs', 'social_content', 'browser_ops'].includes(domain);
  if (!applies) {
    return {
      status: 'not_required_by_default',
      safe_default: 'No external account connector is required unless the workflow later adds email, browser, publishing, payment, or account actions.',
      forbidden_bypass: ['No raw passwords, cookies, recovery codes, mailbox dumps, or 2FA bypass.']
    };
  }

  const domainRoute: Record<string, string> = {
    email_docs: 'Use Gmail/Drive/Docs connectors or a delegated mailbox API with label, search-query, sender, and date filters.',
    social_content: 'Use an official API, MCP/plugin, or logged-in browser session only for the named community/account and destination.',
    browser_ops: 'Use a browser automation session limited to the declared URL path, form, dashboard, or workflow.'
  };

  const liveBoundary: Record<string, string> = {
    email_docs: 'Send mail only when the user requested that exact recipient/thread action; otherwise create drafts and a review queue.',
    social_content: 'Publish, schedule, delete, or edit public posts only when the user requested that exact destination/action after rules are checked; otherwise create staged drafts.',
    browser_ops: 'Submit account, billing, identity, production, or irreversible changes only when the exact live action was requested; otherwise stop at preview/staging.'
  };

  return {
    status: 'permissioned_connector_required',
    safe_default: risk === 'high' ? 'Start in read-only and draft/staging mode, then promote one exact live action.' : 'Automate read, classify, summarize, draft, stage, and log inside the granted scope.',
    connector_route: domainRoute[domain],
    automatable_actions: [
      'Read or search only the allowed label, query, thread, page, or destination.',
      'Classify, summarize, extract tasks, prepare replies/posts/forms, and save drafts or staged outputs.',
      'Record a compact action ledger with timestamps, target IDs, validation result, and remaining live action.'
    ],
    required_controls: [
      'OAuth/plugin/session source is explicit.',
      'Read filters and destination allowlist are explicit.',
      'Draft/staging actions are separated from live send/post/submit actions.',
      'Logs redact private content and never store tokens, cookies, or recovery codes.'
    ],
    draft_vs_live: liveBoundary[domain],
    rollback: 'Keep the draft/staged artifact ID and the last safe checkpoint so a failed run can be retried, edited, or discarded without guessing.',
    forbidden_bypass: [
      'No login or 2FA bypass.',
      'No raw cookie, token, password, recovery-code, or unrestricted mailbox harvesting.',
      'No public, financial, identity, billing, or irreversible action outside the declared live-action scope.'
    ]
  };
}

function phases(domain: Domain) {
  const shared = [
    { label: 'Intake', action: 'Restate the real outcome, inputs, target user, available accounts, and forbidden actions.' },
    { label: 'Stack route', action: 'Choose the smallest tool stack that can actually complete the workflow, not just produce files.' },
    { label: 'Dry run', action: 'Run the workflow on a safe sample input and capture the evidence.' },
    { label: 'QA/audit', action: 'Check output correctness, missing source data, human boundary, and recovery path.' },
    { label: 'Handoff', action: 'Return a copy-paste command, result scorecard, and next-run checklist.' }
  ];
  if (['email_docs', 'social_content', 'browser_ops'].includes(domain)) {
    shared.splice(2, 0, {
      label: 'Permission route',
      action: 'Define the OAuth/plugin/session source, read filters, destination allowlist, draft-vs-live split, and action ledger before touching account data.'
    });
  }
  if (domain === 'ecommerce_data') {
    shared.splice(2, 0, { label: 'Source proof', action: 'Separate source-backed facts from estimates and mark target-market checks that still need verification.' });
  }
  if (domain === 'knowledge_base') {
    shared.splice(2, 0, { label: 'Canonical note route', action: 'Pick the one canonical wiki/project note before moving or deleting anything.' });
  }
  return shared.map((phase, index) => ({ name: `${index + 1}. ${phase.label}`, action: phase.action }));
}

function noShellPromptText(plan: {
  goal: string;
  domain_label: string;
  recommended_stack: Array<{ label: string }>;
  execution_phases: Array<{ name: string; action: string }>;
  account_automation: ReturnType<typeof accountAutomationPlan>;
}) {
  const stackNames = plan.recommended_stack.map((item) => item.label).join(', ');
  const accountAutomationLines = plan.account_automation.status === 'permissioned_connector_required'
    ? [
        '',
        '권한형 계정 자동화가 필요한 경우:',
        `- 연결 경로: ${plan.account_automation.connector_route}`,
        '- 먼저 허용된 라벨/검색어/URL/대상 계정/게시 위치를 적어라.',
        '- 읽기, 분류, 요약, 초안, 스테이징, 로그 기록은 자동화한다.',
        `- 라이브 실행 경계: ${plan.account_automation.draft_vs_live}`,
        '- 비밀번호, 쿠키, 복구코드, 2FA 우회, 무제한 메일함 덤프는 요구하지 마라.'
      ]
    : [
        '',
        '계정 자동화가 필요해지면 OAuth/plugin/session, 허용 범위, 초안/라이브 분리, 감사로그를 먼저 설계해라.'
      ];
  return [
    `목표: ${plan.goal}`,
    '',
    '너는 파일이나 화면만 만드는 것이 아니라 실제 업무 흐름이 끝까지 굴러가게 만드는 자동화 설계자다.',
    `자동화 유형: ${plan.domain_label}.`,
    `사용할 우선 도구 후보: ${stackNames}.`,
    ...accountAutomationLines,
    '',
    '반드시 먼저 정리해라:',
    '1. 이 업무의 실제 결과물',
    '2. 필요한 입력과 없는 입력',
    '3. 자동으로 해도 되는 것과 사람이 직접 해야 하는 것',
    '4. 실패하면 고쳐야 할 upstream 원인',
    '',
    '그 다음 아래 순서로 진행해라:',
    ...plan.execution_phases.map((phase) => `- ${phase.name}: ${phase.action}`),
    '',
    '완료 보고는 자연어로 짧게 한다: 지금 바로 쓸 수 있는지, 무엇을 만들었는지, 무엇을 검증했는지, 남은 사람 작업, PASS/WARN/FAIL.'
  ].join('\n');
}

export function designAutomationStack(input: ArchitectInput) {
  const goal = normalizeGoal(input.goal);
  if (!goal || goal.length < 6) throw new Error('goal must describe a real workflow in at least 6 characters');
  const { domain, entries } = recommendedCatalog(goal, input.domain, input.currentTools);
  const risk = riskLevel(input, domain);
  const stack = entries.map((entry) => ({
    id: entry.id,
    label: entry.label,
    kind: entry.kind,
    why: entry.why,
    setup: entry.setup,
    caution: entry.caution ?? null
  }));
  const plan = {
    product: 'No-Shell Agent Architect MCP',
    goal,
    interpreted_domain: domain,
    domain_label: DOMAIN_LABEL[domain],
    user_type: input.userType || 'solo operator / non-developer friendly',
    risk,
    one_line_strategy:
      'Turn a vague automation request into a tool stack, permissioned account route, copy-paste agent command, dry-run path, QA/audit scorecard, and live-action boundary.',
    recommended_stack: stack,
    execution_phases: phases(domain),
    account_automation: accountAutomationPlan(domain, risk),
    human_boundaries: humanBoundaries(domain, risk),
    validation: buildValidationPack({ goal, domain, risk }),
    status: 'ready_to_run_as_dry_plan'
  };
  return {
    ...plan,
    copy_paste_prompt: noShellPromptText(plan)
  };
}

export function generateNoShellPrompt(input: ArchitectInput) {
  const plan = designAutomationStack(input);
  return {
    title: `No-shell command for ${plan.domain_label}`,
    prompt: plan.copy_paste_prompt,
    validation: plan.validation,
    human_boundaries: plan.human_boundaries
  };
}

export function auditAutomationPlan(planText: string) {
  const text = planText.trim();
  if (text.length < 20) throw new Error('plan must be at least 20 characters');
  const checks = [
    { id: 'real_outcome', pass: /result|outcome|deliverable|결과|산출|완료/.test(text), fix: 'Name the real deliverable, not only the tool to use.' },
    { id: 'inputs', pass: /input|source|data|file|입력|자료|원천/.test(text), fix: 'List required inputs and where they come from.' },
    { id: 'tool_route', pass: /mcp|plugin|skill|browser|api|도구|플러그인|스킬/.test(text), fix: 'Choose the actual tool stack and why.' },
    { id: 'validation', pass: /test|qa|audit|check|검증|오디트|테스트/.test(text), fix: 'Add dry-run and QA evidence before done.' },
    { id: 'human_boundary', pass: /human|manual|approval|account|secret|사람|수동|계정|비밀|결제|발행/.test(text), fix: 'Mark account, payment, secret, or public-action boundaries.' },
    { id: 'recovery', pass: /recover|retry|fallback|root cause|upstream|복구|재시도|원인/.test(text), fix: 'Add recovery steps that fix the upstream cause, not only a stop gate.' }
  ];
  const passed = checks.filter((check) => check.pass).length;
  return {
    score: Math.round((passed / checks.length) * 100),
    verdict: passed >= 5 ? 'PASS' : passed >= 3 ? 'WARN' : 'FAIL',
    checks,
    priority_fixes: checks.filter((check) => !check.pass).map((check) => check.fix).slice(0, 4)
  };
}

export function buildValidationPack(input: { goal: string; domain?: Domain | string; risk?: string }) {
  const domain = input.domain as Domain | undefined;
  const accountSensitive = domain ? ['email_docs', 'social_content', 'browser_ops'].includes(domain) : false;
  const dryRunTests = [
    'Run the workflow on one safe sample input.',
    'Confirm every produced artifact maps back to the original goal.',
    'Check that no private secret, account token, or irreversible live action is required for the dry run.'
  ];
  const qaChecks = [
    'Does the result complete the actual workflow, not only create a file or UI?',
    'Are source-backed facts separated from estimates or assumptions?',
    'Can a non-developer follow the first command without decoding jargon?',
    'Is there a recovery path for missing input, provider failure, or auth failure?'
  ];
  const auditChecks = [
    'Tool stack is minimal and justified.',
    'Human boundary is explicit.',
    'Validation evidence exists before PASS.',
    'Remaining risk is operationally meaningful.'
  ];

  if (accountSensitive) {
    dryRunTests.push(
      'Use a permissioned connector/session on one allowed sample: label, query, thread, URL, or destination.',
      'Create only a draft, staged post, preview, or review item unless the exact live action was requested.',
      'Write an action ledger entry without storing raw private content, tokens, cookies, or recovery codes.'
    );
    qaChecks.push(
      'Are OAuth scopes, session source, read filters, and destination allowlists explicit?',
      'Is draft/staging clearly separated from live send, publish, submit, delete, billing, or account changes?',
      'If community posting is involved, were the destination rules checked before any live action?'
    );
    auditChecks.push(
      'Permissioned account automation is present instead of a vague manual-only gate.',
      'Live account actions require an exact user instruction and an allowlisted target.'
    );
  }

  return {
    dry_run_tests: dryRunTests,
    qa_checks: qaChecks,
    audit_checks: auditChecks,
    pass_definition: `PASS only when the sample workflow for "${normalizeGoal(input.goal)}" produces a usable output, validation evidence, and a clear human boundary.`
  };
}

export function recommendAgentTools(input: ArchitectInput) {
  const plan = designAutomationStack(input);
  return {
    interpreted_domain: plan.interpreted_domain,
    tools: plan.recommended_stack,
    install_or_connect_notes: plan.recommended_stack.map((item) => ({
      tool: item.label,
      action: item.setup,
      caution: item.caution
    }))
  };
}

export function buildCustomerIntake(goal = '') {
  return {
    title: '10-minute automation intake',
    goal: normalizeGoal(goal || 'Describe the workflow you want automated.'),
    questions: [
      'What is the real finished result you want, in plain language?',
      'What inputs does the workflow need, and where are they stored?',
      'Which apps/accounts are involved?',
      'Which connector, OAuth scope, browser session, labels, search filters, URLs, or destinations may the automation use?',
      'Which actions are draft/staging only, and which exact actions may become live send, post, submit, or account changes?',
      'What should the agent never do automatically?',
      'What would prove the automation worked on one safe sample?',
      'What should happen if a required input, login, or source is missing?',
      'Who checks the result before public sending, publishing, payment, or account changes?'
    ]
  };
}
