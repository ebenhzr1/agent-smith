import chalk from 'chalk';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AGENT_SMITH_DIR } from '../lib/storage.js';
import { getDefaultRegistryUrl } from '../lib/config.js';

export default async function publishHandler(skillPath, options = {}) {
  const resolvedPath = join(process.cwd(), skillPath);
  const skillJsonPath = join(resolvedPath, 'skill.json');

  console.log(chalk.bold(`\n  🚀  Publishing skill from ${chalk.cyan(skillPath)}\n`));

  // Validate skill.json
  if (!existsSync(skillJsonPath)) {
    console.log(chalk.red('  ✗ No skill.json found in this directory'));
    console.log(chalk.dim('  Use `agentsmith init <name>` to create a new skill\n'));
    process.exit(1);
  }

  const skill = JSON.parse(readFileSync(skillJsonPath, 'utf-8'));

  // Validate required fields
  const required = ['name', 'version', 'description'];
  const missing = required.filter(f => !skill[f]);

  if (missing.length > 0) {
    console.log(chalk.red(`  ✗ Missing required fields: ${missing.join(', ')}\n`));
    process.exit(1);
  }

  // Validate SKILL.md
  const skillMdPath = join(resolvedPath, 'SKILL.md');
  if (!existsSync(skillMdPath)) {
    console.log(chalk.red('  ✗ SKILL.md not found. Every skill needs instructions.'));
    process.exit(1);
  }

  if (options['dry-run']) {
    console.log(chalk.green('  ✓ Validation passed!'));
    console.log(chalk.dim('  Dry run mode — no changes made.\n'));

    console.log(chalk.bold('  Package contents:'));
    console.log(chalk.dim(`    skill.json: ${Object.keys(skill).length} fields`));
    console.log(chalk.dim(`    SKILL.md: ${readFileSync(skillMdPath, 'utf-8').split('\n').length} lines`));
    console.log();

    if (existsSync(join(resolvedPath, 'src'))) {
      console.log(chalk.dim('    src/ directory included'));
    }
    if (existsSync(join(resolvedPath, 'test'))) {
      console.log(chalk.dim('    test/ directory included'));
    }
    console.log();
    return;
  }

  // In MVP: save to local "published" directory
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
}
