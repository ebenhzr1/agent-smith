import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { getDefaultRegistryUrl } from './config.js';
import log from '../utils/logger.js';

const CACHE_DIR = join(homedir(), '.agent-smith', 'cache');
const CACHE_FILE = join(CACHE_DIR, 'registry-cache.json');
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const BUILT_IN_SKILLS = [
  {
    name: 'code-reviewer',
    version: '1.0.0',
    description: 'Five-axis code review with staff engineer standards',
    author: 'agent-smith',
    tags: ['engineering', 'code-quality', 'review'],
    license: 'MIT',
    stars: 0,
    'agent-smith': { minVersion: '0.1.0', platforms: ['claude', 'openai', 'generic'], category: 'engineering' },
    repository: 'https://github.com/ebenhzr1/agent-smith/tree/main/built-in-skills/code-reviewer',
  },
  {
    name: 'test-engineer',
    version: '1.0.0',
    description: 'Test-driven development and quality assurance workflows',
    author: 'agent-smith',
    tags: ['testing', 'tdd', 'engineering'],
    license: 'MIT',
    stars: 0,
    'agent-smith': { minVersion: '0.1.0', platforms: ['claude', 'openai', 'generic'], category: 'engineering' },
    repository: 'https://github.com/ebenhzr1/agent-smith/tree/main/built-in-skills/test-engineer',
  },
  {
    name: 'web-scraper',
    version: '1.0.0',
    description: 'Web scraping and data extraction workflows',
    author: 'agent-smith',
    tags: ['automation', 'data', 'web'],
    license: 'MIT',
    stars: 0,
    'agent-smith': { minVersion: '0.1.0', platforms: ['claude', 'openai', 'generic'], category: 'automation' },
    repository: 'https://github.com/ebenhzr1/agent-smith/tree/main/built-in-skills/web-scraper',
  },
  {
    name: 'api-designer',
    version: '1.0.0',
    description: 'Contract-first API design and documentation',
    author: 'agent-smith',
    tags: ['engineering', 'api', 'design'],
    license: 'MIT',
    stars: 0,
    'agent-smith': { minVersion: '0.1.0', platforms: ['claude', 'openai', 'generic'], category: 'engineering' },
    repository: 'https://github.com/ebenhzr1/agent-smith/tree/main/built-in-skills/api-designer',
  },
  {
    name: 'content-writer',
    version: '1.0.0',
    description: 'SEO-optimized content writing workflows',
    author: 'agent-smith',
    tags: ['content', 'writing', 'marketing'],
    license: 'MIT',
    stars: 0,
    'agent-smith': { minVersion: '0.1.0', platforms: ['claude', 'openai', 'generic'], category: 'marketing' },
    repository: 'https://github.com/ebenhzr1/agent-smith/tree/main/built-in-skills/content-writer',
  },
];

let cachedSkills = null;

/**
 * Fetch registry — tries remote first, falls back to cache, then built-in.
 */
export async function getRegistry() {
  if (cachedSkills) {
    return createRegistryApi(cachedSkills);
  }

  // Try loading from cache
  const cached = loadCache();
  if (cached) {
    cachedSkills = cached;
    return createRegistryApi(cached);
  }

  // Try fetching from remote
  try {
    log.info('Fetching remote registry...');
    const remoteSkills = await fetchRemoteRegistry();
    if (remoteSkills && remoteSkills.length > 0) {
      saveCache(remoteSkills);
      cachedSkills = remoteSkills;
      log.info(`Remote registry loaded: ${remoteSkills.length} skills`);
      return createRegistryApi(remoteSkills);
    }
  } catch (err) {
    log.warn('Remote registry unavailable, using built-in', { error: err.message });
  }

  // Fallback to built-in
  log.info('Using built-in registry (5 skills)');
  return createRegistryApi(BUILT_IN_SKILLS);
}

/**
 * Fetch remote registry JSON from configured URL.
 */
async function fetchRemoteRegistry() {
  const url = getDefaultRegistryUrl();
  log.debug('Fetching registry from', { url });

  const response = await fetch(url, {
    signal: AbortSignal.timeout(5000),
    headers: { 'User-Agent': 'agent-smith/0.1.0' },
  });

  if (!response.ok) {
    throw new Error(`Registry returned HTTP ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.skills || [];
}

/**
 * Create the registry API object from a skill list.
 */
function createRegistryApi(skills) {
  return {
    skills() {
      return skills;
    },
    find(name) {
      return skills.find(s => s.name === name);
    },
    search(query, tag = null) {
      const lowerQuery = query.toLowerCase();
      return skills.filter(skill => {
        const matchesQuery =
          !query ||
          skill.name.toLowerCase().includes(lowerQuery) ||
          skill.description.toLowerCase().includes(lowerQuery) ||
          (skill.tags || []).some(t => t.toLowerCase().includes(lowerQuery));

        const matchesTag = !tag || (skill.tags || []).includes(tag);
        return matchesQuery && matchesTag;
      });
    },
    refresh() {
      cachedSkills = null;
      return getRegistry();
    },
  };
}

/* ─── Cache helpers ───────────────────────────────────────── */

function loadCache() {
  if (!existsSync(CACHE_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    const age = Date.now() - (data.timestamp || 0);
    if (age > CACHE_TTL_MS) return null; // Expired
    return data.skills;
  } catch {
    return null;
  }
}

function saveCache(skills) {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify({ timestamp: Date.now(), skills }, null, 2));
}
