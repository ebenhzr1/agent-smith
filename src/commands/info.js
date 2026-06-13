import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { AGENT_SMITH_DIR } from '../lib/storage.js';
import { errorHandler } from '../utils/errors.js';
import { sanitizeInput } from '../utils/sandbox.js';
import log from '../utils/logger.js';

export default async function infoHandler(skillName, options = {}) {
  return await errorHandler('info', async () => {
    const cleanName = sanitizeInput(skillName);

    // Check local first
    const localPath = join(AGENT_SMITH_DIR, 'skills', cleanName, 'skill.json');
    let skill = null;

    if (existsSync(localPath)) {
      skill = JSON.parse(readFileSync(localPath, 'utf-8'));
      skill.source = 'installed';
    } else {
      // Check registry
      const { getRegistry } = await import('../lib/registry.js');
      const registry = await getRegistry();
      skill = registry.find(cleanName);
      if (skill) skill.source = 'registry';
    }

    if (!skill) {
      console.log(chalk.red(`\n  ✗ Skill "${cleanName}" not found\n`));
      console.log(chalk.dim('  💡  Try:'));
      console.log(chalk.dim(`    agentsmith search ${cleanName}`));
      console.log(chalk.dim('    agentsmith browse\n'));
      log.warn('Skill info requested but not found', { name: cleanName });
      return;
    }

    if (options.json) {
      console.log(JSON.stringify(skill, null, 2));
      return;
    }

    console.log(chalk.bold(`\n  📄  ${chalk.cyan(skill.name)}`));
    console.log(chalk.dim('  ' + '─'.repeat(40)));

    const fields = [
      ['Version', chalk.green(`v${skill.version}`)],
      ['Description', skill.description || '—'],
      ['Author', skill.author || '—'],
      ['License', skill.license || 'MIT'],
      ['Tags', (skill.tags || []).map(t => chalk.dim(t)).join(', ') || '—'],
      ['Category', skill['agent-smith']?.category || '—'],
      ['Platforms', (skill['agent-smith']?.platforms || []).join(', ') || '—'],
      ['Source', skill.source === 'installed' ? chalk.green('✓ Installed') : chalk.blue('★ Registry')],
    ];

    for (const [label, value] of fields) {
      console.log(`  ${chalk.dim(label.padEnd(14))} ${value}`);
    }

    if (skill.source === 'installed') {
      console.log(chalk.dim(`  ${chalk.dim('Path'.padEnd(14))} ${localPath.replace('/skill.json', '')}`));
    }

    console.log();
  });
}
