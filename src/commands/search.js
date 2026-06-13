import chalk from 'chalk';
import { getRegistry } from '../lib/registry.js';
import { errorHandler } from '../utils/errors.js';
import { sanitizeInput } from '../utils/sandbox.js';
import log from '../utils/logger.js';

export default async function searchHandler(query, options = {}) {
  return await errorHandler('search', async () => {
    const cleanQuery = sanitizeInput(query);

    log.info('Search', { query: cleanQuery, tag: options.tag });

    console.log(chalk.bold(`\n  🔍  Searching for "${chalk.cyan(cleanQuery)}"...\n`));

    const registry = await getRegistry();
    const results = registry.search(cleanQuery, options.tag);

    if (results.length === 0) {
      console.log(chalk.yellow('  No skills found. Try a different query.'));
      console.log(chalk.dim('  💡  Try one of these:'));
      console.log(chalk.dim('    agentsmith search "code"'));
      console.log(chalk.dim('    agentsmith search "testing"'));
      console.log(chalk.dim('    agentsmith search "web"'));
      console.log(chalk.dim('    agentsmith browse\n'));
      return;
    }

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    for (const [i, skill] of results.entries()) {
      const idx = String(i + 1).padStart(2, ' ');
      const tags = (skill.tags || []).map(t => chalk.dim(`#${t}`)).join(' ');
      const version = chalk.green(`v${skill.version}`);
      const stars = skill.stars ? chalk.yellow(`★ ${skill.stars}`) : '';

      console.log(`  ${idx}. ${chalk.bold(skill.name)}  ${version}  ${stars}`);
      console.log(`      ${chalk.dim(skill.description)}`);
      if (tags) console.log(`      ${tags}`);
      if (skill.author) console.log(`      ${chalk.dim('by')} ${skill.author}`);
      console.log();
    }

    console.log(chalk.dim(`  📊  ${results.length} skill(s) found\n`));
  });
}
