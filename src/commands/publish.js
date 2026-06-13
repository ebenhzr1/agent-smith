import chalk from 'chalk';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { AGENT_SMITH_DIR } from '../lib/storage.js';
import { getDefaultRegistryUrl } from '../lib/config.js';
import { errorHandler, SkillValidationError } from '../utils/errors.js';
import { validateVersion, validateSkillName } from '../utils/sandbox.js';
import log from '../utils/logger.js';

export default async function publishHandler(skillPath, options = {}) {
  return await errorHandler('publish', async () => {
    const resolvedPath = join(process.cwd(), skillPath);
    const skillJsonPath = join(resolvedPath, 'skill.json');

    console.log(chalk.bold(`\n  🚀  Publishing skill from ${chalk.cyan(skillPath)}\n`));

    // Validate skill.json exists
    if (!existsSync(skillJsonPath)) {
      console.log(chalk.red('  ✗ No skill.json found in this directory'));
      console.log(chalk.dim('  Use `agentsmith init <name>` to create a new skill\n'));
      return;
    }

    const skill = JSON.parse(readFileSync(skillJsonPath, 'utf-8'));

    // Validate required fields
    const required = ['name', 'version', 'description'];
    const missing = required.filter(f => !skill[f]);
    if (missing.length > 0) {
      console.log(chalk.red(`  ✗ Missing required fields: ${missing.join(', ')}`));
      console.log(chalk.dim(`    Edit ${skillPath}/skill.json to add them\n`));
      return;
    }

    // Validate name
    const nameCheck = validateSkillName(skill.name);
    if (!nameCheck.valid) {
      console.log(chalk.red(`  ✗ Invalid skill name: ${nameCheck.reason}`));
      console.log(chalk.dim('    Only a-z, 0-9, hyphens, underscores allowed\n'));
      return;
    }

    // Validate version format
    if (!validateVersion(skill.version)) {
      console.log(chalk.red(`  ✗ Invalid version: "${skill.version}". Use SemVer (e.g., 1.0.0)`));
      console.log(chalk.dim('    Edit skill.json version field\n'));
      return;
    }

    // Validate agent-smith config
    if (!skill['agent-smith']) {
      console.log(chalk.yellow('  ⚠  Missing "agent-smith" config block. Adding defaults...'));
      skill['agent-smith'] = {
        minVersion: '0.1.0',
        platforms: ['claude', 'openai', 'generic'],
        category: 'uncategorized',
      };
    }

    // Validate SKILL.md
    const skillMdPath = join(resolvedPath, 'SKILL.md');
    if (!existsSync(skillMdPath)) {
      console.log(chalk.red('  ✗ SKILL.md not found. Every skill needs instructions.'));
      console.log(chalk.dim('    Create SKILL.md with process, verification, and anti-rationalizations\n'));
      return;
    }

    // Dry-run mode
    if (options['dry-run']) {
      console.log(chalk.green('  ✓ Validation passed!'));
      console.log(chalk.dim('  Dry run mode — no changes made.\n'));

      console.log(chalk.bold('  Package contents:'));
      const fieldCount = Object.keys(skill).length;
      const mdLines = readFileSync(skillMdPath, 'utf-8').split('\n').length;
      console.log(chalk.dim(`    skill.json: ${fieldCount} fields`));
      console.log(chalk.dim(`    SKILL.md: ${mdLines} lines`));
      console.log(chalk.dim(`    Version: ${skill.version}`));
      console.log(chalk.dim(`    Platforms: ${skill['agent-smith']?.platforms?.join(', ') || 'none'}\n`));
      return;
    }

    // Save to local published directory
    const publishedDir = join(AGENT_SMITH_DIR, 'published');
    mkdirSync(publishedDir, { recursive: true });

    const publishPath = join(publishedDir, `${skill.name}@${skill.version}.json`);
    const metadata = {
      ...skill,
      publishedAt: new Date().toISOString(),
      registry: getDefaultRegistryUrl(),
    };

    writeFileSync(publishPath, JSON.stringify(metadata, null, 2));

    console.log(chalk.green(`  ✓ Published ${chalk.bold(skill.name)}@${skill.version} to local registry`));
    console.log(chalk.dim(`  📄  Registry: ${getDefaultRegistryUrl()}`));
    console.log(chalk.dim('  📝  Others can install it with:'));
    console.log(chalk.cyan(`      agentsmith install ${skill.name}\n`));

    log.info('Skill published locally', {
      name: skill.name,
      version: skill.version,
      path: publishPath,
    });
  });
}
