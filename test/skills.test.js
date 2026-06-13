import { describe, it } from 'node:test';
import assert from 'node:assert';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Registry Tests ────────────────────────────────────────────────

describe('Registry', () => {
  it('should have 5 built-in skills', async () => {
    const { getRegistry } = await import('../src/lib/registry.js');
    const registry = await getRegistry();
    assert.strictEqual(registry.skills().length, 5);
  });

  it('should find a skill by name', async () => {
    const { getRegistry } = await import('../src/lib/registry.js');
    const registry = await getRegistry();
    const skill = registry.find('code-reviewer');
    assert.ok(skill);
    assert.strictEqual(skill.name, 'code-reviewer');
  });

  it('should return undefined for unknown skill', async () => {
    const { getRegistry } = await import('../src/lib/registry.js');
    const registry = await getRegistry();
    const skill = registry.find('non-existent-skill-xyz');
    assert.strictEqual(skill, undefined);
  });

  it('should search by query', async () => {
    const { getRegistry } = await import('../src/lib/registry.js');
    const registry = await getRegistry();
    const results = registry.search('code');
    assert.ok(results.length >= 1);
    assert.ok(results.some(s => s.name.includes('code')));
  });

  it('should search by tag', async () => {
    const { getRegistry } = await import('../src/lib/registry.js');
    const registry = await getRegistry();
    const results = registry.search('', 'engineering');
    assert.ok(results.length >= 1);
  });

  it('should return empty for non-matching query', async () => {
    const { getRegistry } = await import('../src/lib/registry.js');
    const registry = await getRegistry();
    const results = registry.search('zzzznotexistsasdkjfhasd');
    assert.strictEqual(results.length, 0);
  });
});

// ─── Storage Tests ─────────────────────────────────────────────────

describe('Storage', () => {
  it('should handle empty installed list', async () => {
    const { getLocalSkills } = await import('../src/lib/storage.js');
    const skills = getLocalSkills();
    assert.ok(Array.isArray(skills));
  });

  it('should get config', async () => {
    const { getConfig } = await import('../src/lib/storage.js');
    const config = getConfig();
    assert.ok(config);
    assert.ok(config.registry);
  });
});

// ─── Built-in Skills Validation ────────────────────────────────────

describe('Built-in skills validation', () => {
  const skillsDir = join(__dirname, '..', 'built-in-skills');

  it('code-reviewer should have valid skill.json', () => {
    const skillPath = join(skillsDir, 'code-reviewer', 'skill.json');
    assert.ok(existsSync(skillPath), 'skill.json should exist');

    const skill = JSON.parse(readFileSync(skillPath, 'utf-8'));
    assert.ok(skill.name);
    assert.strictEqual(skill.name, 'code-reviewer');
    assert.ok(skill.version);
    assert.ok(skill.description);
  });

  it('all skills should have SKILL.md', () => {
    const dirs = readdirSync(skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    assert.ok(dirs.length >= 5, 'Should have at least 5 skills');

    for (const dir of dirs) {
      const skillMdPath = join(skillsDir, dir, 'SKILL.md');
      assert.ok(existsSync(skillMdPath), `${dir}/SKILL.md should exist`);
    }
  });

  it('all skills should follow semver', () => {
    const dirs = readdirSync(skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    const semverRegex = /^\d+\.\d+\.\d+$/;
    for (const dir of dirs) {
      const skillJson = join(skillsDir, dir, 'skill.json');
      const skill = JSON.parse(readFileSync(skillJson, 'utf-8'));
      assert.ok(semverRegex.test(skill.version), `${dir} version should be semver format`);
    }
  });

  it('all skills should have required fields', () => {
    const dirs = readdirSync(skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const dir of dirs) {
      const skillJson = join(skillsDir, dir, 'skill.json');
      const skill = JSON.parse(readFileSync(skillJson, 'utf-8'));

      assert.ok(skill.name, `${dir} should have name`);
      assert.ok(skill.version, `${dir} should have version`);
      assert.ok(skill.description, `${dir} should have description`);
      assert.ok(skill.author, `${dir} should have author`);
      assert.ok(skill.license, `${dir} should have license`);
      assert.ok(Array.isArray(skill.tags), `${dir} tags should be array`);
      assert.ok(skill['agent-smith'], `${dir} should have agent-smith config`);
      assert.ok(Array.isArray(skill['agent-smith'].platforms), `${dir} platforms should be array`);
    }
  });
});
