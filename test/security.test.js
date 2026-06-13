import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('Security — Sandbox', () => {
  // Dynamic import to avoid early ESM issues in test runner
  let sandbox;
  before(async () => {
    sandbox = await import('../src/utils/sandbox.js');
  });

  it('should reject empty skill name', () => {
    const result = sandbox.validateSkillName('');
    assert.strictEqual(result.valid, false);
  });

  it('should reject null skill name', () => {
    const result = sandbox.validateSkillName(null);
    assert.strictEqual(result.valid, false);
  });

  it('should reject path traversal in name', () => {
    const result = sandbox.validateSkillName('../../etc/passwd');
    assert.strictEqual(result.valid, false);
  });

  it('should reject name with spaces', () => {
    const result = sandbox.validateSkillName('my skill');
    assert.strictEqual(result.valid, false);
  });

  it('should reject name starting with number', () => {
    const result = sandbox.validateSkillName('123skill');
    assert.strictEqual(result.valid, false);
  });

  it('should accept valid kebab-case name', () => {
    const result = sandbox.validateSkillName('my-awesome-skill');
    assert.strictEqual(result.valid, true);
  });

  it('should accept name with underscores', () => {
    const result = sandbox.validateSkillName('my_skill_v2');
    assert.strictEqual(result.valid, true);
  });

  it('should reject name with special chars', () => {
    const result = sandbox.validateSkillName('skill@#$%');
    assert.strictEqual(result.valid, false);
  });

  it('should reject name longer than 64 chars', () => {
    const longName = 'a'.repeat(65);
    const result = sandbox.validateSkillName(longName);
    assert.strictEqual(result.valid, false);
  });

  it('should sanitize control characters from input', () => {
    const result = sandbox.sanitizeInput('hello\x00world\n');
    assert.strictEqual(result, 'helloworld');
  });

  it('should trim whitespace from input', () => {
    const result = sandbox.sanitizeInput('  skill-name  ');
    assert.strictEqual(result, 'skill-name');
  });

  it('should truncate long input', () => {
    const long = 'a'.repeat(300);
    const result = sandbox.sanitizeInput(long);
    assert.ok(result.length <= 256);
  });

  it('should reject invalid version formats', () => {
    assert.strictEqual(sandbox.validateVersion('1.0'), false);
    assert.strictEqual(sandbox.validateVersion('v1.0.0'), false);
    assert.strictEqual(sandbox.validateVersion('1.0.0-beta'), false);
    assert.strictEqual(sandbox.validateVersion('abc'), false);
    assert.strictEqual(sandbox.validateVersion(''), false);
    assert.strictEqual(sandbox.validateVersion(null), false);
  });

  it('should accept valid semantic versions', () => {
    assert.strictEqual(sandbox.validateVersion('1.0.0'), true);
    assert.strictEqual(sandbox.validateVersion('0.0.1'), true);
    assert.strictEqual(sandbox.validateVersion('999.999.999'), true);
  });
});

describe('Security — Logger', () => {
  it('should export expected functions', async () => {
    const log = await import('../src/utils/logger.js');
    assert.ok(typeof log.default.info === 'function');
    assert.ok(typeof log.default.warn === 'function');
    assert.ok(typeof log.default.error === 'function');
    assert.ok(typeof log.default.getLogFile === 'function');
  });
});

describe('Security — Errors', () => {
  it('should create typed errors', async () => {
    const errors = await import('../src/utils/errors.js');

    const notFound = new errors.SkillNotFoundError('test-skill');
    assert.strictEqual(notFound.code, 'SKILL_NOT_FOUND');
    assert.ok(notFound.message.includes('test-skill'));

    const security = new errors.SecurityError('dangerous input');
    assert.strictEqual(security.code, 'SECURITY_ERROR');

    const validation = new errors.SkillValidationError('bad format');
    assert.strictEqual(validation.code, 'SKILL_VALIDATION_ERROR');

    const registry = new errors.RegistryError('connection failed');
    assert.strictEqual(registry.code, 'REGISTRY_ERROR');
  });
});
