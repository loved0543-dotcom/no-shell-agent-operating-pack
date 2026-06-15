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
    expect(result.prompt).toContain('완료 보고');
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
