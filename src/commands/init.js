import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync, copyFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SKILL_TEMPLATE = (name) => `{
  "name": "${name}",
  "version": "0.1.0",
  "description": "A short description of what this skill does",
  "author": "",
  "license": "MIT",
  "tags": [],
  "agent-smith": {
    "minVersion": "0.1.0",
    "platforms": ["claude", "openai", "generic"],
    "category": "uncategorized"
  }
}
`;

const SKILL_MD_TEMPLATE = (name) => `# ${name}

## Description
A brief description of what this skill does and when to use it.

## Platforms
- Claude Code
- OpenAI Codex
- Generic AI Agent

## Usage

\`\`\`
When you need to perform this task, the agent should follow these steps.
\`\`\`

## Process

### Step 1: Understand the context
- Gather information about what needs to be done
- Identify key constraints and requirements

### Step 2: Execute
- Follow the defined workflow
- Apply best practices and guardrails

### Step 3: Verify
- Check that the output meets quality standards
- Validate against requirements

## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "This step is unnecessary here" | Every step exists for a reason. Follow the process. |
| "I know what to do already" | The skill ensures consistency. Follow it anyway. |
| "We don't have time for this" | Skipping steps creates technical debt. |

## Verification
- [ ] All steps completed
- [ ] Output verified against requirements
- [ ] Edge cases considered
`;

export default async function initHandler(name) {
  const dir = name;

  if (existsSync(dir)) {
    console.log(chalk.red(`\n  ✗ Directory "${dir}" already exists\n`));
    process.exit(1);
  }

  console.log(chalk.bold(`\n  🔧  Initializing skill project: ${chalk.cyan(name)}\n`));

  // Create directories
  mkdirSync(dir, { recursive: true });
  mkdirSync(join(dir, 'src'), { recursive: true });
  mkdirSync(join(dir, 'docs'), { recursive: true });
  mkdirSync(join(dir, 'test'), { recursive: true });

  // Create files
  writeFileSync(join(dir, 'skill.json'), JSON.stringify(JSON.parse(SKILL_TEMPLATE(name)), null, 2));
  writeFileSync(join(dir, 'SKILL.md'), SKILL_MD_TEMPLATE(name));
  writeFileSync(join(dir, '.gitignore'), 'node_modules/\n.DS_Store\n');

  console.log(chalk.green('  ✓ Created:'));
  ['skill.json', 'SKILL.md', 'src/', 'docs/', 'test/', '.gitignore'].forEach(f =>
    console.log(chalk.dim(`    ${f}`))
  );

  console.log(chalk.bold(`\n  📝  ${chalk.cyan('skill.json')} — Edit this to add metadata`));
  console.log(chalk.dim(`  📝  ${chalk.cyan('SKILL.md')} — Write your skill instructions here`));
  console.log(chalk.dim(`  📝  Run ${chalk.cyan('agentsmith publish ./' + name)} to share with the world\n`));
}
