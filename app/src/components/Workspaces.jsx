import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Download,
  ExternalLink,
  Film,
  Layers,
  MessageSquare,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Shuffle,
  Sparkles,
  Square,
  Timer,
  Trash2,
  Tv,
  Volume2,
  VolumeX,
  X,
  XCircle,
} from 'lucide-react';
import {
  BUILTIN_FLASHCARD_DECKS as initialDecks,
  BUILTIN_QUIZZES as quizzesData,
  extractCardsFromArticle,
} from '../data/studyData';

// ============================================================================
// 1. PORTAL WORKSPACES REGISTRY (Add or edit workspaces in one place!)
// ============================================================================
// To add a new iframe workspace to App.jsx:
// Simply add an object here with { id, label, title, url, accessKey, ... }.
export const PORTAL_WORKSPACES = [
  {
    id: 'movies',
    label: 'Movies',
    title: 'Movies Workspace',
    url: 'https://urnperiodic.github.io/p/',
    accessKey: 'moviesAccess',
    activityKey: 'movies',
    activityLabel: 'Browsing Movies',
    aboutBlankTitle: 'Open Movies in about:blank',
    iframeId: 'chat-decoy-iframe',
    wrapperId: 'chat-decoy',
    innerWrapperId: 'iframe-wrapper',
    bgClass: 'bg-[#1a1f2c]',
    showHeaderBar: false,
    directAboutBlankUrl: false,
    allowAboutBlank: true,
    allowExternalLink: true,
  },
  {
    id: 'moremovies',
    label: 'More Movies',
    title: 'More Movies - Atlantic Stream',
    url: 'https://atlantic.st',
    accessKey: 'moreMoviesAccess',
    activityKey: 'moremovies',
    activityLabel: 'Browsing More Movies',
    aboutBlankTitle: 'Open More Movies in about:blank',
    iframeId: 'atlantic-movies-iframe',
    wrapperId: 'more-movies',
    innerWrapperId: 'atlantic-iframe-wrapper',
    bgClass: 'bg-[#0f131a]',
    showHeaderBar: false,
    directAboutBlankUrl: false,
    allowAboutBlank: true,
    allowExternalLink: true,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    title: 'YouTube Workspace',
    url: 'https://urnperiodic.github.io/youtube1/',
    accessKey: 'youtubeAccess',
    activityKey: 'youtube',
    activityLabel: 'Watching YouTube',
    aboutBlankTitle: 'Open YouTube in about:blank',
    iframeId: 'youtube-workspace-iframe',
    bgClass: 'bg-[#0c0a09]',
    showHeaderBar: true,
    directAboutBlankUrl: true,
    allowAboutBlank: true,
    allowExternalLink: true,
  },
  {
    id: 'download',
    label: 'Download',
    title: 'Download Workspace',
    url: 'https://urnperiodic.github.io/download/',
    accessKey: 'downloadAccess',
    activityKey: 'catalog',
    activityLabel: 'Browsing Downloads',
    aboutBlankTitle: 'Open Download in about:blank',
    iframeId: 'download-workspace-iframe',
    bgClass: 'bg-[#0c0a09]',
    showHeaderBar: true,
    directAboutBlankUrl: true,
    allowAboutBlank: true,
    allowExternalLink: true,
  },
  {
    id: 'chat',
    label: 'AI Chat',
    title: 'Gemini AI Chat Tutor (Admin)',
    url: 'https://grandplat2.vercel.app/',
    accessKey: 'aiAccess',
    activityKey: 'ai',
    activityLabel: 'Using AI Chat',
    aboutBlankTitle: 'Open Workspace in about:blank',
    iframeId: 'chat-decoy-iframe',
    wrapperId: 'chat-decoy',
    innerWrapperId: 'iframe-wrapper',
    bgClass: 'bg-[#1a1f2c]',
    showHeaderBar: false,
    directAboutBlankUrl: false,
    allowAboutBlank: false,
    allowExternalLink: false,
    requiresAdminPassword: true,
  },
  {
    id: 'lobbychat',
    label: 'Lobby Chat',
    title: 'Lobby Chat',
    url: '',
    accessKey: 'lobbyChatAccess',
    activityKey: 'lobbychat',
    activityLabel: 'In Lobby Chat',
    aboutBlankTitle: 'Open Lobby Chat in about:blank',
    isCustomComponent: true,
    directAboutBlankUrl: false,
    allowAboutBlank: true,
    allowExternalLink: true,
  },
];

export const PORTAL_WORKSPACE_IDS = PORTAL_WORKSPACES.map((w) => w.id);

export function getPortalWorkspace(filterId) {
  return PORTAL_WORKSPACES.find((w) => w.id === filterId) || null;
}

export function isPortalWorkspaceFilter(filterId) {
  return PORTAL_WORKSPACES.some((w) => w.id === filterId);
}

export function getWorkspaceExternalUrl(filterId, origin = typeof window !== 'undefined' ? window.location.origin : '') {
  const ws = getPortalWorkspace(filterId);
  if (!ws) return '';
  if (ws.id === 'lobbychat') {
    return `${origin}?filter=lobbychat&view=games`;
  }
  return ws.url || '';
}

export function getWorkspaceAboutBlankTitle(filterId) {
  const ws = getPortalWorkspace(filterId);
  return ws?.aboutBlankTitle || 'Open Workspace in about:blank';
}

export function getWorkspaceAboutBlankTargetUrl(
  filterId,
  origin = typeof window !== 'undefined' ? window.location.origin : '',
  encodedDecoy = 'google',
) {
  const ws = getPortalWorkspace(filterId);
  if (!ws) return `${origin}/?view=games&unlocked=true&decoyType=${encodedDecoy}`;
  if (ws.directAboutBlankUrl && ws.url) {
    return ws.url;
  }
  return `${origin}/?filter=${encodeURIComponent(ws.id)}&view=games&unlocked=true&decoyType=${encodedDecoy}`;
}

// ============================================================================
// 2. UNIFIED PORTAL WORKSPACE RENDERER & INDIVIDUAL WORKSPACE EXPORTS
// ============================================================================

export function PortalWorkspaceView({ workspaceId, onClose }) {
  const ws = getPortalWorkspace(workspaceId);
  if (!ws || !ws.url) return null;

  if (ws.showHeaderBar) {
    return (
      <div className={`flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden ${ws.bgClass || 'bg-[#0c0a09]'}`}>
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#121019] border-b border-white/10 text-xs shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-[var(--accent-color)] text-white hover:text-black font-bold font-mono transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go back to portals</span>
          </button>
          <span className="font-mono text-[11px] text-neutral-400">{ws.title}</span>
        </div>
        <iframe
          id={ws.iframeId}
          src={ws.url}
          title={ws.title}
          className={`w-full h-full border-none flex-1 shadow-inner ${ws.bgClass || 'bg-[#0c0a09]'}`}
          allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div
      id={ws.wrapperId || `workspace-${ws.id}`}
      className={`relative w-full h-full flex flex-col ${ws.bgClass || 'bg-[#1a1f2c]'} text-[#e2e8f0] overflow-hidden`}
    >
      <div id={ws.innerWrapperId || `iframe-wrapper-${ws.id}`} className="flex-1 w-full h-full bg-white">
        <iframe
          id={ws.iframeId}
          src={ws.url}
          className="w-full h-full border-none"
          title={ws.title}
          allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}

export function MoviesWorkspace({ onClose }) {
  return <PortalWorkspaceView workspaceId="movies" onClose={onClose} />;
}

export function MoreMoviesWorkspace({ onClose }) {
  return <PortalWorkspaceView workspaceId="moremovies" onClose={onClose} />;
}

export function AiChatWorkspace({ onClose }) {
  return <PortalWorkspaceView workspaceId="chat" onClose={onClose} />;
}

export function YouTubeWorkspace({ onClose }) {
  return <PortalWorkspaceView workspaceId="youtube" onClose={onClose} />;
}

export function DownloadWorkspace({ onClose }) {
  return <PortalWorkspaceView workspaceId="download" onClose={onClose} />;
}

// ============================================================================
// 3. EDUCATIONAL / DECOY WORKSPACES (Notes, Study Timer, Flashcards, Quiz)
// ============================================================================

export function NotesWorkspace() {
  const [iframeKey, setIframeKey] = useState(0);
  const targetUrl = 'https://urnperiodic.github.io/note/';

  const reloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-xl animate-fade-in">
      {/* Mini Controls Bar */}
      <div className="px-4 py-2 bg-[var(--card-bg)] border-b border-[var(--card-border)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[var(--text-primary)]">
            Interactive Study Notepad
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={reloadIframe}
            className="p-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--input-fill)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--card-border)] transition-all cursor-pointer"
            title="Reload Notepad"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/20 text-[10px] font-mono font-bold transition-all"
            title="Open in new tab"
          >
            <span>External</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Embedded Web View */}
      <div className="flex-1 w-full h-full relative bg-white">
        <iframe
          key={iframeKey}
          src={targetUrl}
          title="Study Notes Tool"
          className="w-full h-full border-0"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}

export function StudyTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' (25m), 'short' (5m), 'long' (15m), 'stopwatch'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    try {
      return parseInt(localStorage.getItem('academic-pomodoro-sessions') || '0', 10);
    } catch {
      return 0;
    }
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Ignore audio errors
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (mode === 'stopwatch') {
          setTimeLeft((prev) => prev + 1);
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsActive(false);
              playBeep();
              if (mode === 'pomodoro') {
                setSessionsCompleted((s) => {
                  const next = s + 1;
                  try {
                    localStorage.setItem('academic-pomodoro-sessions', String(next));
                  } catch {}
                  return next;
                });
              }
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode, soundEnabled]);

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'pomodoro') setTimeLeft(25 * 60);
    else if (newMode === 'short') setTimeLeft(5 * 60);
    else if (newMode === 'long') setTimeLeft(15 * 60);
    else if (newMode === 'stopwatch') setTimeLeft(0);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    else if (mode === 'short') setTimeLeft(5 * 60);
    else if (mode === 'long') setTimeLeft(15 * 60);
    else if (mode === 'stopwatch') setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'pomodoro' ? 25 * 60 : mode === 'short' ? 5 * 60 : mode === 'long' ? 15 * 60 : 3600;
  const progress =
    mode === 'stopwatch'
      ? Math.min(100, (timeLeft / 3600) * 100)
      : ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer shadow-sm ${
          isActive
            ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] animate-pulse'
            : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)]'
        }`}
        title="Study Timer & Pomodoro Clock"
      >
        <Timer className="w-3.5 h-3.5" />
        <span>{formatTime(timeLeft)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl p-4 z-50 text-left select-none animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)]">
            <div className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-[var(--accent-color)]" />
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                Focus Timer
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title={soundEnabled ? 'Mute alarm' : 'Unmute alarm'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1 my-3 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--card-border)]">
            {[
              { id: 'pomodoro', label: '25m', icon: BookOpen },
              { id: 'short', label: '5m', icon: Coffee },
              { id: 'long', label: '15m', icon: Coffee },
              { id: 'stopwatch', label: 'Up', icon: Timer },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => switchMode(m.id)}
                className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  mode === m.id
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          <div className="my-4 text-center">
            <div className="text-4xl font-black font-mono tracking-tight text-[var(--text-primary)]">
              {formatTime(timeLeft)}
            </div>
            <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1 uppercase tracking-wider">
              {mode === 'pomodoro'
                ? 'Deep Study Session'
                : mode === 'short'
                  ? 'Short Rest Break'
                  : mode === 'long'
                    ? 'Long Recovery Break'
                    : 'Open Elapsed Time'}
            </p>
            <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden mt-3 border border-[var(--card-border)]">
              <div
                className="h-full bg-[var(--accent-color)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`flex-1 py-2 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isActive
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-[var(--accent-color)] text-[var(--bg-color)] hover:opacity-90'
              }`}
            >
              {isActive ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--input-fill)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--card-border)] transition-all cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--card-border)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>Completed Sessions:</span>
            <span className="font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2 py-0.5 rounded-md border border-[var(--accent-color)]/20">
              {sessionsCompleted} 🍅
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function FlashcardsWorkspace({ refArticle }) {
  const [decks, setDecks] = useState(() => {
    try {
      const saved = localStorage.getItem('academic-flashcard-decks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialDecks;
  });

  const [selectedDeckId, setSelectedDeckId] = useState(() => decks[0]?.id || 'bio-101');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('academic-mastered-cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showAddCard, setShowAddCard] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newDef, setNewDef] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('academic-flashcard-decks', JSON.stringify(decks));
    } catch {}
  }, [decks]);

  useEffect(() => {
    try {
      localStorage.setItem('academic-mastered-cards', JSON.stringify(masteredIds));
    } catch {}
  }, [masteredIds]);

  const activeDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];
  const cards = activeDeck?.cards || [];
  const safeIndex = Math.min(currentIndex, Math.max(0, cards.length - 1));
  const currentCard = cards[safeIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (cards.length ? (prev + 1) % cards.length : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (cards.length ? (prev - 1 + cards.length) % cards.length : 0));
  };

  const handleShuffle = () => {
    if (!activeDeck || cards.length < 2) return;
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setDecks((prev) => prev.map((d) => (d.id === activeDeck.id ? { ...d, cards: shuffled } : d)));
    setCurrentIndex(0);
  };

  const toggleMastered = (cardId) => {
    if (!cardId) return;
    setMasteredIds((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newTerm.trim() || !newDef.trim() || !activeDeck) return;
    const created = {
      id: `${activeDeck.id}-${Date.now()}`,
      term: newTerm.trim(),
      definition: newDef.trim(),
    };
    setDecks((prev) =>
      prev.map((d) => (d.id === activeDeck.id ? { ...d, cards: [...d.cards, created] } : d)),
    );
    setNewTerm('');
    setNewDef('');
    setShowAddCard(false);
    setCurrentIndex(cards.length);
  };

  const handleGenerateFromArticle = () => {
    if (!refArticle?.content) return;
    const extracted = extractCardsFromArticle(refArticle);
    const generatedCards =
      extracted.length > 0
        ? extracted
        : refArticle.content
            .split(/[.?!]\s+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 35 && s.length < 220)
            .slice(0, 8)
            .map((s, idx) => {
              const words = s.split(' ');
              const term = words.slice(0, Math.min(5, words.length)).join(' ').replace(/[^a-zA-Z0-9\s-]/g, '');
              return {
                id: `gen-${Date.now()}-${idx}`,
                term: `${term || 'Key Concept'} (${idx + 1})`,
                definition: s,
              };
            });
    if (generatedCards.length === 0) return;

    const newDeckId = `article-${refArticle.id}`;
    const newDeck = {
      id: newDeckId,
      title: refArticle.title.slice(0, 36),
      subject: refArticle.category || 'Custom',
      category: refArticle.category || 'Custom',
      cards: generatedCards,
    };

    setDecks((prev) => {
      const filtered = prev.filter((d) => d.id !== newDeckId);
      return [newDeck, ...filtered];
    });
    setSelectedDeckId(newDeckId);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 md:p-6 overflow-y-auto">
      {/* Left Deck Selector */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[var(--accent-color)]" />
            <span>Study Decks</span>
          </span>
          {refArticle && (
            <button
              type="button"
              onClick={handleGenerateFromArticle}
              className="px-2 py-1 rounded-lg bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/40 text-[var(--accent-color)] text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-[var(--accent-color)]/25"
              title={`Build deck from "${refArticle.title}"`}
            >
              <Sparkles className="w-3 h-3" />
              <span>From Article</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {decks.map((deck) => {
            const isSelected = deck.id === activeDeck?.id;
            const masteredInDeck = (deck.cards || []).filter((c) => masteredIds.includes(c.id)).length;
            return (
              <button
                key={deck.id}
                type="button"
                onClick={() => {
                  setSelectedDeckId(deck.id);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-sm'
                    : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono uppercase text-[var(--accent-color)] mb-1">
                  <span>{deck.subject || deck.category}</span>
                  <span>
                    {masteredInDeck}/{deck.cards?.length || 0} mastered
                  </span>
                </div>
                <div className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">{deck.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Flashcard Stage */}
      <div className="flex-1 flex flex-col bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-4 sm:p-6 justify-between gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--card-border)] pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{activeDeck?.title}</h3>
            <p className="text-[11px] font-mono text-[var(--text-muted)]">
              Card {cards.length ? safeIndex + 1 : 0} of {cards.length} · Click card to flip
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              className="px-2.5 py-1.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-mono font-bold text-[var(--text-primary)] hover:border-[var(--accent-color)] flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Shuffle</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddCard((v) => !v)}
              className="px-2.5 py-1.5 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
          </div>
        </div>

        {showAddCard && (
          <form
            onSubmit={handleAddCard}
            className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] space-y-2.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                placeholder="Term or question..."
                className="px-3 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-primary)] outline-none"
              />
              <input
                type="text"
                required
                value={newDef}
                onChange={(e) => setNewDef(e.target.value)}
                placeholder="Definition or answer..."
                className="px-3 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-primary)] outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddCard(false)}
                className="px-3 py-1 rounded-lg text-xs text-[var(--text-muted)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-bold cursor-pointer"
              >
                Save Card
              </button>
            </div>
          </form>
        )}

        {currentCard ? (
          <div
            onClick={() => setIsFlipped((f) => !f)}
            className="flex-1 min-h-[220px] rounded-2xl border-2 border-[var(--card-border)] hover:border-[var(--accent-color)]/60 bg-[var(--card-bg)] p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none shadow-md"
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent-color)] mb-3">
              {isFlipped ? 'Definition / Answer' : 'Term / Prompt'}
            </span>
            <p className="text-base sm:text-xl font-bold text-[var(--text-primary)] max-w-2xl leading-relaxed">
              {isFlipped ? currentCard.definition : currentCard.term}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs font-mono text-[var(--text-muted)]">
            No flashcards in this deck yet.
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={handlePrev}
            className="px-4 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-mono font-bold text-[var(--text-primary)] hover:border-[var(--accent-color)] flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentCard && (
            <button
              type="button"
              onClick={() => toggleMastered(currentCard.id)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                masteredIds.includes(currentCard.id)
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-muted)]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{masteredIds.includes(currentCard.id) ? 'Mastered' : 'Mark Mastered'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-mono font-bold text-[var(--text-primary)] hover:border-[var(--accent-color)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function QuizWorkspace() {
  const [selectedSubject, setSelectedSubject] = useState(quizzesData[0]?.id || 'biology');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const activeQuiz = quizzesData.find((q) => q.id === selectedSubject) || quizzesData[0];
  const questions = activeQuiz?.questions || [];
  const question = questions[currentQ];

  const handleSelectQuiz = (id) => {
    setSelectedSubject(id);
    setCurrentQ(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    const correctIdx = question?.correctIndex ?? question?.answer;
    if (selectedOption === correctIdx) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setQuizCompleted(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 md:p-6 overflow-y-auto">
      {/* Subject List */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-1">
          Practice Quizzes
        </span>
        {quizzesData.map((quiz) => (
          <button
            key={quiz.id}
            type="button"
            onClick={() => handleSelectQuiz(quiz.id)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              quiz.id === activeQuiz?.id
                ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-sm'
                : 'bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40'
            }`}
          >
            <div className="text-[9px] font-mono uppercase text-[var(--accent-color)]">{quiz.subject || quiz.category}</div>
            <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">{quiz.title}</div>
          </button>
        ))}
      </div>

      {/* Active Quiz Panel */}
      <div className="flex-1 flex flex-col bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-4 sm:p-6 justify-between gap-4">
        {quizCompleted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-10">
            <Award className="w-12 h-12 text-[var(--accent-color)]" />
            <h3 className="text-lg font-black text-[var(--text-primary)]">Quiz Complete!</h3>
            <p className="text-sm font-mono text-[var(--text-muted)]">
              You scored <strong className="text-[var(--accent-color)]">{score}</strong> out of{' '}
              <strong>{questions.length}</strong> ({Math.round((score / Math.max(1, questions.length)) * 100)}%)
            </p>
            <button
              type="button"
              onClick={() => handleSelectQuiz(activeQuiz.id)}
              className="mt-2 px-4 py-2 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          </div>
        ) : question ? (
          <>
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{activeQuiz?.title}</h3>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  Question {currentQ + 1} of {questions.length} · Score: {score}
                </p>
              </div>
            </div>

            <div className="space-y-3 my-auto py-4">
              <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)] leading-snug">
                {question.prompt || question.question}
              </h4>
              <div className="space-y-2">
                {question.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isCorrect = idx === (question.correctIndex ?? question.answer);
                  let btnStyle = 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-primary)]';
                  if (isSubmitted) {
                    if (isCorrect) btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-400';
                    else if (isChosen) btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-400';
                  } else if (isChosen) {
                    btnStyle = 'bg-[var(--accent-color)]/15 border-[var(--accent-color)] text-[var(--accent-color)]';
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isSubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {isSubmitted && question.explanation && (
                <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--text-muted)]">
                  <strong className="text-[var(--text-primary)]">Explanation: </strong>
                  {question.explanation}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-[var(--card-border)]">
              {!isSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleCheckAnswer}
                  className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-mono font-bold disabled:opacity-40 cursor-pointer"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-mono font-bold cursor-pointer"
                >
                  {currentQ + 1 >= questions.length ? 'View Results' : 'Next Question →'}
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
