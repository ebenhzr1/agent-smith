# Getting Started with Agent Smith

## Installation

### Global Installation (Recommended)

```bash
npm install -g @agent-smith/cli
```

Verify the installation:

```bash
agentsmith --version
agentsmith doctor
```

### Local Installation

```bash
npm install @agent-smith/cli
npx agentsmith --version
```

## Your First Skill

### Install a Built-in Skill

```bash
# Search for skills
agentsmith search "code review"

# Install the code-reviewer skill
agentsmith install code-reviewer

# Verify installation
agentsmith list
agentsmith info code-reviewer
```

### Create Your Own Skill

```bash
# Initialize a new skill
agentsmith init my-first-skill
cd my-first-skill

# Edit skill.json to add metadata
# Edit SKILL.md to add instructions

# Test locally
agentsmith install ./

# Publish to registry (coming soon)
agentsmith publish --dry-run
```

## Configuration

Agent Smith stores configuration in `~/.agent-smith/`:

```
~/.agent-smith/
├── config.json       # User configuration
├── installed.json    # List of installed skills
└── skills/           # Installed skills directory
```

You can customize the registry URL:

```bash
# Coming in v0.2
agentsmith config set registry https://custom-registry.com
```

## Platform Integration

### Claude Code

Skills installed via Agent Smith are automatically available in Claude Code.

### OpenAI Codex

Point Codex to your skills directory:

```bash
codex config set skills-dir ~/.agent-smith/skills
```

### Generic Agents

Skills follow a standard format that any agent can read. Just point your agent to `~/.agent-smith/skills/<skill-name>/SKILL.md`.

## Troubleshooting

### Command not found

Make sure `npm` global bin directory is in your PATH:

```bash
npm config get prefix
# Add <prefix>/bin to your PATH
```

### Permission errors

On Linux/macOS, you might need to fix npm permissions:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Skills not showing up

Run the doctor command:

```bash
agentsmith doctor
```

## Next Steps

- [Browse available skills](https://github.com/valentinovintages/agent-smith-registry)
- [Create your own skill](../spec/SPEC.md)
- [Contribute](../CONTRIBUTING.md)
