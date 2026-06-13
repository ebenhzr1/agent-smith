import chalk from 'chalk';

export default async function browseHandler(options = {}) {
  const registryUrl = 'https://github.com/valentinovintages/agent-smith-registry';

  console.log(chalk.bold('\n  🏪  Agent Smith Registry\n'));
  console.log(chalk.dim(`  Browse all available skills at:\n`));
  console.log(chalk.cyan(`  ${registryUrl}\n`));
  console.log(chalk.dim('  Or use:'));
  console.log(chalk.dim('    agentsmith search <query>    Search for skills'));
  console.log(chalk.dim('    agentsmith trending           See trending skills\n'));

  if (options.open) {
    const { execSync } = await import('child_process');
    try {
      execSync(`open "${registryUrl}" || xdg-open "${registryUrl}"`);
      console.log(chalk.green('  ✓ Opened registry in browser\n'));
    } catch {
      console.log(chalk.yellow('  Could not open browser. Visit the URL manually.\n'));
    }
  }
}
