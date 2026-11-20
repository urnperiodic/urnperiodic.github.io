import { signInAnonymously } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  OperationType,
  handleFirestoreError,
  isFirestorePermissionError,
} from '../firebase';

export const ACCOUNTS_COLLECTION = 'siteAccounts';
export const SIGN_IN_LINKS_COLLECTION = 'signInLinks';
export const WORKSPACE_CONFIG_COLLECTION = 'siteConfig';
export const WORKSPACE_CONFIG_DOC_ID = 'workspaceAccess';
export const WORKSPACE_CONFIG_CACHE_KEY = 'urnperiodic-workspace-config-cache';
export const ACCOUNT_SESSION_KEY = 'urnperiodic-account-session';
export const CHAT_LINKED_ACCOUNT_KEY = 'urnperiodic_chat_account';
export const LAST_ACTIVITY_KEY = 'urnperiodic-last-activity';
export const AUTO_SIGNOUT_IDLE_KEY = 'unblocked-auto-signout-on-idle';
export const REMEMBERED_USERS_KEY = 'urnperiodic-saved-users';
export const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour
export const ONLINE_TIMEOUT_MS = 90 * 1000;

export function isAccountOnline(account, now = Date.now()) {
  if (!account || account.isActive === false) return false;
  if (!account.isOnline || !account.lastSeenAt) return false;
  return now - Number(account.lastSeenAt) < ONLINE_TIMEOUT_MS;
}

export function formatLastSeen(lastSeenAt, now = Date.now()) {
  const ts = Number(lastSeenAt || 0);
  if (!ts) return 'Never active';
  const diff = Math.max(0, now - ts);
  if (diff < 60 * 1000) return 'Active now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export const ACTIVITY_BUCKET_KEYS = [
  'games',
  'movies',
  'moremovies',
  'moremoremovies',
  'youtube',
  'lobbychat',
  'ai',
  'catalog',
];

export const ACTIVITY_LABELS = {
  games: 'Games',
  movies: 'Movies',
  moremovies: 'More Movies',
  moremoremovies: 'MoreMore Movies',
  youtube: 'Clarity Video',
  lobbychat: 'Lobby Chat',
  ai: 'AI Chat',
  catalog: 'Catalog',
};

export const GIRLS_THEME_POLICIES = ['default_if_unset', 'apply_on_signin', 'lock'];

export const GIRLS_THEME_POLICY_META = {
  default_if_unset: {
    label: 'Default if Unset',
    description: 'Applies Girls theme when user has no saved custom theme; they can still change it afterward.',
  },
  apply_on_signin: {
    label: 'Apply on Sign-In',
    description: 'Switches assigned users to Girls theme each time they sign in; they can switch mid-session.',
  },
  lock: {
    label: 'Lock to Girls',
    description: 'Forces assigned users onto Girls theme and locks the theme switcher.',
  },
};

export function getTodayDateKey(now = Date.now()) {
  const d = new Date(now);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`.slice(0, 16);
}

export function formatDurationMs(ms) {
  const val = Math.max(0, Math.round(Number(ms || 0)));
  if (!val) return '0m';
  if (val < 60 * 1000) return `${Math.max(1, Math.round(val / 1000))}s`;
  const totalMins = Math.floor(val / 60000);
  if (totalMins < 60) return `${totalMins}m`;
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function getAccountTodayTimeMs(account, now = Date.now()) {
  if (!account) return 0;
  const todayKey = getTodayDateKey(now);
  if (account.todayDateKey !== todayKey) return 0;
  return Math.max(0, Math.round(Number(account.todayTimeMs || 0)));
}

export function sanitizeActivityTimeMs(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  ACTIVITY_BUCKET_KEYS.forEach((key) => {
    const num = Number(raw[key]);
    if (Number.isFinite(num) && num > 0) {
      out[key] = Math.round(num);
    }
  });
  return out;
}

export const WORKSPACE_ACCESS_KEYS = [
  { key: 'gamesAccess', label: 'Games', description: 'Games & Portals catalog', defaultForAccount: true, defaultGlobal: true },
  { key: 'moviesAccess', label: 'Movies', description: 'Movies workspace', defaultForAccount: true, defaultGlobal: true },
  { key: 'moreMoviesAccess', label: 'More Movies', description: 'Atlantic.st workspace', defaultForAccount: true, defaultGlobal: true },
  { key: 'moreMoreMoviesAccess', label: 'MoreMore Movies', description: 'Nocturne.rip workspace', defaultForAccount: true, defaultGlobal: true },
  { key: 'youtubeAccess', label: 'YouTube', description: 'YouTube workspace', defaultForAccount: true, defaultGlobal: true },
  { key: 'lobbyChatAccess', label: 'Lobby Chat', description: 'Live community chat', defaultForAccount: true, defaultGlobal: true },
  { key: 'aiAccess', label: 'AI Chat', description: 'Gemini AI chat tutor', defaultForAccount: false, defaultGlobal: true },
  { key: 'decoysAccess', label: 'Extra Decoys', description: 'All disguises & randomizer', defaultForAccount: false, defaultGlobal: true },
  { key: 'downloadAccess', label: 'Downloads', description: 'Offline website download', defaultForAccount: true, defaultGlobal: true },
];

export const DEFAULT_WORKSPACE_CONFIG = {
  siteLockdown: false,
  lockdownMessage: 'Workspace access is currently restricted by the administrator.',
  allowSharedPasscodes: false,
  allowAccountOverrides: true,
  allowAiOverrides: true,
  girlsThemePolicy: 'default_if_unset',
  girlsThemeSyncChat: true,
  gamesAccess: true,
  moviesAccess: true,
  moreMoviesAccess: true,
  moreMoreMoviesAccess: true,
  youtubeAccess: true,
  lobbyChatAccess: true,
  aiAccess: true,
  decoysAccess: true,
  downloadAccess: true,
  broadcastId: '',
  broadcastMessage: '',
  broadcastSender: '',
  broadcastAt: null,
  updatedAt: 0,
};

export function sanitizeWorkspaceConfig(data) {
  if (!data) return { ...DEFAULT_WORKSPACE_CONFIG };
  const rawBroadcastMsg = typeof data.broadcastMessage === 'string' ? data.broadcastMessage.trim().slice(0, 500) : '';
  const rawBroadcastId = typeof data.broadcastId === 'string' ? data.broadcastId.trim().slice(0, 64) : '';
  const rawBroadcastSender = typeof data.broadcastSender === 'string' ? data.broadcastSender.trim().slice(0, 40) : '';
  const rawBroadcastAt = Number(data.broadcastAt || 0);
  const rawGirlsPolicy = typeof data.girlsThemePolicy === 'string' ? data.girlsThemePolicy : 'default_if_unset';
  return {
    siteLockdown: Boolean(data.siteLockdown),
    lockdownMessage:
      typeof data.lockdownMessage === 'string' && data.lockdownMessage.trim()
        ? data.lockdownMessage.trim().slice(0, 200)
        : DEFAULT_WORKSPACE_CONFIG.lockdownMessage,
    allowSharedPasscodes: false,
    allowAccountOverrides: data.allowAccountOverrides !== false,
    allowAiOverrides: data.allowAiOverrides !== false,
    girlsThemePolicy: GIRLS_THEME_POLICIES.includes(rawGirlsPolicy) ? rawGirlsPolicy : 'default_if_unset',
    girlsThemeSyncChat: data.girlsThemeSyncChat !== false,
    gamesAccess: data.gamesAccess !== false,
    moviesAccess: data.moviesAccess !== false,
    moreMoviesAccess: data.moreMoviesAccess !== false,
    moreMoreMoviesAccess: data.moreMoreMoviesAccess !== false,
    youtubeAccess: data.youtubeAccess !== false,
    lobbyChatAccess: data.lobbyChatAccess !== false,
    aiAccess: data.aiAccess !== false,
    decoysAccess: data.decoysAccess !== false,
    downloadAccess: data.downloadAccess !== false,
    broadcastId: rawBroadcastMsg ? rawBroadcastId : '',
    broadcastMessage: rawBroadcastMsg,
    broadcastSender: rawBroadcastMsg ? rawBroadcastSender : '',
    broadcastAt: rawBroadcastMsg && rawBroadcastAt > 0 ? rawBroadcastAt : null,
    updatedAt: Number(data.updatedAt || 0),
  };
}

export function getCachedWorkspaceConfig() {
  try {
    const raw = localStorage.getItem(WORKSPACE_CONFIG_CACHE_KEY);
    if (!raw) return { ...DEFAULT_WORKSPACE_CONFIG };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_WORKSPACE_CONFIG };
    return sanitizeWorkspaceConfig(parsed);
  } catch {
    return { ...DEFAULT_WORKSPACE_CONFIG };
  }
}

export function cacheWorkspaceConfig(config) {
  try {
    const sanitized = sanitizeWorkspaceConfig(config);
    localStorage.setItem(WORKSPACE_CONFIG_CACHE_KEY, JSON.stringify(sanitized));
    return sanitized;
  } catch {
    return sanitizeWorkspaceConfig(config);
  }
}

export const BADGE_COLORS = {
  cyan: {
    label: 'Cyan',
    chipClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
    lightChipClass: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    swatch: '#06b6d4',
  },
  amber: {
    label: 'Gold',
    chipClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    lightChipClass: 'bg-amber-100 text-amber-800 border-amber-300',
    swatch: '#f59e0b',
  },
  emerald: {
    label: 'Emerald',
    chipClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    lightChipClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    swatch: '#10b981',
  },
  rose: {
    label: 'Rose',
    chipClass: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    lightChipClass: 'bg-rose-100 text-rose-800 border-rose-300',
    swatch: '#f43f5e',
  },
  violet: {
    label: 'Violet',
    chipClass: 'bg-violet-500/15 text-violet-300 border-violet-500/40',
    lightChipClass: 'bg-violet-100 text-violet-800 border-violet-300',
    swatch: '#8b5cf6',
  },
  neutral: {
    label: 'Slate',
    chipClass: 'bg-white/10 text-neutral-200 border-white/20',
    lightChipClass: 'bg-neutral-200 text-neutral-800 border-neutral-300',
    swatch: '#94a3b8',
  },
};

export function normalizeUsername(raw) {
  const username = String(raw || '').trim();
  if (username.length < 2 || username.length > 20) {
    return {
      valid: false,
      username,
      usernameLower: username.toLowerCase(),
      error: 'Username must be between 2 and 20 characters.',
    };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      username,
      usernameLower: username.toLowerCase(),
      error: 'Username can only contain letters, numbers, underscores, and hyphens.',
    };
  }
  return {
    valid: true,
    username,
    usernameLower: username.toLowerCase(),
    error: '',
  };
}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const clean = String(hex || '').replace(/[^0-9a-f]/gi, '');
  const out = new Uint8Array(Math.floor(clean.length / 2));
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function generateSaltHex(byteLength = 16) {
  const bytes = new Uint8Array(byteLength);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytesToHex(bytes);
}

export function generateStrongPassword(length = 10) {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

function fallbackHash(input) {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 'fb_' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0');
}

export async function hashPassword(password, saltHex) {
  const text = String(password || '');
  const salt = String(saltHex || '');
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(text),
        { name: 'PBKDF2' },
        false,
        ['deriveBits'],
      );
      const bits = await window.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: hexToBytes(salt),
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        256,
      );
      return 'pbkdf2_' + bytesToHex(new Uint8Array(bits));
    }
  } catch {
    // Fall through to deterministic fallback hash
  }
  return fallbackHash(`${salt}:${text}:${salt}`);
}

const ADMIN_VAULT_SECRET = 'urnperiodic-admin-vault-key-v1-06091006Tt';
let cachedVaultCryptoKey = null;

async function getAdminVaultCryptoKey() {
  if (cachedVaultCryptoKey) return cachedVaultCryptoKey;
  if (typeof window === 'undefined' || !window.crypto?.subtle) return null;
  const rawBytes = new TextEncoder().encode(ADMIN_VAULT_SECRET);
  const digest = await window.crypto.subtle.digest('SHA-256', rawBytes);
  cachedVaultCryptoKey = await window.crypto.subtle.importKey(
    'raw',
    digest,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  );
  return cachedVaultCryptoKey;
}

function xorObfuscateBytes(bytes) {
  const keyBytes = new TextEncoder().encode(ADMIN_VAULT_SECRET);
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ keyBytes[i % keyBytes.length] ^ ((i * 31) & 0xff);
  }
  return out;
}

function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof btoa === 'function' ? btoa(binary) : '';
}

function base64ToBytes(b64) {
  if (typeof atob !== 'function') return new Uint8Array(0);
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

export async function encryptAdminPassword(password) {
  const text = String(password || '');
  if (!text) return '';
  try {
    const key = await getAdminVaultCryptoKey();
    if (key && typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(text);
      const cipherBuf = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoded,
      );
      const result = `aes1:${bytesToHex(iv)}:${bytesToHex(new Uint8Array(cipherBuf))}`;
      if (result.length <= 512) return result;
    }
  } catch {
    // Fall through to obfuscation fallback
  }
  try {
    const encoded = new TextEncoder().encode(text);
    const masked = xorObfuscateBytes(encoded);
    const result = `obf1:${bytesToBase64(masked)}`;
    return result.slice(0, 512);
  } catch {
    return '';
  }
}

export async function decryptAdminPassword(cipher) {
  const raw = String(cipher || '').trim();
  if (!raw) return '';
  try {
    if (raw.startsWith('aes1:')) {
      const parts = raw.split(':');
      if (parts.length !== 3) return '';
      const iv = hexToBytes(parts[1]);
      const data = hexToBytes(parts[2]);
      const key = await getAdminVaultCryptoKey();
      if (!key || !iv.length || !data.length) return '';
      const plainBuf = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data,
      );
      return new TextDecoder().decode(plainBuf);
    }
    if (raw.startsWith('obf1:')) {
      const b64 = raw.slice(5);
      const masked = base64ToBytes(b64);
      if (!masked.length) return '';
      const unmasked = xorObfuscateBytes(masked);
      return new TextDecoder().decode(unmasked);
    }
  } catch {
    return '';
  }
  return '';
}

export async function revealAccountPassword(account) {
  if (!account) {
    return { available: false, password: '', reason: 'Account record not found.' };
  }
  if (!account.encryptedPassword) {
    return {
      available: false,
      password: '',
      reason: 'Password not saved yet (created before password viewing was enabled — reset it or have the user sign in once).',
    };
  }
  const plain = await decryptAdminPassword(account.encryptedPassword);
  if (!plain) {
    return {
      available: false,
      password: '',
      reason: 'Unable to decrypt stored password. Use Pass to set a new password.',
    };
  }
  return { available: true, password: plain, reason: '' };
}

export async function ensureFirebaseAnonAuth(auth) {
  if (!auth) return;
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch {
      // Anonymous Auth may be disabled (auth/admin-restricted-operation); continue directly to Firestore.
    }
  }
}

export function sanitizeAccountSettings(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const out = {};
  if (typeof raw.animationsEnabled === 'boolean') out.animationsEnabled = raw.animationsEnabled;
  if (raw.gameLayoutMode === 'standard' || raw.gameLayoutMode === 'compact') {
    out.gameLayoutMode = raw.gameLayoutMode;
  }
  if (raw.gameCatalogMode === 'original' || raw.gameCatalogMode === 'all') {
    out.gameCatalogMode = raw.gameCatalogMode;
  }
  if (typeof raw.hideUnranked === 'boolean') out.hideUnranked = raw.hideUnranked;
  if (typeof raw.autoHideHeader === 'boolean') out.autoHideHeader = raw.autoHideHeader;
  if (typeof raw.autoLockOnClose === 'boolean') out.autoLockOnClose = raw.autoLockOnClose;
  if (typeof raw.autoSignOutOnIdle === 'boolean') out.autoSignOutOnIdle = raw.autoSignOutOnIdle;
  if (typeof raw.panicKeysEnabled === 'boolean') out.panicKeysEnabled = raw.panicKeysEnabled;
  if (typeof raw.historyMaskingEnabled === 'boolean') out.historyMaskingEnabled = raw.historyMaskingEnabled;
  if (typeof raw.decoyType === 'string' && raw.decoyType.trim()) {
    out.decoyType = raw.decoyType.trim().slice(0, 32);
  }
  if (typeof raw.autoRandomizeDecoy === 'boolean') out.autoRandomizeDecoy = raw.autoRandomizeDecoy;
  if (typeof raw.randomizeInterval === 'number' && Number.isFinite(raw.randomizeInterval)) {
    out.randomizeInterval = Math.max(3, Math.min(300, Math.round(raw.randomizeInterval)));
  }
  if (Array.isArray(raw.randomizePool)) {
    out.randomizePool = raw.randomizePool
      .filter((x) => typeof x === 'string' && x.trim())
      .map((x) => x.trim().slice(0, 32))
      .slice(0, 30);
  }
  if (raw.customDecoyTitles && typeof raw.customDecoyTitles === 'object') {
    out.customDecoyTitles = {
      drive: typeof raw.customDecoyTitles.drive === 'string' ? raw.customDecoyTitles.drive.slice(0, 64) : '',
      docs: typeof raw.customDecoyTitles.docs === 'string' ? raw.customDecoyTitles.docs.slice(0, 64) : '',
      slides: typeof raw.customDecoyTitles.slides === 'string' ? raw.customDecoyTitles.slides.slice(0, 64) : '',
    };
  }
  if (typeof raw.chatTheme === 'string' && raw.chatTheme.trim()) {
    out.chatTheme = raw.chatTheme.trim().slice(0, 32);
  }
  if (typeof raw.sidebarOpen === 'boolean') out.sidebarOpen = raw.sidebarOpen;
  return out;
}

export function sanitizeAccountDoc(docId, data) {
  if (!data) return null;
  const badgeColor = BADGE_COLORS[data.badgeColor] ? data.badgeColor : 'cyan';
  return {
    id: docId,
    username: String(data.username || docId),
    usernameLower: String(data.usernameLower || docId).toLowerCase(),
    passwordHash: String(data.passwordHash || ''),
    encryptedPassword: typeof data.encryptedPassword === 'string' ? data.encryptedPassword : '',
    isActive: data.isActive !== false,
    isAdmin: Boolean(data.isAdmin),
    allowGlobalOverride: Boolean(data.allowGlobalOverride),
    allowAiOverride: Boolean(data.allowAiOverride),
    gamesAccess: data.gamesAccess !== false,
    moviesAccess: data.moviesAccess !== false,
    moreMoviesAccess: data.moreMoviesAccess !== false,
    moreMoreMoviesAccess: data.moreMoreMoviesAccess !== false,
    youtubeAccess: data.youtubeAccess !== false,
    lobbyChatAccess: data.lobbyChatAccess !== false,
    aiAccess: Boolean(data.aiAccess),
    decoysAccess: Boolean(data.decoysAccess),
    downloadAccess: data.downloadAccess !== false,
    chatMuted: Boolean(data.chatMuted),
    chatBanned: Boolean(data.chatBanned),
    roleBadge: String(data.roleBadge || '').trim().slice(0, 20),
    badgeColor,
    adminNotes: typeof data.adminNotes === 'string' ? data.adminNotes.slice(0, 500) : '',
    defaultGirlsTheme: Boolean(data.defaultGirlsTheme),
    requirePasswordOnUrl: Boolean(data.requirePasswordOnUrl),
    favorites: Array.isArray(data.favorites) ? data.favorites.filter((x) => typeof x === 'string') : [],
    recentlyPlayed: Array.isArray(data.recentlyPlayed) ? data.recentlyPlayed.filter((x) => typeof x === 'string').slice(0, 30) : [],
    preferredTheme: typeof data.preferredTheme === 'string' ? data.preferredTheme : null,
    preferredMode: data.preferredMode === 'light' || data.preferredMode === 'dark' ? data.preferredMode : null,
    accountSettings: sanitizeAccountSettings(data.accountSettings),
    totalTimeMs: Math.max(0, Math.round(Number(data.totalTimeMs || 0))),
    todayTimeMs: Math.max(0, Math.round(Number(data.todayTimeMs || 0))),
    todayDateKey: typeof data.todayDateKey === 'string' ? data.todayDateKey.slice(0, 16) : '',
    sessionCount: Math.max(0, Math.round(Number(data.sessionCount || 0))),
    currentActivity: typeof data.currentActivity === 'string' ? data.currentActivity.trim().slice(0, 100) : '',
    lastActivityAt: data.lastActivityAt ? Number(data.lastActivityAt) : null,
    activityTimeMs: sanitizeActivityTimeMs(data.activityTimeMs),
    createdAt: Number(data.createdAt || 0),
    updatedAt: Number(data.updatedAt || 0),
    lastLoginAt: data.lastLoginAt ? Number(data.lastLoginAt) : null,
    isOnline: Boolean(data.isOnline),
    lastSeenAt: data.lastSeenAt ? Number(data.lastSeenAt) : null,
  };
}

export function toPublicChatAccount(account) {
  if (!account) return null;
  return {
    username: account.username,
    usernameLower: account.usernameLower,
    isActive: account.isActive !== false,
    isAdmin: Boolean(account.isAdmin),
    lobbyChatAccess: account.lobbyChatAccess !== false,
    defaultGirlsTheme: Boolean(account.defaultGirlsTheme),
    roleBadge: account.roleBadge || '',
    badgeColor: account.badgeColor || 'cyan',
    chatMuted: Boolean(account.chatMuted),
    chatBanned: Boolean(account.chatBanned),
  };
}

export function touchSessionActivity(force = false) {
  const now = Date.now();
  try {
    const prev = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);
    if (force || !prev || now - prev >= 5000) {
      localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
    }
  } catch {}
  return now;
}

export function getLastSessionActivity() {
  try {
    const raw = localStorage.getItem(LAST_ACTIVITY_KEY);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function clearSessionActivity() {
  try {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch {}
}

export function isAutoSignOutOnIdleEnabled() {
  try {
    return localStorage.getItem(AUTO_SIGNOUT_IDLE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function isSessionInactiveExpired(fallbackTimestamp = 0) {
  if (!isAutoSignOutOnIdleEnabled()) return false;
  const last = getLastSessionActivity() || Number(fallbackTimestamp || 0);
  if (!last) return false;
  return Date.now() - last >= INACTIVITY_TIMEOUT_MS;
}

export function getRememberedLocalUsers() {
  try {
    const raw = localStorage.getItem(REMEMBERED_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((u) => u && typeof u.username === 'string' && u.username.trim());
  } catch {
    return [];
  }
}

export function saveRememberedLocalUser(user) {
  if (!user || !user.username) return [];
  const username = String(user.username).trim();
  const usernameLower = String(user.usernameLower || username).trim().toLowerCase();
  const entry = {
    username,
    usernameLower,
    roleBadge: String(user.roleBadge || '').trim().slice(0, 20),
    badgeColor: user.badgeColor || 'cyan',
    isAdmin: Boolean(user.isAdmin),
    isOwnerAdmin: Boolean(user.isOwnerAdmin),
    savedAt: Date.now(),
  };
  try {
    const existing = getRememberedLocalUsers().filter((u) => u.usernameLower !== usernameLower);
    const next = [entry, ...existing].slice(0, 5);
    localStorage.setItem(REMEMBERED_USERS_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [entry];
  }
}

export function removeRememberedLocalUser(usernameLower) {
  const target = String(usernameLower || '').trim().toLowerCase();
  try {
    const next = target
      ? getRememberedLocalUsers().filter((u) => u.usernameLower !== target)
      : [];
    localStorage.setItem(REMEMBERED_USERS_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

export function saveAccountSession(account) {
  if (!account) return;
  const now = touchSessionActivity(true);
  const sessionPayload = {
    usernameLower: account.usernameLower,
    verifier: account.passwordHash,
    savedAt: now,
  };
  try {
    localStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(sessionPayload));
  } catch {}
  try {
    sessionStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(sessionPayload));
  } catch {}
  saveRememberedLocalUser(account);
  syncChatLinkedAccountStorage(account);
}

export function getSavedAccountSession() {
  try {
    const raw = sessionStorage.getItem(ACCOUNT_SESSION_KEY) || localStorage.getItem(ACCOUNT_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.usernameLower && parsed.verifier) {
      if (isSessionInactiveExpired(parsed.savedAt)) {
        clearAccountSession();
        return null;
      }
      return parsed;
    }
  } catch {}
  return null;
}

export function clearAccountSession() {
  try {
    localStorage.removeItem(ACCOUNT_SESSION_KEY);
  } catch {}
  try {
    sessionStorage.removeItem(ACCOUNT_SESSION_KEY);
  } catch {}
  syncChatLinkedAccountStorage(null);
}

export function syncChatLinkedAccountStorage(account) {
  const payload = toPublicChatAccount(account);
  try {
    if (payload) {
      localStorage.setItem(CHAT_LINKED_ACCOUNT_KEY, JSON.stringify(payload));
    } else {
      localStorage.removeItem(CHAT_LINKED_ACCOUNT_KEY);
    }
  } catch {}

  try {
    window.dispatchEvent(new CustomEvent('urnperiodic-account-sync', { detail: payload }));
  } catch {}

  try {
    const iframe = /** @type {HTMLIFrameElement | null} */ (document.getElementById('chat-decoy-iframe'));
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: 'urnperiodic-account-sync', account: payload },
        '*',
      );
    }
  } catch {}
}

export async function authenticateAccount(db, auth, rawUsername, rawPassword) {
  const norm = normalizeUsername(rawUsername);
  if (!norm.valid) {
    throw new Error('Invalid username or password.');
  }
  const password = String(rawPassword || '');
  if (!password) {
    throw new Error('Please enter your password.');
  }

  await ensureFirebaseAnonAuth(auth);
  const path = `${ACCOUNTS_COLLECTION}/${norm.usernameLower}`;
  const ref = doc(db, ACCOUNTS_COLLECTION, norm.usernameLower);
  let snap;
  try {
    snap = await getDoc(ref);
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, path);
    throw err;
  }
  if (!snap.exists()) {
    throw new Error('Invalid username or password.');
  }

  const data = snap.data();
  if (data.isActive === false) {
    throw new Error('This account has been disabled by an admin.');
  }

  const computedHash = await hashPassword(password, data.passwordSalt || '');
  if (!data.passwordHash || computedHash !== data.passwordHash) {
    throw new Error('Invalid username or password.');
  }

  const now = Date.now();
  const todayKey = getTodayDateKey(now);
  const nextSessionCount = Math.max(0, Math.round(Number(data.sessionCount || 0))) + 1;
  const nextTodayTimeMs = data.todayDateKey === todayKey ? Math.max(0, Math.round(Number(data.todayTimeMs || 0))) : 0;
  let nextEncryptedPassword = typeof data.encryptedPassword === 'string' ? data.encryptedPassword : '';
  const loginPatch = {
    lastLoginAt: now,
    lastSeenAt: now,
    lastActivityAt: now,
    sessionCount: nextSessionCount,
    todayDateKey: todayKey,
    todayTimeMs: nextTodayTimeMs,
    isOnline: true,
    updatedAt: now,
  };
  if (!nextEncryptedPassword) {
    const encrypted = await encryptAdminPassword(password);
    if (encrypted) {
      nextEncryptedPassword = encrypted;
      loginPatch.encryptedPassword = encrypted;
    }
  }
  try {
    await updateDoc(ref, loginPatch);
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.UPDATE, path);
  }

  return sanitizeAccountDoc(snap.id, {
    ...data,
    ...loginPatch,
    encryptedPassword: nextEncryptedPassword,
  });
}

export async function verifySessionAccount(db, auth, session) {
  if (!session?.usernameLower || !session?.verifier) return null;
  await ensureFirebaseAnonAuth(auth);
  const path = `${ACCOUNTS_COLLECTION}/${session.usernameLower}`;
  const ref = doc(db, ACCOUNTS_COLLECTION, session.usernameLower);
  let snap;
  try {
    snap = await getDoc(ref);
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, path);
    throw err;
  }
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.isActive === false) return null;
  if (!data.passwordHash || data.passwordHash !== session.verifier) return null;
  return sanitizeAccountDoc(snap.id, data);
}

export function subscribeToAccount(db, usernameLower, onUpdate, onError) {
  if (!db || !usernameLower) return () => {};
  const path = `${ACCOUNTS_COLLECTION}/${usernameLower}`;
  const ref = doc(db, ACCOUNTS_COLLECTION, usernameLower);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onUpdate(null);
        return;
      }
      onUpdate(sanitizeAccountDoc(snap.id, snap.data()));
    },
    (err) => {
      if (isFirestorePermissionError(err)) {
        try {
          handleFirestoreError(err, OperationType.GET, path);
        } catch (wrappedErr) {
          if (onError) onError(wrappedErr);
          return;
        }
      }
      if (onError) onError(err);
    },
  );
}

export function subscribeToAllManagedAccounts(db, auth, onList, onError) {
  if (!db) return () => {};
  let unsub = () => {};
  let cancelled = false;

  ensureFirebaseAnonAuth(auth)
    .then(() => {
      if (cancelled) return;
      unsub = onSnapshot(
        collection(db, ACCOUNTS_COLLECTION),
        (snapshot) => {
          const accounts = [];
          snapshot.forEach((docSnap) => {
            const parsed = sanitizeAccountDoc(docSnap.id, docSnap.data());
            if (parsed) accounts.push(parsed);
          });
          accounts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          onList(accounts);
        },
        (err) => {
          if (isFirestorePermissionError(err)) {
            try {
              handleFirestoreError(err, OperationType.LIST, ACCOUNTS_COLLECTION);
            } catch (wrappedErr) {
              if (onError) onError(wrappedErr);
              return;
            }
          }
          if (onError) onError(err);
        },
      );
    })
    .catch((err) => {
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    try {
      unsub();
    } catch {}
  };
}

export async function createManagedAccount(db, auth, payload) {
  const norm = normalizeUsername(payload.username);
  if (!norm.valid) {
    throw new Error(norm.error);
  }
  const password = String(payload.password || '');
  if (password.length < 3) {
    throw new Error('Password must be at least 3 characters.');
  }

  await ensureFirebaseAnonAuth(auth);
  const path = `${ACCOUNTS_COLLECTION}/${norm.usernameLower}`;
  const ref = doc(db, ACCOUNTS_COLLECTION, norm.usernameLower);
  let existing;
  try {
    existing = await getDoc(ref);
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, path);
    throw err;
  }
  if (existing.exists()) {
    throw new Error(`Account "${norm.username}" already exists.`);
  }

  const salt = generateSaltHex(16);
  const passwordHash = await hashPassword(password, salt);
  const encryptedPassword = await encryptAdminPassword(password);
  const now = Date.now();

  const record = {
    username: norm.username,
    usernameLower: norm.usernameLower,
    passwordSalt: salt,
    passwordHash,
    ...(encryptedPassword ? { encryptedPassword } : {}),
    isActive: payload.isActive !== false,
    isAdmin: Boolean(payload.isAdmin),
    allowGlobalOverride: Boolean(payload.allowGlobalOverride),
    allowAiOverride: Boolean(payload.allowAiOverride),
    gamesAccess: payload.gamesAccess !== false,
    moviesAccess: payload.moviesAccess !== false,
    moreMoviesAccess: payload.moreMoviesAccess !== false,
    moreMoreMoviesAccess: payload.moreMoreMoviesAccess !== false,
    youtubeAccess: payload.youtubeAccess !== false,
    lobbyChatAccess: payload.lobbyChatAccess !== false,
    aiAccess: Boolean(payload.aiAccess || payload.allowAiOverride),
    decoysAccess: Boolean(payload.decoysAccess),
    downloadAccess: payload.downloadAccess !== false,
    chatMuted: Boolean(payload.chatMuted),
    chatBanned: Boolean(payload.chatBanned),
    roleBadge: String(payload.roleBadge || '').trim().slice(0, 20),
    badgeColor: BADGE_COLORS[payload.badgeColor] ? payload.badgeColor : 'cyan',
    adminNotes: typeof payload.adminNotes === 'string' ? payload.adminNotes.trim().slice(0, 500) : '',
    defaultGirlsTheme: Boolean(payload.defaultGirlsTheme),
    favorites: [],
    recentlyPlayed: [],
    preferredTheme: null,
    preferredMode: null,
    accountSettings: sanitizeAccountSettings(payload.accountSettings),
    totalTimeMs: 0,
    todayTimeMs: 0,
    todayDateKey: getTodayDateKey(now),
    sessionCount: 0,
    currentActivity: '',
    lastActivityAt: null,
    activityTimeMs: {},
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null,
    isOnline: false,
    lastSeenAt: null,
  };

  try {
    await setDoc(ref, record);
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
  return sanitizeAccountDoc(norm.usernameLower, record);
}

export async function updateManagedAccount(db, auth, currentUsernameLower, updates) {
  if (!currentUsernameLower) throw new Error('Account ID missing.');
  await ensureFirebaseAnonAuth(auth);

  const patch = {
    updatedAt: Date.now(),
  };

  if (typeof updates.isActive === 'boolean') patch.isActive = updates.isActive;
  if (typeof updates.isAdmin === 'boolean') patch.isAdmin = updates.isAdmin;
  if (typeof updates.allowGlobalOverride === 'boolean') patch.allowGlobalOverride = updates.allowGlobalOverride;
  if (typeof updates.allowAiOverride === 'boolean') patch.allowAiOverride = updates.allowAiOverride;
  if (typeof updates.gamesAccess === 'boolean') patch.gamesAccess = updates.gamesAccess;
  if (typeof updates.moviesAccess === 'boolean') patch.moviesAccess = updates.moviesAccess;
  if (typeof updates.moreMoviesAccess === 'boolean') patch.moreMoviesAccess = updates.moreMoviesAccess;
  if (typeof updates.moreMoreMoviesAccess === 'boolean') patch.moreMoreMoviesAccess = updates.moreMoreMoviesAccess;
  if (typeof updates.youtubeAccess === 'boolean') patch.youtubeAccess = updates.youtubeAccess;
  if (typeof updates.lobbyChatAccess === 'boolean') patch.lobbyChatAccess = updates.lobbyChatAccess;
  if (typeof updates.aiAccess === 'boolean') patch.aiAccess = updates.aiAccess;
  if (typeof updates.decoysAccess === 'boolean') patch.decoysAccess = updates.decoysAccess;
  if (typeof updates.downloadAccess === 'boolean') patch.downloadAccess = updates.downloadAccess;
  if (typeof updates.chatMuted === 'boolean') patch.chatMuted = updates.chatMuted;
  if (typeof updates.chatBanned === 'boolean') patch.chatBanned = updates.chatBanned;
  if (typeof updates.defaultGirlsTheme === 'boolean') patch.defaultGirlsTheme = updates.defaultGirlsTheme;
  if (typeof updates.requirePasswordOnUrl === 'boolean') patch.requirePasswordOnUrl = updates.requirePasswordOnUrl;
  if (typeof updates.roleBadge === 'string') patch.roleBadge = updates.roleBadge.trim().slice(0, 20);
  if (typeof updates.badgeColor === 'string' && BADGE_COLORS[updates.badgeColor]) {
    patch.badgeColor = updates.badgeColor;
  }
  if (typeof updates.adminNotes === 'string') {
    patch.adminNotes = updates.adminNotes.trim().slice(0, 500);
  }

  if (typeof updates.newPassword === 'string' && updates.newPassword.length > 0) {
    if (updates.newPassword.length < 3) {
      throw new Error('New password must be at least 3 characters.');
    }
    const newSalt = generateSaltHex(16);
    patch.passwordSalt = newSalt;
    patch.passwordHash = await hashPassword(updates.newPassword, newSalt);
    const encrypted = await encryptAdminPassword(updates.newPassword);
    if (encrypted) {
      patch.encryptedPassword = encrypted;
    }
  }

  if (typeof updates.username === 'string' && updates.username.trim()) {
    const norm = normalizeUsername(updates.username);
    if (!norm.valid) throw new Error(norm.error);

    if (norm.usernameLower !== currentUsernameLower) {
      // Rename document key cleanly while preserving data & hashes
      const oldRef = doc(db, ACCOUNTS_COLLECTION, currentUsernameLower);
      const newRef = doc(db, ACCOUNTS_COLLECTION, norm.usernameLower);
      const [oldSnap, targetSnap] = await Promise.all([getDoc(oldRef), getDoc(newRef)]);
      if (!oldSnap.exists()) throw new Error('Original account no longer exists.');
      if (targetSnap.exists()) throw new Error(`Username "${norm.username}" is already taken.`);

      const merged = {
        ...oldSnap.data(),
        ...patch,
        username: norm.username,
        usernameLower: norm.usernameLower,
      };
      try {
        await setDoc(newRef, merged);
        await deleteDoc(oldRef);
      } catch (err) {
        if (isFirestorePermissionError(err)) {
          handleFirestoreError(err, OperationType.WRITE, `${ACCOUNTS_COLLECTION}/${norm.usernameLower}`);
        }
        throw err;
      }
      return sanitizeAccountDoc(norm.usernameLower, merged);
    }
    patch.username = norm.username;
  }

  const path = `${ACCOUNTS_COLLECTION}/${currentUsernameLower}`;
  const ref = doc(db, ACCOUNTS_COLLECTION, currentUsernameLower);
  try {
    await updateDoc(ref, patch);
    const refreshed = await getDoc(ref);
    return refreshed.exists() ? sanitizeAccountDoc(refreshed.id, refreshed.data()) : null;
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function deleteManagedAccount(db, auth, usernameLower) {
  if (!usernameLower) return;
  await ensureFirebaseAnonAuth(auth);
  const path = `${ACCOUNTS_COLLECTION}/${usernameLower}`;
  try {
    await deleteDoc(doc(db, ACCOUNTS_COLLECTION, usernameLower));
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

export async function fetchManagedAccountCount(db, auth) {
  await ensureFirebaseAnonAuth(auth);
  try {
    const snap = await getDocs(collection(db, ACCOUNTS_COLLECTION));
    return snap.size;
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, ACCOUNTS_COLLECTION);
    throw err;
  }
}

export async function syncAccountUserData(db, auth, usernameLower, data) {
  if (!db || !usernameLower) return;
  const path = `${ACCOUNTS_COLLECTION}/${usernameLower}`;
  try {
    await ensureFirebaseAnonAuth(auth);
    const patch = {
      updatedAt: Date.now(),
    };
    if (Array.isArray(data.favorites)) {
      patch.favorites = data.favorites.filter((x) => typeof x === 'string').slice(0, 500);
    }
    if (Array.isArray(data.recentlyPlayed)) {
      patch.recentlyPlayed = data.recentlyPlayed.filter((x) => typeof x === 'string').slice(0, 30);
    }
    if (typeof data.preferredTheme === 'string') {
      patch.preferredTheme = data.preferredTheme;
    }
    if (data.preferredMode === 'light' || data.preferredMode === 'dark') {
      patch.preferredMode = data.preferredMode;
    }
    if (data.accountSettings && typeof data.accountSettings === 'object') {
      patch.accountSettings = sanitizeAccountSettings(data.accountSettings);
    }
    await updateDoc(doc(db, ACCOUNTS_COLLECTION, usernameLower), patch);
  } catch (err) {
    if (isFirestorePermissionError(err)) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
    console.warn('Account user data sync warning:', err);
  }
}

export async function updateAccountPresence(db, auth, usernameLower, isOnline = true, extra = {}) {
  const cleanId = String(usernameLower || '').trim().toLowerCase();
  if (!db || !cleanId) return;
  const path = `${ACCOUNTS_COLLECTION}/${cleanId}`;
  try {
    await ensureFirebaseAnonAuth(auth);
    const now = Date.now();
    const patch = {
      isOnline: Boolean(isOnline),
      lastSeenAt: now,
      updatedAt: now,
    };
    if (!isOnline) {
      patch.currentActivity = '';
    } else if (typeof extra.currentActivity === 'string') {
      patch.currentActivity = extra.currentActivity.trim().slice(0, 100);
    }
    await updateDoc(doc(db, ACCOUNTS_COLLECTION, cleanId), patch);
  } catch (err) {
    if (isFirestorePermissionError(err)) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
}

function toSafeNonNegInt(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.round(num) : 0;
}

export async function recordAccountUsageHeartbeat(db, auth, usernameLower, stats) {
  const cleanId = String(usernameLower || '').trim().toLowerCase();
  if (!db || !cleanId || !stats) return;
  const path = `${ACCOUNTS_COLLECTION}/${cleanId}`;
  try {
    await ensureFirebaseAnonAuth(auth);
    const now = Date.now();
    const patch = {
      isOnline: stats.isOnline !== false,
      lastSeenAt: now,
      lastActivityAt: now,
      updatedAt: now,
      totalTimeMs: toSafeNonNegInt(stats.totalTimeMs),
      todayTimeMs: toSafeNonNegInt(stats.todayTimeMs),
      todayDateKey: typeof stats.todayDateKey === 'string' && stats.todayDateKey ? stats.todayDateKey.slice(0, 16) : getTodayDateKey(now),
      currentActivity: stats.isOnline === false ? '' : String(stats.currentActivity || '').trim().slice(0, 100),
      activityTimeMs: sanitizeActivityTimeMs(stats.activityTimeMs),
    };
    if (typeof stats.sessionCount === 'number' && Number.isFinite(stats.sessionCount) && stats.sessionCount >= 0) {
      patch.sessionCount = Math.round(stats.sessionCount);
    }
    await updateDoc(doc(db, ACCOUNTS_COLLECTION, cleanId), patch);
  } catch (err) {
    if (isFirestorePermissionError(err)) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
}

export function subscribeToWorkspaceConfig(db, auth, onUpdate, onError) {
  if (!db) return () => {};
  let unsub = () => {};
  let cancelled = false;
  const path = `${WORKSPACE_CONFIG_COLLECTION}/${WORKSPACE_CONFIG_DOC_ID}`;

  ensureFirebaseAnonAuth(auth)
    .then(() => {
      if (cancelled) return;
      const ref = doc(db, WORKSPACE_CONFIG_COLLECTION, WORKSPACE_CONFIG_DOC_ID);
      unsub = onSnapshot(
        ref,
        (snap) => {
          if (!snap.exists()) {
            const def = cacheWorkspaceConfig({ ...DEFAULT_WORKSPACE_CONFIG });
            onUpdate(def);
            return;
          }
          const next = cacheWorkspaceConfig(snap.data());
          onUpdate(next);
        },
        (err) => {
          if (isFirestorePermissionError(err)) {
            try {
              handleFirestoreError(err, OperationType.GET, path);
            } catch (wrappedErr) {
              if (onError) onError(wrappedErr);
              return;
            }
          }
          if (onError) onError(err);
        },
      );
    })
    .catch((err) => {
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    try {
      unsub();
    } catch {}
  };
}

export async function updateWorkspaceConfig(db, auth, updates) {
  if (!db) throw new Error('Database not connected.');
  await ensureFirebaseAnonAuth(auth);
  const path = `${WORKSPACE_CONFIG_COLLECTION}/${WORKSPACE_CONFIG_DOC_ID}`;
  const ref = doc(db, WORKSPACE_CONFIG_COLLECTION, WORKSPACE_CONFIG_DOC_ID);
  try {
    const snap = await getDoc(ref);
    const current = snap.exists() ? sanitizeWorkspaceConfig(snap.data()) : { ...DEFAULT_WORKSPACE_CONFIG };
    const next = sanitizeWorkspaceConfig({
      ...current,
      ...updates,
      updatedAt: Date.now(),
    });
    await setDoc(ref, next);
    cacheWorkspaceConfig(next);
    return next;
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function sendAdminBroadcast(db, auth, message, senderName = 'Admin') {
  const cleanMessage = String(message || '').trim().slice(0, 500);
  if (!cleanMessage) {
    throw new Error('Please enter a message to send to everyone.');
  }
  const cleanSender = String(senderName || 'Admin').trim().slice(0, 40) || 'Admin';
  const now = Date.now();
  const broadcastId = `bc_${now}_${Math.random().toString(36).slice(2, 6)}`.slice(0, 64);
  return updateWorkspaceConfig(db, auth, {
    broadcastId,
    broadcastMessage: cleanMessage,
    broadcastSender: cleanSender,
    broadcastAt: now,
  });
}

export async function clearAdminBroadcast(db, auth) {
  return updateWorkspaceConfig(db, auth, {
    broadcastId: '',
    broadcastMessage: '',
    broadcastSender: '',
    broadcastAt: null,
  });
}

export const SIGN_IN_LINK_DESTINATIONS = [
  { value: 'all', label: 'Games Catalog' },
  { value: 'featured', label: 'Featured' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'movies', label: 'Movies', accessKey: 'moviesAccess' },
  { value: 'moremovies', label: 'More Movies', accessKey: 'moreMoviesAccess' },
  { value: 'moremoremovies', label: 'MoreMore Movies', accessKey: 'moreMoreMoviesAccess' },
  { value: 'youtube', label: 'YouTube', accessKey: 'youtubeAccess' },
  { value: 'lobbychat', label: 'Lobby Chat', accessKey: 'lobbyChatAccess' },
  { value: 'chat', label: 'AI Chat', accessKey: 'aiAccess' },
];

const VALID_SIGN_IN_DESTINATIONS = new Set(SIGN_IN_LINK_DESTINATIONS.map((d) => d.value));

export function normalizeSignInCode(raw) {
  let text = String(raw || '').trim();
  if (text.includes('?')) {
    try {
      const parsed = new URL(text, typeof window !== 'undefined' ? window.location.origin : 'https://example.com');
      text =
        parsed.searchParams.get('signin') ||
        parsed.searchParams.get('login') ||
        parsed.searchParams.get('autologin') ||
        text;
    } catch {}
  }
  const code = text
    .replace(/^\/+/, '')
    .replace(/\s+/g, '-')
    .trim();

  if (code.length < 3 || code.length > 48) {
    return {
      valid: false,
      code,
      codeLower: code.toLowerCase(),
      error: 'Custom link code must be between 3 and 48 characters.',
    };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
    return {
      valid: false,
      code,
      codeLower: code.toLowerCase(),
      error: 'Custom link code can only contain letters, numbers, hyphens (-), and underscores (_).',
    };
  }
  return {
    valid: true,
    code,
    codeLower: code.toLowerCase(),
    error: '',
  };
}

export function generateRandomSignInCode(username = '') {
  const prefix = String(username || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 12);
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  const length = 8;
  const bytes = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let suffix = '';
  for (let i = 0; i < length; i++) {
    suffix += chars[bytes[i] % chars.length];
  }
  return prefix ? `${prefix}-${suffix}` : `signin-${suffix}`;
}

export function buildSignInLinkUrl(code, requirePassword = false) {
  const clean = String(code || '').trim();
  if (!clean) return '';
  const suffix = requirePassword ? '/' : '';
  if (typeof window === 'undefined') return `?signin=${encodeURIComponent(clean)}${suffix}`;
  const basePath = window.location.protocol === 'file:' ? window.location.pathname : '/';
  return `${window.location.origin}${basePath}?signin=${encodeURIComponent(clean)}${suffix}`;
}

export function sanitizeSignInLinkDoc(docId, data) {
  if (!data) return null;
  const code = String(data.code || docId || '').trim();
  const codeLower = String(data.codeLower || docId || code).trim().toLowerCase();
  const defaultView = VALID_SIGN_IN_DESTINATIONS.has(data.defaultView) ? data.defaultView : 'all';
  return {
    id: docId,
    code,
    codeLower,
    accountId: String(data.accountId || '').trim().toLowerCase(),
    username: String(data.username || data.accountId || '').trim(),
    accountVerifier: String(data.accountVerifier || ''),
    label: String(data.label || 'Quick Sign-In').trim().slice(0, 40) || 'Quick Sign-In',
    defaultView,
    openInAboutBlank: Boolean(data.openInAboutBlank),
    requirePassword: Boolean(data.requirePassword),
    isActive: data.isActive !== false,
    useCount: Math.max(0, Math.round(Number(data.useCount || 0))),
    lastUsedAt: data.lastUsedAt ? Number(data.lastUsedAt) : null,
    createdAt: Number(data.createdAt || 0),
    updatedAt: Number(data.updatedAt || 0),
  };
}

export function subscribeToAccountSignInLinks(db, auth, accountId, onList, onError) {
  const cleanAccountId = String(accountId || '').trim().toLowerCase();
  if (!db || !cleanAccountId) return () => {};
  let unsub = () => {};
  let cancelled = false;

  ensureFirebaseAnonAuth(auth)
    .then(() => {
      if (cancelled) return;
      const q = query(
        collection(db, SIGN_IN_LINKS_COLLECTION),
        where('accountId', '==', cleanAccountId),
      );
      unsub = onSnapshot(
        q,
        (snapshot) => {
          const links = [];
          snapshot.forEach((docSnap) => {
            const parsed = sanitizeSignInLinkDoc(docSnap.id, docSnap.data());
            if (parsed) links.push(parsed);
          });
          links.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          onList(links);
        },
        (err) => {
          if (isFirestorePermissionError(err)) {
            try {
              handleFirestoreError(err, OperationType.LIST, SIGN_IN_LINKS_COLLECTION);
            } catch (wrappedErr) {
              if (onError) onError(wrappedErr);
              return;
            }
          }
          if (onError) onError(err);
        },
      );
    })
    .catch((err) => {
      if (onError) onError(err);
    });

  return () => {
    cancelled = true;
    try {
      unsub();
    } catch {}
  };
}

export async function createAccountSignInLink(db, auth, account, payload = {}) {
  if (!db) throw new Error('Database not connected.');
  const accountId = String(account?.usernameLower || '').trim().toLowerCase();
  const username = String(account?.username || accountId).trim();
  let accountVerifier = String(account?.passwordHash || '').trim();
  if (!accountId) {
    throw new Error('Sign in with a managed account to create instant sign-in links.');
  }

  const rawCode = payload.code ? String(payload.code) : generateRandomSignInCode(username);
  const norm = normalizeSignInCode(rawCode);
  if (!norm.valid) {
    throw new Error(norm.error);
  }

  const label = String(payload.label || 'Quick Sign-In').trim().slice(0, 40) || 'Quick Sign-In';
  const defaultView = VALID_SIGN_IN_DESTINATIONS.has(payload.defaultView) ? payload.defaultView : 'all';
  const openInAboutBlank = Boolean(payload.openInAboutBlank);
  const requirePassword = Boolean(payload.requirePassword);

  await ensureFirebaseAnonAuth(auth);

  if (!accountVerifier) {
    const accSnap = await getDoc(doc(db, ACCOUNTS_COLLECTION, accountId));
    if (!accSnap.exists()) throw new Error('Account record no longer exists.');
    accountVerifier = String(accSnap.data()?.passwordHash || '');
  }
  if (!accountVerifier) {
    throw new Error('Unable to verify account credentials for this link.');
  }

  const path = `${SIGN_IN_LINKS_COLLECTION}/${norm.codeLower}`;
  const ref = doc(db, SIGN_IN_LINKS_COLLECTION, norm.codeLower);
  let existingSnap;
  try {
    existingSnap = await getDoc(ref);
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, path);
    throw err;
  }

  if (existingSnap.exists()) {
    throw new Error(`Custom link code "${norm.code}" is already taken. Try a different code or click Randomize.`);
  }

  const now = Date.now();
  const record = {
    code: norm.code,
    codeLower: norm.codeLower,
    accountId,
    username,
    accountVerifier,
    label,
    defaultView,
    openInAboutBlank,
    requirePassword,
    isActive: true,
    useCount: 0,
    lastUsedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(ref, record);
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }

  return sanitizeSignInLinkDoc(norm.codeLower, record);
}

export async function toggleAccountSignInLink(db, auth, codeLower, isActive) {
  const cleanId = String(codeLower || '').trim().toLowerCase();
  if (!db || !cleanId) throw new Error('Link ID missing.');
  await ensureFirebaseAnonAuth(auth);
  const path = `${SIGN_IN_LINKS_COLLECTION}/${cleanId}`;
  try {
    await updateDoc(doc(db, SIGN_IN_LINKS_COLLECTION, cleanId), {
      isActive: Boolean(isActive),
      updatedAt: Date.now(),
    });
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function updateAccountSignInLinkRequirePassword(db, auth, codeLower, requirePassword) {
  const cleanId = String(codeLower || '').trim().toLowerCase();
  if (!db || !cleanId) throw new Error('Link ID missing.');
  await ensureFirebaseAnonAuth(auth);
  const path = `${SIGN_IN_LINKS_COLLECTION}/${cleanId}`;
  try {
    await updateDoc(doc(db, SIGN_IN_LINKS_COLLECTION, cleanId), {
      requirePassword: Boolean(requirePassword),
      updatedAt: Date.now(),
    });
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function deleteAccountSignInLink(db, auth, codeLower) {
  const cleanId = String(codeLower || '').trim().toLowerCase();
  if (!db || !cleanId) return;
  await ensureFirebaseAnonAuth(auth);
  const path = `${SIGN_IN_LINKS_COLLECTION}/${cleanId}`;
  try {
    await deleteDoc(doc(db, SIGN_IN_LINKS_COLLECTION, cleanId));
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

export async function authenticateWithSignInLink(db, auth, rawCode) {
  const norm = normalizeSignInCode(rawCode);
  if (!norm.valid) {
    throw new Error('This custom sign-in link is invalid.');
  }
  await ensureFirebaseAnonAuth(auth);

  const linkPath = `${SIGN_IN_LINKS_COLLECTION}/${norm.codeLower}`;
  const linkRef = doc(db, SIGN_IN_LINKS_COLLECTION, norm.codeLower);
  let linkSnap;
  try {
    linkSnap = await getDoc(linkRef);
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, linkPath);
    throw err;
  }

  if (!linkSnap.exists()) {
    throw new Error('This custom sign-in link does not exist or was deleted.');
  }

  const linkData = sanitizeSignInLinkDoc(linkSnap.id, linkSnap.data());
  if (!linkData || linkData.isActive === false) {
    throw new Error('This custom sign-in link has been paused by its owner.');
  }

  const accPath = `${ACCOUNTS_COLLECTION}/${linkData.accountId}`;
  const accRef = doc(db, ACCOUNTS_COLLECTION, linkData.accountId);
  let accSnap;
  try {
    accSnap = await getDoc(accRef);
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, accPath);
    throw err;
  }

  if (!accSnap.exists()) {
    throw new Error('The account for this custom sign-in link no longer exists.');
  }

  const accRaw = accSnap.data();
  if (accRaw.isActive === false) {
    throw new Error('This account has been disabled by an admin.');
  }

  if (!accRaw.passwordHash || accRaw.passwordHash !== linkData.accountVerifier) {
    throw new Error('This custom sign-in link expired because the account password was changed.');
  }

  const now = Date.now();
  const todayKey = getTodayDateKey(now);
  const nextSessionCount = Math.max(0, Math.round(Number(accRaw.sessionCount || 0))) + 1;
  const nextTodayTimeMs =
    accRaw.todayDateKey === todayKey ? Math.max(0, Math.round(Number(accRaw.todayTimeMs || 0))) : 0;

  try {
    await updateDoc(accRef, {
      lastLoginAt: now,
      lastSeenAt: now,
      lastActivityAt: now,
      sessionCount: nextSessionCount,
      todayDateKey: todayKey,
      todayTimeMs: nextTodayTimeMs,
      isOnline: true,
      updatedAt: now,
    });
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.UPDATE, accPath);
  }

  try {
    await updateDoc(linkRef, {
      useCount: Math.max(0, Math.round(Number(linkData.useCount || 0))) + 1,
      lastUsedAt: now,
      updatedAt: now,
    });
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.UPDATE, linkPath);
  }

  const account = sanitizeAccountDoc(accSnap.id, {
    ...accRaw,
    lastLoginAt: now,
    lastSeenAt: now,
    lastActivityAt: now,
    sessionCount: nextSessionCount,
    todayDateKey: todayKey,
    todayTimeMs: nextTodayTimeMs,
    isOnline: true,
    updatedAt: now,
  });

  return {
    account,
    link: {
      ...linkData,
      useCount: linkData.useCount + 1,
      lastUsedAt: now,
      updatedAt: now,
    },
  };
}

const IGNORED_URL_PREFIXES = [
  '/api/',
  '/assets/',
  '/gmfiles/',
  '/thumbnails/',
  '/websitedownload/',
  '/public/',
  '/src/',
  '/@vite/',
  '/@react-refresh',
  '/node_modules/',
];

const IGNORED_EXACT_PATHS = new Set([
  '',
  '/',
  '/index.html',
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico',
  '/manifest.json',
  '/sw.js',
]);

const STATIC_ASSET_EXT_RE = /\.(?:html?|js|mjs|jsx|ts|tsx|css|json|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|mp3|wav|ogg|mp4|webm|wasm|data|unityweb|txt|xml|map|webmanifest)$/i;

function safeDecodeUriSegment(raw) {
  try {
    return decodeURIComponent(String(raw || ''));
  } catch {
    return String(raw || '');
  }
}

function splitCombinedToken(rawVal) {
  const cleaned = String(rawVal || '').trim().replace(/^\/+/, '');
  if (!cleaned) return null;
  const slashIdx = cleaned.indexOf('/');
  if (slashIdx > 0) {
    const left = safeDecodeUriSegment(cleaned.slice(0, slashIdx)).trim();
    const right = safeDecodeUriSegment(cleaned.slice(slashIdx + 1).replace(/\/+$/, ''));
    if (left && right) {
      return { type: 'credentials', identifier: left, password: right, raw: cleaned };
    }
    if (left) {
      return { type: 'single_token', token: left, raw: cleaned };
    }
  }
  const colonIdx = cleaned.indexOf(':');
  if (colonIdx > 0) {
    const left = safeDecodeUriSegment(cleaned.slice(0, colonIdx)).trim();
    const right = safeDecodeUriSegment(cleaned.slice(colonIdx + 1));
    if (left && right) {
      return { type: 'credentials', identifier: left, password: right, raw: cleaned };
    }
  }
  return { type: 'single_token', token: safeDecodeUriSegment(cleaned), raw: cleaned };
}

export function parseUrlSignInRequest(loc = typeof window !== 'undefined' ? window.location : null) {
  if (!loc) return null;
  try {
    const searchParams = new URLSearchParams(loc.search || '');
    const rawHash = String(loc.hash || '').replace(/^#/, '');
    const hashLooksLikeQuery = /(?:signin|login|autologin|user|username|u|password|pass|p)=/i.test(rawHash);
    const hashParams = hashLooksLikeQuery ? new URLSearchParams(rawHash) : null;

    const getParam = (keys) => {
      for (const k of keys) {
        const v = searchParams.get(k);
        if (v !== null && v !== '') return v;
      }
      if (hashParams) {
        for (const k of keys) {
          const v = hashParams.get(k);
          if (v !== null && v !== '') return v;
        }
      }
      return '';
    };

    const querySignIn = getParam(['signin', 'login', 'autologin']);
    const queryUser = getParam(['user', 'username', 'u']).trim();
    const queryPass = getParam(['password', 'pass', 'p']);

    if (querySignIn.trim()) {
      const split = splitCombinedToken(querySignIn);
      if (split?.type === 'credentials') return split;
      if (split?.type === 'single_token') {
        if (queryPass) {
          return {
            type: 'credentials',
            identifier: split.token,
            password: queryPass,
            raw: `${split.token}/${queryPass}`,
          };
        }
        return split;
      }
    }

    if (queryUser && queryPass) {
      return {
        type: 'credentials',
        identifier: queryUser,
        password: queryPass,
        raw: `${queryUser}/${queryPass}`,
      };
    }

    const pathname = String(loc.pathname || '/');
    const lowerPath = pathname.toLowerCase();
    const isIgnoredPath =
      IGNORED_EXACT_PATHS.has(lowerPath) ||
      IGNORED_URL_PREFIXES.some((prefix) => lowerPath.startsWith(prefix)) ||
      STATIC_ASSET_EXT_RE.test(lowerPath);

    if (!isIgnoredPath) {
      const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');
      if (trimmedPath) {
        const rawSegments = trimmedPath.split('/');
        if (rawSegments.length === 1) {
          const split = splitCombinedToken(rawSegments[0]);
          if (split?.type === 'credentials') return split;
          if (split?.type === 'single_token') {
            if (queryPass) {
              return {
                type: 'credentials',
                identifier: split.token,
                password: queryPass,
                raw: `${split.token}/${queryPass}`,
              };
            }
            return split;
          }
        } else if (rawSegments.length >= 2) {
          const firstLower = rawSegments[0].toLowerCase();
          if (firstLower === 'signin' || firstLower === 'login') {
            if (rawSegments.length === 2) {
              const split = splitCombinedToken(rawSegments[1]);
              if (split?.type === 'credentials') return split;
              if (split?.type === 'single_token') {
                if (queryPass) {
                  return {
                    type: 'credentials',
                    identifier: split.token,
                    password: queryPass,
                    raw: `${split.token}/${queryPass}`,
                  };
                }
                return split;
              }
            } else {
              const identifier = safeDecodeUriSegment(rawSegments[1]).trim();
              const pw = rawSegments.slice(2).map(safeDecodeUriSegment).join('/');
              if (identifier && pw) {
                return { type: 'credentials', identifier, password: pw, raw: trimmedPath };
              }
            }
          } else {
            const identifier = safeDecodeUriSegment(rawSegments[0]).trim();
            const pw = rawSegments.slice(1).map(safeDecodeUriSegment).join('/');
            if (identifier && pw) {
              return { type: 'credentials', identifier, password: pw, raw: trimmedPath };
            }
          }
        }
      }
    }

    if (queryPass) {
      if (queryUser) {
        return {
          type: 'credentials',
          identifier: queryUser,
          password: queryPass,
          raw: `${queryUser}/${queryPass}`,
        };
      }
      return {
        type: 'password_only',
        password: queryPass,
        raw: queryPass,
      };
    }

    if (queryUser) {
      return {
        type: 'single_token',
        token: queryUser,
        raw: queryUser,
      };
    }

    return null;
  } catch {
    return null;
  }
}

async function completeDirectLoginUpdate(db, docSnap, rawPassword, linkData = null) {
  const data = docSnap.data();
  const now = Date.now();
  const todayKey = getTodayDateKey(now);
  const nextSessionCount = Math.max(0, Math.round(Number(data.sessionCount || 0))) + 1;
  const nextTodayTimeMs =
    data.todayDateKey === todayKey ? Math.max(0, Math.round(Number(data.todayTimeMs || 0))) : 0;
  let nextEncryptedPassword = typeof data.encryptedPassword === 'string' ? data.encryptedPassword : '';
  const loginPatch = {
    lastLoginAt: now,
    lastSeenAt: now,
    lastActivityAt: now,
    sessionCount: nextSessionCount,
    todayDateKey: todayKey,
    todayTimeMs: nextTodayTimeMs,
    isOnline: true,
    updatedAt: now,
  };
  if (!nextEncryptedPassword && rawPassword) {
    const encrypted = await encryptAdminPassword(rawPassword);
    if (encrypted) {
      nextEncryptedPassword = encrypted;
      loginPatch.encryptedPassword = encrypted;
    }
  }
  const accPath = `${ACCOUNTS_COLLECTION}/${docSnap.id}`;
  try {
    await updateDoc(doc(db, ACCOUNTS_COLLECTION, docSnap.id), loginPatch);
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.UPDATE, accPath);
  }

  let updatedLink = null;
  if (linkData) {
    const linkPath = `${SIGN_IN_LINKS_COLLECTION}/${linkData.codeLower}`;
    try {
      await updateDoc(doc(db, SIGN_IN_LINKS_COLLECTION, linkData.codeLower), {
        useCount: Math.max(0, Math.round(Number(linkData.useCount || 0))) + 1,
        lastUsedAt: now,
        updatedAt: now,
      });
    } catch (err) {
      if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.UPDATE, linkPath);
    }
    updatedLink = {
      ...linkData,
      useCount: Math.max(0, Math.round(Number(linkData.useCount || 0))) + 1,
      lastUsedAt: now,
      updatedAt: now,
    };
  }

  const account = sanitizeAccountDoc(docSnap.id, {
    ...data,
    ...loginPatch,
    encryptedPassword: nextEncryptedPassword,
  });

  return { account, link: updatedLink };
}

export async function authenticateByPasswordOnly(db, auth, rawPassword) {
  const password = String(rawPassword || '');
  if (!password) {
    throw new Error('Please enter a password.');
  }
  await ensureFirebaseAnonAuth(auth);

  let snapshot;
  try {
    snapshot = await getDocs(collection(db, ACCOUNTS_COLLECTION));
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.LIST, ACCOUNTS_COLLECTION);
    throw err;
  }

  const activeMatches = [];
  const disabledMatches = [];

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (!data || !data.passwordHash) continue;

    let isMatch = false;
    if (data.encryptedPassword) {
      const decrypted = await decryptAdminPassword(data.encryptedPassword);
      if (decrypted && decrypted === password) {
        isMatch = true;
      }
    } else {
      const computed = await hashPassword(password, data.passwordSalt || '');
      if (computed === data.passwordHash) {
        isMatch = true;
      }
    }

    if (isMatch) {
      if (data.isActive === false) {
        disabledMatches.push(docSnap);
      } else {
        activeMatches.push(docSnap);
      }
    }
  }

  if (activeMatches.length === 1) {
    return completeDirectLoginUpdate(db, activeMatches[0], password, null);
  }
  if (activeMatches.length > 1) {
    throw Object.assign(
      new Error('Multiple accounts use that password. Add your username before your password (example: /username/password).'),
      { code: 'AMBIGUOUS_PASSWORD' },
    );
  }
  if (disabledMatches.length > 0) {
    throw new Error('This account has been disabled by an admin.');
  }
  throw new Error('No account matched that password or sign-in link.');
}

export async function authenticateFromUrlRequest(db, auth, urlReq) {
  if (!urlReq) {
    throw new Error('No sign-in information found in the URL.');
  }
  await ensureFirebaseAnonAuth(auth);

  if (urlReq.type === 'password_only') {
    return authenticateByPasswordOnly(db, auth, urlReq.password);
  }

  if (urlReq.type === 'credentials') {
    const identifier = String(urlReq.identifier || '').trim();
    const password = String(urlReq.password || '');
    if (!identifier || !password) {
      throw new Error('Please include both a username (or link code) and password.');
    }

    // First check if identifier matches a custom SignInLink code
    const codeNorm = normalizeSignInCode(identifier);
    if (codeNorm.valid) {
      const linkPath = `${SIGN_IN_LINKS_COLLECTION}/${codeNorm.codeLower}`;
      let linkSnap;
      try {
        linkSnap = await getDoc(doc(db, SIGN_IN_LINKS_COLLECTION, codeNorm.codeLower));
      } catch (err) {
        if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, linkPath);
        throw err;
      }

      if (linkSnap.exists()) {
        const linkData = sanitizeSignInLinkDoc(linkSnap.id, linkSnap.data());
        if (!linkData || linkData.isActive === false) {
          throw new Error('This custom sign-in link has been paused by its owner.');
        }
        const accPath = `${ACCOUNTS_COLLECTION}/${linkData.accountId}`;
        let accSnap;
        try {
          accSnap = await getDoc(doc(db, ACCOUNTS_COLLECTION, linkData.accountId));
        } catch (err) {
          if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, accPath);
          throw err;
        }
        if (!accSnap.exists()) {
          throw new Error('The account for this custom sign-in link no longer exists.');
        }
        const accRaw = accSnap.data();
        if (accRaw.isActive === false) {
          throw new Error('This account has been disabled by an admin.');
        }
        if (!accRaw.passwordHash || accRaw.passwordHash !== linkData.accountVerifier) {
          throw new Error('This custom sign-in link expired because the account password was changed.');
        }
        const computed = await hashPassword(password, accRaw.passwordSalt || '');
        if (computed !== accRaw.passwordHash) {
          throw Object.assign(
            new Error(`Incorrect password for @${linkData.username}.`),
            { code: 'INVALID_PASSWORD', username: linkData.username },
          );
        }
        return completeDirectLoginUpdate(db, accSnap, password, linkData);
      }
    }

    // Otherwise authenticate as username + password
    const account = await authenticateAccount(db, auth, identifier, password);
    return { account, link: null };
  }

  // single_token: check custom SignInLink first, then /<username> direct login, then password-only fallback
  if (urlReq.type === 'single_token') {
    const token = String(urlReq.token || '').trim();
    if (!token) {
      throw new Error('Invalid sign-in link.');
    }

    const codeNorm = normalizeSignInCode(token);
    if (codeNorm.valid) {
      const linkPath = `${SIGN_IN_LINKS_COLLECTION}/${codeNorm.codeLower}`;
      let linkSnap;
      try {
        linkSnap = await getDoc(doc(db, SIGN_IN_LINKS_COLLECTION, codeNorm.codeLower));
      } catch (err) {
        if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, linkPath);
        throw err;
      }

      if (linkSnap.exists()) {
        const linkData = sanitizeSignInLinkDoc(linkSnap.id, linkSnap.data());
        if (!linkData || linkData.isActive === false) {
          throw new Error('This custom sign-in link has been paused by its owner.');
        }
        if (linkData.requirePassword) {
          throw Object.assign(
            new Error(`This link requires your password at the end (?signin=${linkData.code}/YOUR_PASSWORD). Enter your password below to sign in as @${linkData.username}.`),
            { code: 'PASSWORD_REQUIRED', username: linkData.username, linkCode: linkData.code },
          );
        }
        return authenticateWithSignInLink(db, auth, codeNorm.codeLower);
      }
    }

    const userNorm = normalizeUsername(token);
    if (userNorm.valid) {
      const accPath = `${ACCOUNTS_COLLECTION}/${userNorm.usernameLower}`;
      let accSnap;
      try {
        accSnap = await getDoc(doc(db, ACCOUNTS_COLLECTION, userNorm.usernameLower));
      } catch (err) {
        if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.GET, accPath);
        throw err;
      }

      if (accSnap.exists()) {
        const accRaw = accSnap.data();
        const accName = accRaw?.username || userNorm.username;
        if (accRaw?.isActive === false) {
          throw new Error('This account has been disabled by an admin.');
        }
        if (accRaw?.requirePasswordOnUrl) {
          throw Object.assign(
            new Error(`Password protection is enabled for @${accName}. Add /${'<password>'} at the end (/${accName}/YOUR_PASSWORD) or enter your password below.`),
            { code: 'PASSWORD_REQUIRED', username: accName },
          );
        }
        return completeDirectLoginUpdate(db, accSnap, '', null);
      }
    }

    return authenticateByPasswordOnly(db, auth, token);
  }

  throw new Error('Invalid sign-in link.');
}

