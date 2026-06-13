# Agent Smith Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-13

### 🎉 Initial Release

The first public release of Agent Smith — the universal package manager for AI agent skills.

### Added
- ✨ Core CLI with 10 commands (`search`, `install`, `publish`, `list`, `info`, `update`, `init`, `browse`, `doctor`, `uninstall`)
- 📦 5 built-in skills: code-reviewer, test-engineer, web-scraper, api-designer, content-writer
- 📋 Standard skill format specification (skill.json + SKILL.md)
- 🔍 Local registry with search functionality
- 📝 Comprehensive documentation
- 🧪 Cross-platform support (Claude, OpenAI, Gemini, generic agents)

### Features
- **Search**: Find skills by name, description, or tags
- **Install**: One-command installation with version support
- **Publish**: Validate and publish skills (local MVP)
- **Version Management**: SemVer support for all skills
- **Health Check**: `doctor` command for diagnostics

### Documentation
- README with quick start guide
- Contributing guidelines
- Skill format specification
- Getting started guide
- 5 example skills with full documentation

### Known Limitations (MVP)
- Registry is local-only (GitHub registry coming in v0.2)
- No remote skill fetching yet
- No dependency resolution (coming in v0.4)
- No web dashboard (coming in v0.3)

## [Unreleased]

### Planned for v0.2
- 🌐 Remote GitHub-based registry
- 🔄 Automatic skill fetching from GitHub
- 📊 Community skill statistics

### Planned for v0.3
- 🎨 Web UI dashboard
- ⭐ Skill ratings and reviews
- 📈 Trending skills

### Planned for v0.4
- 🔗 Skill dependency management
- 🤖 Auto-resolve dependencies

---

## Version History

- **v0.1.0** (2026-06-13) — Initial release
