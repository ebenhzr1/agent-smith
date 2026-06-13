/**
 * Agent Smith — Error Handling System
 *
 * Custom error classes that propagate properly instead of calling process.exit().
 * Each error has a code, message, and optional metadata for logging.
 */

import chalk from 'chalk';
import log from './logger.js';

// ─── Custom Error Classes ─────────────────────────────────────────

/**
 * Base application error. All custom errors extend this.
 */
export class AgentSmithError extends Error {
  constructor(code, message, meta = {}) {
    super(message);
    this.name = 'AgentSmithError';
    this.code = code;
    this.meta = meta;

    // Capture stack trace without this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Skill not found in registry.
 */
export class SkillNotFoundError extends AgentSmithError {
  constructor(skillName) {
    super('SKILL_NOT_FOUND', `Skill "${skillName}" not found in registry`, { skillName });
    this.name = 'SkillNotFoundError';
  }
}

/**
 * Skill already installed.
 */
export class SkillAlreadyInstalledError extends AgentSmithError {
  constructor(skillName, version) {
    super('SKILL_ALREADY_INSTALLED', `Skill "${skillName}" is already installed (v${version})`, { skillName, version });
    this.name = 'SkillAlreadyInstalledError';
  }
}

/**
 * Invalid skill format / validation error.
 */
export class SkillValidationError extends AgentSmithError {
  constructor(reason, meta = {}) {
    super('SKILL_VALIDATION_ERROR', `Skill validation failed: ${reason}`, meta);
    this.name = 'SkillValidationError';
  }
}

/**
 * Security violation (path traversal, dangerous input, etc.).
 */
export class SecurityError extends AgentSmithError {
  constructor(reason, meta = {}) {
    super('SECURITY_ERROR', `Security check failed: ${reason}`, meta);
    this.name = 'SecurityError';
  }
}

/**
 * Registry connection / fetch error.
 */
export class RegistryError extends AgentSmithError {
  constructor(message, meta = {}) {
    super('REGISTRY_ERROR', message, meta);
    this.name = 'RegistryError';
  }
}

// ─── Error Handler ─────────────────────────────────────────────────

/**
 * Wrapper for command handlers that catches errors and logs them.
 * Replaces process.exit(1) patterns.
 *
 * Usage:
 *   export default async function handler(...args) {
 *     return await errorHandler('command-name', async () => {
 *       // ... your code
 *     });
 *   }
 */
export async function errorHandler(commandName, fn) {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AgentSmithError) {
      log.error(`${commandName}: ${err.message}`, err.meta);
      console.error(chalk.red(`\n  ✗  ${err.message}\n`));

      // Show hint for common errors
      if (err instanceof SkillNotFoundError) {
        console.log(chalk.dim('  💡  Try: agentsmith search <query>'));
      }
    } else {
      // Unknown/unexpected errors
      log.error(`Unexpected error in ${commandName}`, {
        error: err.message,
        stack: err.stack,
      });
      console.error(chalk.red(`\n  ✗  Unexpected error: ${err.message}\n`));
      console.error(chalk.dim(`  ${err.stack?.split('\n').slice(0, 3).join('\n  ')}\n`));
    }

    // Return error instead of killing process
    return { error: true, code: err.code || 'UNKNOWN_ERROR', message: err.message };
  }
}
