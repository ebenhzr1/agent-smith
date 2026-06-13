# Agent Smith Architecture

## Overview

Agent Smith is a CLI tool built with Node.js (ESM). It provides a package manager experience for AI agent skills.

```
┌─────────────────┐
│   CLI (Commander) │
│  bin/agentsmith.js │
└────────┬─────────┘
         │ dispatches commands
    ┌────▼────┐
    │ Commands │
    │ src/commands/ │
    └────┬────┘
         │ uses services
    ┌────▼────┐
    │   Lib   │
    │ src/lib/ │
    └────┬────┘
         │ uses utilities
    ┌────▼────┐
    │  Utils  │
    │ src/utils/ │
    └─────────┘
```

## Directory Structure

```
agent-smith/
├── bin/agentsmith.js      ← Entry point (Commander CLI)
├── src/
│   ├── commands/          ← Command handlers (10 files)
│   │   ├── search.js      ← agentsmith search
│   │   ├── install.js     ← agentsmith install
│   │   ├── uninstall.js   ← agentsmith uninstall
│   │   ├── publish.js     ← agentsmith publish
│   │   ├── list.js        ← agentsmith list
│   │   ├── info.js        ← agentsmith info
│   │   ├── update.js      ← agentsmith update
│   │   ├── init.js        ← agentsmith init
│   │   ├── browse.js      ← agentsmith browse
│   │   └── doctor.js      ← agentsmith doctor
│   ├── lib/               ← Core libraries
│   │   ├── registry.js    ← Registry client (remote + cache + built-in)
│   │   ├── installer.js   ← Skill installation (copies files)
│   │   ├── storage.js     ← Local state management
│   │   └── config.js      ← Configuration
│   └── utils/             ← Utilities
│       ├── sandbox.js     ← Security validation
│       ├── logger.js      ← Structured logging
│       └── errors.js      ← Error classes & errorHandler
├── built-in-skills/       ← 5 starter skills
├── spec/SPEC.md           ← Skill format specification
├── test/                  ← Unit tests
└── docs/                  ← Documentation
```

## Data Flow

### Installing a Skill
```
User → agentsmith install code-reviewer
  → install.js (validates input)
    → registry.js (finds skill)
      → installer.js (copies files to ~/.agent-smith/skills/)
        → storage.js (updates installed.json)
```

### Searching for Skills
```
User → agentsmith search "testing"
  → search.js
    → registry.js (tries remote → cache → built-in)
      → displays results
```

### Publishing a Skill
```
User → agentsmith publish ./my-skill
  → publish.js (validates skill.json + SKILL.md)
    → saves to ~/.agent-smith/published/
```

## Security Layers

1. **User Input** → `sanitizeInput()` removes control chars
2. **Skill Names** → `validateSkillName()` blocks path traversal
3. **File Paths** → `safePath()` ensures sandbox boundaries
4. **Versions** → `validateVersion()` requires strict SemVer
5. **Error Handler** → `errorHandler()` catches & logs all errors
