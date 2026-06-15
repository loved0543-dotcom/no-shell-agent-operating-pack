import { NextResponse } from 'next/server';
import { buildM2MPackageContract } from '../../../lib/architect';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_GOAL = 'Package No-Shell Agent Architect MCP for agencies and builders that need a repeatable no-shell automation workflow contract.';

export async function GET() {
  return NextResponse.json(buildM2MPackageContract({
    goal: DEFAULT_GOAL,
    buyerType: 'AI automation agency, SaaS builder, or solo operator',
    packageMode: 'mcp_api',
    risk: 'medium'
  }));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  try {
    return NextResponse.json(buildM2MPackageContract({
      goal: String(body.goal ?? DEFAULT_GOAL),
      buyerType: body.buyerType ? String(body.buyerType) : undefined,
      packageMode: body.packageMode ? String(body.packageMode) : undefined,
      userType: body.userType ? String(body.userType) : undefined,
      domain: body.domain ? String(body.domain) : undefined,
      currentTools: Array.isArray(body.currentTools) ? body.currentTools.map(String) : undefined,
      risk: body.risk,
      language: body.language
    }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'invalid request' }, { status: 400 });
  }
}
