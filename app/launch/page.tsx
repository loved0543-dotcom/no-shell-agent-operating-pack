const endpoint = 'https://ai-automation-operating-pack.vercel.app/api/mcp';
const m2mPackage = 'https://ai-automation-operating-pack.vercel.app/api/m2m-package';
const feedbackIssue = 'https://github.com/loved0543-dotcom/no-shell-agent-operating-pack/issues/1';

export const metadata = {
  title: 'Launch Kit - No-Shell Agent Architect MCP',
  description: 'Launch copy, MCP endpoint, and client config for No-Shell Agent Architect MCP.'
};

export default function LaunchPage() {
  return (
    <main className="launch">
      <section className="launch-hero">
        <p className="eyebrow">Free public beta launch kit</p>
        <h1>No-Shell Agent Architect MCP is free to test.</h1>
        <p className="lead">
          A free remote MCP that turns a vague automation request into a concrete tool stack, copy-paste agent command,
          permissioned account route, dry-run plan, QA checks, recovery route, and live-action boundary. No payment flow
          is active; stars, issues, and workflow feedback decide what should become paid later.
        </p>
        <div className="cta-row">
          <a className="button" href="/">Try the live architect</a>
          <a className="button secondary" href="https://github.com/loved0543-dotcom/no-shell-agent-operating-pack">GitHub</a>
          <a className="button secondary" href={feedbackIssue}>Feedback</a>
        </div>
      </section>

      <section className="launch-grid">
        <article>
          <span>Tagline</span>
          <p>Stop asking agents to “automate this” and getting empty shells. Route the job first.</p>
        </article>
        <article>
          <span>MCP endpoint</span>
          <code>{endpoint}</code>
        </article>
        <article>
          <span>M2M package contract</span>
          <code>{m2mPackage}</code>
        </article>
        <article>
          <span>Best for</span>
          <p>Codex, Claude, ChatGPT, Gemini, Cursor, and automation users who do not know which tools to connect first.</p>
        </article>
        <article>
          <span>Launch mode</span>
          <p>Free public beta. Use it, star it, open an issue, or share the workflow where it helped or failed.</p>
        </article>
      </section>

      <section className="copy-block">
        <h2>Client config</h2>
        <pre>{`{
  "mcpServers": {
    "no-shell-agent-architect": {
      "url": "${endpoint}"
    }
  }
}`}</pre>
      </section>

      <section className="copy-block">
        <h2>Short launch copy</h2>
        <p>
          I built a remote MCP for people who know agents can automate work, but keep getting code or dashboards that
          look done and do not actually run the workflow. It returns the tool route, permissioned account route, command,
          dry-run, QA checks, recovery route, and live-action boundary before the agent starts building.
        </p>
      </section>

      <section className="copy-block">
        <h2>Integrator copy</h2>
        <p>
          Agencies, SaaS builders, and other agents can call the M2M package contract to get the public MCP/API surfaces,
          required inputs, guaranteed output blocks, delivery artifacts, paid-readiness gates, and the current beta-signal risk.
        </p>
      </section>
    </main>
  );
}
