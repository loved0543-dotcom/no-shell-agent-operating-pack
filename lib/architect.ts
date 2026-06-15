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
    'Do not present a blocked gate as completion; repair the upstream cause first.',
    'Keep a short audit trace: input, tools used, validation, remaining manual step.'
  ];
  if (domain === 'social_content') base.push('Do not publicly publish, schedule, or change account settings without a direct human action.');
  if (domain === 'browser_ops') base.push('Do not change account settings, billing, identity, or live production state unless the human explicitly asked for that exact action.');
  if (domain === 'coding') base.push('Do not push, deploy, or change production secrets until tests and a minimal security pass are complete.');
  if (risk === 'high') base.push('Split the workflow into dry-run, review, and live phases.');
  return base;
}

function phases(domain: Domain) {
  const shared = [
    { name: '1. Intake', action: 'Restate the real outcome, inputs, target user, available accounts, and forbidden actions.' },
    { name: '2. Stack route', action: 'Choose the smallest tool stack that can actually complete the workflow, not just produce files.' },
    { name: '3. Dry run', action: 'Run the workflow on a safe sample input and capture the evidence.' },
    { name: '4. QA/audit', action: 'Check output correctness, missing source data, human boundary, and recovery path.' },
    { name: '5. Handoff', action: 'Return a copy-paste command, result scorecard, and next-run checklist.' }
  ];
  if (domain === 'ecommerce_data') {
    shared.splice(2, 0, { name: '3. Source proof', action: 'Separate source-backed facts from estimates and mark target-market checks that still need verification.' });
  }
  if (domain === 'knowledge_base') {
    shared.splice(2, 0, { name: '3. Canonical note route', action: 'Pick the one canonical wiki/project note before moving or deleting anything.' });
  }
  return shared;
}

function noShellPromptText(plan: {
  goal: string;
  domain_label: string;
  recommended_stack: Array<{ label: string }>;
  execution_phases: Array<{ name: string; action: string }>;
}) {
  const stackNames = plan.recommended_stack.map((item) => item.label).join(', ');
  return [
    `목표: ${plan.goal}`,
    '',
    '너는 파일이나 화면만 만드는 것이 아니라 실제 업무 흐름이 끝까지 굴러가게 만드는 자동화 설계자다.',
    `자동화 유형: ${plan.domain_label}.`,
    `사용할 우선 도구 후보: ${stackNames}.`,
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
      'Turn a vague automation request into a tool stack, copy-paste agent command, dry-run path, QA/audit scorecard, and human boundary.',
    recommended_stack: stack,
    execution_phases: phases(domain),
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
  return {
    dry_run_tests: [
      'Run the workflow on one safe sample input.',
      'Confirm every produced artifact maps back to the original goal.',
      'Check that no private secret, account token, or irreversible live action is required for the dry run.'
    ],
    qa_checks: [
      'Does the result complete the actual workflow, not only create a file or UI?',
      'Are source-backed facts separated from estimates or assumptions?',
      'Can a non-developer follow the first command without decoding jargon?',
      'Is there a recovery path for missing input, provider failure, or auth failure?'
    ],
    audit_checks: [
      'Tool stack is minimal and justified.',
      'Human boundary is explicit.',
      'Validation evidence exists before PASS.',
      'Remaining risk is operationally meaningful.'
    ],
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
      'What should the agent never do automatically?',
      'What would prove the automation worked on one safe sample?',
      'What should happen if a required input, login, or source is missing?',
      'Who checks the result before public sending, publishing, payment, or account changes?'
    ]
  };
}
