import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { errorHandler } from '../utils/errors.js';
import { validateSkillName, sanitizeInput } from '../utils/sandbox.js';
import log from '../utils/logger.js';

function skillTemplate(name) {
  return {
    name,
    version: '0.1.0',
    description: 'A short description of what this skill does',
    author: '',
    license: 'MIT',
    tags: [],
    'agent-smith': {
      minVersion: '0.1.0',
      platforms: ['claude', 'openai', 'generic'],
      category: 'uncategorized',
    },
  };
}

function skillMdTemplate(name) {
  return `# ${name}

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
}

export default async function initHandler(name) {
  return await errorHandler('init', async () => {
    const cleanName = sanitizeInput(name || 'my-agent-skill');

    // Validate name
    const nameCheck = validateSkillName(cleanName);
    if (!nameCheck.valid) {
      console.log(chalk.red(`\n  ✗  ${nameCheck.reason}\n`));
      return;
    }

    const dir = cleanName;

    if (existsSync(dir)) {
      console.log(chalk.red(`\n  ✗ Directory "${dir}" already exists\n`));
      console.log(chalk.dim('  Choose a different name or run in an empty directory\n'));
      return;
    }

    console.log(chalk.bold(`\n  🔧  Initializing skill project: ${chalk.cyan(cleanName)}\n`));

    // Create directories
    mkdirSync(dir, { recursive: true });
    mkdirSync(join(dir, 'src'), { recursive: true });
    mkdirSync(join(dir, 'docs'), { recursive: true });
    mkdirSync(join(dir, 'test'), { recursive: true });

    // Create files
    writeFileSync(join(dir, 'skill.json'), JSON.stringify(skillTemplate(cleanName), null, 2));
    writeFileSync(join(dir, 'SKILL.md'), skillMdTemplate(cleanName));
    writeFileSync(join(dir, '.gitignore'), '# Agent Smith skill\nnode_modules/\n.DS_Store\n');

    const created = ['skill.json', 'SKILL.md', 'src/', 'docs/', 'test/', '.gitignore'];
    for (const f of created) {
      console.log(chalk.green(`  ✓  ${f}`));
    }

    console.log(chalk.bold(`\n  📝  Next steps:`));
    console.log(chalk.dim(`  1. Edit ${cleanName}/skill.json — add metadata`));
    console.log(chalk.dim(`  2. Edit ${cleanName}/SKILL.md — write instructions`));
    console.log(chalk.dim(`  3. Run ${chalk.cyan(`agentsmith publish ./${cleanName} --dry-run`)} to validate\n`));

    log.info('Skill scaffold created', { name: cleanName, path: dir });
  });
}
