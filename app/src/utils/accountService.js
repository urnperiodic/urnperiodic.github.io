import { signInAnonymously } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  OperationType,
  handleFirestoreError,
  isFirestorePermissionError,
} from '../firebase';

export const ACCOUNTS_COLLECTION = 'siteAccounts';
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
  'youtube',
  'lobbychat',
  'ai',
  'catalog',
];

export const ACTIVITY_LABELS = {
  games: 'Games',
  movies: 'Movies',
  moremovies: 'More Movies',
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
    isActive: data.isActive !== false,
    isAdmin: Boolean(data.isAdmin),
    allowGlobalOverride: Boolean(data.allowGlobalOverride),
    allowAiOverride: Boolean(data.allowAiOverride),
    gamesAccess: data.gamesAccess !== false,
    moviesAccess: data.moviesAccess !== false,
    moreMoviesAccess: data.moreMoviesAccess !== false,
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
  try {
    await updateDoc(ref, {
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
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.UPDATE, path);
  }

  return sanitizeAccountDoc(snap.id, {
    ...data,
    lastLoginAt: now,
    lastSeenAt: now,
    lastActivityAt: now,
    sessionCount: nextSessionCount,
    todayDateKey: todayKey,
    todayTimeMs: nextTodayTimeMs,
    isOnline: true,
    updatedAt: now,
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
  const now = Date.now();

  const record = {
    username: norm.username,
    usernameLower: norm.usernameLower,
    passwordSalt: salt,
    passwordHash,
    isActive: payload.isActive !== false,
    isAdmin: Boolean(payload.isAdmin),
    allowGlobalOverride: Boolean(payload.allowGlobalOverride),
    allowAiOverride: Boolean(payload.allowAiOverride),
    gamesAccess: payload.gamesAccess !== false,
    moviesAccess: payload.moviesAccess !== false,
    moreMoviesAccess: payload.moreMoviesAccess !== false,
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
  if (typeof updates.youtubeAccess === 'boolean') patch.youtubeAccess = updates.youtubeAccess;
  if (typeof updates.lobbyChatAccess === 'boolean') patch.lobbyChatAccess = updates.lobbyChatAccess;
  if (typeof updates.aiAccess === 'boolean') patch.aiAccess = updates.aiAccess;
  if (typeof updates.decoysAccess === 'boolean') patch.decoysAccess = updates.decoysAccess;
  if (typeof updates.downloadAccess === 'boolean') patch.downloadAccess = updates.downloadAccess;
  if (typeof updates.chatMuted === 'boolean') patch.chatMuted = updates.chatMuted;
  if (typeof updates.chatBanned === 'boolean') patch.chatBanned = updates.chatBanned;
  if (typeof updates.defaultGirlsTheme === 'boolean') patch.defaultGirlsTheme = updates.defaultGirlsTheme;
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
  if (!db || !usernameLower) return;
  const path = `${ACCOUNTS_COLLECTION}/${usernameLower}`;
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
    await updateDoc(doc(db, ACCOUNTS_COLLECTION, usernameLower), patch);
  } catch (err) {
    if (isFirestorePermissionError(err)) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }
}

export async function recordAccountUsageHeartbeat(db, auth, usernameLower, stats) {
  if (!db || !usernameLower || !stats) return;
  const path = `${ACCOUNTS_COLLECTION}/${usernameLower}`;
  try {
    await ensureFirebaseAnonAuth(auth);
    const now = Date.now();
    const patch = {
      isOnline: stats.isOnline !== false,
      lastSeenAt: now,
      lastActivityAt: now,
      updatedAt: now,
      totalTimeMs: Math.max(0, Math.round(Number(stats.totalTimeMs || 0))),
      todayTimeMs: Math.max(0, Math.round(Number(stats.todayTimeMs || 0))),
      todayDateKey: typeof stats.todayDateKey === 'string' ? stats.todayDateKey.slice(0, 16) : getTodayDateKey(now),
      currentActivity: stats.isOnline === false ? '' : String(stats.currentActivity || '').trim().slice(0, 100),
      activityTimeMs: sanitizeActivityTimeMs(stats.activityTimeMs),
    };
    if (typeof stats.sessionCount === 'number' && Number.isFinite(stats.sessionCount) && stats.sessionCount >= 0) {
      patch.sessionCount = Math.round(stats.sessionCount);
    }
    await updateDoc(doc(db, ACCOUNTS_COLLECTION, usernameLower), patch);
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
