import { lazy, Suspense, useDeferredValue, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { signInAnonymously } from 'firebase/auth';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { lobbyAuth, lobbyDb, handleFirestoreError, isFirestorePermissionError, OperationType } from './firebase';
import { decryptChatPayload, deleteAllChatMessages } from './utils/chatModeration';
import { getActiveMutedUsers, isSenderMuted, subscribeUserMutes } from './utils/userMute';
import { PUBLIC_GAMES_BASE_URL, resolvePublicFileUrl } from './data/gameSource';
import { GMFILES_PATH_LOOKUP } from './data/gmfilesPaths';
import { gameRankings } from './data/gameRankings';
import { WHATS_NEW_SENTENCE, WHATS_NEW_CHANGES, WHATS_NEW_VERSION } from './whatsNewData';
const GAMES_PER_PAGE = 36;
const MAX_CACHED_GAMES = 2; // Strict LRU cap to keep memory low on low-spec hardware
const gameHtmlCache = new Map();
const setCachedGameHtml = (url, data) => {
  if (gameHtmlCache.size >= MAX_CACHED_GAMES) {
    const oldestKey = gameHtmlCache.keys().next().value;
    if (oldestKey) gameHtmlCache.delete(oldestKey);
  }
  gameHtmlCache.set(url, data);
};
const GAME_RUNTIME_SHIM = `<script>
  function poki_init_raw() { return false; }
  function poki_commercial_break_raw() {}
  function poki_rewarded_break_raw() {}
  function poki_script_closure_raw() {}
  function poki_get_team_raw() { return ''; }
  function poki_set_team_raw() {}
  window.poki_init_raw = poki_init_raw;
  window.poki_commercial_break_raw = poki_commercial_break_raw;
  window.poki_rewarded_break_raw = poki_rewarded_break_raw;
  window.poki_script_closure_raw = poki_script_closure_raw;
  window.poki_get_team_raw = poki_get_team_raw;
  window.poki_set_team_raw = poki_set_team_raw;
  try {
    window.onbeforeunload = null;
    const origAdd = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
      if (type === 'beforeunload') return;
      return origAdd.call(this, type, listener, options);
    };
  } catch(e) {}
  try {
    const origReq = Element.prototype.requestPointerLock || Element.prototype.mozRequestPointerLock || Element.prototype.webkitRequestPointerLock;
    if (origReq) {
      Element.prototype.requestPointerLock = function(options) {
        try { window.focus(); } catch(e) {}
        try {
          const res = origReq.call(this, options);
          if (res && typeof res.catch === 'function') {
            return res.catch(() => {
              if (options) {
                try { return origReq.call(this); } catch(e) {}
              }
            });
          }
          return res;
        } catch (err) {
          if (options) {
            try { return origReq.call(this); } catch(e) {}
          }
        }
      };
    }
    const syncCursorLock = () => {
      const lockedEl = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
      if (lockedEl) {
        try { lockedEl.style.setProperty('cursor', 'none', 'important'); } catch(e) {}
        try { document.documentElement.style.setProperty('cursor', 'none', 'important'); } catch(e) {}
        try { if (document.body) document.body.style.setProperty('cursor', 'none', 'important'); } catch(e) {}
      } else {
        try { document.documentElement.style.removeProperty('cursor'); } catch(e) {}
        try { if (document.body) document.body.style.removeProperty('cursor'); } catch(e) {}
      }
    };
    document.addEventListener('pointerlockchange', syncCursorLock, false);
    document.addEventListener('mozpointerlockchange', syncCursorLock, false);
    document.addEventListener('webkitpointerlockchange', syncCursorLock, false);
  } catch(e) {}
</script>`;

const prepareGameHtml = (html, baseUrl) => {
  const hasBaseUrl = /<base(?:\s[^>]*)?>/i.test(html);
  const baseTag = hasBaseUrl ? '' : `<base href="${baseUrl}">`;
  const runtimeShim = GAME_RUNTIME_SHIM;
  if (/<head(?:\s[^>]*)?>/i.test(html)) {
    return html.replace(/<head(\s[^>]*)?>/i, (head) => `${head}${baseTag}${runtimeShim}`);
  }
  return `${baseTag}${runtimeShim}${html}`;
};

const createGameLoadErrorDocument = (url) => ({
  srcDoc: `<html><body style="margin:0;background:#080b12;color:#e5e7eb;font:16px sans-serif;display:grid;place-items:center;min-height:100vh;text-align:center"><main><h2>Portal could not be loaded</h2><p>The remote portal file did not respond.</p><a href="${url}" target="_blank" rel="noreferrer" style="color:#60a5fa">Open source piece</a></main></body></html>`
});

const loadGameFrame = async (url, signal) => {
  if (!url) return { src: '' };
  if (/^https?:\/\//i.test(url)) return { src: url };

  const normalizedUrl = url.startsWith('/') ? url : resolvePublicFileUrl(url, 'Gmfiles');
  const isLocalHtml =
    normalizedUrl.startsWith(PUBLIC_GAMES_BASE_URL) ||
    /\.html?(\?|#|$)/i.test(normalizedUrl);

  if (!isLocalHtml) return { src: normalizedUrl };

  const loadHtml = async (sourceUrl) => {
    const response = await fetch(sourceUrl, { signal });
    if (!response.ok) throw new Error(`Portal file request failed: ${response.status}`);
    const html = await response.text();
    // Guard against Vite/Express SPA fallback returning the main app's index.html
    if (html.includes('<div id="root"></div>') && (html.includes('/src/main.') || html.includes('Study Tools'))) {
      throw new Error('SPA fallback returned instead of portal HTML');
    }
    const baseUrl = sourceUrl.slice(0, sourceUrl.lastIndexOf('/') + 1);
    return prepareGameHtml(html, baseUrl);
  };

  const filename = decodeURIComponent(
    new URL(normalizedUrl, window.location.origin).pathname.split('/').pop() || ''
  );
  const mappedSubpath =
    GMFILES_PATH_LOOKUP[filename] ||
    Object.entries(GMFILES_PATH_LOOKUP).find(([k]) => k.toLowerCase() === filename.toLowerCase())?.[1];

  const candidatePaths = Array.from(
    new Set(
      [
        normalizedUrl,
        resolvePublicFileUrl(filename),
        mappedSubpath ? `${PUBLIC_GAMES_BASE_URL}${mappedSubpath}` : null,
        filename ? `/${filename}` : null,
        filename ? `/Gmfiles/${filename}` : null,
        filename ? `/Gmfiles/html5-games/${filename}` : null,
        filename ? `/Gmfiles/flash/${filename}` : null,
        filename ? `/Gmfiles/html5-games/eagler/${filename}` : null,
        filename ? `/Gmfiles/html5-games/fnf/${filename}` : null,
        filename ? `/Gmfiles/gba/${filename}` : null,
        filename ? `/Gmfiles/nds/${filename}` : null,
        filename ? `/Gmfiles/n64/${filename}` : null,
        filename ? `/Gmfiles/snes/${filename}` : null,
        filename ? `/Gmfiles/nes/${filename}` : null,
        filename ? `/Gmfiles/pokemon/${filename}` : null,
        filename ? `/Gmfiles/segaMD/${filename}` : null,
        filename ? `/Gmfiles/psx/${filename}` : null,
        filename ? `/Gmfiles/arcade/${filename}` : null,
        filename ? `/Gmfiles/dos/${filename}` : null,
        filename ? `/iframe/${filename}` : null,
      ].filter(Boolean)
    )
  );

  let lastError = null;
  for (const candidate of candidatePaths) {
    try {
      const targetUrl = candidate.startsWith('http')
        ? candidate
        : `${window.location.origin}${candidate.startsWith('/') ? '' : '/'}${candidate}`;
      const srcDoc = await loadHtml(targetUrl);
      return { srcDoc };
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      lastError = error;
    }
  }

  throw lastError || new Error('Portal file could not be resolved');
};
import { initialArticles } from './data/articles';
import {
  FlashcardsWorkspace,
  QuizWorkspace,
  NotesWorkspace,
  StudyTimer,
  AiChatWorkspace,
  PortalWorkspaceView,
  isPortalWorkspaceFilter,
  getWorkspaceExternalUrl,
  getWorkspaceAboutBlankTitle,
  getWorkspaceAboutBlankTargetUrl,
} from './components/Workspaces';
import UserChat from './components/UserChat';
import AccountModal from './components/AccountModal';
import AdminAccountsModal from './components/AdminAccountsModal';
import {
  ACCOUNT_SESSION_KEY,
  AUTO_SIGNOUT_IDLE_KEY,
  DEFAULT_WORKSPACE_CONFIG,
  INACTIVITY_TIMEOUT_MS,
  LAST_ACTIVITY_KEY,
  authenticateAccount,
  authenticateFromUrlRequest,
  clearAccountSession,
  clearSessionActivity,
  getCachedWorkspaceConfig,
  getLastSessionActivity,
  getRememberedLocalUsers,
  getSavedAccountSession,
  getTodayDateKey,
  isAutoSignOutOnIdleEnabled,
  isSessionInactiveExpired,
  parseUrlSignInRequest,
  recordAccountUsageHeartbeat,
  removeRememberedLocalUser,
  sanitizeActivityTimeMs,
  saveAccountSession,
  saveRememberedLocalUser,
  sanitizeAccountSettings,
  subscribeToAccount,
  subscribeToWorkspaceConfig,
  syncAccountUserData,
  syncChatLinkedAccountStorage,
  touchSessionActivity,
  updateAccountPresence,
  verifySessionAccount,
} from './utils/accountService';
import InformationSection from './components/InformationSection';

function LobbyUnreadIndicator({ visible }) {
  if (!visible) return null;
  return (
    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 pointer-events-none z-30" aria-label="New lobby message">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-[var(--bg-secondary)] shadow-[0_0_8px_rgba(239,68,68,0.9)]"></span>
    </span>
  );
}
import { 
  School, 
  Search, 
  Play,
  Info, 
  ExternalLink, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Expand,
  Shrink,
  Plus, 
  Minus, 
  Heart, 
  ShieldAlert, 
  Gamepad2, 
  Users, 
  Layers,
  Sparkles,
  ArrowLeft,
  Volume2,
  Tv,
  Film,
  MessageCircle,
  MessageSquare,
  Globe,
  Dribbble,
  BookOpen,
  Github,
  Compass,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  LogOut,
  Copy,
  Code,
  Share2,
  Download,
  Upload,
  Settings,
  Bell,
  Check,
  X,
  Cpu,
  Box,
  Mail,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  History,
  Shuffle,
  Timer,
  Dices,
  GripVertical,
  Crown,
  Trophy,
  Medal,
  Calculator,
  Palette,
  Trash2,
  User,
  LogIn,
  Link2,
  KeyRound,
  LayoutGrid,
  Grid3X3,
  Megaphone
} from 'lucide-react';

// Safe storage helper to prevent SecurityError crash in sandboxed iframes
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Ignore security errors
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore security errors
    }
  }
};

// Safe session storage helper for per-tab session state (persists across reloads, clears when tab is closed)
const safeSessionStorage = {
  getItem: (key) => {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      // Ignore security errors
    }
  },
  removeItem: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      // Ignore security errors
    }
  }
};

const OWNER_SESSION_KEY = 'urnperiodic-owner-session';
const getSavedOwnerSession = () => {
  try {
    const raw = safeStorage.getItem(OWNER_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.active) {
        if (isSessionInactiveExpired(parsed.ts)) {
          safeSessionStorage.removeItem(OWNER_SESSION_KEY);
          safeStorage.removeItem(OWNER_SESSION_KEY);
          return false;
        }
        safeSessionStorage.setItem(OWNER_SESSION_KEY, 'true');
        return true;
      }
    }
    if (safeSessionStorage.getItem(OWNER_SESSION_KEY) === 'true') {
      if (isSessionInactiveExpired()) {
        safeSessionStorage.removeItem(OWNER_SESSION_KEY);
        safeStorage.removeItem(OWNER_SESSION_KEY);
        return false;
      }
      return true;
    }
  } catch {}
  return false;
};

const saveOwnerSessionFlag = () => {
  const now = touchSessionActivity(true);
  safeSessionStorage.setItem(OWNER_SESSION_KEY, 'true');
  try {
    safeStorage.setItem(OWNER_SESSION_KEY, JSON.stringify({ active: true, ts: now }));
  } catch {}
  saveRememberedLocalUser({
    username: 'Admin',
    usernameLower: 'owner',
    roleBadge: 'Owner',
    isAdmin: true,
    isOwnerAdmin: true,
  });
};

const clearOwnerSessionFlag = () => {
  safeSessionStorage.removeItem(OWNER_SESSION_KEY);
  safeStorage.removeItem(OWNER_SESSION_KEY);
};

const isLocalGame = (url) => {
  return url && !url.startsWith('http://') && !url.startsWith('https://');
};

const getLocalGameDownloadUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${window.location.origin}${url}`;
  return `${window.location.origin}/${url}`;
};

const getDirectGmfilesUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  let cleanName = url.replace(/^\/+/, '').replace(/^public\//i, '');
  if (cleanName.toLowerCase().startsWith('iframe/')) {
    return `https://urnperiodic.github.io/public/${cleanName}`;
  }
  if (cleanName.toLowerCase().startsWith('gmfiles/')) {
    cleanName = cleanName.slice(8);
  }
  if (!cleanName.includes('/')) {
    const mapped =
      GMFILES_PATH_LOOKUP[cleanName] ||
      Object.entries(GMFILES_PATH_LOOKUP).find(([k]) => k.toLowerCase() === cleanName.toLowerCase())?.[1];
    if (mapped) {
      cleanName = mapped;
    }
  }
  return `https://urnperiodic.github.io/Gmfiles/${cleanName}`;
};

const getGamePathName = (url) => {
  if (!url) return '';
  const cleanedUrl = url.split('?')[0].split('#')[0];
  const filename = cleanedUrl.split('/').pop() || cleanedUrl;
  return filename.replace(/\.html?$/i, '');
};

const copyTextToClipboard = async (text) => {
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy text:', error);
  }
};

const THEME_OPTIONS = [
  { key: 'cyborg', name: 'Cyborg', color: 'bg-green-500 border-green-300 shadow-[0_0_8px_rgba(34,197,94,0.65)]', tooltip: 'Cyborg (Green Glow)' },
  { key: 'sunset', name: 'Sunset', color: 'bg-amber-500 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]', tooltip: 'Sunset (Warm Amber)' },
  { key: 'midnight', name: 'Midnight', color: 'bg-indigo-600 border-indigo-400 shadow-[0_0_8px_rgba(79,70,229,0.6)]', tooltip: 'Midnight (Deep Blue)' },
  { key: 'forest', name: 'Forest', color: 'bg-emerald-500 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.6)]', tooltip: 'Forest (Emerald Mint)' },
  { key: 'violet', name: 'Violet', color: 'bg-purple-500 border-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.6)]', tooltip: 'Violet (Purple)' },
  { key: 'ice', name: 'Glacier', color: 'bg-sky-400 border-sky-200 shadow-[0_0_8px_rgba(56,189,248,0.6)]', tooltip: 'Glacier (Ice Blue)' },
  { key: 'rose-pine', name: 'Rose Pine', color: 'bg-rose-400 border-rose-200 shadow-[0_0_8px_rgba(251,113,133,0.6)]', tooltip: 'Rose Pine (Pastel Pink)' },
  { key: 'girls', name: 'Girls', color: 'bg-pink-400 border-pink-200 shadow-[0_0_8px_rgba(244,114,182,0.75)]', tooltip: 'Girls (Blush Pink)' },
  { key: 'none', name: 'Monochrome', color: 'bg-neutral-300 border-neutral-400 shadow-[0_0_6px_rgba(212,212,212,0.4)]', tooltip: 'Monochrome (Black & White)' }
];

function ThemeDropdown({ theme, setTheme, mode, lockedTheme = null, onSelectTheme = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activeTheme = THEME_OPTIONS.find(t => t.key === theme) || THEME_OPTIONS[0];
  const isLocked = Boolean(lockedTheme);

  return (
    <div className="relative inline-flex items-center shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`p-1.5 rounded-full border border-[var(--card-border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 flex items-center justify-center shrink-0 select-none ${
          isOpen ? 'ring-2 ring-[var(--accent-color)]/30 border-[var(--accent-color)] bg-[var(--accent-color)]/10' : ''
        }`}
        title={isLocked ? `Theme locked to ${activeTheme.name} by admin` : `Change Theme Color (Current: ${activeTheme.name})`}
        aria-label="Change Theme Color"
      >
        <Palette className="w-3.5 h-3.5 text-[var(--accent-color)] transition-transform duration-200 group-hover:rotate-12" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--card-border)] shadow-2xl p-1.5 z-[99999]">
          <div className="px-3 py-2 border-b border-[var(--card-border)]/70 flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Theme Style</span>
            </span>
            <span className="text-[9.5px] font-mono text-[var(--accent-color)] font-extrabold uppercase">
              {activeTheme.name}
            </span>
          </div>

          {isLocked && (
            <div className={`mx-1.5 mb-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] flex items-center gap-1.5 ${
              mode === 'light'
                ? 'border-pink-300 bg-pink-50 text-pink-700 font-semibold'
                : 'border-pink-400/35 bg-pink-500/10 text-pink-300'
            }`}>
              <Lock className="w-3 h-3 shrink-0" />
              <span>Locked to Girls by admin</span>
            </div>
          )}

          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto scrollbar-thin py-0.5">
            {THEME_OPTIONS.map((themeOpt) => {
              const isSelected = theme === themeOpt.key;
              const optionDisabled = isLocked && themeOpt.key !== lockedTheme;
              return (
                <button
                  key={themeOpt.key}
                  type="button"
                  disabled={optionDisabled}
                  onClick={() => {
                    if (optionDisabled) return;
                    if (onSelectTheme) {
                      onSelectTheme(themeOpt.key);
                    } else {
                      setTheme(themeOpt.key);
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-all duration-150 group ${
                    optionDisabled
                      ? 'opacity-35 cursor-not-allowed text-[var(--text-muted)]'
                      : isSelected
                        ? 'bg-[var(--accent-color)]/15 text-[var(--accent-color)] font-bold shadow-xs cursor-pointer'
                        : 'hover:bg-[var(--accent-color)]/10 text-[var(--text-primary)] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full ${themeOpt.color} border border-white/20 shrink-0 group-hover:scale-110 transition-transform`} />
                    <span className="text-[11.5px] font-medium">{themeOpt.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const decoyOptions = [
  { value: 'classroom', label: 'Classroom', labelLong: 'Google Classroom', icon: 'https://ssl.gstatic.com/classroom/favicon.png' },
  { value: 'deltamath', label: 'DeltaMath', labelLong: 'DeltaMath', icon: 'https://www.deltamath.com/favicon-32x32.png' },
  { value: 'studysync', label: 'StudySync', labelLong: 'StudySync', icon: 'https://apps.studysync.com/favicon-studysync.ico' },
  { value: 'commonlit', label: 'CommonLit', labelLong: 'CommonLit', icon: 'https://cdn.prod.website-files.com/6751e31f9aaa082b0f7234ec/6751e31f9aaa082b0f7235f8_commonlit-favicon.png' },
  { value: 'drive', label: 'Drive', labelLong: 'Google Drive', icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_favicon_2026_32dp.png' },
  { value: 'docs', label: 'Docs', labelLong: 'Google Docs', icon: 'https://ssl.gstatic.com/docs/documents/images/docs-favicon-2026-v2.ico' },
  { value: 'slides', label: 'Slides', labelLong: 'Google Slides', icon: 'https://ssl.gstatic.com/docs/presentations/images/favicon-2026-v2.ico' },
  { value: 'canva', label: 'Canva', labelLong: 'Canva | Visual Suite', icon: 'https://static.canva.com/domain-assets/canva/static/images/favicon-1.ico' },
  { value: 'clever', label: 'Clever', labelLong: 'Clever Login', icon: 'https://www.google.com/s2/favicons?sz=64&domain=clever.com' },
  { value: 'campus', label: 'Campus', labelLong: 'Infinite Campus', icon: 'https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png' },
  { value: 'gmail', label: 'Inbox', labelLong: 'Inbox - JCPS', icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico' },
  { value: 'duolingo', label: 'Lingo', labelLong: 'Duolingo', icon: 'https://www.google.com/s2/favicons?sz=64&domain=duolingo.com' },
  { value: 'ixl', label: 'IXL', labelLong: 'IXL Learning', icon: 'https://www.google.com/s2/favicons?sz=64&domain=ixl.com' },
  { value: 'savvas', label: 'Savvas', labelLong: 'Savvas Realize', icon: 'https://savvasrealize.com/favicon.ico' }
];

const getDefaultDecoyTitle = (type) => {
  if (type === 'classroom') return "Home - Classroom";
  if (type === 'deltamath') return "DeltaMath";
  if (type === 'studysync') return "StudySync - Assignments";
  if (type === 'commonlit') return "CommonLit | Free Reading Passages and Literacy Resources";
  if (type === 'drive') return "My Drive - Google Drive";
  if (type === 'docs') return "Google Docs";
  if (type === 'slides') return "Google Slides";
  if (type === 'canva') return "Home - Canva";
  if (type === 'clever') return "Clever | Log in with Clever";
  if (type === 'campus') return "Campus Student";
  if (type === 'gmail') return "Inbox - Jersey City Public Schools";
  if (type === 'duolingo') return "Duolingo - Learn a language for free";
  if (type === 'ixl') return "IXL | Math, Language Arts, Science, Social Studies, and Spanish";
  if (type === 'savvas' || type === 'savvasrealize') return "Classes | Savvas Realize";
  return "Study Tools";
};

const getDecoyTitle = (type, customTitles = {}) => {
  const custom = (customTitles && customTitles[type] ? String(customTitles[type]).trim() : '');
  if (custom) return custom;
  return getDefaultDecoyTitle(type);
};

const getDecoyFavicon = (type) => {
  if (type === 'deltamath') return "https://www.deltamath.com/favicon-32x32.png";
  if (type === 'studysync') return "https://apps.studysync.com/favicon-studysync.ico";
  if (type === 'commonlit') return "https://cdn.prod.website-files.com/6751e31f9aaa082b0f7234ec/6751e31f9aaa082b0f7235f8_commonlit-favicon.png";
  if (type === 'savvas' || type === 'savvasrealize') return "https://savvasrealize.com/favicon.ico";
  const found = decoyOptions.find(opt => opt.value === type);
  if (found && found.icon && found.icon !== 'school') return found.icon;
  if (type === 'classroom') return "https://ssl.gstatic.com/classroom/favicon.png";
  if (type === 'drive') return "https://ssl.gstatic.com/docs/doclist/images/drive_favicon_2026_32dp.png";
  if (type === 'docs') return "https://ssl.gstatic.com/docs/documents/images/docs-favicon-2026-v2.ico";
  if (type === 'slides') return "https://ssl.gstatic.com/docs/presentations/images/favicon-2026-v2.ico";
  if (type === 'canva') return "https://static.canva.com/domain-assets/canva/static/images/favicon-1.ico";
  if (type === 'clever') return "https://www.google.com/s2/favicons?sz=64&domain=clever.com";
  if (type === 'campus') return "https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png";
  if (type === 'gmail') return "https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico";
  if (type === 'duolingo') return "https://www.google.com/s2/favicons?sz=64&domain=duolingo.com";
  if (type === 'ixl') return "https://www.google.com/s2/favicons?sz=64&domain=ixl.com";
  return "https://ssl.gstatic.com/classroom/favicon.png";
};

const EMULATED_PLATFORMS = [
  'arcade', 'atari2600', 'atarilynx', 'bootleg', 'colecovision', 'dos',
  'gba', 'genesis plus', 'jaguar', 'n64', 'nds', 'neo geo pocket', 'nes',
  'pokemon', 'psx', 'segagg', 'segamd', 'segams', 'segasaturn', 'snes',
  'virtualboy', 'wonderswan'
];

const EMULATED_SYSTEM_NAMES = {
  arcade: 'Arcade',
  atari2600: 'Atari 2600',
  atarilynx: 'Atari Lynx',
  bootleg: 'Bootleg / Famiclone',
  colecovision: 'ColecoVision',
  dos: 'MS-DOS',
  gba: 'Game Boy Advance',
  'genesis plus': 'Genesis Plus',
  jaguar: 'Atari Jaguar',
  n64: 'Nintendo 64',
  nds: 'Nintendo DS',
  'neo geo pocket': 'Neo Geo Pocket',
  nes: 'NES',
  pokemon: 'Pokémon (ROMs)',
  psx: 'PlayStation 1 (PSX)',
  segagg: 'Sega Game Gear',
  segamd: 'Sega Genesis / MD',
  segams: 'Sega Master System',
  segasaturn: 'Sega Saturn',
  snes: 'Super Nintendo (SNES)',
  virtualboy: 'Virtual Boy',
  wonderswan: 'WonderSwan'
};

function GoGuardianDecoyNotice({
  mode,
  onToggleMode,
  onClose,
  decoyType,
  positionClass = "absolute top-full right-0 mt-2 w-48 sm:w-52"
}) {
  // Automatically dismiss the message after a few seconds (6s) and record that it was shown
  useEffect(() => {
    safeStorage.setItem('unblocked-goguardian-notice-shown', 'true');
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    safeStorage.setItem('unblocked-goguardian-notice-shown', 'true');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onClick={() => {
        handleClose();
        onToggleMode();
      }}
      className={`${positionClass} z-[99999] rounded-xl bg-[var(--card-bg)] border-2 border-red-500/90 shadow-2xl shadow-red-500/10 p-3 text-left select-none cursor-pointer transition-colors hover:border-red-400 group flex flex-col gap-1.5`}
      title="Click anywhere to swap between Light and Dark mode"
    >
      <div className="text-red-500 font-bold underline tracking-wider text-center" style={{ fontSize: '12px', lineHeight: '16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        READ THIS ONCE
      </div>
      {/* Exact Required Message Text with applied styling */}
      <p
        style={{ fontSize: '10px', lineHeight: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="text-[var(--text-primary)] font-bold text-center leading-relaxed"
      >
        GoGuardian sees whatever theme you are on, and if you are using Classroom/Drive/Docs/Slides/clever.com decoys, the mode automatically changes to white. These platforms do not have dark mode. So to stay hidden, please use white mode when GoGuardian is on. If GoGuardian is not on, you can just swap to dark mode.
      </p>
    </motion.div>
  );
}

function WhatsNewNotificationDrop({
  onClose,
  onOpenModal,
  onPlayGameCard,
  onOpenSignInLinks = null,
  positionClass = "absolute top-full right-0 mt-2 w-[320px] sm:w-[420px] md:w-[480px] max-w-[calc(100vw-1.5rem)]"
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Auto-dismiss after 7 seconds like the GoGuardian shield notice, pause when hovering
  useEffect(() => {
    if (isHovered) return;
    const timer = setTimeout(() => {
      onClose();
    }, 7000);
    return () => clearTimeout(timer);
  }, [onClose, isHovered]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${positionClass} z-[99999] rounded-xl bg-[var(--card-bg)] border-2 border-[var(--accent-color)] shadow-2xl shadow-[var(--accent-color)]/20 px-3 py-2 text-left select-none flex flex-col gap-1 transition-colors hover:border-[var(--accent-color)] group`}
      role="dialog"
      aria-label="What's New Notification"
    >
      {/* Top Header Bar with Shield Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-[var(--card-border)] pb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="p-0.5 rounded bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm flex items-center justify-center shrink-0">
            <Shield className="w-3 h-3" />
          </div>
          <span className="text-[9.5px] sm:text-[10px] font-black tracking-wider uppercase text-[var(--text-primary)] font-mono truncate">
            WHAT'S NEW
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-ping shrink-0" />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenModal) onOpenModal();
            }}
            className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-[var(--accent-color)] hover:bg-[var(--accent-color)]/15 transition-colors cursor-pointer"
            title="View all changes"
          >
            View All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-0.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer shrink-0"
            title="Close notification"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Single Sentence Notification Text */}
      <p className="text-[9.5px] sm:text-[10px] text-[var(--text-primary)] font-medium leading-snug">
        {WHATS_NEW_SENTENCE}
      </p>
      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        {onOpenSignInLinks && (
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSignInLinks();
            }}
            className="rounded-md bg-cyan-600 hover:bg-cyan-500 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
          >
            <Link2 className="w-2.5 h-2.5" />
            <span>Sign-In Links</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => onPlayGameCard('Gambling (Casino) Game')}
          className="rounded-md bg-amber-600 hover:bg-amber-500 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
        >
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>LETS GO GAMBLING</span>
        </button>
        <button
          type="button"
          onClick={() => onPlayGameCard('Bloons TD6 and BTD Battles 2 Copy')}
          className="rounded-md bg-red-600 hover:bg-red-500 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
        >
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>Play BTD6</span>
        </button>
        <button
          type="button"
          onClick={() => onPlayGameCard('Quoridor')}
          className="rounded-md bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
        >
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>Play Quoridor</span>
        </button>
      </div>
    </motion.div>
  );
}

function CursorSpotlight({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches) return;

    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let latestX = -1000;
    let latestY = -1000;
    let visible = false;

    const commit = () => {
      rafId = 0;
      el.style.transform = `translate3d(${latestX - 210}px, ${latestY - 210}px, 0)`;
      if (!visible) {
        visible = true;
        el.style.opacity = '1';
      }
    };

    const handleMouseMove = (e) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(commit);
      }
    };

    const handleMouseLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      visible = false;
      el.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 w-[420px] h-[420px] rounded-full z-0 opacity-0 transition-opacity duration-200 will-change-transform"
      style={{
        transform: 'translate3d(-1000px, -1000px, 0)',
        background: 'radial-gradient(circle closest-side, color-mix(in srgb, var(--accent-color) 11%, transparent), transparent)',
      }}
    />
  );
}

function GirlsThemeDecorations({ active, mode, animationsEnabled }) {
  if (!active) return null;
  const isLight = mode === 'light';
  const primaryFill = isLight ? 'rgba(244, 114, 182, 0.55)' : 'rgba(244, 114, 182, 0.26)';
  const secondaryFill = isLight ? 'rgba(251, 182, 206, 0.65)' : 'rgba(251, 182, 206, 0.22)';
  const sparkleFill = isLight ? 'rgba(219, 39, 119, 0.45)' : 'rgba(253, 224, 239, 0.42)';
  const ribbonStroke = isLight ? 'rgba(219, 39, 119, 0.34)' : 'rgba(249, 168, 212, 0.32)';
  const petalStroke = isLight ? 'rgba(219, 39, 119, 0.22)' : 'none';
  const floatCls = animationsEnabled ? 'girls-float-slow' : '';
  const driftCls = animationsEnabled ? 'girls-drift' : '';
  const twinkleCls = animationsEnabled ? 'girls-twinkle' : '';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Soft Pastel Halo Clouds (pure radial falloff without expensive blur-3xl) */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-80"
        style={{ background: isLight ? 'radial-gradient(circle, rgba(244,114,182,0.18), transparent 70%)' : 'radial-gradient(circle, rgba(244,114,182,0.16), transparent 70%)' }}
      />
      <div
        className="absolute -bottom-28 -right-24 w-[28rem] h-[28rem] rounded-full opacity-80"
        style={{ background: isLight ? 'radial-gradient(circle, rgba(216,180,254,0.16), rgba(251,113,133,0.12) 55%, transparent 72%)' : 'radial-gradient(circle, rgba(217,70,239,0.14), transparent 70%)' }}
      />

      {/* Top-left Cherry Blossom Cluster */}
      <svg className={`absolute top-20 left-5 w-16 h-16 ${floatCls}`} viewBox="0 0 64 64" fill="none">
        <g transform="translate(32 32)">
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M0,-4 C7,-14 14,-22 0,-26 C-14,-22 -7,-14 0,-4 Z"
              fill={primaryFill}
              stroke={petalStroke}
              strokeWidth={isLight ? '1' : '0'}
              transform={`rotate(${deg})`}
            />
          ))}
          <circle cx="0" cy="0" r="4.2" fill={isLight ? '#fbbf24' : sparkleFill} fillOpacity={isLight ? '0.65' : '1'} stroke={isLight ? '#db2777' : 'none'} strokeOpacity="0.25" strokeWidth="1" />
        </g>
      </svg>

      {/* Top-right Dainty Ribbon Bow */}
      <svg className={`absolute top-24 right-8 w-16 h-12 ${driftCls}`} viewBox="0 0 80 56" fill="none">
        <path
          d="M40 26 C28 10, 8 10, 12 26 C16 38, 30 34, 40 26 Z M40 26 C52 10, 72 10, 68 26 C64 38, 50 34, 40 26 Z"
          fill={secondaryFill}
          stroke={ribbonStroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M38 28 C33 38, 25 45, 20 49 M42 28 C47 38, 55 45, 60 49"
          stroke={ribbonStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="40" cy="26" r="4.2" fill={sparkleFill} />
      </svg>

      {/* Mid-left Four-Point Sparkle */}
      <svg className={`absolute top-[44%] left-7 w-8 h-8 ${twinkleCls}`} viewBox="0 0 36 36" fill="none">
        <path d="M18 2 L21 15 L34 18 L21 21 L18 34 L15 21 L2 18 L15 15 Z" fill={sparkleFill} />
      </svg>

      {/* Mid-right Heart */}
      <svg className={`absolute top-[46%] right-9 w-11 h-11 ${floatCls}`} style={animationsEnabled ? { animationDelay: '1.8s' } : undefined} viewBox="0 0 40 40" fill="none">
        <path
          d="M20 33 C11 26.5 5 21 5 14.5 C5 10.2 8.4 7 12.6 7 C15.4 7 18.1 8.5 20 11 C21.9 8.5 24.6 7 27.4 7 C31.6 7 35 10.2 35 14.5 C35 21 29 26.5 20 33 Z"
          fill={primaryFill}
          stroke={ribbonStroke}
          strokeWidth="1.5"
        />
      </svg>

      {/* Bottom-right Blossom */}
      <svg className={`absolute bottom-12 right-8 w-16 h-16 ${driftCls}`} style={animationsEnabled ? { animationDelay: '0.8s' } : undefined} viewBox="0 0 64 64" fill="none">
        <g transform="translate(32 32)">
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M0,-4 C7,-14 14,-22 0,-26 C-14,-22 -7,-14 0,-4 Z"
              fill={secondaryFill}
              stroke={petalStroke}
              strokeWidth={isLight ? '1' : '0'}
              transform={`rotate(${deg})`}
            />
          ))}
          <circle cx="0" cy="0" r="3.8" fill={isLight ? '#fbbf24' : sparkleFill} fillOpacity={isLight ? '0.65' : '1'} />
        </g>
      </svg>
    </div>
  );
}

function DecoyDropdown({ 
  value, 
  onChange, 
  mode, 
  compact = false, 
  showLabel = false, 
  customTitles = {}, 
  onCustomTitleChange,
  isUnlocked = false,
  onRequestUnlock
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDecoy, setActiveDecoy] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveDecoy(value);
  }, [value, isOpen]);

  const selectedOption = decoyOptions.find(opt => opt.value === value) || decoyOptions[0];
  const isHighlighted = value !== 'none';
  const activeCustomTitle = customTitles?.[value];

  const currentTargetOpt = decoyOptions.find(opt => opt.value === activeDecoy) || selectedOption;
  const currentTargetDefaultTitle = getDefaultDecoyTitle(activeDecoy);
  const currentTargetCustomTitle = customTitles?.[activeDecoy] || '';

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-full border cursor-pointer transition-all duration-200 select-none ${
          compact ? 'px-2 py-0.5 text-[10px] h-6' : 'px-3 py-1 text-xs h-8'
        } ${
          mode === 'light'
            ? 'bg-white border-neutral-300 text-neutral-900 shadow-sm hover:border-neutral-400'
            : isHighlighted
              ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] text-[var(--accent-color)] shadow-[0_1px_5px_var(--accent-shadow)] font-black'
              : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-primary)] hover:border-[var(--accent-color)]/50'
        }`}
        style={{ colorScheme: mode }}
        title={activeCustomTitle ? `Decoy: ${selectedOption.labelLong} ("${activeCustomTitle}")` : `Decoy: ${selectedOption.labelLong}`}
      >
        {selectedOption.icon === 'school' ? (
          <School className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${isHighlighted ? (mode === 'light' ? 'text-neutral-900' : 'text-[var(--accent-color)]') : 'text-neutral-400'}`} />
        ) : (
          <img src={selectedOption.icon} className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} object-contain shrink-0`} referrerPolicy="no-referrer" alt="" />
        )}
        
        {showLabel && (
          <span className="font-mono font-bold leading-none uppercase tracking-tight text-[10px]">
            {selectedOption.label}
          </span>
        )}
        
        <ChevronDown className={`${compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} transition-transform duration-200 shrink-0 ${isOpen ? (mode === 'light' ? 'rotate-180 text-neutral-900' : 'rotate-180 text-[var(--accent-color)]') : 'text-neutral-400'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute top-full right-0 mt-1.5 w-[330px] sm:w-[510px] rounded-2xl border shadow-2xl z-[2600] select-none overflow-hidden ${
              mode === 'light'
                ? 'bg-white border-neutral-200 text-neutral-900 shadow-xl'
                : 'bg-[#12121a]/95 backdrop-blur-md border-white/10 text-white'
            }`}
          >
            {/* Top Bar */}
            <div className={`px-3 py-2 border-b flex items-center justify-between ${mode === 'light' ? 'border-neutral-200 bg-neutral-50' : 'border-white/10 bg-white/[0.02]'}`}>
              <div className="flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  Decoy Disguise
                </span>
              </div>
              <span className="text-[10px] text-[var(--accent-color)] font-mono font-semibold">
                Custom Title on the Side →
              </span>
            </div>

            {/* Split Content: Left List + Right Side Text Box */}
            <div className="flex flex-col sm:flex-row">
              
              {/* Left Column: Decoy Options List */}
              <div className={`w-full sm:w-[245px] max-h-[350px] overflow-y-auto p-1.5 flex flex-col gap-1 border-b sm:border-b-0 sm:border-r scrollbar-thin ${
                mode === 'light' ? 'border-neutral-200' : 'border-white/10'
              }`}>
                <div className="px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                  <span>Select Disguise</span>
                  {!isUnlocked && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        if (onRequestUnlock) onRequestUnlock();
                      }}
                      className="text-[var(--accent-color)] hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <Lock className="w-2.5 h-2.5" />
                      <span>Unlock All</span>
                    </button>
                  )}
                </div>
                {decoyOptions.map((opt) => {
                  const isLockedOption = !isUnlocked && opt.value !== 'classroom';
                  const isSelected = opt.value === value;
                  const isEditing = opt.value === activeDecoy;
                  const hasCustom = !!customTitles?.[opt.value];

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        if (isLockedOption) {
                          setIsOpen(false);
                          if (onRequestUnlock) onRequestUnlock();
                          return;
                        }
                        onChange(opt.value);
                        setActiveDecoy(opt.value);
                      }}
                      className={`flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                        isLockedOption
                          ? 'opacity-45 text-neutral-500 hover:bg-white/5 border border-transparent'
                          : isEditing
                            ? mode === 'light'
                              ? 'bg-neutral-100 text-neutral-900 border border-neutral-300 shadow-xs'
                              : 'bg-white/10 text-white border border-[var(--accent-color)]/50 shadow-xs'
                            : mode === 'light'
                              ? 'text-neutral-700 hover:text-black hover:bg-neutral-100/70 border border-transparent'
                              : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                      title={isLockedOption ? "Locked: Requires Extra Decoys permission or owner pass to unlock all decoys" : opt.labelLong}
                    >
                      {opt.icon === 'school' ? (
                        <School className={`w-3.5 h-3.5 shrink-0 ${isSelected ? (mode === 'light' ? 'text-black' : 'text-[var(--accent-color)]') : 'text-neutral-400'}`} />
                      ) : (
                        <img src={opt.icon} className="w-3.5 h-3.5 object-contain shrink-0" referrerPolicy="no-referrer" alt="" />
                      )}
                      
                      <span className="flex-1 font-sans truncate text-[11px]">
                        {opt.labelLong}
                      </span>

                      {hasCustom && !isLockedOption && (
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30 shrink-0">
                          Custom
                        </span>
                      )}

                      {isLockedOption ? (
                        <Lock className="w-3 h-3 text-neutral-500 shrink-0 ml-1" />
                      ) : isSelected ? (
                        <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0 ml-1" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Text Box on the Side for Customizing */}
              <div className={`w-full sm:w-[265px] p-3 flex flex-col justify-between gap-3 ${
                mode === 'light' ? 'bg-neutral-50/80' : 'bg-black/30'
              }`}>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b pb-2 border-white/10">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Side Editor
                    </span>
                    <span className="text-[9px] font-mono text-[var(--accent-color)]">
                      Instant update
                    </span>
                  </div>

                  {/* Active Selected Decoy Info */}
                  <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                    mode === 'light' ? 'bg-white border-neutral-200' : 'bg-[#181824] border-white/10'
                  }`}>
                    {currentTargetOpt.icon === 'school' ? (
                      <div className="p-1.5 rounded-lg bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
                        <School className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <img src={currentTargetOpt.icon} className="w-4 h-4 object-contain shrink-0" referrerPolicy="no-referrer" alt="" />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate">
                        {currentTargetOpt.labelLong}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono truncate">
                        {currentTargetOpt.label}
                      </span>
                    </div>
                  </div>

                  {/* The Side Text Box for Inputting Custom Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Custom Tab Title</span>
                      {currentTargetCustomTitle ? (
                        <span className="text-[9px] text-[var(--accent-color)]">Custom Active</span>
                      ) : (
                        <span className="text-[9px] text-neutral-400">Using Default</span>
                      )}
                    </label>

                    <input
                      type="text"
                      autoFocus
                      placeholder={`Default: ${currentTargetDefaultTitle}`}
                      value={currentTargetCustomTitle}
                      onChange={(e) => onCustomTitleChange && onCustomTitleChange(activeDecoy, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onChange(activeDecoy);
                          setIsOpen(false);
                        }
                      }}
                      className={`w-full text-xs font-mono px-2.5 py-2 rounded-lg border outline-none transition-all ${
                        mode === 'light'
                          ? 'bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900'
                          : 'bg-black/60 border-white/20 text-white placeholder:text-neutral-500 focus:border-[var(--accent-color)] focus:shadow-[0_0_10px_rgba(0,229,176,0.2)]'
                      }`}
                    />

                    {/* Reset to Default or Default Status */}
                    {currentTargetCustomTitle ? (
                      <button
                        type="button"
                        onClick={() => onCustomTitleChange && onCustomTitleChange(activeDecoy, '')}
                        className="py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold bg-white/10 hover:bg-rose-500/20 text-neutral-200 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-0.5"
                        title="Clear custom title and use default"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Use Default Title</span>
                      </button>
                    ) : (
                      <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-1 px-2 text-center flex items-center justify-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Default title is active</span>
                      </div>
                    )}
                  </div>

                  {/* Browser Tab Preview */}
                  <div className={`p-2 rounded-xl border flex flex-col gap-1 ${
                    mode === 'light' ? 'bg-white border-neutral-200' : 'bg-black/40 border-white/10'
                  }`}>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Tab Disguise Preview
                    </span>
                    <div className="flex items-center gap-2 bg-neutral-900/90 text-neutral-200 px-2.5 py-1.5 rounded-lg border border-white/10 shadow-inner">
                      {currentTargetOpt.icon === 'school' ? (
                        <School className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                      ) : (
                        <img src={currentTargetOpt.icon} className="w-3.5 h-3.5 object-contain shrink-0" referrerPolicy="no-referrer" alt="" />
                      )}
                      <span className="text-[11px] font-medium truncate font-sans">
                        {currentTargetCustomTitle || currentTargetDefaultTitle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] text-neutral-400 font-mono">
                    Press Enter or click outside
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] font-mono font-bold text-[10px] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AutoRandomizeDecoyButton({
  autoRandomize,
  setAutoRandomize,
  interval,
  setInterval,
  pool,
  togglePoolItem,
  selectAllPool,
  countdown,
  onRandomizeNow,
  currentDecoy,
  mode,
  compact = false,
  isUnlocked = false,
  onRequestUnlock
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatInterval = (sec) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  const presets = [5, 10, 15, 30, 60, 120, 300];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 rounded-full border cursor-pointer transition-all duration-200 select-none ${
          compact ? 'px-1.5 py-0.5 text-[10px] h-6' : 'px-2.5 py-1 text-xs h-8'
        } ${
          mode === 'light'
            ? autoRandomize
              ? 'bg-white border-neutral-900 text-neutral-900 shadow-sm font-black'
              : 'bg-white border-neutral-300 text-neutral-600 shadow-sm hover:border-neutral-400 hover:text-neutral-900'
            : autoRandomize
              ? 'bg-[var(--accent-color)]/15 border-[var(--accent-color)] text-[var(--accent-color)] shadow-[0_0_8px_var(--accent-shadow)] font-black'
              : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
        }`}
        title={autoRandomize ? `Auto Randomize: ON (${formatInterval(interval)}) • Next in ${countdown}s` : "Auto Randomize Decoy (Settings)"}
        aria-label="Auto Randomize Decoy"
      >
        <Shuffle className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${autoRandomize ? 'animate-pulse text-[var(--accent-color)]' : ''}`} />
        {autoRandomize && (
          <span className="font-mono text-[9px] font-black leading-none px-1 py-0.5 rounded bg-[var(--accent-color)] text-[var(--bg-color)] shadow-xs">
            {countdown}s
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#12121a] border border-white/10 p-3.5 shadow-2xl z-[2800] overflow-hidden select-none text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30 text-[var(--accent-color)]">
                  <Shuffle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Auto Randomize Decoy</h4>
                  <p className="text-[10px] text-neutral-400">Cycles disguise automatically</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Master Toggle */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 mb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Auto Switch Decoy</span>
                <span className="text-[10px] text-neutral-400">
                  {autoRandomize ? `Active • Every ${formatInterval(interval)}` : 'Disabled'}
                </span>
              </div>
              <button
                onClick={() => {
                  if (!isUnlocked) {
                    setIsOpen(false);
                    if (onRequestUnlock) onRequestUnlock();
                    return;
                  }
                  setAutoRandomize(!autoRandomize);
                }}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer p-0.5 border ${
                  autoRandomize && isUnlocked ? 'bg-emerald-500 border-emerald-400' : 'bg-neutral-800 border-neutral-700'
                }`}
                aria-label="Toggle Auto Switch Decoy"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    autoRandomize && isUnlocked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Interval Configuration */}
            <div className="mb-3 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-neutral-200 flex items-center gap-1.5">
                  <Timer className="w-3 h-3 text-[var(--accent-color)]" />
                  <span>Switch Interval</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2 py-0.5 rounded-md border border-[var(--accent-color)]/20">
                  {formatInterval(interval)}
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="3"
                max="300"
                step="1"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)] mb-2.5"
              />

              {/* Presets */}
              <div className="flex items-center gap-1 flex-wrap">
                {presets.map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setInterval(sec)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                      interval === sec
                        ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] font-bold shadow-xs'
                        : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {formatInterval(sec)}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Decoys Pool */}
            <div className="mb-3 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-neutral-200 flex items-center gap-1">
                  <span>Randomize Pool</span>
                  <span className="text-[9px] font-mono text-neutral-400">({pool.length}/{decoyOptions.length})</span>
                </span>
                <div className="flex items-center gap-1 text-[10px]">
                  <button
                    onClick={selectAllPool}
                    className="text-[var(--accent-color)] hover:underline cursor-pointer font-bold"
                  >
                    Select All
                  </button>
                </div>
              </div>

              {/* Decoy options checkboxes */}
              <div className="grid grid-cols-1 gap-1 max-h-36 overflow-y-auto pr-0.5 scrollbar-thin">
                {decoyOptions.map((opt) => {
                  const isLockedOption = !isUnlocked && opt.value !== 'classroom';
                  const isChecked = isUnlocked ? pool.includes(opt.value) : opt.value === 'classroom';
                  const isCurrent = currentDecoy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (isLockedOption) {
                          setIsOpen(false);
                          if (onRequestUnlock) onRequestUnlock();
                          return;
                        }
                        togglePoolItem(opt.value);
                      }}
                      className={`flex items-center justify-between w-full px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                        isLockedOption
                          ? 'opacity-45 bg-transparent border-transparent text-neutral-500'
                          : isChecked
                            ? 'bg-white/10 border-white/15 text-white'
                            : 'bg-transparent border-transparent text-neutral-500 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {opt.icon === 'school' ? (
                          <School className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                        ) : (
                          <img src={opt.icon} className="w-3.5 h-3.5 object-contain shrink-0" referrerPolicy="no-referrer" alt="" />
                        )}
                        <span className="truncate text-[11px] font-medium">{opt.labelLong}</span>
                        {isCurrent && (
                          <span className="text-[8px] uppercase tracking-wider font-mono font-bold bg-[var(--accent-color)]/20 text-[var(--accent-color)] px-1 rounded">
                            current
                          </span>
                        )}
                      </div>
                      {isLockedOption ? (
                        <Lock className="w-3 h-3 text-neutral-500 shrink-0" />
                      ) : (
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                          isChecked ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-[var(--bg-color)]' : 'border-neutral-600'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Action: Randomize Now & Status */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1.5">
                {autoRandomize && isUnlocked ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Next in {countdown}s</span>
                  </>
                ) : (
                  <span className="text-neutral-500">{isUnlocked ? 'Auto switch off' : 'Admin pass required'}</span>
                )}
              </div>
              <button
                onClick={() => {
                  if (!isUnlocked) {
                    setIsOpen(false);
                    if (onRequestUnlock) onRequestUnlock();
                    return;
                  }
                  onRandomizeNow();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
                title={isUnlocked ? "Immediately pick another random decoy" : "Enter admin pass to unlock all decoys"}
              >
                <Shuffle className="w-3 h-3" />
                <span>{isUnlocked ? 'Roll Now' : 'Unlock'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  // Helper to optimize and resize thumbnail URLs dynamically to Poki recommended size (512x512) for fast load & high clarity
  const getOptimizedThumbnail = (url) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      if (url.includes('img.poki-cdn.com')) {
        return url
          .replace('width=1200', 'width=512')
          .replace('height=1200', 'height=512');
      }
      return url;
    }

    const clean = url.trim().replace(/^\/+/, '').replace(/^public\//i, '');
    const resolvedFromPublic = resolvePublicFileUrl(clean);
    if (resolvedFromPublic && resolvedFromPublic !== `/${clean}`) {
      return encodeURI(resolvedFromPublic);
    }

    const withoutThumbPrefix = clean.replace(/^thumbnails\//i, '');
    return `/thumbnails/${encodeURI(withoutThumbPrefix)}`;
  };

  const [theme, setTheme] = useState(() => {
    const saved = safeStorage.getItem('unblocked-theme');
    return saved && ['cyborg', 'sunset', 'midnight', 'forest', 'violet', 'ice', 'rose-pine', 'girls', 'none'].includes(saved) ? saved : 'none';
  });
  const [mode, setMode] = useState(() => {
    const initialViewMode =
      safeSessionStorage.getItem('classroom-view-mode') ||
      safeStorage.getItem('classroom-view-mode') ||
      'articles';
    if (initialViewMode === 'games') {
      const accMode = safeStorage.getItem('unblocked-account-mode');
      if (accMode === 'light' || accMode === 'dark') return accMode;
      const savedMode = safeStorage.getItem('unblocked-mode');
      if (savedMode === 'light' || savedMode === 'dark') return savedMode;
      return 'dark';
    }
    return 'light';
  });
  const autoAppliedGirlsThemeRef = useRef(false);
  const autoAppliedGirlsChatThemeRef = useRef(false);
  const signInGirlsAppliedRef = useRef('');
  const manualThemeOverrideUserRef = useRef('');
  const manualChatThemeOverrideUserRef = useRef('');
  const appliedDefaultGirlsForUserRef = useRef('');
  const appliedDefaultGirlsChatForUserRef = useRef('');
  const activeAccountLowerRef = useRef('');

  const [chatTheme, setChatTheme] = useState(() => {
    const saved = safeStorage.getItem('chat_theme');
    return saved || 'mono';
  });
  useEffect(() => {
    const onChatThemeChange = (e) => {
      const next = e?.detail;
      if (typeof next === 'string' && next.trim()) {
        autoAppliedGirlsChatThemeRef.current = false;
        manualChatThemeOverrideUserRef.current = activeAccountLowerRef.current || '__guest__';
        setChatTheme(next.trim().slice(0, 32));
      }
    };
    window.addEventListener('urnperiodic-chat-theme-change', onChatThemeChange);
    return () => window.removeEventListener('urnperiodic-chat-theme-change', onChatThemeChange);
  }, []);

  // Animations state: disabled by default at start for Chromebook performance
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    try {
      return safeStorage.getItem('unblocked-animations-enabled') === 'true';
    } catch {
      return false;
    }
  });

  const [viewMode, setViewMode] = useState(() => {
    try {
      const urlView = new URLSearchParams(window.location.search).get('view');
      if (urlView === 'games' && (getSavedAccountSession() || getSavedOwnerSession())) {
        safeSessionStorage.setItem('classroom-view-mode', 'games');
        safeSessionStorage.setItem('classroom-passcode-unlocked', 'true');
        return 'games';
      }
    } catch {}

    // Check if session storage retains unlocked status in current tab
    const sessionMode = safeSessionStorage.getItem('classroom-view-mode');
    if (sessionMode === 'games') {
      safeStorage.setItem('classroom-view-mode', 'games');
      safeStorage.setItem('classroom-passcode-unlocked', 'true');
      return 'games';
    }

    // Check if website refresh button was used recently (so refresh never logs you out)
    try {
      const wasRefreshing = safeStorage.getItem('unblocked-refreshing-session') === 'true';
      const refreshTimestamp = Number(safeStorage.getItem('unblocked-refresh-timestamp') || 0);
      if (wasRefreshing && Date.now() - refreshTimestamp < 30000) {
        safeStorage.removeItem('unblocked-refreshing-session');
        safeStorage.setItem('classroom-view-mode', 'games');
        safeStorage.setItem('classroom-passcode-unlocked', 'true');
        safeSessionStorage.setItem('classroom-view-mode', 'games');
        safeSessionStorage.setItem('classroom-passcode-unlocked', 'true');
        return 'games';
      }
    } catch {}

    const saved = safeStorage.getItem('classroom-view-mode');
    if (saved === 'games') return 'games';
    return 'articles'; // Innocent educational syllabus base is shown on first startup
  });

  const isPasscodeUnlocked = viewMode === 'games';

  // Classroom/Games Cloak/Decoy State (defaults to classroom until admin pass unlocks all decoys)
  const [decoyType, setDecoyType] = useState('classroom');

  const isWhiteDecoy = ['classroom', 'docs', 'drive', 'slides', 'clever', 'deltamath', 'studysync', 'commonlit'].includes(decoyType);
  const [showGoGuardianNotice, setShowGoGuardianNotice] = useState(() => {
    const hasShownBefore = safeStorage.getItem('unblocked-goguardian-notice-shown');
    const initialViewMode = safeStorage.getItem('classroom-view-mode');
    return !hasShownBefore && isWhiteDecoy && initialViewMode !== 'games';
  });

  // Ensure notice does not automatically pop open when in the portals secured area, but trigger Whats New drop on portals
  useEffect(() => {
    if (viewMode === 'games') {
      setShowGoGuardianNotice(false);
      setShowWhatsNewDrop(true);
    }
  }, [viewMode]);

  // Keep Classroom/education view light when locked on white decoy, without overwriting dark mode inside portals
  useEffect(() => {
    if (viewMode !== 'games' && ['classroom', 'docs', 'drive', 'slides', 'clever', 'deltamath', 'studysync', 'commonlit'].includes(decoyType)) {
      setMode('light');
    }
  }, [decoyType, viewMode]);

  // Persist decoy state to localStorage
  useEffect(() => {
    localStorage.setItem('study-tools-decoy-type', decoyType);
    localStorage.setItem('study-tools-classroom-decoy', 'true');
  }, [decoyType]);

  // Custom Website Titles state for Docs, Drive, and Slides
  const [customDecoyTitles, setCustomDecoyTitles] = useState(() => {
    try {
      const saved = safeStorage.getItem('study-tools-custom-decoy-titles');
      return saved ? JSON.parse(saved) : { drive: '', docs: '', slides: '' };
    } catch {
      return { drive: '', docs: '', slides: '' };
    }
  });

  const handleCustomTitleChange = (decoyKey, title) => {
    setCustomDecoyTitles((prev) => {
      const next = { ...prev, [decoyKey]: title };
      try {
        safeStorage.setItem('study-tools-custom-decoy-titles', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Auto Randomize Decoy State & Controls
  const [autoRandomizeDecoy, setAutoRandomizeDecoy] = useState(() => {
    const saved = safeStorage.getItem('study-tools-auto-randomize');
    return saved === 'true';
  });

  const [randomizeInterval, setRandomizeInterval] = useState(() => {
    const saved = safeStorage.getItem('study-tools-randomize-interval');
    const num = Number(saved);
    return !isNaN(num) && num >= 3 && num <= 300 ? num : 15;
  });

  const [randomizePool, setRandomizePool] = useState(() => {
    try {
      const saved = safeStorage.getItem('study-tools-randomize-pool');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(p => decoyOptions.some(d => d.value === p));
          if (valid.length > 0) return valid;
        }
      }
    } catch {}
    return ['classroom', 'drive', 'docs', 'slides', 'clever', 'campus', 'gmail', 'duolingo', 'ixl'];
  });

  const [randomizeCountdown, setRandomizeCountdown] = useState(randomizeInterval);

  useEffect(() => {
    safeStorage.setItem('study-tools-auto-randomize', String(autoRandomizeDecoy));
  }, [autoRandomizeDecoy]);

  const updateRandomizeInterval = (sec) => {
    const clamped = Math.max(3, Math.min(300, Number(sec) || 15));
    setRandomizeInterval(clamped);
    setRandomizeCountdown(clamped);
    safeStorage.setItem('study-tools-randomize-interval', String(clamped));
  };

  const toggleDecoyInPool = (val) => {
    setRandomizePool((prev) => {
      let updated;
      if (prev.includes(val)) {
        if (prev.length <= 1) return prev; // Keep at least one
        updated = prev.filter(item => item !== val);
      } else {
        updated = [...prev, val];
      }
      safeStorage.setItem('study-tools-randomize-pool', JSON.stringify(updated));
      return updated;
    });
  };

  const selectAllDecoys = () => {
    const all = decoyOptions.map(d => d.value);
    setRandomizePool(all);
    safeStorage.setItem('study-tools-randomize-pool', JSON.stringify(all));
  };

  const triggerManualRandomize = () => {
    const activePool = randomizePool.length > 0 ? randomizePool : decoyOptions.map(d => d.value);
    const choices = activePool.length > 1 ? activePool.filter(d => d !== decoyType) : activePool;
    const next = choices[Math.floor(Math.random() * choices.length)] || decoyType;
    setDecoyType(next);
    setRandomizeCountdown(randomizeInterval);
  };

  // Timer loop for auto-randomization
  useEffect(() => {
    if (!autoRandomizeDecoy || viewMode !== 'games') {
      return;
    }

    setRandomizeCountdown(randomizeInterval);

    const timer = setInterval(() => {
      setRandomizeCountdown((prev) => {
        if (prev <= 1) {
          setDecoyType((curr) => {
            const activePool = randomizePool.length > 0 ? randomizePool : decoyOptions.map(d => d.value);
            const choices = activePool.length > 1 ? activePool.filter(d => d !== curr) : activePool;
            const next = choices[Math.floor(Math.random() * choices.length)] || curr;
            return next;
          });
          return randomizeInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRandomizeDecoy, randomizeInterval, randomizePool, viewMode]);
  const [filter, setFilter] = useState(() => {
    try {
      const hasVisited = safeStorage.getItem('has-visited-before');
      if (!hasVisited) {
        safeStorage.setItem('has-visited-before', 'true');
        return 'info';
      }
      const saved = safeStorage.getItem('unblocked-last-filter');
      return (saved === 'recent' ? 'all' : saved) || 'all';
    } catch {
      return 'info';
    }
  });
  const [hasUnreadLobby, setHasUnreadLobby] = useState(() => {
    const latest = Number(safeStorage.getItem('lobby-chat-latest') || 0);
    const lastRead = Number(safeStorage.getItem('lobby-chat-last-read') || 0);
    return latest > lastRead;
  });
  const [chatHeaderNotice, setChatHeaderNotice] = useState(null);
  const [targetChannelRequest, setTargetChannelRequest] = useState(null);
  const [mutedChatUsers, setMutedChatUsers] = useState(() => getActiveMutedUsers());
  const filterRef = useRef(filter);
  const isViewingLobbyChatRef = useRef(false);
  const activeLobbyChannelRef = useRef('general');
  const myDmIdentityRef = useRef(null);
  const canLobbyChatAccessRef = useRef(true);
  const mutedChatUsersRef = useRef(mutedChatUsers);

  useEffect(() => {
    mutedChatUsersRef.current = mutedChatUsers;
    setChatHeaderNotice((prev) =>
      prev?.senderTarget && isSenderMuted(prev.senderTarget, mutedChatUsers) ? null : prev,
    );
  }, [mutedChatUsers]);

  useEffect(() => {
    const unsub = subscribeUserMutes((next) => setMutedChatUsers(next));
    const interval = setInterval(() => {
      setMutedChatUsers(getActiveMutedUsers());
    }, 30000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!chatHeaderNotice?.id) return undefined;
    const noticeId = chatHeaderNotice.id;
    const timer = setTimeout(() => {
      setChatHeaderNotice((prev) => (prev?.id === noticeId ? null : prev));
    }, 5000);
    return () => clearTimeout(timer);
  }, [chatHeaderNotice?.id]);
  const markLobbyUnread = useCallback((latest) => {
    const timestamp = Number(latest || 0);
    if (!timestamp) return;
    const prevLatest = Number(safeStorage.getItem('lobby-chat-latest') || 0);
    if (timestamp > prevLatest) {
      safeStorage.setItem('lobby-chat-latest', String(timestamp));
    }
    const lastRead = Number(safeStorage.getItem('lobby-chat-last-read') || 0);
    if (isViewingLobbyChatRef.current) {
      if (timestamp > lastRead) {
        safeStorage.setItem('lobby-chat-last-read', String(timestamp));
      }
      setHasUnreadLobby(false);
      return;
    }
    if (timestamp > lastRead) {
      setHasUnreadLobby(true);
    }
  }, []);
  useEffect(() => {
    filterRef.current = filter;
    if (filter === 'lobbychat') {
      const latest = Number(safeStorage.getItem('lobby-chat-latest') || 0);
      const readTs = Math.max(latest, Date.now());
      safeStorage.setItem('lobby-chat-last-read', String(readTs));
      setHasUnreadLobby(false);
    }
  }, [filter]);
  useEffect(() => {
    let lobbyBus;
    try {
      lobbyBus = new BroadcastChannel('urnperiodic_lobby_bus');
      lobbyBus.onmessage = (event) => {
        if (event.data?.type === 'dm-thread-deleted' && event.data?.channelId) {
          try {
            localStorage.removeItem(`local_messages_${event.data.channelId}`);
          } catch {}
          setChatHeaderNotice((prev) => (prev?.channelId === event.data.channelId ? null : prev));
          return;
        }
        if (event.data?.timestamp) {
          markLobbyUnread(event.data.timestamp);
        }
      };
    } catch {}

    const handleLobbyMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'lobby-chat-message') {
        markLobbyUnread(event.data.timestamp);
      }
    };
    const handleLobbyStorage = (event) => {
      if ((event.key === 'lobby-chat-notification' || event.key === 'lobby-chat-latest') && event.newValue) {
        markLobbyUnread(event.newValue);
      }
    };
    window.addEventListener('message', handleLobbyMessage);
    window.addEventListener('storage', handleLobbyStorage);
    return () => {
      if (lobbyBus) {
        try { lobbyBus.close(); } catch {}
      }
      window.removeEventListener('message', handleLobbyMessage);
      window.removeEventListener('storage', handleLobbyStorage);
    };
  }, [markLobbyUnread]);
  useEffect(() => {
    const channelUnsubs = new Map();
    let channelsListUnsub = null;
    let cancelled = false;

    const attachChannelListener = (chanId) => {
      if (!chanId || channelUnsubs.has(chanId)) return;
      let initialized = false;
      try {
        const messagesQuery = query(
          collection(lobbyDb, 'channels', chanId, 'messages'),
          orderBy('timestamp', 'desc'),
          limit(1),
        );
        const unsub = onSnapshot(
          messagesQuery,
          async (snapshot) => {
            const topDoc = snapshot.docs[0];
            const data = topDoc?.data();
            const latest = Number(data?.timestamp || 0);
            if (!initialized) {
              initialized = true;
              if (!latest) return;
              const storedLastRead = Number(safeStorage.getItem('lobby-chat-last-read') || 0);
              if (latest > storedLastRead) {
                markLobbyUnread(latest);
              }
              return;
            }
            if (latest) {
              const senderTarget = {
                accountId: data?.accountId || null,
                senderId: data?.senderId || null,
                name: data?.name || '',
              };
              const senderIsMuted = isSenderMuted(senderTarget, mutedChatUsersRef.current);
              if (senderIsMuted) return;
              markLobbyUnread(latest);
              if (
                topDoc &&
                data &&
                canLobbyChatAccessRef.current &&
                (!isViewingLobbyChatRef.current || activeLobbyChannelRef.current !== chanId)
              ) {
                let sentByMe = false;
                try {
                  const sentRaw = safeStorage.getItem('my_sent_message_ids');
                  const sentIds = sentRaw ? JSON.parse(sentRaw) : [];
                  if (Array.isArray(sentIds) && sentIds.includes(topDoc.id)) sentByMe = true;
                } catch {}
                if (myDmIdentityRef.current && data.accountId === myDmIdentityRef.current) {
                  sentByMe = true;
                }
                if (!sentByMe) {
                  const dec = await decryptChatPayload(data.text || '', chanId);
                  if (cancelled) return;
                  if (isSenderMuted(senderTarget, mutedChatUsersRef.current)) return;
                  const previewText = (dec?.text || '').trim() || (data.imageUrl ? 'Sent an image' : 'New message');
                  setChatHeaderNotice({
                    id: `${chanId}_${topDoc.id}_${latest}`,
                    channelId: chanId,
                    channelName: `#${chanId}`,
                    isDirectMessage: false,
                    senderName: data.name || 'User',
                    senderTarget,
                    text: previewText,
                    timestamp: latest,
                  });
                }
              }
            }
          },
          (error) => {
            if (isFirestorePermissionError(error)) {
              try {
                handleFirestoreError(error, OperationType.GET, `channels/${chanId}/messages`);
              } catch (wrappedErr) {
                console.error(wrappedErr);
              }
            }
            console.warn(`Lobby unread listener error for ${chanId}:`, error);
          },
        );
        channelUnsubs.set(chanId, unsub);
      } catch {}
    };

    const subscribeToLobby = async () => {
      try {
        try {
          await signInAnonymously(lobbyAuth);
        } catch {}
        if (cancelled) return;

        if (safeStorage.getItem('lobby-chat-last-read') === null) {
          safeStorage.setItem('lobby-chat-last-read', String(Date.now()));
        }

        attachChannelListener('general');
        attachChannelListener('temporary');

        try {
          channelsListUnsub = onSnapshot(
            collection(lobbyDb, 'channels'),
            (snap) => {
              let unlockedMap = {};
              try {
                unlockedMap = JSON.parse(safeStorage.getItem('unlocked_chat_channels') || '{}') || {};
              } catch {}
              const now = Date.now();
              const activeExtraIds = new Set();
              snap.forEach((docSnap) => {
                const data = docSnap.data();
                if (!data || data.isDirectMessage) return;
                if (data.createdAt && now - Number(data.createdAt) >= 60 * 60 * 1000) return;
                if (data.isPasswordProtected && !unlockedMap[docSnap.id]) return;
                activeExtraIds.add(docSnap.id);
                attachChannelListener(docSnap.id);
              });
              for (const [id, unsub] of channelUnsubs.entries()) {
                if (id !== 'general' && id !== 'temporary' && !activeExtraIds.has(id)) {
                  try { unsub(); } catch {}
                  channelUnsubs.delete(id);
                }
              }
            },
            (error) => {
              if (isFirestorePermissionError(error)) {
                try {
                  handleFirestoreError(error, OperationType.LIST, 'channels');
                } catch (wrappedErr) {
                  console.error(wrappedErr);
                }
              }
            },
          );
        } catch {}
      } catch (error) {
        console.warn('Lobby unread auth error:', error);
      }
    };

    subscribeToLobby();
    return () => {
      cancelled = true;
      if (channelsListUnsub) {
        try { channelsListUnsub(); } catch {}
      }
      channelUnsubs.forEach((u) => {
        try { u(); } catch {}
      });
      channelUnsubs.clear();
    };
  }, [markLobbyUnread]);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [currentGamePage, setCurrentGamePage] = useState(1);
  const [gameCatalogMode, setGameCatalogMode] = useState(() => {
    try {
      return safeStorage.getItem('unblocked-game-catalog-mode') || 'original';
    } catch {
      return 'original';
    }
  });
  const [gameLayoutMode, setGameLayoutMode] = useState(() => {
    try {
      return safeStorage.getItem('unblocked-game-layout-mode') === 'compact' ? 'compact' : 'standard';
    } catch {
      return 'standard';
    }
  });
  const [targetPageInput, setTargetPageInput] = useState('');
  const [hideUnranked, setHideUnranked] = useState(() => {
    try {
      const saved = safeStorage.getItem('unblocked-hide-unranked');
      return saved === null ? true : saved !== 'false';
    } catch {
      return true;
    }
  });
  const [games, setGames] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(() => safeStorage.getItem('unblocked-sidebar-open') !== 'false');
  useEffect(() => {
    safeStorage.setItem('unblocked-sidebar-open', String(sidebarOpen));
  }, [sidebarOpen]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameFrame, setGameFrame] = useState(null);
  const pendingGameCardScroll = useRef(false);
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);
  const [showWhatsNewDrop, setShowWhatsNewDrop] = useState(true);
  const [hasUnreadWhatsNew, setHasUnreadWhatsNew] = useState(true);
  const restoredSavedGame = useRef(false);

  const launchGameRef = useRef(null);

  const navigateToGameCard = useCallback((actionTarget) => {
    safeStorage.setItem(`whats_new_dismissed_${WHATS_NEW_VERSION}`, 'true');
    setShowWhatsNewModal(false);
    setShowWhatsNewDrop(false);
    setHasUnreadWhatsNew(false);

    let target = actionTarget;
    if (typeof target === 'object' && target !== null) {
      if (target.actionAccountTab) {
        setAccountModalInitialTab(target.actionAccountTab === 'links' ? 'links' : 'profile');
        setAccountModalOpen(true);
        return;
      }
      if (target.actionFilter) {
        setSelectedGame(null);
        setFilter(target.actionFilter);
        return;
      }
      if (target.actionGameTitle) {
        target = target.actionGameTitle;
      }
    }

    if (typeof target === 'string') {
      if (isPortalWorkspaceFilter(target) || target === 'info') {
        setSelectedGame(null);
        setAdminAccountsModalOpen(false);
        setFilter(target);
        return;
      }

      const matched = games.find((g) => {
        if (!g.title) return false;
        const lower = g.title.toLowerCase();
        const tLower = target.toLowerCase();
        if (lower === tLower) return true;
        if (target === 'Bloons TD6 and BTD Battles 2 Copy' && (lower.includes('btd6') || lower.includes('bloons td6'))) return true;
        if (target === 'Quoridor' && lower.includes('quoridor')) return true;
        if (target === 'Gambling (Casino) Game' && lower.includes('gambling')) return true;
        return false;
      });

      if (matched && launchGameRef.current) {
        launchGameRef.current(matched);
        return;
      }

      setSelectedGame(null);
      setFilter('all');
      setGameCatalogMode('all');
      safeStorage.setItem('unblocked-game-catalog-mode', 'all');
      setHideUnranked(false);
      setSearchQuery(target);
      setCurrentGamePage(1);
      pendingGameCardScroll.current = true;
    }
  }, [games]);

  // Single game coordination across arena, about:blank, and other tabs/windows
  const [aboutBlankActiveGame, setAboutBlankActiveGame] = useState(null);
  const [externalActiveGame, setExternalActiveGame] = useState(null);
  const activeAboutBlankWinRef = useRef(null);
  const arenaInstanceId = useRef('arena_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8));

  const broadcastGameStarted = useCallback((gameId, gameTitle, instId, pauseArena = false) => {
    try {
      const ch = new BroadcastChannel('urnperiodic_single_game_bus');
      ch.postMessage({
        type: 'GAME_LOADED',
        gameId,
        gameTitle,
        instanceId: instId,
        pauseArena
      });
      ch.close();
    } catch {}
    try {
      safeStorage.setItem('urnperiodic_active_game_load', JSON.stringify({
        gameId,
        gameTitle,
        instanceId: instId,
        pauseArena,
        timestamp: Date.now()
      }));
    } catch {}
  }, []);

  // Built-in safe page refresh that preserves the outer about:blank disguise without logging the user out
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);
  const handleRefreshPage = useCallback(() => {
    setIsRefreshing(true);
    isRefreshingRef.current = true;

    // Explicitly preserve authentication / login status across this refresh so user is never logged out
    try {
      const isCurrentlyUnlocked = (viewMode === 'games') ||
        safeStorage.getItem('classroom-view-mode') === 'games' ||
        safeSessionStorage.getItem('classroom-view-mode') === 'games';

      if (isCurrentlyUnlocked) {
        safeStorage.setItem('classroom-view-mode', 'games');
        safeStorage.setItem('classroom-passcode-unlocked', 'true');
        safeStorage.setItem('unblocked-refreshing-session', 'true');
        safeStorage.setItem('unblocked-refresh-timestamp', String(Date.now()));
        safeSessionStorage.setItem('classroom-view-mode', 'games');
        safeSessionStorage.setItem('classroom-passcode-unlocked', 'true');
      }
    } catch {}

    // Reload safely: if running inside an iframe (like in an about:blank tab),
    // window.location.reload() refreshes the inner website without wiping out the outer about:blank tab
    setTimeout(() => {
      try {
        window.location.reload();
      } catch {
        window.location.href = window.location.href;
      }
    }, 60);
  }, [viewMode]);

  // Intercept F5 and Ctrl+R / Cmd+R inside iframe so outer about:blank does not become blank
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R'))) {
        let isFramed = false;
        try {
          isFramed = window.self !== window.top;
        } catch {
          isFramed = true;
        }
        if (isFramed) {
          e.preventDefault();
          handleRefreshPage();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRefreshPage]);

  // Listen to single-game coordination events from other tabs / windows
  useEffect(() => {
    let channel = null;
    try {
      channel = new BroadcastChannel('urnperiodic_single_game_bus');
      channel.onmessage = (e) => {
        if (!e.data) return;
        if (e.data.type === 'GAME_LOADED' && e.data.pauseArena === true && e.data.instanceId !== arenaInstanceId.current) {
          // Another game was loaded in another window or tab! Unload arena game frame
          setGameFrame(null);
          setExternalActiveGame({
            id: e.data.gameId,
            title: e.data.gameTitle || 'Another game'
          });
        } else if (e.data.type === 'GAME_CLOSED' && e.data.instanceId !== arenaInstanceId.current) {
          setExternalActiveGame(null);
        }
      };
    } catch {}

    const handleStorage = (e) => {
      if (e.key === 'urnperiodic_active_game_load' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data?.pauseArena === true && data.instanceId !== arenaInstanceId.current) {
            setGameFrame(null);
            setExternalActiveGame({
              id: data.gameId,
              title: data.gameTitle || 'Another game'
            });
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (channel) {
        try { channel.close(); } catch {}
      }
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    let active = true;
    import('./data/gameCatalog').then(({ games: loadedGames }) => {
      if (active) setGames(loadedGames);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (games.length === 0 || selectedGame || restoredSavedGame.current) return;
    const isWorkspace = isPortalWorkspaceFilter(filter) || filter === 'info';
    if (isWorkspace) return;
    restoredSavedGame.current = true;
    const savedId = safeStorage.getItem('unblocked-last-game');
    if (savedId) {
      setSelectedGame(games.find((game) => game.id === savedId) || null);
    }
  }, [games, selectedGame, filter]);

  useEffect(() => {
    if (!selectedGame) {
      setGameFrame(null);
      return undefined;
    }

    // If this game was opened in about:blank, keep the in-page arena frame unloaded
    if (aboutBlankActiveGame === selectedGame.id) {
      setGameFrame(null);
      return undefined;
    }

    // If switching to a different game, clear about:blank active state
    if (aboutBlankActiveGame && aboutBlankActiveGame !== selectedGame.id) {
      setAboutBlankActiveGame(null);
    }

    // Enforce only one game loaded: broadcast to any other windows/tabs to unload their game
    setExternalActiveGame(null);
    arenaInstanceId.current = 'arena_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    broadcastGameStarted(
      selectedGame.id,
      selectedGame.title,
      arenaInstanceId.current,
      aboutBlankActiveGame === selectedGame.id
    );

    const cachedFrame = gameHtmlCache.get(selectedGame.url);
    if (cachedFrame) {
      setGameFrame(cachedFrame);
      return undefined;
    }

    const controller = new AbortController();
    setGameFrame(null);

    loadGameFrame(selectedGame.url, controller.signal)
      .then((frame) => {
        setCachedGameHtml(selectedGame.url, frame);
        setGameFrame(frame);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setGameFrame(createGameLoadErrorDocument(selectedGame.url));
      });

    return () => controller.abort();
  }, [selectedGame, broadcastGameStarted, aboutBlankActiveGame]);

  const [gameHeaderHidden, setGameHeaderHidden] = useState(false);
  const [isBootComplete, setIsBootComplete] = useState(false);
  const [autoHideHeader, setAutoHideHeader] = useState(() => {
    const saved = safeStorage.getItem('unblocked-auto-hide-header');
    return saved === null ? true : saved === 'true'; // Defaults to true
  });
  const [altBarOpen, setAltBarOpen] = useState(true);
  const [headerOpen, setHeaderOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);

  const compactHeaderRef = useRef(null);
  const compactLeftRef = useRef(null);
  const compactRightRef = useRef(null);
  const compactCenterRef = useRef(null);

  useEffect(() => {
    safeStorage.setItem('unblocked-last-filter', filter);
    const isWorkspace = isPortalWorkspaceFilter(filter) || filter === 'info';
    if (isWorkspace) {
      setSelectedGame(null);
      setGameHeaderHidden(false);
      setWindowFullscreen(false);
      safeStorage.removeItem('unblocked-last-game');
    }
  }, [filter]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsBootComplete(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const isWorkspace = isPortalWorkspaceFilter(filter) || filter === 'info';
    if (isWorkspace) {
      setGameHeaderHidden(false);
      setWindowFullscreen(false);
      return;
    }
    if (selectedGame) {
      safeStorage.setItem('unblocked-last-game', selectedGame.id);
      if (autoHideHeader && isBootComplete) {
        setGameHeaderHidden(true);
      } else {
        setGameHeaderHidden(false);
      }
    } else {
      if (games.length === 0) return;
      safeStorage.removeItem('unblocked-last-game');
      setWindowFullscreen(false);
      setGameHeaderHidden(false);
    }
  }, [selectedGame, autoHideHeader, games.length, filter, isBootComplete]);

  useEffect(() => {
    setCurrentGamePage(1);
  }, [filter, searchQuery, selectedGame]);
  const [showGithubNotice, setShowGithubNotice] = useState(() => {
    return safeStorage.getItem('academic-github-notice-dismissed') !== 'true';
  });

  const openWorkspaceInAboutBlank = (currentFilter) => {
    if (currentFilter === 'chat') return false;
    const workspaceTarget = getWorkspaceAboutBlankTargetUrl(
      currentFilter,
      window.location.origin,
      decoyType || 'classroom',
    );
    let url = workspaceTarget || '';
    if (!url) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('decoyType', decoyType);
      searchParams.set('view', 'games');
      searchParams.set('unlocked', 'true');
      if (selectedGame) {
        searchParams.set('game', selectedGame.id);
      }
      url = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;
    }

    try {
      const win = window.open('about:blank', '_blank');
      if (win) {
        let parentTitle = getDecoyTitle(decoyType, customDecoyTitles);
        let parentFavicon = getDecoyFavicon(decoyType);

        win.document.open();
        win.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${parentTitle}</title>
            <link rel="icon" href="${parentFavicon}">
            <link rel="shortcut icon" href="${parentFavicon}">
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              html, body { width: 100vw; height: 100vh; overflow: hidden; background: #080b12; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
              #cloak-frame { width: 100vw; height: 100vh; border: none; display: block; background: #080b12; }
              #loading-overlay {
                position: fixed;
                inset: 0;
                background: #080b12;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.35s ease, visibility 0.35s ease;
              }
              #loading-overlay.hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
              }
              .spinner-ring {
                width: 48px;
                height: 48px;
                border: 3px solid rgba(0, 229, 176, 0.15);
                border-top-color: #00e5b0;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin-bottom: 20px;
              }
              .loading-text {
                color: #f3f4f6;
                font-size: 15px;
                font-weight: 600;
                letter-spacing: -0.01em;
                margin-bottom: 6px;
              }
              .loading-subtext {
                color: #6b7280;
                font-size: 12px;
                font-family: monospace;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div id="loading-overlay">
              <div class="spinner-ring"></div>
              <div class="loading-text">${parentTitle}</div>
              <div class="loading-subtext">Initializing cloaked workspace...</div>
            </div>
            <iframe 
              id="cloak-frame" 
              src="${url}"
              allow="pointer-lock; fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write; microphone; camera; geolocation; gamepad; gamepads; accelerometer; gyroscope"
              allowfullscreen="true"
            ></iframe>
            <script>
              (function() {
                var frame = document.getElementById('cloak-frame');
                var loader = document.getElementById('loading-overlay');
                function hideLoader() {
                  if (loader) loader.classList.add('hidden');
                }
                if (frame) {
                  frame.addEventListener('load', hideLoader);
                  setTimeout(hideLoader, 3000); // Safety fallback
                }
                window.addEventListener('keydown', function(e) {
                  if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R'))) {
                    e.preventDefault();
                    try {
                      localStorage.setItem('classroom-view-mode', 'games');
                      localStorage.setItem('classroom-passcode-unlocked', 'true');
                      localStorage.setItem('unblocked-refreshing-session', 'true');
                      localStorage.setItem('unblocked-refresh-timestamp', String(Date.now()));
                    } catch (err) {}
                    try {
                      if (frame && frame.contentWindow) {
                        frame.contentWindow.location.reload();
                        return;
                      }
                    } catch (err) {}
                    if (frame) frame.src = "${url}";
                  }
                });
              })();
            </script>
          </body>
          </html>
        `);
        win.document.close();
        return true;
      }
    } catch (err) {
      console.warn("Could not open about:blank window:", err);
    }
    console.warn("Popup blocked! Please allow popups for this site.");
    return false;
  };

  // State to persist recently played games across sessions
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const stored = safeStorage.getItem('unblocked-recently-played');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Record a recently played game (automatic when clicked or opened)
  const recordRecentlyPlayed = useCallback((gameOrId) => {
    if (!gameOrId) return;
    const gameId = typeof gameOrId === 'object' ? gameOrId.id : gameOrId;
    if (!gameId) return;

    setRecentlyPlayed((prev) => {
      const currentList = Array.isArray(prev) ? prev : [];
      const filtered = currentList.filter((id) => id !== gameId);
      const updated = [gameId, ...filtered].slice(0, 30);
      try {
        safeStorage.setItem('unblocked-recently-played', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  }, []);

  const clearRecentlyPlayed = useCallback(() => {
    setRecentlyPlayed([]);
    try {
      safeStorage.removeItem('unblocked-recently-played');
    } catch (err) {}
  }, []);

  const removeRecentlyPlayed = useCallback((e, gameId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setRecentlyPlayed((prev) => {
      const currentList = Array.isArray(prev) ? prev : [];
      const updated = currentList.filter((id) => id !== gameId);
      try {
        safeStorage.setItem('unblocked-recently-played', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  }, []);

  const [disableAboutBlankPause, setDisableAboutBlankPause] = useState(() => {
    return safeSessionStorage.getItem('unblocked-disable-about-blank-pause') === 'true';
  });

  const turnOffAboutBlankScreen = useCallback(() => {
    setAboutBlankActiveGame(null);
    setExternalActiveGame(null);
    if (selectedGame) {
      arenaInstanceId.current = 'arena_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      broadcastGameStarted(selectedGame.id, selectedGame.title, arenaInstanceId.current);
      const cached = gameHtmlCache.get(selectedGame.url);
      if (cached) {
        setGameFrame(cached);
      } else {
        loadGameFrame(selectedGame.url).then((f) => {
          setCachedGameHtml(selectedGame.url, f);
          setGameFrame(f);
        });
      }
    }
  }, [selectedGame]);

  const toggleDisableAboutBlankPause = (value) => {
    const next = typeof value === 'boolean' ? value : !disableAboutBlankPause;
    setDisableAboutBlankPause(next);
    safeSessionStorage.setItem('unblocked-disable-about-blank-pause', String(next));
    if (next) {
      turnOffAboutBlankScreen();
    }
  };

  const launchGame = (gameToLaunch) => {
    if (!gameToLaunch || !canGamesAccess) return;
    recordRecentlyPlayed(gameToLaunch.id);
    safeStorage.setItem('unblocked-last-game', gameToLaunch.id);
    setGameFrame({ src: gameToLaunch.url });
    setSelectedGame(gameToLaunch);
  };
  launchGameRef.current = launchGame;

  const openGameInAboutBlank = (gameToOpen) => {
    if (!gameToOpen || !canGamesAccess) return;
    const win = window.open("about:blank", "_blank");
    if (!win) {
      alert("Popup blocked. Allow popups for this site.");
      return;
    }

    recordRecentlyPlayed(gameToOpen.id);
    setSelectedGame(gameToOpen);
    if (!disableAboutBlankPause) {
      setAboutBlankActiveGame(gameToOpen.id);
      setGameFrame(null);
    } else {
      setAboutBlankActiveGame(null);
      const cached = gameHtmlCache.get(gameToOpen.url);
      if (cached) {
        setGameFrame(cached);
      } else {
        loadGameFrame(gameToOpen.url).then((f) => {
          setCachedGameHtml(gameToOpen.url, f);
          setGameFrame(f);
        });
      }
    }

    const classroomFavicon = "https://ssl.gstatic.com/classroom/favicon.png";
    let tabTitle = getDecoyTitle(decoyType, customDecoyTitles);
    let tabFavicon = getDecoyFavicon(decoyType);

    win.document.open();
    win.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${tabTitle}</title>
        <link rel="icon" type="image/png" href="${tabFavicon}">
        <link rel="shortcut icon" type="image/png" href="${tabFavicon}">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body {
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #080b12;
            color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          #about-blank-game-frame {
            width: 100vw;
            height: 100vh;
            border: none;
            display: block;
            background: #080b12;
          }
          #game-loader {
            position: fixed;
            inset: 0;
            background: #080b12;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: opacity 0.4s ease, visibility 0.4s ease;
          }
          #game-loader.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
          .loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 32px;
            max-width: 420px;
          }
          .spinner-wrapper {
            position: relative;
            width: 64px;
            height: 64px;
            margin-bottom: 24px;
          }
          .spinner-track {
            position: absolute;
            inset: 0;
            border: 3px solid rgba(0, 229, 176, 0.12);
            border-radius: 50%;
          }
          .spinner-glow {
            position: absolute;
            inset: 0;
            border: 3px solid transparent;
            border-top-color: #00e5b0;
            border-right-color: #3b82f6;
            border-radius: 50%;
            animation: spin 0.85s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
          }
          .spinner-core {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 12px;
            height: 12px;
            background: #00e5b0;
            border-radius: 50%;
            box-shadow: 0 0 16px #00e5b0;
          }
          .game-title {
            font-size: 18px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 6px;
            letter-spacing: -0.01em;
          }
          .game-status {
            font-size: 13px;
            color: #9ca3af;
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: monospace;
          }
          .status-pulse {
            width: 7px;
            height: 7px;
            background: #00e5b0;
            border-radius: 50%;
            box-shadow: 0 0 8px #00e5b0;
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        </style>
      </head>
      <body>
        <div id="game-loader">
          <div class="loader-container">
            <div class="spinner-wrapper">
              <div class="spinner-track"></div>
              <div class="spinner-glow"></div>
              <div class="spinner-core"></div>
            </div>
            <div class="game-title">${gameToOpen.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            <div class="game-status">
              <span class="status-pulse"></span>
              <span>Launching Secure Portal...</span>
            </div>
          </div>
        </div>
        <iframe 
          id="about-blank-game-frame" 
          allow="pointer-lock; fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write; microphone; camera; geolocation; gamepad; gamepads; accelerometer; gyroscope" 
          referrerpolicy="no-referrer"
          allowfullscreen="true"
        ></iframe>
        <script>
          (function() {
            var f = document.getElementById('about-blank-game-frame');
            var loader = document.getElementById('game-loader');
            function hideLoader() {
              if (loader) loader.classList.add('hidden');
            }
            if (f) {
              f.addEventListener('load', hideLoader);
              setTimeout(hideLoader, 4000);
            }
            window.addEventListener('keydown', function(e) {
              if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R'))) {
                e.preventDefault();
                if (f) {
                  try {
                    f.contentWindow.location.reload();
                  } catch (err) {
                    if (f.src) f.src = f.src;
                  }
                }
              }
            });
          })();
        </script>
      </body>
      </html>
    `);
    win.document.close();

    const frame = /** @type {HTMLIFrameElement | null} */ (win.document.getElementById('about-blank-game-frame'));
    const cachedFrame = gameHtmlCache.get(gameToOpen.url);
    const loadGameHtml = cachedFrame
      ? Promise.resolve(cachedFrame)
      : loadGameFrame(gameToOpen.url).then((gameFrame) => {
          setCachedGameHtml(gameToOpen.url, gameFrame);
          return gameFrame;
        });

    loadGameHtml
      .then((gameFrameData) => {
        if (!win.closed && frame) {
          if (gameFrameData.src) {
            frame.src = gameFrameData.src;
          } else if (gameFrameData.srcDoc) {
            try {
              const blob = new Blob([gameFrameData.srcDoc], { type: 'text/html;charset=utf-8' });
              const blobUrl = URL.createObjectURL(blob);
              frame.src = blobUrl;
              frame.onload = () => {
                try {
                  const l = win.document.getElementById('game-loader');
                  if (l) l.classList.add('hidden');
                } catch {}
                try { URL.revokeObjectURL(blobUrl); } catch {}
              };
            } catch {
              frame.srcdoc = gameFrameData.srcDoc;
            }
          }
        }
      })
      .catch(() => {
        if (!win.closed && frame) {
          frame.srcdoc = createGameLoadErrorDocument(gameToOpen.url).srcDoc;
        }
      });
  };

  // States for collapsible & resizable docked game chat
  const [dockedChatWidth, setDockedChatWidth] = useState(235); // 235px lowest width
  const [dockedChatCollapsed, setDockedChatCollapsed] = useState(true);
  const [isDraggingDock, setIsDraggingDock] = useState(false);

  useEffect(() => {
    const viewingNow = filter === 'lobbychat' || (Boolean(selectedGame) && !dockedChatCollapsed);
    isViewingLobbyChatRef.current = viewingNow;
    if (viewingNow) {
      const latest = Number(safeStorage.getItem('lobby-chat-latest') || 0);
      const readTs = Math.max(latest, Date.now());
      safeStorage.setItem('lobby-chat-last-read', String(readTs));
      setHasUnreadLobby(false);
      setChatHeaderNotice((prev) => (prev && prev.channelId === activeLobbyChannelRef.current ? null : prev));
    }
  }, [filter, selectedGame, dockedChatCollapsed]);

  // Monitor mouse moving & mouse up for docking drag resize
  useEffect(() => {
    if (!isDraggingDock) return;
    const handleMouseMove = (e) => {
      const container = document.getElementById('game-arena-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const width = rect.right - e.clientX;
      
      // Clamp width: min 180px, max 50% of the game arena container width
      const minW = 180;
      const maxW = Math.min(600, rect.width * 0.5);
      if (width >= minW && width <= maxW) {
        setDockedChatWidth(width);
      }
    };
    const handleMouseUp = () => {
      setIsDraggingDock(false);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingDock]);

  const [zoom, setZoom] = useState(1);
  const [windowFullscreen, setWindowFullscreen] = useState(false);
  const [failedThumbnails, setFailedThumbnails] = useState({});
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = safeStorage.getItem('unblocked-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const setViewModeAndSave = (mode) => {
    setViewMode(mode);
    safeStorage.setItem('classroom-view-mode', mode);
    safeStorage.setItem('classroom-passcode-unlocked', mode === 'games' ? 'true' : 'false');
    safeSessionStorage.setItem('classroom-view-mode', mode);
    safeSessionStorage.setItem('classroom-passcode-unlocked', mode === 'games' ? 'true' : 'false');
    if (mode === 'articles') {
      safeStorage.removeItem('unblocked-refreshing-session');
      safeStorage.removeItem('unblocked-refresh-timestamp');
      clearOwnerSessionFlag();
      setIsOwnerAdmin(false);
      setIsAdminPassUnlocked(false);
      setIsDecoyPassUnlocked(false);
      setAdminAccountsModalOpen(false);
    }
    if (mode === 'games') {
      setHeaderOpen(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'games') {
      setHeaderOpen(false);
    }
  }, [viewMode]);

  const [autoLockOnClose, setAutoLockOnClose] = useState(() => {
    const saved = safeStorage.getItem('unblocked-auto-lock-on-close');
    return saved === 'true'; // Defaults to false so reloads/closing tabs don't unexpectedly sign users out
  });

  const [autoSignOutOnIdle, setAutoSignOutOnIdle] = useState(() => isAutoSignOutOnIdleEnabled());

  const [panicKeysEnabled, setPanicKeysEnabled] = useState(() => {
    const saved = safeStorage.getItem('unblocked-panic-keys-enabled');
    return saved !== 'false'; // Defaults to true
  });

  const [historyMaskingEnabled, setHistoryMaskingEnabled] = useState(() => {
    const saved = safeStorage.getItem('unblocked-history-masking');
    return saved !== 'false'; // Defaults to true
  });

  // Browser History Sanitization & Masking Engine
  // Continuously prevents game titles, sub-paths, and gaming query parameters
  // from accumulating in your browser history stack by leveraging history.replaceState()
  useEffect(() => {
    if (!historyMaskingEnabled || typeof window === 'undefined') return;

    try {
      // Determine clean benign root or standard path
      const currentUrl = window.location;
      const rawPath = currentUrl.pathname || '/';
      const cleanPath = currentUrl.protocol === 'file:' ? rawPath : rawPath === '/index.html' ? '/index.html' : '/';

      // If there are lingering gaming or sign-in query parameters, sanitize them in-place
      const searchParams = new URLSearchParams(currentUrl.search);
      let needsSanitize = cleanPath !== rawPath;

      // Check if URL has gaming or sign-in query parameters that should be wiped from history
      ['filter', 'view', 'unlocked', 'game', 'id', 'search', 'signin', 'login', 'autologin', 'user', 'username', 'u', 'password', 'pass', 'p'].forEach(param => {
        if (searchParams.has(param)) {
          searchParams.delete(param);
          needsSanitize = true;
        }
      });

      let cleanHash = currentUrl.hash || '';
      if (/(?:signin|login|autologin|user|username|u|password|pass|p)=/i.test(cleanHash)) {
        cleanHash = '';
        needsSanitize = true;
      }

      const sanitizedUrl = needsSanitize
        ? `${cleanPath}${searchParams.toString() ? `?${searchParams.toString()}` : ''}${cleanHash}`
        : cleanPath;

      const maskedState = {
        disguise: 'educational_workspace',
        app: 'Google Classroom',
        timestamp: Date.now()
      };

      // Replace current history entry in place - NEVER pushes a new entry
      window.history.replaceState(maskedState, document.title, sanitizedUrl);
    } catch (e) {
      // Gracefully handle iframe sandbox or restricted origin policies
    }
  }, [historyMaskingEnabled, selectedGame, filter, viewMode, decoyType]);

  // Sign Out & Lock Workspace when tab or window is closed (if enabled in Settings)
  useEffect(() => {
    const handleUnload = (e) => {
      if (!autoLockOnClose) return;
      if (e?.type === 'pagehide' && e.persisted) return;
      // Only lock/sign out when an active unlocked workspace tab itself closes (not the background launcher tab)
      if (viewMode !== 'games') return;
      // If the user triggered an in-website refresh or an active reload, do not sign out
      if (isRefreshingRef.current) return;
      try {
        const refreshingSession = safeStorage.getItem('unblocked-refreshing-session') === 'true';
        const refreshTime = Number(safeStorage.getItem('unblocked-refresh-timestamp') || 0);
        if (refreshingSession && Date.now() - refreshTime < 15000) {
          return;
        }
      } catch {}

      clearAccountSession();
      clearOwnerSessionFlag();
      clearSessionActivity();
      safeStorage.setItem('classroom-view-mode', 'articles');
      safeStorage.setItem('classroom-passcode-unlocked', 'false');
      safeSessionStorage.setItem('classroom-view-mode', 'articles');
      safeSessionStorage.setItem('classroom-passcode-unlocked', 'false');
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [autoLockOnClose, viewMode]);

  const [passcode, setPasscode] = useState('');
  const [isShake, setIsShake] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
  const [isAdminPassUnlocked, setIsAdminPassUnlocked] = useState(() => getSavedOwnerSession());
  const [isDecoyPassUnlocked, setIsDecoyPassUnlocked] = useState(() => getSavedOwnerSession());
  const [isOwnerAdmin, setIsOwnerAdmin] = useState(() => getSavedOwnerSession());
  const [activeAccount, setActiveAccount] = useState(null);
  if (activeAccountLowerRef.current !== (activeAccount?.usernameLower || '')) {
    activeAccountLowerRef.current = activeAccount?.usernameLower || '';
    manualThemeOverrideUserRef.current = '';
    manualChatThemeOverrideUserRef.current = '';
    appliedDefaultGirlsForUserRef.current = '';
    appliedDefaultGirlsChatForUserRef.current = '';
  }
  const [accountSessionChecked, setAccountSessionChecked] = useState(() => !getSavedAccountSession());
  const [workspaceConfig, setWorkspaceConfig] = useState(() => getCachedWorkspaceConfig());
  const [workspaceConfigLoaded, setWorkspaceConfigLoaded] = useState(false);
  const [dismissedBroadcastId, setDismissedBroadcastId] = useState(() => {
    try {
      return safeStorage.getItem('unblocked-dismissed-broadcast-id') || '';
    } catch {
      return '';
    }
  });
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountModalInitialTab, setAccountModalInitialTab] = useState('profile');
  const [accountModalPrefillUser, setAccountModalPrefillUser] = useState('');
  const openAccountModalOnTab = useCallback((tab = 'profile', prefillUser = '') => {
    setAccountModalInitialTab(tab === 'links' ? 'links' : 'profile');
    if (typeof prefillUser === 'string' && prefillUser) {
      setAccountModalPrefillUser(prefillUser);
    }
    setAccountModalOpen(true);
  }, []);
  const [pendingUrlSignInReq, setPendingUrlSignInReq] = useState(() =>
    typeof window !== 'undefined' ? parseUrlSignInRequest(window.location) : null,
  );
  const [instantSignInBusy, setInstantSignInBusy] = useState(() =>
    typeof window !== 'undefined' ? Boolean(parseUrlSignInRequest(window.location)) : false,
  );
  const [instantSignInToast, setInstantSignInToast] = useState(null);
  const [pendingAboutBlankLaunch, setPendingAboutBlankLaunch] = useState(null);
  const [isInAboutBlank] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      if (typeof window.location?.href === 'string' && window.location.href.startsWith('about:blank')) {
        return true;
      }
      if (window.self !== window.top) {
        const parentHref = window.parent?.location?.href;
        if (typeof parentHref === 'string' && parentHref.startsWith('about:blank')) return true;
        const topHref = window.top?.location?.href;
        if (typeof topHref === 'string' && topHref.startsWith('about:blank')) return true;
      }
    } catch {}
    return false;
  });
  const [aboutBlankNoticeDismissed, setAboutBlankNoticeDismissed] = useState(false);
  const [aboutBlankNoticePopupBlocked, setAboutBlankNoticePopupBlocked] = useState(false);
  const [aboutBlankNoticeOpen, setAboutBlankNoticeOpen] = useState(false);
  const aboutBlankNoticeRef = useRef(null);
  useEffect(() => {
    if (!aboutBlankNoticeOpen) return;
    const handleOutside = (e) => {
      if (aboutBlankNoticeRef.current && !aboutBlankNoticeRef.current.contains(e.target)) {
        setAboutBlankNoticeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [aboutBlankNoticeOpen]);
  const [adminAccountsModalOpen, setAdminAccountsModalOpen] = useState(false);
  const [signOutNotice, setSignOutNotice] = useState('');
  const [rememberedUsers, setRememberedUsers] = useState(() => getRememberedLocalUsers());
  const [lockAuthTab, setLockAuthTab] = useState('account');
  const [lockUsername, setLockUsername] = useState(() => getRememberedLocalUsers()[0]?.username || '');
  const [lockPassword, setLockPassword] = useState('');
  const [lockAccountError, setLockAccountError] = useState('');
  const [lockAccountBusy, setLockAccountBusy] = useState(false);
  const [lockOpenInSeparateTab, setLockOpenInSeparateTab] = useState(true);
  const suppressAccountSyncRef = useRef(false);
  const suppressAccountSyncTimerRef = useRef(null);
  const activeAccountSyncTimerRef = useRef(null);
  const lastAppliedProfileSigRef = useRef('');
  const lastWrittenProfileSigRef = useRef('');

  const hasAdminAccess = Boolean(isOwnerAdmin || (activeAccount?.isActive && activeAccount?.isAdmin));

  const canAccessWorkspace = useCallback(
    (key) => {
      if (hasAdminAccess) return true;
      if (workspaceConfig?.siteLockdown) return false;
      const canOverrideGlobalOff = Boolean(
        key !== 'aiAccess' &&
          workspaceConfig?.allowAccountOverrides !== false &&
          activeAccount?.isActive &&
          activeAccount?.allowGlobalOverride,
      );
      const canOverrideAiGlobalOff = Boolean(
        key === 'aiAccess' &&
          workspaceConfig?.allowAiOverrides !== false &&
          activeAccount?.isActive &&
          activeAccount?.allowAiOverride,
      );
      if (workspaceConfig && workspaceConfig[key] === false && !canOverrideGlobalOff && !canOverrideAiGlobalOff) {
        return false;
      }
      if (key === 'aiAccess') {
        return Boolean(
          isAdminPassUnlocked ||
            (activeAccount?.isActive && (activeAccount?.aiAccess || activeAccount?.allowAiOverride)),
        );
      }
      if (key === 'decoysAccess') {
        return Boolean(isDecoyPassUnlocked || (activeAccount?.isActive && activeAccount?.decoysAccess));
      }
      if (activeAccount?.isActive) {
        return activeAccount[key] !== false;
      }
      return true;
    },
    [hasAdminAccess, isAdminPassUnlocked, isDecoyPassUnlocked, activeAccount, workspaceConfig],
  );

  const canGamesAccess = canAccessWorkspace('gamesAccess');
  const canMoviesAccess = canAccessWorkspace('moviesAccess');
  const canMoreMoviesAccess = canAccessWorkspace('moreMoviesAccess');
  const canYoutubeAccess = canAccessWorkspace('youtubeAccess');
  const canLobbyChatAccess = canAccessWorkspace('lobbyChatAccess');
  const canDownloadAccess = canAccessWorkspace('downloadAccess');
  const isAdminUnlocked = canAccessWorkspace('aiAccess');
  const isDecoysUnlocked = canAccessWorkspace('decoysAccess');

  const myDmIdentity = activeAccount?.usernameLower || (isOwnerAdmin ? '__owner__' : null);

  useEffect(() => {
    myDmIdentityRef.current = myDmIdentity;
  }, [myDmIdentity]);

  useEffect(() => {
    canLobbyChatAccessRef.current = canLobbyChatAccess;
  }, [canLobbyChatAccess]);

  // Listen for incoming Direct Messages for live header notifications & unread dot
  useEffect(() => {
    if (!myDmIdentity || !canLobbyChatAccess) return undefined;
    let initialized = false;
    let cancelled = false;
    let unsub = null;
    const seenLastTs = new Map();

    const startDmListener = async () => {
      try {
        await signInAnonymously(lobbyAuth);
      } catch {}
      if (cancelled) return;

      const dmQuery = query(
        collection(lobbyDb, 'directMessages'),
        where('participants', 'array-contains', myDmIdentity),
      );
      unsub = onSnapshot(
        dmQuery,
        async (snapshot) => {
          if (!initialized) {
            snapshot.forEach((docSnap) => {
              const d = docSnap.data();
              seenLastTs.set(docSnap.id, Number(d?.lastMessageAt || 0));
            });
            initialized = true;
            return;
          }
          for (const change of snapshot.docChanges()) {
            if (change.type === 'removed') {
              const removedId = change.doc.id;
              seenLastTs.delete(removedId);
              safeStorage.removeItem(`local_messages_${removedId}`);
              setChatHeaderNotice((prev) => (prev?.channelId === removedId ? null : prev));
              continue;
            }
            if (change.type !== 'added' && change.type !== 'modified') continue;
            const docSnap = change.doc;
            const data = docSnap.data();
            const lastTs = Number(data?.lastMessageAt || 0);
            const prevTs = seenLastTs.get(docSnap.id) || 0;
            if (lastTs <= prevTs) continue;
            seenLastTs.set(docSnap.id, lastTs);
            if (data?.lastSenderId === myDmIdentity) continue;
            const senderTarget = {
              accountId: data?.lastSenderId || null,
              partnerId: data?.lastSenderId || null,
              name: data?.lastSenderName || '',
            };
            if (isSenderMuted(senderTarget, mutedChatUsersRef.current)) continue;
            markLobbyUnread(lastTs);
            if (isViewingLobbyChatRef.current && activeLobbyChannelRef.current === docSnap.id) {
              continue;
            }
            const dec = await decryptChatPayload(data?.lastMessageText || '', docSnap.id);
            if (cancelled) return;
            if (isSenderMuted(senderTarget, mutedChatUsersRef.current)) continue;
            const cleanText = (dec?.text || '').trim() || 'Sent a message';
            setChatHeaderNotice({
              id: `${docSnap.id}_${lastTs}`,
              channelId: docSnap.id,
              channelName: 'DM',
              isDirectMessage: true,
              senderName: data?.lastSenderName || 'User',
              senderTarget,
              text: cleanText,
              timestamp: lastTs,
            });
          }
        },
        (error) => {
          if (isFirestorePermissionError(error)) {
            try {
              handleFirestoreError(error, OperationType.LIST, 'directMessages');
            } catch (wrappedErr) {
              console.error(wrappedErr);
            }
          }
        },
      );
    };

    startDmListener();
    return () => {
      cancelled = true;
      if (unsub) {
        try { unsub(); } catch {}
      }
    };
  }, [myDmIdentity, canLobbyChatAccess, markLobbyUnread]);

  const handleActiveLobbyChannelChange = useCallback((chanId) => {
    if (!chanId) return;
    activeLobbyChannelRef.current = chanId;
    setChatHeaderNotice((prev) =>
      prev && prev.channelId === chanId && isViewingLobbyChatRef.current ? null : prev,
    );
  }, []);

  const openChatFromHeaderNotice = useCallback(
    (notice) => {
      if (!notice?.channelId) return;
      setTargetChannelRequest({ id: notice.channelId, nonce: Date.now() });
      setChatHeaderNotice(null);
      setHasUnreadLobby(false);
      const latest = Number(safeStorage.getItem('lobby-chat-latest') || 0);
      safeStorage.setItem('lobby-chat-last-read', String(Math.max(latest, Date.now())));
      if (selectedGame) {
        setDockedChatCollapsed(false);
      } else {
        setFilter('lobbychat');
        setSelectedGame(null);
      }
    },
    [selectedGame],
  );

  const renderChatHeaderNotice = (variant = 'compact') => {
    if (!canLobbyChatAccess) return null;
    const isDm = Boolean(chatHeaderNotice?.isDirectMessage);
    const isGame = variant === 'game';
    const widthClass = isGame
      ? 'max-w-[175px] sm:max-w-[260px] lg:max-w-[340px]'
      : variant === 'expanded'
        ? 'max-w-[195px] sm:max-w-[260px] lg:max-w-[320px]'
        : 'max-w-[155px] sm:max-w-[225px] lg:max-w-[285px]';

    return (
      <AnimatePresence mode="wait">
        {chatHeaderNotice && (
          <motion.div
            key={chatHeaderNotice.id}
            initial={animationsEnabled ? { opacity: 0, y: -8, scale: 0.94 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={animationsEnabled ? { opacity: 0, y: -6, scale: 0.94 } : undefined}
            transition={
              animationsEnabled
                ? { type: 'spring', stiffness: 420, damping: 26, mass: 0.78 }
                : { duration: 0 }
            }
            role="button"
            tabIndex={0}
            onClick={() => openChatFromHeaderNotice(chatHeaderNotice)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openChatFromHeaderNotice(chatHeaderNotice);
              }
            }}
            title={`${isDm ? 'DM' : chatHeaderNotice.channelName} from ${chatHeaderNotice.senderName}: ${chatHeaderNotice.text}`}
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-color) 42%, var(--card-border))',
              background: 'color-mix(in srgb, var(--accent-color) 7%, var(--card-bg))',
            }}
            className={`group relative overflow-hidden flex items-center gap-1.5 min-w-0 ${widthClass} ${
              isGame ? 'h-6 rounded-md pl-1 pr-1' : 'h-[28px] rounded-lg pl-1.5 pr-1.5'
            } border text-[var(--text-primary)] shadow-[0_2px_10px_var(--accent-shadow)] hover:border-[var(--accent-color)] cursor-pointer transition-all shrink select-none`}
          >
            <span
              className={`relative ${isGame ? 'w-4 h-4 rounded' : 'w-[18px] h-[18px] rounded-md'} bg-[var(--accent-color)] text-[var(--bg-color)] flex items-center justify-center shrink-0`}
            >
              {isDm ? (
                <MessageCircle className="w-2.5 h-2.5" />
              ) : (
                <MessageSquare className="w-2.5 h-2.5" />
              )}
              {animationsEnabled && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] ring-1 ring-[var(--bg-color)] animate-ping" />
              )}
            </span>
            <span
              style={{
                background: 'color-mix(in srgb, var(--accent-color) 14%, var(--bg-secondary))',
                borderColor: 'color-mix(in srgb, var(--accent-color) 30%, var(--card-border))',
              }}
              className="px-1.5 py-[1px] rounded border text-[8px] font-mono font-extrabold uppercase tracking-wider text-[var(--accent-color)] shrink-0 leading-tight"
            >
              {isDm ? 'DM' : chatHeaderNotice.channelName}
            </span>
            <span className="text-[10.5px] truncate min-w-0 flex-1 leading-none">
              <span className="font-bold text-[var(--text-primary)]">{chatHeaderNotice.senderName}</span>
              <span className="text-[var(--text-muted)] font-medium">: {chatHeaderNotice.text}</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setChatHeaderNotice(null);
              }}
              className="w-4 h-4 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors shrink-0 cursor-pointer"
              title="Dismiss notification"
              aria-label="Dismiss notification"
            >
              <X className="w-2.5 h-2.5" />
            </button>
            {animationsEnabled && (
              <motion.span
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                style={{ transformOrigin: 'left center', background: 'var(--accent-color)' }}
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] opacity-65"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminError, setAdminError] = useState('');

  const currentAccountSettings = useMemo(
    () =>
      sanitizeAccountSettings({
        animationsEnabled,
        gameLayoutMode,
        gameCatalogMode,
        hideUnranked,
        autoHideHeader,
        autoLockOnClose,
        autoSignOutOnIdle,
        panicKeysEnabled,
        historyMaskingEnabled,
        decoyType,
        autoRandomizeDecoy,
        randomizeInterval,
        randomizePool,
        customDecoyTitles,
        chatTheme,
        sidebarOpen,
      }),
    [
      animationsEnabled,
      gameLayoutMode,
      gameCatalogMode,
      hideUnranked,
      autoHideHeader,
      autoLockOnClose,
      autoSignOutOnIdle,
      panicKeysEnabled,
      historyMaskingEnabled,
      decoyType,
      autoRandomizeDecoy,
      randomizeInterval,
      randomizePool,
      customDecoyTitles,
      chatTheme,
      sidebarOpen,
    ],
  );

  const buildAccountProfileSig = useCallback((acc) => {
    if (!acc) return '';
    return JSON.stringify({
      favorites: Array.isArray(acc.favorites) ? acc.favorites : [],
      recentlyPlayed: Array.isArray(acc.recentlyPlayed) ? acc.recentlyPlayed : [],
      preferredTheme: acc.preferredTheme || null,
      preferredMode: acc.preferredMode === 'light' || acc.preferredMode === 'dark' ? acc.preferredMode : null,
      accountSettings: sanitizeAccountSettings(acc.accountSettings || {}),
    });
  }, []);

  const workspaceConfigRef = useRef(workspaceConfig);
  workspaceConfigRef.current = workspaceConfig;

  const isThemeLockedToGirls = Boolean(
    activeAccount?.isActive &&
      activeAccount?.defaultGirlsTheme &&
      (workspaceConfig?.girlsThemePolicy || 'default_if_unset') === 'lock',
  );

  const handleUserThemeChange = useCallback(
    (nextTheme) => {
      if (isThemeLockedToGirls && nextTheme !== 'girls') return;
      autoAppliedGirlsThemeRef.current = false;
      manualThemeOverrideUserRef.current = activeAccountLowerRef.current || '__guest__';
      setTheme(nextTheme);
      safeStorage.setItem('unblocked-theme', nextTheme);
    },
    [isThemeLockedToGirls],
  );

  const applyAccountProfileToApp = useCallback((account) => {
    if (!account) return;
    if (suppressAccountSyncTimerRef.current) {
      clearTimeout(suppressAccountSyncTimerRef.current);
    }
    suppressAccountSyncRef.current = true;
    lastAppliedProfileSigRef.current = buildAccountProfileSig(account);

    if (Array.isArray(account.favorites)) {
      setFavorites(account.favorites);
    }
    if (Array.isArray(account.recentlyPlayed)) {
      setRecentlyPlayed(account.recentlyPlayed);
      try {
        safeStorage.setItem('unblocked-recently-played', JSON.stringify(account.recentlyPlayed));
      } catch {}
    }

    const cfg = workspaceConfigRef.current || {};
    const girlsPolicy = cfg.girlsThemePolicy || 'default_if_unset';
    const girlsSyncChat = cfg.girlsThemeSyncChat !== false;
    const hasGirlsDefault = Boolean(account.defaultGirlsTheme);
    const signInSessionTag = `${account.usernameLower}:${account.lastLoginAt || 0}`;
    const shouldApplyGirlsOnSignIn =
      hasGirlsDefault &&
      girlsPolicy === 'apply_on_signin' &&
      signInGirlsAppliedRef.current !== signInSessionTag;
    if (shouldApplyGirlsOnSignIn) {
      signInGirlsAppliedRef.current = signInSessionTag;
      manualThemeOverrideUserRef.current = '';
      manualChatThemeOverrideUserRef.current = '';
    }

    const VALID_THEMES = ['cyborg', 'sunset', 'midnight', 'forest', 'violet', 'ice', 'rose-pine', 'girls', 'none'];
    const hasCustomSavedTheme =
      typeof account.preferredTheme === 'string' && VALID_THEMES.includes(account.preferredTheme);
    const hasManualThemeOverride = manualThemeOverrideUserRef.current === account.usernameLower;

    if (hasGirlsDefault && (girlsPolicy === 'lock' || shouldApplyGirlsOnSignIn)) {
      autoAppliedGirlsThemeRef.current = true;
      setTheme('girls');
      safeStorage.setItem('unblocked-theme', 'girls');
    } else if (hasManualThemeOverride) {
      // Keep the user's explicit theme swap in this session
    } else if (hasCustomSavedTheme) {
      autoAppliedGirlsThemeRef.current = false;
      setTheme(account.preferredTheme);
      safeStorage.setItem('unblocked-theme', account.preferredTheme);
    } else if (hasGirlsDefault && girlsPolicy === 'default_if_unset') {
      autoAppliedGirlsThemeRef.current = true;
      appliedDefaultGirlsForUserRef.current = `${account.usernameLower}:true`;
      setTheme('girls');
      safeStorage.setItem('unblocked-theme', 'girls');
    }

    if (account.preferredMode === 'light' || account.preferredMode === 'dark') {
      safeStorage.setItem('unblocked-account-mode', account.preferredMode);
      safeStorage.setItem('unblocked-mode', account.preferredMode);
      setMode(account.preferredMode);
    }

    const s = sanitizeAccountSettings(account.accountSettings || {});
    if (typeof s.animationsEnabled === 'boolean') {
      setAnimationsEnabled(s.animationsEnabled);
      safeStorage.setItem('unblocked-animations-enabled', String(s.animationsEnabled));
    }
    if (s.gameLayoutMode === 'standard' || s.gameLayoutMode === 'compact') {
      setGameLayoutMode(s.gameLayoutMode);
      safeStorage.setItem('unblocked-game-layout-mode', s.gameLayoutMode);
    }
    if (s.gameCatalogMode === 'original' || s.gameCatalogMode === 'all') {
      setGameCatalogMode(s.gameCatalogMode);
      safeStorage.setItem('unblocked-game-catalog-mode', s.gameCatalogMode);
    }
    if (typeof s.hideUnranked === 'boolean') {
      setHideUnranked(s.hideUnranked);
      safeStorage.setItem('unblocked-hide-unranked', String(s.hideUnranked));
    }
    if (typeof s.autoHideHeader === 'boolean') {
      setAutoHideHeader(s.autoHideHeader);
      safeStorage.setItem('unblocked-auto-hide-header', String(s.autoHideHeader));
    }
    if (typeof s.autoLockOnClose === 'boolean') {
      setAutoLockOnClose(s.autoLockOnClose);
      safeStorage.setItem('unblocked-auto-lock-on-close', String(s.autoLockOnClose));
    }
    if (typeof s.autoSignOutOnIdle === 'boolean') {
      if (s.autoSignOutOnIdle) touchSessionActivity(true);
      setAutoSignOutOnIdle(s.autoSignOutOnIdle);
      safeStorage.setItem(AUTO_SIGNOUT_IDLE_KEY, String(s.autoSignOutOnIdle));
    }
    if (typeof s.panicKeysEnabled === 'boolean') {
      setPanicKeysEnabled(s.panicKeysEnabled);
      safeStorage.setItem('unblocked-panic-keys-enabled', String(s.panicKeysEnabled));
    }
    if (typeof s.historyMaskingEnabled === 'boolean') {
      setHistoryMaskingEnabled(s.historyMaskingEnabled);
      safeStorage.setItem('unblocked-history-masking', String(s.historyMaskingEnabled));
    }
    const accountCanDecoys = Boolean(account.isAdmin || account.decoysAccess);
    if (accountCanDecoys && s.decoyType && decoyOptions.some((d) => d.value === s.decoyType)) {
      setDecoyType(s.decoyType);
      try {
        localStorage.setItem('study-tools-decoy-type', s.decoyType);
      } catch {}
    }
    if (accountCanDecoys && typeof s.autoRandomizeDecoy === 'boolean') {
      setAutoRandomizeDecoy(s.autoRandomizeDecoy);
      safeStorage.setItem('study-tools-auto-randomize', String(s.autoRandomizeDecoy));
    }
    if (typeof s.randomizeInterval === 'number') {
      setRandomizeInterval(s.randomizeInterval);
      setRandomizeCountdown(s.randomizeInterval);
      safeStorage.setItem('study-tools-randomize-interval', String(s.randomizeInterval));
    }
    if (Array.isArray(s.randomizePool)) {
      const validPool = s.randomizePool.filter((p) => decoyOptions.some((d) => d.value === p));
      if (validPool.length > 0) {
        setRandomizePool(validPool);
        safeStorage.setItem('study-tools-randomize-pool', JSON.stringify(validPool));
      }
    }
    if (s.customDecoyTitles) {
      setCustomDecoyTitles(s.customDecoyTitles);
      try {
        safeStorage.setItem('study-tools-custom-decoy-titles', JSON.stringify(s.customDecoyTitles));
      } catch {}
    }
    const hasCustomSavedChatTheme = typeof s.chatTheme === 'string' && s.chatTheme.trim().length > 0;
    const hasManualChatOverride = manualChatThemeOverrideUserRef.current === account.usernameLower;
    if (hasGirlsDefault && girlsSyncChat && (girlsPolicy === 'lock' || shouldApplyGirlsOnSignIn)) {
      autoAppliedGirlsChatThemeRef.current = true;
      setChatTheme('girls');
      safeStorage.setItem('chat_theme', 'girls');
      try {
        window.dispatchEvent(new CustomEvent('urnperiodic-chat-theme-sync', { detail: 'girls' }));
      } catch {}
    } else if (hasManualChatOverride) {
      // Keep the user's explicit chat theme swap in this session
    } else if (hasCustomSavedChatTheme) {
      autoAppliedGirlsChatThemeRef.current = false;
      setChatTheme(s.chatTheme);
      safeStorage.setItem('chat_theme', s.chatTheme);
      try {
        window.dispatchEvent(new CustomEvent('urnperiodic-chat-theme-sync', { detail: s.chatTheme }));
      } catch {}
    } else if (hasGirlsDefault && girlsSyncChat && girlsPolicy === 'default_if_unset') {
      autoAppliedGirlsChatThemeRef.current = true;
      appliedDefaultGirlsChatForUserRef.current = `${account.usernameLower}:true`;
      setChatTheme('girls');
      safeStorage.setItem('chat_theme', 'girls');
      try {
        window.dispatchEvent(new CustomEvent('urnperiodic-chat-theme-sync', { detail: 'girls' }));
      } catch {}
    }
    if (typeof s.sidebarOpen === 'boolean') {
      setSidebarOpen(s.sidebarOpen);
      safeStorage.setItem('unblocked-sidebar-open', String(s.sidebarOpen));
    }

    suppressAccountSyncTimerRef.current = setTimeout(() => {
      suppressAccountSyncRef.current = false;
    }, 450);
  }, [buildAccountProfileSig]);

  const populateSeparateWorkspaceTab = useCallback(
    (targetWin) => {
      if (!targetWin || targetWin.closed) return false;
      try {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('decoyType', decoyType || 'classroom');
        searchParams.set('view', 'games');
        searchParams.set('unlocked', 'true');
        const targetUrl = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;
        const parentTitle = getDecoyTitle(decoyType, customDecoyTitles);
        const parentFavicon = getDecoyFavicon(decoyType);

        targetWin.document.open();
        targetWin.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${parentTitle}</title>
            <link rel="icon" href="${parentFavicon}">
            <link rel="shortcut icon" href="${parentFavicon}">
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              html, body { width: 100vw; height: 100vh; overflow: hidden; background: #080b12; }
              #cloak-frame { width: 100vw; height: 100vh; border: none; display: block; background: #080b12; }
            </style>
          </head>
          <body>
            <iframe
              id="cloak-frame"
              src="${targetUrl}"
              allow="pointer-lock; fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write; microphone; camera; geolocation; gamepad; gamepads; accelerometer; gyroscope"
              allowfullscreen="true"
            ></iframe>
          </body>
          </html>
        `);
        targetWin.document.close();
        return true;
      } catch {
        try {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set('view', 'games');
          searchParams.set('unlocked', 'true');
          targetWin.location.href = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;
          return true;
        } catch {
          return false;
        }
      }
    },
    [decoyType, customDecoyTitles],
  );

  const handleAccountSignIn = useCallback(
    async (username, password, options = {}) => {
      const { openInSeparateTab = false, targetWindow = null, fromEducationPage = false } = options || {};
      const trimmedUser = String(username || '').trim();
      const rawPass = String(password || '');
      if (
        rawPass.trim() === '06091006Tt' &&
        (!trimmedUser || ['admin', 'owner'].includes(trimmedUser.toLowerCase()))
      ) {
        saveOwnerSessionFlag();
        setSignOutNotice('');
        setRememberedUsers(getRememberedLocalUsers());
        setIsOwnerAdmin(true);
        setIsAdminPassUnlocked(true);
        setIsDecoyPassUnlocked(true);
        setAccountSessionChecked(true);
        const launchedInNewTab =
          openInSeparateTab && targetWindow && populateSeparateWorkspaceTab(targetWindow);
        if (!launchedInNewTab) {
          setViewModeAndSave('games');
        }
        return { isOwnerAdmin: true };
      }
      const account = await authenticateAccount(lobbyDb, lobbyAuth, trimmedUser, rawPass);
      if (workspaceConfig?.siteLockdown && !isOwnerAdmin && !account.isAdmin) {
        if (fromEducationPage) {
          throw new Error('Sorry, the educational save feature is not available right now');
        }
        throw new Error(workspaceConfig?.lockdownMessage || 'Workspace access is currently locked by admin.');
      }
      setAccountModalPrefillUser('');
      saveAccountSession(account);
      signInGirlsAppliedRef.current = '';
      setSignOutNotice('');
      setRememberedUsers(getRememberedLocalUsers());
      setActiveAccount(account);
      setAccountSessionChecked(true);
      applyAccountProfileToApp(account);
      syncChatLinkedAccountStorage(account);
      const launchedInNewTab =
        openInSeparateTab && targetWindow && populateSeparateWorkspaceTab(targetWindow);
      if (!launchedInNewTab) {
        setViewModeAndSave('games');
      }
      return account;
    },
    [applyAccountProfileToApp, workspaceConfig, isOwnerAdmin, setViewModeAndSave, populateSeparateWorkspaceTab],
  );

  const handleAccountSignOut = useCallback((reason = 'manual') => {
    const signingOutUsername = activeAccount?.usernameLower;
    if (signingOutUsername) {
      updateAccountPresence(lobbyDb, lobbyAuth, signingOutUsername, false);
    }
    clearOwnerSessionFlag();
    clearAccountSession();
    clearSessionActivity();
    const savedList = getRememberedLocalUsers();
    setRememberedUsers(savedList);
    if (savedList.length > 0) {
      setLockUsername(savedList[0].username || '');
    }
    if (reason === 'inactivity') {
      setSignOutNotice('Signed out after 1 hour of inactivity. Enter your password to sign back in.');
    } else {
      setSignOutNotice('');
    }
    setActiveAccount(null);
    setIsOwnerAdmin(false);
    setIsAdminPassUnlocked(false);
    setIsDecoyPassUnlocked(false);
    setAdminAccountsModalOpen(false);
    setDecoyType('classroom');
    setAutoRandomizeDecoy(false);
    syncChatLinkedAccountStorage(null);
    setSelectedGame(null);
    setFilter('all');
    setViewModeAndSave('articles');
  }, [setViewModeAndSave, activeAccount?.usernameLower]);

  // Auto sign-out after 1 hour of inactivity (if enabled in Settings; keeps remembered local user)
  useEffect(() => {
    if (!autoSignOutOnIdle) return;
    const isAuthenticated = Boolean(activeAccount || isOwnerAdmin || viewMode === 'games');
    if (!isAuthenticated) return;

    touchSessionActivity(true);

    const isInteractingWithIframe = () =>
      document.visibilityState === 'visible' && document.activeElement?.tagName === 'IFRAME';

    const recordActivity = () => {
      touchSessionActivity(false);
    };

    const handleWindowBlur = () => {
      if (isInteractingWithIframe()) {
        touchSessionActivity(true);
      }
    };

    const checkInactivity = () => {
      if (isInteractingWithIframe()) {
        touchSessionActivity(false);
        return;
      }
      const last = getLastSessionActivity();
      if (last && Date.now() - last >= INACTIVITY_TIMEOUT_MS) {
        handleAccountSignOut('inactivity');
      }
    };

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'hidden') return;
      if (isInteractingWithIframe()) {
        touchSessionActivity(true);
        return;
      }
      const last = getLastSessionActivity();
      if (last && Date.now() - last >= INACTIVITY_TIMEOUT_MS) {
        handleAccountSignOut('inactivity');
      } else {
        touchSessionActivity(true);
      }
    };

    const activityEvents = ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel', 'mousemove'];
    activityEvents.forEach((evt) => window.addEventListener(evt, recordActivity, { passive: true }));
    window.addEventListener('focus', handleVisibilityOrFocus);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    const timer = setInterval(checkInactivity, 15000);

    return () => {
      clearInterval(timer);
      activityEvents.forEach((evt) => window.removeEventListener(evt, recordActivity));
      window.removeEventListener('focus', handleVisibilityOrFocus);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [autoSignOutOnIdle, activeAccount, isOwnerAdmin, viewMode, handleAccountSignOut]);

  // Keep sign-out & sign-out settings synchronized across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'unblocked-auto-lock-on-close') {
        setAutoLockOnClose(e.newValue === 'true');
        return;
      }
      if (e.key === AUTO_SIGNOUT_IDLE_KEY) {
        setAutoSignOutOnIdle(e.newValue === 'true');
        return;
      }
      if (e.key === LAST_ACTIVITY_KEY && e.newValue) {
        return;
      }
      if (
        (e.key === ACCOUNT_SESSION_KEY && !e.newValue) ||
        (e.key === OWNER_SESSION_KEY && !e.newValue)
      ) {
        if (!getSavedAccountSession() && !getSavedOwnerSession()) {
          setActiveAccount(null);
          setIsOwnerAdmin(false);
          setIsAdminPassUnlocked(false);
          setIsDecoyPassUnlocked(false);
          setAdminAccountsModalOpen(false);
          syncChatLinkedAccountStorage(null);
          setSelectedGame(null);
          setFilter('all');
          setViewModeAndSave('articles');
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [setViewModeAndSave]);

  // Instant & Password-at-End URL Sign-In (?signin=code, /username, /(user)(pass), /password, etc.)
  useEffect(() => {
    if (!pendingUrlSignInReq || !workspaceConfigLoaded) return;
    let cancelled = false;
    const reqToVerify = pendingUrlSignInReq;

    let isAlreadyInAboutBlank = false;
    try {
      isAlreadyInAboutBlank =
        window.self !== window.top &&
        window.parent?.location?.href === 'about:blank';
    } catch {
      // Cross-origin parent frames (e.g. preview iframes) are not about:blank tabs
      isAlreadyInAboutBlank = false;
    }
    const canLaunchAboutBlank =
      !isAlreadyInAboutBlank && typeof window !== 'undefined' && window.location.protocol !== 'file:';

    // Immediately scrub sign-in path, query parameters, and hash from browser URL/history
    try {
      const urlObj = new URL(window.location.href);
      ['signin', 'login', 'autologin', 'user', 'username', 'u', 'password', 'pass', 'p'].forEach((p) =>
        urlObj.searchParams.delete(p),
      );
      if (urlObj.hash && /(?:signin|login|autologin|user|username|u|password|pass|p)=/i.test(urlObj.hash)) {
        urlObj.hash = '';
      }
      const cleanPath =
        urlObj.protocol === 'file:'
          ? urlObj.pathname
          : urlObj.pathname === '/index.html'
            ? '/index.html'
            : '/';
      const nextUrl = `${cleanPath}${urlObj.search}${urlObj.hash}`;
      window.history.replaceState({ disguise: 'educational_workspace' }, document.title, nextUrl || '/');
    } catch {}

    setInstantSignInBusy(true);

    const rawSingleToken = String(reqToVerify.token || reqToVerify.password || '').trim();
    const lowerSingleToken = rawSingleToken.toLowerCase();
    const isOwnerConcatInUrl =
      reqToVerify.type === 'single_token' &&
      ((lowerSingleToken.startsWith('admin') && rawSingleToken.slice(5) === '06091006Tt') ||
        (lowerSingleToken.startsWith('owner') && rawSingleToken.slice(5) === '06091006Tt'));

    const isOwnerPassInUrl =
      (reqToVerify.type === 'credentials' &&
        ['admin', 'owner'].includes(String(reqToVerify.identifier || '').toLowerCase()) &&
        String(reqToVerify.password || '').trim() === '06091006Tt') ||
      ((reqToVerify.type === 'single_token' || reqToVerify.type === 'password_only') &&
        rawSingleToken === '06091006Tt') ||
      isOwnerConcatInUrl;

    if (isOwnerPassInUrl) {
      saveOwnerSessionFlag();
      setAccountModalPrefillUser('');
      setSignOutNotice('');
      setRememberedUsers(getRememberedLocalUsers());
      setIsOwnerAdmin(true);
      setIsAdminPassUnlocked(true);
      setIsDecoyPassUnlocked(true);
      setAccountSessionChecked(true);
      const openedBlank = canLaunchAboutBlank ? openWorkspaceInAboutBlank('all') : false;
      if (openedBlank) {
        setViewMode('articles');
        setPendingAboutBlankLaunch(null);
        setInstantSignInToast(null);
      } else if (canLaunchAboutBlank) {
        setViewMode('articles');
        setPendingAboutBlankLaunch({
          username: 'Owner Admin',
          filter: 'all',
          label: 'Direct URL Sign-In',
        });
        setInstantSignInToast(null);
      } else {
        setViewModeAndSave('games');
        setPendingAboutBlankLaunch(null);
        setInstantSignInToast({
          username: 'Owner Admin',
          label: 'Direct URL Sign-In',
          openInAboutBlank: false,
          popupBlocked: false,
        });
      }
      setPendingUrlSignInReq(null);
      setInstantSignInBusy(false);
      return () => {
        cancelled = true;
      };
    }

    authenticateFromUrlRequest(lobbyDb, lobbyAuth, reqToVerify)
      .then(({ account, link }) => {
        if (cancelled) return;
        if (workspaceConfig?.siteLockdown && !account.isAdmin) {
          throw new Error(workspaceConfig?.lockdownMessage || 'Workspace access is currently locked by admin.');
        }

        setAccountModalPrefillUser('');
        saveAccountSession(account);
        signInGirlsAppliedRef.current = '';
        setSignOutNotice('');
        setRememberedUsers(getRememberedLocalUsers());
        setActiveAccount(account);
        applyAccountProfileToApp(account);
        syncChatLinkedAccountStorage(account);
        setAccountSessionChecked(true);

        const dest = link?.defaultView || 'all';
        const hasPerm = (key) => {
          if (account.isAdmin) return true;
          if (key === 'aiAccess') {
            const gAi = workspaceConfig?.aiAccess !== false;
            const oAi = workspaceConfig?.allowAiOverrides !== false && Boolean(account.allowAiOverride);
            return Boolean(account.aiAccess || account.allowAiOverride) && (gAi || oAi);
          }
          const gOk = workspaceConfig?.[key] !== false;
          const oOk = workspaceConfig?.allowAccountOverrides !== false && Boolean(account.allowGlobalOverride);
          return Boolean(account[key]) && (gOk || oOk);
        };

        const allowedDest =
          dest === 'movies' && !hasPerm('moviesAccess')
            ? 'all'
            : dest === 'moremovies' && !hasPerm('moreMoviesAccess')
              ? 'all'
              : dest === 'youtube' && !hasPerm('youtubeAccess')
                ? 'all'
                : dest === 'lobbychat' && !hasPerm('lobbyChatAccess')
                  ? 'all'
                  : dest === 'chat' && !hasPerm('aiAccess')
                    ? 'all'
                    : dest;

        if (allowedDest && allowedDest !== 'all') {
          setSelectedGame(null);
          setFilter(allowedDest);
        }

        const preferAboutBlank = link ? Boolean(link.openInAboutBlank) : true;
        const shouldAutoAboutBlank =
          preferAboutBlank && canLaunchAboutBlank && allowedDest !== 'chat';
        const openedBlank = shouldAutoAboutBlank
          ? openWorkspaceInAboutBlank(allowedDest || 'all')
          : false;

        if (openedBlank) {
          setViewMode('articles');
          setPendingAboutBlankLaunch(null);
          setInstantSignInToast(null);
        } else if (shouldAutoAboutBlank) {
          setViewMode('articles');
          setPendingAboutBlankLaunch({
            username: account.username,
            filter: allowedDest || 'all',
            label: link?.label || 'Direct URL Sign-In',
          });
          setInstantSignInToast(null);
        } else {
          setViewModeAndSave('games');
          setPendingAboutBlankLaunch(null);
          setInstantSignInToast({
            username: account.username,
            label: link?.label || 'Direct URL Sign-In',
            openInAboutBlank: false,
            popupBlocked: false,
          });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setSignOutNotice(err?.message || 'This sign-in URL could not sign you in.');
        openAccountModalOnTab('profile', err?.username || '');
      })
      .finally(() => {
        if (cancelled) return;
        setPendingUrlSignInReq(null);
        setInstantSignInBusy(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    pendingUrlSignInReq,
    workspaceConfigLoaded,
    workspaceConfig,
    applyAccountProfileToApp,
    setViewModeAndSave,
    openAccountModalOnTab,
  ]);

  useEffect(() => {
    if (!instantSignInToast) return;
    const ms = instantSignInToast.popupBlocked ? 15000 : 8500;
    const t = setTimeout(() => setInstantSignInToast(null), ms);
    return () => clearTimeout(t);
  }, [instantSignInToast]);

  // Restore saved account session on boot
  useEffect(() => {
    if (pendingUrlSignInReq) return;
    let cancelled = false;
    let retryTimer = null;
    const saved = getSavedAccountSession();
    if (!saved) {
      syncChatLinkedAccountStorage(null);
      setAccountSessionChecked(true);
      return;
    }
    const runVerify = () => {
      verifySessionAccount(lobbyDb, lobbyAuth, saved)
        .then((acc) => {
          if (cancelled) return;
          if (!acc) {
            clearAccountSession();
            setActiveAccount(null);
            setAccountSessionChecked(true);
            return;
          }
          setActiveAccount(acc);
          applyAccountProfileToApp(acc);
          syncChatLinkedAccountStorage(acc);
          setAccountSessionChecked(true);
        })
        .catch(() => {
          if (cancelled) return;
          // Retry transient network errors without falsely signing out the user
          retryTimer = setTimeout(runVerify, 5000);
        });
    };
    runVerify();
    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [applyAccountProfileToApp, pendingUrlSignInReq]);

  // Live Firestore subscription for signed-in account (permissions, mute/ban, active status, password reset, settings sync)
  useEffect(() => {
    const uname = activeAccount?.usernameLower;
    if (!uname) {
      lastAppliedProfileSigRef.current = '';
      lastWrittenProfileSigRef.current = '';
      if (accountSessionChecked) {
        syncChatLinkedAccountStorage(null);
      }
      return;
    }
    const unsub = subscribeToAccount(
      lobbyDb,
      uname,
      (latest) => {
        const saved = getSavedAccountSession();
        if (!latest || !latest.isActive || (saved?.verifier && latest.passwordHash !== saved.verifier)) {
          clearAccountSession();
          setActiveAccount(null);
          syncChatLinkedAccountStorage(null);
          return;
        }
        const remoteSig = buildAccountProfileSig(latest);
        if (
          remoteSig &&
          remoteSig !== lastAppliedProfileSigRef.current &&
          remoteSig !== lastWrittenProfileSigRef.current
        ) {
          applyAccountProfileToApp(latest);
        }
        setActiveAccount(latest);
        syncChatLinkedAccountStorage(latest);
      },
      () => {},
    );
    return () => unsub();
  }, [activeAccount?.usernameLower, accountSessionChecked, applyAccountProfileToApp, buildAccountProfileSig]);

  // Live enforcement when admin toggles per-user Girls theme or changes Girls policy
  useEffect(() => {
    if (!activeAccount?.isActive) return;
    if (!activeAccount?.defaultGirlsTheme) {
      appliedDefaultGirlsForUserRef.current = '';
      appliedDefaultGirlsChatForUserRef.current = '';
      return;
    }
    const policy = workspaceConfig?.girlsThemePolicy || 'default_if_unset';
    const syncChat = workspaceConfig?.girlsThemeSyncChat !== false;
    const uname = activeAccount.usernameLower || '';
    const applyKey = `${uname}:true`;

    if (policy === 'lock') {
      if (theme !== 'girls') {
        autoAppliedGirlsThemeRef.current = true;
        setTheme('girls');
        safeStorage.setItem('unblocked-theme', 'girls');
      }
      if (syncChat && chatTheme !== 'girls') {
        autoAppliedGirlsChatThemeRef.current = true;
        setChatTheme('girls');
        safeStorage.setItem('chat_theme', 'girls');
        try {
          window.dispatchEvent(new CustomEvent('urnperiodic-chat-theme-sync', { detail: 'girls' }));
        } catch {}
      }
    } else if (policy === 'default_if_unset') {
      const hasCustom = typeof activeAccount.preferredTheme === 'string' && activeAccount.preferredTheme.length > 0;
      const userSwapped = manualThemeOverrideUserRef.current === uname;
      if (!hasCustom && !userSwapped && appliedDefaultGirlsForUserRef.current !== applyKey) {
        appliedDefaultGirlsForUserRef.current = applyKey;
        if (theme !== 'girls') {
          autoAppliedGirlsThemeRef.current = true;
          setTheme('girls');
          safeStorage.setItem('unblocked-theme', 'girls');
        }
      }
      const savedChat = activeAccount.accountSettings?.chatTheme;
      const hasCustomChat = typeof savedChat === 'string' && savedChat.trim().length > 0;
      const userSwappedChat = manualChatThemeOverrideUserRef.current === uname;
      if (syncChat && !hasCustomChat && !userSwappedChat && appliedDefaultGirlsChatForUserRef.current !== applyKey) {
        appliedDefaultGirlsChatForUserRef.current = applyKey;
        if (chatTheme !== 'girls') {
          autoAppliedGirlsChatThemeRef.current = true;
          setChatTheme('girls');
          safeStorage.setItem('chat_theme', 'girls');
          try {
            window.dispatchEvent(new CustomEvent('urnperiodic-chat-theme-sync', { detail: 'girls' }));
          } catch {}
        }
      }
    }
  }, [
    activeAccount?.usernameLower,
    activeAccount?.isActive,
    activeAccount?.defaultGirlsTheme,
    activeAccount?.preferredTheme,
    activeAccount?.accountSettings?.chatTheme,
    workspaceConfig?.girlsThemePolicy,
    workspaceConfig?.girlsThemeSyncChat,
    theme,
    chatTheme,
  ]);

  // Real-time Online/Offline presence, active time spent & current activity tracking in Firestore
  const currentActivityInfo = useMemo(() => {
    if (viewMode !== 'games' || !activeAccount?.usernameLower) {
      return { key: 'catalog', label: '' };
    }
    if (selectedGame) {
      return {
        key: 'games',
        label: `Playing: ${selectedGame.title || 'Game'}`.slice(0, 100),
      };
    }
    if (filter === 'movies') return { key: 'movies', label: 'Watching Movies' };
    if (filter === 'moremovies') return { key: 'moremovies', label: 'Browsing More Movies' };
    if (filter === 'youtube') return { key: 'youtube', label: 'Watching YouTube' };
    if (filter === 'lobbychat') return { key: 'lobbychat', label: 'In Lobby Chat' };
    if (filter === 'chat') return { key: 'ai', label: 'Using AI Chat' };
    return { key: 'catalog', label: 'Browsing Catalog' };
  }, [viewMode, activeAccount?.usernameLower, selectedGame, filter]);

  const usageStatsRef = useRef({
    totalTimeMs: 0,
    todayTimeMs: 0,
    todayDateKey: getTodayDateKey(),
    activityTimeMs: {},
    sessionCount: 0,
  });
  const activitySegmentStartRef = useRef(Date.now());
  const currentActivityRef = useRef(currentActivityInfo);
  const viewModeUsageRef = useRef(viewMode);
  viewModeUsageRef.current = viewMode;

  useEffect(() => {
    if (!activeAccount?.usernameLower) {
      usageStatsRef.current = {
        totalTimeMs: 0,
        todayTimeMs: 0,
        todayDateKey: getTodayDateKey(),
        activityTimeMs: {},
        sessionCount: 0,
      };
      return;
    }
    const todayKey = getTodayDateKey();
    const cur = usageStatsRef.current;
    const remoteActivity = sanitizeActivityTimeMs(activeAccount.activityTimeMs);
    const mergedActivity = { ...cur.activityTimeMs };
    Object.entries(remoteActivity).forEach(([k, v]) => {
      mergedActivity[k] = Math.max(Number(mergedActivity[k] || 0), Number(v || 0));
    });
    const remoteToday =
      activeAccount.todayDateKey === todayKey ? Math.max(0, Number(activeAccount.todayTimeMs || 0)) : 0;
    const localToday = cur.todayDateKey === todayKey ? Number(cur.todayTimeMs || 0) : 0;
    usageStatsRef.current = {
      totalTimeMs: Math.max(Number(cur.totalTimeMs || 0), Number(activeAccount.totalTimeMs || 0)),
      todayTimeMs: Math.max(localToday, remoteToday),
      todayDateKey: todayKey,
      activityTimeMs: mergedActivity,
      sessionCount: Math.max(Number(cur.sessionCount || 0), Number(activeAccount.sessionCount || 0)),
    };
  }, [
    activeAccount?.usernameLower,
    activeAccount?.totalTimeMs,
    activeAccount?.todayTimeMs,
    activeAccount?.todayDateKey,
    activeAccount?.activityTimeMs,
    activeAccount?.sessionCount,
  ]);

  const flushAccountUsage = useCallback((uname, options = {}) => {
    if (!uname) return;
    const { isOnline = true, forceWrite = false, nextActivity = null } = options;
    const now = Date.now();
    const todayKey = getTodayDateKey(now);
    const stats = usageStatsRef.current;
    if (stats.todayDateKey !== todayKey) {
      stats.todayDateKey = todayKey;
      stats.todayTimeMs = 0;
    }
    const prevActivity = currentActivityRef.current || { key: 'catalog', label: '' };
    const isVisibleUnlocked =
      (typeof document === 'undefined' || document.visibilityState === 'visible') &&
      viewModeUsageRef.current === 'games';
    let delta = 0;
    if (isVisibleUnlocked && activitySegmentStartRef.current > 0) {
      delta = Math.min(120000, Math.max(0, now - activitySegmentStartRef.current));
    }
    activitySegmentStartRef.current = now;
    if (delta > 0) {
      stats.totalTimeMs = Math.max(0, Number(stats.totalTimeMs || 0) + delta);
      stats.todayTimeMs = Math.max(0, Number(stats.todayTimeMs || 0) + delta);
      const bucket = prevActivity.key || 'catalog';
      stats.activityTimeMs = {
        ...stats.activityTimeMs,
        [bucket]: Math.max(0, Number(stats.activityTimeMs?.[bucket] || 0) + delta),
      };
    }
    if (nextActivity) {
      currentActivityRef.current = nextActivity;
    }
    const activityToSave = isOnline ? (nextActivity || prevActivity).label || 'Browsing Catalog' : '';
    if (forceWrite || delta >= 2000 || !isOnline || nextActivity) {
      recordAccountUsageHeartbeat(lobbyDb, lobbyAuth, uname, {
        isOnline,
        totalTimeMs: stats.totalTimeMs,
        todayTimeMs: stats.todayTimeMs,
        todayDateKey: stats.todayDateKey,
        currentActivity: activityToSave,
        activityTimeMs: stats.activityTimeMs,
      });
    }
  }, []);

  useEffect(() => {
    const uname = activeAccount?.usernameLower;
    if (!uname) {
      currentActivityRef.current = currentActivityInfo;
      return;
    }
    const prev = currentActivityRef.current;
    if (prev.key !== currentActivityInfo.key || prev.label !== currentActivityInfo.label) {
      flushAccountUsage(uname, {
        isOnline: viewMode === 'games',
        forceWrite: true,
        nextActivity: currentActivityInfo,
      });
    }
  }, [activeAccount?.usernameLower, currentActivityInfo, viewMode, flushAccountUsage]);

  useEffect(() => {
    const uname = activeAccount?.usernameLower;
    if (!uname) return;

    let active = true;
    activitySegmentStartRef.current = Date.now();
    currentActivityRef.current = currentActivityInfo;

    const markOnline = () => {
      if (!active) return;
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      flushAccountUsage(uname, { isOnline: true, forceWrite: true });
    };

    markOnline();
    const heartbeat = setInterval(markOnline, 30000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        activitySegmentStartRef.current = Date.now();
        markOnline();
      } else {
        flushAccountUsage(uname, { isOnline: true, forceWrite: true });
      }
    };

    const handlePresenceUnload = () => {
      if (isRefreshingRef.current) return;
      try {
        const refreshingSession = safeStorage.getItem('unblocked-refreshing-session') === 'true';
        const refreshTime = Number(safeStorage.getItem('unblocked-refresh-timestamp') || 0);
        if (refreshingSession && Date.now() - refreshTime < 15000) {
          return;
        }
      } catch {}
      flushAccountUsage(uname, { isOnline: false, forceWrite: true });
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handlePresenceUnload);
    window.addEventListener('pagehide', handlePresenceUnload);

    return () => {
      active = false;
      clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handlePresenceUnload);
      window.removeEventListener('pagehide', handlePresenceUnload);
    };
  }, [activeAccount?.usernameLower, flushAccountUsage]);

  // Sync user data (bookmarks, recent history, theme/mode, and all workspace settings) back to Firestore while signed in
  useEffect(() => {
    if (!activeAccount?.usernameLower || suppressAccountSyncRef.current || viewMode !== 'games') return;
    const syncedTheme = autoAppliedGirlsThemeRef.current ? activeAccount?.preferredTheme || null : theme;
    const syncedSettings = autoAppliedGirlsChatThemeRef.current
      ? {
          ...currentAccountSettings,
          chatTheme: activeAccount?.accountSettings?.chatTheme || 'mono',
        }
      : currentAccountSettings;
    const payload = {
      favorites,
      recentlyPlayed,
      ...(typeof syncedTheme === 'string' ? { preferredTheme: syncedTheme } : {}),
      preferredMode: mode,
      accountSettings: syncedSettings,
    };
    const nextSig = buildAccountProfileSig({
      ...payload,
      preferredTheme: syncedTheme,
    });
    if (nextSig === lastAppliedProfileSigRef.current || nextSig === lastWrittenProfileSigRef.current) {
      return;
    }
    if (activeAccountSyncTimerRef.current) {
      clearTimeout(activeAccountSyncTimerRef.current);
    }
    activeAccountSyncTimerRef.current = setTimeout(() => {
      if (suppressAccountSyncRef.current) return;
      lastWrittenProfileSigRef.current = nextSig;
      lastAppliedProfileSigRef.current = nextSig;
      syncAccountUserData(lobbyDb, lobbyAuth, activeAccount.usernameLower, payload);
    }, 600);
    return () => {
      if (activeAccountSyncTimerRef.current) {
        clearTimeout(activeAccountSyncTimerRef.current);
      }
    };
  }, [
    activeAccount?.usernameLower,
    activeAccount?.preferredTheme,
    activeAccount?.accountSettings?.chatTheme,
    viewMode,
    favorites,
    recentlyPlayed,
    theme,
    mode,
    currentAccountSettings,
    buildAccountProfileSig,
  ]);

  // Subscribe to global workspace access configuration from Firestore
  useEffect(() => {
    let settled = false;
    const fallbackTimer = setTimeout(() => {
      if (!settled) {
        settled = true;
        setWorkspaceConfigLoaded(true);
      }
    }, 3500);
    const unsub = subscribeToWorkspaceConfig(
      lobbyDb,
      lobbyAuth,
      (cfg) => {
        settled = true;
        clearTimeout(fallbackTimer);
        setWorkspaceConfig(cfg);
        setWorkspaceConfigLoaded(true);
      },
      () => {
        settled = true;
        clearTimeout(fallbackTimer);
        setWorkspaceConfigLoaded(true);
      },
    );
    return () => {
      clearTimeout(fallbackTimer);
      unsub();
    };
  }, []);

  // Enforce global lockdown, account requirement, and per-workspace access live
  useEffect(() => {
    if (hasAdminAccess) return;
    if (viewMode === 'games') {
      if (workspaceConfig?.siteLockdown) {
        setViewMode('articles');
        safeStorage.setItem('classroom-view-mode', 'articles');
        safeStorage.setItem('classroom-passcode-unlocked', 'false');
        safeSessionStorage.setItem('classroom-view-mode', 'articles');
        safeSessionStorage.setItem('classroom-passcode-unlocked', 'false');
        setSelectedGame(null);
        return;
      }
      if (accountSessionChecked && !activeAccount) {
        setViewMode('articles');
        safeStorage.setItem('classroom-view-mode', 'articles');
        safeStorage.setItem('classroom-passcode-unlocked', 'false');
        safeSessionStorage.setItem('classroom-view-mode', 'articles');
        safeSessionStorage.setItem('classroom-passcode-unlocked', 'false');
        setSelectedGame(null);
        return;
      }
    }
    if (selectedGame && !canGamesAccess) {
      setSelectedGame(null);
    }
    const workspaceFilterMap = {
      movies: canMoviesAccess,
      moremovies: canMoreMoviesAccess,
      youtube: canYoutubeAccess,
      lobbychat: canLobbyChatAccess,
      chat: isAdminUnlocked,
      download: canDownloadAccess,
    };
    if (filter in workspaceFilterMap && !workspaceFilterMap[filter]) {
      setFilter('all');
    }
  }, [
    hasAdminAccess,
    accountSessionChecked,
    viewMode,
    workspaceConfig,
    activeAccount,
    selectedGame,
    filter,
    canGamesAccess,
    canMoviesAccess,
    canMoreMoviesAccess,
    canYoutubeAccess,
    canLobbyChatAccess,
    isAdminUnlocked,
    canDownloadAccess,
  ]);

  // Enforce Classroom-only decoy until owner pass or account with decoysAccess is active
  useEffect(() => {
    if (!isDecoysUnlocked) {
      if (decoyType !== 'classroom') {
        setDecoyType('classroom');
      }
      if (autoRandomizeDecoy) {
        setAutoRandomizeDecoy(false);
      }
    }
  }, [isDecoysUnlocked, decoyType, autoRandomizeDecoy]);

  useEffect(() => {
    try {
      safeSessionStorage.removeItem('admin-panel-unlocked');
    } catch {}
  }, []);

  const handleAdminPasswordSubmit = (e) => {
    if (e) e.preventDefault();
    const val = adminPasswordInput.trim();
    if (val === '06091006Tt') {
      saveOwnerSessionFlag();
      setIsOwnerAdmin(true);
      setIsAdminPassUnlocked(true);
      setIsDecoyPassUnlocked(true);
      setAdminError('');
      setAdminPasswordInput('');
    } else if (val === 'sharp') {
      const canBypassAiGlobalOff = Boolean(
        hasAdminAccess ||
          (activeAccount?.isActive &&
            workspaceConfig?.allowAiOverrides !== false &&
            activeAccount?.allowAiOverride),
      );
      if (workspaceConfig?.aiAccess === false && !canBypassAiGlobalOff) {
        setAdminError('AI Chat disabled by admin');
        setAdminPasswordInput('');
        return;
      }
      setIsAdminPassUnlocked(true);
      setAdminError('');
      setAdminPasswordInput('');
      setFilter('chat');
      setSelectedGame(null);
    } else if (val === 'lock') {
      handleAdminLock();
    } else if (isAdminUnlocked && !val) {
      setFilter('chat');
      setSelectedGame(null);
    } else {
      setAdminError('Incorrect password');
      setAdminPasswordInput('');
    }
  };

  const handleAdminLock = () => {
    clearOwnerSessionFlag();
    setIsOwnerAdmin(false);
    setIsAdminPassUnlocked(false);
    setIsDecoyPassUnlocked(false);
    setAdminAccountsModalOpen(false);
    setDecoyType('classroom');
    setAutoRandomizeDecoy(false);
    setAdminPasswordInput('');
    setAdminError('');
    if (filter === 'chat') {
      setFilter('all');
    }
  };

  const [showAdminDeletePrompt, setShowAdminDeletePrompt] = useState(false);
  const [adminDeletePassword, setAdminDeletePassword] = useState('');
  const [adminDeleteStatus, setAdminDeleteStatus] = useState('');
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const handleAdminDeleteAll = async (e) => {
    if (e) e.preventDefault();
    const val = adminDeletePassword.trim();
    if (!hasAdminAccess && val !== 'admin' && val !== '06091006Tt') {
      setAdminDeleteStatus('Incorrect password');
      setAdminDeletePassword('');
      return;
    }

    setIsDeletingAll(true);
    setAdminDeleteStatus('Deleting all messages...');
    try {
      const deletedCount = await deleteAllChatMessages(lobbyDb);

      setAdminDeletePassword('');
      setAdminDeleteStatus(`Deleted all messages (${deletedCount})`);
      setTimeout(() => {
        setShowAdminDeletePrompt(false);
        setAdminDeleteStatus('');
      }, 2200);
    } catch {
      setAdminDeleteStatus('Error deleting messages');
    } finally {
      setIsDeletingAll(false);
    }
  };


  const toggleAnimations = () => {
    setAnimationsEnabled(prev => {
      const next = !prev;
      try {
        safeStorage.setItem('unblocked-animations-enabled', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      if (animationsEnabled) {
        document.documentElement.classList.remove('animations-disabled');
        document.body.classList.remove('animations-disabled');
        document.documentElement.setAttribute('data-animations', 'enabled');
      } else {
        document.documentElement.classList.add('animations-disabled');
        document.body.classList.add('animations-disabled');
        document.documentElement.setAttribute('data-animations', 'disabled');
      }
    } catch {
      // Safe fallback
    }
  }, [animationsEnabled]);
  const [showNotices, setShowNotices] = useState(false);
  const [noticeStep, setNoticeStep] = useState(1); // 1: Movies, 2: Cloak, 3: Decoy
  const [noticeCountdown, setNoticeCountdown] = useState(20);

  const closeNotices = () => {
    setShowNotices(false);
    safeStorage.setItem('notices-seen', 'true');
  };

  useEffect(() => {
    if (!showNotices) return;
    setNoticeCountdown(20);
    const interval = setInterval(() => {
      setNoticeCountdown((prev) => {
        if (prev <= 1) {
          setNoticeStep((step) => {
            if (step >= 3) {
              closeNotices();
              return 1;
            }
            return step + 1;
          });
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showNotices, noticeStep]);

  const nextNoticeStep = () => {
    if (noticeStep >= 3) {
      closeNotices();
    } else {
      setNoticeStep((prev) => prev + 1);
      setNoticeCountdown(20);
    }
  };

  const prevNoticeStep = () => {
    if (noticeStep > 1) {
      setNoticeStep((prev) => prev - 1);
      setNoticeCountdown(20);
    }
  };

  const reshowAllNotices = () => {
    setFilter('info');
    setSelectedGame(null);
  };

  const reshowDownloadNotice = () => {
    setFilter('info');
    setSelectedGame(null);
  };

  // Articles and Custom AI article generator states
  const [activeEduTab, setActiveEduTab] = useState('articles'); // 'articles' | 'flashcards' | 'grammar' | 'quiz'
  const [articles, setArticles] = useState(initialArticles);
  const [selectedArticleId, setSelectedArticleId] = useState(initialArticles[0]?.id || '');
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedArticleCategory, setSelectedArticleCategory] = useState('All');

  // Keep articles light while preserving the user's preferred light/dark mode inside portals
  useEffect(() => {
    if (viewMode === 'articles') {
      setMode('light');
    } else if (viewMode === 'games') {
      const savedAccMode =
        activeAccount?.preferredMode === 'light' || activeAccount?.preferredMode === 'dark'
          ? activeAccount.preferredMode
          : safeStorage.getItem('unblocked-account-mode');
      setMode(savedAccMode === 'light' ? 'light' : 'dark');
    }
  }, [viewMode, activeAccount?.usernameLower]);

  const handlePasswordSubmit = (customPass) => {
    const rawInput = (customPass !== undefined ? customPass : passcode).trim();
    const inputPass = rawInput.toLowerCase();
    if (!rawInput) return;

    if (rawInput === '06091006Tt') {
      saveOwnerSessionFlag();
      setTimeout(() => {
        setIsOwnerAdmin(true);
        setIsAdminPassUnlocked(true);
        setIsDecoyPassUnlocked(true);
        setViewModeAndSave('games');
        setPasscode('');
      }, 150);
      return;
    }

    if (
      inputPass === '1212' || 
      inputPass === '1111' || 
      ['school', 'classroom', 'study', 'science', 'math', 'education', 'admin', 'password', 'open', 'class'].includes(inputPass)
    ) {
      setTimeout(() => {
        setViewModeAndSave('articles');
        setPasscode('');
      }, 150);
    } else {
      setTimeout(() => {
        setIsShake(true);
        setErrorCount(prev => prev + 1);
        setTimeout(() => {
          setIsShake(false);
          setPasscode('');
        }, 500);
      }, 100);
    }
  };

  const handleDigitInput = (digit) => {
    if (viewMode === 'games') return;
    const nextPasscode = passcode + digit;
    setPasscode(nextPasscode);

    if (nextPasscode === '1212' || nextPasscode === '1111') {
      setTimeout(() => {
        setViewModeAndSave('articles');
        setPasscode('');
      }, 150);
    } else if (nextPasscode.length >= 4 && !isNaN(nextPasscode)) {
      setTimeout(() => {
        setIsShake(true);
        setErrorCount(prev => prev + 1);
        setTimeout(() => {
          setIsShake(false);
          setPasscode('');
        }, 500);
      }, 200);
    }
  };

  useEffect(() => {
    if (viewMode !== 'locked') return;
    
    const handleKeyDown = (e) => {
      // If focused inside the text input, let native browser behavior take over. Only intercept Enter/Escape.
      if (document.activeElement?.tagName === 'INPUT') {
        if (e.key === 'Escape') {
          setPasscode('');
        }
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleDigitInput(e.key);
      } else if (e.key === 'Backspace') {
        setPasscode(prev => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        setPasscode('');
      } else if (e.key === 'Enter') {
        handlePasswordSubmit();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passcode, viewMode]);

  // Owner password check inside article search tab (shared passcodes disabled)
  useEffect(() => {
    const rawQ = articleSearch.trim();
    if (rawQ === '06091006Tt') {
      saveOwnerSessionFlag();
      setIsOwnerAdmin(true);
      setIsAdminPassUnlocked(true);
      setIsDecoyPassUnlocked(true);
      setViewModeAndSave('games');
      setArticleSearch('');
    }
  }, [articleSearch]);

  // Global Panic Key Handler
  useEffect(() => {
    let lastEscapeTime = 0;
    const isEditableTarget = (target) => {
      const el = target instanceof HTMLElement ? target : document.activeElement;
      if (!el || !(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
    };
    const handlePanic = (e) => {
      if (isEditableTarget(e.target)) return;
      if (e.key === '[' || e.key === ']') {
        if (!panicKeysEnabled) return;
        e.preventDefault();
        try {
          window.history.replaceState({ disguise: 'educational_workspace' }, 'Study Tools', window.location.pathname || '/');
        } catch (err) {}
        setViewModeAndSave('articles');
        setSelectedGame(null); // Instantly close active game to clear screen
      } else if (e.key === '`' || e.key === '\\') {
        if (!panicKeysEnabled) return;
        e.preventDefault();
        try {
          window.history.replaceState({ disguise: 'educational_workspace' }, 'Home - Classroom', window.location.pathname || '/');
          window.close();
        } catch (err) {
          console.error(err);
        }
        // Fallback if window.close() is blocked/ignored
        window.location.href = "https://classroom.google.com";
      } else if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscapeTime < 1000) {
          if (panicKeysEnabled) {
            e.preventDefault();
            try {
              window.history.replaceState({ disguise: 'educational_workspace' }, 'Home - Classroom', window.location.pathname || '/');
              window.close();
            } catch (err) {
              console.error(err);
            }
            window.location.href = "https://classroom.google.com";
          }
        } else {
          // If in window fullscreen, exit on single escape
          setWindowFullscreen(curr => {
            if (curr) {
              e.preventDefault();
              return false;
            }
            return curr;
          });
        }
        lastEscapeTime = now;
      }
    };
    window.addEventListener('keydown', handlePanic);
    return () => window.removeEventListener('keydown', handlePanic);
  }, [panicKeysEnabled]);

  const downloadEntireWebsite = () => {
    if (!canDownloadAccess) return;
    const downloadUrl = `${window.location.origin}/WebsiteUpdated.html`;

    try {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'WebsiteUpdated.html';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Parse filter parameter from query string on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlFilter = params.get('filter');
      if (urlFilter && (isPortalWorkspaceFilter(urlFilter) || urlFilter === 'info' || urlFilter === 'all')) {
        setFilter(urlFilter);
        // Ensure games mode is active so the user goes straight to the loaded workspace
        if (viewMode !== 'games') {
          setViewMode('games');
        }
      }
    }
  }, []);

  // Set dynamic browser tab title & favicon based on current section & decoy toggle
  useEffect(() => {
    const setBothTitles = (title) => {
      document.title = title;
      try {
        if (window.parent && window.parent !== window && window.parent.document) {
          window.parent.document.title = title;
        }
      } catch (err) {
        // ignore cross-origin sandbox restrictions
      }
    };

    const updateFavicon = (href) => {
      const applyIcon = (doc, iconUrl) => {
        // Remove ALL existing favicon links to avoid browser caching or conflict issues
        const existingLinks = doc.querySelectorAll("link[rel*='icon']");
        existingLinks.forEach(link => {
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
        });

        // Determine correct mime-type
        let typeVal = 'image/png';
        if (iconUrl.includes('.ico')) {
          typeVal = 'image/x-icon';
        } else if (iconUrl.includes('.webp')) {
          typeVal = 'image/webp';
        } else if (iconUrl.includes('image/svg+xml') || iconUrl.startsWith('data:image/svg+xml')) {
          typeVal = 'image/svg+xml';
        }

        // Add standard icon element with cache buster to force immediate update for regular URLs, but leave data URIs intact
        const finalUrl = iconUrl.startsWith('data:')
          ? iconUrl
          : (iconUrl.includes('?') ? `${iconUrl}&v=${Date.now()}` : `${iconUrl}?v=${Date.now()}`);

        const newLink = doc.createElement('link');
        newLink.rel = 'icon';
        newLink.type = typeVal;
        newLink.href = finalUrl;
        doc.head.appendChild(newLink);

        // Add shortcut icon element for maximum compatibility
        const shortcutLink = doc.createElement('link');
        shortcutLink.rel = 'shortcut icon';
        shortcutLink.type = typeVal;
        shortcutLink.href = finalUrl;
        doc.head.appendChild(shortcutLink);
      };

      // Current document
      applyIcon(document, href);

      // Parent document
      try {
        if (window.parent && window.parent !== window && window.parent.document) {
          applyIcon(window.parent.document, href);
        }
      } catch (err) {
        // ignore cross-origin sandbox restrictions
      }
    };

    const customStudyFavicon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZy1ncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjM0I4MkY2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMUQ0RUQ4Ii8+PC9saW5lYXJHcmFkaWVudD48ZmlsdGVyIGlkPSJzaGFkb3ciIHg9Ii0xMCUiIHk9Ii0xMCUiIHdpZHRoPSIxMzAlIiBoZWlnaHQ9IjEzMCUiPjxmZURyb3BTaGFkb3cgZHg9IjAiIGR5PSI0IiBzdGREZXZpYXRpb249IjQiIGZsb29kLW9wYWNpdHk9IjAuMTUiLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIHJ4PSIyOCIgZmlsbD0idXJsKCNiZy1ncmFkKSIvPjxjaXJjbGUgY3g9IjY0IiBjeT0iNjQiIHI9IjUwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTY0IDQyIEM2NCA0MiwgNTQgMzQsIDM0IDM0IEwzNCA4MiBDNTQgODIsIDY0IDkwLCA2NCA5MCBDNjQgOTAsIDc0IDgyLCA5NCA4MiBMOTQgMzQgQzc0IDM0LCA2NCA0MiwgNjQgNDIgWiIgZmlsbD0iI0ZGRkZGRiIgZmlsdGVyPSJ1cmwoI3NoYWRvdykiLz48cGF0aCBkPSJNNjQgNDIgTDY0IDkwIiBzdHJva2U9IiMxRDFFRDgiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTY0IDI0IEw2NiAyOSBMNzEgMjkgTDY3IDMyIEw2OSAzNyBMNjQgMzQgTDU5IDM3IEw2MSAzMiBMNTcgMjkgTDYyIDI5IFoiIGZpbGw9IiNGQkJGMjQiLz48L3N2Zz4=";
    const classroomFavicon = "https://ssl.gstatic.com/classroom/favicon.png";

    if (viewMode === 'articles') {
      setBothTitles("Study Tools");
      updateFavicon(customStudyFavicon);
    } else if (viewMode === 'games') {
      const activeTitle = getDecoyTitle(decoyType, customDecoyTitles);
      setBothTitles(activeTitle);
      updateFavicon(getDecoyFavicon(decoyType));
    } else {
      // Default to Study Tools for locked/welcome screens
      setBothTitles("Study Tools");
      updateFavicon(customStudyFavicon);
    }
  }, [viewMode, decoyType, customDecoyTitles]);

  // Set LocalStorage theme and mode on change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);
    safeStorage.setItem('unblocked-theme', theme);
    safeStorage.setItem('unblocked-mode', mode);
    if (viewMode === 'games' && !suppressAccountSyncRef.current) {
      safeStorage.setItem('unblocked-account-mode', mode);
    }
  }, [theme, mode, viewMode]);

  // Set LocalStorage favorites on change
  useEffect(() => {
    safeStorage.setItem('unblocked-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Track active game selection to automatically populate recently played
  useEffect(() => {
    if (selectedGame?.id) {
      recordRecentlyPlayed(selectedGame.id);
    }
  }, [selectedGame?.id, recordRecentlyPlayed]);

  // Hide/show chat widget based on lock state
  useEffect(() => {
    document.body.setAttribute('data-locked', isPasscodeUnlocked ? 'false' : 'true');
  }, [isPasscodeUnlocked]);



  // Handle addition/removal of favorites
  const toggleFavorite = (e, gameId) => {
    e.stopPropagation();
    if (favorites.includes(gameId)) {
      setFavorites(favorites.filter(id => id !== gameId));
    } else {
      setFavorites([...favorites, gameId]);
    }
  };

  // Helper method to draw beautiful game art based on game title / id
  const renderGameArt = (game, defaultThumbnailSrc = null) => {
    const iconSize = 48;
    const id = String(game?.id || '').toLowerCase();
    const title = String(game?.title || '').toLowerCase();

    let matchKey = id;
    if (!matchKey || matchKey.startsWith('game-gen-')) {
      if (title.includes('neon breakout')) matchKey = 'neon-breakout';
      else if (title.includes('synthwave runner')) matchKey = 'synthwave-runner';
      else if (title.includes('tron')) matchKey = 'tron-lightcycle';
      else if (title.includes('cyber defender')) matchKey = 'cyber-defenders';
      else if (title.includes('slope')) matchKey = 'slope';
      else if (title.includes('2048')) matchKey = '2048';
      else if (title.includes('retro bowl')) matchKey = 'retro-bowl';
      else if (title.includes('flappy')) matchKey = 'flappy';
      else if (title.includes('pacman') || title.includes('pac-man')) matchKey = 'pacman';
      else if (title.includes('tunnel rush')) matchKey = 'tunnel-rush';
      else if (title.includes('chess')) matchKey = 'chess';
      else if (title.includes('bubble shooter')) matchKey = 'bubble-shooter';
      else if (title.includes('crossy road')) matchKey = 'crossy-road';
      else if (title.includes('solitaire')) matchKey = 'solitaire';
      else if (title.includes('doodle jump')) matchKey = 'doodle-jump';
      else if (title.includes('sandbox')) matchKey = 'sandbox';
    }

    switch (matchKey) {
      case 'neon-breakout':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-neutral-950">
            {/* Ambient cyber grid */}
            <div className="absolute inset-0 opacity-25 overflow-hidden">
              <div className="w-full h-full bg-[linear-gradient(to_bottom,rgba(244,63,94,0.15)_1px,transparent_1px),linear-gradient(to_right,rgba(244,63,94,0.15)_1px,transparent_1px)] bg-[size:14px_14px]" />
            </div>
            {/* Retro ball bounce */}
            <div className="relative flex flex-col items-center gap-2.5 z-10">
              <div className="flex gap-1.5">
                <div className="w-7 h-3.5 bg-rose-500 rounded-sm shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                <div className="w-7 h-3.5 bg-pink-500 rounded-sm shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-pulse" />
                <div className="w-7 h-3.5 bg-purple-500 rounded-sm shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              </div>
              <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee] animate-bounce my-1.5" />
              <div className="w-16 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4] translate-x-1" />
            </div>
          </div>
        );
      case 'synthwave-runner':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#050512]">
            {/* Sunrise halo */}
            <div className="absolute top-4 w-24 h-24 bg-gradient-to-t from-pink-600 via-orange-500 to-yellow-400 rounded-full opacity-70 filter blur-sm animate-pulse" />
            {/* Horizontal lines */}
            <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_bottom,rgba(168,85,247,0.25)_1px,transparent_1px)] bg-[size:100%_8px]" />
            {/* Space ship silhouette */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 bg-gradient-to-b from-white to-pink-500 rounded-full border-2 border-pink-400 flex items-center justify-center shadow-[0_0_15px_#ec4899] transform -rotate-12 hover:rotate-12 transition-transform duration-300">
                <span className="text-xs">🏎️</span>
              </div>
              <div className="text-[9px] font-mono tracking-widest text-cyan-400 font-black uppercase animate-pulse">SUNSET GRID</div>
            </div>
          </div>
        );
      case 'tron-lightcycle':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#02020a]">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_bottom,#00f0ff_1px,transparent_1px),linear-gradient(to_right,#00f0ff_1px,transparent_1px)] bg-[size:12px_12px]" />
            {/* Cycle line trail with neon glow */}
            <div className="absolute left-6 bottom-12 w-28 h-1 bg-gradient-to-r from-transparent via-[#ff007f] to-[#ff007f] shadow-[0_0_8px_#ff007f]" />
            <div className="absolute left-32 bottom-12 w-1 h-14 bg-gradient-to-b from-[#ff007f] to-[#ff007f] shadow-[0_0_8px_#ff007f]" />
            {/* Lightcycle pod */}
            <div className="absolute left-28 bottom-26 w-8 h-4 bg-cyan-400 rounded-sm border-2 border-white flex items-center justify-center shadow-[0_0_12px_#00f0ff] animate-pulse">
              <span className="text-[10px]">🏍️</span>
            </div>
            <div className="relative z-10 text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase mt-12 bg-neutral-900/80 px-2 py-0.5 rounded border border-cyan-500/20">LIGHTCYCLE GRID</div>
          </div>
        );
      case 'cyber-defenders':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#030310]">
            {/* Vaporwave Sun */}
            <div className="absolute -bottom-6 w-28 h-28 bg-gradient-to-t from-pink-500 via-[#ff007f] to-orange-400 rounded-full opacity-60 filter blur-[1px]" />
            {/* Falling alien pixel ships */}
            <div className="absolute top-4 left-6 flex gap-3 animate-pulse">
              <span className="text-sm">👾</span>
              <span className="text-sm text-cyan-400">👾</span>
            </div>
            <div className="absolute top-10 right-8 flex gap-3 animate-pulse duration-1000">
              <span className="text-sm text-yellow-300">👾</span>
              <span className="text-sm">👾</span>
            </div>
            {/* Laser beams */}
            <div className="absolute top-14 left-16 w-0.5 h-6 bg-rose-500 shadow-[0_0_5px_red] animate-bounce" />
            <div className="absolute bottom-10 right-16 w-0.5 h-8 bg-cyan-400 shadow-[0_0_5px_cyan] animate-bounce" />
            {/* Player shooter */}
            <div className="absolute bottom-3 w-8 h-6 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-t-lg flex items-center justify-center shadow-[0_0_12px_#00f0ff]">
              <span className="text-[10px]">🚀</span>
            </div>
            <div className="relative z-10 text-[9px] font-mono tracking-widest text-[#ff007f] font-black uppercase mt-12 bg-neutral-900/80 px-2.5 py-0.5 rounded border border-pink-500/20">DEFEND CORE</div>
          </div>
        );
      case 'slope':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            {/* Grid background effect */}
            <div className="absolute inset-0 opacity-15 overflow-hidden">
              <div className="w-full h-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]" />
              <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/30 to-transparent" />
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-md animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] transform hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="absolute bottom-3 w-1/2 h-[3px] bg-emerald-400/50 rounded transform rotate-12" />
          </div>
        );
      case '2048':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="grid grid-cols-2 gap-1 bg-amber-950/20 p-2 rounded">
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-xs font-black text-black">2</div>
              <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-xs font-black text-white">0</div>
              <div className="w-8 h-8 rounded bg-yellow-500 flex items-center justify-center text-xs font-black text-white">4</div>
              <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center text-xs font-black text-white animate-bounce">8</div>
            </div>
          </div>
        );
      case 'retro-bowl':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-blue-400 opacity-60">QUARTERBACK</div>
            <div className="relative w-14 h-8 bg-amber-800 rounded-full border-y-[3px] border-white/60 flex items-center justify-center shadow-lg transform -rotate-12">
              <div className="w-1 h-6 bg-white/80 absolute" />
              <div className="w-3 h-[2px] bg-white translate-x-2 absolute" />
              <div className="w-3 h-[2px] bg-white -translate-x-2 absolute" />
            </div>
          </div>
        );
      case 'flappy':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-sky-950">
            <div className="absolute inset-y-0 right-6 w-5 h-full flex flex-col justify-between py-2">
              <div className="w-full h-8 bg-green-500 rounded-b border-2 border-white/40" />
              <div className="w-full h-12 bg-green-500 rounded-t border-2 border-white/40" />
            </div>
            <div className="relative w-10 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-md animate-bounce">
              <div className="absolute right-1 w-3 h-3 bg-white rounded-full border border-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <div className="absolute left-1 w-3 h-2 bg-orange-500 rounded-lg" />
              <div className="absolute bottom-1 w-4 h-2 bg-white/80 rounded-full border border-black/40 rotate-12" />
            </div>
          </div>
        );
      case 'pacman':
        return (
          <div className="relative w-full h-full flex items-center justify-center gap-2 bg-neutral-950">
            <div className="w-10 h-10 bg-yellow-400 rounded-full border-r-4 border-transparent rotate-45 animate-pulse" />
            <div className="w-2 h-2 bg-white rounded-full" />
            <div className="w-2 h-2 bg-white/60 rounded-full" />
            <div className="w-2 h-2 bg-white/30 rounded-full" />
          </div>
        );
      case 'tunnel-rush':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-neutral-950">
            <div className="absolute w-24 h-24 border-2 border-dashed border-purple-500/40 rounded-full animate-spin" />
            <div className="absolute w-16 h-16 border border-purple-500/30 rounded-full animate-ping" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white" />
          </div>
        );
      case 'chess':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]">
            <div className="border border-white/20 p-1 bg-black/40 rounded flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                <div className="w-4 h-4 bg-white" />
                <div className="w-4 h-4 bg-stone-700" />
              </div>
              <div className="flex gap-0.5">
                <div className="w-4 h-4 bg-stone-700" />
                <div className="w-4 h-4 bg-white" />
              </div>
            </div>
            <div className="absolute text-2xl font-semibold transform hover:scale-110 duration-200">♟️</div>
          </div>
        );
      case 'bubble-shooter':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="absolute top-3 flex gap-2">
              <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" />
              <div className="w-4 h-4 bg-red-400 rounded-full shadow-[0_0_8px_red]" />
              <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_8px_yellow]" />
            </div>
            <div className="absolute bottom-2 w-2 h-8 bg-zinc-400 rounded-full origin-bottom rotate-45 animate-pulse" />
          </div>
        );
      case 'crossy-road':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="absolute inset-x-0 h-4 bg-neutral-800/80 border-y border-neutral-700" />
            <div className="w-8 h-8 bg-white border border-neutral-300 rounded flex flex-col items-center justify-center transform hover:translate-y-[-6px] transition-transform shadow-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1" />
              <div className="w-3 h-1.5 bg-yellow-500 rounded-b mt-0.5" />
            </div>
          </div>
        );
      case 'solitaire':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="w-9 h-14 bg-white border border-neutral-200 rounded-md shadow-md flex flex-col justify-between p-1 text-red-600 transform hover:-translate-y-2 hover:rotate-6 duration-300">
              <span className="text-[9px] font-black leading-none">A</span>
              <span className="text-sm self-center">♥️</span>
              <span className="text-[9px] font-black leading-none self-end scale-y-[-1]">A</span>
            </div>
            <div className="absolute w-9 h-14 bg-red-600 border border-white rounded-md shadow-md flex flex-col justify-between p-1 text-white -translate-x-3 translate-y-1 transform hover:rotate-12 duration-300">
              <div className="w-full h-full border border-white/20 rounded flex items-center justify-center text-xs">✨</div>
            </div>
          </div>
        );
      case 'doodle-jump':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="absolute w-8 h-1.5 bg-green-500 rounded bottom-6" />
            <div className="w-8 h-10 bg-lime-400 rounded-t-full border border-green-600 flex flex-col items-center relative animate-bounce shadow">
              <div className="w-4 h-1.5 bg-lime-500 rounded absolute -bottom-1" />
              <div className="flex gap-1 mt-2">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <div className="w-1.5 h-4 bg-lime-600 rounded-full mt-1" />
            </div>
          </div>
        );
      case 'classroom-portal':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="bg-sky-500/10 p-3 rounded-full border border-sky-400/20">
              <MessageSquare className="text-sky-400 w-10 h-10 animate-pulse" />
            </div>
          </div>
        );
      case 'youtube-stealth':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg relative cursor-pointer transform hover:scale-105 duration-200">
              <Play className="fill-white text-white w-5 h-5 ml-0.5" />
            </div>
          </div>
        );
      case 'stealth-proxy':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="bg-zinc-800 p-3 rounded-lg border-2 border-zinc-700 flex flex-col items-center gap-1 shadow-md">
              <Globe className="text-zinc-300 w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
        );
      case 'sim-life':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="bg-pink-500/10 p-4 rounded-full border border-pink-400/30">
              <Users className="text-pink-400 w-8 h-8 hover:rotate-12 duration-200" />
            </div>
          </div>
        );
      case 'sandbox':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-neutral-950">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-amber-950 opacity-40" />
            <div className="relative w-12 h-12 bg-amber-800 rounded-md border-t-[8px] border-emerald-500 shadow-xl flex items-center justify-center font-mono font-bold text-white/50 text-[10px]">
              3D
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 select-none">
            {defaultThumbnailSrc && (
              <img
                src={defaultThumbnailSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[1px] scale-105 pointer-events-none"
                draggable="false"
              />
            )}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]" />
            <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Gamepad2 className="w-5 h-5 text-neutral-300" />
              </div>
              <span className="text-xs font-semibold text-neutral-200 line-clamp-1 max-w-[200px] tracking-wide">
                {game?.title || 'Game Portal'}
              </span>
            </div>
          </div>
        );
    }
  };

  const emulatedTags = useMemo(() => {
    return Array.from(new Set(
      games
        .map((game) => (game.category || '').trim().toLowerCase())
        .filter((cat) => cat && EMULATED_PLATFORMS.includes(cat))
    )).sort((a, b) => (EMULATED_SYSTEM_NAMES[a] || a).localeCompare(EMULATED_SYSTEM_NAMES[b] || b));
  }, [games]);

  const emulatedTagCounts = useMemo(() => {
    const counts = {};
    for (const game of games) {
      const c = (game.category || '').trim().toLowerCase();
      if (EMULATED_PLATFORMS.includes(c)) {
        counts[c] = (counts[c] || 0) + 1;
      }
    }
    return counts;
  }, [games]);

  const emulatedMajorTags = useMemo(() => {
    return emulatedTags.filter(tag => (emulatedTagCounts[tag] || 0) >= 10);
  }, [emulatedTags, emulatedTagCounts]);

  const emulatedOtherTags = useMemo(() => {
    return emulatedTags.filter(tag => (emulatedTagCounts[tag] || 0) < 10);
  }, [emulatedTags, emulatedTagCounts]);

  const totalOtherEmulatedGamesCount = useMemo(() => {
    return emulatedOtherTags.reduce((sum, tag) => sum + (emulatedTagCounts[tag] || 0), 0);
  }, [emulatedOtherTags, emulatedTagCounts]);

  const isSinglePlayerCategory = (cat) => {
    if (!cat) return true;
    const c = cat.toLowerCase().trim();
    if (c === 'minecraft' || c === 'emulated') return true;
    if (EMULATED_PLATFORMS.includes(c)) return true;
    return ['solo', 'single', 'platformer', 'skill', 'science', 'driving', 'horror', 'creative', 'ai', 'general', 'gmfiles'].some(kw => c.includes(kw));
  };

  const isMultiplayerCategory = (cat) => {
    if (!cat) return false;
    const c = cat.toLowerCase().trim();
    if (c === 'minecraft') return true;
    return ['social', 'sport', 'multiplayer', 'fast', 'party', 'puzzle', 'shooter'].some(kw => c.includes(kw)) || c.includes('or');
  };

  const totalEmulatedGamesCount = useMemo(() => {
    return games.filter(g => {
      const c = (g.category || '').trim().toLowerCase();
      return EMULATED_PLATFORMS.includes(c) || c === 'emulated';
    }).length;
  }, [games]);

  const totalGenizyMathGamesCount = useMemo(() => {
    return games.filter(g => {
      const c = (g.category || '').trim().toLowerCase();
      return c === 'genizy math' || c === 'genizy' || (typeof g.url === 'string' && g.url.includes('genizymath'));
    }).length;
  }, [games]);

  const ogGamesCount = useMemo(() => {
    return games.filter(g => g.isOg || (g.category || '').toLowerCase() === 'og').length;
  }, [games]);

  const singlePlayerGamesCount = useMemo(() => {
    return games.filter(g => isSinglePlayerCategory(g.category)).length;
  }, [games]);

  const multiplayerGamesCount = useMemo(() => {
    return games.filter(g => isMultiplayerCategory(g.category)).length;
  }, [games]);

  const minecraftGamesCount = useMemo(() => {
    return games.filter(g => (g.category || '').toLowerCase() === 'minecraft').length;
  }, [games]);

  const featuredGamesCount = useMemo(() => {
    return games.filter(g => g.featured).length;
  }, [games]);

  const girlsFeaturedGamesCount = useMemo(() => {
    return games.filter(g => Boolean(g.girlsFeatured)).length;
  }, [games]);

  useEffect(() => {
    if (theme !== 'girls' && filter === 'girls-featured') {
      setFilter('all');
    }
  }, [theme, filter]);

  const isEmulatedActive = filter === 'Emulated' || filter === 'emulated-other' || emulatedTags.includes(filter);

  const [emulatedDropdownOpen, setEmulatedDropdownOpen] = useState(false);

  useEffect(() => {
    if (isEmulatedActive) {
      setEmulatedDropdownOpen(true);
      setGameCatalogMode('all');
      safeStorage.setItem('unblocked-game-catalog-mode', 'all');
    }
  }, [isEmulatedActive]);

  const rankedGameSections = useMemo(() => {
    return [
      {
        key: 'all',
        label: 'All Games',
        games: games
      },
      {
        key: 'top',
        label: 'Top Picks',
        games: games.filter((g) => (g.featured === true || g.featured === 'true') || (g.isOg === true || g.isOg === 'true'))
      },
      {
        key: 'featured',
        label: 'Featured',
        games: games.filter((game) => game.featured === true || game.featured === 'true')
      },
      {
        key: 'originals',
        label: 'Originals',
        games: games.filter((game) => game.isOg === true || game.isOg === 'true')
      },
      {
        key: 'single',
        label: 'Single Player',
        games: games.filter((game) => isSinglePlayerCategory(game.category))
      },
      {
        key: 'multiplayer',
        label: 'Multiplayer',
        games: games.filter((game) => isMultiplayerCategory(game.category))
      }
    ].filter((section) => section.games.length > 0);
  }, [games, isSinglePlayerCategory, isMultiplayerCategory]);

  const gameTierOrder = ['S', 'A', 'B', 'C', 'F'];
  const [selectedTier, setSelectedTier] = useState('S');
  const [randomRankingPool, setRandomRankingPool] = useState('all');
  const [randomPickerOpen, setRandomPickerOpen] = useState(false);
  const [excludedRandomTiers, setExcludedRandomTiers] = useState([]);

  const normalizeTierTitle = (title) => {
    return String(title || '')
      .toLowerCase()
      .replace(/\s*\([^)]*\)/g, ' ')
      .replace(/\s*\[[^\]]*\]/g, ' ')
      .replace(/\s+version\b/gi, ' ')
      .replace(/&/g, ' and ')
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\b(?:the|and|of|a|an|vs|v)\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const normalizeLiteralTitle = (title) => {
    return String(title || '')
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\b(?:the|and|of|a|an|vs|v)\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const gameRankMap = useMemo(() => {
    const map = new Map();
    let currentRank = 1;

    if (gameRankings && typeof gameRankings === 'object') {
      Object.entries(gameRankings).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          // Format 1: { S: ['Game 1', 'Game 2'] } (tier -> array of game titles)
          const tier = key;
          val.forEach((title) => {
            if (!title || typeof title !== 'string') return;
            const rankInfo = { rank: currentRank++, tier, canonicalTitle: title };
            const normClean = normalizeTierTitle(title);
            const normLit = normalizeLiteralTitle(title);
            if (normClean && !map.has(normClean)) map.set(normClean, rankInfo);
            if (normLit && !map.has(normLit)) map.set(normLit, rankInfo);
          });
        } else if (typeof val === 'string') {
          // Format 2: { 'Game Title': 'S' } (game title -> tier string)
          const title = key;
          const tier = val;
          if (title && tier) {
            const rankInfo = { rank: currentRank++, tier, canonicalTitle: title };
            const normClean = normalizeTierTitle(title);
            const normLit = normalizeLiteralTitle(title);
            if (normClean && !map.has(normClean)) map.set(normClean, rankInfo);
            if (normLit && !map.has(normLit)) map.set(normLit, rankInfo);
          }
        }
      });
    }

    const aliases = [
      ['minecraft 1 12', 'minecraft'],
      ['minecraft launcher', 'minecraft'],
      ['fnaf', 'fnaf 1'],
      ['plants zombies', 'plants vs zombies'],
      ['fnaf sister location', 'sister location'],
      ['fnaf ultimate custom night', 'ucn'],
      ['slope', 'slope'],
      ['run 3', 'run 3'],
      ['geometry dash', 'geometry dash'],
      ['1v1 lol', '1v1 lol'],
      ['retro bowl', 'retro bowl'],
      ['super smash flash 2', 'super smash flash 2'],
      ['zelda ocarina of time', 'legend of zelda ocarina of time'],
      ['zelda majoras mask', 'legend of zelda majoras mask'],
      ['zelda minish cap', 'legend of zelda minish cap'],
      ['zelda link to the past', 'legend of zelda link to past'],
      ['pokemon radical red', 'pokemon radical red'],
      ['pokemon unbound', 'pokemon unbound'],
      ['pokemon platinum version', 'pokemon platinum'],
      ['pokemon soulsilver version', 'pokemon soulsilver'],
      ['pokemon heartgold version', 'pokemon heartgold'],
      ['pokemon emerald version', 'pokemon emerald'],
      ['mario kart 64', 'mario kart 64'],
      ['mario kart ds', 'mario kart ds'],
      ['super mario 64 ds', 'super mario 64 ds'],
    ];

    aliases.forEach(([from, to]) => {
      const targetInfo = map.get(to) || map.get(normalizeTierTitle(to));
      if (targetInfo && !map.has(from)) {
        map.set(from, targetInfo);
      }
    });

    return map;
  }, []);

  const getGameRankInfo = useCallback((game) => {
    if (!game) return null;
    const explicitTier = String(game?.rankTier || '').trim().toUpperCase();
    const rawTitle = String(game?.title || '');

    // User requirement: The dawn series should be S tier and copy games should be S tier
    if (/\b(dawn|copy)\b/i.test(rawTitle)) {
      return { rank: 1, tier: 'S', canonicalTitle: game.title };
    }

    const withoutParens = rawTitle.replace(/\s*\([^)]*\)/g, ' ').replace(/\s*\[[^\]]*\]/g, ' ').trim();
    const baseTitle = rawTitle.split(/[:–—\-]/)[0].trim();
    const baseTitleWithoutParens = baseTitle.replace(/\s*\([^)]*\)/g, ' ').trim();

    const candidateTitles = [
      rawTitle,
      withoutParens,
      baseTitle,
      baseTitleWithoutParens,
      game?.name,
      game?.displayName,
      game?.searchText
    ].filter(Boolean);

    for (const candidateTitle of candidateTitles) {
      const info = gameRankMap.get(normalizeTierTitle(candidateTitle)) || gameRankMap.get(normalizeLiteralTitle(candidateTitle));
      if (info) return info;
    }
    if (['S', 'A', 'B', 'C', 'D', 'F'].includes(explicitTier)) {
      return { rank: 999, tier: explicitTier, canonicalTitle: game.title };
    }
    return null;
  }, [gameRankMap]);

  const getGameTier = useCallback((game) => {
    const info = getGameRankInfo(game);
    return info ? info.tier : null;
  }, [getGameRankInfo]);

  const rankedGamesList = useMemo(() => {
    if (!games || games.length === 0) return [];
    return games
      .map((game) => {
        const info = getGameRankInfo(game);
        return info ? { ...game, rankNumber: info.rank, rankTier: info.tier } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.rankNumber - b.rankNumber);
  }, [games, getGameRankInfo]);

  const rankedGamesByTier = useMemo(() => {
    const tiers = { S: [], A: [], B: [], C: [], D: [], F: [] };
    if (Array.isArray(rankedGamesList)) {
      rankedGamesList.forEach((g) => {
        if (g && tiers[g.rankTier]) tiers[g.rankTier].push(g);
      });
    }
    return tiers;
  }, [rankedGamesList]);

  const isRankingsActive = filter === 'rankings' || filter.startsWith('tier-');

  const tierRankedGames = useMemo(() => {
    if (!Array.isArray(games) || !Array.isArray(gameTierOrder)) return [];
    return gameTierOrder.map((tier) => {
      const tierGames = games.filter((game) => getGameTier(game) === tier);
      return {
        tier,
        games: tierGames
      };
    });
  }, [games, getGameTier, gameTierOrder]);

  const activeRandomRankingPool = useMemo(() => {
    return rankedGameSections.find((section) => section.key === randomRankingPool) || rankedGameSections[0];
  }, [randomRankingPool, rankedGameSections]);

  const isEmulatedGame = useCallback((game) => {
    const category = String(game?.category || '').trim().toLowerCase();
    return category === 'emulated' || EMULATED_PLATFORMS.includes(category);
  }, []);

  const toggleExcludedTier = useCallback((tier) => {
    setExcludedRandomTiers((prev) => {
      if (prev.includes(tier)) {
        return prev.filter((value) => value !== tier);
      }
      return [...prev, tier];
    });
  }, []);

  const randomEligibleCount = useMemo(() => {
    const sectionPool = (activeRandomRankingPool?.games && activeRandomRankingPool.games.length > 0)
      ? activeRandomRankingPool.games
      : games;

    return sectionPool.filter((game) => {
      const tier = getGameTier(game);
      // Strictly in curated S, A, B, C pool
      if (!tier || !gameTierOrder.includes(tier)) return false;
      if (excludedRandomTiers.includes(tier)) return false;
      if (excludedRandomTiers.includes('EMULATED') && isEmulatedGame(game)) return false;
      return true;
    }).length;
  }, [activeRandomRankingPool, excludedRandomTiers, gameTierOrder, games, getGameTier, isEmulatedGame]);

  const pickRandomRankedGame = useCallback(() => {
    const sectionPool = (activeRandomRankingPool?.games && activeRandomRankingPool.games.length > 0)
      ? activeRandomRankingPool.games
      : games;

    const filterGame = (game) => {
      const tier = getGameTier(game);
      // STRICT FILTER: Only curated tiers ('S', 'A', 'B', 'C') are eligible.
      // All unranked, excluded, and D-tier entries are excluded.
      if (!tier || !gameTierOrder.includes(tier)) {
        return false;
      }
      if (excludedRandomTiers.includes(tier)) {
        return false;
      }
      const excludedByEmulated = excludedRandomTiers.includes('EMULATED') && isEmulatedGame(game);
      return !excludedByEmulated;
    };

    let pool = sectionPool.filter(filterGame);

    if (!pool.length) {
      pool = games.filter(filterGame);
    }

    if (!pool.length) {
      // Fallback: any curated game in S, A, B, C
      pool = games.filter((g) => {
        const tier = getGameTier(g);
        return tier && gameTierOrder.includes(tier);
      });
    }

    if (!pool.length) return;

    let candidatePool = pool.length > 1 && selectedGame ? pool.filter((g) => g.id !== selectedGame.id) : pool;
    if (!candidatePool.length) candidatePool = pool;

    const randomGame = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    if (!randomGame) return;

    setFilter('all');
    setCurrentGamePage(1);
    setRandomPickerOpen(false);
    launchGame(randomGame);
  }, [activeRandomRankingPool, excludedRandomTiers, gameTierOrder, games, getGameTier, isEmulatedGame, selectedGame, launchGame]);

  // Filter games based on category sidebar, matching search query
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const filteredGames = games.filter(game => {
    // When hideUnranked is active, anything below D tier (F tier, unranked) should NOT appear (except curated Girls Featured picks)
    if (hideUnranked && filter !== 'girls-featured') {
      const info = getGameRankInfo(game);
      if (!info) return false;
      const tier = String(info.tier || '').toUpperCase();
      if (!['S', 'A', 'B', 'C', 'D'].includes(tier)) {
        return false;
      }
    }

    // When a search query is entered, search across every game in the active library
    if (normalizedSearchQuery !== '') {
      return (game.searchText || '').includes(normalizedSearchQuery);
    }

    if (filter === 'og') {
      if (!game.isOg && (game.category || '').toLowerCase().trim() !== 'og') return false;
    } else {
      // Only restrict to originals when on 'all' filter and catalog mode is set to 'original' (always include Girls Featured items when Girls mode is active)
      if (filter === 'all' && gameCatalogMode === 'original' && !game.isOg && !isEmulatedActive && !(theme === 'girls' && game.girlsFeatured)) {
        return false;
      }
      if (filter === 'single') {
        if (!isSinglePlayerCategory(game.category)) return false;
      } else if (filter === 'multiplayer') {
        if (!isMultiplayerCategory(game.category)) return false;
      } else if (filter === 'favorites') {
        if (!favorites.includes(game.id)) return false;
      } else if (filter === 'rankings') {
        const info = getGameRankInfo(game);
        if (!info) return false;
      } else if (filter.startsWith('tier-')) {
        const targetTier = filter.replace('tier-', '').toUpperCase();
        const info = getGameRankInfo(game);
        if (!info || info.tier !== targetTier) return false;
      } else if (filter === 'featured') {
        if (!game.featured) return false;
      } else if (filter === 'girls-featured') {
        if (theme !== 'girls' || !game.girlsFeatured) return false;
      } else if (filter === 'Emulated') {
        const c = (game.category || '').trim().toLowerCase();
        const matchesEmulated = EMULATED_PLATFORMS.includes(c) || c === 'emulated';
        if (!matchesEmulated) return false;
      } else if (filter === 'emulated-other') {
        const c = (game.category || '').trim().toLowerCase();
        if (!emulatedOtherTags.includes(c)) return false;
      } else if (filter === 'genizy-math' || filter === 'Genizy Math' || filter === 'genizy' || filter.toLowerCase() === 'genizy math') {
        const c = (game.category || '').trim().toLowerCase();
        const isGenizy = c === 'genizy math' || c === 'genizy' || (typeof game.url === 'string' && game.url.includes('genizymath'));
        if (!isGenizy) return false;
      } else if (filter !== 'all') {
        // Direct category filter matching
        if ((game.category || '').toLowerCase().trim() !== filter.toLowerCase().trim()) return false;
      }
    }

    return true;
  });

  const sortedFilteredGames = useMemo(() => {
    if ((filter === 'rankings' || filter.startsWith('tier-')) && normalizedSearchQuery === '') {
      return [...filteredGames].sort((a, b) => {
        const rA = getGameRankInfo(a)?.rank ?? 99999;
        const rB = getGameRankInfo(b)?.rank ?? 99999;
        return rA - rB;
      });
    }
    if (theme === 'girls') {
      return [...filteredGames].sort((a, b) => {
        const aGirls = Boolean(a.girlsFeatured);
        const bGirls = Boolean(b.girlsFeatured);
        if (aGirls && !bGirls) return -1;
        if (!aGirls && bGirls) return 1;
        return 0;
      });
    }
    return filteredGames;
  }, [filter, normalizedSearchQuery, filteredGames, getGameRankInfo, theme]);

  const isGenizyView = filter === 'genizy-math' || filter === 'Genizy Math' || filter.toLowerCase() === 'genizy math';
  const isCompactLayout = isGenizyView || gameLayoutMode === 'compact';
  const effectiveGamesPerPage = isCompactLayout ? 42 : GAMES_PER_PAGE;

  const totalGamePages = Math.max(1, Math.ceil(sortedFilteredGames.length / effectiveGamesPerPage));
  const safeGamePage = Math.min(currentGamePage, totalGamePages);
  const paginatedGames = sortedFilteredGames.slice(
    (safeGamePage - 1) * effectiveGamesPerPage,
    safeGamePage * effectiveGamesPerPage
  );

  useEffect(() => {
    if (!pendingGameCardScroll.current || !paginatedGames.some((game) => game.title === 'Air Hockey')) return;
    document.getElementById('air-hockey-game-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    pendingGameCardScroll.current = false;
  }, [paginatedGames]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [safeGamePage]);

  const triggerPanicToClassroom = useCallback(() => {
    try {
      safeStorage.setItem('classroom-view-mode', 'articles');
      safeStorage.setItem('classroom-passcode-unlocked', 'false');
      window.history.replaceState({ disguise: 'educational_workspace' }, 'Home - Classroom', window.location.pathname || '/');
      window.close();
    } catch (err) {
      console.error(err);
    }
    window.location.href = "https://classroom.google.com";
  }, []);

  if (instantSignInBusy) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 gap-3 select-none">
        <div className="w-11 h-11 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--accent-color)] shadow-sm">
          <KeyRound className="w-5 h-5 animate-pulse" />
        </div>
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Signing in...
        </p>
      </div>
    );
  }

  if (pendingAboutBlankLaunch) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex items-center justify-center p-6 select-none">
        <div className="w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)] text-[var(--bg-color)] flex items-center justify-center mx-auto shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-black uppercase tracking-wider text-[var(--text-primary)]">
              Signed in as @{pendingAboutBlankLaunch.username}
            </h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Your browser blocked automatic popups. Click below to open your workspace in <code>about:blank</code>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const targetFilter = pendingAboutBlankLaunch.filter || 'all';
              const opened = openWorkspaceInAboutBlank(targetFilter);
              setPendingAboutBlankLaunch(null);
              if (opened) {
                setViewMode('articles');
              } else {
                setViewModeAndSave('games');
              }
            }}
            className="w-full py-3 px-4 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] font-black text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-lg"
          >
            Open in about:blank
          </button>
          <button
            type="button"
            onClick={() => {
              setPendingAboutBlankLaunch(null);
              setViewModeAndSave('games');
            }}
            className="w-full py-2 px-3 rounded-lg border border-[var(--card-border)] text-[11px] font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Continue in this tab instead
          </button>
        </div>
      </div>
    );
  }

  if (!isPasscodeUnlocked) {
    const filteredArticles = articles.filter(art => {
      const matchesCategory = selectedArticleCategory === 'All' || art.category === selectedArticleCategory;
      if (!matchesCategory) return false;

      const q = articleSearch.toLowerCase().trim();
      if (!q) return true;
      return art.title.toLowerCase().includes(q) || 
             art.content.toLowerCase().includes(q) || 
             art.category.toLowerCase().includes(q);
    });

    const selectedArticle = filteredArticles.find(art => art.id === selectedArticleId) || filteredArticles[0] || articles[0];

    const renderFormattedText = (text) => {
      if (!text) return null;
      
      const lines = text.split('\n');
      const elements = [];
      let i = 0;
      let elementKey = 0;
      
      // Inline formatting helper
      const parseInlineFormatting = (str) => {
        if (!str) return '';
        let cleaned = str
          // Chemical formulas subscripts
          .replace(/CO_2/g, 'CO₂')
          .replace(/H_2O/g, 'H₂O')
          .replace(/\\\text\{([^}]+)\}/g, '$1') // '\text{CO}' -> 'CO'
          .replace(/(\s*)\^(\w+)/g, '<sup>$2</sup>') // superscript like ^+ or ^-
          .replace(/(\s*)\_(\w+)/g, '<sub>$2</sub>') // subscript like _2
          .replace(/\\longrightarrow/g, ' ⟶ ')
          .replace(/\\rightarrow/g, ' → ')
          .replace(/\$\+\/\+\$/g, '➕/➕ (Mutualism)')
          .replace(/\$\+\/0\$/g, '➕/🫙 (Commensalism)')
          .replace(/\$\+\/\-\$/g, '➕/➖ (Parasitism)')
          .replace(/\$/g, ''); // strip any raw dollar signs
          
        // Let's parse bold **bold** and italic *italic* using react elements
        const parts = [];
        let index = 0;
        const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g;
        let match;
        
        while ((match = regex.exec(cleaned)) !== null) {
          if (match.index > index) {
            parts.push(cleaned.substring(index, match.index));
          }
          if (match[1]) {
            parts.push(<strong key={match.index} className="font-extrabold text-[var(--accent-color)]">{match[2]}</strong>);
          } else if (match[3]) {
            parts.push(<em key={match.index} className="italic text-[var(--text-primary)]">{match[4]}</em>);
          }
          index = regex.lastIndex;
        }
        
        if (index < cleaned.length) {
          parts.push(cleaned.substring(index));
        }
        
        return parts.length > 0 ? parts : cleaned;
      };
      
      const formatEquationToHtml = (eq) => {
        let formatted = eq.trim();
        
        if (formatted.includes('Atom')) {
          return (
            <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2.5 text-xs text-[var(--text-primary)] font-mono tracking-tight py-2 w-full">
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Atom</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Molecule</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Organelle</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Cell</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Tissue</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Organ</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors">Organ System</span> 
              <span className="text-[var(--accent-color)] text-sm">⟶</span>
              <span className="font-extrabold text-[var(--accent-color)] bg-[var(--accent-color)]/15 px-3 py-1 rounded-xl border border-[var(--accent-color)] shadow-sm animate-pulse">Organism</span>
            </div>
          );
        }
        
        if (formatted.includes('Photosynthesis') || (formatted.includes('6CO') && formatted.includes('Solar'))) {
          return (
            <div className="text-center font-bold text-xs flex flex-wrap items-center justify-center gap-1.5 leading-relaxed py-2 select-text w-full">
              <span className="text-[var(--text-primary)] font-semibold">Carbon Dioxide</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6CO₂)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-[var(--text-primary)] font-semibold">Water</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6H₂O)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-yellow-500 font-semibold flex items-center gap-0.5 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20 text-[10px]"><span className="animate-pulse">☀️</span> Solar Light</span>
              <span className="text-[var(--accent-color)] text-sm mx-1">⟶</span>
              <span className="text-[var(--text-primary)] font-semibold">Glucose</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(C₆H₁₂O₆)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-[var(--text-primary)] font-semibold">Oxygen</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6O₂)</span>
            </div>
          );
        }
        
        if (formatted.includes('Respiration') || formatted.includes('ATP') || (formatted.includes('6CO') && formatted.includes('Oxygen'))) {
          return (
            <div className="text-center font-bold text-xs flex flex-wrap items-center justify-center gap-1.5 leading-relaxed py-2 select-text w-full">
              <span className="text-[var(--text-primary)] font-semibold">Glucose</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(C₆H₁₂O₆)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-[var(--text-primary)] font-semibold">Oxygen</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6O₂)</span>
              <span className="text-[var(--accent-color)] text-sm mx-1">⟶</span>
              <span className="text-[var(--text-primary)] font-semibold">Carbon Dioxide</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6CO₂)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-[var(--text-primary)] font-semibold">Water</span>
              <span className="text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded">(6H₂O)</span>
              <span className="text-[var(--accent-color)] mx-0.5 font-mono">+</span>
              <span className="text-emerald-500 font-bold flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px] animate-pulse">⚡ ATP Energy</span>
            </div>
          );
        }

        return <span>{formatted}</span>;
      };

      while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // 1. Equations (Centered math block)
        if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
          const content = trimmed.substring(2, trimmed.length - 2);
          elements.push(
            <div key={elementKey++} className="bg-[var(--bg-primary)] border border-[var(--accent-color)]/20 p-4 rounded-xl text-center my-4 shadow-sm text-[var(--accent-color)] flex items-center justify-center overflow-x-auto select-all">
              {formatEquationToHtml(content)}
            </div>
          );
          i++;
          continue;
        }
        
        // 2. Custom block code (e.g., Birthday card layout block)
        if (trimmed.startsWith('```') || trimmed.startsWith('`\\`\\`')) {
          let codeBlockLines = [];
          i++; // skip initial tag
          while (i < lines.length && !lines[i].trim().startsWith('```') && !lines[i].trim().startsWith('`\\`\\`')) {
            codeBlockLines.push(lines[i]);
            i++;
          }
          elements.push(
            <pre key={elementKey++} className="bg-black/40 border border-[var(--card-border)] p-4.5 rounded-xl text-[10.5px] font-mono text-[var(--text-primary)] whitespace-pre-wrap leading-normal shadow-inner my-3 select-all">
              {codeBlockLines.join('\n')}
            </pre>
          );
          i++; // skip final tag
          continue;
        }

        // 3. Simple blockquotes / horizontal separators
        if (trimmed.startsWith('---')) {
          elements.push(<hr key={elementKey++} className="border-t border-[var(--card-border)] my-5" />);
          i++;
          continue;
        }

        // 4. Tables parsing
        if (trimmed.startsWith('|')) {
          const headerRow = trimmed;
          let tableLines = [headerRow];
          i++;
          
          // Gather consecutive table rows
          while (i < lines.length && lines[i].trim().startsWith('|')) {
            tableLines.push(lines[i]);
            i++;
          }
          
          // Process Table Rows
          const filteredRows = tableLines.filter(r => !r.includes('| :---') && !r.includes('|---|') && !r.includes('| :--- |'));
          
          const parseColumns = (rowText) => {
            return rowText.split('|').slice(1, -1).map(col => col.trim());
          };

          if (filteredRows.length > 0) {
            const headers = parseColumns(filteredRows[0]);
            const bodyRows = filteredRows.slice(1).map(r => parseColumns(r));
            
            elements.push(
              <div key={elementKey++} className="my-4.5 overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--bg-primary)]/40 shadow-sm">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-[var(--bg-secondary)] border-b border-[var(--card-border)]">
                      {headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-3.5 font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider text-[9px] border-r border-[var(--card-border)] last:border-r-0">
                          {parseInlineFormatting(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b last:border-b-0 border-[var(--card-border)] hover:bg-[var(--accent-color)]/5 transition-colors duration-150 odd:bg-black/[0.02] even:bg-transparent">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 text-[var(--text-muted)] border-r border-[var(--card-border)] last:border-r-0 leading-relaxed font-sans font-medium">
                            {parseInlineFormatting(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          continue;
        }

        // 5. Headings (### H3)
        if (trimmed.startsWith('###')) {
          const hText = trimmed.replace(/^###\s*/, '');
          elements.push(
            <h4 key={elementKey++} className="text-xs font-bold font-mono tracking-tight text-[var(--text-primary)] border-l-2 border-[var(--accent-color)] pl-2.5 mt-5 mb-2 flex items-center gap-1.5 uppercase">
              {parseInlineFormatting(hText)}
            </h4>
          );
          i++;
          continue;
        }

        // 6. Bold Headers inside content e.g. "#### Header" or "**Header:**" or "Header:" followed by line bullet tags
        if (trimmed.startsWith('####')) {
          const hText = trimmed.replace(/^####\s*/, '');
          elements.push(
            <h5 key={elementKey++} className="text-[11px] font-extrabold font-mono tracking-tight text-[var(--text-primary)] mt-3 mb-1 text-[var(--accent-color)]">
              {parseInlineFormatting(hText)}
            </h5>
          );
          i++;
          continue;
        }

        // 7. Standard Lists starting with '*' or '-' or '●'
        if (trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('●') || trimmed.startsWith('○')) {
          let cleanItem = trimmed.replace(/^(\*|-|●|○)\s*/, '');
          // Identify if it's high indentation (sub-list)
          const isNested = line.startsWith('  ') || line.startsWith('\t') || trimmed.startsWith('○');
          elements.push(
            <div key={elementKey++} className={`flex items-start gap-2 text-[11px] text-[var(--text-muted)] leading-relaxed mb-1.5 ${isNested ? 'ml-6' : 'ml-2'}`}>
              <span className={`flex-shrink-0 text-[10px] mt-0.5 select-none ${isNested ? 'text-[var(--text-muted)]/50 font-mono' : 'text-[var(--accent-color)]'}`}>
                {isNested ? '○' : '◼'}
              </span>
              <span className="font-medium font-sans">{parseInlineFormatting(cleanItem)}</span>
            </div>
          );
          i++;
          continue;
        }

        // 8. Ordered Lists (e.g., 1. Item)
        if (trimmed.match(/^\d+\./)) {
          const itemNum = trimmed.match(/^(\d+)\./)[1];
          const cleanItem = trimmed.replace(/^\d+\.\s*/, '');
          elements.push(
            <div key={elementKey++} className="flex items-start gap-2.5 text-[11px] text-[var(--text-muted)] leading-relaxed ml-2 mb-1.5">
              <span className="font-mono text-[9px] font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-1.5 py-0.5 rounded border border-[var(--accent-color)]/20 flex-shrink-0 mt-0.5 min-w-[20px] text-center">
                {itemNum}
              </span>
              <span className="font-medium font-sans">{parseInlineFormatting(cleanItem)}</span>
            </div>
          );
          i++;
          continue;
        }

        // 9. Standard paragraphs
        if (trimmed === '') {
          elements.push(<div key={elementKey++} className="h-2" />);
        } else {
          elements.push(
            <p key={elementKey++} className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-3 font-medium font-sans">
              {parseInlineFormatting(trimmed)}
            </p>
          );
        }
        
        i++;
      }
      
      return <div className="space-y-1.5">{elements}</div>;
    };

    if (viewMode === 'articles') {
      const isPaywallActive = activeEduTab === 'removepaywall';
      return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col h-screen overflow-hidden transition-colors duration-300 relative select-text p-0">
          
          {/* Decoy Legitimate Educational Header */}
          <header className="w-full mx-auto flex flex-col lg:flex-row justify-between items-center border-b border-[var(--card-border)] gap-3 select-none max-w-none px-4 md:px-6 py-3 shrink-0">
            {/* HIGHLY ACCESSIBLE PRIMARY TAB SWITCHER */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--card-border)] p-1 shadow-sm select-none w-full max-w-sm sm:max-w-xl lg:max-w-none lg:w-auto rounded-2xl lg:rounded-full grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-1 shrink-0">
              {[
                { id: 'articles', label: 'Study Guides', icon: BookOpen },
                { id: 'online-articles', label: 'Wikipedia', icon: Compass },
                { id: 'notes', label: 'Note Taker', icon: FileText },
                { id: 'flashcards', label: 'Study Flashcards', icon: Layers },
                { id: 'quiz', label: 'Quizzes', icon: Gamepad2 },
                { id: 'removepaywall', label: 'Remove the paywall', icon: Globe }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = activeEduTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEduTab(tab.id)}
                    className={`px-3 py-1.5 text-xs font-semibold flex items-center justify-center lg:justify-start gap-1.5 transition-all cursor-pointer whitespace-nowrap rounded-xl lg:rounded-full w-full lg:w-auto ${
                      isSelected
                        ? 'bg-[var(--accent-color)] text-[var(--bg-color)] font-bold shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span className="leading-none">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5 self-stretch lg:self-auto justify-between sm:justify-end lg:ml-auto shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Study Timer Dropdown */}
                <StudyTimer />

                {/* Light/Dark Toggle */}
                <div className="flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] py-1.5 px-2.5 rounded-full shadow-sm">
                  <div 
                    onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                    className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300"
                  >
                    <div 
                      className={`w-5 h-5 rounded-full bg-[var(--accent-color)] transition-all flex items-center justify-center text-[10px] transform ${
                        mode === 'dark' ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    >
                      {mode === 'dark' ? '🌙' : '☀️'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top-Right Sign In Button */}
              <button
                type="button"
                onClick={() => openAccountModalOnTab('profile')}
                className={`px-3.5 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap ${
                  activeAccount || isOwnerAdmin
                    ? 'bg-[var(--accent-color)]/15 border-[var(--accent-color)]/50 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/25'
                    : 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] hover:opacity-90'
                }`}
                title={
                  isOwnerAdmin
                    ? 'Signed in as Owner Admin'
                    : activeAccount
                      ? `Signed in as @${activeAccount.username}`
                      : 'Sign in with your account info'
                }
              >
                {activeAccount || isOwnerAdmin ? <User className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                <span>
                  {isOwnerAdmin
                    ? 'Admin'
                    : activeAccount
                      ? `@${activeAccount.username}`
                      : 'Sign In'}
                </span>
              </button>
            </div>
          </header>

          {/* Educational Aspects Deprecation Notice */}
          <div className="w-full mx-auto px-4 md:px-6 py-2.5 bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-2 text-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>(SADLY WE DO NOT UPDATE THE EDUCATIONAL ASPECTS OF THIS WEBSITE ANYMORE. SOME FEATURES MIGHT HAVE BROKE!)</span>
          </div>

          {/* Education-page-only Lockdown Notification */}
          {workspaceConfig?.siteLockdown && (
            <div
              role="status"
              className="w-full mx-auto px-4 md:px-6 py-2.5 bg-rose-500/15 border-b border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs font-mono font-bold flex items-center justify-center gap-2 text-center shrink-0"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Sorry, the educational save feature is not available right now</span>
            </div>
          )}

          {/* GitHub Hosting Explanation Notification */}
          {showGithubNotice && (
            <div className="w-full mx-auto p-3.5 sm:p-4 bg-[var(--card-bg)] border-b border-[var(--card-border)] shadow-md relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left transition-all animate-in fade-in duration-300 max-w-none px-4 md:px-6 shrink-0 rounded-none">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 shrink-0 mt-0.5">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2 py-0.5 rounded border border-[var(--accent-color)]/20">
                      System Notice
                    </span>
                    <h3 className="text-xs font-bold text-[var(--text-primary)]">
                      Why We Use GitHub Pages for Academic Base
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                    Our Academic Base study modules, syllabus articles, and interactive tools are hosted on <strong>GitHub Pages</strong>. Using this free hosting platform allows us to give these resources to other students while providing reliable uptime, fast content delivery, transparent version control, and open-source accessibility.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <a
                  href="https://pages.github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[var(--bg-secondary)] hover:bg-[var(--accent-color)]/10 border border-[var(--card-border)] text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => {
                    setShowGithubNotice(false);
                    safeStorage.setItem('academic-github-notice-dismissed', 'true');
                  }}
                  className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--card-border)] transition-all cursor-pointer"
                  title="Dismiss Notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actual Articles Hub Grid (Occupies full-screen width) */}
          <div className="w-full transition-all flex flex-col flex-1 min-h-0 overflow-hidden max-w-none p-0 shadow-none rounded-none">
            
            {activeEduTab === 'articles' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0 overflow-hidden p-4 md:p-6">
                {/* Left Column - Articles selection */}
                <div className="md:col-span-2 flex flex-col gap-3 overflow-hidden h-full">
                  
                  {/* Subject Specific Sections */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none select-none">
                    {['All', 'Science', 'Mathematics', 'ELA', 'Social Studies', 'Italian'].map((cat) => {
                      const isSelected = selectedArticleCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedArticleCategory(cat);
                            const firstInCat = articles.find(art => cat === 'All' || art.category === cat);
                            if (firstInCat) {
                              setSelectedArticleId(firstInCat.id);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono border font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-98 ${
                            isSelected
                              ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--text-muted)]/50 hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative flex-shrink-0">
                    <input
                      type="text"
                      placeholder="Search curriculum papers..."
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                      className="w-full text-xs rounded-xl py-1.5 pl-8 pr-3 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder:opacity-50 transition-all font-mono"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
                  </div>

                  {/* Feed list */}
                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto py-0.5 scrollbar-thin">
                    {filteredArticles.length === 0 ? (
                      <div className="text-center py-4 text-xs text-[var(--text-muted)] font-mono select-none">
                        No matching resource files available
                      </div>
                    ) : (
                      filteredArticles.map((art) => {
                        const isSelected = art.id === selectedArticleId;
                        return (
                          <div
                            key={art.id}
                            onClick={() => setSelectedArticleId(art.id)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-sm scale-[1.01]'
                                : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-0.5 flex-wrap">
                              <span className="text-[8px] font-bold font-mono tracking-wider px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)] uppercase">
                                {art.category}
                              </span>
                              <span className="text-[8px] text-[var(--text-muted)] font-mono">
                                {art.readTime}
                              </span>
                            </div>
                            <h4 className="text-[11px] font-bold leading-snug text-[var(--text-primary)] line-clamp-1">
                              {art.title}
                            </h4>
                            <p className="text-[9px] text-[var(--text-muted)] mt-0.5 font-mono">
                              {art.date}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column - Deep Active Article view */}
                <div className="md:col-span-3 flex flex-col bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl overflow-hidden h-full">
                  {selectedArticle ? (
                    <div className="flex flex-col h-full overflow-hidden text-left justify-between">
                      
                      {/* Title Bar details */}
                      <div className="p-4 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex-shrink-0 flex justify-between items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--accent-color)] uppercase tracking-wider border border-[var(--card-border)]">
                              {selectedArticle.category}
                            </span>
                            <span className="text-[9px] text-[var(--text-muted)] font-mono bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--card-border)]">
                              {selectedArticle.readTime}
                            </span>
                          </div>
                          <h3 className="text-sm font-extrabold text-[var(--text-primary)] leading-snug line-clamp-1">
                            {selectedArticle.title}
                          </h3>
                        </div>

                        {/* Interactive prompt linkages */}
                        <div className="flex items-center gap-1.5 shrink-0 select-none">
                          <button
                            type="button"
                            onClick={() => setActiveEduTab('flashcards')}
                            className="bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] font-mono text-[9px] font-bold px-2 py-1.5 rounded-xl border border-[var(--accent-color)] flex items-center gap-1 transition-all cursor-pointer"
                            title="Interactive Flashcards deck for this syllabus article"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>STUDY TERMS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveEduTab('quiz')}
                            className="bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] font-mono text-[9px] font-bold px-2 py-1.5 rounded-xl border border-[var(--accent-color)] flex items-center gap-1 transition-all cursor-pointer"
                            title="Generate Quiz based on this syllabus"
                          >
                            <Gamepad2 className="w-3.5 h-3.5" />
                            <span>TAKE TEST</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-4 overflow-y-auto text-left flex-1 min-h-0 scrollbar-thin">
                        {renderFormattedText(selectedArticle.content)}
                      </div>

                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-[var(--text-muted)] font-mono">
                      Select a core paper assignment to read content
                    </div>
                  )}
                </div>

              </div>
            )}

            {activeEduTab === 'flashcards' && (
              <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden bg-[var(--bg-color)]">
                <FlashcardsWorkspace 
                  refArticle={selectedArticle} 
                  onGeneratedSuccess={(targetTab) => setActiveEduTab(targetTab)}
                  mode={mode}
                />
              </div>
            )}

            {activeEduTab === 'quiz' && (
              <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden bg-[var(--bg-color)]">
                <QuizWorkspace 
                  refArticle={selectedArticle} 
                  onGeneratedSuccess={(targetTab) => setActiveEduTab(targetTab)}
                  mode={mode}
                />
              </div>
            )}

            {activeEduTab === 'online-articles' && (
              <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden bg-white">
                <iframe 
                  src="https://en.wikipedia.org/wiki/Main_Page" 
                  className="absolute inset-0 w-full h-full border-none bg-white"
                  title="Wikipedia"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            )}

            {activeEduTab === 'notes' && (
              <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden bg-white">
                <NotesWorkspace />
              </div>
            )}

            {activeEduTab === 'removepaywall' && (
              <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden">
                <iframe 
                  src="https://www.removepaywall.com/" 
                  className="absolute inset-0 w-full h-full border-none"
                  title="RemovePaywall Tool"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

          </div>

          <AccountModal
            isOpen={accountModalOpen}
            onClose={() => {
              setAccountModalOpen(false);
              setAccountModalPrefillUser('');
            }}
            activeAccount={activeAccount}
            isOwnerAdmin={isOwnerAdmin}
            workspaceConfig={workspaceConfig}
            onLogin={handleAccountSignIn}
            onLogout={handleAccountSignOut}
            onEnterWorkspace={() => setViewModeAndSave('games')}
            onOpenAdmin={hasAdminAccess ? () => setAdminAccountsModalOpen(true) : null}
            mode={mode}
            signOutNotice={signOutNotice}
            isEducationPage={true}
            db={lobbyDb}
            auth={lobbyAuth}
            initialTab={accountModalInitialTab}
            prefillUsername={accountModalPrefillUser}
          />

          {hasAdminAccess && (
            <AdminAccountsModal
              isOpen={adminAccountsModalOpen}
              onClose={() => setAdminAccountsModalOpen(false)}
              db={lobbyDb}
              auth={lobbyAuth}
              mode={mode}
              activeAccount={activeAccount}
              workspaceConfig={workspaceConfig}
              games={games}
            />
          )}
        </div>
      );
    }

    return (
      <MotionConfig reducedMotion={animationsEnabled ? "never" : "always"}>
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col xl:flex-row items-center xl:items-center justify-center p-4 md:p-8 xl:p-12 gap-8 md:gap-10 transition-colors duration-350 relative select-none">
        
        {/* Floating Controls inside Lock Screen */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          
          {/* Theme Dropdown */}
          <ThemeDropdown
            theme={theme}
            setTheme={setTheme}
            mode={mode}
            lockedTheme={isThemeLockedToGirls ? 'girls' : null}
            onSelectTheme={handleUserThemeChange}
          />

          {/* Light/Dark Slider */}
          <div className="relative flex items-center gap-1.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] py-1.5 px-2.5 rounded-full shadow-sm">
            {isWhiteDecoy && (
              <button
                type="button"
                onClick={() => setShowGoGuardianNotice(prev => !prev)}
                className={`p-1 rounded-full text-amber-500 hover:scale-115 transition-all cursor-pointer ${
                  showGoGuardianNotice ? 'opacity-100 ring-2 ring-amber-500/40 bg-amber-500/10' : 'opacity-80 hover:opacity-100 animate-pulse'
                }`}
                title="GoGuardian Decoy Shield Notice (Click to open/close)"
              >
                <Shield className="w-3.5 h-3.5 fill-amber-500/20" />
              </button>
            )}

            <div 
              onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
              className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 select-none transition-all duration-300"
              title="Toggle Light/Dark Theme Mode"
            >
              <div 
                className={`w-5 h-5 rounded-full bg-[var(--accent-color)] shadow-md transition-all duration-350 ease-out flex items-center justify-center text-[10px] transform ${
                  mode === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {mode === 'dark' ? '🌙' : '☀️'}
              </div>
            </div>

            <AnimatePresence>
              {isWhiteDecoy && showGoGuardianNotice && (
                <GoGuardianDecoyNotice
                  mode={mode}
                  onToggleMode={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                  onClose={() => setShowGoGuardianNotice(false)}
                  decoyType={decoyType}
                  positionClass="absolute top-full right-0 mt-3 w-48 sm:w-56"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Lock Card Content Container */}
        <div className={`w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 flex flex-col items-center gap-6 flex-shrink-0 ${isShake ? 'animate-shake' : ''}`}>
          
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Portals Secured</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
              {lockAuthTab === 'account'
                ? 'Sign in with your assigned account username and unique password.'
                : 'This is a paid Science, Math, ELA, and Social Studies article website. Please enter a correct password to continue to the website.'}
            </p>
          </div>

          {workspaceConfig?.siteLockdown && (
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-300 text-xs font-semibold text-center leading-relaxed flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{workspaceConfig.lockdownMessage || 'Site temporarily restricted by admin. Only admin accounts or the owner password can sign in.'}</span>
            </div>
          )}

          {/* Auth Mode Switcher: Passcode vs Account Login */}
          <div className="w-full grid grid-cols-2 gap-1 p-1 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)]">
            <button
              type="button"
              onClick={() => {
                setLockAuthTab('passcode');
                setLockAccountError('');
              }}
              className={`py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                lockAuthTab === 'passcode'
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Passcode
            </button>
            <button
              type="button"
              onClick={() => {
                setLockAuthTab('account');
                setLockAccountError('');
              }}
              className={`py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                lockAuthTab === 'account'
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Account</span>
            </button>
          </div>

          {lockAuthTab === 'account' ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (lockAccountBusy) return;
                setLockAccountError('');
                let preOpenedWin = null;
                if (lockOpenInSeparateTab) {
                  try {
                    preOpenedWin = window.open('about:blank', '_blank');
                  } catch {}
                }
                setLockAccountBusy(true);
                try {
                  await handleAccountSignIn(lockUsername, lockPassword, {
                    openInSeparateTab: lockOpenInSeparateTab,
                    targetWindow: preOpenedWin,
                  });
                  setLockUsername('');
                  setLockPassword('');
                } catch (err) {
                  if (preOpenedWin && !preOpenedWin.closed) {
                    try {
                      preOpenedWin.close();
                    } catch {}
                  }
                  setIsShake(true);
                  setLockAccountError(err?.message || 'Invalid username or password.');
                  setTimeout(() => setIsShake(false), 500);
                } finally {
                  setLockAccountBusy(false);
                }
              }}
              className="w-full flex flex-col gap-3"
            >
              {signOutNotice && !lockAccountError && (
                <div className="px-3 py-2 rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-300 text-xs font-semibold text-center">
                  {signOutNotice}
                </div>
              )}
              {lockAccountError && (
                <div className="px-3 py-2 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-400 text-xs font-semibold text-center">
                  {lockAccountError}
                </div>
              )}
              {rememberedUsers.length > 0 && (
                <div className="p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] space-y-1.5">
                  <div className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
                    Saved locally to sign back in
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rememberedUsers.map((saved) => {
                      const isSel = lockUsername.trim().toLowerCase() === saved.usernameLower ||
                        (saved.isOwnerAdmin && lockUsername.trim().toLowerCase() === 'admin');
                      return (
                        <div
                          key={saved.usernameLower}
                          className={`inline-flex items-center rounded-lg border text-[11px] font-mono font-bold ${
                            isSel
                              ? 'bg-[var(--accent-color)]/20 border-[var(--accent-color)] text-[var(--accent-color)]'
                              : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-primary)]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setLockUsername(saved.username)}
                            className="px-2 py-1 cursor-pointer"
                          >
                            @{saved.username}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const next = removeRememberedLocalUser(saved.usernameLower);
                              setRememberedUsers(next);
                              if (isSel) setLockUsername(next[0]?.username || '');
                            }}
                            className="pr-1.5 py-1 opacity-60 hover:opacity-100 cursor-pointer"
                            title={`Forget @${saved.username}`}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <input
                type="text"
                required
                value={lockUsername}
                onChange={(e) => setLockUsername(e.target.value)}
                placeholder="Username"
                autoFocus={!lockUsername}
                className="w-full px-3.5 py-2.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
              />
              <input
                type="password"
                required
                value={lockPassword}
                onChange={(e) => setLockPassword(e.target.value)}
                placeholder="Unique password"
                className="w-full px-3.5 py-2.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-mono rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
              />
              <label className="block p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] cursor-pointer select-none">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <ExternalLink className="w-3 h-3 text-[var(--accent-color)]" />
                    <span>Open in a separate tab</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={lockOpenInSeparateTab}
                    onChange={(e) => setLockOpenInSeparateTab(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors flex items-center ${
                      lockOpenInSeparateTab ? 'bg-[var(--accent-color)]' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${
                        lockOpenInSeparateTab ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 leading-snug">
                  On by default to save information across sessions.
                </p>
              </label>
              <button
                type="submit"
                disabled={lockAccountBusy}
                className="w-full text-xs font-mono font-bold bg-[var(--accent-color)] text-[var(--bg-color)] py-2.5 rounded-xl hover:opacity-95 disabled:opacity-50 active:scale-98 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{lockAccountBusy ? 'SIGNING IN...' : 'SIGN IN WITH ACCOUNT'}</span>
              </button>
              <p className="text-[10.5px] text-center text-[var(--text-muted)] leading-relaxed">
                Accounts are created by the admin. Signing in syncs your bookmarks, theme, and Lobby Chat identity.
              </p>
            </form>
          ) : (
            <>
              <div className="w-full px-3 py-2 rounded-xl border border-amber-500/35 bg-amber-500/10 text-amber-300 text-[11px] font-semibold text-center leading-relaxed">
                Shared passcodes are disabled. Use Account Sign In or Owner Password.
              </div>

              {/* Alphanumeric Text/Passcode Input Field */}
              <div className="w-full flex flex-col gap-2.5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter password..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handlePasswordSubmit();
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-sm font-bold font-mono tracking-widest rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] placeholder:text-[10px] placeholder:font-sans placeholder:tracking-normal outline-none transition-all placeholder:opacity-60"
                    autoFocus
                  />
                  {passcode.length > 0 && (
                    <button 
                      type="button"
                      onClick={() => setPasscode('')}
                      className="absolute right-3.5 top-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold cursor-pointer"
                      title="Clear input"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => handlePasswordSubmit()}
                  className="w-full text-xs font-mono font-bold bg-[var(--accent-color)] text-[var(--bg-color)] py-2.5 rounded-xl hover:opacity-95 active:scale-98 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>SUBMIT PASSWORD</span>
                </button>
              </div>

              {/* Indicators for passcode digits */}
              {(!passcode || (!isNaN(passcode) && passcode.length <= 4)) && (
                <div className="flex justify-center gap-4 py-1">
                  {[0, 1, 2, 3].map((index) => {
                    const isFilled = passcode.length > index;
                    return (
                      <div 
                        key={index}
                        className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 transform ${
                          isFilled 
                            ? 'bg-[var(--accent-color)] border-[var(--accent-color)] scale-110 shadow-[0_0_8px_var(--accent-shadow)]' 
                            : 'border-[var(--card-border)] bg-[var(--bg-secondary)]'
                        }`}
                      />
                    );
                  })}
                </div>
              )}

              {/* Secure Pad Grid */}
              <div className="grid grid-cols-3 gap-3.5 w-full max-w-[245px] mt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                  <button
                    key={num}
                    onClick={() => handleDigitInput(num)}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] hover:border-[var(--accent-color)] active:scale-95 hover:scale-105 transition-all duration-150 cursor-pointer shadow-sm mx-auto"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPasscode('')}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--card-border)] hover:bg-[var(--bg-secondary)] active:scale-90 transition-all duration-150 cursor-pointer mx-auto"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleDigitInput('0')}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] hover:border-[var(--accent-color)] active:scale-95 hover:scale-105 transition-all duration-150 cursor-pointer shadow-sm mx-auto"
                >
                  0
                </button>
                <button
                  onClick={() => setPasscode(prev => prev.slice(0, -1))}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--card-border)] hover:bg-[var(--bg-secondary)] active:scale-90 transition-all duration-150 cursor-pointer mx-auto"
                >
                  Del
                </button>
              </div>

              {errorCount > 0 && (
                <span className="text-[10.5px] text-red-500 font-medium font-mono animate-bounce mt-1">
                  Access Denied! Attempt #{errorCount}
                </span>
              )}
            </>
          )}

        </div>

        {/* ==================== ARTICLES SECTION ==================== */}
        <div className="w-full max-w-4xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 md:p-6 shadow-2xl transition-all duration-300 flex flex-col gap-4 select-text max-h-[90vh] md:h-[600px] overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--card-border)]">
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                <img src="https://ssl.gstatic.com/classroom/favicon.png" className="w-5 h-5 object-contain" alt="Classroom Logo" referrerPolicy="no-referrer" />
                Examples of some articles
              </h3>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto uppercase tracking-wider text-[10px] font-mono bg-[var(--bg-secondary)] py-1 px-2 rounded-md border border-[var(--card-border)] text-[var(--accent-color)]">
              <span>Educational examples</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0 overflow-hidden">
            {/* Left lists & creator pane (cols 2) */}
            <div className="md:col-span-2 flex flex-col gap-3 overflow-hidden h-full">
              
              {/* Subject Specific Sections */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none select-none">
                {['All', 'Science', 'Mathematics', 'ELA', 'Social Studies', 'Italian'].map((cat) => {
                  const isSelected = selectedArticleCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedArticleCategory(cat);
                        const firstInCat = articles.find(art => cat === 'All' || art.category === cat);
                        if (firstInCat) {
                          setSelectedArticleId(firstInCat.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-mono border font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-98 ${
                        isSelected
                          ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--text-muted)]/50 hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Internal search inside articles */}
              <div className="relative flex-shrink-0">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full text-xs rounded-xl py-1.5 pl-8 pr-3 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder:opacity-50 transition-all font-mono"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
              </div>

              {/* Feed items */}
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto py-0.5 scrollbar-thin">
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-4 text-xs text-[var(--text-muted)] font-mono">
                    No articles found matching query
                  </div>
                ) : (
                  filteredArticles.map((art) => {
                    const isSelected = art.id === selectedArticleId;
                    return (
                      <div
                        key={art.id}
                        onClick={() => setSelectedArticleId(art.id)}
                        className={`p-2 md:p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-sm scale-[1.01]'
                            : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5 flex-wrap">
                          <span className="text-[8px] font-bold font-mono tracking-wider px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)] uppercase">
                            {art.category}
                          </span>
                          <span className="text-[8px] text-[var(--text-muted)] font-mono">
                            {art.readTime}
                          </span>
                        </div>
                        <h4 className="text-[11px] font-bold leading-snug text-[var(--text-primary)] line-clamp-1">
                          {art.title}
                        </h4>
                        <p className="text-[9px] text-[var(--text-muted)] mt-0.5 font-mono">
                          {art.date}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

            {/* Right expanded active details reader card (cols 3) */}
            <div className="md:col-span-3 flex flex-col bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl overflow-hidden h-[300px] md:h-full">
              {selectedArticle ? (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Article banner */}
                  <div className="p-4 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex-shrink-0">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--accent-color)] uppercase tracking-wider border border-[var(--card-border)]">
                        {selectedArticle.category}
                      </span>
                      <span className="text-[9px] text-[var(--text-muted)] font-mono bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--card-border)]">
                        {selectedArticle.readTime}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-[var(--text-primary)] leading-snug">
                      {selectedArticle.title}
                    </h3>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                      {selectedArticle.subtitle} • {selectedArticle.date}
                    </p>
                  </div>

                  {/* Article body */}
                  <div className="p-4 overflow-y-auto text-left flex-1 min-h-0 scrollbar-thin">
                    {renderFormattedText(selectedArticle.content)}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[var(--text-muted)] font-mono">
                  Select an article to begin reading
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="w-full text-center py-2 text-[11px] text-[var(--text-muted)] font-mono select-none">
          © {new Date().getFullYear()} Urnperiodic
        </div>

      </div>
      </MotionConfig>
    );
  }

  const renderSystemSettingsPopover = (isAltBar = false) => {
    if (!isGlobalSettingsOpen) return null;
    const isLight = mode === 'light';

    return (
      <>
        {/* Backdrop for click outside */}
        <div
          className="fixed inset-0 z-[99998] cursor-default"
          onClick={() => setIsGlobalSettingsOpen(false)}
        />
        <div
          className={`absolute top-full right-0 mt-2 w-80 max-h-[85vh] overflow-y-auto rounded-2xl p-4 shadow-2xl z-[99999] select-none text-left animate-fade-in no-scrollbar transition-colors ${
            isLight
              ? 'bg-white border-2 border-neutral-200/90 text-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.18)]'
              : 'bg-[#12111c] border-2 border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl'
          }`}
        >
          {/* Pointer arrow pointing UP to gear */}
          <div
            className={`absolute -top-2 right-3 w-3.5 h-3.5 border-t-2 border-l-2 transform rotate-45 ${
              isLight
                ? 'bg-white border-neutral-200/90'
                : 'bg-[#12111c] border-white/15'
            }`}
          />

          <div className="flex flex-col gap-3.5">
            {/* Header */}
            <div className={`flex items-center justify-between pb-2.5 border-b ${
              isLight ? 'border-neutral-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-md ${
                  isLight ? 'bg-neutral-100 text-neutral-800' : 'bg-white/10 text-neutral-200'
                }`}>
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-wider font-mono ${
                  isLight ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  System Settings
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsGlobalSettingsOpen(false)}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  isLight
                    ? 'text-neutral-500 hover:text-black hover:bg-neutral-100'
                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title="Close Settings"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle 1: Sign Out On Close */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className={`text-xs font-bold leading-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  Sign Out On Close
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoLockOnClose}
                  onClick={() => {
                    const newVal = !autoLockOnClose;
                    setAutoLockOnClose(newVal);
                    safeStorage.setItem('unblocked-auto-lock-on-close', String(newVal));
                  }}
                  className={`relative w-12 h-6.5 rounded-full cursor-pointer flex items-center p-0.5 transition-colors duration-200 shrink-0 border-2 ${
                    autoLockOnClose
                      ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                      : isLight
                        ? 'bg-neutral-200 border-neutral-300'
                        : 'bg-neutral-800 border-neutral-700'
                  }`}
                  title="Toggle Sign Out On Close"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out transform ${
                      autoLockOnClose ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className={`text-[11px] leading-snug ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                Automatically sign out &amp; lock workspace when tab or window is closed.
              </p>
            </div>

            {/* Toggle 1b: Auto Sign Out After 1h Idle */}
            <div className={`flex flex-col gap-1.5 pt-2.5 border-t ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-xs font-bold leading-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  Auto Sign Out (1h Idle)
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoSignOutOnIdle}
                  onClick={() => {
                    const newVal = !autoSignOutOnIdle;
                    if (newVal) {
                      touchSessionActivity(true);
                    }
                    setAutoSignOutOnIdle(newVal);
                    safeStorage.setItem(AUTO_SIGNOUT_IDLE_KEY, String(newVal));
                  }}
                  className={`relative w-12 h-6.5 rounded-full cursor-pointer flex items-center p-0.5 transition-colors duration-200 shrink-0 border-2 ${
                    autoSignOutOnIdle
                      ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                      : isLight
                        ? 'bg-neutral-200 border-neutral-300'
                        : 'bg-neutral-800 border-neutral-700'
                  }`}
                  title="Toggle 1-Hour Inactivity Auto Sign Out"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out transform ${
                      autoSignOutOnIdle ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className={`text-[11px] leading-snug ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                Automatically sign out after 1 hour with no activity. Turn off to stay signed in.
              </p>
            </div>

            {/* Toggle 2: Emergency Panic Keys */}
            <div className={`flex flex-col gap-1.5 pt-2.5 border-t ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-xs font-bold leading-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  Emergency Panic Keys
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={panicKeysEnabled}
                  onClick={() => {
                    const newVal = !panicKeysEnabled;
                    setPanicKeysEnabled(newVal);
                    safeStorage.setItem('unblocked-panic-keys-enabled', String(newVal));
                  }}
                  className={`relative w-12 h-6.5 rounded-full cursor-pointer flex items-center p-0.5 transition-colors duration-200 shrink-0 border-2 ${
                    panicKeysEnabled
                      ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                      : isLight
                        ? 'bg-neutral-200 border-neutral-300'
                        : 'bg-neutral-800 border-neutral-700'
                  }`}
                  title="Toggle Emergency Panic Keys"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out transform ${
                      panicKeysEnabled ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className={`text-[11px] leading-snug ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                Enable emergency exit keys (<code className={`font-mono px-1 py-0.5 rounded text-[10px] font-semibold ${isLight ? 'bg-neutral-200 text-neutral-800' : 'bg-white/10 text-neutral-200 border border-white/10'}`}>[</code>, <code className={`font-mono px-1 py-0.5 rounded text-[10px] font-semibold ${isLight ? 'bg-neutral-200 text-neutral-800' : 'bg-white/10 text-neutral-200 border border-white/10'}`}>]</code>, <code className={`font-mono px-1 py-0.5 rounded text-[10px] font-semibold ${isLight ? 'bg-neutral-200 text-neutral-800' : 'bg-white/10 text-neutral-200 border border-white/10'}`}>`</code>, <code className={`font-mono px-1 py-0.5 rounded text-[10px] font-semibold ${isLight ? 'bg-neutral-200 text-neutral-800' : 'bg-white/10 text-neutral-200 border border-white/10'}`}>\</code>, Double Escape).
              </p>
            </div>

            {/* Toggle 3: Auto Hide Header */}
            <div className={`flex flex-col gap-1.5 pt-2.5 border-t ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-xs font-bold leading-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  Auto Hide Header
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoHideHeader}
                  onClick={() => {
                    const newVal = !autoHideHeader;
                    setAutoHideHeader(newVal);
                    safeStorage.setItem('unblocked-auto-hide-header', String(newVal));
                  }}
                  className={`relative w-12 h-6.5 rounded-full cursor-pointer flex items-center p-0.5 transition-colors duration-200 shrink-0 border-2 ${
                    autoHideHeader
                      ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                      : isLight
                        ? 'bg-neutral-200 border-neutral-300'
                        : 'bg-neutral-800 border-neutral-700'
                  }`}
                  title="Toggle Auto Hide Header"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out transform ${
                      autoHideHeader ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className={`text-[11px] leading-snug ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                Automatically hide header when launching a portal.
              </p>
            </div>

            {/* Toggle 4: History Masking */}
            <div className={`flex flex-col gap-1.5 pt-2.5 border-t ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-xs font-bold leading-tight flex items-center gap-1.5 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  <History className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
                  History Masking
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={historyMaskingEnabled}
                  onClick={() => {
                    const newVal = !historyMaskingEnabled;
                    setHistoryMaskingEnabled(newVal);
                    safeStorage.setItem('unblocked-history-masking', String(newVal));
                    if (newVal && typeof window !== 'undefined') {
                      try {
                        window.history.replaceState({ disguise: 'educational_workspace' }, document.title, window.location.pathname || '/');
                      } catch (e) {}
                    }
                  }}
                  className={`relative w-12 h-6.5 rounded-full cursor-pointer flex items-center p-0.5 transition-colors duration-200 shrink-0 border-2 ${
                    historyMaskingEnabled
                      ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                      : isLight
                        ? 'bg-neutral-200 border-neutral-300'
                        : 'bg-neutral-800 border-neutral-700'
                  }`}
                  title="Toggle Browser History Masking (replaceState)"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out transform ${
                      historyMaskingEnabled ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className={`text-[11px] leading-snug ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                Prevents portal titles and sub-paths from accumulating in browser history via{' '}
                <code className={`font-mono px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                  isLight
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  history.replaceState()
                </code>.
              </p>
            </div>

            {/* Action Buttons: Information & Docs + Download Website */}
            <div className={`pt-2.5 border-t flex flex-col gap-2 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <button
                type="button"
                onClick={() => {
                  setFilter('info');
                  setSelectedGame(null);
                  setGameHeaderHidden(false);
                  setIsGlobalSettingsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer group active:scale-98 shadow-sm ${
                  isLight
                    ? 'bg-neutral-100 hover:bg-neutral-200/80 border-neutral-200 text-neutral-900'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                }`}
                title="View Information & Docs"
              >
                <span className="flex items-center gap-2">
                  <div className={`p-1 rounded-lg ${
                    isLight ? 'bg-sky-100 text-sky-700' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }`}>
                    <Info className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  </div>
                  <span>Information & Docs</span>
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                  isLight ? 'text-neutral-500' : 'text-neutral-400'
                }`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowWhatsNewModal(true);
                  setHasUnreadWhatsNew(false);
                  setIsGlobalSettingsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer group active:scale-98 shadow-sm ${
                  isLight
                    ? 'bg-neutral-100 hover:bg-neutral-200/80 border-neutral-200 text-neutral-900'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                }`}
                title="View What's New & Recent Changes"
              >
                <span className="flex items-center gap-2">
                  <div className={`p-1 rounded-lg ${
                    isLight ? 'bg-violet-100 text-violet-700' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  </div>
                  <span>What's New</span>
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                  isLight ? 'text-neutral-500' : 'text-neutral-400'
                }`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  openAccountModalOnTab('profile');
                  setIsGlobalSettingsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer group active:scale-98 shadow-sm ${
                  isLight
                    ? 'bg-neutral-100 hover:bg-neutral-200/80 border-neutral-200 text-neutral-900'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                }`}
                title={activeAccount ? `Signed in as @${activeAccount.username}` : 'Sign in to an assigned account'}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <div className={`p-1 rounded-lg ${
                    isLight ? 'bg-cyan-100 text-cyan-700' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    <User className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <span className="truncate">
                    {activeAccount ? `@${activeAccount.username} (Account)` : 'Account Sign In'}
                  </span>
                </span>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                  isLight ? 'text-neutral-500' : 'text-neutral-400'
                }`} />
              </button>

              {hasAdminAccess && (
                <button
                  type="button"
                  onClick={() => {
                    setAdminAccountsModalOpen(true);
                    setIsGlobalSettingsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer group active:scale-98 shadow-sm ${
                    isLight
                      ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                      : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/35 text-amber-300'
                  }`}
                  title="Manage user accounts, passwords, chat moderation, and permissions"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <div className={`p-1 rounded-lg ${
                      isLight ? 'bg-amber-200 text-amber-800' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      <Users className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <span className="truncate">Manage Accounts (Admin)</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    isLight ? 'text-amber-700' : 'text-amber-300'
                  }`} />
                </button>
              )}

              {canDownloadAccess && (
                <button
                  type="button"
                  onClick={() => {
                    downloadEntireWebsite();
                    setIsGlobalSettingsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer group active:scale-98 shadow-sm ${
                    isLight
                      ? 'bg-neutral-100 hover:bg-neutral-200/80 border-neutral-200 text-neutral-900'
                      : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                  }`}
                  title="Download Website"
                >
                  <span className="flex items-center gap-2">
                    <div className={`p-1 rounded-lg ${
                      isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    </div>
                    <span>Download Website</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                    isLight ? 'text-neutral-500' : 'text-neutral-400'
                  }`} />
                </button>
              )}

              {/* Admin Delete All Button & Password Prompt at the bottom */}
              <div className={`pt-2 mt-1 border-t flex flex-col gap-2 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminDeletePrompt((prev) => !prev);
                    setAdminDeleteStatus('');
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer group active:scale-98 shadow-sm ${
                    isLight
                      ? 'bg-rose-50 hover:bg-rose-100/80 border-rose-200 text-rose-700'
                      : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400'
                  }`}
                  title={hasAdminAccess ? 'Admin: Delete All Chat Messages' : 'Admin: Delete All Messages (Password required)'}
                >
                  <span className="flex items-center gap-2">
                    <div className={`p-1 rounded-lg ${
                      isLight ? 'bg-rose-100 text-rose-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    </div>
                    <span>Delete All (Admin)</span>
                  </span>
                  {hasAdminAccess ? (
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 opacity-70" />
                  )}
                </button>

                {showAdminDeletePrompt && (
                  <form onSubmit={handleAdminDeleteAll} className="flex flex-col gap-1.5 pt-1 animate-fade-in">
                    {hasAdminAccess ? (
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-[10px] font-mono ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          Admin verified — permanently delete all Lobby Chat messages across all rooms?
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="submit"
                            disabled={isDeletingAll}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                          >
                            {isDeletingAll ? 'Deleting...' : 'Confirm Delete All'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAdminDeletePrompt(false);
                              setAdminDeleteStatus('');
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer ${
                              isLight ? 'bg-neutral-200 text-neutral-700' : 'bg-white/10 text-neutral-300'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="password"
                          value={adminDeletePassword}
                          onChange={(e) => {
                            setAdminDeletePassword(e.target.value);
                            if (adminDeleteStatus) setAdminDeleteStatus('');
                          }}
                          placeholder="Admin password..."
                          className={`flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border text-xs font-mono outline-none transition-all ${
                            isLight
                              ? 'bg-white border-neutral-300 text-neutral-900 focus:border-rose-500'
                              : 'bg-black/40 border-white/15 text-white focus:border-rose-500'
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={isDeletingAll}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm"
                        >
                          {isDeletingAll ? '...' : 'Confirm'}
                        </button>
                      </div>
                    )}
                    {adminDeleteStatus && (
                      <span className={`text-[10px] font-mono font-bold ${
                        adminDeleteStatus.startsWith('Deleted') ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {adminDeleteStatus}
                      </span>
                    )}
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </>
    );
  };

  const shouldBeLockedToArticles =
    !hasAdminAccess &&
    (Boolean(workspaceConfig?.siteLockdown) || (accountSessionChecked && !activeAccount));

  if (!hasAdminAccess && (!workspaceConfigLoaded || !accountSessionChecked || shouldBeLockedToArticles)) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 gap-3 select-none">
        <div className="w-11 h-11 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--accent-color)] shadow-sm">
          <Lock className="w-5 h-5 animate-pulse" />
        </div>
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Checking workspace access...
        </p>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "never" : "always"}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-muted)] text-sm">Loading workspace...</div>}>
        <div className={`flex flex-col transition-colors duration-300 relative overflow-x-clip ${viewMode === 'games' ? 'games-no-select select-none' : ''} ${
          selectedGame || (adminAccountsModalOpen && hasAdminAccess) || isPortalWorkspaceFilter(filter) || filter === 'info'
            ? 'h-[100dvh] max-h-[100dvh] overflow-hidden'
            : 'min-h-screen'
        }`}>
      <CursorSpotlight active={viewMode === 'games' && animationsEnabled} />
      <GirlsThemeDecorations
        active={
          theme === 'girls' &&
          viewMode === 'games' &&
          !selectedGame &&
          !(adminAccountsModalOpen && hasAdminAccess) &&
          !isPortalWorkspaceFilter(filter)
        }
        mode={mode}
        animationsEnabled={animationsEnabled}
      />
      {/* HEADER */}
      <AnimatePresence initial={false}>
        {((!gameHeaderHidden || !selectedGame) || (adminAccountsModalOpen && hasAdminAccess) || isPortalWorkspaceFilter(filter) || filter === 'info') && (
          <motion.header
            key="main-header"
            initial={animationsEnabled ? { height: 0, opacity: 0, overflow: "hidden" } : false}
            animate={animationsEnabled ? { height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } } : { height: "auto", opacity: 1 }}
            exit={animationsEnabled ? { height: 0, opacity: 0, overflow: "hidden" } : undefined}
            transition={animationsEnabled ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
            className="border-b border-[var(--card-border)] bg-[var(--header-bg)] shadow-sm sticky top-0 z-[5000] transition-colors duration-300 w-full"
          >
            {headerOpen ? (
              <div className="py-2 px-3 md:px-5 flex flex-col sm:flex-row justify-between items-center gap-2.5 transition-colors duration-300">
        
        {/* Left Side: Logo & Title */}
        <div 
          onClick={() => { setFilter('all'); setSelectedGame(null); setAdminAccountsModalOpen(false); setSearchQuery(''); }}
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
          title="Go to homepage"
        >
          <div className="p-1.5 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-lg border border-[var(--card-border)] shadow-md group-hover:rotate-12 transition-all duration-300 transform flex items-center justify-center shrink-0">
            <School className="w-4 h-4" />
          </div>
          <div className="flex flex-row items-baseline gap-2 flex-wrap">
            <h1 className="font-extrabold tracking-tight text-[var(--text-primary)] leading-none group-hover:text-[var(--accent-color)] transition-colors text-left" style={{ fontSize: '12px', textAlign: 'left' }}>
              StudyTools Portals
            </h1>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 flex-1 min-w-0 justify-between">
          
          {/* Workspaces & Icons Group (moves left for extra space) */}
          <div className="flex flex-wrap items-center gap-1.5 shrink min-w-0 justify-start">
            {/* Movies Button */}
            {canMoviesAccess && (
              <motion.button
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                onClick={() => { setFilter(filter === 'movies' ? 'all' : 'movies'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                className={`relative px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 ${
                  filter === 'movies' && !adminAccountsModalOpen
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
                }`}
                title="Movies Workspace"
              >
                <Tv className="w-3.5 h-3.5" />
                <span style={{ fontSize: '9px', lineHeight: '18px', textAlign: 'center', fontStyle: 'normal', fontWeight: 'normal', fontFamily: 'Inter' }}>movies</span>
              </motion.button>
            )}

            {/* More Movies Button */}
            {canMoreMoviesAccess && (
              <motion.button
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                onClick={() => { setFilter(filter === 'moremovies' ? 'all' : 'moremovies'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                className={`relative px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 ${
                  filter === 'moremovies' && !adminAccountsModalOpen
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
                }`}
                title="More Movies (Atlantic.st)"
              >
                <Film className="w-3.5 h-3.5" />
                <span style={{ fontSize: '9px', lineHeight: '18px', textAlign: 'center', fontStyle: 'normal', fontWeight: 'normal', fontFamily: 'Inter' }}>more movies</span>
              </motion.button>
            )}

            {/* Lobby Chat Button */}
            {canLobbyChatAccess && (
              <motion.button
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                onClick={() => { setFilter(filter === 'lobbychat' ? 'all' : 'lobbychat'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                className={`relative px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 ${
                  filter === 'lobbychat'
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)] font-bold'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
                }`}
                title="Lobby Chat"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <LobbyUnreadIndicator visible={hasUnreadLobby} />
                <span>Lobby Chat</span>
              </motion.button>
            )}

            {!selectedGame && renderChatHeaderNotice('expanded')}

            {/* YouTube Workspace Button */}
            {canYoutubeAccess && (
              <motion.button
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                onClick={() => { setFilter(filter === 'youtube' ? 'all' : 'youtube'); setSelectedGame(null); }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 ${
                  filter === 'youtube'
                    ? 'bg-red-600 text-white border-red-600 shadow-[0_2px_8px_rgba(220,38,38,0.5)] font-bold'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-red-500/50 hover:text-red-500'
                }`}
                title="YouTube Workspace"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" fill={filter === 'youtube' ? "#FFFFFF" : "#FF0000"} />
                  <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill={filter === 'youtube' ? "#FF0000" : "#FFFFFF"} />
                </svg>
                <span>YouTube</span>
              </motion.button>
            )}

            {/* Decoy Selector */}
            <div className="flex items-center gap-1.5">
              {isDecoysUnlocked && (
                <>
                  <DecoyDropdown 
                    value={decoyType} 
                    onChange={(val) => { if (isDecoysUnlocked || val === 'classroom') setDecoyType(val); }} 
                    mode={mode} 
                    customTitles={customDecoyTitles} 
                    onCustomTitleChange={handleCustomTitleChange}
                    isUnlocked={isDecoysUnlocked}
                    onRequestUnlock={() => { setAccountModalOpen(true); setIsGlobalSettingsOpen(false); }}
                  />

                  <AutoRandomizeDecoyButton
                    autoRandomize={autoRandomizeDecoy}
                    setAutoRandomize={setAutoRandomizeDecoy}
                    interval={randomizeInterval}
                    setInterval={updateRandomizeInterval}
                    pool={randomizePool}
                    togglePoolItem={toggleDecoyInPool}
                    selectAllPool={selectAllDecoys}
                    countdown={randomizeCountdown}
                    onRandomizeNow={triggerManualRandomize}
                    currentDecoy={decoyType}
                    mode={mode}
                    isUnlocked={isDecoysUnlocked}
                    onRequestUnlock={() => { setAccountModalOpen(true); setIsGlobalSettingsOpen(false); }}
                  />
                </>
              )}

              {/* Cloak / About:blank Button (to the right of shuffle button) */}
              <motion.button
                whileHover={animationsEnabled && filter !== 'chat' ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled && filter !== 'chat' ? { scale: 0.95 } : undefined}
                onClick={() => { if (filter !== 'chat') openWorkspaceInAboutBlank(filter); }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                  filter !== 'chat'
                    ? 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] hover:border-[var(--accent-color)] cursor-pointer'
                    : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                }`}
                title={getWorkspaceAboutBlankTitle(filter)}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Cloak</span>
              </motion.button>

              {!isInAboutBlank && !aboutBlankNoticeDismissed && !pendingAboutBlankLaunch && (
                <div className="relative" ref={headerOpen ? aboutBlankNoticeRef : undefined}>
                  <button
                    type="button"
                    onClick={() => setAboutBlankNoticeOpen((prev) => !prev)}
                    className={`relative p-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                      mode === 'light'
                        ? 'border-amber-500/80 bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'border-amber-400/60 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
                    }`}
                    title="Not on about:blank — click to open or dismiss"
                    aria-label="Not on about:blank"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-[var(--bg-secondary)]" />
                  </button>
                  {aboutBlankNoticeOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-amber-500/60 bg-[var(--card-bg)] text-[var(--text-primary)] shadow-2xl p-3 z-[99999] text-left">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                          <span>Not on about:blank</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAboutBlankNoticeOpen(false);
                            setAboutBlankNoticeDismissed(true);
                          }}
                          className="p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                          title="Dismiss notice"
                          aria-label="Dismiss about:blank notice"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10.5px] text-[var(--text-muted)] leading-snug mb-2.5">
                        {aboutBlankNoticePopupBlocked
                          ? 'Popup blocked — allow popups in your browser, then click Open.'
                          : 'Your tab URL is visible. Open in about:blank to cloak your tab.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const opened = openWorkspaceInAboutBlank(filter === 'chat' ? 'all' : filter);
                          if (opened) {
                            setViewMode('articles');
                            setAboutBlankNoticeOpen(false);
                            setAboutBlankNoticeDismissed(true);
                            setAboutBlankNoticePopupBlocked(false);
                          } else {
                            setAboutBlankNoticePopupBlocked(true);
                          }
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                      >
                        Open about:blank
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Built-in Refresh Page Button */}
              <motion.button
                whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
                onClick={handleRefreshPage}
                className="px-3 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                title="Refresh Page (Safe reload for about:blank cloaking)"
                aria-label="Refresh Page"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-[var(--accent-color)] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>

              {/* Open Link Button */}
              {(() => {
                const url = getWorkspaceExternalUrl(filter, window.location.origin);
                const hasUrl = !!url;
                return (
                  <motion.button
                    whileHover={animationsEnabled && hasUrl ? { scale: 1.05 } : undefined}
                    whileTap={animationsEnabled && hasUrl ? { scale: 0.95 } : undefined}
                    onClick={() => { if (hasUrl) window.open(url, '_blank'); }}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                      hasUrl 
                        ? 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0)] hover:shadow-[0_0_8px_var(--accent-color)]'
                        : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                    }`}
                    title={filter === 'chat' ? "Direct link disabled for AI Chat" : (hasUrl ? "Open Workspace in new tab" : "No external link available")}
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <span>Open Link</span>
                  </motion.button>
                );
              })()}
            </div>

            {/* Quick Exit & Open Separately buttons for Workspaces (Sticky) */}
            <AnimatePresence>
              {(isPortalWorkspaceFilter(filter) || (adminAccountsModalOpen && hasAdminAccess)) && (
                <motion.div 
                  key="workspace-actions-sticky"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex items-center gap-1.5 pl-2 ml-1 border-l border-[var(--card-border)]/50 whitespace-nowrap"
                >
                  <button
                    onClick={() => { setFilter('all'); setAdminAccountsModalOpen(false); }}
                    className="p-1.5 rounded-lg border border-rose-500/40 hover:border-rose-500 bg-rose-500/10 text-rose-500 hover:text-white hover:bg-rose-500 transition-all cursor-pointer flex items-center justify-center shrink-0 group"
                    title="Close Workspace"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
      ) : (
        <div 
          ref={compactHeaderRef}
          className="relative py-1.5 px-3 md:px-4 flex items-center justify-between gap-2 md:gap-3 w-full transition-colors duration-300 min-h-[42px] overflow-visible"
        >
          
          {/* Left: Logo & Title + Search Bar */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 z-10">
            <div 
              ref={compactLeftRef}
              onClick={() => { setFilter('all'); setSelectedGame(null); setAdminAccountsModalOpen(false); setSearchQuery(''); }}
              className="flex items-center gap-2 cursor-pointer select-none group shrink-0 justify-start"
              title="Go to homepage"
            >
              <div className="p-1 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-md border border-[var(--card-border)] shadow-sm group-hover:rotate-12 transition-all duration-300 transform flex items-center justify-center shrink-0">
                <School className="w-3.5 h-3.5" style={{ fontFamily: 'Verdana', fontWeight: 'normal' }} />
              </div>
              <div className="flex flex-col items-start justify-center">
                <span className="text-left whitespace-nowrap flex flex-col justify-center select-none">
                  <span 
                    className="text-[8px] leading-[11px] tracking-tight flex items-center gap-1 transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <span className="text-[var(--text-muted)] font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 'bold' }}>Leadcreator:</span>
                    <span className="font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Urnperiodic</span>
                  </span>
                  <span 
                    className="text-[8px] leading-[11px] tracking-tight flex items-center gap-1 transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <span className="text-[var(--text-muted)] font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 'bold' }}>Cocreator:</span>
                    <span className="font-bold text-[var(--accent-color)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>SharpRLBS</span>
                  </span>
                </span>
              </div>
            </div>

            {/* Compact Search Bar next to Name */}
            <div className="relative flex items-center w-20 sm:w-24 md:w-28 shrink-0 transition-all duration-200">
              <Search className="absolute left-1.5 w-2.5 h-2.5 text-[var(--accent-color)] pointer-events-none shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchQuery('');
                  }
                }}
                className="w-full h-5 bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-color)]/50 focus:border-[var(--accent-color)] text-[var(--text-primary)] text-[10px] rounded-md pl-5 pr-5 py-0 outline-none shadow-sm transition-all duration-200 placeholder:text-[var(--text-muted)]/60 min-w-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0"
                  title="Clear search"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>

          {/* Center: Quick Sections & Navigation (fluid center without absolute clipping) */}
          <div 
            ref={compactCenterRef}
            className="flex items-center justify-center gap-1.5 min-w-0 shrink mx-auto z-10"
          >
            {/* Quick Sections with backgrounds for mobile/tablet wrapped cleanly */}
            <div className="flex md:hidden items-center gap-1 bg-[var(--bg-secondary)] border border-[var(--card-border)]/50 p-0.5 rounded-lg shadow-sm shrink-0">
              {canMoviesAccess && (
                <button
                  onClick={() => { setFilter(filter === 'movies' ? 'all' : 'movies'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                  className={`relative p-1 rounded-md text-xs transition-all duration-200 ${
                    filter === 'movies' && !adminAccountsModalOpen
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_1px_5px_var(--accent-shadow)] font-bold'
                      : 'bg-transparent text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                  }`}
                  title="Movies"
                >
                  <Tv className="w-3.5 h-3.5" />
                </button>
              )}

              {canMoreMoviesAccess && (
                <button
                  onClick={() => { setFilter(filter === 'moremovies' ? 'all' : 'moremovies'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                  className={`relative p-1 rounded-md text-xs transition-all duration-200 ${
                    filter === 'moremovies' && !adminAccountsModalOpen
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_1px_5px_var(--accent-shadow)] font-bold'
                      : 'bg-transparent text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                  }`}
                  title="More Movies (Atlantic.st)"
                >
                  <Film className="w-3.5 h-3.5" />
                </button>
              )}

              {isAdminUnlocked && (
                <button
                  onClick={() => { setFilter(filter === 'chat' ? 'all' : 'chat'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                  className={`p-1 px-1.5 rounded-md text-xs font-sans font-black transition-all duration-200 flex items-center justify-center ${
                    filter === 'chat' && !adminAccountsModalOpen
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_1px_5px_var(--accent-shadow)]'
                      : 'bg-transparent text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                  }`}
                  title="Gemini AI Chat (Admin)"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="currentColor" />
                  </svg>
                </button>
              )}

              {canLobbyChatAccess && (
                <button
                  onClick={() => { setFilter(filter === 'lobbychat' ? 'all' : 'lobbychat'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                  className={`relative p-1 rounded-md text-xs transition-all duration-200 ${
                    filter === 'lobbychat' && !adminAccountsModalOpen
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_1px_5px_var(--accent-shadow)] font-bold'
                      : 'bg-transparent text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                  }`}
                  title="Lobby Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <LobbyUnreadIndicator visible={hasUnreadLobby} />
                </button>
              )}

              {canYoutubeAccess && (
                <button
                  onClick={() => { setFilter(filter === 'youtube' ? 'all' : 'youtube'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                  className={`p-1 rounded-md text-xs transition-all duration-200 ${
                    filter === 'youtube' && !adminAccountsModalOpen
                      ? 'bg-red-600 text-white shadow-[0_1px_5px_rgba(220,38,38,0.5)] font-bold'
                      : 'bg-transparent text-[var(--text-primary)] hover:text-red-500'
                  }`}
                  title="YouTube"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" fill={filter === 'youtube' && !adminAccountsModalOpen ? "#FFFFFF" : "#FF0000"} />
                    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill={filter === 'youtube' && !adminAccountsModalOpen ? "#FF0000" : "#FFFFFF"} />
                  </svg>
                </button>
              )}

              {/* Decoy Selector & Auto Randomize */}
              {isDecoysUnlocked && (
                <>
                  <DecoyDropdown 
                    value={decoyType} 
                    onChange={(val) => { if (isDecoysUnlocked || val === 'classroom') setDecoyType(val); }} 
                    mode={mode} 
                    compact={true} 
                    customTitles={customDecoyTitles} 
                    onCustomTitleChange={handleCustomTitleChange}
                    isUnlocked={isDecoysUnlocked}
                    onRequestUnlock={() => { setAccountModalOpen(true); setIsGlobalSettingsOpen(false); }}
                  />

                  <AutoRandomizeDecoyButton
                    autoRandomize={autoRandomizeDecoy}
                    setAutoRandomize={setAutoRandomizeDecoy}
                    interval={randomizeInterval}
                    setInterval={updateRandomizeInterval}
                    pool={randomizePool}
                    togglePoolItem={toggleDecoyInPool}
                    selectAllPool={selectAllDecoys}
                    countdown={randomizeCountdown}
                    onRandomizeNow={triggerManualRandomize}
                    currentDecoy={decoyType}
                    mode={mode}
                    compact={true}
                    isUnlocked={isDecoysUnlocked}
                    onRequestUnlock={() => { setAccountModalOpen(true); setIsGlobalSettingsOpen(false); }}
                  />
                </>
              )}

                {/* Cloak & Open Link & Refresh Buttons */}
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => { if (filter !== 'chat') openWorkspaceInAboutBlank(filter); }}
                    className={`p-1 rounded-md transition-all ${
                      filter !== 'chat'
                        ? 'text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 cursor-pointer'
                        : 'text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                    }`}
                    title={getWorkspaceAboutBlankTitle(filter)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {(() => {
                    const url = getWorkspaceExternalUrl(filter, window.location.origin);
                    const hasUrl = !!url;
                    return (
                      <button
                        onClick={() => { if (hasUrl) window.open(url, '_blank'); }}
                        className={`p-1 rounded-md transition-all ${
                          hasUrl
                            ? 'text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0)] hover:shadow-[0_0_8px_var(--accent-color)]'
                            : 'text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                        }`}
                        title={filter === 'chat' ? "Direct link disabled for AI Chat" : (hasUrl ? "Open Workspace in new tab" : "No external link available")}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      </button>
                    );
                  })()}

                  <button
                    onClick={handleRefreshPage}
                    className="p-1 rounded-md text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition-all cursor-pointer flex items-center justify-center"
                    title="Refresh Page (Safe reload - keeps about:blank disguise)"
                    aria-label="Refresh Page"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Middle: Section Icons with Background (Visible on medium+ screens) */}
            <div className="hidden md:flex items-center gap-1.5 bg-[var(--bg-secondary)] border border-[var(--card-border)]/50 p-1 rounded-xl shadow-sm">
              {/* Movies Button */}
              {canMoviesAccess && (
              <div className="relative">
                <button
                  onClick={() => { setFilter(filter === 'movies' ? 'all' : 'movies'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                  className={`p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    filter === 'movies' && !adminAccountsModalOpen
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                      : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
                  } ${showNotices && noticeStep === 1 ? 'ring-2 ring-[var(--accent-color)] ring-offset-2 ring-offset-[#0d0d12] animate-pulse' : ''}`}
                  title="Movies Workspace"
                >
                  <Tv className="w-3.5 h-3.5" />
                </button>

                {showNotices && noticeStep === 1 && (
                  <div className="absolute top-full left-0 mt-3 w-80 bg-[#13111c] border-2 border-amber-500/80 text-white rounded-xl p-3.5 shadow-[0_0_30px_rgba(245,158,11,0.4)] z-[3000] animate-fade-in select-none text-left text-xs font-medium">
                    <div className="absolute -top-2.5 left-3 w-3.5 h-3.5 bg-[#13111c] border-t-2 border-l-2 border-amber-500/80 transform rotate-45" />

                    {/* IMPORTANT WARNING HEADER BANNER */}
                    <div className="bg-amber-500/15 border border-amber-500/40 rounded-lg px-2.5 py-1.5 mb-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-black text-[11px] uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
                        <span>IMPORTANT WARNING</span>
                      </div>
                      <button
                        onClick={closeNotices}
                        className="px-2 py-0.5 text-[10px] text-neutral-300 hover:text-white bg-white/10 hover:bg-red-500/80 rounded-md transition-all cursor-pointer shrink-0 font-sans font-bold flex items-center gap-1 border border-white/10"
                        title="Close Notifications"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Close</span>
                      </button>
                    </div>

                    <div className="mb-2 text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span>You need to read this only once</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--accent-color)] font-mono font-bold uppercase tracking-wider">
                      <Tv className="w-3.5 h-3.5" />
                      <span>Tip 2 of 4 • Movies</span>
                    </div>

                    <p className="mt-2 text-[11px] leading-relaxed text-neutral-200 font-semibold">
                      Movies and TV shows actually work now! You can watch full movies, TV series, and shows
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        {noticeCountdown}s
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={prevNoticeStep}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors cursor-pointer font-sans"
                        >
                          ← Prev
                        </button>
                        <button
                          onClick={closeNotices}
                          className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white font-bold transition-all cursor-pointer font-sans border border-red-500/40 flex items-center gap-1"
                          title="Close notifications"
                        >
                          <X className="w-3 h-3" />
                          <span>Close</span>
                        </button>
                        <button
                          onClick={nextNoticeStep}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-black transition-all cursor-pointer font-sans shadow-md"
                        >
                          Next →
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${(noticeCountdown / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* More Movies Button */}
              {canMoreMoviesAccess && (
                <div className="relative">
                  <button
                    onClick={() => { setFilter(filter === 'moremovies' ? 'all' : 'moremovies'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                    className={`p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      filter === 'moremovies' && !adminAccountsModalOpen
                        ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                        : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
                    }`}
                    title="More Movies (Atlantic.st)"
                  >
                    <Film className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Socratic Tutor Button (Admin Only) */}
              {isAdminUnlocked && (
                <button
                  onClick={() => { setFilter(filter === 'chat' ? 'all' : 'chat'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                  className={`p-1.5 px-2.5 rounded-lg border text-xs font-sans font-black flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    filter === 'chat' && !adminAccountsModalOpen
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                      : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
                  }`}
                  title="Gemini AI Chat Tutor (Admin)"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="currentColor" />
                  </svg>
                </button>
              )}

              {/* Lobby Chat Button */}
              {canLobbyChatAccess && (
                <button
                  onClick={() => { setFilter(filter === 'lobbychat' ? 'all' : 'lobbychat'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                  className={`relative p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    filter === 'lobbychat' && !adminAccountsModalOpen
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                      : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
                  }`}
                  title="Lobby Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <LobbyUnreadIndicator visible={hasUnreadLobby} />
                </button>
              )}

              {/* YouTube Workspace Button */}
              {canYoutubeAccess && (
                <button
                  onClick={() => { setFilter(filter === 'youtube' ? 'all' : 'youtube'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                  className={`p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    filter === 'youtube' && !adminAccountsModalOpen
                      ? 'bg-red-600 text-white border-red-600 shadow-[0_2px_8px_rgba(220,38,38,0.5)] font-bold'
                      : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-red-500/50 hover:text-red-500'
                  }`}
                  title="YouTube"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" fill={filter === 'youtube' && !adminAccountsModalOpen ? "#FFFFFF" : "#FF0000"} />
                    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill={filter === 'youtube' && !adminAccountsModalOpen ? "#FF0000" : "#FFFFFF"} />
                  </svg>
                </button>
              )}

              {/* Decoy Selector & Auto Randomize */}
              <div className="relative flex items-center gap-1">
                {isDecoysUnlocked && (
                  <>
                    <div className={showNotices && noticeStep === 3 ? 'ring-2 ring-[var(--accent-color)] ring-offset-2 ring-offset-[#0d0d12] rounded-lg animate-pulse' : ''}>
                      <DecoyDropdown 
                        value={decoyType} 
                        onChange={(val) => { if (isDecoysUnlocked || val === 'classroom') setDecoyType(val); }} 
                        mode={mode} 
                        compact={true} 
                        customTitles={customDecoyTitles}
                        onCustomTitleChange={handleCustomTitleChange}
                        isUnlocked={isDecoysUnlocked}
                        onRequestUnlock={() => { setAccountModalOpen(true); setIsGlobalSettingsOpen(false); }}
                      />
                    </div>

                    <AutoRandomizeDecoyButton
                      autoRandomize={autoRandomizeDecoy}
                      setAutoRandomize={setAutoRandomizeDecoy}
                      interval={randomizeInterval}
                      setInterval={updateRandomizeInterval}
                      pool={randomizePool}
                      togglePoolItem={toggleDecoyInPool}
                      selectAllPool={selectAllDecoys}
                      countdown={randomizeCountdown}
                      onRandomizeNow={triggerManualRandomize}
                      currentDecoy={decoyType}
                      mode={mode}
                      compact={true}
                      isUnlocked={isDecoysUnlocked}
                      onRequestUnlock={() => { setAccountModalOpen(true); setIsGlobalSettingsOpen(false); }}
                    />
                  </>
                )}

                {/* Cloak / About:blank Button (to the right of shuffle button) */}
                <div className="relative">
                  <button
                    onClick={() => { if (filter !== 'chat') openWorkspaceInAboutBlank(filter); }}
                    className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
                      filter !== 'chat'
                        ? 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] hover:border-[var(--accent-color)] cursor-pointer'
                        : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                    } ${showNotices && noticeStep === 2 ? 'ring-2 ring-[var(--accent-color)] ring-offset-2 ring-offset-[#0d0d12] animate-pulse' : ''}`}
                    title={getWorkspaceAboutBlankTitle(filter)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {showNotices && noticeStep === 2 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-[#13111c] border-2 border-amber-500/80 text-white rounded-xl p-3.5 shadow-[0_0_30px_rgba(245,158,11,0.4)] z-[3000] animate-fade-in select-none text-left text-xs font-medium">
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#13111c] border-t-2 border-l-2 border-amber-500/80 transform rotate-45" />

                      {/* IMPORTANT WARNING HEADER BANNER */}
                      <div className="bg-amber-500/15 border border-amber-500/40 rounded-lg px-2.5 py-1.5 mb-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-amber-400 font-black text-[11px] uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
                          <span>IMPORTANT WARNING</span>
                        </div>
                        <button
                          onClick={closeNotices}
                          className="px-2 py-0.5 text-[10px] text-neutral-300 hover:text-white bg-white/10 hover:bg-red-500/80 rounded-md transition-all cursor-pointer shrink-0 font-sans font-bold flex items-center gap-1 border border-white/10"
                          title="Close Notifications"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Close</span>
                        </button>
                      </div>

                      <div className="mb-2 text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>You need to read this only once</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--accent-color)] font-mono font-bold uppercase tracking-wider">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Tip 3 of 4 • Cloak Screen</span>
                      </div>

                      <p className="mt-2 text-[11px] leading-relaxed text-neutral-200 font-semibold">
                        Open in about:blank masks your screen from GoGuardian in a blank screen and masks the URL (it doesn't even appear in your search history), but can confuse older teachers and looks suspicious when multiple students have blank screens.
                      </p>

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          {noticeCountdown}s
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={prevNoticeStep}
                            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors cursor-pointer font-sans"
                          >
                            ← Prev
                          </button>
                          <button
                            onClick={closeNotices}
                            className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white font-bold transition-all cursor-pointer font-sans border border-red-500/40 flex items-center gap-1"
                            title="Close notifications"
                          >
                            <X className="w-3 h-3" />
                            <span>Close</span>
                          </button>
                          <button
                            onClick={nextNoticeStep}
                            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-black transition-all cursor-pointer font-sans shadow-md"
                          >
                            Next →
                          </button>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                          style={{ width: `${(noticeCountdown / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Open Link Button */}
                {(() => {
                  const url = getWorkspaceExternalUrl(filter, window.location.origin);
                  const hasUrl = !!url;
                  return (
                    <button
                      onClick={() => { if (hasUrl) window.open(url, '_blank'); }}
                      className={`p-1.5 rounded-lg border transition-all flex items-center justify-center ${
                        hasUrl
                          ? 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0)] hover:shadow-[0_0_8px_var(--accent-color)]'
                          : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                      }`}
                      title={filter === 'chat' ? "Direct link disabled for AI Chat" : (hasUrl ? "Open Workspace in new tab" : "No external link available")}
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </button>
                  );
                })()}

                {/* Refresh Page Button */}
                <button
                  onClick={handleRefreshPage}
                  className="p-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                  title="Refresh Page (Safe reload - keeps about:blank disguise)"
                  aria-label="Refresh Page"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>

                {showNotices && noticeStep === 3 && (
                  <div className="absolute top-full left-0 mt-3 w-80 bg-[#13111c] border-2 border-amber-500/80 text-white rounded-xl p-3.5 shadow-[0_0_30px_rgba(245,158,11,0.4)] z-[3000] animate-fade-in select-none text-left text-xs font-medium">
                    <div className="absolute -top-2.5 left-4 w-3.5 h-3.5 bg-[#13111c] border-t-2 border-l-2 border-amber-500/80 transform rotate-45" />

                    {/* IMPORTANT WARNING HEADER BANNER */}
                    <div className="bg-amber-500/15 border border-amber-500/40 rounded-lg px-2.5 py-1.5 mb-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-black text-[11px] uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
                        <span>IMPORTANT WARNING</span>
                      </div>
                      <button
                        onClick={closeNotices}
                        className="px-2 py-0.5 text-[10px] text-neutral-300 hover:text-white bg-white/10 hover:bg-red-500/80 rounded-md transition-all cursor-pointer shrink-0 font-sans font-bold flex items-center gap-1 border border-white/10"
                        title="Close Notifications"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Close</span>
                      </button>
                    </div>

                    <div className="mb-2 text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span>You need to read this only once</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--accent-color)] font-mono font-bold uppercase tracking-wider">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Tip 4 of 4 • Decoy Mask</span>
                    </div>

                    <p className="mt-2 text-[11px] leading-relaxed text-neutral-200 font-semibold">
                      This is the name of the website that is shown in GoGuardian, helps mask your history in GoGuardian's timeline but please make sure not everyone is on the same decoy.
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        {noticeCountdown}s
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={prevNoticeStep}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors cursor-pointer font-sans"
                        >
                          ← Prev
                        </button>
                        <button
                          onClick={closeNotices}
                          className="px-2.5 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-black transition-all cursor-pointer font-sans shadow-md flex items-center gap-1"
                          title="Close notifications"
                        >
                          <X className="w-3 h-3" />
                          <span>Close ✓</span>
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${(noticeCountdown / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Exit & Open Separately buttons for Workspaces (Main) */}
              <AnimatePresence>
                {(isPortalWorkspaceFilter(filter) || (adminAccountsModalOpen && hasAdminAccess)) && (
                  <motion.div 
                    key="workspace-actions-main"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex items-center gap-1.5 pl-2 ml-1 border-l border-[var(--card-border)]/50 whitespace-nowrap"
                  >
                    <button
                      onClick={() => { setFilter('all'); setAdminAccountsModalOpen(false); }}
                      className="p-1.5 rounded-lg border border-rose-500/40 hover:border-rose-500 bg-rose-500/10 text-rose-500 hover:text-white hover:bg-rose-500 transition-all cursor-pointer flex items-center justify-center shrink-0 group"
                      title="Close Workspace"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedGame && renderChatHeaderNotice('compact')}
            </div>

          {/* Top Right: Combined Animations & Settings, plus Theme Slider */}
          <div ref={compactRightRef} className="flex items-center gap-1.5 justify-end shrink-0 min-w-0 ml-auto z-10">{/* Combined Animations & Settings Group */}
            <div className="relative flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-full shadow-sm shrink-0">
              {/* Animations Slider */}
              <div
                id="header-animations-slider"
                onClick={toggleAnimations}
                className="flex items-center gap-1.5 cursor-pointer select-none group"
                title={animationsEnabled ? "Animations Enabled (Click to toggle OFF for Chromebooks)" : "Animations Disabled (Click to toggle ON)"}
                role="switch"
                aria-checked={animationsEnabled}
                aria-label="Toggle Animations"
              >
                <span 
                  className={`tracking-tight transition-colors whitespace-nowrap ${
                    mode === 'light'
                      ? theme === 'girls' ? 'text-[#2d1624] font-extrabold' : 'text-black font-extrabold'
                      : 'text-[var(--text-primary)]'
                  }`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '8px', fontWeight: 'bold', color: mode === 'light' ? (theme === 'girls' ? '#2d1624' : '#000000') : undefined }}
                >
                  Anim
                </span>
                <div 
                  className={`relative w-7 h-4 rounded-full border transition-all duration-200 flex items-center px-0.5 ${
                    animationsEnabled 
                      ? mode === 'light'
                        ? theme === 'girls' ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'bg-black border-black'
                        : 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                      : mode === 'light'
                        ? theme === 'girls' ? 'bg-pink-200/80 border-pink-300/70' : 'bg-neutral-200 border-neutral-300'
                        : 'bg-[var(--input-fill)] border-[var(--card-border)]'
                  }`}
                >
                  <div 
                    className={`w-3 h-3 rounded-full transition-all duration-200 ease-out transform ${
                      animationsEnabled 
                        ? mode === 'light' ? 'translate-x-3 bg-white' : 'translate-x-3 bg-[var(--bg-color)]' 
                        : mode === 'light'
                          ? theme === 'girls' ? 'translate-x-0 bg-white shadow-xs' : 'translate-x-0 bg-black'
                          : 'translate-x-0 bg-[var(--text-muted)]'
                    }`}
                  />
                </div>
              </div>

              {/* Subtle divider */}
              <div className="w-px h-3.5 bg-[var(--card-border)]/60" />

              {/* Account Sign In / Profile Button */}
              <button
                type="button"
                onClick={() => {
                  openAccountModalOnTab('profile');
                  setIsGlobalSettingsOpen(false);
                }}
                className={`px-1.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 shrink-0 text-[10px] font-mono font-bold ${
                  activeAccount
                    ? 'bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30 hover:bg-[var(--accent-color)]/25'
                    : mode === 'light'
                      ? theme === 'girls' ? 'text-[#2d1624] hover:text-[var(--accent-color)] hover:bg-pink-500/10' : 'text-black hover:bg-black/5'
                      : 'text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--card-bg)]'
                }`}
                title={activeAccount ? `Signed in as @${activeAccount.username}` : 'Account Sign In'}
                aria-label="Account"
              >
                <User className="w-3 h-3 shrink-0" />
                {activeAccount && (
                  <span className="hidden lg:inline truncate max-w-[78px]">@{activeAccount.username}</span>
                )}
              </button>

              {/* Admin Accounts Manager Button (visible for owner or promoted admin accounts) */}
              {hasAdminAccess && (
                <button
                  type="button"
                  onClick={() => {
                    setAdminAccountsModalOpen((prev) => !prev);
                    setSelectedGame(null);
                    setIsGlobalSettingsOpen(false);
                  }}
                  className={`p-1 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    adminAccountsModalOpen
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)]'
                      : mode === 'light'
                        ? 'text-amber-700 hover:bg-amber-100'
                        : 'text-amber-400 hover:bg-[var(--card-bg)]'
                  }`}
                  title="Manage User Accounts (Admin)"
                  aria-label="Manage User Accounts"
                >
                  <Users className="w-3 h-3" />
                </button>
              )}

              {/* Settings Gear Button */}
              <button
                onClick={() => {
                  setIsGlobalSettingsOpen(!isGlobalSettingsOpen);
                }}
                className={`p-1 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  mode === 'light' 
                    ? theme === 'girls' ? 'text-[#2d1624] hover:text-[var(--accent-color)] hover:bg-pink-500/10' : 'text-black hover:text-black hover:bg-black/5' 
                    : 'text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--card-bg)]'
                }`}
                title="System Settings"
              >
                <Settings className="w-3 h-3" style={{ color: mode === 'light' ? (theme === 'girls' ? '#2d1624' : '#000000') : undefined }} />
              </button>

              {renderSystemSettingsPopover(false)}

              <button
                onClick={handleAccountSignOut}
                className={`p-0.5 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  mode === 'light'
                    ? theme === 'girls' ? 'text-rose-600 hover:bg-rose-500/10' : 'text-black hover:text-black hover:bg-black/5'
                    : 'text-[var(--text-muted)] hover:text-red-500 hover:bg-[var(--card-bg)]'
                }`}
                title="Sign Out (Log Out & Lock Workspace)"
              >
                <LogOut className="w-2.5 h-2.5" style={{ borderColor: '#ff0000', color: theme === 'girls' && mode === 'light' ? '#e11d48' : '#ff0000' }} />
              </button>

              <div className="w-[1px] h-3 bg-[var(--card-border)]/80" />

              {/* Theme Color Change Icon Dropdown */}
              <ThemeDropdown
                theme={theme}
                setTheme={setTheme}
                mode={mode}
                lockedTheme={isThemeLockedToGirls ? 'girls' : null}
                onSelectTheme={handleUserThemeChange}
              />

              {/* Subtle divider */}
              <div className="w-[1px] h-3 bg-[var(--card-border)]/80" />

              {/* Light/Dark slider with GoGuardian Decoy notice (Joined with color palette bar) */}
              <div className="relative flex items-center gap-1">
                {!isInAboutBlank && !aboutBlankNoticeDismissed && !pendingAboutBlankLaunch && (
                  <div className="relative flex items-center" ref={!headerOpen ? aboutBlankNoticeRef : undefined}>
                    <button
                      type="button"
                      onClick={() => setAboutBlankNoticeOpen((prev) => !prev)}
                      className={`relative p-1 rounded-md border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                        mode === 'light'
                          ? 'border-amber-500/80 bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'border-amber-400/60 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
                      }`}
                      title="Not on about:blank — click to open or dismiss"
                      aria-label="Not on about:blank"
                    >
                      <ShieldAlert className="w-3 h-3" />
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-[var(--bg-secondary)]" />
                    </button>
                    {aboutBlankNoticeOpen && (
                      <div className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-amber-500/60 bg-[var(--card-bg)] text-[var(--text-primary)] shadow-2xl p-3 z-[99999] text-left">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                            <span>Not on about:blank</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAboutBlankNoticeOpen(false);
                              setAboutBlankNoticeDismissed(true);
                            }}
                            className="p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                            title="Dismiss notice"
                            aria-label="Dismiss about:blank notice"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10.5px] text-[var(--text-muted)] leading-snug mb-2.5">
                          {aboutBlankNoticePopupBlocked
                            ? 'Popup blocked — allow popups in your browser, then click Open.'
                            : 'Your tab URL is visible. Open in about:blank to cloak your tab.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const opened = openWorkspaceInAboutBlank(filter === 'chat' ? 'all' : filter);
                            if (opened) {
                              setViewMode('articles');
                              setAboutBlankNoticeOpen(false);
                              setAboutBlankNoticeDismissed(true);
                              setAboutBlankNoticePopupBlocked(false);
                            } else {
                              setAboutBlankNoticePopupBlocked(true);
                            }
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors"
                        >
                          Open about:blank
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {isWhiteDecoy && (
                  <button
                    type="button"
                    onClick={() => setShowGoGuardianNotice(prev => !prev)}
                    className={`p-0.5 rounded-full text-amber-500 hover:scale-120 transition-all cursor-pointer ${
                      showGoGuardianNotice ? 'opacity-100 ring-2 ring-amber-500/40 bg-amber-500/10' : 'opacity-80 hover:opacity-100'
                    }`}
                    title="GoGuardian Decoy Shield Notice (Click to open/close)"
                  >
                    <Shield className="w-3.5 h-3.5 fill-amber-500/20" style={{ color: '#000000' }} />
                  </button>
                )}

                <div 
                  onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                  className="relative w-[34px] h-4 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 select-none transition-all duration-300 shrink-0"
                  title="Slide to change Light/Dark Mode"
                >
                  <div 
                    className={`w-3 h-3 rounded-full bg-[var(--accent-color)] shadow-sm transition-all duration-300 ease-out flex items-center justify-center text-[7px] transform ${
                      mode === 'dark' ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  >
                    {mode === 'dark' ? '🌙' : '☀️'}
                  </div>
                </div>

                <AnimatePresence>
                  {isWhiteDecoy && showGoGuardianNotice && (
                    <GoGuardianDecoyNotice
                      mode={mode}
                      onToggleMode={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                      onClose={() => setShowGoGuardianNotice(false)}
                      decoyType={decoyType}
                      positionClass="absolute top-full right-0 mt-3 w-48 sm:w-56"
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showWhatsNewDrop && (
                    <WhatsNewNotificationDrop
                      onClose={() => setShowWhatsNewDrop(false)}
                      onOpenModal={() => setShowWhatsNewModal(true)}
                      onPlayGameCard={navigateToGameCard}
                      onOpenSignInLinks={() => openAccountModalOnTab('links')}
                      positionClass="absolute top-full right-0 mt-2 w-[320px] sm:w-[420px] md:w-[480px] max-w-[calc(100vw-1.5rem)]"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            </div>

        </div>
      )}
          </motion.header>
        )}
      </AnimatePresence>

      {/* ALT LINKS BAR */}
      {headerOpen && altBarOpen && filter !== 'info' && (
        <section className="bg-[var(--bg-secondary)] border-b border-[var(--card-border)] py-3 px-4 md:px-6 transition-colors duration-300 animate-fade-in">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Alt Links Removed */}

          <div className="flex flex-wrap items-center gap-2 md:ml-auto w-full md:w-auto overflow-visible">
            {/* Go back to games back button */}
            {(isPortalWorkspaceFilter(filter) || (adminAccountsModalOpen && hasAdminAccess)) && (
              <button
                id="chat-back-button"
                onClick={() => { setFilter('all'); setAdminAccountsModalOpen(false); }}
                className="flex items-center gap-1.5 text-xs font-mono font-bold py-1.5 px-3.5 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] active:scale-98"
                title="Go back to portals list"
                aria-label="Back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Go back to portals</span>
              </button>
            )}

            {/* Movies Workspace button */}
            {canMoviesAccess && (
              <button
                onClick={() => { setFilter(filter === 'movies' ? 'all' : 'movies'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                className={`text-xs border py-1.5 px-3.5 rounded-full font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-98 ${
                  filter === 'movies' && !adminAccountsModalOpen
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-extrabold'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]'
                }`}
                title="Toggle Movies - Stream Movies and TV Shows"
              >
                <Tv className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Movies</span>
              </button>
            )}

            {/* More Movies Workspace button (Atlantic.st) */}
            {canMoreMoviesAccess && (
              <button
                onClick={() => { setFilter(filter === 'moremovies' ? 'all' : 'moremovies'); setSelectedGame(null); setAdminAccountsModalOpen(false); }}
                className={`text-xs border py-1.5 px-3.5 rounded-full font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-98 ${
                  filter === 'moremovies' && !adminAccountsModalOpen
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-extrabold'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]'
                }`}
                title="More Movies - Atlantic Stream (atlantic.st)"
              >
                <Film className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>More Movies</span>
              </button>
            )}

            {/* Quick Random Game button (Curated S-C Pool) */}
            {canGamesAccess && (
              <button
                onClick={pickRandomRankedGame}
                className="text-xs border py-1.5 px-3 rounded-full font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-95 bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] shrink-0"
                title={`Roll a random game from ${randomEligibleCount} curated classics (S-C Tier)`}
              >
                <Dices className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span className="hidden sm:inline">Random</span>
              </button>
            )}

            {/* Decoy Mode Selector */}
            {isDecoysUnlocked && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase select-none">Decoy:</span>
                <DecoyDropdown 
                  value={decoyType} 
                  onChange={(val) => { if (isDecoysUnlocked || val === 'classroom') setDecoyType(val); }} 
                  mode={mode} 
                  customTitles={customDecoyTitles}
                  onCustomTitleChange={handleCustomTitleChange}
                  isUnlocked={isDecoysUnlocked}
                  onRequestUnlock={() => { setAccountModalOpen(true); setIsGlobalSettingsOpen(false); }}
                />
                <AutoRandomizeDecoyButton
                  autoRandomize={autoRandomizeDecoy}
                  setAutoRandomize={setAutoRandomizeDecoy}
                  interval={randomizeInterval}
                  setInterval={updateRandomizeInterval}
                  pool={randomizePool}
                  togglePoolItem={toggleDecoyInPool}
                  selectAllPool={selectAllDecoys}
                  countdown={randomizeCountdown}
                  onRandomizeNow={triggerManualRandomize}
                  currentDecoy={decoyType}
                  mode={mode}
                  isUnlocked={isDecoysUnlocked}
                  onRequestUnlock={() => { setAccountModalOpen(true); setIsGlobalSettingsOpen(false); }}
                />
              </div>
            )}

            {/* Alt Bar Search Bar (squishable, left of Clear History) */}
            <div className="w-28 sm:w-36 md:w-44 shrink transition-all duration-300 min-w-[70px]">
              <div className="relative flex items-center w-full">
                <Search className="absolute left-2.5 w-3 h-3 text-[var(--accent-color)] pointer-events-none shrink-0" />
                <input
                  type="text"
                  placeholder="Search portals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-color)]/50 focus:border-[var(--accent-color)] text-[var(--text-primary)] text-xs rounded-lg pl-7 pr-6 py-1 outline-none transition-all duration-200 placeholder:text-[var(--text-muted)]/60 min-w-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Animations Slider in Alt Bar (Compact & Simplified for Chromebooks, Full White with Black Dot when ON) */}
            <div
              id="alt-bar-animations-slider"
              onClick={toggleAnimations}
              className="flex items-center gap-2 px-2.5 py-1 border border-[var(--card-border)] bg-[var(--bg-secondary)] hover:border-neutral-500 rounded-full shadow-sm cursor-pointer select-none transition-all group shrink-0"
              title={animationsEnabled ? "Animations Enabled (Click to toggle OFF for Chromebooks)" : "Animations Disabled (Click to toggle ON)"}
              role="switch"
              aria-checked={animationsEnabled}
              aria-label="Toggle Animations"
            >
              <span className={`text-[10px] font-mono font-bold tracking-tight transition-colors whitespace-nowrap ${
                mode === 'light'
                  ? theme === 'girls' ? 'text-[#2d1624] font-extrabold' : 'text-black font-extrabold'
                  : 'text-[var(--text-primary)]'
              }`} style={{ color: mode === 'light' ? (theme === 'girls' ? '#2d1624' : '#000000') : undefined }}>
                Animations
              </span>
              <div 
                className={`relative w-7 h-4 rounded-full border transition-all duration-200 flex items-center px-0.5 ${
                  animationsEnabled 
                    ? mode === 'light'
                      ? theme === 'girls' ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'bg-black border-black'
                      : 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                    : mode === 'light'
                      ? theme === 'girls' ? 'bg-pink-200/80 border-pink-300/70' : 'bg-neutral-200 border-neutral-300'
                      : 'bg-[var(--input-fill)] border-[var(--card-border)]'
                }`}
              >
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-200 ease-out transform ${
                    animationsEnabled 
                      ? mode === 'light' ? 'translate-x-3 bg-white' : 'translate-x-3 bg-[var(--bg-color)]' 
                      : mode === 'light'
                        ? theme === 'girls' ? 'translate-x-0 bg-white shadow-xs' : 'translate-x-0 bg-black'
                        : 'translate-x-0 bg-[var(--text-muted)]'
                  }`}
                />
              </div>
            </div>{/* Unified Settings, Colors & Sign Out Group */}
            <div className="relative flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] p-1 rounded-full shadow-sm">
              {/* Account Sign In / Profile Button */}
              <button
                type="button"
                onClick={() => {
                  openAccountModalOnTab('profile');
                  setIsGlobalSettingsOpen(false);
                }}
                className={`px-2 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 shrink-0 text-[10px] font-mono font-bold ${
                  activeAccount
                    ? 'bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30 hover:bg-[var(--accent-color)]/25'
                    : mode === 'light'
                      ? theme === 'girls' ? 'text-[#2d1624] hover:text-[var(--accent-color)] hover:bg-pink-500/10' : 'text-black hover:bg-black/5'
                      : 'text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--card-bg)]'
                }`}
                title={activeAccount ? `Signed in as @${activeAccount.username}` : 'Account Sign In'}
                aria-label="Account"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                {activeAccount && (
                  <span className="hidden lg:inline truncate max-w-[78px]">@{activeAccount.username}</span>
                )}
              </button>

              {/* Admin Accounts Manager Button (visible for owner or promoted admin accounts) */}
              {hasAdminAccess && (
                <button
                  type="button"
                  onClick={() => {
                    setAdminAccountsModalOpen((prev) => !prev);
                    setSelectedGame(null);
                    setIsGlobalSettingsOpen(false);
                  }}
                  className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    adminAccountsModalOpen
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)]'
                      : mode === 'light'
                        ? 'text-amber-700 hover:bg-amber-100'
                        : 'text-amber-400 hover:bg-[var(--card-bg)]'
                  }`}
                  title="Manage User Accounts (Admin)"
                  aria-label="Manage User Accounts"
                >
                  <Users className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Settings Gear Button (opens System Settings Dropdown) */}
              <button
                onClick={() => {
                  setIsGlobalSettingsOpen(!isGlobalSettingsOpen);
                }}
                className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  mode === 'light'
                    ? theme === 'girls' ? 'text-[#2d1624] hover:text-[var(--accent-color)] hover:bg-pink-500/10' : 'text-black hover:text-black hover:bg-black/5'
                    : 'text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--card-bg)]'
                }`}
                title="System Settings"
              >
                <Settings className="w-3.5 h-3.5" style={{ color: mode === 'light' ? (theme === 'girls' ? '#2d1624' : '#000000') : undefined }} />
              </button>

              {renderSystemSettingsPopover(true)}

              <button
                onClick={handleAccountSignOut}
                className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  mode === 'light'
                    ? theme === 'girls' ? 'text-rose-600 hover:bg-rose-500/10' : 'text-black hover:text-black hover:bg-black/5'
                    : 'text-[var(--text-muted)] hover:text-red-500 hover:bg-[var(--card-bg)]'
                }`}
                title="Sign Out (Log Out & Lock Workspace)"
              >
                <LogOut className="w-3.5 h-3.5" style={{ color: mode === 'light' ? (theme === 'girls' ? '#e11d48' : '#000000') : undefined }} />
              </button>

              <div className="w-[1px] h-3.5 bg-[var(--card-border)]/80" />

              {/* Theme Color Change Icon Dropdown */}
              <ThemeDropdown
                theme={theme}
                setTheme={setTheme}
                mode={mode}
                lockedTheme={isThemeLockedToGirls ? 'girls' : null}
                onSelectTheme={handleUserThemeChange}
              />
            </div>
          

            {/* Light/Dark Mode slider with GoGuardian indicator */}
            <div className="relative flex items-center gap-1.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] p-1 rounded-full shadow-sm">
              {isWhiteDecoy && (
                <button
                  type="button"
                  onClick={() => setShowGoGuardianNotice(prev => !prev)}
                  className={`p-0.5 rounded-full text-amber-500 hover:scale-115 transition-all cursor-pointer ${
                    showGoGuardianNotice ? 'opacity-100 ring-2 ring-amber-500/40 bg-amber-500/10' : 'opacity-80 hover:opacity-100'
                  }`}
                  title="GoGuardian Decoy Shield Notice (Click to open/close)"
                >
                  <Shield className="w-3 h-3 fill-amber-500/20" style={{ color: '#000000' }} />
                </button>
              )}

              <div 
                onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                className="relative w-[38px] h-5 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 select-none transition-all duration-300"
                title="Slide to change Mode"
              >
                <div 
                  className={`w-3.5 h-3.5 rounded-full bg-[var(--accent-color)] shadow-sm transition-all duration-300 ease-out flex items-center justify-center text-[8px] transform ${
                    mode === 'dark' ? 'translate-x-4' : 'translate-x-0'
                  }`}
                >
                  {mode === 'dark' ? '🌙' : '☀️'}
                </div>
              </div>

              <AnimatePresence>
                {isWhiteDecoy && showGoGuardianNotice && (
                  <GoGuardianDecoyNotice
                    mode={mode}
                    onToggleMode={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                    onClose={() => setShowGoGuardianNotice(false)}
                    decoyType={decoyType}
                    positionClass="absolute top-full right-0 mt-3 w-48 sm:w-56"
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showWhatsNewDrop && (
                  <WhatsNewNotificationDrop
                    onClose={() => setShowWhatsNewDrop(false)}
                    onOpenModal={() => setShowWhatsNewModal(true)}
                    onPlayGameCard={navigateToGameCard}
                    onOpenSignInLinks={() => openAccountModalOnTab('links')}
                    positionClass="absolute top-full right-0 mt-2 w-[320px] sm:w-[420px] md:w-[480px] max-w-[calc(100vw-2rem)]"
                  />
                )}
              </AnimatePresence>
            </div>

            </div>
        </div>
      </section>
      )}


      {/* MAIN CONTAINER: SIDEBAR + GAMES */}
      <div className={`flex-1 flex flex-col md:flex-row w-full mx-auto relative select-none games-no-select ${windowFullscreen ? 'z-[99999]' : 'z-10'} ${
        ((adminAccountsModalOpen && hasAdminAccess) || isPortalWorkspaceFilter(filter) || filter === 'info' || selectedGame)
          ? 'min-h-0 overflow-hidden max-w-none p-0 gap-0 border-t-0 lg:bg-[#07090e]' 
          : 'max-w-8xl p-4 md:p-6 gap-6 self-center'
      }`}>
        
        {/* LEFT NAV PANEL - CAT SIDEBAR */}
        {canGamesAccess && !(adminAccountsModalOpen && hasAdminAccess) && !isPortalWorkspaceFilter(filter) && filter !== 'info' && !selectedGame && (
          <aside className={`transition-all duration-300 ease-in-out shrink-0 flex flex-col gap-1.5 overflow-hidden ${
            sidebarOpen ? 'w-full md:w-40' : 'w-full md:w-12'
          }`}>
            
            <div className="flex items-center justify-between px-2 py-1 min-h-[32px]">
              {sidebarOpen ? (
                <span className="text-[9px] font-mono tracking-wider text-[var(--text-muted)] uppercase whitespace-nowrap">
                  Browse Portals
                </span>
              ) : (
                <span className="hidden md:inline text-[8px] font-mono tracking-wider uppercase text-center mx-auto font-bold text-[var(--accent-color)]">
                  NAV
                </span>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 rounded-md hover:bg-[var(--card-bg)] text-[var(--accent-color)] transition-all duration-250 cursor-pointer flex items-center justify-center ml-auto"
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            {theme === 'girls' && (
              <motion.button
                whileHover={animationsEnabled ? { x: 4 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
                onClick={() => { setFilter('girls-featured'); setSelectedGame(null); }}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-all duration-200 cursor-pointer ${
                  filter === 'girls-featured' && !selectedGame
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                    : mode === 'light'
                      ? 'bg-pink-100/70 hover:bg-pink-200/75 text-[#9d174d] border border-pink-300/60 font-semibold'
                      : 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-200 border border-pink-400/30 font-semibold'
                }`}
                title="Curated Featured Section for Girls Mode"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Heart className="w-3.5 h-3.5 shrink-0 fill-current" />
                  <span className={`transition-all duration-300 truncate ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Girls Featured</span>
                </div>
                {sidebarOpen && (
                  <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    filter === 'girls-featured' && !selectedGame
                      ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                      : mode === 'light'
                        ? 'bg-white/90 text-[#db2777] border border-pink-200'
                        : 'bg-[var(--card-bg)] text-pink-300 border border-pink-400/35'
                  }`}>
                    {girlsFeaturedGamesCount}
                  </span>
                )}
              </motion.button>
            )}

            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('all'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'all' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className={`transition-all duration-300 truncate ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>All Classrooms</span>
              </div>
              {sidebarOpen && (
                <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  filter === 'all' && !selectedGame
                    ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                }`}>
                  {games.length}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('single'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'single' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
                <span className={`transition-all duration-300 truncate ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Single Player</span>
              </div>
              {sidebarOpen && (
                <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  filter === 'single' && !selectedGame
                    ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                }`}>
                  {singlePlayerGamesCount}
                </span>
              )}
            </motion.button>
            
            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('minecraft'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'minecraft' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Box className="w-3.5 h-3.5 shrink-0" />
                <span className={`transition-all duration-300 truncate ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Minecraft</span>
              </div>
              {sidebarOpen && (
                <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  filter === 'minecraft' && !selectedGame
                    ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                }`}>
                  {minecraftGamesCount}
                </span>
              )}
            </motion.button>
            
            <div>
              <motion.button
                whileHover={animationsEnabled ? { x: 4 } : undefined}
                whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
                onClick={() => {
                  setGameCatalogMode('all');
                  safeStorage.setItem('unblocked-game-catalog-mode', 'all');
                  if (!isEmulatedActive) {
                    setFilter('Emulated');
                    setSelectedGame(null);
                    setEmulatedDropdownOpen(true);
                  } else {
                    setEmulatedDropdownOpen(prev => !prev);
                  }
                }}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between gap-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isEmulatedActive && !selectedGame
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                    : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  <div className={`flex items-center gap-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>
                    <span className="truncate">Emulated</span>
                    {(emulatedTags.includes(filter) || filter === 'emulated-other') && (
                      <span className="text-[9px] px-1 py-0.2 rounded font-mono uppercase bg-black/20 dark:bg-white/20 shrink-0">
                        {filter === 'emulated-other' ? 'other' : filter}
                      </span>
                    )}
                  </div>
                </div>
                {sidebarOpen && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setEmulatedDropdownOpen(prev => !prev);
                    }}
                    className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0"
                    title={emulatedDropdownOpen ? "Collapse Emulated Systems" : "Expand Emulated Systems"}
                  >
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${emulatedDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </motion.button>

              {/* CUSTOM DROPDOWN - DROPS DOWN BENEATH EMULATED */}
              <AnimatePresence>
                {sidebarOpen && emulatedDropdownOpen && (
                  <motion.div
                    initial={animationsEnabled ? { opacity: 0, height: 0, y: -4 } : false}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={animationsEnabled ? { opacity: 0, height: 0, y: -4 } : undefined}
                    transition={animationsEnabled ? { duration: 0.16, ease: 'easeOut' } : { duration: 0 }}
                    className="overflow-hidden mt-1 px-0.5"
                  >
                    <div className="bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl p-1.5 shadow-lg flex flex-col gap-1">
                      {/* All Emulated option */}
                      <button
                        type="button"
                        onClick={() => {
                          setGameCatalogMode('all');
                          safeStorage.setItem('unblocked-game-catalog-mode', 'all');
                          setFilter('Emulated');
                          setSelectedGame(null);
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          filter === 'Emulated' && !selectedGame
                            ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                            : 'text-[var(--text-primary)] hover:bg-[var(--card-bg)] opacity-90 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {filter === 'Emulated' && !selectedGame && <Check className="w-3 h-3 shrink-0" />}
                          <span>All Emulated</span>
                        </div>
                        <span className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                          filter === 'Emulated' && !selectedGame
                            ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                            : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                        }`}>
                          {totalEmulatedGamesCount}
                        </span>
                      </button>

                      <div className="h-px bg-[var(--card-border)] my-0.5" />

                      {/* Major systems and combined Other */}
                      <div className="space-y-0.5">
                        {emulatedMajorTags.map((tag) => {
                          const isSelected = filter === tag && !selectedGame;
                          const label = EMULATED_SYSTEM_NAMES[tag] || tag.toUpperCase();
                          const count = emulatedTagCounts[tag] || 0;

                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setGameCatalogMode('all');
                                safeStorage.setItem('unblocked-game-catalog-mode', 'all');
                                setFilter(tag);
                                setSelectedGame(null);
                              }}
                              className={`w-full text-left px-2 py-1 rounded-md text-[10.5px] font-medium flex items-center justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] font-bold shadow-sm'
                                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                              }`}
                              title={`Filter by ${label}`}
                            >
                              <div className="flex items-center gap-1.5 truncate mr-1">
                                {isSelected && <Check className="w-2.5 h-2.5 shrink-0" />}
                                <span className="truncate">{label}</span>
                              </div>
                              <span className={`text-[8.5px] font-mono px-1 py-0.5 rounded shrink-0 ${
                                isSelected
                                  ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                                  : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                              }`}>
                                {count}
                              </span>
                            </button>
                          );
                        })}

                        {/* Combined Other entry */}
                        {emulatedOtherTags.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setGameCatalogMode('all');
                              safeStorage.setItem('unblocked-game-catalog-mode', 'all');
                              setFilter('emulated-other');
                              setSelectedGame(null);
                            }}
                            className={`w-full text-left px-2 py-1 rounded-md text-[10.5px] font-medium flex items-center justify-between transition-all cursor-pointer ${
                              filter === 'emulated-other' && !selectedGame
                                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] font-bold shadow-sm'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                            }`}
                            title="Other systems with less than 10 games"
                          >
                            <div className="flex items-center gap-1.5 truncate mr-1">
                              {filter === 'emulated-other' && !selectedGame && <Check className="w-2.5 h-2.5 shrink-0" />}
                              <span className="truncate font-semibold">Other</span>
                            </div>
                            <span className={`text-[8.5px] font-mono px-1 py-0.5 rounded shrink-0 ${
                              filter === 'emulated-other' && !selectedGame
                                ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                                : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                            }`}>
                              {totalOtherEmulatedGamesCount}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('featured'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'featured' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className={`transition-all duration-300 truncate ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Featured</span>
              </div>
              {sidebarOpen && (
                <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  filter === 'featured' && !selectedGame
                    ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                }`}>
                  {featuredGamesCount}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('og'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'og' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Crown className="w-3.5 h-3.5 shrink-0" />
                <span className={`transition-all duration-300 truncate ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>OG Classics</span>
              </div>
              {sidebarOpen && (
                <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  filter === 'og' && !selectedGame
                    ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                }`}>
                  {ogGamesCount}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('multiplayer'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'multiplayer' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className={`transition-all duration-300 truncate ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Multiplayer</span>
              </div>
              {sidebarOpen && (
                <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  filter === 'multiplayer' && !selectedGame
                    ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                }`}>
                  {multiplayerGamesCount}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => {
                setGameCatalogMode('all');
                safeStorage.setItem('unblocked-game-catalog-mode', 'all');
                setFilter('genizy-math');
                setSelectedGame(null);
              }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-all duration-200 cursor-pointer ${
                (filter === 'genizy-math' || filter === 'Genizy Math' || filter.toLowerCase() === 'genizy math') && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
              title="Genizy Math Games"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Calculator className="w-3.5 h-3.5 shrink-0" />
                <span className={`transition-all duration-300 truncate ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Genizy Math</span>
              </div>
              {sidebarOpen && (
                <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  (filter === 'genizy-math' || filter === 'Genizy Math' || filter.toLowerCase() === 'genizy math') && !selectedGame
                    ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                }`}>
                  {totalGenizyMathGamesCount}
                </span>
              )}
            </motion.button>

            {/* RANKING TIERS IN SIDEBAR (Below Multiplayer): S Tier, A Tier, B Tier, C Tier */}
            <div className="border-t border-[var(--card-border)]/60 my-1 pt-1.5 flex flex-col gap-1">
              {sidebarOpen && (
                <div className="px-2 py-0.5 text-[8.5px] font-mono tracking-wider text-[var(--text-muted)] uppercase font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[var(--accent-color)]">
                    <Trophy className="w-3 h-3" />
                    <span>Rankings</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => { setFilter('rankings'); setSelectedGame(null); }}
                    className={`text-[8px] font-mono hover:underline cursor-pointer transition-colors ${
                      filter === 'rankings' && !selectedGame
                        ? 'text-[var(--accent-color)] font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    All ({rankedGamesList.length})
                  </button>
                </div>
              )}

              {[
                {
                  tier: 'S',
                  name: 'S Tier',
                  desc: 'Masterpieces',
                  count: rankedGamesByTier.S?.length || 0,
                  badge:
                    mode === 'light'
                      ? 'text-amber-700 border-amber-400/60 bg-amber-100'
                      : 'text-amber-300 border-amber-300/50 bg-amber-400/20',
                },
                {
                  tier: 'A',
                  name: 'A Tier',
                  desc: 'Great',
                  count: rankedGamesByTier.A?.length || 0,
                  badge:
                    mode === 'light'
                      ? 'text-emerald-700 border-emerald-400/50 bg-emerald-100'
                      : 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
                },
                {
                  tier: 'B',
                  name: 'B Tier',
                  desc: 'Good',
                  count: rankedGamesByTier.B?.length || 0,
                  badge:
                    mode === 'light'
                      ? 'text-sky-700 border-sky-400/50 bg-sky-100'
                      : 'text-sky-400 border-sky-400/40 bg-sky-400/10',
                },
                {
                  tier: 'C',
                  name: 'C Tier',
                  desc: 'Mid & Niche',
                  count: rankedGamesByTier.C?.length || 0,
                  badge:
                    mode === 'light'
                      ? 'text-purple-700 border-purple-400/50 bg-purple-100'
                      : 'text-purple-400 border-purple-400/40 bg-purple-400/10',
                },
                {
                  tier: 'F',
                  name: 'F Tier',
                  desc: 'Lowest Ranked / Broken',
                  count: rankedGamesByTier.F?.length || 0,
                  badge:
                    mode === 'light'
                      ? 'text-rose-700 border-rose-400/50 bg-rose-100'
                      : 'text-rose-400 border-rose-400/40 bg-rose-400/10',
                },
              ].map(({ tier, name, count, badge }) => {
                const isSelected = filter === `tier-${tier}` && !selectedGame;
                return (
                  <motion.button
                    key={tier}
                    whileHover={animationsEnabled ? { x: 4 } : undefined}
                    whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
                    onClick={() => {
                      setFilter(`tier-${tier}`);
                      setSelectedGame(null);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                        : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-85 hover:opacity-100'
                    }`}
                    title={`${name} (${count} games)`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-4 h-4 rounded text-[9.5px] font-black font-mono flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)] border-white/35' : 'bg-black/25 text-[var(--bg-color)] border-white/20'
                          : badge
                      }`}>
                        {tier}
                      </span>
                      <span className={`transition-all duration-300 truncate font-semibold ${
                        sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'
                      }`}>
                        {name}
                      </span>
                    </div>
                    {sidebarOpen && (
                      <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        isSelected
                          ? mode === 'light' ? 'bg-white/25 text-[var(--bg-color)]' : 'bg-black/20 text-[var(--bg-color)]'
                          : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                      }`}>
                        {count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

          <div className="border-t border-solid border-[var(--card-border)] mt-2 pt-2.5 relative">
            <div className="flex items-center justify-between gap-1 pb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Dices className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                {sidebarOpen && (
                  <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-[var(--text-primary)] whitespace-nowrap">
                    Random Game
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 whitespace-nowrap shrink-0">
                  {randomEligibleCount} in pool
                </span>
              )}
            </div>

            <div className={`grid ${sidebarOpen ? 'grid-cols-2' : 'grid-cols-1'} gap-1.5`}>
              <button
                type="button"
                onClick={pickRandomRankedGame}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-2 py-1.5 text-[9px] font-black uppercase tracking-wider text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                title={`Roll a random game from ${randomEligibleCount} curated classics (S-C Tier)`}
              >
                <Dices className="w-3.5 h-3.5 shrink-0" />
                {sidebarOpen && <span>Roll Game</span>}
              </button>

              {sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setRandomPickerOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    randomPickerOpen
                      ? 'border-[var(--accent-color)] bg-[var(--card-bg)] text-[var(--accent-color)]'
                      : 'border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                  title="Customize pool tiers and sections"
                >
                  <Settings className="w-3 h-3 shrink-0" />
                  <span>Filters</span>
                </button>
              )}
            </div>

            <AnimatePresence>
              {randomPickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 right-0 z-30 mt-2 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-secondary)] p-3 shadow-2xl backdrop-blur-md"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--card-border)]/50">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                        Curated Pool ({randomEligibleCount})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRandomPickerOpen(false)}
                      className="rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)] cursor-pointer"
                      aria-label="Close random picker"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2.5 mb-3">
                    <div className="mb-1.5 text-[8.5px] font-mono uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      Game Section
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {rankedGameSections.map((section) => (
                        <button
                          key={section.key}
                          type="button"
                          onClick={() => setRandomRankingPool(section.key)}
                          className={`rounded-full border px-2 py-0.5 text-[8px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                            randomRankingPool === section.key
                              ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--bg-color)] font-bold'
                              : 'border-[var(--card-border)] bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {section.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-1.5 text-[8.5px] font-mono uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      Tiers in pool (tap to exclude)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {gameTierOrder.map((tier) => {
                        const excluded = excludedRandomTiers.includes(tier);
                        const tierBadges = {
                          S: excluded
                            ? 'border-amber-500/20 bg-amber-500/5 text-amber-500/30 line-through'
                            : 'border-amber-400/80 bg-amber-500/15 text-amber-300 font-extrabold shadow-[0_0_8px_rgba(251,191,36,0.15)]',
                          A: excluded
                            ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500/30 line-through'
                            : 'border-emerald-400/80 bg-emerald-500/15 text-emerald-300 font-extrabold',
                          B: excluded
                            ? 'border-sky-500/20 bg-sky-500/5 text-sky-500/30 line-through'
                            : 'border-sky-400/80 bg-sky-500/15 text-sky-300 font-extrabold',
                          C: excluded
                            ? 'border-purple-500/20 bg-purple-500/5 text-purple-500/30 line-through'
                            : 'border-purple-400/80 bg-purple-500/15 text-purple-300 font-extrabold',
                        };
                        return (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => toggleExcludedTier(tier)}
                            className={`rounded-md border px-2 py-1 text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                              tierBadges[tier] || 'border-[var(--card-border)] bg-[var(--bg-primary)]'
                            }`}
                            title={excluded ? `Include ${tier}-Tier` : `Exclude ${tier}-Tier`}
                          >
                            {tier}-Tier
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => toggleExcludedTier('EMULATED')}
                        className={`rounded-md border px-2 py-1 text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                          excludedRandomTiers.includes('EMULATED')
                            ? 'border-red-500/30 bg-red-500/5 text-red-400/40 line-through'
                            : 'border-neutral-500/40 bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-neutral-400'
                        }`}
                        title={excludedRandomTiers.includes('EMULATED') ? 'Include Emulated' : 'Exclude Emulated'}
                      >
                        Emulated
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[var(--bg-primary)]/80 border border-[var(--card-border)]/50 p-2 mb-3 text-[8.5px] font-mono text-[var(--text-muted)] space-y-1 leading-tight">
                    <div className="flex items-center justify-between text-[var(--text-primary)]">
                      <span>Curated pool size:</span>
                      <span className="font-bold text-[var(--accent-color)]">{randomEligibleCount} games</span>
                    </div>
                    <div className="text-[8px] text-neutral-400/80">
                      Auto-excludes ~2,000 unknown/unranked titles
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={pickRandomRankedGame}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-color)] px-2.5 py-2 text-[10px] font-black uppercase tracking-wider text-[var(--bg-color)] shadow-[0_6px_18px_var(--accent-shadow)] hover:opacity-95 active:scale-98 transition-all cursor-pointer"
                  >
                    <Dices className="w-4 h-4" />
                    Pick Random Game
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1" />

          {/* Request a Portal - Moved to bottom of sidebar */}
          <div className="pt-2 border-t border-[var(--card-border)]/50 mt-auto">
            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { window.open('https://forms.gle/YCN8itY7WqmN82CY8', '_blank'); }}
              className="w-full text-left py-1.5 px-2.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-200 cursor-pointer hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80 group"
              title="Request a Portal"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[var(--accent-color)] group-hover:scale-110 transition-transform" />
              <span className={`transition-all duration-300 truncate ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>
                Request a Portal
              </span>
            </motion.button>
          </div>

        </aside>
        )}



        {/* MAIN BODY DISPLAY */}
        <main className="flex-1 min-w-0 flex flex-col h-full min-h-0">
          <AnimatePresence>
            {workspaceConfig?.broadcastMessage && dismissedBroadcastId !== workspaceConfig.broadcastId && (
              <motion.div
                key={workspaceConfig.broadcastId || 'admin-broadcast'}
                initial={animationsEnabled ? { opacity: 0, y: -8 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={animationsEnabled ? { opacity: 0, y: -8 } : undefined}
                transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                className={`${
                  selectedGame || (adminAccountsModalOpen && hasAdminAccess) || isPortalWorkspaceFilter(filter) || filter === 'info'
                    ? 'mx-2 my-1.5 rounded-lg'
                    : 'mb-4 rounded-xl'
                } shrink-0 border border-[var(--accent-color)]/45 bg-[var(--bg-secondary)] shadow-md px-3.5 py-2.5 flex items-start sm:items-center justify-between gap-3`}
                role="region"
                aria-label="Admin Announcement"
              >
                <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/35 text-[var(--accent-color)] flex items-center justify-center shrink-0">
                    <Megaphone className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--accent-color)] text-[var(--bg-color)]">
                        Admin Announcement
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                        From {workspaceConfig.broadcastSender || 'Admin'}
                        {workspaceConfig.broadcastAt
                          ? ` · ${new Date(workspaceConfig.broadcastAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : ''}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[var(--text-primary)] mt-1 break-words leading-snug">
                      {workspaceConfig.broadcastMessage}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const id = workspaceConfig.broadcastId || String(workspaceConfig.broadcastAt || 'active');
                    setDismissedBroadcastId(id);
                    safeStorage.setItem('unblocked-dismissed-broadcast-id', id);
                  }}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] border border-transparent hover:border-[var(--card-border)] transition-colors cursor-pointer shrink-0"
                  title="Dismiss Announcement"
                  aria-label="Dismiss Announcement"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {adminAccountsModalOpen && hasAdminAccess ? (
            <div className="flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden bg-[var(--bg-secondary)]">
              <AdminAccountsModal
                isOpen={true}
                isInline={true}
                onClose={() => setAdminAccountsModalOpen(false)}
                db={lobbyDb}
                auth={lobbyAuth}
                mode={mode}
                activeAccount={activeAccount}
                workspaceConfig={workspaceConfig}
                games={games}
              />
            </div>
          ) : !selectedGame ? (
            <AnimatePresence mode="wait">
              {filter === 'chat' ? (
                <motion.div 
                  key="chat"
                  initial={animationsEnabled ? { opacity: 0, y: 15 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -15 } : undefined}
                  transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                  className="flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden bg-[var(--bg-secondary)]"
                >
                  {isAdminUnlocked ? (
                    <AiChatWorkspace onClose={() => setFilter('all')} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[320px] p-6 text-center select-none">
                      <form onSubmit={handleAdminPasswordSubmit}>
                        <input
                          type="password"
                          value={adminPasswordInput}
                          onChange={(e) => {
                            setAdminPasswordInput(e.target.value);
                            if (adminError) setAdminError('');
                          }}
                          placeholder={adminError || "Enter password..."}
                          autoFocus
                          className={`w-56 bg-[#0f0e17] border rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-400 shadow-2xl outline-none transition-all font-mono text-center ${
                            adminError 
                              ? 'border-red-500 placeholder-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]' 
                              : 'border-white/20 focus:border-[var(--accent-color)] shadow-[0_4px_24px_rgba(0,0,0,0.7)]'
                          }`}
                        />
                      </form>
                    </div>
                  )}
                </motion.div>
              ) : filter === 'lobbychat' && canLobbyChatAccess ? (
                <motion.div 
                  key="lobbychat"
                  initial={animationsEnabled ? { opacity: 0, y: 15 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -15 } : undefined}
                  transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                  className="flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden bg-[var(--bg-secondary)]"
                >
                  <UserChat
                    onClose={() => setFilter('all')}
                    activeAccount={activeAccount}
                    isOwnerAdmin={isOwnerAdmin}
                    onOpenAccountModal={() => setAccountModalOpen(true)}
                    targetChannelRequest={targetChannelRequest}
                    onActiveChannelChange={handleActiveLobbyChannelChange}
                    workspaceConfig={workspaceConfig}
                  />
                </motion.div>
              ) : filter === 'info' ? (
                <motion.div 
                  key="info"
                  initial={animationsEnabled ? { opacity: 0, y: 15 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -15 } : undefined}
                  transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                  className="flex-1 flex flex-col w-full h-full min-h-0 bg-[var(--bg-secondary)] overflow-hidden"
                >
                  <InformationSection 
                    onClose={() => setFilter('all')} 
                    games={canGamesAccess ? games : []}
                    onPlayGame={(game) => {
                      if (canGamesAccess) launchGame(game);
                    }}
                    onGoToFeatured={() => {
                      setFilter('featured');
                      setSelectedGame(null);
                    }}
                    onDownloadWebsite={canDownloadAccess ? downloadEntireWebsite : undefined}
                  />
                </motion.div>
              ) : (filter === 'movies' && canMoviesAccess) ||
                (filter === 'moremovies' && canMoreMoviesAccess) ||
                (filter === 'youtube' && canYoutubeAccess) ||
                (filter === 'download' && canDownloadAccess) ? (
                <motion.div
                  key={filter}
                  initial={animationsEnabled ? { opacity: 0, y: 15 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -15 } : undefined}
                  transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                  className="flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden bg-[var(--bg-secondary)]"
                >
                  <PortalWorkspaceView workspaceId={filter} onClose={() => setFilter('all')} />
                </motion.div>
              ) : !canGamesAccess ? (
                <motion.div
                  key="games-restricted"
                  initial={animationsEnabled ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  exit={animationsEnabled ? { opacity: 0 } : undefined}
                  transition={animationsEnabled ? { duration: 0.14 } : { duration: 0 }}
                  className="flex flex-col items-center justify-center py-20 px-6 text-center border border-dashed border-[var(--card-border)] rounded-2xl bg-[var(--bg-secondary)] max-w-xl mx-auto my-8"
                >
                  <Lock className="w-12 h-12 text-rose-400/80 mb-3" />
                  <h2 className="text-base font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Games Catalog Restricted
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed max-w-md">
                    Access to Games &amp; Portals has been disabled for this workspace or your account by the administrator. Use another enabled workspace from the header above or contact the admin.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="games-list"
                  initial={animationsEnabled ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  exit={animationsEnabled ? { opacity: 0 } : undefined}
                  transition={animationsEnabled ? { duration: 0.14 } : { duration: 0 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left group: Title & Subtitle + Combined Switcher & Pagination Bar */}
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <div className="border-l-[3px] border-[var(--accent-color)] pl-2.5 shrink-0 transition-colors">
                    <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[var(--text-primary)] leading-tight">
                      {normalizedSearchQuery !== '' ? (
                        `SEARCH: "${searchQuery}"`
                      ) : (
                        <>
                          {filter === 'all' && (gameCatalogMode === 'original' ? 'ORIGINALS' : 'ALL PORTALS')}
                          {filter === 'favorites' && 'BOOKMARKS'}
                          {filter === 'rankings' && 'GAME RANKINGS LEADERBOARD'}
                          {filter === 'tier-S' && 'TIER S: MASTERPIECES & ALL-TIME CLASSICS'}
                          {filter === 'tier-A' && 'TIER A: GREAT & HUGELY POPULAR'}
                          {filter === 'tier-B' && 'TIER B: WEB & FLASH CLASSICS'}
                          {filter === 'tier-C' && 'TIER C: RECOGNIZABLE & NICHE'}
                          {filter === 'tier-F' && 'TIER F: LOWEST RANKED / BROKEN / DUPES'}
                          {filter === 'featured' && 'FEATURED SHOWCASES'}
                          {filter === 'girls-featured' && 'GIRLS MODE FEATURED'}
                          {filter === 'og' && 'OG CLASSICS & ORIGINALS'}
                          {filter === 'single' && 'SINGLEPLAYER PORTALS'}
                          {filter === 'multiplayer' && 'MULTIPLAYER PORTALS'}
                          {filter === 'Emulated' && 'EMULATED ARCHIVES'}
                          {filter === 'emulated-other' && 'EMULATED: OTHER SYSTEMS (<10 GAMES)'}
                          {emulatedTags.includes(filter) && `EMULATED: ${(EMULATED_SYSTEM_NAMES[filter] || filter).toUpperCase()}`}
                          {filter === 'minecraft' && 'MINECRAFT PLATFORM'}
                          {(filter === 'genizy-math' || filter === 'Genizy Math' || filter.toLowerCase() === 'genizy math') && 'GENIZY MATH COLLECTION'}
                        </>
                      )}
                    </h2>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">
                      {normalizedSearchQuery !== ''
                        ? `Found ${filteredGames.length} portals · Page ${safeGamePage} of ${totalGamePages}`
                        : filter === 'girls-featured'
                        ? `Exclusive featured picks for Girls Mode · ${filteredGames.length} featured · Page ${safeGamePage} of ${totalGamePages}`
                        : isRankingsActive
                        ? `Curated community rankings · ${filteredGames.length} ranked portals · Page ${safeGamePage} of ${totalGamePages}`
                        : `Showing ${filteredGames.length} unblocked resources · Page ${safeGamePage} of ${totalGamePages}`}
                    </p>
                  </div>

                  {/* Combined Switcher & Pagination Capsule */}
                  <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--card-border)] p-0.5 rounded-xl shadow-sm select-none shrink-0 flex-wrap sm:flex-nowrap gap-0.5 transition-colors">
                    {/* Catalog Mode Switcher */}
                    <button
                      type="button"
                      onClick={() => {
                        setGameCatalogMode('original');
                        safeStorage.setItem('unblocked-game-catalog-mode', 'original');
                        setCurrentGamePage(1);
                      }}
                      className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer tracking-wider ${
                        gameCatalogMode === 'original'
                          ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                      }`}
                    >
                      ORIGINALS ({ogGamesCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGameCatalogMode('all');
                        safeStorage.setItem('unblocked-game-catalog-mode', 'all');
                        setCurrentGamePage(1);
                      }}
                      className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer tracking-wider ${
                        gameCatalogMode === 'all'
                          ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                      }`}
                    >
                      ALL PORTALS ({hideUnranked ? `${rankedGamesList.filter(g => ['S', 'A', 'B', 'C', 'D'].includes(g.rankTier)).length} ranked` : games.length})
                    </button>

                    {/* Slider Switch for Hide Unranked (default ON) */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hideUnranked}
                      onClick={() => {
                        const next = !hideUnranked;
                        setHideUnranked(next);
                        safeStorage.setItem('unblocked-hide-unranked', String(next));
                        setCurrentGamePage(1);
                      }}
                      className={`group flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer select-none border ${
                        hideUnranked
                          ? 'bg-[var(--accent-color)]/15 text-[var(--accent-color)] border-[var(--accent-color)]/30 hover:border-[var(--accent-color)]/60'
                          : mode === 'light'
                            ? 'bg-white/75 text-[var(--text-muted)] border-[var(--card-border)]/70 hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                            : 'bg-white/5 text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                      }`}
                      title={hideUnranked ? "Games below D tier and unranked games are hidden. Click to show all games." : "All games are visible. Click to hide entries below D tier."}
                    >
                      <span className="truncate">Hide Unranked</span>
                      <div className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                        hideUnranked
                          ? 'bg-[var(--accent-color)]'
                          : mode === 'light'
                            ? theme === 'girls' ? 'bg-pink-200/90' : 'bg-neutral-300'
                            : 'bg-neutral-700'
                      }`}>
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out ${
                            hideUnranked
                              ? 'translate-x-3 bg-white'
                              : mode === 'light' ? 'translate-x-0 bg-white' : 'translate-x-0 bg-neutral-300'
                          }`}
                        />
                      </div>
                    </button>

                    {/* Subtle divider */}
                    <div className="h-4 w-[1px] bg-[var(--card-border)] mx-1 hidden sm:block" />

                    {/* Layout Mode Switcher (Standard / Compact) */}
                    {!isGenizyView && (
                      <div className={`flex items-center gap-0.5 p-0.5 rounded-lg border border-[var(--card-border)]/70 ${
                        mode === 'light' ? 'bg-white/75' : 'bg-white/5'
                      }`}>
                        <button
                          type="button"
                          onClick={() => {
                            setGameLayoutMode('standard');
                            safeStorage.setItem('unblocked-game-layout-mode', 'standard');
                            setCurrentGamePage(1);
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            gameLayoutMode === 'standard'
                              ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                          }`}
                          title="Standard card layout"
                        >
                          <LayoutGrid className="w-3 h-3" />
                          <span className="hidden sm:inline">Standard</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGameLayoutMode('compact');
                            safeStorage.setItem('unblocked-game-layout-mode', 'compact');
                            setCurrentGamePage(1);
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            gameLayoutMode === 'compact'
                              ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                          }`}
                          title="Compact layout fitting more games per row"
                        >
                          <Grid3X3 className="w-3 h-3" />
                          <span className="hidden sm:inline">Compact</span>
                        </button>
                      </div>
                    )}

                    {/* Prev / Page / Next Integrated Controls */}
                    <div className="flex items-center gap-1 font-mono pl-0.5">
                      <button
                        type="button"
                        onClick={() => setCurrentGamePage((page) => Math.max(1, page - 1))}
                        disabled={safeGamePage === 1}
                        className={`flex items-center gap-0.5 text-[10px] font-mono font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                          safeGamePage > 1
                            ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm hover:opacity-90'
                            : 'text-[var(--text-muted)] opacity-30 pointer-events-none'
                        }`}
                        title="Previous Page"
                      >
                        <ChevronLeft className="w-3 h-3" />
                        <span>Prev</span>
                      </button>

                      <span className="text-[10px] font-mono font-bold text-[var(--text-primary)] px-1.5 select-none tracking-wider whitespace-nowrap">
                        {safeGamePage} / {totalGamePages}
                      </span>

                      <button
                        type="button"
                        onClick={() => setCurrentGamePage((page) => Math.min(totalGamePages, page + 1))}
                        disabled={safeGamePage === totalGamePages}
                        className={`flex items-center gap-0.5 text-[10px] font-mono font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                          safeGamePage < totalGamePages
                            ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm hover:opacity-90'
                            : 'text-[var(--text-muted)] opacity-30 pointer-events-none'
                        }`}
                        title="Next Page"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {filteredGames.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--card-border)] rounded-2xl bg-[var(--bg-secondary)]">
                  <Gamepad2 className="w-16 h-16 text-[var(--text-muted)] stroke-1 opacity-40 animate-pulse" />
                  <p className="text-sm font-semibold mt-4 text-[var(--text-primary)]">No portals found matching filter</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Try searching a different keyword or resetting filters.</p>
                </div>
              ) : (
                <div className={
                  isCompactLayout
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3.5"
                    : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                }>
                  {paginatedGames.map((game, index) => {
                    const isFav = favorites.includes(game.id);
                    return (
                      <motion.div 
                        key={game.id}
                        id={game.title === 'Air Hockey' ? 'air-hockey-game-card' : undefined}
                        initial={animationsEnabled ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        exit={animationsEnabled ? { opacity: 0 } : undefined}
                        transition={animationsEnabled ? { duration: 0.12 } : { duration: 0 }}
                        onClick={() => {
                          launchGame(game);
                        }}
                        className={`custom-card flex flex-col rounded-xl overflow-hidden cursor-pointer h-full ${
                          theme === 'girls' && game.girlsFeatured
                            ? 'border-pink-400/45 hover:border-pink-500 shadow-sm'
                            : game.featured 
                              ? 'border-amber-500/20 hover:border-amber-500/50 shadow-sm' 
                              : ''
                        }`}
                      >
                        {/* Artwork container */}
                        <div className={`relative w-full flex-shrink-0 flex items-center justify-center border-b border-[var(--card-border)] overflow-hidden ${
                          theme === 'girls' && mode === 'light'
                            ? 'bg-[#fdf2f6]'
                            : mode === 'light'
                              ? 'bg-neutral-100'
                              : 'bg-neutral-950'
                        } ${
                          isCompactLayout ? 'aspect-square' : 'aspect-video'
                        }`}>
                          {game.thumbnail && !failedThumbnails[game.id] ? (
                            <img 
                              src={getOptimizedThumbnail(game.thumbnail)} 
                              alt={game.title} 
                              width={isCompactLayout ? "300" : "640"}
                              height={isCompactLayout ? "300" : "360"}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              draggable="false"
                              onError={(e) => {
                                const raw = String(game.thumbnail || '').trim();
                                if (raw && !/^(https?:|data:)/i.test(raw)) {
                                  const base = raw.replace(/^\/+/, '').replace(/^public\//i, '').replace(/^thumbnails\//i, '').split('/').pop();
                                  const fallbacks = base
                                    ? [`/${encodeURI(base)}`, `/assets/${encodeURI(base)}`, `/assets/aistudio/${encodeURI(base)}`, `/Gmfiles/${encodeURI(base)}`]
                                    : [];
                                  const step = Number(e.currentTarget.dataset.fallbackStep || '0');
                                  if (step < fallbacks.length) {
                                    e.currentTarget.dataset.fallbackStep = String(step + 1);
                                    e.currentTarget.src = fallbacks[step];
                                    return;
                                  }
                                }
                                setFailedThumbnails(prev => ({ ...prev, [game.id]: true }));
                              }}
                              className="w-full h-full object-cover select-none pointer-events-none" 
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center select-none pointer-events-none ${
                                theme === 'girls' && mode === 'light'
                                  ? 'bg-gradient-to-br from-[#fff5f8] via-[#fdf2f6] to-[#fce7f3]'
                                  : mode === 'light'
                                    ? 'bg-neutral-100'
                                    : 'bg-[#050505]'
                              }`}
                              aria-label={game.title}
                            >
                              <Gamepad2
                                className={`${isCompactLayout ? 'w-9 h-9' : 'w-12 h-12'} ${
                                  theme === 'girls' && mode === 'light'
                                    ? 'text-pink-400/80'
                                    : mode === 'light'
                                      ? 'text-neutral-400'
                                      : 'text-neutral-400/80'
                                }`}
                                strokeWidth={1.75}
                                aria-hidden="true"
                              />
                            </div>
                          )}

                          {/* Rank badge on game card */}
                          {(() => {
                            const rankInfo = getGameRankInfo(game);
                            if (rankInfo && (isRankingsActive || rankInfo.rank <= 10)) {
                              return (
                                <span className={`absolute top-2 left-2 z-10 flex items-center gap-1 font-black rounded-md shadow-md font-mono ${
                                  isCompactLayout ? 'text-[8px] px-1.5 py-0.5' : 'text-[9px] px-2 py-0.5'
                                } ${
                                  rankInfo.rank === 1
                                    ? 'bg-amber-400 text-black border border-amber-300'
                                    : rankInfo.rank === 2
                                    ? 'bg-slate-200 text-slate-900 border border-slate-300'
                                    : rankInfo.rank === 3
                                    ? 'bg-amber-700 text-amber-100 border border-amber-600'
                                    : 'bg-black/90 text-amber-300 border border-amber-400/40'
                                }`}>
                                  <Trophy className={`${isCompactLayout ? 'w-2 h-2' : 'w-2.5 h-2.5'} shrink-0`} />
                                  <span>#{rankInfo.rank} · TIER {rankInfo.tier}</span>
                                </span>
                              );
                            }
                            if (theme === 'girls' && game.girlsFeatured) {
                              return (
                                <span className={`absolute top-2 left-2 font-black rounded-md inline-flex items-center justify-center gap-1 z-10 shadow-sm font-mono border ${
                                  mode === 'light'
                                    ? 'bg-[#db2777] text-white border-pink-300/60'
                                    : 'bg-[#2c1227]/95 text-pink-300 border-pink-400/45'
                                } ${
                                  isCompactLayout ? 'text-[9px] px-1.5 h-5' : 'text-[9px] px-2 h-6'
                                }`}>
                                  <span>♥</span>
                                  {!isCompactLayout && <span>FEATURED</span>}
                                </span>
                              );
                            }
                            if (game.featured) {
                              return (
                                <span className={`absolute top-2 left-2 font-black bg-black/85 text-amber-400 border border-amber-500/30 rounded-md inline-flex items-center justify-center z-10 shadow-sm font-mono ${
                                  isCompactLayout ? 'text-[10px] w-5 h-5' : 'text-[12px] w-6 h-6'
                                }`}>
                                  ★
                                </span>
                              );
                            }
                            return null;
                          })()}

                          <span className={`absolute top-2 right-2 font-bold uppercase tracking-widest border rounded-full inline-block z-10 ${
                            isCompactLayout ? 'text-[7px] px-1.5 py-0.5' : 'text-[8px] px-2.5 py-0.5'
                          } ${
                            theme === 'girls' && mode === 'light' && (!game.thumbnail || failedThumbnails[game.id])
                              ? 'bg-white/95 text-[#9d174d] border-pink-200/90 shadow-xs'
                              : theme === 'girls' && mode === 'light'
                                ? 'bg-[#2d1624]/90 text-white border-pink-200/25'
                                : 'bg-black/85 text-white border-white/10'
                          }`}>
                            {game.category}
                          </span>

                          {game.isAiGenerated && (
                            <span className="absolute bottom-2 left-2 flex items-center gap-1 text-[7.5px] font-extrabold tracking-wider bg-black/90 text-white border border-white/20 px-2 py-0.5 rounded-full inline-flex z-10 shadow-sm font-mono uppercase">
                              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="currentColor" />
                              </svg>
                              <span>Gemini</span>
                            </span>
                          )}

                        </div>

                        {/* Title and descriptions */}
                        <div className={`games-card-copy flex-1 flex flex-col justify-between ${
                          isCompactLayout ? 'p-2.5 sm:p-3' : 'p-4'
                        }`}>
                          <div className={isCompactLayout ? "space-y-1" : "space-y-1.5"}>
                            <h3 className={`games-card-copy-title font-black line-clamp-1 leading-snug transition-colors flex items-center gap-1.5 ${
                              isCompactLayout ? 'text-xs' : 'text-sm'
                            } ${
                              game.featured 
                                ? mode === 'light' ? 'text-[var(--text-primary)] group-hover:text-amber-600' : 'text-[var(--text-primary)] group-hover:text-amber-400' 
                                : 'text-[var(--text-primary)] group-hover:text-[var(--accent-color)]'
                            }`}>
                              <span className="min-w-0 flex-1 truncate">{game.title}</span>
                              {game.isAiGenerated && (
                                <span className="inline-flex items-center px-1 py-0.5 rounded bg-[var(--accent-color)]/10 border border-[var(--card-border)] text-[var(--text-primary)]" title="Gemini AI Generated">
                                  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="currentColor" />
                                  </svg>
                                </span>
                              )}
                              {!isCompactLayout && (
                                <div className="ml-auto flex items-center gap-1.5 shrink-0">
                                  <span className="text-[9px] font-mono text-[var(--text-muted)] font-medium select-none tracking-tight">
                                    (Dev tools)
                                  </span>
                                  <button
                                    type="button"
                                    aria-label={`Copy piece path for ${game.title} (Dev tools)`}
                                    title={`Copy piece path for ${game.title} (Dev tools)`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyTextToClipboard(getGamePathName(game.url));
                                    }}
                                    className="p-1 rounded border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label={`Copy piece title for ${game.title} (Dev tools)`}
                                    title={`Copy piece title for ${game.title} (Dev tools)`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyTextToClipboard(game.title);
                                    }}
                                    className="p-1 rounded border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </h3>
                            <p className={`text-[var(--text-muted)] leading-relaxed ${
                              isCompactLayout ? 'text-[11px] line-clamp-2' : 'text-xs line-clamp-3'
                            }`}>
                              {game.description}
                            </p>
                          </div>

                          <div className={`flex items-center gap-1.5 w-full ${isCompactLayout ? 'mt-2' : 'mt-3'}`}>
                            {game.featured ? (
                              <button
                                onClick={() => {
                                  launchGame(game);
                                }}
                                className={`flex-1 border font-semibold tracking-wider rounded-lg flex items-center justify-center gap-1 transition-all duration-200 uppercase cursor-pointer ${
                                  mode === 'light'
                                    ? 'border-amber-400/50 bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white hover:font-bold hover:shadow-[0_4px_14px_rgba(245,158,11,0.3)]'
                                    : 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500 hover:text-black hover:font-bold hover:shadow-[0_4px_14px_rgba(245,158,11,0.35)] text-amber-500 dark:text-amber-400'
                                } ${
                                  isCompactLayout ? 'py-1.5 px-2 text-[10px]' : 'py-2 px-3 text-[11px]'
                                }`}
                              >
                                <Play className={`${isCompactLayout ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill-current`} />
                                <span>Play</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  launchGame(game);
                                }}
                                className={`flex-1 border border-[var(--card-border)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] hover:border-[var(--accent-color)] hover:font-bold hover:shadow-[0_4px_14px_var(--accent-shadow)] font-semibold tracking-wider rounded-lg flex items-center justify-center gap-1 transition-all duration-200 uppercase cursor-pointer ${
                                  theme === 'girls' && mode === 'light'
                                    ? 'bg-[#fdf2f6] text-[#9d174d]'
                                    : 'bg-[var(--accent-color)]/5 text-[var(--text-primary)]'
                                } ${
                                  isCompactLayout ? 'py-1.5 px-2 text-[10px]' : 'py-2 px-3 text-[11px]'
                                }`}
                              >
                                <Play className={`${isCompactLayout ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill-current`} />
                                <span>Play</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                recordRecentlyPlayed(game.id);
                                openGameInAboutBlank(game);
                              }}
                              className={`border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] bg-[var(--bg-secondary)] hover:bg-[var(--card-bg)] rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                                isCompactLayout ? 'p-1.5' : 'p-2'
                              }`}
                              title="Open Portal in about:blank"
                              aria-label={`Open ${game.title} in about:blank`}
                            >
                              <ExternalLink className={isCompactLayout ? "w-3.5 h-3.5" : "w-4 h-4"} />
                            </button>

                            {isLocalGame(game.url) && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    recordRecentlyPlayed(game.id);
                                    setGameFrame(null);
                                    window.open(getDirectGmfilesUrl(game.url), '_blank');
                                  }}
                                  className={`border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] bg-[var(--bg-secondary)] hover:bg-[var(--card-bg)] rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                                    isCompactLayout ? 'p-1.5' : 'p-2'
                                  }`}
                                  title={`Open Direct Link (${getDirectGmfilesUrl(game.url)})`}
                                >
                                  <svg viewBox="0 0 24 24" className={isCompactLayout ? "w-3.5 h-3.5" : "w-4 h-4"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                  </svg>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const link = document.createElement('a');
                                    link.href = getLocalGameDownloadUrl(game.url);
                                    link.download = game.url.split('/').pop() || game.url;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className={`border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] bg-[var(--bg-secondary)] hover:bg-[var(--card-bg)] rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                                    isCompactLayout ? 'p-1.5' : 'p-2'
                                  }`}
                                  title="Download Offline Piece (.html)"
                                >
                                  <Download className={isCompactLayout ? "w-3.5 h-3.5" : "w-4 h-4"} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-[var(--card-border)]/50 flex-wrap">
                {/* Catalog Mode Switcher at bottom */}
                <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--card-border)] p-0.5 rounded-xl shadow-sm select-none gap-0.5 transition-colors">
                  <button
                    type="button"
                    onClick={() => {
                      setGameCatalogMode('original');
                      safeStorage.setItem('unblocked-game-catalog-mode', 'original');
                      setCurrentGamePage(1);
                    }}
                    className={`text-[10px] font-mono font-black uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer tracking-wider ${
                      gameCatalogMode === 'original'
                        ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                    }`}
                  >
                    ORIGINALS ({ogGamesCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGameCatalogMode('all');
                      safeStorage.setItem('unblocked-game-catalog-mode', 'all');
                      setCurrentGamePage(1);
                    }}
                    className={`text-[10px] font-mono font-black uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer tracking-wider ${
                      gameCatalogMode === 'all'
                        ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                    }`}
                  >
                    ALL PORTALS ({hideUnranked ? `${rankedGamesList.filter(g => ['S', 'A', 'B', 'C', 'D'].includes(g.rankTier)).length} ranked` : games.length})
                  </button>

                  {/* Bottom Slider Switch for Hide Unranked */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={hideUnranked}
                    onClick={() => {
                      const next = !hideUnranked;
                      setHideUnranked(next);
                      safeStorage.setItem('unblocked-hide-unranked', String(next));
                      setCurrentGamePage(1);
                    }}
                    className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer select-none border ${
                      hideUnranked
                        ? 'bg-[var(--accent-color)]/15 text-[var(--accent-color)] border-[var(--accent-color)]/30 hover:border-[var(--accent-color)]/60'
                        : mode === 'light'
                          ? 'bg-white/75 text-[var(--text-muted)] border-[var(--card-border)]/70 hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                          : 'bg-white/5 text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                    }`}
                    title={hideUnranked ? "Games below D tier and unranked games are hidden. Click to show all games." : "All games are visible. Click to hide entries below D tier."}
                  >
                    <span className="truncate">Hide Unranked</span>
                    <div className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                      hideUnranked
                        ? 'bg-[var(--accent-color)]'
                        : mode === 'light'
                          ? theme === 'girls' ? 'bg-pink-200/90' : 'bg-neutral-300'
                          : 'bg-neutral-700'
                    }`}>
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out ${
                          hideUnranked
                            ? 'translate-x-3 bg-white'
                            : mode === 'light' ? 'translate-x-0 bg-white' : 'translate-x-0 bg-neutral-300'
                        }`}
                      />
                    </div>
                  </button>
                </div>

                {/* Pagination Controls */}
                {totalGamePages > 1 && (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentGamePage((page) => Math.max(1, page - 1))}
                      disabled={safeGamePage === 1}
                      className="flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3.5 py-2 text-xs font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] disabled:cursor-not-allowed disabled:opacity-40 shadow-sm cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Go Back
                    </button>
                    <span className="min-w-24 text-center font-mono text-xs text-[var(--text-muted)] font-bold">
                      Page {safeGamePage} of {totalGamePages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentGamePage((page) => Math.min(totalGamePages, page + 1))}
                      disabled={safeGamePage === totalGamePages}
                      className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-3.5 py-2 text-xs font-extrabold text-[var(--bg-color)] transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm cursor-pointer"
                    >
                      Next Page
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
          ) : (
            /* ACTIVE GAME SCREEN */
            <div className={`flex flex-col flex-1 h-full min-h-0 animate-fade-in ${windowFullscreen ? 'fixed inset-0 z-[9999] bg-[#0c0f16] p-0 w-screen h-screen overflow-hidden gap-0' : 'gap-0 flex-1 h-full min-h-0'}`}>
              
              {/* Controls bar */}
              {windowFullscreen ? (
                <div className="absolute top-4 right-4 z-[10000]">
                  <button
                    onClick={() => setWindowFullscreen(false)}
                    className="flex items-center justify-center w-8 h-8 bg-black/40 hover:bg-black/65 border border-white/10 hover:border-white/25 text-white/85 hover:text-white transition-all rounded-lg backdrop-blur-md cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.4)] active:scale-95 animate-fade-in"
                    title="Exit Window Fullscreen"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className={`sticky ${gameHeaderHidden ? 'top-0' : headerOpen ? 'top-[108px] sm:top-[56px]' : 'top-[108px] md:top-[44px]'} z-[50] shrink-0 flex flex-row items-center justify-between border-b border-[var(--card-border)] bg-[var(--bg-secondary)] rounded-none py-1 px-2 sm:px-3 gap-1.5 sm:gap-2 shadow-inner min-h-[34px] h-[34px] overflow-hidden select-none`}>
                  
                  {/* Left: Back button + Auto-truncating Title & Tag */}
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden mr-1">
                    <button
                      onClick={() => {
                        safeStorage.removeItem('unblocked-last-game');
                        setSelectedGame(null);
                      }}
                      className="flex items-center gap-1 h-6 border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all font-mono py-0.5 px-2 rounded-md text-[11px] font-bold leading-none cursor-pointer shrink-0"
                      title="Go back to portals list"
                    >
                      <ArrowLeft className="w-3 h-3 shrink-0" />
                      <span className="hidden xs:inline sm:inline">Go back</span>
                    </button>

                    <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden" title={selectedGame.title}>
                      <span className="font-bold text-xs text-[var(--text-primary)] truncate block min-w-0 tracking-tight">
                        {selectedGame.title}
                      </span>
                      <span className="hidden md:inline-flex text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border border-[var(--card-border)] bg-[var(--bg-color)] text-[var(--accent-color)] shrink-0 truncate max-w-[120px]">
                        {selectedGame.category}
                      </span>
                      {selectedGame.isAiGenerated && (
                        <span className="hidden lg:inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border border-[var(--card-border)] bg-[var(--accent-color)]/10 text-[var(--text-primary)] shrink-0">
                          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="currentColor" />
                          </svg>
                          <span>Gemini AI</span>
                        </span>
                      )}
                      {renderChatHeaderNotice('game')}
                    </div>
                  </div>

                  {/* Right: Controls toolbar (compact single-row flex-nowrap) */}
                  <div className="flex items-center gap-1 shrink-0 flex-nowrap overflow-x-auto scrollbar-none">
                    
                    {/* Zoom controls */}
                    <div className="flex items-center h-6 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-md overflow-hidden px-0.5 shrink-0">
                      <button
                        onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
                        className="p-0.5 px-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded transition-colors cursor-pointer"
                        title="Zoom Out"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[9.5px] px-1 font-mono text-[var(--text-primary)] font-bold select-none tabular-nums">
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        onClick={() => setZoom(z => Math.min(1.8, z + 0.1))}
                        className="p-0.5 px-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded transition-colors cursor-pointer"
                        title="Zoom In"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setZoom(1)}
                        className="p-0.5 px-1 text-[9.5px] font-bold text-[var(--accent-color)] font-mono hover:bg-[var(--card-bg)] rounded transition-colors cursor-pointer"
                        title="Reset Zoom"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Reload button */}
                    <button
                      onClick={() => {
                        const iframe = /** @type {HTMLIFrameElement | null} */ (document.getElementById('game-frame'));
                        if (iframe) iframe.src = iframe.src;
                      }}
                      className="flex items-center gap-1 h-6 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-0.5 px-1.5 rounded-md text-[var(--text-primary)] font-mono font-medium transition-all cursor-pointer shrink-0"
                      title="Reload Iframe (Refresh portal frame)"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span className="hidden sm:inline text-[9.5px] font-bold tracking-tight">Iframe</span>
                    </button>

                    {/* Refresh Page button */}
                    <button
                      onClick={handleRefreshPage}
                      className="flex items-center gap-1 h-6 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-0.5 px-1.5 rounded-md text-[var(--text-primary)] font-mono font-medium transition-all cursor-pointer shrink-0"
                      title="Refresh Entire Page (Safe reload for about:blank)"
                    >
                      <RotateCcw className={`w-3 h-3 text-[var(--accent-color)] ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline text-[9.5px] font-bold tracking-tight">Page</span>
                    </button>

                    {/* Direct Gmfiles Link button for local public games */}
                    {selectedGame && isLocalGame(selectedGame.url) && (
                      <button
                        onClick={() => {
                          setGameFrame(null);
                          window.open(getDirectGmfilesUrl(selectedGame.url), '_blank');
                        }}
                        className="flex items-center gap-1 h-6 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-0.5 px-1.5 rounded-md text-[var(--text-primary)] font-mono font-medium transition-all cursor-pointer shrink-0"
                        title={`Open Direct Link (${getDirectGmfilesUrl(selectedGame.url)})`}
                      >
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <span className="hidden sm:inline text-[9.5px] font-bold tracking-tight">Link</span>
                      </button>
                    )}

                    {/* Download button for local public games */}
                    {selectedGame && isLocalGame(selectedGame.url) && (
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = getLocalGameDownloadUrl(selectedGame.url);
                          link.download = selectedGame.url.split('/').pop() || selectedGame.url;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="flex items-center gap-1 h-6 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-0.5 px-1.5 rounded-md text-[var(--text-primary)] font-mono font-medium transition-all cursor-pointer shrink-0"
                        title="Download Offline (.html)"
                      >
                        <Download className="w-3 h-3 text-[var(--accent-color)]" />
                      </button>
                    )}

                    {/* Fullscreen button */}
                    <button
                      onClick={() => {
                        const container = document.getElementById('frame-viewport');
                        if (container) {
                          if (document.fullscreenElement) {
                            document.exitFullscreen();
                          } else {
                            container.requestFullscreen();
                          }
                        }
                      }}
                      className="flex items-center gap-1 h-6 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-0.5 px-1.5 rounded-md text-[var(--text-primary)] font-mono font-medium transition-all cursor-pointer shrink-0"
                      title="Toggle Fullscreen Arena (FS)"
                    >
                      <Expand className="w-3 h-3" />
                      <span className="hidden sm:inline text-[9.5px] font-bold tracking-tight">FS</span>
                    </button>

                    {/* Window Fullscreen Button */}
                    <button
                      onClick={() => setWindowFullscreen(!windowFullscreen)}
                      className={`flex items-center gap-1 h-6 border py-0.5 px-1.5 rounded-md font-mono font-medium transition-all cursor-pointer shrink-0 ${
                        windowFullscreen
                          ? 'border-amber-500 bg-amber-500/15 text-amber-500 font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                          : 'border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                      }`}
                      title={windowFullscreen ? "Exit Win FS" : "Win FS (Window Fullscreen)"}
                    >
                      {windowFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                      <span className="hidden sm:inline text-[9.5px] font-bold tracking-tight">Win FS</span>
                    </button>

                    {/* Open in New Tab (Blank) button */}
                    <button
                      onClick={() => openGameInAboutBlank(selectedGame)}
                      className="flex items-center gap-1 h-6 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-0.5 px-1.5 rounded-md text-[var(--text-primary)] font-mono font-medium transition-all cursor-pointer shrink-0"
                      title="Open in Blank (about:blank)"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="hidden sm:inline text-[9.5px] font-bold tracking-tight">Abt:Blank</span>
                    </button>

                    {/* Lobby Chat (Slideout Chat) Toggle Button - icon only */}
                    {canLobbyChatAccess && (
                      <button
                        onClick={() => {
                          setDockedChatCollapsed(!dockedChatCollapsed);
                          if (dockedChatCollapsed) setHasUnreadLobby(false);
                        }}
                        className={`relative flex items-center gap-1 h-6 border py-0.5 px-1.5 rounded-md font-mono font-medium transition-all cursor-pointer shrink-0 ${
                          !dockedChatCollapsed 
                            ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-bold shadow-[0_0_8px_rgba(0,229,176,0.15)]' 
                            : 'border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                        }`}
                        title="Toggle Slideout Chat inside Portal Arena"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <LobbyUnreadIndicator visible={hasUnreadLobby} />
                      </button>
                    )}

                    {/* Hide / Show Header Button */}
                    <motion.button
                      whileHover={animationsEnabled ? { scale: 1.03 } : undefined}
                      whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
                      onClick={() => setGameHeaderHidden(!gameHeaderHidden)}
                      className="flex items-center gap-1 h-6 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] py-0.5 px-1.5 rounded-md font-mono font-medium transition-all duration-200 cursor-pointer relative shrink-0"
                      title={gameHeaderHidden ? "Show Main Website Header" : "Hide Main Website Header"}
                    >
                      <motion.div
                        animate={animationsEnabled ? (gameHeaderHidden ? { rotate: 180, scale: 1.05 } : { rotate: 0, scale: 1 }) : { rotate: 0, scale: 1 }}
                        transition={animationsEnabled ? { type: "spring", stiffness: 200, damping: 15 } : { duration: 0 }}
                        className="flex items-center justify-center"
                      >
                        {gameHeaderHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </motion.div>
                      <span className="hidden sm:inline text-[9.5px] font-bold tracking-tight">
                        {gameHeaderHidden ? 'SHOW HEADER' : 'HIDE HEADER'}
                      </span>
                    </motion.button>

                    {/* Emergency Panic Button */}
                    <button
                      onClick={triggerPanicToClassroom}
                      className="flex items-center gap-1 h-6 border border-red-500 hover:border-red-600 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-0.5 px-1.5 rounded-md font-mono font-bold transition-all cursor-pointer shadow-sm active:scale-95 group shrink-0"
                      title="Emergency Panic: Instantly opens Google Classroom. You can also press: [ , ] , ` , \ , or Double Escape"
                      aria-label="Emergency Panic Button"
                    >
                      <ShieldAlert className="w-3 h-3 text-red-500 group-hover:text-white shrink-0 animate-pulse" />
                      <span className="text-[9.5px] font-black tracking-tight uppercase">Panic</span>
                      <span className="text-[8.5px] leading-tight px-1 py-0 rounded bg-red-500/20 group-hover:bg-white/20 border border-red-500/30 text-red-400 group-hover:text-white font-mono font-bold">
                        Keys: [ ] \
                      </span>
                    </button>

                  </div>

              </div>
            )}

              {/* Game Arena with Side-by-Side Docked Chat */}
              <div 
                id="game-arena-container"
                className="flex flex-col lg:flex-row gap-0 w-full relative flex-1 min-h-0 h-full overflow-hidden"
              >
                {/* Game Viewport Container */}
                <div 
                  id="frame-viewport"
                  className="flex-1 w-full h-full rounded-none border-t border-[var(--card-border)] bg-black overflow-hidden relative flex flex-col min-h-0"
                >
                  <div 
                    className="w-full h-full duration-150 transition-transform origin-top-left flex-1 flex flex-col"
                    style={{ 
                      transform: `scale(${zoom})`,
                      width: `${100 / zoom}%`,
                      height: `${100 / zoom}%`
                    }}
                  >
                    {gameFrame ? (
                      <iframe
                        id="game-frame"
                        key={selectedGame.id}
                        {...gameFrame}
                        className={`w-full h-full flex-1 border-none block m-0 p-0 ${isDraggingDock ? 'pointer-events-none select-none' : ''}`}
                        title={selectedGame.title}
                        allow="pointer-lock; fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write; microphone; camera; geolocation; gamepad; gamepads; accelerometer; gyroscope"
                        allowFullScreen
                        referrerPolicy="no-referrer"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-modals allow-orientation-lock allow-downloads"
                      />
                    ) : externalActiveGame ? (
                      <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 bg-[#080b12] text-white select-none">
                        {/* Compact Dark Card matching popout design */}
                        <div className="relative max-w-[400px] w-full bg-[#0b1019] border border-[#1b2636] shadow-2xl rounded-2xl p-6 flex flex-col items-center text-center">
                          
                          {/* Close / Turn Off Button */}
                          <button
                            onClick={turnOffAboutBlankScreen}
                            className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                            title="Turn off this screen & load game here"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Top Square Green/Amber Icon Badge */}
                          <div className="w-11 h-11 rounded-xl bg-[#0a231b] border border-[#00c875]/40 flex items-center justify-center text-[#00c875] mb-3.5 shadow-sm">
                            <ExternalLink className="w-5 h-5 text-[#00c875]" />
                          </div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1 font-sans">
                            {selectedGame.title} is active in another tab
                          </h3>

                          {/* Subtitle Description */}
                          <p className="text-slate-400 text-xs sm:text-sm leading-normal mb-4 font-sans max-w-[320px]">
                            In-arena frame is paused. You can turn off this screen to resume playing right here.
                          </p>

                          {/* Side-by-Side Action Buttons */}
                          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                            <button
                              onClick={turnOffAboutBlankScreen}
                              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-[#00c875] hover:bg-[#00b268] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00c875]/20 active:scale-[0.98]"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
                              <span>Turn Off & Play Here</span>
                            </button>
                            <button
                              onClick={() => openGameInAboutBlank(selectedGame)}
                              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-[#242f40] hover:bg-[#2c3a4f] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/5 active:scale-[0.98]"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                              <span>Re-open Tab</span>
                            </button>
                          </div>

                          {/* Always Disable Toggle */}
                          <label className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={disableAboutBlankPause}
                              onChange={(e) => toggleDisableAboutBlankPause(e.target.checked)}
                              className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                            <span>Don't show this pause screen again this session</span>
                          </label>

                        </div>
                      </div>
                    ) : aboutBlankActiveGame === selectedGame.id ? (
                      <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 bg-[#080b12] text-white select-none">
                        {/* Compact Dark Card matching popout design */}
                        <div className="relative max-w-[400px] w-full bg-[#0b1019] border border-[#1b2636] shadow-2xl rounded-2xl p-6 flex flex-col items-center text-center">
                          
                          {/* Close / Turn Off Button */}
                          <button
                            onClick={turnOffAboutBlankScreen}
                            className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                            title="Turn off this screen & load game here"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Top Square Green Icon Badge */}
                          <div className="w-11 h-11 rounded-xl bg-[#0a231b] border border-[#00c875]/40 flex items-center justify-center text-[#00c875] mb-3.5 shadow-sm">
                            <ExternalLink className="w-5 h-5 text-[#00c875]" />
                          </div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1 font-sans">
                            {selectedGame.title} is open in a popout tab
                          </h3>

                          {/* Subtitle Description */}
                          <p className="text-slate-400 text-xs sm:text-sm leading-normal mb-4 font-sans max-w-[320px]">
                            In-arena frame is paused. You can turn off this screen anytime to resume playing here.
                          </p>

                          {/* Side-by-Side Action Buttons */}
                          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                            <button
                              onClick={turnOffAboutBlankScreen}
                              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-[#00c875] hover:bg-[#00b268] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00c875]/20 active:scale-[0.98]"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
                              <span>Turn Off & Play Here</span>
                            </button>
                            <button
                              onClick={() => openGameInAboutBlank(selectedGame)}
                              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-[#242f40] hover:bg-[#2c3a4f] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/5 active:scale-[0.98]"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                              <span>Re-open Tab</span>
                            </button>
                          </div>

                          {/* Always Disable Toggle */}
                          <label className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={disableAboutBlankPause}
                              onChange={(e) => toggleDisableAboutBlankPause(e.target.checked)}
                              className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                            <span>Don't show this pause screen again this session</span>
                          </label>

                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-center p-6 bg-[#080b12] text-white relative select-none">
                        <div className="relative w-14 h-14 mb-4 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-2 border-[var(--accent-color)]/20"></div>
                          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--accent-color)] animate-spin"></div>
                          <Gamepad2 className="w-6 h-6 text-[var(--accent-color)]" />
                        </div>
                        <h3 className="text-lg font-bold font-mono tracking-tight mb-1 text-white">
                          Loading {selectedGame.title}...
                        </h3>
                        <p className="text-gray-400 text-xs max-w-md mb-5 leading-relaxed font-sans">
                          Preparing game resources and assets for the portal arena.
                        </p>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              const cached = gameHtmlCache.get(selectedGame.url);
                              if (cached) {
                                setGameFrame(cached);
                              } else {
                                loadGameFrame(selectedGame.url).then((f) => {
                                  setCachedGameHtml(selectedGame.url, f);
                                  setGameFrame(f);
                                });
                              }
                            }}
                            className="px-4 py-2 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-xl text-xs font-mono font-bold hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reload Portal</span>
                          </button>
                          <button
                            onClick={() => openGameInAboutBlank(selectedGame)}
                            className="px-4 py-2 border border-white/20 bg-white/10 hover:border-[var(--accent-color)] text-white rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                            <span>Open in Blank Tab</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* DOCKED LIVE LOBBY CHAT */}
                {canLobbyChatAccess && !dockedChatCollapsed && (
                  <div
                    className="w-full lg:w-[235px] lg:h-full h-[320px] shrink-0 flex flex-col bg-[#070a11] border-t lg:border-t-0 lg:border-l border-[var(--card-border)]/50 rounded-none overflow-hidden"
                  >
                    <div className="flex-1 min-h-0 h-full flex flex-col">
                      <UserChat
                        onClose={() => {}}
                        isMini={true}
                        activeAccount={activeAccount}
                        isOwnerAdmin={isOwnerAdmin}
                        onOpenAccountModal={() => setAccountModalOpen(true)}
                        targetChannelRequest={targetChannelRequest}
                        onActiveChannelChange={handleActiveLobbyChannelChange}
                        workspaceConfig={workspaceConfig}
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Main Games Menu Edge-to-Edge Square Footer */}
      {!(adminAccountsModalOpen && hasAdminAccess) && !isPortalWorkspaceFilter(filter) && filter !== 'info' && !selectedGame && (
        <footer
          role="contentinfo"
          aria-label="Website Usage Disclaimer"
          className="w-full rounded-none border-t border-[var(--card-border)] bg-[var(--bg-secondary)] px-4 sm:px-6 lg:px-8 py-3 transition-colors relative z-10"
        >
          <div className="w-full max-w-8xl mx-auto flex items-start gap-3">
            <div className="w-7 h-7 rounded-none bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--accent-color)] shrink-0 mt-0.5">
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                  Disclaimer &amp; Acceptable Use Notice
                </h3>
                <p className="mt-0.5 text-[10.5px] font-semibold leading-relaxed text-[var(--text-primary)]">
                  We do not support the usage of this website in school. This site is strictly a personal passion project built to pass time at home during your own free time. If you choose to access or get caught using this website in class, you assume all personal and academic liabilities.
                </p>
              </div>

              <div className="pt-1.5 border-t border-[var(--card-border)]/70 text-[10px] leading-relaxed text-[var(--text-muted)]">
                <div>
                  <span className="font-bold text-[var(--text-primary)]">School Rules &amp; IT Policies: </span>
                  Always respect your school&apos;s code of conduct, acceptable-use agreements, and local IT or network policies. Do not use this site to bypass classroom supervision or during instructional hours.
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

    </div>

        {/* WHAT'S NEW / NEW CHANGES MODAL */}
        <AnimatePresence>
          {showWhatsNewModal && (
            <motion.div
              initial={animationsEnabled ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={animationsEnabled ? { opacity: 0 } : undefined}
              transition={animationsEnabled ? { duration: 0.14 } : { duration: 0 }}
              className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center p-4"
            >
              <motion.div
                initial={animationsEnabled ? { scale: 0.96, opacity: 0, y: 8 } : false}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={animationsEnabled ? { scale: 0.96, opacity: 0, y: 8 } : undefined}
                transition={animationsEnabled ? { duration: 0.16 } : { duration: 0 }}
                className="w-full max-w-md bg-[#0c0f16] border border-[var(--card-border)] rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-left text-white relative overflow-hidden"
              >

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] shadow-md">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-wider text-white">What's New / Recent Changes</h2>
                      <p className="text-[11px] text-gray-400 font-mono">Latest updates & features</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      safeStorage.setItem(`whats_new_dismissed_${WHATS_NEW_VERSION}`, 'true');
                      setShowWhatsNewModal(false);
                      setHasUnreadWhatsNew(false);
                    }}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs text-gray-300 font-sans max-h-[60vh] overflow-y-auto scrollbar-thin pr-1">
                  {WHATS_NEW_CHANGES.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                      <div className={`w-6 h-6 rounded-lg ${item.iconBg || 'bg-white/10 text-white'} flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs shadow-sm`}>
                        {item.icon}
                      </div>
                      <div>
                        <strong className="text-white block font-bold mb-0.5">{item.title}</strong>
                        <span className="text-gray-400 text-[11px] leading-relaxed">{item.description}</span>
                        {(item.actionFilter || item.actionGameTitle || item.actionLabel || item.actionAccountTab) && (
                          <button
                            type="button"
                            onClick={() => navigateToGameCard(item)}
                            className="mt-2 inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 cursor-pointer"
                          >
                            {item.actionLabel || (item.actionFilter === 'movies' ? 'Go Watch Movies / TV Shows' : 'Play Now')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 flex">
                  <button
                    onClick={() => {
                      safeStorage.setItem(`whats_new_dismissed_${WHATS_NEW_VERSION}`, 'true');
                      setShowWhatsNewModal(false);
                      setHasUnreadWhatsNew(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer shadow-lg shadow-[var(--accent-color)]/20 active:scale-[0.98]"
                  >
                    Got it, Let's Play!
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {instantSignInToast && (
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 10, scale: 0.97 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={animationsEnabled ? { opacity: 0, y: 10, scale: 0.97 } : undefined}
              transition={animationsEnabled ? { duration: 0.16 } : { duration: 0 }}
              className="fixed bottom-4 right-4 z-[99999] max-w-xs sm:max-w-sm rounded-xl border-2 border-[var(--accent-color)] bg-[var(--card-bg)] text-[var(--text-primary)] shadow-2xl px-3.5 py-2.5 flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold truncate">
                  Signed in as @{instantSignInToast.username}
                </div>
                <div className="text-[10.5px] text-[var(--text-muted)] truncate">
                  {instantSignInToast.popupBlocked
                    ? 'Click to open in about:blank'
                    : `via "${instantSignInToast.label}"`}
                </div>
              </div>
              {instantSignInToast.openInAboutBlank && (
                <button
                  type="button"
                  onClick={() => {
                    const opened = openWorkspaceInAboutBlank(filter);
                    if (opened) {
                      setViewMode('articles');
                    }
                    setInstantSignInToast(null);
                  }}
                  className="px-2.5 py-1 rounded-md bg-[var(--accent-color)] text-[var(--bg-color)] text-[10px] font-black uppercase tracking-wider cursor-pointer shrink-0 hover:opacity-90"
                >
                  Open about:blank
                </button>
              )}
              <button
                type="button"
                onClick={() => setInstantSignInToast(null)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer shrink-0"
                aria-label="Dismiss sign-in notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <AccountModal
          isOpen={accountModalOpen}
          onClose={() => {
            setAccountModalOpen(false);
            setAccountModalPrefillUser('');
          }}
          activeAccount={activeAccount}
          isOwnerAdmin={isOwnerAdmin}
          workspaceConfig={workspaceConfig}
          onLogin={handleAccountSignIn}
          onLogout={handleAccountSignOut}
          onOpenAdmin={
            hasAdminAccess
              ? () => {
                  setAccountModalOpen(false);
                  setSelectedGame(null);
                  setAdminAccountsModalOpen(true);
                }
              : null
          }
          mode={mode}
          signOutNotice={signOutNotice}
          isEducationPage={false}
          db={lobbyDb}
          auth={lobbyAuth}
          initialTab={accountModalInitialTab}
          prefillUsername={accountModalPrefillUser}
        />
      </Suspense>
    </MotionConfig>
  );
}
