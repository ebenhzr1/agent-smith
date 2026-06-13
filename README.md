<div align="center">
  <img src="https://raw.githubusercontent.com/ebenhzr1/agent-smith/main/docs/agent-smith-banner.svg" alt="Agent Smith Banner" width="700">

  <h1>⚡ Agent Smith</h1>
  <h3><i>"The universal package manager for AI agent skills"</i></h3>

  <p>
    <strong>Install · Search · Publish · Manage</strong> — skills for any AI agent
  </p>

  <p>
    <a href="#quick-start"><strong>Quick Start</strong></a> ·
    <a href="#commands"><strong>Commands</strong></a> ·
    <a href="#install"><strong>Install</strong></a> ·
    <a href="#contributing"><strong>Contribute</strong></a>
  </p>

  <p>
    <a href="https://github.com/ebenhzr1/agent-smith/stargazers"><img src="https://img.shields.io/github/stars/ebenhzr1/agent-smith?style=for-the-badge&logo=github&color=yellow" alt="GitHub stars"></a>
    <a href="https://github.com/ebenhzr1/agent-smith/network/members"><img src="https://img.shields.io/github/forks/ebenhzr1/agent-smith?style=for-the-badge&logo=github&color=blue" alt="GitHub forks"></a>
    <a href="https://github.com/ebenhzr1/agent-smith/issues"><img src="https://img.shields.io/github/issues/ebenhzr1/agent-smith?style=for-the-badge&logo=github&color=red" alt="GitHub issues"></a>
    <a href="https://github.com/ebenhzr1/agent-smith/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ebenhzr1/agent-smith?style=for-the-badge&color=green" alt="License"></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=for-the-badge&logo=node.js" alt="Node">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" alt="PRs Welcome">
    <img src="https://img.shields.io/badge/version-0.1.0-blue?style=for-the-badge" alt="Version">
  </p>
</div>

---

## 🎯 The Problem

Every AI coding agent has skills — workflows, prompts, and tools that make them useful. But installing, managing, and discovering these skills is a **mess**:

**Agent Smith** is the **npm for AI agent skills** — a universal registry and CLI that makes installing, publishing, and discovering skills as easy as `npm install`.

```bash
# 🔴 BEFORE — Agent Smith:
#   ❌ Clone 5 repos manually
#   ❌ Hunt for SKILL.md files
#   ❌ No version management
#   ❌ No dependency tracking

# ✅ AFTER — Agent Smith:
npm install -g @agent-smith/cli
agentsmith install code-reviewer
agentsmith search "web scraping"

## ✨ Features

| Feature | What it does |
|---------|-------------|
| 🔍 **Search** | Find skills by name, description, or tags |
| 📦 **Install** | One-command installation from the registry |
| 🚀 **Publish** | Share your skills with the community |
| 🔄 **Update** | Keep skills up to date with version management |
| 📋 **List** | See all installed skills at a glance |
| 🩺 **Doctor** | Diagnose installation and configuration issues |
| 🏗️ **Init** | Scaffold new skills with the standard format |
| 🔌 **Cross-platform** | Skills work with Claude, GPT, Gemini, and more |

## 🎬 Demo

```bash
# Search for skills
$ agentsmith search "code review"
  🔍  Searching for "code review"...
   1. code-reviewer  v1.0.0  ★
      Five-axis code review with senior engineer standards
      #engineering #code-quality #review
      by agent-smith

# Install a skill
$ agentsmith install code-reviewer
  ✔ Installed code-reviewer@1.0.0

# See what you've got
$ agentsmith list
  📦  Installed Skills (1)
  ┌───────────────┬─────────┬──────────────┬─────────────┐
  │ Name          │ Version │ Category     │ Author      │
  ├───────────────┼─────────┼──────────────┼─────────────┤
  │ code-reviewer │ v1.0.0  │ engineering  │ agent-smith │
  └───────────────┴─────────┴──────────────┴─────────────┘
```

## 🚀 Quick Start

### Install Agent Smith

```bash
npm install -g @agent-smith/cli
```

Verify it works:

```bash
agentsmith --version
agentsmith doctor
```

### Install Your First Skill

```bash
# Search for a skill
agentsmith search "code review"

# Install it
agentsmith install code-reviewer

# See what you've got
agentsmith list
```

### Create and Publish a Skill

```bash
# Scaffold a new skill
agentsmith init my-awesome-skill
cd my-awesome-skill

# Edit skill.json and SKILL.md
# Then publish to the registry
agentsmith publish
```

## 📖 Commands

```bash
Usage: agentsmith <command> [options]

Commands:
  search   <query>        Search for skills in the registry
  install  <skill>        Install a skill
  uninstall <skill>       Remove a skill
  publish  [path]         Publish a skill to the registry
  list                    List installed skills
  info     <skill>        Show skill details
  update                  Update all installed skills
  init     [name]         Scaffold a new skill
  browse                  Open the registry in browser
  doctor                  Diagnose system health

Options:
  -v, --version           Display version
  -h, --help              Display help
```

### Examples

```bash
# Search across categories
agentsmith search "api"
agentsmith search testing
agentsmith search web --tag engineering

# Install specific versions
agentsmith install code-reviewer
agentsmith install test-engineer@1.0.0

# Force reinstall
agentsmith install code-reviewer --force

# Check for updates without installing
agentsmith update --check

# Validate before publishing
agentsmith publish ./my-skill --dry-run

# JSON output for scripting
agentsmith list --json
agentsmith info code-reviewer --json
```

## 🧩 Built-in Skills

Agent Smith ships with 5 starter skills:

| Skill | Versi | Category | Description |
|-------|-------|----------|-------------|
| 🔍 **code-reviewer** | 1.0.0 | Engineering | Five-axis code review with senior engineer standards |
| 🧪 **test-engineer** | 1.0.0 | Engineering | TDD with RED-GREEN-REFACTOR discipline |
| 🕸️ **web-scraper** | 1.0.0 | Automation | Web scraping with anti-blocking best practices |
| 🔌 **api-designer** | 1.0.0 | Engineering | Contract-first REST API design |
| ✍️ **content-writer** | 1.0.0 | Marketing | SEO-optimized content writing workflows |

## 📦 Skill Format

Every Agent Smith skill follows a standard format:

```
my-skill/
├── skill.json          # Metadata (name, version, tags, etc.)
├── SKILL.md             # Main instructions (process, verification)
├── src/                 # Source files (optional)
└── test/                # Tests (optional)
```

See the [full spec](spec/SPEC.md) for details.

## 🤔 Why Agent Smith?

| Problem | Solution |
|---------|----------|
| Skills are scattered across GitHub repos | **Central registry** with search |
| No version management | **SemVer** support for every skill |
| Manual installation | **One-command CLI** |
| Incompatible formats | **Standard spec** everyone can adopt |
| No dependency tracking | **Dependency resolution** (coming soon) |

## 🔌 Cross-Platform

Agent Smith skills work with any AI agent:

| Platform | Status |
|----------|--------|
| **Claude Code** | ✅ Supported |
| **OpenAI Codex** | ✅ Supported |
| **Gemini CLI** | ✅ Supported |
| **Cursor** | ✅ Supported |
| **Generic AI Agents** | ✅ Supported |

## 🗺️ Roadmap

- **v0.2** — Remote registry (GitHub-based)
- **v0.3** — UI Dashboard (web interface)
- **v0.4** — Skill dependencies & auto-resolution
- **v0.5** — Community ratings & trending
- **v1.0** — Stable API & plugin ecosystem
- **v2.0** — Multi-agent orchestration

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](docs/GETTING_STARTED.md) | Installation & first steps |
| [Architecture](docs/ARCHITECTURE.md) | Code structure & data flow |
| [Security Model](SECURITY.md) | Sandbox, validation & error handling |
| [Skill Format Spec](spec/SPEC.md) | Standard skill format |
| [API Reference](docs/GETTING_STARTED.md) | All commands & options |

## 🛡️ Security

Agent Smith has a built-in security sandbox that:
- Prevents **path traversal attacks** (`../../etc/passwd`)
- Validates **skill names** (safe characters only)
- Validates **versions** (strict SemVer)
- Logs all operations for **audit trail**
- Replaces `process.exit()` with **proper error handling**

Details: [SECURITY.md](SECURITY.md)

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

Before committing, tests are automatically run via **pre-commit hooks** (Husky).

- **Found a bug?** [Open an issue](https://github.com/ebenhzr1/agent-smith/issues)
- **Have an idea?** [Start a discussion](https://github.com/ebenhzr1/agent-smith/discussions)
- **Want to contribute a skill?** [Submit a PR](https://github.com/ebenhzr1/agent-smith/pulls)

## 📄 License

[MIT](LICENSE) © 2026 [Eben Haezer](https://github.com/ebenhzr1)

---

<div align="center">
  <p>Built with ❤️ for the AI agent community</p>
  <p>
    <a href="https://github.com/ebenhzr1/agent-smith">GitHub</a> ·
    <a href="https://github.com/ebenhzr1/agent-smith/issues">Issues</a> ·
    <a href="https://github.com/ebenhzr1/agent-smith/discussions">Discussions</a> ·
    <a href="https://www.linkedin.com/in/ebenhzrvlt/">LinkedIn</a>
  </p>
  <p>
    <sub>Created by <a href="https://www.linkedin.com/in/ebenhzrvlt/">Eben Haezer</a></sub>
  </p>
</div>

