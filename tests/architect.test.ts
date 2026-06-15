import { describe, expect, it } from 'vitest';
import {
  auditAutomationPlan,
  buildCustomerIntake,
  designAutomationStack,
  generateNoShellPrompt,
  recommendAgentTools
} from '../lib/architect';

describe('No-Shell Agent Architect', () => {
  it('routes an ecommerce data workflow to K-Data Gate and validation', () => {
    const plan = designAutomationStack({ goal: 'Find Korean products and build a Shopify listing export workflow.' });
    expect(plan.interpreted_domain).toBe('ecommerce_data');
    expect(plan.recommended_stack.some((item) => item.id === 'kdata-gate')).toBe(true);
    expect(plan.validation.dry_run_tests.length).toBeGreaterThan(0);
    expect(plan.human_boundaries.join(' ')).toContain('API keys');
  });

  it('generates a non-empty copy-paste prompt', () => {
    const result = generateNoShellPrompt({ goal: 'Automate Gmail follow-up and create a weekly report.' });
    expect(result.prompt).toContain('목표:');
    expect(result.prompt).toContain('권한형 계정 자동화');
    expect(result.prompt).toContain('완료 보고');
  });

  it('models Gmail workflows as permissioned account automation, not manual-only gates', () => {
    const plan = designAutomationStack({ goal: 'Read new Gmail messages from a support label and draft replies.' });
    expect(plan.interpreted_domain).toBe('email_docs');
    expect(plan.recommended_stack.some((item) => item.id === 'gmail')).toBe(true);
    expect(plan.recommended_stack.some((item) => item.id === 'permissioned-account-automation')).toBe(true);
    expect(plan.account_automation.status).toBe('permissioned_connector_required');
    expect(plan.validation.dry_run_tests.join(' ')).toContain('permissioned connector');
    expect(plan.human_boundaries.join(' ')).toContain('permissioned connector');
  });

  it('splits community posting into staged automation and exact live action', () => {
    const plan = designAutomationStack({
      goal: 'Prepare and post launch updates to Reddit, LinkedIn, and Hacker News.',
      risk: 'high'
    });
    expect(plan.interpreted_domain).toBe('social_content');
    expect(plan.recommended_stack.some((item) => item.id === 'permissioned-account-automation')).toBe(true);
    expect(plan.account_automation.draft_vs_live).toContain('exact destination/action');
    expect(plan.human_boundaries.join(' ')).toContain('allowlisted destination');
    expect(plan.validation.qa_checks.join(' ')).toContain('community posting');
  });

  it('audits weak shell plans', () => {
    const audit = auditAutomationPlan('Make an app with a button and dashboard for automation.');
    expect(audit.verdict).not.toBe('PASS');
    expect(audit.priority_fixes.length).toBeGreaterThan(0);
  });

  it('recommends agent tools', () => {
    const rec = recommendAgentTools({ goal: 'Use browser to test a localhost dashboard and check UI bugs.' });
    expect(rec.tools.some((tool) => tool.id === 'browser')).toBe(true);
  });

  it('builds customer intake questions', () => {
    const intake = buildCustomerIntake('Clean Obsidian notes');
    expect(intake.questions.length).toBeGreaterThanOrEqual(6);
  });
});
