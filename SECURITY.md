# Agent Smith Security Model

Agent Smith takes security seriously. This document outlines how we protect users and their systems.

## Sandbox Architecture

All file operations are scoped to two directories:

```
~/.agent-smith/          ← Skill storage & config (sandbox root)
<project-directory>/     ← Current working directory
```

### Path Traversal Protection

Every file operation passes through `safePath()` which:

1. Resolves the full absolute path
2. Normalizes it (removes `..`, `.`, symlinks)
3. Checks it starts with an allowed root

If a path tries to escape the sandbox (e.g., `../../../etc/passwd`), the operation is **blocked and logged**.

### Input Validation

All user-supplied input is sanitized before use:

| Input | Validation | Rule |
|-------|-----------|------|
| Skill names | `validateSkillName()` | a-z, 0-9, hyphens, underscores only |
| Versions | `validateVersion()` | Strict SemVer (`MAJOR.MINOR.PATCH`) |
| CLI arguments | `sanitizeInput()` | Control chars removed, max 256 chars |

## Error Handling

### No `process.exit()` in Production Code

All commands use the `errorHandler()` wrapper which:

1. Catches all errors
2. Logs them with full context
3. Shows user-friendly error messages
4. Returns cleanly (never kills the process)

### Error Classification

```
AgentSmithError
├── SkillNotFoundError       — Skill not in registry
├── SkillAlreadyInstalledError — Already installed
├── SkillValidationError     — Invalid skill.json format
├── SecurityError            — Path traversal, dangerous input
└── RegistryError            — Registry fetch failed
```

### Error Codes

| Code | Meaning |
|------|---------|
| `SKILL_NOT_FOUND` | The requested skill doesn't exist in registry |
| `SKILL_ALREADY_INSTALLED` | Skill is already installed (use --force) |
| `SKILL_VALIDATION_ERROR` | Skill.json has missing/invalid fields |
| `SECURITY_ERROR` | Potential attack detected (path traversal, etc.) |
| `REGISTRY_ERROR` | Cannot connect to remote registry |
| `UNKNOWN_ERROR` | Unexpected error (check logs) |

## Logging

All operations are logged to:
```
~/.agent-smith/logs/agent-smith-YYYY-MM-DD.log
```

Log levels:
- **ERROR** — Operation failed
- **WARN** — Degraded behavior (e.g., offline mode)
- **INFO** — Normal operations (install, uninstall, publish)
- **DEBUG** — Detailed diagnostics

## Secure Defaults

1. **Install scope**: Skills can only write to `~/.agent-smith/skills/`
2. **Uninstall safety**: Validates skill name before deletion
3. **No arbitrary file access**: All reads/writes through `safePath()`
4. **Registry fetch timeout**: 5 seconds max (prevents hanging)
5. **No telemetry**: Agent Smith does not collect usage data

## Reporting Vulnerabilities

If you find a security issue, please report it by:
1. Opening a [confidential issue](https://github.com/ebenhzr1/agent-smith/security/advisories)
2. Or emailing via GitHub Issues

Do NOT open a public issue for security vulnerabilities.

## Responsible Disclosure

We follow a 90-day disclosure deadline. Researchers who report valid issues will be credited in our security acknowledgments.

---

*This security model is continuously improved. Last updated: 2026-06-13*
