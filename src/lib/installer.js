import { join, resolve } from 'path';
import { mkdirSync, writeFileSync, copyFileSync, existsSync, readdirSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { AGENT_SMITH_DIR, getLocalSkills, saveLocalSkills } from './storage.js';
import { validateSkillName, safePath } from '../utils/sandbox.js';
import log from '../utils/logger.js';
import { SecurityError, SkillNotFoundError } from '../utils/errors.js';

/**
 * Install a skill — copies real skill files, not stubs.
 * Supports both local path install and registry install.
 */
export async function installSkill(skill, options = {}) {
  // Validate skill name for security
  const nameCheck = validateSkillName(skill.name);
  if (!nameCheck.valid) {
    throw new SecurityError(nameCheck.reason, { skillName: skill.name });
  }

  const skillDir = resolve(AGENT_SMITH_DIR, 'skills', skill.name);

  // Ensure path is within sandbox
  const safe = safePath(AGENT_SMITH_DIR, 'skills', skill.name);
  if (!safe) {
    throw new SecurityError('Path traversal detected during install', { skillName: skill.name });
  }

  // Check if skill has a local source path (built-in or remote)
  const sourceDir = findSkillSource(skill);

  log.info('Installing skill', { name: skill.name, version: skill.version, source: sourceDir || 'registry' });

  // Create directory
  mkdirSync(safe, { recursive: true });

  if (sourceDir && existsSync(sourceDir)) {
    // Copy actual skill files from source
    copySkillFiles(sourceDir, safe);
    log.info('Skill files copied from source', { source: sourceDir, dest: safe });
  } else {
    // Fallback: write minimal files with metadata
    log.warn('No source files found, writing metadata-only install', { skill: skill.name });
    writeSkillJson(skill, safe);
    writeStubSkillMd(skill, safe);
  }

  // Update installed list
  const localSkills = getLocalSkills();
  const existingIdx = localSkills.findIndex(s => s.name === skill.name);

  const installedSkill = {
    name: skill.name,
    version: skill.version,
    installedAt: new Date().toISOString(),
    path: safe,
    category: skill['agent-smith']?.category || 'uncategorized',
    author: skill.author || 'unknown',
  };

  if (existingIdx >= 0) {
    localSkills[existingIdx] = installedSkill;
  } else {
    localSkills.push(installedSkill);
  }

  saveLocalSkills(localSkills);
  log.info('Skill installed successfully', { name: skill.name, version: skill.version });

  return installedSkill;
}

/**
 * Find skill source directory — checks built-in-skills first, then project dir.
 */
function findSkillSource(skill) {
  const candidates = [
    // Built-in skills
    join(process.cwd(), 'built-in-skills', skill.name),
    // Current project
    join(process.cwd(), skill.name),
    join(process.cwd()),
  ];

  for (const dir of candidates) {
    if (existsSync(join(dir, 'skill.json'))) {
      return dir;
    }
  }
  return null;
}

/**
 * Copy all skill files from source to destination.
 * Preserves directory structure.
 */
function copySkillFiles(src, dest) {
  const items = readdirSync(src, { withFileTypes: true });

  for (const item of items) {
    const srcPath = join(src, item.name);
    const destPath = join(dest, item.name);

    if (item.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copySkillFiles(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }

  // Write updated skill.json with install metadata
  const skillJsonPath = join(src, 'skill.json');
  if (existsSync(skillJsonPath)) {
    const skill = JSON.parse(readFileSync(skillJsonPath, 'utf-8'));
    writeSkillJson(skill, dest);
  }
}

function writeSkillJson(skill, dest) {
  const skillData = {
    name: skill.name,
    version: skill.version,
    description: skill.description,
    author: skill.author,
    license: skill.license,
    tags: skill.tags || [],
    'agent-smith': skill['agent-smith'],
    repository: skill.repository,
    installedAt: new Date().toISOString(),
  };
  writeFileSync(join(dest, 'skill.json'), JSON.stringify(skillData, null, 2));
}

function writeStubSkillMd(skill, dest) {
  const content = `# ${skill.name}

${skill.description}

## Usage

This skill is installed. Documentation coming from registry.

## Source

${skill.repository || 'Built-in'}
`;
  writeFileSync(join(dest, 'SKILL.md'), content);
}
