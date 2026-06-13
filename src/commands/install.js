import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import { getRegistry } from '../lib/registry.js';
import { installSkill } from '../lib/installer.js';
import { getLocalSkills } from '../lib/storage.js';

export default async function installHandler(skillName, options = {}) {
  const spinner = createSpinner(`Installing ${chalk.cyan(skillName)}...`).start();

  try {
    const registry = await getRegistry();
    const skill = registry.find(skillName);

    if (!skill) {
      spinner.error({ text: chalk.red(`Skill "${skillName}" not found in registry`) });
      console.log(chalk.dim('\n  Try: agentsmith search <query>\n'));
      process.exit(1);
    }

    // Check if already installed
    const localSkills = getLocalSkills();
    const alreadyInstalled = localSkills.find(s => s.name === skillName);

    if (alreadyInstalled && !options.force) {
      spinner.warn({
        text: chalk.yellow(`Skill "${skillName}" is already installed (v${alreadyInstalled.version})`)
      });
      console.log(chalk.dim(`  Use ${chalk.cyan('--force')} to reinstall\n`));
      return;
    }

    // Install the skill
    const installedSkill = await installSkill(skill, options);

    spinner.success({
      text: chalk.green(`✓ Installed ${chalk.bold(skillName)}@${installedSkill.version}`)
    });

    console.log(chalk.dim(`\n  📦  Installed to: ${installedSkill.path}`));
    console.log(chalk.dim(`  📄  Run ${chalk.cyan(`agentsmith info ${skillName}`)} for details\n`));

  } catch (error) {
    spinner.error({ text: chalk.red(`Failed to install ${skillName}`) });
    console.error(chalk.red(`\n  Error: ${error.message}\n`));
    process.exit(1);
  }
}
