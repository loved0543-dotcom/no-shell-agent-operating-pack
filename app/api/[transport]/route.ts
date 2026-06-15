import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import {
  auditAutomationPlan,
  buildCustomerIntake,
  buildValidationPack,
  designAutomationStack,
  generateNoShellPrompt,
  recommendAgentTools
} from '../../../lib/architect';

const architectSchema = {
  goal: z.string().min(6).describe('Plain-language automation goal.'),
  userType: z.string().optional().describe('Non-developer, solo operator, small team, developer, agency, etc.'),
  domain: z.string().optional().describe('Optional domain hint such as email_docs, ecommerce_data, knowledge_base, coding.'),
  currentTools: z.array(z.string()).optional().describe('Tools/plugins/MCPs already available to the user.'),
  risk: z.enum(['low', 'medium', 'high']).optional(),
  language: z.enum(['ko', 'en']).optional()
};

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'design_automation_stack',
      {
        title: 'Design Automation Stack',
        description: 'Turn a vague automation request into a tool/MCP/plugin/skill stack, workflow phases, validation pack, and human boundary.',
        inputSchema: architectSchema
      },
      async (args) => ({
        content: [{ type: 'text', text: JSON.stringify(designAutomationStack(args), null, 2) }]
      })
    );

    server.registerTool(
      'generate_no_shell_prompt',
      {
        title: 'Generate No-Shell Prompt',
        description: 'Create a copy-paste natural-language command that tells an agent how to execute the workflow without producing an empty shell.',
        inputSchema: architectSchema
      },
      async (args) => ({
        content: [{ type: 'text', text: JSON.stringify(generateNoShellPrompt(args), null, 2) }]
      })
    );

    server.registerTool(
      'recommend_agent_tools',
      {
        title: 'Recommend Agent Tools',
        description: 'Recommend MCP servers, Codex plugins, skills, and manual boundaries for a requested automation.',
        inputSchema: architectSchema
      },
      async (args) => ({
        content: [{ type: 'text', text: JSON.stringify(recommendAgentTools(args), null, 2) }]
      })
    );

    server.registerTool(
      'audit_automation_plan',
      {
        title: 'Audit Automation Plan',
        description: 'Score an existing automation plan for shell-risk, missing inputs, missing validation, missing tool route, and missing recovery path.',
        inputSchema: {
          plan: z.string().min(20).describe('Automation plan or prompt to audit.')
        }
      },
      async ({ plan }) => ({
        content: [{ type: 'text', text: JSON.stringify(auditAutomationPlan(plan), null, 2) }]
      })
    );

    server.registerTool(
      'build_validation_pack',
      {
        title: 'Build Validation Pack',
        description: 'Return dry-run, QA, audit, and PASS criteria for one automation workflow.',
        inputSchema: {
          goal: z.string().min(6),
          domain: z.string().optional(),
          risk: z.string().optional()
        }
      },
      async (args) => ({
        content: [{ type: 'text', text: JSON.stringify(buildValidationPack(args), null, 2) }]
      })
    );

    server.registerTool(
      'build_customer_intake',
      {
        title: 'Build Customer Intake',
        description: 'Generate a 10-minute intake questionnaire for a non-developer who wants one workflow automated.',
        inputSchema: {
          goal: z.string().optional()
        }
      },
      async ({ goal }) => ({
        content: [{ type: 'text', text: JSON.stringify(buildCustomerIntake(goal), null, 2) }]
      })
    );
  },
  {
    serverInfo: {
      name: 'no-shell-agent-architect-mcp',
      version: '0.1.1'
    }
  },
  {
    basePath: '/api',
    maxDuration: 60,
    verboseLogs: false
  }
);

export { handler as GET, handler as POST };
