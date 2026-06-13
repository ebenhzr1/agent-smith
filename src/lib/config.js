import { getConfig } from './storage.js';

export function getDefaultRegistryUrl() {
  const config = getConfig();
  return config.registry || 'https://raw.githubusercontent.com/valentinovintages/agent-smith-registry/main/registry.json';
}

export function setRegistryUrl(url) {
  const config = getConfig();
  config.registry = url;
  saveConfig(config);
}
