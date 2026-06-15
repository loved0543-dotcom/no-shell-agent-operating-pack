import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'no-shell-agent-architect-mcp',
    version: '0.1.0',
    tools: [
      'design_automation_stack',
      'generate_no_shell_prompt',
      'recommend_agent_tools',
      'audit_automation_plan',
      'build_validation_pack',
      'build_customer_intake'
    ]
  });
}
