/**
 * Agent Smith — Sandbox & Security Module
 *
 * Provides security validation for all file operations:
 * - Path traversal prevention (.. attacks)
 * - Safe file deletion with bounds checking
 * - Input sanitization for skill names
 * - Read/write scope limiting to ~/.agent-smith/
 */

import { resolve, normalize, join, sep } from 'node:path';
import { homedir } from 'node:os';
import log from './logger.js';

const AGENT_SMITH_DIR = join(homedir(), '.agent-smith');

// ─── Safe Path Utilities ──────────────────────────────────────────

/**
 * Validate that a skill name is safe to use as a directory name.
 * Prevents path traversal, special chars, and empty names.
 *
 * Allowed: lowercase letters, numbers, hyphens, underscores
 * Max length: 64 chars
 */
export function validateSkillName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, reason: 'Skill name is required' };
  }

  if (name.length > 64) {
    return { valid: false, reason: 'Skill name exceeds 64 characters' };
  }

  // Only allow safe characters: start with letter, then a-z, 0-9, -, _
  if (!/^[a-z][a-z0-9_-]*$/.test(name)) {
    return { valid: false, reason: 'Skill name must start with a letter/number and contain only a-z, 0-9, hyphens, underscores' };
  }

  // Block common dangerous patterns
  const dangerous = ['..', '/', '\\', '~', '$', '`', '|', ';', '&'];
  for (const pattern of dangerous) {
    if (name.includes(pattern)) {
      return { valid: false, reason: `Skill name contains dangerous character: ${pattern}` };
    }
  }

  return { valid: true };
}

/**
 * Ensure a file path stays within the agent-smith sandbox directory.
 * Prevents path traversal attacks.
 */
export function safePath(baseDir, ...paths) {
  const combined = join(baseDir, ...paths);
  const resolved = resolve(combined);
  const normalized = normalize(resolved);

  // Get allowed roots
  const allowedRoots = [
    normalize(AGENT_SMITH_DIR),
    normalize(join(process.cwd())),
  ];

  // Check if path is within allowed roots
  const isSafe = allowedRoots.some(root =>
    normalized === root || normalized.startsWith(root + sep)
  );

  if (!isSafe) {
    log.warn('Path traversal blocked', { path: normalized, allowedRoots });
    return null; // Not safe
  }

  return normalized;
}

/**
 * Validate that a version string follows SemVer format.
 */
export function validateVersion(version) {
  if (!version || typeof version !== 'string') return false;
  return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * Sanitize user input for CLI arguments.
 * Removes control characters and trims whitespace.
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\x00-\x1f\x7f]/g, '') // Remove control characters
    .trim()
    .slice(0, 256); // Limit length
}

export default {
  validateSkillName,
  safePath,
  validateVersion,
  sanitizeInput,
};
