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
export const ACCOUNT_SESSION_KEY = 'urnperiodic-account-session';
export const CHAT_LINKED_ACCOUNT_KEY = 'urnperiodic_chat_account';

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
  allowSharedPasscodes: true,
  gamesAccess: true,
  moviesAccess: true,
  moreMoviesAccess: true,
  youtubeAccess: true,
  lobbyChatAccess: true,
  aiAccess: true,
  decoysAccess: true,
  downloadAccess: true,
  updatedAt: 0,
};

export function sanitizeWorkspaceConfig(data) {
  if (!data) return { ...DEFAULT_WORKSPACE_CONFIG };
  return {
    siteLockdown: Boolean(data.siteLockdown),
    lockdownMessage:
      typeof data.lockdownMessage === 'string' && data.lockdownMessage.trim()
        ? data.lockdownMessage.trim().slice(0, 200)
        : DEFAULT_WORKSPACE_CONFIG.lockdownMessage,
    allowSharedPasscodes: data.allowSharedPasscodes !== false,
    gamesAccess: data.gamesAccess !== false,
    moviesAccess: data.moviesAccess !== false,
    moreMoviesAccess: data.moreMoviesAccess !== false,
    youtubeAccess: data.youtubeAccess !== false,
    lobbyChatAccess: data.lobbyChatAccess !== false,
    aiAccess: data.aiAccess !== false,
    decoysAccess: data.decoysAccess !== false,
    downloadAccess: data.downloadAccess !== false,
    updatedAt: Number(data.updatedAt || 0),
  };
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

export function sanitizeAccountDoc(docId, data) {
  if (!data) return null;
  const badgeColor = BADGE_COLORS[data.badgeColor] ? data.badgeColor : 'cyan';
  return {
    id: docId,
    username: String(data.username || docId),
    usernameLower: String(data.usernameLower || docId).toLowerCase(),
    passwordHash: String(data.passwordHash || ''),
    isActive: data.isActive !== false,
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
    favorites: Array.isArray(data.favorites) ? data.favorites.filter((x) => typeof x === 'string') : [],
    recentlyPlayed: Array.isArray(data.recentlyPlayed) ? data.recentlyPlayed.filter((x) => typeof x === 'string').slice(0, 30) : [],
    preferredTheme: typeof data.preferredTheme === 'string' ? data.preferredTheme : null,
    preferredMode: data.preferredMode === 'light' || data.preferredMode === 'dark' ? data.preferredMode : null,
    createdAt: Number(data.createdAt || 0),
    updatedAt: Number(data.updatedAt || 0),
    lastLoginAt: data.lastLoginAt ? Number(data.lastLoginAt) : null,
  };
}

export function toPublicChatAccount(account) {
  if (!account) return null;
  return {
    username: account.username,
    usernameLower: account.usernameLower,
    isActive: account.isActive !== false,
    roleBadge: account.roleBadge || '',
    badgeColor: account.badgeColor || 'cyan',
    chatMuted: Boolean(account.chatMuted),
    chatBanned: Boolean(account.chatBanned),
  };
}

export function saveAccountSession(account) {
  if (!account) return;
  const sessionPayload = {
    usernameLower: account.usernameLower,
    verifier: account.passwordHash,
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(sessionPayload));
  } catch {}
  try {
    sessionStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(sessionPayload));
  } catch {}
  syncChatLinkedAccountStorage(account);
}

export function getSavedAccountSession() {
  try {
    const raw = sessionStorage.getItem(ACCOUNT_SESSION_KEY) || localStorage.getItem(ACCOUNT_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.usernameLower && parsed.verifier) {
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
    const iframe = document.getElementById('chat-decoy-iframe');
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
  try {
    await updateDoc(ref, { lastLoginAt: now });
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.UPDATE, path);
  }

  return sanitizeAccountDoc(snap.id, { ...data, lastLoginAt: now });
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
    gamesAccess: payload.gamesAccess !== false,
    moviesAccess: payload.moviesAccess !== false,
    moreMoviesAccess: payload.moreMoviesAccess !== false,
    youtubeAccess: payload.youtubeAccess !== false,
    lobbyChatAccess: payload.lobbyChatAccess !== false,
    aiAccess: Boolean(payload.aiAccess),
    decoysAccess: Boolean(payload.decoysAccess),
    downloadAccess: payload.downloadAccess !== false,
    chatMuted: Boolean(payload.chatMuted),
    chatBanned: Boolean(payload.chatBanned),
    roleBadge: String(payload.roleBadge || '').trim().slice(0, 20),
    badgeColor: BADGE_COLORS[payload.badgeColor] ? payload.badgeColor : 'cyan',
    favorites: [],
    recentlyPlayed: [],
    preferredTheme: null,
    preferredMode: null,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null,
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
  if (typeof updates.roleBadge === 'string') patch.roleBadge = updates.roleBadge.trim().slice(0, 20);
  if (typeof updates.badgeColor === 'string' && BADGE_COLORS[updates.badgeColor]) {
    patch.badgeColor = updates.badgeColor;
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
    await updateDoc(doc(db, ACCOUNTS_COLLECTION, usernameLower), patch);
  } catch (err) {
    if (isFirestorePermissionError(err)) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
    console.warn('Account user data sync warning:', err);
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
            onUpdate({ ...DEFAULT_WORKSPACE_CONFIG });
            return;
          }
          onUpdate(sanitizeWorkspaceConfig(snap.data()));
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
    return next;
  } catch (err) {
    if (isFirestorePermissionError(err)) handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}
