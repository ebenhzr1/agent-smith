# Contributing to Agent Smith

We love contributions! Here's how to help.

## Getting Started

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Install dependencies: `npm install`
4. Make your changes
5. Test: `npm test`
6. Submit a PR

## Adding a New Skill

1. Create a new directory under `built-in-skills/`
2. Include `skill.json` and `SKILL.md` following the spec
3. Run `agentsmith doctor` to validate
4. Submit a PR

## Adding a New Command

1. Create a new file in `src/commands/`
2. Register it in `bin/agentsmith.js`
3. Add tests in `test/`

## Code Style

- Use ES modules (`import`/`export`)
- Keep functions small and focused
- Add JSDoc comments for exported functions
- Include error handling

## PR Guidelines

- Keep PRs focused on one change
- Write clear commit messages
- Include tests for new functionality
- Update documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
