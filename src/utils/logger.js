/**
 * Agent Smith — Structured Logging System
 *
 * Provides consistent logging with levels, ISO timestamps, and file output.
 * Levels: DEBUG < INFO < WARN < ERROR
 *
 * Logs are written to ~/.agent-smith/logs/agent-smith-YYYY-MM-DD.log
 * NOT printed to console (to avoid cluttering CLI output).
 *
 * Usage:
 *   import log from '../utils/logger.js';
 *   log.info('Installing skill...', { skill: 'code-reviewer' });
 *   log.error('Installation failed', { error: err.message });
 */

import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const LOG_DIR = join(homedir(), '.agent-smith', 'logs');
const LOG_FILE = join(LOG_DIR, `agent-smith-${new Date().toISOString().slice(0, 10)}.log`);

const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

let currentLevel = LEVELS.INFO;

// Ensure log directory exists at module load
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

function timestamp() {
  return new Date().toISOString();
}

function formatMessage(level, message, meta = {}) {
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp()}] [${level}] ${message}${metaStr}`;
}

function writeLog(level, message, meta = {}) {
  if (LEVELS[level] < currentLevel) return;
  const logLine = formatMessage(level, message, meta);
  try {
    appendFileSync(LOG_FILE, logLine + '\n');
  } catch {
    // Silently fail if log file can't be written
  }
}

const log = {
  debug: (msg, meta) => writeLog('DEBUG', msg, meta),
  info: (msg, meta) => writeLog('INFO', msg, meta),
  warn: (msg, meta) => writeLog('WARN', msg, meta),
  error: (msg, meta) => writeLog('ERROR', msg, meta),

  setLevel: (level) => {
    if (LEVELS[level] !== undefined) currentLevel = LEVELS[level];
  },

  getLogFile: () => LOG_FILE,
};

export default log;
