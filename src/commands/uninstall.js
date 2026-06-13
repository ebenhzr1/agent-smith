import chalk from 'chalk';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';
import { AGENT_SMITH_DIR, getLocalSkills, saveLocalSkills } from '../lib/storage.js';
import { createSpinner } from 'nanospinner';
import { errorHandler } from '../utils/errors.js';
import { validateSkillName, safePath } from '../utils/sandbox.js';
import log from '../utils/logger.js';

export default async function uninstallHandler(skillName) {
  return await errorHandler('uninstall', async () => {
    // Validate skill name
    const nameCheck = validateSkillName(skillName);
    if (!nameCheck.valid) {
      console.log(chalk.red(`\n  ✗  ${nameCheck.reason}\n`));
      return;
    }

    log.info('Uninstalling skill', { name: skillName });

    const spinner = createSpinner(`Uninstalling ${chalk.cyan(skillName)}...`).start();

    // Verify it's installed
    const localSkills = getLocalSkills();
    const idx = localSkills.findIndex(s => s.name === skillName);

    if (idx === -1) {
      spinner.error({ text: chalk.yellow(`Skill "${skillName}" is not installed`) });
      return;
    }

    // Use safe path for deletion
    const safe = safePath(AGENT_SMITH_DIR, 'skills', skillName);
    if (!safe) {
      spinner.error({ text: chalk.red('Security error: invalid path') });
      log.error('Path traversal blocked during uninstall', { skillName });
      return;
    }

    // Remove directory safely
    if (existsSync(safe)) {
      rmSync(safe, { recursive: true, force: true });
      log.info('Skill directory removed', { path: safe });
    }

    // Remove from local registry
    localSkills.splice(idx, 1);
    saveLocalSkills(localSkills);

    spinner.success({ text: chalk.green(`✓ Uninstalled ${chalk.bold(skillName)}`) });
    log.info('Skill uninstalled', { name: skillName });
  });
}
