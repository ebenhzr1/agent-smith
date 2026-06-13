import chalk from 'chalk';
import { getLocalSkills } from '../lib/storage.js';
import Table from 'cli-table3';

export default async function listHandler(options = {}) {
  const skills = getLocalSkills();

  if (options.json) {
    console.log(JSON.stringify(skills, null, 2));
    return;
  }

  if (skills.length === 0) {
    console.log(chalk.yellow('\n  No skills installed yet.\n'));
    console.log(chalk.dim('  Use `agentsmith install <skill>` to install your first skill!'));
    console.log(chalk.dim('  Or run `agentsmith browse` to see what\'s available.\n'));
    return;
  }

  console.log(chalk.bold(`\n  📦  Installed Skills (${skills.length})\n`));

  const table = new Table({
    head: ['Name', 'Version', 'Category', 'Author'],
    style: { head: ['cyan'], border: ['grey'] }
  });

  skills.forEach(skill => {
    table.push([
      chalk.bold(skill.name),
      chalk.green(`v${skill.version}`),
      skill.category || '—',
      skill.author || '—'
    ]);
  });

  console.log(table.toString());
  console.log(dim('\n  Run `agentsmith info <skill>` for details\n'));
}

function dim(str) {
  return chalk.dim(str);
}
