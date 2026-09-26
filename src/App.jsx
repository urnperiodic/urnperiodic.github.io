import { lazy, Suspense, useDeferredValue, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { collection, getFirestore, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { PUBLIC_GAMES_BASE_URL } from './data/gameSource';
import { gameRankings } from './data/gameRankings';
import defaultThumbnail from './assets/images/defaultthumbnail.png';
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
  if (!url.startsWith(PUBLIC_GAMES_BASE_URL)) return { src: url };

  const loadHtml = async (sourceUrl) => {
    const response = await fetch(sourceUrl, { signal });
    if (!response.ok) throw new Error(`Portal file request failed: ${response.status}`);
    const html = await response.text();
    const baseUrl = sourceUrl.slice(0, sourceUrl.lastIndexOf('/') + 1);
    return prepareGameHtml(html, baseUrl);
  };

  try {
    const srcDoc = await loadHtml(url);
    return { srcDoc };
  } catch (error) {
    if (error.name === 'AbortError') throw error;

    const filename = new URL(url).pathname.split('/').pop();
    if (!filename) throw error;

    const localUrl = `${window.location.origin}/${filename}`;
    const srcDoc = await loadHtml(localUrl);
    return { srcDoc };
  }
};
import { initialArticles } from './data/articles';
const FlashcardsWorkspace = lazy(() => import('./components/FlashcardsWorkspace'));
const QuizWorkspace = lazy(() => import('./components/QuizWorkspace'));
const NotesWorkspace = lazy(() => import('./components/NotesWorkspace'));
const StudyTimer = lazy(() => import('./components/StudyTimer'));
const AiChatWorkspace = lazy(() => import('./components/AiChatWorkspace'));
import UserChat from './components/UserChat';
const MoviesWorkspace = lazy(() => import('./components/MoviesWorkspace'));
import InformationSection from './components/InformationSection';
const firebaseConfig = {
  projectId: 'ultra-framework-zw1xt',
  appId: '1:435315435216:web:b8746108ed875a8d25e0d5',
  apiKey: 'AIzaSyAu5Oe190oojQUnWPajnzfEF2lNoBrFafs',
  authDomain: 'ultra-framework-zw1xt.firebaseapp.com',
  storageBucket: 'ultra-framework-zw1xt.firebasestorage.app',
  messagingSenderId: '435315435216',
};
const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const lobbyAuth = getAuth(firebaseApp);
const lobbyDb = getFirestore(firebaseApp, 'ai-studio-chat1-72af77fd-eebc-43fa-8925-e79796be2d79');

function LobbyUnreadIndicator({ visible }) {
  if (!visible) return null;
  return <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[var(--bg-secondary)] shadow-[0_0_6px_rgba(239,68,68,0.8)]" aria-label="New lobby message" />;
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
  Medal
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
  let cleanName = url.startsWith('/') ? url.slice(1) : url;
  if (cleanName.toLowerCase().startsWith('gmfiles/')) {
    cleanName = cleanName.slice(8);
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

const decoyOptions = [
  { value: 'classroom', label: 'Classroom', labelLong: 'Google Classroom', icon: 'https://ssl.gstatic.com/classroom/favicon.png' },
  { value: 'drive', label: 'Drive', labelLong: 'Google Drive', icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_favicon_2026_32dp.png' },
  { value: 'docs', label: 'Docs', labelLong: 'Google Docs', icon: 'https://ssl.gstatic.com/docs/documents/images/docs-favicon-2026-v2.ico' },
  { value: 'slides', label: 'Slides', labelLong: 'Google Slides', icon: 'https://ssl.gstatic.com/docs/presentations/images/favicon-2026-v2.ico' },
  { value: 'canva', label: 'Canva', labelLong: 'Canva | Visual Suite', icon: 'https://static.canva.com/domain-assets/canva/static/images/favicon-1.ico' },
  { value: 'clever', label: 'Clever', labelLong: 'Clever Login', icon: 'https://www.google.com/s2/favicons?sz=64&domain=clever.com' },
  { value: 'campus', label: 'Campus', labelLong: 'Infinite Campus', icon: 'https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png' },
  { value: 'gmail', label: 'Inbox', labelLong: 'Inbox - JCPS', icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico' },
  { value: 'duolingo', label: 'Lingo', labelLong: 'Duolingo', icon: 'https://www.google.com/s2/favicons?sz=64&domain=duolingo.com' },
  { value: 'ixl', label: 'IXL', labelLong: 'IXL Learning', icon: 'https://www.google.com/s2/favicons?sz=64&domain=ixl.com' }
];

const getDecoyTitle = (type, customTitles = {}) => {
  const custom = (customTitles && customTitles[type] ? String(customTitles[type]).trim() : '');
  if (type === 'drive') return custom || "My Drive - Google Drive";
  if (type === 'docs') return custom || "Google Docs";
  if (type === 'slides') return custom || "Google Slides";
  if (type === 'classroom') return "Home - Classroom";
  if (type === 'canva') return "Home - Canva";
  if (type === 'clever') return "Clever | Log in with Clever";
  if (type === 'campus') return "Campus Student";
  if (type === 'gmail') return "Inbox - Jersey City Public Schools";
  if (type === 'duolingo') return "Duolingo - Learn a language for free";
  if (type === 'ixl') return "IXL | Math, Language Arts, Science, Social Studies, and Spanish";
  return "Urnperiodic StudyTools";
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
      className={`${positionClass} z-[99999] rounded-xl bg-[var(--card-bg)] border-2 border-red-500/90 shadow-2xl shadow-red-500/10 p-3 text-left select-none cursor-pointer transition-all hover:border-red-400 group backdrop-blur-xl flex flex-col gap-1.5`}
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

function CursorSpotlight({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;

    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      el.style.setProperty('--x', `${e.clientX}px`);
      el.style.setProperty('--y', `${e.clientY}px`);
      el.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 opacity-0"
      style={{
        background: 'radial-gradient(circle 350px at var(--x, -1000px) var(--y, -1000px), color-mix(in srgb, var(--accent-color) 12%, transparent), transparent 80%)',
      }}
    />
  );
}

function DecoyDropdown({ 
  value, 
  onChange, 
  mode, 
  compact = false, 
  showLabel = false, 
  customTitles = {}, 
  onCustomTitleChange 
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

  const selectedOption = decoyOptions.find(opt => opt.value === value) || decoyOptions[0];
  const isHighlighted = value !== 'none';
  const activeCustomTitle = customTitles?.[value];

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
            className={`absolute top-full right-0 mt-1.5 w-60 sm:w-64 max-h-[420px] overflow-y-auto rounded-xl border p-1.5 shadow-2xl z-[2600] select-none scrollbar-thin ${
              mode === 'light'
                ? 'bg-white border-neutral-200 shadow-xl'
                : 'bg-[#12121a]/95 backdrop-blur-md border-white/10'
            }`}
          >
            <div className="px-2 py-1 mb-1 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                Select Decoy
              </span>
              <span className="text-[9px] text-[var(--accent-color)] font-mono">
                Custom Title Enabled
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {decoyOptions.map((opt) => {
                const isSelected = opt.value === value;
                const isCustomizable = ['drive', 'docs', 'slides'].includes(opt.value);
                const customVal = customTitles?.[opt.value] || '';

                return (
                  <div 
                    key={opt.value}
                    className={`rounded-lg transition-all ${
                      isSelected 
                        ? mode === 'light'
                          ? 'bg-neutral-100 border border-neutral-300'
                          : 'bg-white/10 border border-[var(--accent-color)]/40'
                        : 'border border-transparent'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        if (!isCustomizable) {
                          setIsOpen(false);
                        }
                      }}
                      className={`flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer ${
                        isSelected 
                          ? mode === 'light'
                            ? 'text-neutral-900 font-bold'
                            : 'text-white font-bold' 
                          : mode === 'light'
                            ? 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                            : 'text-neutral-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {opt.icon === 'school' ? (
                        <School className={`w-3.5 h-3.5 ${isSelected ? (mode === 'light' ? 'text-black' : 'text-[var(--accent-color)]') : (mode === 'light' ? 'text-neutral-900' : 'text-[var(--accent-color)]')}`} />
                      ) : (
                        <img src={opt.icon} className="w-3.5 h-3.5 object-contain shrink-0" referrerPolicy="no-referrer" alt="" />
                      )}
                      <span className="flex-1 font-sans truncate">
                        {opt.labelLong}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />}
                    </button>

                    {/* Small textbox under favicon selector for Drive, Docs, and Slides */}
                    {isCustomizable && (
                      <div 
                        className="px-2 pb-1.5 pt-0.5 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          placeholder={
                            opt.value === 'drive'
                              ? 'Custom title (e.g. My Drive - Folder)'
                              : opt.value === 'docs'
                              ? 'Custom title (e.g. History Essay Draft)'
                              : 'Custom title (e.g. Chapter 4 Slides)'
                          }
                          value={customVal}
                          onChange={(e) => onCustomTitleChange && onCustomTitleChange(opt.value, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onChange(opt.value);
                              setIsOpen(false);
                            }
                          }}
                          className={`w-full text-[10px] font-mono px-2 py-1 rounded-md border outline-none transition-all placeholder:text-[9px] ${
                            mode === 'light'
                              ? 'bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900'
                              : 'bg-black/50 border-white/20 text-white placeholder:text-neutral-500 focus:border-[var(--accent-color)]'
                          }`}
                        />
                        {customVal && (
                          <button
                            type="button"
                            onClick={() => onCustomTitleChange && onCustomTitleChange(opt.value, '')}
                            className="p-1 rounded text-neutral-400 hover:text-red-400 text-[10px] cursor-pointer shrink-0"
                            title="Clear custom title"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
  compact = false
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
            className="absolute top-full right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#12121a]/95 backdrop-blur-xl border border-white/10 p-3.5 shadow-2xl z-[2800] overflow-hidden select-none text-left"
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
                onClick={() => setAutoRandomize(!autoRandomize)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer p-0.5 border ${
                  autoRandomize ? 'bg-emerald-500 border-emerald-400' : 'bg-neutral-800 border-neutral-700'
                }`}
                aria-label="Toggle Auto Switch Decoy"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    autoRandomize ? 'translate-x-5' : 'translate-x-0'
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
                  const isChecked = pool.includes(opt.value);
                  const isCurrent = currentDecoy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => togglePoolItem(opt.value)}
                      className={`flex items-center justify-between w-full px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                        isChecked
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
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                        isChecked ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-[var(--bg-color)]' : 'border-neutral-600'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Action: Randomize Now & Status */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1.5">
                {autoRandomize ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Next in {countdown}s</span>
                  </>
                ) : (
                  <span className="text-neutral-500">Auto switch off</span>
                )}
              </div>
              <button
                onClick={onRandomizeNow}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
                title="Immediately pick another random decoy"
              >
                <Shuffle className="w-3 h-3" />
                <span>Roll Now</span>
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

    const clean = url.replace(/^\/+/, '').replace(/^public\//, '').replace(/^thumbnails\//, '');
    return `/thumbnails/${encodeURI(clean)}`;
  };

  const [theme, setTheme] = useState(() => {
    const saved = safeStorage.getItem('unblocked-theme');
    return saved && ['cyborg', 'violet', 'ice', 'rose-pine', 'none'].includes(saved) ? saved : 'none';
  });
  const [mode, setMode] = useState(() => {
    const savedMode = safeStorage.getItem('unblocked-mode');
    if (savedMode) return savedMode;
    const initialViewMode = safeStorage.getItem('classroom-view-mode') || 'articles';
    return initialViewMode === 'games' ? 'dark' : 'light';
  });

  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('unlocked') === 'true' || params.get('view') === 'games') {
        safeStorage.setItem('classroom-view-mode', 'games');
        safeStorage.setItem('classroom-passcode-unlocked', 'true');
        safeSessionStorage.setItem('classroom-view-mode', 'games');
        safeSessionStorage.setItem('classroom-passcode-unlocked', 'true');
        return 'games';
      }
    }
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

  // Classroom/Games Cloak/Decoy State
  const [decoyType, setDecoyType] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlDecoyType = params.get('decoyType');
      if (urlDecoyType && ['classroom', 'canva', 'clever', 'campus', 'docs', 'gmail', 'duolingo', 'ixl'].includes(urlDecoyType)) {
        return urlDecoyType;
      }
      const urlDecoy = params.get('decoy');
      if (urlDecoy === 'true') return 'classroom';
      if (urlDecoy === 'false') return 'classroom';
      if (urlDecoy && ['classroom', 'canva', 'clever', 'campus', 'docs', 'drive', 'slides', 'gmail', 'duolingo', 'ixl'].includes(urlDecoy)) {
        return urlDecoy;
      }
      const cached = localStorage.getItem('study-tools-decoy-type');
      if (cached && ['classroom', 'canva', 'clever', 'campus', 'docs', 'drive', 'slides', 'gmail', 'duolingo', 'ixl'].includes(cached)) {
        return cached;
      }
    }
    return 'classroom';
  });

  const isWhiteDecoy = decoyType === 'classroom' || decoyType === 'docs' || decoyType === 'drive' || decoyType === 'slides' || decoyType === 'clever';
  const [showGoGuardianNotice, setShowGoGuardianNotice] = useState(() => {
    const hasShownBefore = safeStorage.getItem('unblocked-goguardian-notice-shown');
    const initialViewMode = safeStorage.getItem('classroom-view-mode');
    return !hasShownBefore && isWhiteDecoy && initialViewMode !== 'games';
  });

  // Ensure notice does not automatically pop open when in the portals secured area
  useEffect(() => {
    if (viewMode === 'games') {
      setShowGoGuardianNotice(false);
    }
  }, [viewMode]);

  // Automatically switch to white mode on classroom, google docs, drive, slides, and clever decoys
  useEffect(() => {
    if (decoyType === 'classroom' || decoyType === 'docs' || decoyType === 'drive' || decoyType === 'slides' || decoyType === 'clever') {
      setMode('light');
    }
  }, [decoyType]);

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
  const filterRef = useRef(filter);
  const markLobbyUnread = (latest) => {
    const timestamp = Number(latest || 0);
    if (!timestamp) return;
    safeStorage.setItem('lobby-chat-latest', String(timestamp));
    const lastRead = Number(safeStorage.getItem('lobby-chat-last-read') || 0);
    if (filterRef.current !== 'lobbychat' && timestamp > lastRead) {
      setHasUnreadLobby(true);
    }
  };
  useEffect(() => {
    filterRef.current = filter;
    if (filter === 'lobbychat') {
      const latest = Number(safeStorage.getItem('lobby-chat-latest') || 0);
      if (latest > 0) safeStorage.setItem('lobby-chat-last-read', String(latest));
      setHasUnreadLobby(false);
    }
  }, [filter]);
  useEffect(() => {
    const handleLobbyMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'lobby-chat-message') {
        markLobbyUnread(event.data.timestamp);
      }
    };
    const handleLobbyStorage = (event) => {
      if (event.key === 'lobby-chat-notification' && event.newValue) {
        markLobbyUnread(event.newValue);
      }
    };
    window.addEventListener('message', handleLobbyMessage);
    window.addEventListener('storage', handleLobbyStorage);
    return () => {
      window.removeEventListener('message', handleLobbyMessage);
      window.removeEventListener('storage', handleLobbyStorage);
    };
  }, []);
  useEffect(() => {
    let unsubscribe;
    let cancelled = false;

    const subscribeToLobby = async () => {
      try {
        await signInAnonymously(lobbyAuth);
        if (cancelled) return;
        const messagesQuery = query(
          collection(lobbyDb, 'channels', 'general', 'messages'),
          orderBy('timestamp', 'desc'),
          limit(1),
        );
        unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const latest = Number(snapshot.docs[0]?.data()?.timestamp || 0);
          if (!latest) return;
          const storedLastRead = safeStorage.getItem('lobby-chat-last-read');
          if (storedLastRead === null) {
            safeStorage.setItem('lobby-chat-last-read', String(latest));
            return;
          }
          markLobbyUnread(latest);
        }, (error) => {
          console.warn('Lobby unread listener error:', error);
        });
      } catch (error) {
        console.warn('Lobby unread auth error:', error);
      }
    };

    subscribeToLobby();
    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, []);
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
  const [targetPageInput, setTargetPageInput] = useState('');
  const [games, setGames] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameFrame, setGameFrame] = useState(null);
  const restoredSavedGame = useRef(false);

  // Single game coordination across arena, about:blank, and other tabs/windows
  const [aboutBlankActiveGame, setAboutBlankActiveGame] = useState(null);
  const [externalActiveGame, setExternalActiveGame] = useState(null);
  const activeAboutBlankWinRef = useRef(null);
  const arenaInstanceId = useRef('arena_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8));

  const broadcastGameStarted = useCallback((gameId, gameTitle, instId) => {
    try {
      const ch = new BroadcastChannel('urnperiodic_single_game_bus');
      ch.postMessage({
        type: 'GAME_LOADED',
        gameId,
        gameTitle,
        instanceId: instId
      });
      ch.close();
    } catch {}
    try {
      safeStorage.setItem('urnperiodic_active_game_load', JSON.stringify({
        gameId,
        gameTitle,
        instanceId: instId,
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
        if (e.data.type === 'GAME_LOADED' && e.data.instanceId !== arenaInstanceId.current) {
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
          if (data && data.instanceId !== arenaInstanceId.current) {
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
    const isWorkspace = ['chat', 'lobbychat', 'movies', 'youtube', 'info', 'download'].includes(filter);
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
    broadcastGameStarted(selectedGame.id, selectedGame.title, arenaInstanceId.current);

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
    const isWorkspace = ['chat', 'lobbychat', 'movies', 'youtube', 'info', 'download'].includes(filter);
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
    const isWorkspace = ['chat', 'lobbychat', 'movies', 'youtube', 'info', 'download'].includes(filter);
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
    let url = "";
    if (currentFilter === 'movies') {
      url = window.location.origin + '?filter=movies&view=games';
    } else if (currentFilter === 'youtube') {
      url = 'https://urnperiodic.github.io/youtube1/';
    } else if (currentFilter === 'chat') {
      url = 'https://grandplat2.vercel.app/';
    } else if (currentFilter === 'lobbychat') {
      url = window.location.origin + '?filter=lobbychat&view=games';
    } else if (currentFilter === 'download') {
      url = 'https://urnperiodic.github.io/download/';
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('decoyType', decoyType);
      searchParams.set('view', 'games');
      if (isPasscodeUnlocked) {
        searchParams.set('unlocked', 'true');
      }
      if (selectedGame) {
        searchParams.set('game', selectedGame.id);
      }
      url = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;
    }

    const win = window.open('about:blank', '_blank');
    if (win) {
      let parentTitle = getDecoyTitle(decoyType, customDecoyTitles);
      let parentFavicon = "https://ssl.gstatic.com/classroom/favicon.png";
      
      if (decoyType === 'classroom') {
        parentFavicon = "https://ssl.gstatic.com/classroom/favicon.png";
      } else if (decoyType === 'drive') {
        parentFavicon = "https://ssl.gstatic.com/docs/doclist/images/drive_favicon_2026_32dp.png";
      } else if (decoyType === 'docs') {
        parentFavicon = "https://ssl.gstatic.com/docs/documents/images/docs-favicon-2026-v2.ico";
      } else if (decoyType === 'slides') {
        parentFavicon = "https://ssl.gstatic.com/docs/presentations/images/favicon-2026-v2.ico";
      } else if (decoyType === 'canva') {
        parentFavicon = "https://static.canva.com/domain-assets/canva/static/images/favicon-1.ico";
      } else if (decoyType === 'clever') {
        parentFavicon = "https://www.google.com/s2/favicons?sz=64&domain=clever.com";
      } else if (decoyType === 'campus') {
        parentFavicon = "https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png";
      } else if (decoyType === 'gmail') {
        parentFavicon = "https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico";
      } else if (decoyType === 'duolingo') {
        parentFavicon = "https://www.google.com/s2/favicons?sz=64&domain=duolingo.com";
      } else if (decoyType === 'ixl') {
        parentFavicon = "https://www.google.com/s2/favicons?sz=64&domain=ixl.com";
      }

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
            allow="fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write; microphone; camera; geolocation; gamepads"
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
    } else {
      alert("Popup blocked! Please allow popups for this site.");
    }
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

  const openGameInAboutBlank = (gameToOpen) => {
    if (!gameToOpen) return;
    recordRecentlyPlayed(gameToOpen.id);

    // Unload the in-page arena frame on the main website to save memory and eliminate audio overlap
    setSelectedGame(gameToOpen);
    setAboutBlankActiveGame(gameToOpen.id);
    setGameFrame(null);

    const win = window.open("about:blank", "_blank");
    if (!win) {
      alert("Popup blocked. Allow popups for this site.");
      return;
    }

    const classroomFavicon = "https://ssl.gstatic.com/classroom/favicon.png";
    let tabTitle = getDecoyTitle(decoyType, customDecoyTitles);
    let tabFavicon = classroomFavicon;
    if (decoyType === 'classroom') {
      tabFavicon = "https://ssl.gstatic.com/classroom/favicon.png";
    } else if (decoyType === 'drive') {
      tabFavicon = "https://ssl.gstatic.com/docs/doclist/images/drive_favicon_2026_32dp.png";
    } else if (decoyType === 'docs') {
      tabFavicon = "https://ssl.gstatic.com/docs/documents/images/docs-favicon-2026-v2.ico";
    } else if (decoyType === 'slides') {
      tabFavicon = "https://ssl.gstatic.com/docs/presentations/images/favicon-2026-v2.ico";
    } else if (decoyType === 'canva') {
      tabFavicon = "https://static.canva.com/domain-assets/canva/static/images/favicon-1.ico";
    } else if (decoyType === 'clever') {
      tabFavicon = "https://www.google.com/s2/favicons?sz=64&domain=clever.com";
    } else if (decoyType === 'campus') {
      tabFavicon = "https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png";
    } else if (decoyType === 'gmail') {
      tabFavicon = "https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico";
    } else if (decoyType === 'duolingo') {
      tabFavicon = "https://www.google.com/s2/favicons?sz=64&domain=duolingo.com";
    } else if (decoyType === 'ixl') {
      tabFavicon = "https://www.google.com/s2/favicons?sz=64&domain=ixl.com";
    }

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
          allow="fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write; microphone; camera; geolocation; gamepads" 
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

    const frame = win.document.getElementById('about-blank-game-frame');
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
    }
    if (mode === 'games') {
      setHeaderOpen(false);
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    if (viewMode === 'games') {
      setHeaderOpen(false);
      setSidebarOpen(true);
    }
  }, [viewMode]);

  const [autoLockOnClose, setAutoLockOnClose] = useState(() => {
    const saved = safeStorage.getItem('unblocked-auto-lock-on-close');
    return saved !== 'false'; // Defaults to true
  });

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
      const cleanPath = currentUrl.pathname || '/';
      
      // If there are lingering gaming query parameters, sanitize them in-place
      const searchParams = new URLSearchParams(currentUrl.search);
      let needsSanitize = false;

      // Check if URL has gaming query parameters that should be wiped from history
      ['filter', 'view', 'unlocked', 'game', 'id', 'search'].forEach(param => {
        if (searchParams.has(param)) {
          searchParams.delete(param);
          needsSanitize = true;
        }
      });

      const sanitizedUrl = needsSanitize 
        ? (searchParams.toString() ? `${cleanPath}?${searchParams.toString()}` : cleanPath)
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

  // Sign Out / Lock Workspace when tab or window is closed
  useEffect(() => {
    const handleUnload = () => {
      // If the user triggered an in-website refresh or an active reload, do not lock out
      if (isRefreshingRef.current) return;
      try {
        const refreshingSession = safeStorage.getItem('unblocked-refreshing-session') === 'true';
        const refreshTime = Number(safeStorage.getItem('unblocked-refresh-timestamp') || 0);
        if (refreshingSession && Date.now() - refreshTime < 15000) {
          return;
        }
      } catch {}

      if (autoLockOnClose) {
        safeStorage.setItem('classroom-view-mode', 'articles');
        safeStorage.setItem('classroom-passcode-unlocked', 'false');
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [autoLockOnClose]);

  const [passcode, setPasscode] = useState('');
  const [isShake, setIsShake] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
  // Animations state: disabled by default at start for Chromebook performance
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    try {
      return safeStorage.getItem('unblocked-animations-enabled') === 'true';
    } catch {
      return false;
    }
  });

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
  const [noticeStep, setNoticeStep] = useState(0); // 0: Download, 1: Movies, 2: Cloak, 3: Decoy
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
              return 0;
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
    if (noticeStep > 0) {
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

  // Set white as the main starting color for articles (light mode), and for classroom/docs decoys
  useEffect(() => {
    if (viewMode === 'articles') {
      setMode('light');
    } else if (viewMode === 'games') {
      if (decoyType === 'classroom' || decoyType === 'docs' || decoyType === 'drive' || decoyType === 'slides' || decoyType === 'clever') {
        setMode('light');
      } else {
        setMode('dark');
      }
    }
  }, [viewMode, decoyType]);

  const handlePasswordSubmit = (customPass) => {
    const inputPass = (customPass !== undefined ? customPass : passcode).trim().toLowerCase();
    if (!inputPass) return;

    if (inputPass === 'ttt1234' || inputPass === 'ttt0609') {
      const win = window.open("about:blank", "_blank");
      if (win) {
        // Automatically save that we are unlocked so the iframe can read it
        safeStorage.setItem('classroom-view-mode', 'games');
        safeStorage.setItem('classroom-passcode-unlocked', 'true');
        safeSessionStorage.setItem('classroom-view-mode', 'games');
        safeSessionStorage.setItem('classroom-passcode-unlocked', 'true');

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('unlocked', 'true');
        searchParams.set('decoyType', decoyType);
        const iframeSrc = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;
        
        let parentTitle = getDecoyTitle(decoyType, customDecoyTitles);
        let parentFavicon = "https://ssl.gstatic.com/classroom/favicon.png";
        
        if (decoyType === 'classroom') {
          parentFavicon = "https://ssl.gstatic.com/classroom/favicon.png";
        } else if (decoyType === 'drive') {
          parentFavicon = "https://ssl.gstatic.com/docs/doclist/images/drive_favicon_2026_32dp.png";
        } else if (decoyType === 'docs') {
          parentFavicon = "https://ssl.gstatic.com/docs/documents/images/docs-favicon-2026-v2.ico";
        } else if (decoyType === 'slides') {
          parentFavicon = "https://ssl.gstatic.com/docs/presentations/images/favicon-2026-v2.ico";
        } else if (decoyType === 'canva') {
          parentFavicon = "https://static.canva.com/domain-assets/canva/static/images/favicon-1.ico";
        } else if (decoyType === 'clever') {
          parentFavicon = "https://www.google.com/s2/favicons?sz=64&domain=clever.com";
        } else if (decoyType === 'campus') {
          parentFavicon = "https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png";
        } else if (decoyType === 'gmail') {
          parentFavicon = "https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico";
        } else if (decoyType === 'duolingo') {
          parentFavicon = "https://www.google.com/s2/favicons?sz=64&domain=duolingo.com";
        } else if (decoyType === 'ixl') {
          parentFavicon = "https://www.google.com/s2/favicons?sz=64&domain=ixl.com";
        }

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
              src="${iframeSrc}"
              allow="fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write; microphone; camera; geolocation; gamepads"
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
                  setTimeout(hideLoader, 3000);
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
                    if (frame) frame.src = "${iframeSrc}";
                  }
                });
              })();
            </script>
          </body>
          </html>
        `);
        win.document.close();

        // Automatically close the original window using self-open script trick
        try {
          window.opener = null;
          window.open("", "_self");
          window.close();
        } catch (e) {}
        // Fallback: If browser security prevents script-closing a manually opened tab,
        // stay in decoy disguise mode or safely redirect to classroom
        setTimeout(() => {
          if (!window.closed) {
            try {
              window.opener = null;
              window.open("", "_self");
              window.close();
            } catch (e) {}
            // If still not closed, keep page in decoy mode without force navigating
            setViewModeAndSave('articles');
          }
        }, 150);
      } else {
        alert("Popup blocked! Please allow popups to open the portals in a cloaked tab.");
      }
      setPasscode('');
    } else if (inputPass === 'tungtung' || inputPass === 'tt0609' || inputPass === '1378') {
      setTimeout(() => {
        setViewModeAndSave('games');
        setPasscode('');
      }, 150);
    } else if (inputPass === '0609') {
      setTimeout(() => {
        setViewModeAndSave('articles');
        setPasscode('');
      }, 150);
    } else if (
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

    // Instant matching for rapid-pins (2026, 0609, 1212, 1111)
    if (nextPasscode === '2026') {
      setTimeout(() => {
        setViewModeAndSave('games');
        setPasscode('');
      }, 150);
    } else if (nextPasscode === '0609' || nextPasscode === '1212' || nextPasscode === '1111') {
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

  // Automated trigger checks for passwords within the article search tab
  useEffect(() => {
    const q = articleSearch.trim().toLowerCase();
    if (q === 'ttt1234' || q === 'ttt0609') {
      setArticleSearch('');
      handlePasswordSubmit(q);
    } else if (q === 'tungtung' || q === '2026' || q === 'tt0609') {
      setViewModeAndSave('games');
      setArticleSearch('');
    } else if (q === '0609') {
      setViewModeAndSave('locked');
      setArticleSearch('');
    }
  }, [articleSearch]);

  // Global keydown listeners for quick keystroke combinations
  useEffect(() => {
    let sequenceBuffer = '';
    const handleGlobalSequence = (e) => {
      // Avoid intercepting if targeted on search input to let them type fully
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key >= '0' && e.key <= '9') {
        sequenceBuffer += e.key;
        if (sequenceBuffer.length > 4) {
          sequenceBuffer = sequenceBuffer.slice(-4);
        }
        
        if (sequenceBuffer === '0609') {
          setViewModeAndSave('locked');
          setPasscode('');
          sequenceBuffer = '';
        } else if (sequenceBuffer === '2026') {
          setViewModeAndSave('games');
          setPasscode('');
          sequenceBuffer = '';
        }
      } else if (e.key === 'Escape') {
        sequenceBuffer = '';
      }
    };
    window.addEventListener('keydown', handleGlobalSequence);
    return () => window.removeEventListener('keydown', handleGlobalSequence);
  }, [viewMode]);

  // Global Panic Key Handler
  useEffect(() => {
    let lastZeroTime = 0;
    let lastEscapeTime = 0;
    const handlePanic = (e) => {
      if (e.key === '[' || e.key === ']') {
        if (!panicKeysEnabled) return;
        e.preventDefault();
        try {
          window.history.replaceState({ disguise: 'educational_workspace' }, 'Urnperiodic StudyTools', window.location.pathname || '/');
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

  // Prevent accidental close or refresh only when actively inside a game
  useEffect(() => {
    if (!selectedGame) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Required for most browsers to show prompt
      return ''; 
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [selectedGame]);

  // Parse filter parameter from query string on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlFilter = params.get('filter');
      if (urlFilter && ['chat', 'lobbychat', 'movies', 'youtube', 'info', 'all', 'download'].includes(urlFilter)) {
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
      setBothTitles("Urnperiodic StudyTools");
      updateFavicon(customStudyFavicon);
    } else if (viewMode === 'games') {
      const activeTitle = getDecoyTitle(decoyType, customDecoyTitles);
      setBothTitles(activeTitle);
      
      if (decoyType === 'classroom') {
        updateFavicon(classroomFavicon);
      } else if (decoyType === 'drive') {
        updateFavicon("https://ssl.gstatic.com/docs/doclist/images/drive_favicon_2026_32dp.png");
      } else if (decoyType === 'docs') {
        updateFavicon("https://ssl.gstatic.com/docs/documents/images/docs-favicon-2026-v2.ico");
      } else if (decoyType === 'slides') {
        updateFavicon("https://ssl.gstatic.com/docs/presentations/images/favicon-2026-v2.ico");
      } else if (decoyType === 'canva') {
        updateFavicon("https://static.canva.com/domain-assets/canva/static/images/favicon-1.ico");
      } else if (decoyType === 'clever') {
        updateFavicon("https://www.google.com/s2/favicons?sz=64&domain=clever.com");
      } else if (decoyType === 'campus') {
        updateFavicon("https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png");
      } else if (decoyType === 'gmail') {
        updateFavicon("https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico");
      } else if (decoyType === 'duolingo') {
        updateFavicon("https://www.google.com/s2/favicons?sz=64&domain=duolingo.com");
      } else if (decoyType === 'ixl') {
        updateFavicon("https://www.google.com/s2/favicons?sz=64&domain=ixl.com");
      } else {
        updateFavicon(classroomFavicon);
      }
    } else {
      // Default to StudyTools for locked/welcome screens
      setBothTitles("Urnperiodic StudyTools");
      updateFavicon(customStudyFavicon);
    }
  }, [viewMode, decoyType, customDecoyTitles]);

  // Set LocalStorage theme and mode on change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);
    safeStorage.setItem('unblocked-theme', theme);
    safeStorage.setItem('unblocked-mode', mode);
  }, [theme, mode]);

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
  const renderGameArt = (game, defaultThumbnailSrc = defaultThumbnail) => {
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
      case 1:
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
      case 2:
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
      case 3:
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
      case 4:
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
      case 5:
      case 'pacman':
        return (
          <div className="relative w-full h-full flex items-center justify-center gap-2 bg-neutral-950">
            <div className="w-10 h-10 bg-yellow-400 rounded-full border-r-4 border-transparent rotate-45 animate-pulse" />
            <div className="w-2 h-2 bg-white rounded-full" />
            <div className="w-2 h-2 bg-white/60 rounded-full" />
            <div className="w-2 h-2 bg-white/30 rounded-full" />
          </div>
        );
      case 6:
      case 'tunnel-rush':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-neutral-950">
            <div className="absolute w-24 h-24 border-2 border-dashed border-purple-500/40 rounded-full animate-spin" />
            <div className="absolute w-16 h-16 border border-purple-500/30 rounded-full animate-ping" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white" />
          </div>
        );
      case 7:
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
      case 8:
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
      case 9:
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
      case 10:
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
      case 11:
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
      case 12:
      case 'classroom-portal':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="bg-sky-500/10 p-3 rounded-full border border-sky-400/20">
              <MessageSquare className="text-sky-400 w-10 h-10 animate-pulse" />
            </div>
          </div>
        );
      case 13:
      case 'youtube-stealth':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg relative cursor-pointer transform hover:scale-105 duration-200">
              <Play className="fill-white text-white w-5 h-5 ml-0.5" />
            </div>
          </div>
        );
      case 14:
      case 'stealth-proxy':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="bg-zinc-800 p-3 rounded-lg border-2 border-zinc-700 flex flex-col items-center gap-1 shadow-md">
              <Globe className="text-zinc-300 w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
        );
      case 15:
      case 'sim-life':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
            <div className="bg-pink-500/10 p-4 rounded-full border border-pink-400/30">
              <Users className="text-pink-400 w-8 h-8 hover:rotate-12 duration-200" />
            </div>
          </div>
        );
      case 16:
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

  const totalEmulatedGamesCount = useMemo(() => {
    return games.filter(g => {
      const c = (g.category || '').trim().toLowerCase();
      return EMULATED_PLATFORMS.includes(c) || c === 'emulated';
    }).length;
  }, [games]);

  const isEmulatedActive = filter === 'Emulated' || filter === 'emulated-other' || emulatedTags.includes(filter);

  const [emulatedDropdownOpen, setEmulatedDropdownOpen] = useState(false);

  useEffect(() => {
    if (isEmulatedActive) {
      setEmulatedDropdownOpen(true);
      setGameCatalogMode('all');
      safeStorage.setItem('unblocked-game-catalog-mode', 'all');
    }
  }, [isEmulatedActive]);

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

  const gameTierOrder = ['S', 'A', 'B', 'C'];
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

    Object.entries(gameRankings).forEach(([tier, titles]) => {
      titles.forEach((title) => {
        const rankInfo = { rank: currentRank++, tier, canonicalTitle: title };
        const normClean = normalizeTierTitle(title);
        const normLit = normalizeLiteralTitle(title);
        if (normClean && !map.has(normClean)) map.set(normClean, rankInfo);
        if (normLit && !map.has(normLit)) map.set(normLit, rankInfo);
      });
    });

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
    if (['S', 'A', 'B', 'C', 'D'].includes(explicitTier)) {
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
    const tiers = { S: [], A: [], B: [], C: [], D: [] };
    rankedGamesList.forEach((g) => {
      if (tiers[g.rankTier]) tiers[g.rankTier].push(g);
    });
    return tiers;
  }, [rankedGamesList]);

  const isRankingsActive = filter === 'rankings' || filter.startsWith('tier-');

  const tierRankedGames = useMemo(() => {
    return gameTierOrder.map((tier) => {
      const tierGames = games.filter((game) => getGameTier(game) === tier);
      return {
        tier,
        games: tierGames
      };
    });
  }, [games, getGameTier]);

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

    setSelectedGame(randomGame);
    setFilter('all');
    setCurrentGamePage(1);
    setRandomPickerOpen(false);
  }, [activeRandomRankingPool, excludedRandomTiers, gameTierOrder, games, getGameTier, isEmulatedGame, selectedGame]);

  // Filter games based on category sidebar, matching search query
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const filteredGames = games.filter(game => {
    // When a search query is entered, search across every game in the entire library
    if (normalizedSearchQuery !== '') {
      return (game.searchText || '').includes(normalizedSearchQuery);
    }

    if (filter === 'og') {
      if (!game.isOg && (game.category || '').toLowerCase().trim() !== 'og') return false;
    } else {
      // Only restrict to originals when on 'all' filter and catalog mode is set to 'original'
      if (filter === 'all' && gameCatalogMode === 'original' && !game.isOg && !isEmulatedActive) {
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
      } else if (filter === 'Emulated') {
        const c = (game.category || '').trim().toLowerCase();
        const matchesEmulated = EMULATED_PLATFORMS.includes(c) || c === 'emulated';
        if (!matchesEmulated) return false;
      } else if (filter === 'emulated-other') {
        const c = (game.category || '').trim().toLowerCase();
        if (!emulatedOtherTags.includes(c)) return false;
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
    return filteredGames;
  }, [filter, normalizedSearchQuery, filteredGames, getGameRankInfo]);

  const totalGamePages = Math.max(1, Math.ceil(sortedFilteredGames.length / GAMES_PER_PAGE));
  const safeGamePage = Math.min(currentGamePage, totalGamePages);
  const paginatedGames = sortedFilteredGames.slice(
    (safeGamePage - 1) * GAMES_PER_PAGE,
    safeGamePage * GAMES_PER_PAGE
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [safeGamePage]);



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
          <header className="w-full mx-auto flex flex-col lg:flex-row justify-center items-center border-b border-[var(--card-border)] gap-4 select-none max-w-none px-4 md:px-6 py-3 shrink-0">
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

            <div className="flex items-center gap-3 self-stretch lg:self-auto justify-center lg:justify-start">
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
          </header>

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
              <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden bg-white">
                <FlashcardsWorkspace 
                  refArticle={selectedArticle} 
                  onGeneratedSuccess={(targetTab) => setActiveEduTab(targetTab)} 
                />
              </div>
            )}

            {activeEduTab === 'quiz' && (
              <div className="flex-1 w-full h-full min-h-0 relative overflow-hidden bg-white">
                <QuizWorkspace 
                  refArticle={selectedArticle} 
                  onGeneratedSuccess={(targetTab) => setActiveEduTab(targetTab)} 
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
        </div>
      );
    }

    return (
      <MotionConfig reducedMotion={animationsEnabled ? "never" : "always"}>
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col xl:flex-row items-center xl:items-center justify-center p-4 md:p-8 xl:p-12 gap-8 md:gap-10 transition-colors duration-350 relative select-none">
        
        {/* Floating Controls inside Lock Screen */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          
          {/* Theme custom capsule */}
          <div className="border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <div className="flex items-center gap-1.5">
              {[
                { key: 'cyborg', color: 'bg-green-500 border-green-300 shadow-[0_0_5px_green]', tooltip: 'Cyborg Theme' },
                { key: 'sunset', color: 'bg-amber-500 border-amber-300', tooltip: 'Sunset Theme' },
                { key: 'midnight', color: 'bg-indigo-600 border-indigo-400', tooltip: 'Midnight Theme' },
                { key: 'forest', color: 'bg-emerald-500 border-emerald-300', tooltip: 'Forest Theme' },
                { key: 'violet', color: 'bg-indigo-600 border-indigo-400', tooltip: 'Violet Theme' },
                { key: 'ice', color: 'bg-sky-400 border-sky-300', tooltip: 'Glacier Theme' },
                { key: 'rose-pine', color: 'bg-rose-300 border-rose-200', tooltip: 'Rose Pine Theme' },
                { key: 'none', color: 'bg-gradient-to-br from-neutral-300 to-neutral-700 border-neutral-400', tooltip: 'No Theme (Monochrome)' }
              ].map((themeOpt) => (
                <button
                  key={themeOpt.key}
                  title={themeOpt.tooltip}
                  onClick={() => setTheme(themeOpt.key)}
                  className={`w-3.5 h-3.5 rounded-full ${themeOpt.color} border transition-all duration-200 hover:scale-130 cursor-pointer ${
                    theme === themeOpt.key ? 'ring-2 ring-offset-2 ring-[var(--accent-color)]' : 'opacity-80'
                  }`}
                />
              ))}
            </div>
          </div>

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
            <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">This is a paid Science, Math, ELA, and Social Studies article website. Please enter a correct password to continue to the website.</p>
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

      </div>
      </MotionConfig>
    );
  }



  return (
    <MotionConfig reducedMotion={animationsEnabled ? "never" : "always"}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-muted)] text-sm">Loading workspace...</div>}>
        <div className={`min-h-screen flex flex-col transition-colors duration-300 relative overflow-x-clip ${viewMode === 'games' ? 'games-no-select select-none' : ''} ${selectedGame ? 'h-screen overflow-hidden' : ''}`}>
      <CursorSpotlight active={viewMode === 'games' && animationsEnabled} />
      {/* HEADER */}
      <AnimatePresence initial={false}>
        {((!gameHeaderHidden || !selectedGame) || ['chat', 'lobbychat', 'movies', 'youtube', 'info', 'download'].includes(filter)) && (
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
          onClick={() => { setFilter('all'); setSelectedGame(null); setSearchQuery(''); }}
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
            <motion.button
              whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
              onClick={() => { setFilter(filter === 'movies' ? 'all' : 'movies'); setSelectedGame(null); }}
              className={`relative px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 ${
                filter === 'movies'
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                  : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
              }`}
              title="Movies Workspace"
            >
              <Tv className="w-3.5 h-3.5" />
              <span style={{ fontSize: '9px', lineHeight: '18px', textAlign: 'center', fontStyle: 'normal', fontWeight: 'normal', fontFamily: 'Inter' }}>movies</span>
            </motion.button>

            {/* Lobby Chat Button */}
            <motion.button
              whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
              onClick={() => { setFilter(filter === 'lobbychat' ? 'all' : 'lobbychat'); setSelectedGame(null); }}
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

            {/* YouTube Workspace Button */}
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

            {/* Decoy Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase select-none">Decoy:</span>
              <DecoyDropdown value={decoyType} onChange={setDecoyType} mode={mode} />

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
              />

              {/* Cloak / About:blank Button (to the right of shuffle button) */}
              <motion.button
                whileHover={animationsEnabled && filter !== 'lobbychat' ? { scale: 1.05 } : undefined}
                whileTap={animationsEnabled && filter !== 'lobbychat' ? { scale: 0.95 } : undefined}
                onClick={() => { if (filter !== 'lobbychat') openWorkspaceInAboutBlank(filter); }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                  filter !== 'lobbychat'
                    ? 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] hover:border-[var(--accent-color)] cursor-pointer'
                    : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                }`}
                title={
                  filter === 'movies' ? "Open Movies in about:blank" :
                  filter === 'youtube' ? "Open YouTube in about:blank" :
                  filter === 'chat' ? "Open AI Chat in about:blank" :
                  filter === 'lobbychat' ? "Open Lobby Chat in about:blank" :
                  filter === 'download' ? "Open Download in about:blank" :
                  "Cloak site in about:blank"
                }
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Cloak</span>
              </motion.button>

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
                const url = filter === 'movies' ? 'https://urnperiodic.github.io/p/' : filter === 'youtube' ? 'https://urnperiodic.github.io/youtube1/' : filter === 'chat' ? 'https://grandplat2.vercel.app/' : filter === 'download' ? 'https://urnperiodic.github.io/download/' : '';
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
                    title={hasUrl ? "Open Workspace in new tab" : "No external link available"}
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <span>Open Link</span>
                  </motion.button>
                );
              })()}
            </div>

            {/* Quick Exit & Open Separately buttons for Workspaces (Sticky) */}
            <AnimatePresence>
              {(filter === 'movies' || filter === 'chat' || filter === 'youtube' || filter === 'lobbychat' || filter === 'download') && (
                <motion.div 
                  key="workspace-actions-sticky"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex items-center gap-1.5 pl-2 ml-1 border-l border-[var(--card-border)]/50 whitespace-nowrap"
                >
                  <button
                    onClick={() => setFilter('all')}
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
              onClick={() => { setFilter('all'); setSelectedGame(null); setSearchQuery(''); }}
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
                    <span className="text-neutral-400 font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 'bold' }}>Leadcreator:</span>
                    <span className="font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Thorne Thompson (TT)</span>
                  </span>
                  <span 
                    className="text-[8px] leading-[11px] tracking-tight flex items-center gap-1 transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <span className="text-neutral-400 font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 'bold' }}>Cocreator:</span>
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
              <button
                onClick={() => { setFilter(filter === 'movies' ? 'all' : 'movies'); setSelectedGame(null); }}
                className={`relative p-1 rounded-md text-xs transition-all duration-200 ${
                  filter === 'movies'
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_1px_5px_var(--accent-shadow)] font-bold'
                    : 'bg-transparent text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                }`}
                title="Movies"
              >
                <Tv className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => { setFilter(filter === 'chat' ? 'all' : 'chat'); setSelectedGame(null); }}
                className={`p-1 px-1.5 rounded-md text-xs font-sans font-black transition-all duration-200 flex items-center justify-center ${
                  filter === 'chat'
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_1px_5px_var(--accent-shadow)]'
                    : 'bg-transparent text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                }`}
                title="Gemini AI Chat"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="currentColor" />
                </svg>
              </button>

              <button
                onClick={() => { setFilter(filter === 'lobbychat' ? 'all' : 'lobbychat'); setSelectedGame(null); }}
                className={`p-1 rounded-md text-xs transition-all duration-200 ${
                  filter === 'lobbychat'
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_1px_5px_var(--accent-shadow)] font-bold'
                    : 'bg-transparent text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                }`}
                title="Lobby Chat"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <LobbyUnreadIndicator visible={hasUnreadLobby} />
              </button>

              <button
                onClick={() => { setFilter(filter === 'youtube' ? 'all' : 'youtube'); setSelectedGame(null); }}
                className={`p-1 rounded-md text-xs transition-all duration-200 ${
                  filter === 'youtube'
                    ? 'bg-red-600 text-white shadow-[0_1px_5px_rgba(220,38,38,0.5)] font-bold'
                    : 'bg-transparent text-[var(--text-primary)] hover:text-red-500'
                }`}
                title="YouTube"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" fill={filter === 'youtube' ? "#FFFFFF" : "#FF0000"} />
                  <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill={filter === 'youtube' ? "#FF0000" : "#FFFFFF"} />
                </svg>
              </button>

              {/* Decoy Selector & Auto Randomize */}
              <div className="flex items-center gap-1">
                <DecoyDropdown value={decoyType} onChange={setDecoyType} mode={mode} compact={true} />

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
                />

                {/* Cloak & Open Link & Refresh Buttons */}
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => { if (filter !== 'lobbychat') openWorkspaceInAboutBlank(filter); }}
                    className={`p-1 rounded-md transition-all ${
                      filter !== 'lobbychat'
                        ? 'text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 cursor-pointer'
                        : 'text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                    }`}
                    title={
                      filter === 'movies' ? "Open Movies in about:blank" :
                      filter === 'youtube' ? "Open YouTube in about:blank" :
                      filter === 'chat' ? "Open AI Chat in about:blank" :
                      filter === 'lobbychat' ? "Open Lobby Chat in about:blank" :
                      filter === 'download' ? "Open Download in about:blank" :
                      "Cloak site in about:blank"
                    }
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {(() => {
                    const url = filter === 'movies' ? 'https://urnperiodic.github.io/p/' : filter === 'youtube' ? 'https://urnperiodic.github.io/youtube1/' : filter === 'chat' ? 'https://grandplat2.vercel.app/' : filter === 'download' ? 'https://urnperiodic.github.io/download/' : '';
                    const hasUrl = !!url;
                    return (
                      <button
                        onClick={() => { if (hasUrl) window.open(url, '_blank'); }}
                        className={`p-1 rounded-md transition-all ${
                          hasUrl
                            ? 'text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0)] hover:shadow-[0_0_8px_var(--accent-color)]'
                            : 'text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                        }`}
                        title={hasUrl ? "Open Workspace in new tab" : "No external link available"}
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
              <div className="relative">
                <button
                  onClick={() => { setFilter(filter === 'movies' ? 'all' : 'movies'); setSelectedGame(null); }}
                  className={`p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    filter === 'movies'
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
                      The movies/tv shows/anime button does not work at school as Iboss blocks all the servers from working.
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

              {/* Socratic Tutor Button */}
              <button
                onClick={() => { setFilter(filter === 'chat' ? 'all' : 'chat'); setSelectedGame(null); }}
                className={`p-1.5 px-2.5 rounded-lg border text-xs font-sans font-black flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  filter === 'chat'
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
                }`}
                title="Gemini AI Chat Tutor"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="currentColor" />
                </svg>
              </button>

              {/* Lobby Chat Button */}
              <button
                onClick={() => { setFilter(filter === 'lobbychat' ? 'all' : 'lobbychat'); setSelectedGame(null); }}
                className={`relative p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  filter === 'lobbychat'
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
                }`}
                title="Lobby Chat"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <LobbyUnreadIndicator visible={hasUnreadLobby} />
              </button>

              {/* YouTube Workspace Button */}
              <button
                onClick={() => { setFilter(filter === 'youtube' ? 'all' : 'youtube'); setSelectedGame(null); }}
                className={`p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  filter === 'youtube'
                    ? 'bg-red-600 text-white border-red-600 shadow-[0_2px_8px_rgba(220,38,38,0.5)] font-bold'
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-red-500/50 hover:text-red-500'
                }`}
                title="YouTube"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" fill={filter === 'youtube' ? "#FFFFFF" : "#FF0000"} />
                  <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill={filter === 'youtube' ? "#FF0000" : "#FFFFFF"} />
                </svg>
              </button>

              {/* Decoy Selector & Auto Randomize */}
              <div className="relative flex items-center gap-1">
                <div className={showNotices && noticeStep === 3 ? 'ring-2 ring-[var(--accent-color)] ring-offset-2 ring-offset-[#0d0d12] rounded-lg animate-pulse' : ''}>
                  <DecoyDropdown 
                    value={decoyType} 
                    onChange={setDecoyType} 
                    mode={mode} 
                    compact={true} 
                    customTitles={customDecoyTitles}
                    onCustomTitleChange={handleCustomTitleChange}
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
                />

                {/* Cloak / About:blank Button (to the right of shuffle button) */}
                <div className="relative">
                  <button
                    onClick={() => { if (filter !== 'lobbychat') openWorkspaceInAboutBlank(filter); }}
                    className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
                      filter !== 'lobbychat'
                        ? 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] hover:border-[var(--accent-color)] cursor-pointer'
                        : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                    } ${showNotices && noticeStep === 2 ? 'ring-2 ring-[var(--accent-color)] ring-offset-2 ring-offset-[#0d0d12] animate-pulse' : ''}`}
                    title={
                      filter === 'movies' ? "Open Movies in about:blank" :
                      filter === 'youtube' ? "Open YouTube in about:blank" :
                      filter === 'chat' ? "Open AI Chat in about:blank" :
                      filter === 'lobbychat' ? "Open Lobby Chat in about:blank" :
                      filter === 'download' ? "Open Download in about:blank" :
                      "Cloak site in about:blank"
                    }
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
                  const url = filter === 'movies' ? 'https://urnperiodic.github.io/p/' : filter === 'youtube' ? 'https://urnperiodic.github.io/youtube1/' : filter === 'chat' ? 'https://grandplat2.vercel.app/' : filter === 'download' ? 'https://urnperiodic.github.io/download/' : '';
                  const hasUrl = !!url;
                  return (
                    <button
                      onClick={() => { if (hasUrl) window.open(url, '_blank'); }}
                      className={`p-1.5 rounded-lg border transition-all flex items-center justify-center ${
                        hasUrl
                          ? 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0)] hover:shadow-[0_0_8px_var(--accent-color)]'
                          : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)] opacity-40 cursor-not-allowed'
                      }`}
                      title={hasUrl ? "Open Workspace in new tab" : "No external link available"}
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
                {(filter === 'movies' || filter === 'chat' || filter === 'youtube' || filter === 'lobbychat' || filter === 'download') && (
                  <motion.div 
                    key="workspace-actions-main"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex items-center gap-1.5 pl-2 ml-1 border-l border-[var(--card-border)]/50 whitespace-nowrap"
                  >
                    <button
                      onClick={() => setFilter('all')}
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
                  className={`tracking-tight transition-colors whitespace-nowrap ${mode === 'light' ? 'text-black font-extrabold' : 'text-[var(--text-primary)]'}`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '8px', fontWeight: 'bold', color: mode === 'light' ? '#000000' : undefined }}
                >
                  Anim
                </span>
                <div 
                  className={`relative w-7 h-4 rounded-full border transition-all duration-200 flex items-center px-0.5 ${
                    animationsEnabled 
                      ? mode === 'light' ? 'bg-black border-black' : 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                      : mode === 'light' ? 'bg-neutral-200 border-neutral-300' : 'bg-[var(--input-fill)] border-[var(--card-border)]'
                  }`}
                >
                  <div 
                    className={`w-3 h-3 rounded-full transition-all duration-200 ease-out transform ${
                      animationsEnabled 
                        ? mode === 'light' ? 'translate-x-3 bg-white' : 'translate-x-3 bg-[var(--bg-color)]' 
                        : mode === 'light' ? 'translate-x-0 bg-black' : 'translate-x-0 bg-[var(--text-muted)]'
                    }`}
                  />
                </div>
              </div>

              {/* Subtle divider */}
              <div className="w-px h-3.5 bg-[var(--card-border)]/60" />

              {/* Settings Gear Button */}
              <button
                onClick={() => setIsGlobalSettingsOpen(!isGlobalSettingsOpen)}
                className={`p-1 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  mode === 'light' 
                    ? 'text-black hover:text-black hover:bg-black/5' 
                    : 'text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--card-bg)]'
                }`}
                title="System Settings"
              >
                <Settings className="w-3 h-3" style={{ color: mode === 'light' ? '#000000' : undefined }} />
              </button>

              {/* Download website button */}
              <div className="relative">
                <button
                  onClick={downloadEntireWebsite}
                  className={`p-1 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    mode === 'light'
                      ? 'text-black hover:text-black hover:bg-black/5'
                      : 'text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--card-bg)]'
                  } ${showNotices && noticeStep === 0 ? 'ring-2 ring-[var(--accent-color)] ring-offset-2 ring-offset-[#0d0d12] animate-pulse' : ''}`}
                  title="Download Website"
                  aria-label="Download Website"
                >
                  <Download className="w-3.5 h-3.5" style={{ color: mode === 'light' ? '#000000' : undefined }} />
                </button>

                {showNotices && noticeStep === 0 && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-[#13111c] border-2 border-amber-500/80 text-white rounded-xl p-3.5 shadow-[0_0_30px_rgba(245,158,11,0.4)] z-[3000] animate-fade-in select-none text-left text-xs font-medium">
                    {/* Pointer arrow pointing UP to download icon */}
                    <div className="absolute -top-2.5 right-2.5 w-3.5 h-3.5 bg-[#13111c] border-t-2 border-l-2 border-amber-500/80 transform rotate-45" />

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
                      <Download className="w-3.5 h-3.5" />
                      <span>Tip 1 of 4 • Offline Website</span>
                    </div>

                    <p className="mt-2 text-[11px] leading-relaxed text-neutral-200 font-semibold">
                      You can download the entire games website into a single file that go guardian can't block for everyone.
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        {noticeCountdown}s
                      </span>
                      <div className="flex items-center gap-1.5">
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

                    {/* Animated Progress bar at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${(noticeCountdown / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {isGlobalSettingsOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 max-h-[85vh] overflow-y-auto bg-[#12121a] border border-white/10 rounded-xl p-4 shadow-2xl z-[99999] select-none text-left animate-fade-in no-scrollbar">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">System Settings</span>
                      <button onClick={() => setIsGlobalSettingsOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-white">Sign Out On Close</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 leading-normal max-w-[150px]">
                          Automatically lock workspace when tab or window is closed.
                        </span>
                        <div
                          onClick={() => {
                            const newVal = !autoLockOnClose;
                            setAutoLockOnClose(newVal);
                            safeStorage.setItem('unblocked-auto-lock-on-close', String(newVal));
                          }}
                          className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300 shrink-0"
                          title="Toggle Sign Out On Close"
                        >
                          <div 
                            className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-out transform ${
                              autoLockOnClose ? 'translate-x-6 bg-[var(--accent-color)]' : 'translate-x-0 bg-neutral-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/5 pt-2">
                      <span className="text-xs font-bold text-white">Emergency Panic Keys</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 leading-normal max-w-[150px]">
                          Enable emergency exit keys ([, ], `, \, Double Escape).
                        </span>
                        <div
                          onClick={() => {
                            const newVal = !panicKeysEnabled;
                            setPanicKeysEnabled(newVal);
                            safeStorage.setItem('unblocked-panic-keys-enabled', String(newVal));
                          }}
                          className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300 shrink-0"
                          title="Toggle Emergency Panic Keys"
                        >
                          <div 
                            className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-out transform ${
                              panicKeysEnabled ? 'translate-x-6 bg-[var(--accent-color)]' : 'translate-x-0 bg-neutral-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/5 pt-2">
                      <span className="text-xs font-bold text-white">Auto Hide Header</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 leading-normal max-w-[150px]">
                          Automatically hide header when launching a portal.
                        </span>
                        <div
                          onClick={() => {
                            const newVal = !autoHideHeader;
                            setAutoHideHeader(newVal);
                            safeStorage.setItem('unblocked-auto-hide-header', String(newVal));
                          }}
                          className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300 shrink-0"
                          title="Toggle Auto Hide Header"
                        >
                          <div 
                            className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-out transform ${
                              autoHideHeader ? 'translate-x-6 bg-[var(--accent-color)]' : 'translate-x-0 bg-neutral-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/5 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                          History Masking
                        </span>
                        <div
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
                          className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300 shrink-0"
                          title="Toggle Browser History Masking (replaceState)"
                        >
                          <div 
                            className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-out transform ${
                              historyMaskingEnabled ? 'translate-x-6 bg-[var(--accent-color)]' : 'translate-x-0 bg-neutral-500'
                            }`}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-400 leading-normal">
                        Prevents portal titles and sub-paths from accumulating in browser history via <code className="text-[var(--accent-color)] font-mono">history.replaceState()</code>.
                      </span>
                    </div>

                    {/* Download & Notification options */}
                    <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          setFilter('info');
                          setSelectedGame(null);
                          setGameHeaderHidden(false);
                          setIsGlobalSettingsOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-[var(--accent-color)]/20 hover:border-[var(--accent-color)] border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer group"
                        title="View Information & Docs"
                      >
                        <span className="flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-[var(--accent-color)] group-hover:scale-110 transition-transform" />
                          <span>Information & Docs</span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          downloadEntireWebsite();
                          setIsGlobalSettingsOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-[var(--accent-color)]/20 hover:border-[var(--accent-color)] border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer group"
                        title="Download Website"
                      >
                        <span className="flex items-center gap-2">
                          <Download className="w-3.5 h-3.5 text-[var(--accent-color)] group-hover:scale-110 transition-transform" />
                          <span>Download Website</span>
                        </span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

              <button
                onClick={() => setViewModeAndSave('articles')}
                className={`p-1 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  mode === 'light'
                    ? 'text-black hover:text-black hover:bg-black/5'
                    : 'text-[var(--text-muted)] hover:text-red-500 hover:bg-[var(--card-bg)]'
                }`}
                title="Sign Out (Lock Workspace)"
              >
                <LogOut className="w-3 h-3" style={{ color: mode === 'light' ? '#000000' : undefined }} />
              </button>

              <div className="w-[1px] h-3 bg-[var(--card-border)]/80" />

              {/* Colors picker dots */}
              <div className="flex items-center gap-1 px-0.5">
                {[
                  { key: 'cyborg', color: 'bg-green-500 border-green-300 shadow-[0_0_5px_green]', tooltip: 'Cyborg Theme' },
                  { key: 'sunset', color: 'bg-amber-500 border-amber-300', tooltip: 'Sunset Theme' },
                  { key: 'midnight', color: 'bg-indigo-600 border-indigo-400', tooltip: 'Midnight Theme' },
                  { key: 'forest', color: 'bg-emerald-500 border-emerald-300', tooltip: 'Forest Theme' },
                  { key: 'violet', color: 'bg-indigo-600 border-indigo-400', tooltip: 'Violet Theme' },
                  { key: 'ice', color: 'bg-sky-400 border-sky-300', tooltip: 'Glacier Theme' },
                  { key: 'rose-pine', color: 'bg-rose-300 border-rose-200', tooltip: 'Rose Pine Theme' },
                  { key: 'none', color: 'bg-gradient-to-br from-neutral-300 to-neutral-700 border-neutral-400', tooltip: 'No Theme (Monochrome)' }
                ].map((themeOpt) => (
                  <button
                    key={themeOpt.key}
                    title={themeOpt.tooltip}
                    onClick={() => setTheme(themeOpt.key)}
                    className={`w-2 h-2 rounded-full ${themeOpt.color} border border-transparent transition-all duration-200 hover:scale-125 cursor-pointer ${
                      theme === themeOpt.key ? 'ring-1 ring-offset-1 ring-[var(--accent-color)]' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>

              {/* Subtle divider */}
              <div className="w-[1px] h-3 bg-[var(--card-border)]/80" />

              {/* Light/Dark slider with GoGuardian Decoy notice (Joined with color palette bar) */}
              <div className="relative flex items-center gap-1">
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
            {(filter === 'chat' || filter === 'movies' || filter === 'youtube' || filter === 'lobbychat' || filter === 'download') && (
              <button
                id="chat-back-button"
                onClick={() => setFilter('all')}
                className="flex items-center gap-1.5 text-xs font-mono font-bold py-1.5 px-3.5 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] active:scale-98"
                title="Go back to portals list"
                aria-label="Back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Go back to portals</span>
              </button>
            )}

            {/* Movies Workspace button */}
            <button
              onClick={() => { setFilter(filter === 'movies' ? 'all' : 'movies'); setSelectedGame(null); }}
              className={`text-xs border py-1.5 px-3.5 rounded-full font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-98 ${
                filter === 'movies'
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-extrabold'
                  : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]'
              }`}
              title="Toggle Movies - Stream Movies and TV Shows"
            >
              <Tv className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Movies</span>
            </button>

            {/* Quick Random Game button (Curated S-C Pool) */}
            <button
              onClick={pickRandomRankedGame}
              className="text-xs border py-1.5 px-3 rounded-full font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-95 bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] shrink-0"
              title={`Roll a random game from ${randomEligibleCount} curated classics (S-C Tier)`}
            >
              <Dices className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="hidden sm:inline">Random</span>
            </button>

            {/* Decoy Mode Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase select-none">Decoy:</span>
              <DecoyDropdown 
                value={decoyType} 
                onChange={setDecoyType} 
                mode={mode} 
                customTitles={customDecoyTitles}
                onCustomTitleChange={handleCustomTitleChange}
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
              />
            </div>

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
              <span className={`text-[10px] font-mono font-bold tracking-tight transition-colors whitespace-nowrap ${mode === 'light' ? 'text-black font-extrabold' : 'text-[var(--text-primary)]'}`} style={{ color: mode === 'light' ? '#000000' : undefined }}>
                Animations
              </span>
              <div 
                className={`relative w-7 h-4 rounded-full border transition-all duration-200 flex items-center px-0.5 ${
                  animationsEnabled 
                    ? mode === 'light' ? 'bg-black border-black' : 'bg-[var(--accent-color)] border-[var(--accent-color)]' 
                    : mode === 'light' ? 'bg-neutral-200 border-neutral-300' : 'bg-[var(--input-fill)] border-[var(--card-border)]'
                }`}
              >
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-200 ease-out transform ${
                    animationsEnabled 
                      ? mode === 'light' ? 'translate-x-3 bg-white' : 'translate-x-3 bg-[var(--bg-color)]' 
                      : mode === 'light' ? 'translate-x-0 bg-black' : 'translate-x-0 bg-[var(--text-muted)]'
                  }`}
                />
              </div>
            </div>{/* Unified Settings, Colors & Sign Out Group */}
            <div className="relative flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] p-1 rounded-full shadow-sm">
              {/* Settings Gear Button (opens System Settings Dropdown) */}
              <button
                onClick={() => setIsGlobalSettingsOpen(!isGlobalSettingsOpen)}
                className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  mode === 'light'
                    ? 'text-black hover:text-black hover:bg-black/5'
                    : 'text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--card-bg)]'
                }`}
                title="System Settings"
              >
                <Settings className="w-3.5 h-3.5" style={{ color: mode === 'light' ? '#000000' : undefined }} />
              </button>

              {/* Download website button */}
              <div className="relative">
                <button
                  onClick={downloadEntireWebsite}
                  className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    filter === 'download' 
                      ? mode === 'light' ? 'bg-black text-white font-bold' : 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_2px_8px_var(--accent-shadow)] font-bold' 
                      : mode === 'light' ? 'text-black hover:text-black hover:bg-black/5' : 'text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--card-bg)]'
                  }`}
                  title={filter === 'download' ? "Back to Portals" : "Download Website"}
                  aria-label="Download Website"
                >
                  <Download className="w-3.5 h-3.5" style={{ color: mode === 'light' ? (filter === 'download' ? '#ffffff' : '#000000') : undefined }} />
                </button>
              </div>

              {isGlobalSettingsOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 max-h-[85vh] overflow-y-auto bg-[#12121a] border border-white/10 rounded-xl p-4 shadow-2xl z-[99999] select-none text-left animate-fade-in no-scrollbar">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">System Settings</span>
                      <button onClick={() => setIsGlobalSettingsOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                        <X className="w-3" style={{ height: '12px' }} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-white">Sign Out On Close</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 leading-normal max-w-[150px]">
                          Automatically lock workspace when tab or window is closed.
                        </span>
                        <div
                          onClick={() => {
                            const newVal = !autoLockOnClose;
                            setAutoLockOnClose(newVal);
                            safeStorage.setItem('unblocked-auto-lock-on-close', String(newVal));
                          }}
                          className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300 shrink-0"
                          title="Toggle Sign Out On Close"
                        >
                          <div 
                            className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-out transform ${
                              autoLockOnClose ? 'translate-x-6 bg-[var(--accent-color)]' : 'translate-x-0 bg-neutral-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/5 pt-2">
                      <span className="text-xs font-bold text-white">Emergency Panic Keys</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 leading-normal max-w-[150px]">
                          Enable emergency exit keys ([, ], `, \, Double Escape).
                        </span>
                        <div
                          onClick={() => {
                            const newVal = !panicKeysEnabled;
                            setPanicKeysEnabled(newVal);
                            safeStorage.setItem('unblocked-panic-keys-enabled', String(newVal));
                          }}
                          className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300 shrink-0"
                          title="Toggle Emergency Panic Keys"
                        >
                          <div 
                            className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-out transform ${
                              panicKeysEnabled ? 'translate-x-6 bg-[var(--accent-color)]' : 'translate-x-0 bg-neutral-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/5 pt-2">
                      <span className="text-xs font-bold text-white">Auto Hide Header</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 leading-normal max-w-[150px]">
                          Automatically hide header when launching a portal.
                        </span>
                        <div
                          onClick={() => {
                            const newVal = !autoHideHeader;
                            setAutoHideHeader(newVal);
                            safeStorage.setItem('unblocked-auto-hide-header', String(newVal));
                          }}
                          className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300 shrink-0"
                          title="Toggle Auto Hide Header"
                        >
                          <div 
                            className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-out transform ${
                              autoHideHeader ? 'translate-x-6 bg-[var(--accent-color)]' : 'translate-x-0 bg-neutral-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/5 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                          History Masking
                        </span>
                        <div
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
                          className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300 shrink-0"
                          title="Toggle Browser History Masking (replaceState)"
                        >
                          <div 
                            className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-out transform ${
                              historyMaskingEnabled ? 'translate-x-6 bg-[var(--accent-color)]' : 'translate-x-0 bg-neutral-500'
                            }`}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-400 leading-normal">
                        Prevents portal titles and sub-paths from accumulating in browser history via <code className="text-[var(--accent-color)] font-mono">history.replaceState()</code>.
                      </span>
                    </div>

                    {/* Download & Notification options */}
                    <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          setFilter('info');
                          setSelectedGame(null);
                          setGameHeaderHidden(false);
                          setIsGlobalSettingsOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-[var(--accent-color)]/20 hover:border-[var(--accent-color)] border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer group"
                        title="View Information & Docs"
                      >
                        <span className="flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-[var(--accent-color)] group-hover:scale-110 transition-transform" />
                          <span>Information & Docs</span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          downloadEntireWebsite();
                          setIsGlobalSettingsOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-[var(--accent-color)]/20 hover:border-[var(--accent-color)] border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer group"
                        title="Download Website"
                      >
                        <span className="flex items-center gap-2">
                          <Download className="w-3.5 h-3.5 text-[var(--accent-color)] group-hover:scale-110 transition-transform" />
                          <span>Download Website</span>
                        </span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

              <button
                onClick={() => setViewModeAndSave('articles')}
                className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  mode === 'light'
                    ? 'text-black hover:text-black hover:bg-black/5'
                    : 'text-[var(--text-muted)] hover:text-red-500 hover:bg-[var(--card-bg)]'
                }`}
                title="Sign Out (Lock Workspace)"
              >
                <LogOut className="w-3.5 h-3.5" style={{ color: mode === 'light' ? '#000000' : undefined }} />
              </button>

              <div className="w-[1px] h-3.5 bg-[var(--card-border)]/80" />

              {/* Colors picker dots */}
              <div className="flex items-center gap-1 px-0.5">
                {[
                  { key: 'cyborg', color: 'bg-green-500 border-green-300 shadow-[0_0_5px_green]', tooltip: 'Cyborg Theme' },
                  { key: 'sunset', color: 'bg-amber-500 border-amber-300', tooltip: 'Sunset Theme' },
                  { key: 'midnight', color: 'bg-indigo-600 border-indigo-400', tooltip: 'Midnight Theme' },
                  { key: 'forest', color: 'bg-emerald-500 border-emerald-300', tooltip: 'Forest Theme' },
                  { key: 'violet', color: 'bg-indigo-600 border-indigo-400', tooltip: 'Violet Theme' },
                  { key: 'ice', color: 'bg-sky-400 border-sky-300', tooltip: 'Glacier Theme' },
                  { key: 'rose-pine', color: 'bg-rose-300 border-rose-200', tooltip: 'Rose Pine Theme' },
                  { key: 'none', color: 'bg-gradient-to-br from-neutral-300 to-neutral-700 border-neutral-400', tooltip: 'No Theme (Monochrome)' }
                ].map((themeOpt) => (
                  <button
                    key={themeOpt.key}
                    title={themeOpt.tooltip}
                    onClick={() => setTheme(themeOpt.key)}
                    className={`w-2 h-2 rounded-full ${themeOpt.color} border border-transparent transition-all duration-200 hover:scale-125 cursor-pointer ${
                      theme === themeOpt.key ? 'ring-1 ring-offset-1 ring-[var(--accent-color)] scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
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
            </div>

            </div>
        </div>
      </section>
      )}


      {/* MAIN CONTAINER: SIDEBAR + GAMES */}
      <div className={`flex-1 flex flex-col md:flex-row w-full mx-auto relative select-none games-no-select ${windowFullscreen ? 'z-[99999]' : 'z-10'} ${
        (filter === 'chat' || filter === 'movies' || filter === 'lobbychat' || filter === 'youtube' || filter === 'download' || filter === 'info' || selectedGame)
          ? 'max-w-none p-0 gap-0 border-t-0 lg:bg-[#07090e]' 
          : 'max-w-8xl p-4 md:p-6 gap-6 self-center'
      }`}>
        
        {/* LEFT NAV PANEL - CAT SIDEBAR */}
        {filter !== 'chat' && filter !== 'movies' && filter !== 'youtube' && filter !== 'lobbychat' && filter !== 'download' && filter !== 'info' && !selectedGame && (
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

            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('all'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'all' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>All Classrooms</span>
            </motion.button>

            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('single'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'single' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
              <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Single Player</span>
            </motion.button>
            
            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('minecraft'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'minecraft' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <Box className="w-3.5 h-3.5 shrink-0" />
              <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Minecraft</span>
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
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
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
                            ? 'bg-black/20 text-[var(--bg-color)]'
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
                                  ? 'bg-black/20 text-[var(--bg-color)]'
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
                                ? 'bg-black/20 text-[var(--bg-color)]'
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
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'featured' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Featured</span>
            </motion.button>

            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('og'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'og' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <Crown className="w-3.5 h-3.5 shrink-0" />
              <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>OG Classics</span>
            </motion.button>

            <motion.button
              whileHover={animationsEnabled ? { x: 4 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => { setFilter('multiplayer'); setSelectedGame(null); }}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                filter === 'multiplayer' && !selectedGame
                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                  : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Multiplayer</span>
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
                { tier: 'S', name: 'S Tier', desc: 'Masterpieces', count: rankedGamesByTier.S?.length || 0, badge: 'text-amber-300 border-amber-300/50 bg-amber-400/20' },
                { tier: 'A', name: 'A Tier', desc: 'Great', count: rankedGamesByTier.A?.length || 0, badge: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10' },
                { tier: 'B', name: 'B Tier', desc: 'Good', count: rankedGamesByTier.B?.length || 0, badge: 'text-sky-400 border-sky-400/40 bg-sky-400/10' },
                { tier: 'C', name: 'C Tier', desc: 'Mid & Niche', count: rankedGamesByTier.C?.length || 0, badge: 'text-purple-400 border-purple-400/40 bg-purple-400/10' },
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
                          ? 'bg-black/25 text-[var(--bg-color)] border-white/20'
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
                          ? 'bg-black/20 text-[var(--bg-color)]'
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
          
          {!selectedGame ? (
            <AnimatePresence mode="wait">
              {filter === 'chat' ? (
                <motion.div 
                  key="chat"
                  initial={animationsEnabled ? { opacity: 0, y: 15 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -15 } : undefined}
                  transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                  className={`flex flex-col w-full min-h-[550px] bg-[var(--bg-secondary)] ${headerOpen ? 'h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]' : 'h-[calc(100vh-100px)] md:h-[calc(100vh-80px)]'}`}
                >
                  <AiChatWorkspace onClose={() => setFilter('all')} />
                </motion.div>
              ) : filter === 'lobbychat' ? (
                <motion.div 
                  key="lobbychat"
                  initial={animationsEnabled ? { opacity: 0, y: 15 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -15 } : undefined}
                  transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                  className={`flex flex-col w-full min-h-[550px] bg-[var(--bg-secondary)] ${headerOpen ? 'h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]' : 'h-[calc(100vh-100px)] md:h-[calc(100vh-80px)]'}`}
                >
                  <UserChat onClose={() => setFilter('all')} />
                </motion.div>
              ) : filter === 'info' ? (
                <motion.div 
                  key="info"
                  initial={animationsEnabled ? { opacity: 0, y: 15 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -15 } : undefined}
                  transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                  className={`flex flex-col w-full bg-[var(--bg-secondary)] overflow-hidden ${headerOpen ? 'h-[calc(100vh-90px)]' : 'h-[calc(100vh-45px)]'}`}
                >
                  <InformationSection 
                    onClose={() => setFilter('all')} 
                    games={games}
                    onPlayGame={(game) => {
                      setSelectedGame(game);
                      setFilter('all');
                    }}
                    onGoToFeatured={() => {
                      setFilter('featured');
                      setSelectedGame(null);
                    }}
                    onDownloadWebsite={downloadEntireWebsite}
                  />
                </motion.div>
              ) : filter === 'movies' ? (
                <motion.div 
                  key="movies"
                  initial={animationsEnabled ? { opacity: 0, y: 15 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -15 } : undefined}
                  transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                  className={`flex flex-col w-full min-h-[550px] bg-[var(--bg-secondary)] ${headerOpen ? 'h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]' : 'h-[calc(100vh-100px)] md:h-[calc(100vh-80px)]'}`}
                >
                  <MoviesWorkspace onClose={() => setFilter('all')} />
                </motion.div>
              ) : filter === 'youtube' ? (
                <motion.div 
                  key="youtube"
                  initial={animationsEnabled ? { opacity: 0, y: 15 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -15 } : undefined}
                  transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                  className={`flex flex-col w-full min-h-[550px] bg-[#0c0a09] border border-[var(--card-border)]/60 rounded-2xl overflow-hidden ${headerOpen ? 'h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]' : 'h-[calc(100vh-100px)] md:h-[calc(100vh-80px)]'}`}
                >
                  <iframe 
                    src="https://urnperiodic.github.io/youtube1/" 
                    className="w-full h-full border-none flex-1 shadow-inner bg-[#0c0a09]"
                    allow="fullscreen"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ) : filter === 'download' ? (
                <motion.div 
                  key="download"
                  initial={animationsEnabled ? { opacity: 0, y: 15 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  exit={animationsEnabled ? { opacity: 0, y: -15 } : undefined}
                  transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                  className={`flex flex-col w-full min-h-[550px] bg-[#0c0a09] ${headerOpen ? 'h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]' : 'h-[calc(100vh-100px)] md:h-[calc(100vh-80px)]'}`}
                >
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#121019] border-b border-white/10 text-xs shrink-0">
                    <button
                      onClick={() => setFilter('all')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-[var(--accent-color)] text-white hover:text-black font-bold font-mono transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Go back to portals</span>
                    </button>
                    <span className="font-mono text-[11px] text-neutral-400">Download Workspace</span>
                  </div>
                  <iframe 
                    src="https://urnperiodic.github.io/download/" 
                    className="w-full h-full border-none flex-1 shadow-inner bg-[#0c0a09]"
                    allow="fullscreen; autoplay; clipboard-write; encrypted-media"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="games-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
                          {filter === 'featured' && 'FEATURED SHOWCASES'}
                          {filter === 'og' && 'OG CLASSICS & ORIGINALS'}
                          {filter === 'single' && 'SINGLEPLAYER PORTALS'}
                          {filter === 'multiplayer' && 'MULTIPLAYER PORTALS'}
                          {filter === 'Emulated' && 'EMULATED ARCHIVES'}
                          {filter === 'emulated-other' && 'EMULATED: OTHER SYSTEMS (<10 GAMES)'}
                          {emulatedTags.includes(filter) && `EMULATED: ${(EMULATED_SYSTEM_NAMES[filter] || filter).toUpperCase()}`}
                          {filter === 'minecraft' && 'MINECRAFT PLATFORM'}
                        </>
                      )}
                    </h2>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">
                      {normalizedSearchQuery !== ''
                        ? `Found ${filteredGames.length} portals · Page ${safeGamePage} of ${totalGamePages}`
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
                      ORIGINALS
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
                      ALL PORTALS (2708)
                    </button>

                    {/* Subtle divider */}
                    <div className="h-4 w-[1px] bg-[var(--card-border)] mx-1 hidden sm:block" />

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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedGames.map((game, index) => {
                    const isFav = favorites.includes(game.id);
                    return (
                      <motion.div 
                        key={game.id}
                        initial={animationsEnabled ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        exit={animationsEnabled ? { opacity: 0 } : undefined}
                        transition={animationsEnabled ? { duration: 0.15 } : { duration: 0 }}
                        whileHover={animationsEnabled ? { scale: 1.03, y: -4, transition: { duration: 0.2 } } : undefined}
                        whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
                        onClick={() => {
                          recordRecentlyPlayed(game.id);
                          setSelectedGame(game);
                          setZoom(1);
                        }}
                        className={`custom-card flex flex-col rounded-xl overflow-hidden cursor-pointer h-full ${
                          animationsEnabled ? 'transition-all duration-300' : ''
                        } ${
                          game.featured 
                            ? 'border-amber-500/20 hover:border-amber-500/50 shadow-md hover:shadow-amber-500/5' 
                            : ''
                        }`}
                      >
                        {/* Artwork container */}
                        <div className="relative aspect-video w-full bg-neutral-950 flex-shrink-0 flex items-center justify-center border-b border-[var(--card-border)] overflow-hidden">
                          {game.thumbnail && !failedThumbnails[game.id] ? (
                            <img 
                              src={getOptimizedThumbnail(game.thumbnail)} 
                              alt={game.title} 
                              width="640"
                              height="360"
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              draggable="false"
                              onError={() => setFailedThumbnails(prev => ({ ...prev, [game.id]: true }))}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 select-none pointer-events-none" 
                            />
                          ) : (
                            <img
                              src={defaultThumbnail}
                              alt={game.title}
                              width="640"
                              height="360"
                              loading="lazy"
                              decoding="async"
                              draggable="false"
                              className="w-full h-full object-cover select-none pointer-events-none"
                            />
                          )}

                          {/* Rank badge on game card */}
                          {(() => {
                            const rankInfo = getGameRankInfo(game);
                            if (rankInfo && (isRankingsActive || rankInfo.rank <= 10)) {
                              return (
                                <span className={`absolute top-2.5 left-2.5 z-10 flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md shadow-md font-mono ${
                                  rankInfo.rank === 1
                                    ? 'bg-amber-400 text-black border border-amber-300'
                                    : rankInfo.rank === 2
                                    ? 'bg-slate-200 text-slate-900 border border-slate-300'
                                    : rankInfo.rank === 3
                                    ? 'bg-amber-700 text-amber-100 border border-amber-600'
                                    : 'bg-black/85 text-amber-300 border border-amber-400/40 backdrop-blur-sm'
                                }`}>
                                  <Trophy className="w-2.5 h-2.5 shrink-0" />
                                  <span>#{rankInfo.rank} · TIER {rankInfo.tier}</span>
                                </span>
                              );
                            }
                            if (game.featured) {
                              return (
                                <span className="absolute top-2.5 left-2.5 text-[12px] font-black bg-black/85 text-amber-400 border border-amber-500/30 w-6 h-6 rounded-md inline-flex items-center justify-center z-10 shadow-sm font-mono">
                                  ★
                                </span>
                              );
                            }
                            return null;
                          })()}

                          <span className="absolute top-2.5 right-2.5 text-[8px] font-bold uppercase tracking-widest bg-black/75 backdrop-blur-sm text-white border border-white/10 px-2.5 py-0.5 rounded-full inline-block z-10">
                            {game.category}
                          </span>

                          {game.isAiGenerated && (
                            <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[8px] font-extrabold tracking-wider bg-black/85 backdrop-blur-sm text-white border border-white/20 px-2 py-0.5 rounded-full inline-flex z-10 shadow-sm font-mono uppercase">
                              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="currentColor" />
                              </svg>
                              <span>Gemini</span>
                            </span>
                          )}

                        </div>

                        {/* Title and descriptions */}
                        <div className="games-card-copy p-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h3 className={`games-card-copy-title text-sm font-black line-clamp-1 leading-snug transition-colors flex items-center gap-1.5 ${
                              game.featured 
                                ? 'text-[var(--text-primary)] group-hover:text-amber-400' 
                                : 'text-[var(--text-primary)] group-hover:text-[var(--accent-color)]'
                            }`}>
                              <span className="min-w-0 flex-1 truncate">{game.title}</span>
                              {game.isAiGenerated && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--accent-color)]/10 border border-[var(--card-border)] text-[var(--text-primary)]" title="Gemini AI Generated">
                                  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="currentColor" />
                                  </svg>
                                </span>
                              )}
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
                            </h3>
                            <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                              {game.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 mt-3 w-full">
                            {game.featured ? (
                              <button
                                onClick={() => {
                                  recordRecentlyPlayed(game.id);
                                  setSelectedGame(game);
                                  setZoom(1);
                                }}
                                className="flex-1 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500 hover:text-black hover:font-bold hover:shadow-[0_4px_14px_rgba(245,158,11,0.35)] text-[11px] font-semibold tracking-wider text-amber-500 dark:text-amber-400 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 uppercase cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Play</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  recordRecentlyPlayed(game.id);
                                  setSelectedGame(game);
                                  setZoom(1);
                                }}
                                className="flex-1 border border-[var(--card-border)] bg-[var(--accent-color)]/5 hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] hover:font-bold hover:shadow-[0_4px_14px_var(--accent-shadow)] text-[11px] font-semibold tracking-wider text-[var(--text-primary)] py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 uppercase cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-current" />
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
                              className="p-2 border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] bg-[var(--bg-secondary)] hover:bg-[var(--card-bg)] rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer"
                              title="Open Portal in about:blank"
                              aria-label={`Open ${game.title} in about:blank`}
                            >
                              <ExternalLink className="w-4 h-4" />
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
                                  className="p-2 border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] bg-[var(--bg-secondary)] hover:bg-[var(--card-bg)] rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer"
                                  title={`Open Direct Link (${getDirectGmfilesUrl(game.url)})`}
                                >
                                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                  className="p-2 border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] bg-[var(--bg-secondary)] hover:bg-[var(--card-bg)] rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer"
                                  title="Download Offline Piece (.html)"
                                >
                                  <Download className="w-4 h-4" />
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
                    ORIGINALS
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
                    ALL PORTALS (2708)
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
                <div className={`sticky ${gameHeaderHidden ? 'top-0' : headerOpen ? 'top-[108px] sm:top-[56px]' : 'top-[108px] md:top-[44px]'} z-[50] flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--card-border)] bg-[var(--bg-secondary)] rounded-none py-3 px-4 gap-3 shadow-inner`}>
                  
                  <button
                    onClick={() => {
                      safeStorage.removeItem('unblocked-last-game');
                      setSelectedGame(null);
                    }}
                    className="flex items-center gap-2 border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all font-mono py-1.5 px-3.5 rounded-lg text-xs font-bold leading-normal cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Go back</span>
                  </button>

                  <div className="hidden xl:flex items-center gap-2.5">
                    <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                      {selectedGame.title}
                      <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border border-[var(--card-border)] bg-[var(--bg-color)] text-[var(--accent-color)]">
                        {selectedGame.category}
                      </span>
                      {selectedGame.isAiGenerated && (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border border-[var(--card-border)] bg-[var(--accent-color)]/10 text-[var(--text-primary)]">
                          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="currentColor" />
                          </svg>
                          <span>Gemini AI</span>
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    
                    {/* Zoom controls */}
                    <div className="flex items-center bg-[var(--bg-color)] border border-[var(--card-border)] rounded-lg overflow-hidden p-0.5">
                      <button
                        onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
                        className="p-1 px-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded transition-colors"
                        title="Zoom Out"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] px-2 font-mono text-[var(--text-primary)] font-bold select-none">
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        onClick={() => setZoom(z => Math.min(1.8, z + 0.1))}
                        className="p-1 px-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded transition-colors"
                        title="Zoom In"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setZoom(1)}
                        className="p-1 px-1.5 text-xs text-[var(--accent-color)] font-mono hover:bg-[var(--card-bg)] rounded transition-colors"
                        title="Reset Zoom"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Reload button */}
                    <button
                      onClick={() => {
                        const iframe = document.getElementById('game-frame');
                        if (iframe) iframe.src = iframe.src;
                      }}
                      className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer"
                      title="Reload Iframe (Refresh portal frame)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[10px] font-bold tracking-tight">Reload Iframe</span>
                    </button>

                    {/* Refresh Page button */}
                    <button
                      onClick={handleRefreshPage}
                      className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer"
                      title="Refresh Entire Page (Safe reload for about:blank)"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 text-[var(--accent-color)] ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline text-[10px] font-bold tracking-tight">Refresh Page</span>
                    </button>

                    {/* Direct Gmfiles Link button for local public games */}
                    {selectedGame && isLocalGame(selectedGame.url) && (
                      <button
                        onClick={() => {
                          setGameFrame(null);
                          window.open(getDirectGmfilesUrl(selectedGame.url), '_blank');
                        }}
                        className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-2.5 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer"
                        title={`Open Direct Link (${getDirectGmfilesUrl(selectedGame.url)})`}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
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
                        className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-2.5 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer"
                        title="Download Offline (.html)"
                      >
                        <Download className="w-3.5 h-3.5 text-[var(--accent-color)]" />
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
                      className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer"
                      title="Toggle Fullscreen Arena (FS)"
                    >
                      <Expand className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[10px] font-bold tracking-tight">FS</span>
                    </button>

                    {/* Window Fullscreen Button */}
                    <button
                      onClick={() => setWindowFullscreen(!windowFullscreen)}
                      className={`flex items-center gap-1.5 border py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                        windowFullscreen
                          ? 'border-amber-500 bg-amber-500/15 text-amber-500 font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                          : 'border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                      }`}
                      title={windowFullscreen ? "Exit Win FS" : "Win FS (Window Fullscreen)"}
                    >
                      {windowFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline text-[10px] font-bold tracking-tight">Win FS</span>
                    </button>

                  {/* Open in New Tab (Blank) button */}
                  <button
                    onClick={() => openGameInAboutBlank(selectedGame)}
                    className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer"
                    title="Open in Blank (about:blank)"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px] font-bold tracking-tight">Abt:Blank</span>
                  </button>

                  {/* Lobby Chat (Slideout Chat) Toggle Button */}
                  <button
                    onClick={() => setDockedChatCollapsed(!dockedChatCollapsed)}
                    className={`flex items-center gap-1.5 border py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      !dockedChatCollapsed 
                        ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-bold shadow-[0_0_8px_rgba(0,229,176,0.15)]' 
                        : 'border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)]'
                    }`}
                    title="Toggle Slideout Chat inside Portal Arena"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px] font-bold tracking-tight">Slideout Chat</span>
                  </button>

                  {/* Hide / Show Header Button */}
                  <motion.button
                    whileHover={animationsEnabled ? { scale: 1.03 } : undefined}
                    whileTap={animationsEnabled ? { scale: 0.97 } : undefined}
                    onClick={() => setGameHeaderHidden(!gameHeaderHidden)}
                    className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] py-1.5 px-3 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer relative"
                    title={gameHeaderHidden ? "Show Main Website Header" : "Hide Main Website Header"}
                  >
                    <motion.div
                      animate={animationsEnabled ? (gameHeaderHidden ? { rotate: 180, scale: 1.05 } : { rotate: 0, scale: 1 }) : { rotate: 0, scale: 1 }}
                      transition={animationsEnabled ? { type: "spring", stiffness: 200, damping: 15 } : { duration: 0 }}
                      className="flex items-center justify-center"
                    >
                      {gameHeaderHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </motion.div>
                    <span className="hidden sm:inline text-[10px] font-bold tracking-tight">
                      {gameHeaderHidden ? 'SHOW HEADER' : 'HIDE HEADER'}
                    </span>
                  </motion.button>



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
                        allowFullScreen
                        referrerPolicy="no-referrer"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      />
                    ) : externalActiveGame ? (
                      <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 bg-[#080b12] text-white select-none">
                        {/* Compact Dark Card matching popout design */}
                        <div className="max-w-[380px] w-full bg-[#0b1019] border border-[#1b2636] shadow-2xl rounded-2xl p-6 flex flex-col items-center text-center">
                          
                          {/* Top Square Green/Amber Icon Badge */}
                          <div className="w-11 h-11 rounded-xl bg-[#0a231b] border border-[#00c875]/40 flex items-center justify-center text-[#00c875] mb-3.5 shadow-sm">
                            <ExternalLink className="w-5 h-5 text-[#00c875]" />
                          </div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1 font-sans">
                            {selectedGame.title} is active in another tab
                          </h3>

                          {/* Subtitle Description */}
                          <p className="text-slate-400 text-xs sm:text-sm leading-normal mb-5 font-sans max-w-[300px]">
                            In-arena frame is paused to avoid lag and duplicate audio.
                          </p>

                          {/* Side-by-Side Action Buttons */}
                          <div className="flex flex-row items-center gap-2.5 w-full">
                            <button
                              onClick={() => {
                                setExternalActiveGame(null);
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
                              }}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#00c875] hover:bg-[#00b268] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00c875]/20 active:scale-[0.98]"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
                              <span>Resume Here</span>
                            </button>
                            <button
                              onClick={() => openGameInAboutBlank(selectedGame)}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#242f40] hover:bg-[#2c3a4f] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/5 active:scale-[0.98]"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                              <span>Re-open Tab</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    ) : aboutBlankActiveGame === selectedGame.id ? (
                      <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 bg-[#080b12] text-white select-none">
                        {/* Compact Dark Card matching popout design */}
                        <div className="max-w-[380px] w-full bg-[#0b1019] border border-[#1b2636] shadow-2xl rounded-2xl p-6 flex flex-col items-center text-center">
                          
                          {/* Top Square Green Icon Badge */}
                          <div className="w-11 h-11 rounded-xl bg-[#0a231b] border border-[#00c875]/40 flex items-center justify-center text-[#00c875] mb-3.5 shadow-sm">
                            <ExternalLink className="w-5 h-5 text-[#00c875]" />
                          </div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1 font-sans">
                            {selectedGame.title} is open in a popout tab
                          </h3>

                          {/* Subtitle Description */}
                          <p className="text-slate-400 text-xs sm:text-sm leading-normal mb-5 font-sans max-w-[300px]">
                            In-arena frame is paused to avoid lag and duplicate audio.
                          </p>

                          {/* Side-by-Side Action Buttons */}
                          <div className="flex flex-row items-center gap-2.5 w-full">
                            <button
                              onClick={() => {
                                setAboutBlankActiveGame(null);
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
                              className="flex-1 py-2 px-3 rounded-xl bg-[#00c875] hover:bg-[#00b268] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00c875]/20 active:scale-[0.98]"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
                              <span>Resume Here</span>
                            </button>
                            <button
                              onClick={() => openGameInAboutBlank(selectedGame)}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#242f40] hover:bg-[#2c3a4f] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/5 active:scale-[0.98]"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                              <span>Re-open Tab</span>
                            </button>
                          </div>

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
                {!dockedChatCollapsed && (
                  <div 
                    style={{ width: window.innerWidth >= 1024 ? '235px' : '100%' }}
                    className="w-full lg:h-full h-[320px] shrink-0 flex flex-col bg-[#070a11] border-t lg:border-t-0 lg:border-l border-[var(--card-border)]/50 rounded-none overflow-hidden"
                  >
                    <div className="flex-1 min-h-0">
                      <UserChat onClose={() => {}} isMini={true} />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>



        </div>
      </Suspense>
    </MotionConfig>
  );
}
