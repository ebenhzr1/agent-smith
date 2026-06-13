import chalk from 'chalk';
import { getLocalSkills } from '../lib/storage.js';
import { getRegistry } from '../lib/registry.js';
import { installSkill } from '../lib/installer.js';
import { createSpinner } from 'nanospinner';
import { errorHandler } from '../utils/errors.js';
import log from '../utils/logger.js';

export default async function updateHandler(options = {}) {
  return await errorHandler('update', async () => {
    const localSkills = getLocalSkills();

    if (localSkills.length === 0) {
      console.log(chalk.yellow('\n  No skills installed. Nothing to update.\n'));
      return;
    }

    console.log(chalk.bold(`\n  🔄  Checking updates for ${localSkills.length} skill(s)...\n`));

    const registry = await getRegistry();
    let updatesFound = 0;

    for (const local of localSkills) {
      const remote = registry.find(local.name);

      if (!remote) {
        console.log(chalk.dim(`  ${local.name}: not found in registry (skipping)`));
        continue;
      }

      // Compare versions using basic check
      if (remote.version !== local.version) {
        console.log(chalk.cyan(`  ${local.name}: ${chalk.dim(`v${local.version}`)} → ${chalk.green(`v${remote.version}`)}`));
        updatesFound++;
      } else {
        console.log(chalk.dim(`  ${local.name}: v${local.version} (latest)`));
      }
    }

    if (options.check) {
      if (updatesFound > 0) {
        console.log(chalk.bold(`\n  ${updatesFound} update(s) available. Run ${chalk.cyan('agentsmith update')} to install.\n`));
      } else {
        console.log(chalk.green('\n  All skills up to date!\n'));
      }
      return;
    }

    if (updatesFound === 0) {
      console.log(chalk.green('\n  All skills up to date!\n'));
      return;
    }

    console.log(chalk.bold(`\n  Installing ${updatesFound} update(s)...\n`));

    for (const local of localSkills) {
      const remote = registry.find(local.name);
      if (remote && remote.version !== local.version) {
        const spinner = createSpinner(`Updating ${local.name}...`).start();
        try {
          await installSkill(remote, { force: true });
          spinner.success({ text: chalk.green(`${local.name}@${remote.version} installed`) });
          log.info('Skill updated', { name: local.name, from: local.version, to: remote.version });
        } catch (err) {
          spinner.error({ text: chalk.red(`Failed to update ${local.name}: ${err.message}`) });
          log.error('Update failed', { name: local.name, error: err.message });
        }
      }
    }

    console.log();
  });
}
