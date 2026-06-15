import './style.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'No-Shell Agent Architect MCP',
  description: 'A remote MCP server that turns vague automation requests into tool stacks, prompts, QA checks, and human boundaries.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
