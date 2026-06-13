# Agent Smith Skill Format — Specification v1

## Overview

Agent Smith defines a standard format for AI agent skills. Any skill following this format is compatible with any AI agent harness that supports the Agent Smith protocol.

## Directory Structure

```
my-skill/
├── skill.json          # Metadata (required)
├── SKILL.md             # Main instructions (required)
├── src/                 # Source files (optional)
├── docs/                # Documentation (optional)
├── test/                # Tests (optional)
└── .gitignore           # (optional)
```

## skill.json

```json
{
  "name": "my-skill",
  "version": "1.0.0",
  "description": "A short description",
  "author": "Your Name",
  "license": "MIT",
  "tags": ["category1", "category2"],
  "keywords": ["keyword1", "keyword2"],
  "homepage": "https://github.com/you/my-skill",
  "repository": "https://github.com/you/my-skill",
  "agent-smith": {
    "minVersion": "0.1.0",
    "platforms": ["claude", "openai", "gemini", "generic"],
    "category": "engineering",
    "icon": "🔧"
  }
}
```

### Required Fields

| Field | Description |
|-------|-------------|
| `name` | kebab-case unique identifier |
| `version` | Semantic versioning (SemVer) |
| `description` | One-line description |
| `agent-smith.platforms` | Compatible platforms |

## SKILL.md Format

```markdown
# skill-name

## Description
What this skill does and when to use it.

## Platforms
- Claude Code
- OpenAI Codex
- Gemini CLI

## Usage

Invocation condition or trigger.

## Process

### Step 1: Step name
- Action item
- Verification check

### Step 2: Step name
- Action item
- Verification check

## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| Common excuse | Why it's wrong to skip |

## Verification
- [ ] Check 1
- [ ] Check 2
```

## Versioning

Skills follow SemVer (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes to the skill workflow
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, clarifications
