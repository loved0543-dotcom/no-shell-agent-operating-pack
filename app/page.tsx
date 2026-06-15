import ArchitectClient from './ArchitectClient';

export default function Page() {
  return (
    <main>
      <header className="hero">
        <nav>
          <strong>No-Shell Agent Architect</strong>
          <span>
            <a href="/api/health">Health</a>
            <a href="/launch">Launch</a>
            <a href="/server.json">server.json</a>
            <a href="https://github.com/loved0543-dotcom/no-shell-agent-operating-pack">GitHub</a>
          </span>
        </nav>
        <section>
          <p className="eyebrow">Free public beta · Remote MCP + API for practical AI automation design</p>
          <h1>Turn “automate this” into a real agent workflow.</h1>
          <p className="lead">
            Most agent requests fail because they skip tool routing, inputs, human boundaries, and QA. This MCP returns
            the stack, command, dry-run path, validation checks, and recovery plan before an agent builds another empty shell.
          </p>
          <div className="cta-row">
            <a className="button" href="#architect">Try the architect</a>
            <a className="button secondary" href="https://github.com/loved0543-dotcom/no-shell-agent-operating-pack">Star / feedback</a>
            <a className="button secondary" href="/launch">Launch kit</a>
            <code>https://ai-automation-operating-pack.vercel.app/api/mcp</code>
          </div>
        </section>
      </header>

      <section className="band">
        <div>
          <span>Input</span>
          <b>Plain-language workflow</b>
          <p>“I need Gmail + Docs follow-up automation” or “Build an Obsidian learning cleanup flow.”</p>
        </div>
        <div>
          <span>Output</span>
          <b>Tool stack + prompt</b>
          <p>Installed plugin/MCP/skill route, copy-paste command, dry-run, QA, and boundary.</p>
        </div>
        <div>
          <span>Standard</span>
          <b>No-shell validation</b>
          <p>PASS only when the workflow reaches a usable sample result with evidence.</p>
        </div>
        <div>
          <span>Status</span>
          <b>Free public beta</b>
          <p>No payment flow. Feedback, issues, stars, and real workflow examples decide the next version.</p>
        </div>
      </section>

      <ArchitectClient />

      <section className="docs">
        <h2>MCP tools</h2>
        <div className="grid">
          {[
            ['design_automation_stack', 'Route a vague workflow into a concrete automation architecture.'],
            ['generate_no_shell_prompt', 'Create a copy-paste command for Codex, Claude, Gemini, or another agent.'],
            ['recommend_agent_tools', 'Choose plugins, MCPs, skills, and manual boundaries for the job.'],
            ['audit_automation_plan', 'Score an existing plan for shell-risk and missing execution pieces.'],
            ['build_validation_pack', 'Return dry-run, QA, audit, and PASS criteria.'],
            ['build_customer_intake', 'Generate a 10-minute intake for non-developers.']
          ].map(([name, desc]) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
