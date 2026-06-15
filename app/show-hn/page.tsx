export const metadata = {
  title: 'Show HN: No-Shell Agent Architect MCP',
  description: 'A remote MCP that helps agents plan the workflow before building another empty shell.'
};

export default function ShowHnPage() {
  return (
    <main className="launch">
      <section className="launch-hero">
        <p className="eyebrow">Show HN draft page</p>
        <h1>Show HN: I made an MCP that tells agents how not to build empty-shell automation.</h1>
        <p className="lead">
          The failure pattern I kept seeing: people ask an agent to automate work, and it creates files, buttons, or a
          dashboard that looks finished but does not run the real workflow. This MCP sits before execution and returns
          the missing pieces: tool route, copy-paste command, dry-run, QA checks, recovery path, and human boundary.
        </p>
        <div className="cta-row">
          <a className="button" href="/">Try it</a>
          <a className="button secondary" href="/server.json">server.json</a>
          <a className="button secondary" href="https://github.com/loved0543-dotcom/no-shell-agent-operating-pack">Source</a>
        </div>
      </section>

      <section className="copy-block">
        <h2>What I want feedback on</h2>
        <ul className="plain-list">
          <li>Is this useful as an MCP tool, or should it be a static checklist?</li>
          <li>Which automation domains should the router cover first: docs, browser ops, coding, research, or knowledge bases?</li>
          <li>What would make the output concrete enough to use before running Codex, Claude, ChatGPT, or Cursor?</li>
        </ul>
      </section>

      <section className="copy-block">
        <h2>Example input</h2>
        <pre>Automate competitor research from websites, turn it into an Obsidian learning note, and produce a client-ready report.</pre>
      </section>
    </main>
  );
}
