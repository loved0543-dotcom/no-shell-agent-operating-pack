import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: 'https://no-shell-agent-architect-mcp.vercel.app/sitemap.xml'
  };
}
