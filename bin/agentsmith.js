#!/usr/bin/env node
/**
 * Agent Smith CLI — Universal Package Manager for AI Agent Skills
 *
 * Usage:
 *   agentsmith search <query>
 *   agentsmith install <skill>
 *   agentsmith publish [path]
 *   agentsmith list
 *   agentsmith init [name]
 *   agentsmith info <skill>
 *   agentsmith update
 *   agentsmith doctor
 *   agentsmith browse
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkgPath = join(__dirname, '..', 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const program = new Command();

program
  .name('agentsmith')
  .description(chalk.cyan('🔧 Agent Smith — The universal package manager for AI agent skills'))
  .version(pkg.version, '-v, --version', 'Display Agent Smith version');

// ─── COMMAND: search ───────────────────────────────────────────────
program
  .command('search')
  .description('Search for skills in the registry')
  .argument('<query...>', 'Search query (e.g. "code review" or "web scraping")')
  .option('-t, --tag <tag>', 'Filter by tag (e.g. engineering, marketing, design)')
  .option('--json', 'Output as JSON')
  .action(async (query, options) => {
    const { default: searchHandler } = await import('../src/commands/search.js');
    await searchHandler(query.join(' '), options);
  });

// ─── COMMAND: install ──────────────────────────────────────────────
program
  .command('install')
  .description('Install a skill from the registry')
  .argument('<skill>', 'Skill name (e.g. code-reviewer)')
  .option('-v, --version <version>', 'Specific version to install')
  .option('--dev', 'Install for development (local path)')
  .option('-f, --force', 'Force reinstall if already installed')
  .action(async (skill, options) => {
    const { default: installHandler } = await import('../src/commands/install.js');
    await installHandler(skill, options);
  });

// ─── COMMAND: publish ──────────────────────────────────────────────
program
  .command('publish')
  .description('Publish a skill to the registry')
  .argument('[path]', 'Path to skill directory', '.')
  .option('--public', 'Publish as public (default)')
  .option('--dry-run', 'Validate without publishing')
  .action(async (path, options) => {
    const { default: publishHandler } = await import('../src/commands/publish.js');
    await publishHandler(path, options);
  });

// ─── COMMAND: list / ls ────────────────────────────────────────────
program
  .command('list')
  .alias('ls')
  .description('List all installed skills')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const { default: listHandler } = await import('../src/commands/list.js');
    await listHandler(options);
  });

// ─── COMMAND: init ─────────────────────────────────────────────────
program
  .command('init')
  .description('Initialize a new skill project')
  .argument('[name]', 'Name of the skill', 'my-agent-skill')
  .action(async (name) => {
    const { default: initHandler } = await import('../src/commands/init.js');
    await initHandler(name);
  });

// ─── COMMAND: info ─────────────────────────────────────────────────
program
  .command('info')
  .description('Show detailed information about a skill')
  .argument('<skill>', 'Skill name')
  .option('--json', 'Output as JSON')
  .action(async (skill, options) => {
    const { default: infoHandler } = await import('../src/commands/info.js');
    await infoHandler(skill, options);
  });

// ─── COMMAND: update ───────────────────────────────────────────────
program
  .command('update')
  .description('Update all installed skills to latest versions')
  .option('-c, --check', 'Only check for updates, do not install')
  .action(async (options) => {
    const { default: updateHandler } = await import('../src/commands/update.js');
    await updateHandler(options);
  });

// ─── COMMAND: doctor ───────────────────────────────────────────────
program
  .command('doctor')
  .description('Check system health and diagnose issues')
  .action(async () => {
    const { default: doctorHandler } = await import('../src/commands/doctor.js');
    await doctorHandler();
  });

// ─── COMMAND: browse ───────────────────────────────────────────────
program
  .command('browse')
  .description('Open the skill registry in your browser')
  .option('-o, --open', 'Open browser automatically')
  .action(async (options) => {
    const { default: browseHandler } = await import('../src/commands/browse.js');
    await browseHandler(options);
  });

// ─── COMMAND: uninstall ────────────────────────────────────────────
program
  .command('uninstall')
  .description('Uninstall a skill')
  .argument('<skill>', 'Skill name to uninstall')
  .action(async (skill) => {
    const { default: uninstallHandler } = await import('../src/commands/uninstall.js');
    await uninstallHandler(skill);
  });

// ─── Parse & show help if no args ──────────────────────────────────
if (process.argv.length <= 2) {
  console.log(chalk.bold.cyan('\n  ⚡  AGENT SMITH v' + pkg.version + '\n'));
  console.log(chalk.dim('  The universal package manager for AI agent skills\n'));
  program.help();
} else {
  program.parse(process.argv);
}
