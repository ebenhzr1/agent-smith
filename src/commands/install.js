import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import { getRegistry } from '../lib/registry.js';
import { installSkill } from '../lib/installer.js';
import { getLocalSkills } from '../lib/storage.js';
import { errorHandler, SkillNotFoundError, SkillAlreadyInstalledError } from '../utils/errors.js';
import { validateSkillName, sanitizeInput, validateVersion } from '../utils/sandbox.js';
import log from '../utils/logger.js';

export default async function installHandler(skillName, options = {}) {
  return await errorHandler('install', async () => {
    // Input validation
    const cleanName = sanitizeInput(skillName);
    const nameCheck = validateSkillName(cleanName);
    if (!nameCheck.valid) {
      console.log(chalk.red(`\n  ✗  ${nameCheck.reason}\n`));
      return;
    }

    // Handle version notation: skill-name@1.0.0
    let version = options.version || null;
    let baseName = cleanName;

    if (cleanName.includes('@')) {
      const parts = cleanName.split('@');
      baseName = parts[0];
      version = parts[1];
    }

    // Validate version if specified
    if (version && !validateVersion(version)) {
      console.log(chalk.red(`\n  ✗  Invalid version format: "${version}". Use SemVer (e.g., 1.0.0)\n`));
      return;
    }

    log.info('Installing skill', { name: baseName, version: version || 'latest' });

    const spinner = createSpinner(`Installing ${chalk.cyan(baseName)}...`).start();

    const registry = await getRegistry();
    const skill = registry.find(baseName);

    if (!skill) {
      spinner.error({ text: chalk.red(`Skill "${baseName}" not found in registry`) });
      console.log(chalk.dim('\n  💡  Try:'));
      console.log(chalk.dim('    agentsmith search <query>'));
      console.log(chalk.dim('    agentsmith browse\n'));
      log.warn('Skill not found', { name: baseName });
      return;
    }

    // Version resolution
    const targetVersion = version || skill.version;

    // Check if already installed
    const localSkills = getLocalSkills();
    const alreadyInstalled = localSkills.find(s => s.name === baseName);

    if (alreadyInstalled && !options.force) {
      spinner.warn({
        text: chalk.yellow(`"${baseName}" already installed (v${alreadyInstalled.version})`)
      });
      console.log(chalk.dim(`  Use ${chalk.cyan('--force')} to reinstall\n`));
      return;
    }

    if (alreadyInstalled && options.force) {
      log.info('Force reinstalling', { name: baseName });
    }

    // Merge version into skill object for installer
    const installTarget = { ...skill, version: targetVersion };

    // Install
    try {
      const installedSkill = await installSkill(installTarget, options);

      spinner.success({
        text: chalk.green(`✓ Installed ${chalk.bold(baseName)}@${installedSkill.version}`)
      });

      console.log(chalk.dim(`\n  📦  Location: ${installedSkill.path}`));
      console.log(chalk.dim(`  📄  Run ${chalk.cyan(`agentsmith info ${baseName}`)} for details`));
      console.log(chalk.dim(`  🗑️   Run ${chalk.cyan(`agentsmith uninstall ${baseName}`)} to remove\n`));

      log.info('Install completed', { name: baseName, version: targetVersion });
    } catch (err) {
      spinner.error({ text: chalk.red(`Failed to install ${baseName}: ${err.message}`) });
      log.error('Install failed', { name: baseName, error: err.message });
    }
  });
}
