import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { AGENT_SMITH_DIR } from '../lib/storage.js';

export default async function infoHandler(skillName, options = {}) {
  // Check local first
  const localPath = join(AGENT_SMITH_DIR, 'skills', skillName, 'skill.json');

  let skill = null;

  if (existsSync(localPath)) {
    skill = JSON.parse(readFileSync(localPath, 'utf-8'));
    skill.source = 'installed';
  } else {
    // Check registry
    const { getRegistry } = await import('../lib/registry.js');
    const registry = await getRegistry();
    skill = registry.find(skillName);
    if (skill) skill.source = 'registry';
  }

  if (!skill) {
    console.log(chalk.red(`\n  ✗ Skill "${skillName}" not found\n`));
    console.log(chalk.dim('  Check the spelling or try:\n'));
    console.log(chalk.dim('    agentsmith search ' + skillName));
    console.log(chalk.dim('    agentsmith browse\n'));
    process.exit(1);
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

  fields.forEach(([label, value]) => {
    console.log(`  ${chalk.dim(label.padEnd(14))} ${value}`);
  });

  console.log();
}
