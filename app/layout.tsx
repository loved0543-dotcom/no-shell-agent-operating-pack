import './style.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const siteUrl = 'https://no-shell-agent-architect-mcp.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'No-Shell Agent Architect MCP',
  description: 'A remote MCP server that turns vague automation requests into tool stacks, prompts, QA checks, and human boundaries.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'No-Shell Agent Architect MCP',
    description: 'Turn vague automation requests into tool stacks, prompts, QA checks, and human boundaries.',
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: 'No-Shell Agent Architect MCP' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'No-Shell Agent Architect MCP',
    description: 'Turn vague automation requests into tool stacks, prompts, QA checks, and human boundaries.',
    images: ['/og.svg']
  },
  keywords: [
    'MCP server',
    'AI automation',
    'agent workflow',
    'prompt engineering',
    'no-shell automation',
    'Codex',
    'Claude',
    'ChatGPT'
  ]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
