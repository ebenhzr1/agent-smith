import { getConfig } from './storage.js';

export function getDefaultRegistryUrl() {
  const config = getConfig();
  return config.registry || 'https://raw.githubusercontent.com/ebenhzr1/agent-smith-registry/main/registry.json';
}

export function setRegistryUrl(url) {
  const config = getConfig();
  config.registry = url;
  saveConfig(config);
}
