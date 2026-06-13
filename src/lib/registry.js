import { getDefaultRegistryUrl } from './config.js';

// Mock registry for MVP — in production this fetches from GitHub
const BUILT_IN_SKILLS = [
  {
    name: 'code-reviewer',
    version: '1.0.0',
    description: 'Five-axis code review with staff engineer standards',
    author: 'agent-smith',
    tags: ['engineering', 'code-quality', 'review'],
    license: 'MIT',
    stars: 0,
    'agent-smith': {
      minVersion: '0.1.0',
      platforms: ['claude', 'openai', 'generic'],
      category: 'engineering',
    },
    repository: 'https://github.com/valentinovintages/agent-smith/tree/main/built-in-skills/code-reviewer',
  },
  {
    name: 'test-engineer',
    version: '1.0.0',
    description: 'Test-driven development and quality assurance workflows',
    author: 'agent-smith',
    tags: ['testing', 'tdd', 'engineering'],
    license: 'MIT',
    stars: 0,
    'agent-smith': {
      minVersion: '0.1.0',
      platforms: ['claude', 'openai', 'generic'],
      category: 'engineering',
    },
    repository: 'https://github.com/valentinovintages/agent-smith/tree/main/built-in-skills/test-engineer',
  },
  {
    name: 'web-scraper',
    version: '1.0.0',
    description: 'Web scraping and data extraction workflows',
    author: 'agent-smith',
    tags: ['automation', 'data', 'web'],
    license: 'MIT',
    stars: 0,
    'agent-smith': {
      minVersion: '0.1.0',
      platforms: ['claude', 'openai', 'generic'],
      category: 'automation',
    },
    repository: 'https://github.com/valentinovintages/agent-smith/tree/main/built-in-skills/web-scraper',
  },
  {
    name: 'api-designer',
    version: '1.0.0',
    description: 'Contract-first API design and documentation',
    author: 'agent-smith',
    tags: ['engineering', 'api', 'design'],
    license: 'MIT',
    stars: 0,
    'agent-smith': {
      minVersion: '0.1.0',
      platforms: ['claude', 'openai', 'generic'],
      category: 'engineering',
    },
    repository: 'https://github.com/valentinovintages/agent-smith/tree/main/built-in-skills/api-designer',
  },
  {
    name: 'content-writer',
    version: '1.0.0',
    description: 'SEO-optimized content writing workflows',
    author: 'agent-smith',
    tags: ['content', 'writing', 'marketing'],
    license: 'MIT',
    stars: 0,
    'agent-smith': {
      minVersion: '0.1.0',
      platforms: ['claude', 'openai', 'generic'],
      category: 'marketing',
    },
    repository: 'https://github.com/valentinovintages/agent-smith/tree/main/built-in-skills/content-writer',
  },
];

export async function getRegistry() {
  // In MVP: return built-in skills
  // In production: fetch from GitHub registry
  return {
    skills() {
      return BUILT_IN_SKILLS;
    },
    find(name) {
      return BUILT_IN_SKILLS.find(s => s.name === name);
    },
    search(query, tag = null) {
      const lowerQuery = query.toLowerCase();
      return BUILT_IN_SKILLS.filter(skill => {
        const matchesQuery =
          skill.name.toLowerCase().includes(lowerQuery) ||
          skill.description.toLowerCase().includes(lowerQuery) ||
          (skill.tags || []).some(t => t.toLowerCase().includes(lowerQuery));

        const matchesTag = !tag || (skill.tags || []).includes(tag);

        return matchesQuery && matchesTag;
      });
    },
  };
}
