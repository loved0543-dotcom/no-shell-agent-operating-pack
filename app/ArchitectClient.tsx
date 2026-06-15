'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

type ArchitectResult = {
  product?: string;
  interpreted_domain?: string;
  domain_label?: string;
  one_line_strategy?: string;
  recommended_stack?: Array<{ id: string; label: string; kind: string; why: string; setup?: string; caution?: string }>;
  execution_phases?: Array<{ name: string; action: string }>;
  validation?: {
    dry_run_tests?: string[];
    qa_checks?: string[];
    audit_checks?: string[];
    pass_definition?: string;
  };
  account_automation?: {
    status?: string;
    safe_default?: string;
    connector_route?: string;
    automatable_actions?: string[];
    required_controls?: string[];
    draft_vs_live?: string;
  };
  permissioned_connector_v1?: {
    product_stage?: string;
    connector?: string;
    default_mode?: string;
    required_scope_contract?: {
      connector_source?: string;
      live_boundary?: string;
    };
    v1_run_card?: string[];
  } | null;
  copy_paste_prompt?: string;
  status?: string;
};

export default function ArchitectClient() {
  const [goal, setGoal] = useState('Automate weekly research from Gmail and turn it into a client-ready report.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ArchitectResult | null>(null);

  async function run(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (goal.trim().length < 6) {
      setError('Describe the workflow in one sentence first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/architect', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ goal, userType: 'solo operator', language: 'ko' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Architect request failed.');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Architect request failed.');
    } finally {
      setLoading(false);
    }
  }

  const stack = result?.recommended_stack ?? [];
  const phases = result?.execution_phases ?? [];
  const dryRun = result?.validation?.dry_run_tests ?? [];
  const qa = result?.validation?.qa_checks ?? [];
  const accountAutomation = result?.account_automation;
  const connectorV1 = result?.permissioned_connector_v1;

  return (
    <section className="tool" id="architect">
      <div className="tool-copy">
        <p className="eyebrow">Live API preview</p>
        <h2>Describe one workflow.</h2>
        <p>The response is deterministic and free: no external model call, no secret, no unpermissioned account action.</p>
      </div>
      <form className="panel" onSubmit={run}>
        <textarea value={goal} onChange={(event) => setGoal(event.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Designing...' : 'Design stack'}</button>
        {error && <p className="error">{error}</p>}
        {result && (
          <div className="result">
            <div className="result-head">
              <span>{result.domain_label ?? result.interpreted_domain ?? 'automation workflow'}</span>
              <b>{result.status ?? 'ready'}</b>
            </div>
            <h3>{result.one_line_strategy}</h3>
            <div className="result-grid">
              <article>
                <strong>Recommended stack</strong>
                <ul>{stack.slice(0, 5).map((item) => <li key={item.id}><b>{item.label}</b><span>{item.why}</span></li>)}</ul>
              </article>
              <article>
                <strong>Execution phases</strong>
                <ul>{phases.map((phase) => <li key={phase.name}><b>{phase.name}</b><span>{phase.action}</span></li>)}</ul>
              </article>
            </div>
            <article className="checks">
              <strong>QA before PASS</strong>
              <ul>{[...dryRun.slice(0, 3), ...qa.slice(0, 3)].map((check) => <li key={check}>{check}</li>)}</ul>
            </article>
            {accountAutomation?.status === 'permissioned_connector_required' && (
              <article className="checks">
                <strong>Permissioned account automation</strong>
                <ul>
                  <li>{accountAutomation.connector_route}</li>
                  <li>{accountAutomation.safe_default}</li>
                  <li>{accountAutomation.draft_vs_live}</li>
                </ul>
              </article>
            )}
            {connectorV1 && (
              <article className="checks">
                <strong>Connector v1 runbook</strong>
                <ul>
                  <li>{connectorV1.connector} · {connectorV1.default_mode}</li>
                  <li>{connectorV1.required_scope_contract?.connector_source}</li>
                  <li>{connectorV1.required_scope_contract?.live_boundary}</li>
                </ul>
              </article>
            )}
            {result.copy_paste_prompt && (
              <details>
                <summary>Copy-paste command</summary>
                <pre>{result.copy_paste_prompt}</pre>
              </details>
            )}
          </div>
        )}
      </form>
    </section>
  );
}
