export const PUBLIC_GAMES_BASE_URL = '/Gmfiles/';

/* global __PUBLIC_FILE_MAP__ */
const PUBLIC_FILE_MAP = typeof __PUBLIC_FILE_MAP__ !== 'undefined' && __PUBLIC_FILE_MAP__ ? __PUBLIC_FILE_MAP__ : {};

/**
 * Resolves any filename or relative path inside public/ without requiring the caller
 * to specify which subdirectory of public/ the file lives in.
 */
export const resolvePublicFileUrl = (input, defaultFolder = '') => {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^(https?:|data:|blob:|mailto:|javascript:)/i.test(trimmed)) {
    return trimmed;
  }

  // Strip optional leading slashes and "public/" prefix
  const clean = trimmed.replace(/^\/+/, '').replace(/^public\//i, '');
  const baseName = clean.split('/').pop() || clean;
  const decodedBase = (() => {
    try {
      return decodeURIComponent(baseName);
    } catch {
      return baseName;
    }
  })();

  // 1. Check build-time scan of /public by exact or case-insensitive filename
  const mappedPublic =
    PUBLIC_FILE_MAP[decodedBase] ||
    PUBLIC_FILE_MAP[decodedBase.toLowerCase()] ||
    PUBLIC_FILE_MAP[baseName] ||
    PUBLIC_FILE_MAP[baseName.toLowerCase()];

  if (mappedPublic) {
    return mappedPublic;
  }

  // 2. If caller already provided an explicit path inside public, preserve it
  if (clean.includes('/')) {
    return `/${clean}`;
  }

  // 3. Otherwise fall back to the optional default folder (e.g. 'thumbnails' or 'Gmfiles') or root '/'
  if (defaultFolder) {
    const cleanFolder = defaultFolder.replace(/^\/+|\/+$/g, '');
    return `/${cleanFolder}/${clean}`;
  }

  return `/${clean}`;
};

