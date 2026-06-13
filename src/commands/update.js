import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getLocalSkills, saveLocalSkills } from '../lib/storage.js';
import { getRegistry } from '../lib/registry.js';
import { installSkill } from '../lib/installer.js';
import { createSpinner } from 'nanospinner';

export default async function updateHandler(options = {}) {
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

    if (remote.version !== local.version) {
      console.log(chalk.cyan(`  ${local.name}: v${local.version} → v${remote.version}`));
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
      const spinner = createSpinner(`Updating ${local.name} v${local.version} → v${remote.version}...`).start();
      try {
        await installSkill(remote, { force: true });
        spinner.success({ text: chalk.green(`${local.name}@${remote.version} installed`) });
      } catch (err) {
        spinner.error({ text: chalk.red(`Failed to update ${local.name}: ${err.message}`) });
      }
    }
  }

  console.log();
}
