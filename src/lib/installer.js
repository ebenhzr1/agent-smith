import { join } from 'path';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { AGENT_SMITH_DIR, getLocalSkills, saveLocalSkills } from './storage.js';

export async function installSkill(skill, options = {}) {
  const skillDir = join(AGENT_SMITH_DIR, 'skills', skill.name);

  // Create directory
  if (!existsSync(skillDir)) {
    mkdirSync(skillDir, { recursive: true });
  }

  // Write skill.json
  const skillJson = {
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

  writeFileSync(join(skillDir, 'skill.json'), JSON.stringify(skillJson, null, 2));

  // Write SKILL.md (placeholder for MVP)
  const skillMd = `# ${skill.name}

${skill.description}

## Usage

This skill is installed. Full documentation coming soon.

## Repository

${skill.repository || 'Not specified'}
`;

  writeFileSync(join(skillDir, 'SKILL.md'), skillMd);

  // Update installed list
  const localSkills = getLocalSkills();
  const existingIdx = localSkills.findIndex(s => s.name === skill.name);

  const installedSkill = {
    name: skill.name,
    version: skill.version,
    installedAt: new Date().toISOString(),
    path: skillDir,
    category: skill['agent-smith']?.category,
    author: skill.author,
  };

  if (existingIdx >= 0) {
    localSkills[existingIdx] = installedSkill;
  } else {
    localSkills.push(installedSkill);
  }

  saveLocalSkills(localSkills);

  return installedSkill;
}
