import chalk from 'chalk';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';
import { AGENT_SMITH_DIR, getLocalSkills, saveLocalSkills } from '../lib/storage.js';
import { createSpinner } from 'nanospinner';

export default async function uninstallHandler(skillName) {
  const spinner = createSpinner(`Uninstalling ${chalk.cyan(skillName)}...`).start();

  try {
    const localSkills = getLocalSkills();
    const idx = localSkills.findIndex(s => s.name === skillName);

    if (idx === -1) {
      spinner.error({ text: chalk.yellow(`Skill "${skillName}" is not installed`) });
      return;
    }

    // Remove directory
    const skillDir = join(AGENT_SMITH_DIR, 'skills', skillName);
    if (existsSync(skillDir)) {
      rmSync(skillDir, { recursive: true, force: true });
    }

    // Remove from local registry
    localSkills.splice(idx, 1);
    saveLocalSkills(localSkills);

    spinner.success({ text: chalk.green(`✓ Uninstalled ${chalk.bold(skillName)}`) });

  } catch (error) {
    spinner.error({ text: chalk.red(`Failed to uninstall ${skillName}: ${error.message}`) });
    process.exit(1);
  }
}
