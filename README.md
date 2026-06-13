<div align="center">
  <img src="https://raw.githubusercontent.com/valentinovintages/agent-smith/main/docs/agent-smith-banner.svg" alt="Agent Smith Banner" width="700">

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
    <img src="https://img.shields.io/github/stars/valentinovintages/agent-smith?style=flat&logo=github" alt="Stars">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
    <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="Node">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome">
  </p>
</div>

---

## 🎯 The Problem

Every AI coding agent has skills — workflows, prompts, and tools that make them useful. But installing, managing, and discovering these skills is a **mess**:

```bash
# 😫 Current reality:
# Clone 5 different repos
# Find the right SKILL.md manually
# Copy files to the right directory
# No version management
# No dependency checking
# No search or discovery

# ✨ Agent Smith:
agentsmith install code-reviewer
agentsmith install test-engineer@1.0.0
agentsmith search "web scraping"
```

**Agent Smith** is the **npm for AI agent skills** — a universal registry and CLI that makes installing, publishing, and discovering skills as easy as `npm install`.

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

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

- **Found a bug?** [Open an issue](https://github.com/valentinovintages/agent-smith/issues)
- **Have an idea?** [Start a discussion](https://github.com/valentinovintages/agent-smith/discussions)
- **Want to contribute a skill?** [Submit a PR](https://github.com/valentinovintages/agent-smith/pulls)

## 📄 License

MIT © [Valentino Vintages](https://github.com/valentinovintages)

---

<div align="center">
  <p>Built with ❤️ for the AI agent community</p>
  <p>
    <a href="https://github.com/valentinovintages/agent-smith">GitHub</a> ·
    <a href="https://github.com/valentinovintages/agent-smith/issues">Issues</a> ·
    <a href="https://github.com/valentinovintages/agent-smith/discussions">Discussions</a>
  </p>
</div>

