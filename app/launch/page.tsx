const endpoint = 'https://ai-automation-operating-pack.vercel.app/api/mcp';

export const metadata = {
  title: 'Launch Kit - No-Shell Agent Architect MCP',
  description: 'Launch copy, MCP endpoint, and client config for No-Shell Agent Architect MCP.'
};

export default function LaunchPage() {
  return (
    <main className="launch">
      <section className="launch-hero">
        <p className="eyebrow">Launch kit</p>
        <h1>No-Shell Agent Architect MCP launch kit</h1>
        <p className="lead">
          A free remote MCP that turns a vague automation request into a concrete tool stack, copy-paste agent command,
          dry-run plan, QA checks, recovery route, and human boundary.
        </p>
        <div className="cta-row">
          <a className="button" href="/">Try the live architect</a>
          <a className="button secondary" href="https://github.com/loved0543-dotcom/no-shell-agent-operating-pack">GitHub</a>
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
          <span>Best for</span>
          <p>Codex, Claude, ChatGPT, Gemini, Cursor, and automation users who do not know which tools to connect first.</p>
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
          look done and do not actually run the workflow. It returns the tool route, command, dry-run, QA checks, and
          human boundary before the agent starts building.
        </p>
      </section>
    </main>
  );
}
