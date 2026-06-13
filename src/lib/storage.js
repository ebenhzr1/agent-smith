import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

export const AGENT_SMITH_DIR = join(homedir(), '.agent-smith');
const SKILLS_DIR = join(AGENT_SMITH_DIR, 'skills');
const CONFIG_FILE = join(AGENT_SMITH_DIR, 'config.json');
const INSTALLED_FILE = join(AGENT_SMITH_DIR, 'installed.json');

export function ensureDir() {
  if (!existsSync(AGENT_SMITH_DIR)) {
    mkdirSync(AGENT_SMITH_DIR, { recursive: true });
  }
  if (!existsSync(SKILLS_DIR)) {
    mkdirSync(SKILLS_DIR, { recursive: true });
  }
}

export function getLocalSkills() {
  ensureDir();
  if (!existsSync(INSTALLED_FILE)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(INSTALLED_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function saveLocalSkills(skills) {
  ensureDir();
  writeFileSync(INSTALLED_FILE, JSON.stringify(skills, null, 2));
}

export function getConfig() {
  ensureDir();
  if (!existsSync(CONFIG_FILE)) {
    const defaultConfig = {
      registry: 'https://raw.githubusercontent.com/valentinovintages/agent-smith-registry/main/registry.json',
      installDir: SKILLS_DIR,
      autoUpdate: false,
    };
    writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
}

export function saveConfig(config) {
  ensureDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}
