import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function doctorHandler() {
  console.log(chalk.bold('\n  🩺  Agent Smith — System Diagnostics\n'));

  const checks = [
    ['Node.js version', checkNodeVersion],
    ['Agent Smith CLI', checkCLIVersion],
    ['Config directory', checkConfigDir],
    ['Installed skills', checkInstalledSkills],
    ['Registry access', checkRegistry],
    ['GitHub connectivity', checkGitHub],
  ];

  let allPassed = true;

  for (const [name, check] of checks) {
    try {
      await check();
      console.log(chalk.green(`  ✓  ${chalk.dim(name)}`));
    } catch (err) {
      allPassed = false;
      console.log(chalk.red(`  ✗  ${chalk.dim(name)}`));
      console.log(`      ${chalk.yellow(err.message)}`);
    }
  }

  if (allPassed) {
    console.log(chalk.bold.green('\n  ✅  All systems operational!\n'));
  } else {
    console.log(chalk.bold.yellow('\n  ⚠️   Some issues detected\n'));
  }
}

async function checkNodeVersion() {
  const version = process.versions.node;
  const major = parseInt(version.split('.')[0], 10);
  if (major < 18) throw new Error(`Node.js ${version} detected, need >= 18`);
}

async function checkCLIVersion() {
  const pkgPath = join(__dirname, '..', '..', 'package.json');
  const pkg = JSON.parse(await readFileSync(pkgPath, 'utf-8'));
  if (!pkg.version) throw new Error('Could not determine CLI version');
}

async function checkConfigDir() {
  const { AGENT_SMITH_DIR, ensureDir } = await import('../lib/storage.js');
  ensureDir();
  const { existsSync } = await import('fs');
  if (!existsSync(AGENT_SMITH_DIR)) throw new Error('Config directory not found');
}

async function checkInstalledSkills() {
  const { getLocalSkills } = await import('../lib/storage.js');
  const skills = getLocalSkills();
  console.log(chalk.dim(`      ${skills.length} skill(s) installed`));
}

async function checkRegistry() {
  const { getRegistry } = await import('../lib/registry.js');
  const registry = await getRegistry();
  if (!registry || registry.skills().length === 0) {
    console.log(chalk.dim('      Registry accessible, 0 skills available'));
  } else {
    console.log(chalk.dim(`      ${registry.skills().length} skill(s) in registry`));
  }
}

async function checkGitHub() {
  const { getDefaultRegistryUrl } = await import('../lib/config.js');
  const url = getDefaultRegistryUrl();
  console.log(chalk.dim(`      Registry: ${url}`));
}
