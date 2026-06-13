import chalk from 'chalk';
import { getRegistry } from '../lib/registry.js';

export default async function searchHandler(query, options = {}) {
  const registry = await getRegistry();

  console.log(chalk.bold(`\n  🔍  Searching for "${chalk.cyan(query)}"...\n`));

  const results = registry.search(query, options.tag);

  if (results.length === 0) {
    console.log(chalk.yellow('  No skills found. Try a different query.'));
    console.log(chalk.dim('  Pro-tip: Use `agentsmith browse` to see all available skills\n'));
    return;
  }

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  results.forEach((skill, i) => {
    const idx = String(i + 1).padStart(2, ' ');
    const tags = (skill.tags || []).map(t => chalk.dim(`#${t}`)).join(' ');
    const version = chalk.green(`v${skill.version}`);
    const stars = skill.stars ? chalk.yellow(`★ ${skill.stars}`) : '';

    console.log(`  ${idx}. ${chalk.bold(skill.name)}  ${version}  ${stars}`);
    if (skill.description) console.log(`      ${chalk.dim(skill.description)}`);
    if (tags) console.log(`      ${tags}`);
    if (skill.author) console.log(`      ${chalk.dim('by')} ${skill.author}`);
    console.log();
  });

  console.log(chalk.dim(`  📊  ${results.length} skill(s) found\n`));
}
