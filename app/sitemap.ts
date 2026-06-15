import type { MetadataRoute } from 'next';

const base = 'https://ai-automation-operating-pack.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/launch`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/show-hn`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/server.json`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/llms.txt`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 }
  ];
}
