import { describe, expect, it } from 'vitest';
import {
  auditAutomationPlan,
  buildPermissionedConnectorRunbook,
  buildCustomerIntake,
  buildM2MPackageContract,
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
    expect(plan.permissioned_connector_v1?.connector).toBe('gmail');
    expect(plan.permissioned_connector_v1?.required_scope_contract.live_boundary).toContain('Send only');
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
    expect(plan.permissioned_connector_v1?.connector).toBe('community');
    expect(plan.permissioned_connector_v1?.v1_run_card.join(' ')).toContain('not_posted');
    expect(plan.human_boundaries.join(' ')).toContain('allowlisted destination');
    expect(plan.validation.qa_checks.join(' ')).toContain('community posting');
  });

  it('honors explicit domain over mixed goal keywords', () => {
    const plan = designAutomationStack({
      goal: 'Collect GitHub signals, stage one community post, and later design Gmail connector v1.',
      domain: 'social_content',
      risk: 'high'
    });
    expect(plan.interpreted_domain).toBe('social_content');
    expect(plan.account_automation.draft_vs_live).toContain('Publish');
    expect(plan.permissioned_connector_v1?.connector).toBe('community');
  });

  it('builds a scoped permissioned connector v1 runbook', () => {
    const runbook = buildPermissionedConnectorRunbook({
      goal: 'Use Gmail to triage beta feedback and draft replies.',
      connector: 'gmail',
      risk: 'high'
    });
    expect(runbook.product_stage).toBe('permissioned_connector_v1');
    expect(runbook.default_mode).toBe('read_only_then_draft');
    expect(runbook.action_ledger_schema).toContain('live_action_sent');
    expect(runbook.forbidden_bypass.join(' ')).toContain('2FA bypass');
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

  it('builds a machine-readable M2M package contract', () => {
    const contract = buildM2MPackageContract({
      goal: 'Package a permissioned Gmail automation workflow for an agency client.',
      buyerType: 'AI automation agency',
      domain: 'email_docs',
      packageMode: 'agency_workbench',
      risk: 'high'
    });
    expect(contract.package_stage).toBe('m2m_package_contract_v1');
    expect(contract.integration_contract.public_mcp_tools).toContain('build_m2m_package_contract');
    expect(contract.m2m_surfaces.some((surface) => surface.surface === 'm2m_package_api')).toBe(true);
    expect(contract.delivery_contract.package_to_send).toContain('delivery/07_m2m_package_contract.md');
    expect(contract.permissioned_account_route.status).toBe('permissioned_connector_required');
    expect(contract.validation.current_known_risk).toContain('baseline/weak');
  });
});
