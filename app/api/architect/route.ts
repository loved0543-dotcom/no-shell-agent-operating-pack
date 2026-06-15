import { NextResponse } from 'next/server';
import { designAutomationStack } from '../../../lib/architect';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  try {
    return NextResponse.json(designAutomationStack({
      goal: String(body.goal ?? ''),
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
