import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

axios.defaults.baseURL = apiBaseUrl;

axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && /^https?:\/\/localhost:8080/i.test(config.url)) {
    config.url = config.url.replace(/^https?:\/\/localhost:8080/i, apiBaseUrl);
  }

  return config;
});

export function resolveAssetUrl(assetPath) {
  if (!assetPath) {
    return assetPath;
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${apiBaseUrl}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`;
}