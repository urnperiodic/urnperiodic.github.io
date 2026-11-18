import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CLARITY_PALETTE,
  CLARITY_STORAGE_KEY,
  CLARITY_THEMES,
  CLARITY_YT_ACCENT,
  ClarityParser,
  DEFAULT_CLARITY_SETTINGS,
  calculateRelevance,
  fetchRemoteSearch,
  fmtDuration,
  fmtViews,
  openClarityVideoInAboutBlank,
  searchLibrary,
  timeAgo,
} from '../utils/clarityYoutube';

function keyOfItem(item) {
  if (!item) return '';
  return item.kind === 'playlist' ? `pl:${item.listId}` : `v:${item.videoId}`;
}

function getItemThumb(item) {
  if (!item) return '';
  if (item.thumb) return item.thumb;
  if (item.videoId) return `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`;
  return '';
}

export default function YouTubeWorkspace({
  decoyTitle = 'Google Classroom',
  decoyFavicon = 'https://ssl.gstatic.com/classroom/favicon.png',
  onClose,
}) {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(CLARITY_STORAGE_KEY);
      return raw ? { ...DEFAULT_CLARITY_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_CLARITY_SETTINGS };
    } catch {
      return { ...DEFAULT_CLARITY_SETTINGS };
    }
  });

  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryTab, setLibraryTab] = useState('history');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const rootRef = useRef(null);
  const glowRef = useRef(null);
  const searchInputRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const searchSeqRef = useRef(0);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CLARITY_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  }, [settings]);

  // Follow system theme when enabled
  useEffect(() => {
    if (!settings.systemTheme || settings.ytMode) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const sync = () => {
      setSettings((prev) => ({
        ...prev,
        theme: mq.matches ? 'light' : 'midnight',
      }));
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [settings.systemTheme, settings.ytMode]);

  // Ambient cursor glow inside Clarity container
  useEffect(() => {
    const root = rootRef.current;
    const glow = glowRef.current;
    if (!root || !glow) return;
    let raf = null;
    let mx = 0;
    let my = 0;

    const handleMove = (e) => {
      if (!settings.fx || settings.motion === 0) return;
      const rect = root.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      glow.style.opacity = '1';
      if (!raf) {
        raf = requestAnimationFrame(() => {
          glow.style.left = `${mx}px`;
          glow.style.top = `${my}px`;
          raf = null;
        });
      }
    };

    const handleLeave = () => {
      glow.style.opacity = '0';
    };

    root.addEventListener('pointermove', handleMove, { passive: true });
    root.addEventListener('pointerleave', handleLeave);
    return () => {
      root.removeEventListener('pointermove', handleMove);
      root.removeEventListener('pointerleave', handleLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [settings.fx, settings.motion]);

  const updateItemMeta = useCallback((updatedItem) => {
    const updatedKey = keyOfItem(updatedItem);
    if (!updatedKey) return;

    setCurrentVideo((prev) => {
      if (!prev || keyOfItem(prev) !== updatedKey) return prev;
      return { ...prev, ...updatedItem };
    });

    setSettings((prev) => {
      const updateList = (list) =>
        list.map((it) => {
          if (keyOfItem(it) === updatedKey) {
            return {
              ...it,
              title: updatedItem.title || it.title,
              author: updatedItem.author || it.author,
              thumb: updatedItem.thumb || it.thumb,
            };
          }
          return it;
        });
      return {
        ...prev,
        history: updateList(prev.history),
        favorites: updateList(prev.favorites),
      };
    });
  }, []);

  // Fetch oEmbed metadata for pasted video IDs/links missing title or channel
  useEffect(() => {
    if (!currentVideo) return;
    if (currentVideo.title && currentVideo.author) return;

    let cancelled = false;
    const watchUrl =
      currentVideo.kind === 'playlist'
        ? `https://www.youtube.com/playlist?list=${currentVideo.listId}`
        : `https://www.youtube.com/watch?v=${currentVideo.videoId}`;

    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`)
      .then((res) => {
        if (!res.ok) throw new Error('oembed ' + res.status);
        return res.json();
      })
      .then((d) => {
        if (cancelled) return;
        updateItemMeta({
          ...currentVideo,
          title: d.title || currentVideo.title,
          author: d.author_name || currentVideo.author,
          thumb: d.thumbnail_url || currentVideo.thumb,
        });
      })
      .catch(() => {
        if (cancelled || currentVideo.title) return;
        updateItemMeta({
          ...currentVideo,
          title: currentVideo.kind === 'playlist' ? 'YouTube Playlist' : `YouTube Video (${currentVideo.videoId})`,
          author: currentVideo.author || 'YouTube',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [currentVideo?.videoId, currentVideo?.listId, currentVideo?.title, currentVideo?.author, updateItemMeta]);

  const playVideo = useCallback(
    (item, { launchAboutBlank = true } = {}) => {
      if (!item) return;
      const normalized = {
        ...item,
        thumb: getItemThumb(item),
      };

      // Open immediately inside synchronous click/submit handler so popup blockers allow the new tab
      if (launchAboutBlank) {
        const result = openClarityVideoInAboutBlank(normalized);
        if (result.opened) {
          showToast('Opened Classroom video');
        } else if (result.url) {
          showToast('Popup blocked — click "Open Video" below');
        }
      }

      setCurrentVideo(normalized);
      setIsSearchActive(false);

      if (settings.saveHistory) {
        setSettings((prev) => {
          const currentKey = keyOfItem(normalized);
          const filtered = prev.history.filter((h) => keyOfItem(h) !== currentKey);
          const updated = [{ ...normalized, watchedAt: Date.now() }, ...filtered].slice(0, 60);
          return { ...prev, history: updated };
        });
      }
    },
    [decoyTitle, decoyFavicon, settings.saveHistory, showToast]
  );

  const executeSearch = useCallback(
    async (q) => {
      const query = q.trim();
      const seq = ++searchSeqRef.current;

      if (!query) {
        setSubmittedSearchQuery('');
        setSearchResults([]);
        setIsSearching(false);
        setSearchStatus('');
        return;
      }

      setSubmittedSearchQuery(query);
      setIsSearching(true);
      setSearchStatus('Searching…');

      const remote = await fetchRemoteSearch(query);
      if (seq !== searchSeqRef.current) return;

      const libMatches = searchLibrary(query, [...settings.favorites, ...settings.history]);
      const seen = new Set();
      const merged = [];

      for (const r of remote || []) {
        if (!r.videoId || seen.has(r.videoId)) continue;
        seen.add(r.videoId);
        merged.push({
          ...r,
          score: calculateRelevance(query, r),
          inLibrary: libMatches.some((l) => l.videoId === r.videoId),
        });
      }

      for (const l of libMatches) {
        if (l.videoId && seen.has(l.videoId)) continue;
        if (l.videoId) seen.add(l.videoId);
        merged.push({
          ...l,
          score: calculateRelevance(query, l) + 2,
          inLibrary: true,
        });
      }

      merged.sort((a, b) => (b.score || 0) - (a.score || 0));
      const finalResults = merged.slice(0, 24);

      setSearchResults(finalResults);
      setIsSearching(false);
      setSearchStatus(
        remote
          ? `${finalResults.length} result${finalResults.length === 1 ? '' : 's'}`
          : finalResults.length
          ? 'Matches from your library'
          : 'No results found'
      );
    },
    [settings.favorites, settings.history]
  );

  const handleSearchChange = (value) => {
    searchSeqRef.current += 1;
    setSearchValue(value);
    setSubmittedSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setSearchStatus('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const v = searchValue.trim();
    if (!v) {
      searchInputRef.current?.focus();
      setIsSearchActive(true);
      return;
    }

    const parsedItem = ClarityParser.parse(v);
    if (parsedItem) {
      playVideo(parsedItem, { launchAboutBlank: true });
      setSearchValue('');
      return;
    }

    if (ClarityParser.looksLikeUrl(v)) {
      showToast('That looks like a broken link. Check the URL or search keywords.');
      searchInputRef.current?.focus();
      return;
    }

    setIsSearchActive(true);
    executeSearch(v);
  };

  // Support optional ?v= or ?q= deep link on initial mount (without unrequested popup errors)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v');
    const q = params.get('q');
    if (v) {
      const parsed = ClarityParser.parse(v) || ClarityParser.parse(decodeURIComponent(v));
      if (parsed) {
        playVideo(parsed, { launchAboutBlank: false });
        return;
      }
    }
    if (q) {
      setSearchValue(q);
      setIsSearchActive(true);
      executeSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isItemFav = useCallback(
    (item) => {
      const key = keyOfItem(item);
      return Boolean(key && settings.favorites.some((f) => keyOfItem(f) === key));
    },
    [settings.favorites]
  );

  const toggleFav = useCallback(
    (item) => {
      if (!item) return;
      const key = keyOfItem(item);
      if (!key) return;
      const isFavNow = settings.favorites.some((f) => keyOfItem(f) === key);
      if (isFavNow) {
        setSettings((prev) => ({
          ...prev,
          favorites: prev.favorites.filter((f) => keyOfItem(f) !== key),
        }));
        showToast('Removed from favorites');
      } else {
        setSettings((prev) => ({
          ...prev,
          favorites: [{ ...item, favedAt: Date.now() }, ...prev.favorites],
        }));
        showToast('Added to favorites ♥');
      }
    },
    [settings.favorites, showToast]
  );

  const clearHistory = useCallback(() => {
    if (!settings.history.length) {
      showToast('History is already empty');
      return;
    }
    setSettings((prev) => ({ ...prev, history: [] }));
    showToast('History cleared');
  }, [settings.history.length, showToast]);

  const selectTheme = (id) => {
    setSettings((prev) => {
      const nextYtMode = prev.ytMode && id !== 'youtube' ? false : prev.ytMode;
      return { ...prev, theme: id, ytMode: nextYtMode };
    });
    const found = CLARITY_THEMES.find((t) => t.id === id);
    showToast(`Theme: ${found ? found.name : id === 'youtube' ? 'YouTube' : id}`);
  };

  const cycleTheme = useCallback(() => {
    const idx = CLARITY_THEMES.findIndex((t) => t.id === settings.theme);
    const next = CLARITY_THEMES[(idx + 1) % CLARITY_THEMES.length];
    selectTheme(next.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.theme]);

  const selectAccent = (accent) => {
    setSettings((prev) => ({
      ...prev,
      ytMode: false,
      accent: { h: accent.h, s: accent.s, l: accent.l },
    }));
    showToast(`Accent: ${accent.name}`);
  };

  const toggleYouTubeMode = (enabled) => {
    if (enabled) {
      setSettings((prev) => ({
        ...prev,
        preYT: {
          theme: prev.theme === 'youtube' ? 'midnight' : prev.theme,
          accent: { ...prev.accent },
        },
        ytMode: true,
        systemTheme: false,
        theme: 'youtube',
        accent: { h: CLARITY_YT_ACCENT.h, s: CLARITY_YT_ACCENT.s, l: CLARITY_YT_ACCENT.l },
      }));
      showToast('YouTube style on');
    } else {
      setSettings((prev) => {
        const restore = prev.preYT || {
          theme: DEFAULT_CLARITY_SETTINGS.theme,
          accent: DEFAULT_CLARITY_SETTINGS.accent,
        };
        return {
          ...prev,
          ytMode: false,
          theme: restore.theme,
          accent: restore.accent,
        };
      });
      showToast('YouTube style off');
    }
  };

  const toggleSystemTheme = (enabled) => {
    setSettings((prev) => ({ ...prev, systemTheme: enabled }));
    showToast(enabled ? 'Following system theme' : 'System theme off');
  };

  const resetSettings = () => {
    setSettings((prev) => ({
      ...DEFAULT_CLARITY_SETTINGS,
      history: prev.history,
      favorites: prev.favorites,
    }));
    showToast('Settings reset to defaults');
  };

  // Keyboard shortcuts while inside Clarity Video
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isTyping = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);

      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }
        if (isLibraryOpen) {
          setIsLibraryOpen(false);
          return;
        }
        if (isSearchActive) {
          setIsSearchActive(false);
          return;
        }
        if (isTyping) {
          target.blur();
          return;
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'v' && !isTyping) {
        e.preventDefault();
        navigator.clipboard
          ?.readText()
          .then((text) => {
            const parsed = ClarityParser.parse(text);
            if (parsed) {
              playVideo(parsed, { launchAboutBlank: true });
            } else {
              setSearchValue(text);
              setIsSearchActive(true);
              searchInputRef.current?.focus();
            }
          })
          .catch(() => {
            showToast('Clipboard blocked — paste into search bar');
            searchInputRef.current?.focus();
          });
        return;
      }

      if (isTyping || e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case '/':
          e.preventDefault();
          setIsSearchActive(true);
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
          break;
        case '?':
          e.preventDefault();
          setIsShortcutsOpen((prev) => !prev);
          break;
        case 's':
        case 'S':
          if (e.shiftKey) break;
          e.preventDefault();
          setIsSettingsOpen((prev) => !prev);
          break;
        case 't':
          e.preventDefault();
          cycleTheme();
          break;
        case 'f':
          if (currentVideo) toggleFav(currentVideo);
          break;
        case 'c':
          if (currentVideo) {
            const url = ClarityParser.toClassroomUrl(currentVideo);
            if (url) {
              navigator.clipboard
                ?.writeText(url)
                .then(() => showToast('Classroom link copied'))
                .catch(() => showToast(url));
            }
          } else {
            showToast('Nothing selected yet');
          }
          break;
        case 'o':
        case 'O':
          if (currentVideo) {
            openClarityVideoInAboutBlank(currentVideo, {
              title: decoyTitle,
              favicon: decoyFavicon,
            });
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isShortcutsOpen,
    isSettingsOpen,
    isLibraryOpen,
    isSearchActive,
    currentVideo,
    decoyTitle,
    decoyFavicon,
    cycleTheme,
    playVideo,
    showToast,
    toggleFav,
  ]);

  const rootStyle = {
    '--accent-h': String(settings.accent.h),
    '--accent-s': `${settings.accent.s}%`,
    '--accent-l': `${settings.accent.l}%`,
    '--on-accent': settings.accent.l > 62 ? '#0b0d14' : '#ffffff',
    '--radius': `${settings.radius}px`,
    '--density': String(settings.density),
    '--glass-alpha': String(settings.glass / 100),
    '--motion': String(settings.motion),
  };

  const activePaletteItem = CLARITY_PALETTE.find(
    (p) =>
      p.h === settings.accent.h &&
      p.s === settings.accent.s &&
      p.l === settings.accent.l
  );

  const getRangeFill = (val, min, max) => `${((val - min) / (max - min)) * 100}%`;
  const lastHistoryItem = settings.history[0] || null;
  const classroomUrl = currentVideo ? ClarityParser.toClassroomUrl(currentVideo) : '';
  const currentThumb = getItemThumb(currentVideo);
  const libraryItems = libraryTab === 'history' ? settings.history : settings.favorites;

  return (
    <div
      ref={rootRef}
      className={`clarity-video-root ${settings.motion === 0 ? 'clarity-no-motion' : ''} ${
        !settings.fx ? 'clarity-fx-off' : ''
      }`}
      data-clarity-theme={settings.theme}
      style={rootStyle}
    >
      {/* Ambient Background */}
      <div className="clarity-ambient" aria-hidden="true">
        <div className="clarity-orb clarity-orb-1" />
        <div className="clarity-orb clarity-orb-2" />
        <div className="clarity-orb clarity-orb-3" />
        <div className="clarity-shape clarity-shape-1" />
        <div className="clarity-shape clarity-shape-2" />
        <div className="clarity-shape clarity-shape-3" />
      </div>
      <div className="clarity-mouse-glow" ref={glowRef} aria-hidden="true" />

      {/* Navbar */}
      <header className="clarity-navbar">
        <nav className="clarity-nav-inner" aria-label="Clarity Video navigation">
          <button
            type="button"
            className="clarity-brand"
            onClick={() => {
              setIsSearchActive(false);
            }}
          >
            <span className="clarity-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6 3.8v16.4c0 1 1.1 1.6 2 1.1l13-8.2c.8-.5.8-1.7 0-2.2L8 2.7c-.9-.5-2 .1-2 1.1z" />
              </svg>
            </span>
            Clarity Video
          </button>

          <form
            className="clarity-nav-search-form"
            onSubmit={handleSearchSubmit}
            autoComplete="off"
          >
            <div className="clarity-nav-search-field">
              <svg className="clarity-nav-search-ico" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.8-3.8" />
              </svg>
              <input
                ref={searchInputRef}
                className="clarity-nav-search-input"
                type="text"
                inputMode="search"
                placeholder="Search YouTube or paste a YouTube link…"
                aria-label="Search YouTube or paste a link"
                spellCheck="false"
                value={searchValue}
                onFocus={() => setIsSearchActive(true)}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchValue && (
                <button
                  type="button"
                  className="clarity-nav-search-clear-btn"
                  title="Clear input"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearchChange('');
                    searchInputRef.current?.focus();
                  }}
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="clarity-nav-search-btn"
                title="Search or open video"
                aria-label="Submit search"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>

          <div className="clarity-nav-links">
            {lastHistoryItem && !currentVideo && (
              <button
                type="button"
                className="clarity-resume-nav-btn"
                title="Resume last video"
                onClick={() => playVideo(lastHistoryItem, { launchAboutBlank: true })}
              >
                ▶ Resume
              </button>
            )}
            <button
              type="button"
              className="clarity-nav-link"
              onClick={() => setIsLibraryOpen(true)}
            >
              Library
            </button>
            <button
              type="button"
              className="clarity-icon-btn"
              title="Keyboard shortcuts (?)"
              aria-label="Keyboard shortcuts"
              onClick={() => setIsShortcutsOpen(true)}
            >
              <svg viewBox="0 0 24 24">
                <rect x="2" y="6" width="20" height="12" rx="2.5" />
                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
              </svg>
            </button>
            <button
              type="button"
              className="clarity-icon-btn"
              title="Cycle theme (T)"
              aria-label="Cycle theme"
              onClick={cycleTheme}
            >
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
              </svg>
            </button>
            <button
              type="button"
              className="clarity-icon-btn"
              title="Settings (S)"
              aria-label="Open settings"
              onClick={() => setIsSettingsOpen(true)}
            >
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3.2" />
                <path d="M19.4 15a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.47V21a2 2 0 1 1-4 0v-.09a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.6 15a1.6 1.6 0 0 0-1.47-.97H3a2 2 0 1 1 0-4h.09A1.6 1.6 0 0 0 4.56 9a1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.6 1.6 0 0 0 8.84 4.7 1.6 1.6 0 0 0 9.8 3.24V3a2 2 0 1 1 4 0v.09c0 .64.38 1.21.97 1.47.58.25 1.25.13 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.32 1.77c.25.58.83.97 1.47.97H21a2 2 0 1 1 0 4h-.09c-.64 0-1.22.38-1.51.99z" />
              </svg>
            </button>
            {onClose && (
              <button
                type="button"
                className="clarity-icon-btn"
                title="Back to Portals"
                aria-label="Back to Portals"
                onClick={onClose}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="clarity-main">
        {isSearchActive ? (
          <div className="clarity-search-takeover-wrap" role="region" aria-label="Search area">
            <div className="clarity-search-takeover-card">
              <div className="clarity-search-takeover-header">
                <div className="clarity-search-takeover-title-row">
                  <div className="clarity-search-takeover-title">
                    {submittedSearchQuery.trim() ? (
                      <>
                        Results for <span className="q">“{submittedSearchQuery}”</span>
                      </>
                    ) : (
                      <span>Explore &amp; Quick Play</span>
                    )}
                  </div>
                  {searchStatus && submittedSearchQuery.trim() && (
                    <span className="clarity-search-takeover-status">{searchStatus}</span>
                  )}
                  <button
                    type="button"
                    className="clarity-search-takeover-close-btn"
                    onClick={() => setIsSearchActive(false)}
                    title="Close search (Esc)"
                  >
                    <span>✕</span> Close
                  </button>
                </div>
              </div>

              <div className="clarity-search-takeover-body">
                {isSearching ? (
                  <div className="clarity-results-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div className="clarity-result-skel" key={i}>
                        <div className="sk-thumb" />
                        <div className="sk-body">
                          <span className="clarity-skeleton-line" style={{ width: '90%' }} />
                          <span
                            className="clarity-skeleton-line"
                            style={{ width: '55%', height: '10px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : submittedSearchQuery.trim() ? (
                  searchResults.length > 0 ? (
                    <div className="clarity-results-grid" role="list">
                      {searchResults.map((r, i) => {
                        const thumbUrl = getItemThumb(r);
                        return (
                          <button
                            type="button"
                            key={`${r.videoId}-${i}`}
                            className="clarity-result-card"
                            role="listitem"
                            style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                            onClick={() => playVideo(r, { launchAboutBlank: true })}
                          >
                            <div className="clarity-result-thumb">
                              {thumbUrl && (
                                <img
                                  src={thumbUrl}
                                  alt=""
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              {Boolean(r.lengthSeconds) && (
                                <span className="dur">{fmtDuration(r.lengthSeconds)}</span>
                              )}
                              {i === 0 ? (
                                <span className="clarity-match-badge">Best match</span>
                              ) : r.inLibrary ? (
                                <span className="clarity-match-badge lib">In library</span>
                              ) : null}
                            </div>
                            <div className="clarity-result-body">
                              <div className="clarity-result-title">{r.title || 'YouTube Video'}</div>
                              <div className="clarity-result-chan">
                                <svg viewBox="0 0 24 24">
                                  <circle cx="12" cy="8" r="4" />
                                  <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
                                </svg>
                                {r.author || 'Unknown channel'}
                              </div>
                              <div className="clarity-result-meta">
                                {[fmtViews(r.viewCount), r.publishedText].filter(Boolean).join(' · ')}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="clarity-results-empty">
                      No videos found for “{submittedSearchQuery}”.
                      <br />
                      Try searching keywords, a channel name, or paste any YouTube link.
                    </div>
                  )
                ) : (
                  <div className="clarity-search-idle-prompt">
                    <div className="idle-icon">
                      <svg viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.8-3.8" />
                      </svg>
                    </div>
                    <h3>Search YouTube or paste any link above</h3>
                    <p>
                      Click any result or press Go on a YouTube URL to open it directly via{' '}
                      <strong>Classroom</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : currentVideo ? (
          <section className="clarity-player-section" aria-label="Video launch card">
            <article className="clarity-launch-card">
              <div
                className="clarity-launch-hero"
                role="button"
                tabIndex={0}
                onClick={() =>
                  openClarityVideoInAboutBlank(currentVideo, {
                    title: decoyTitle,
                    favicon: decoyFavicon,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openClarityVideoInAboutBlank(currentVideo, {
                      title: decoyTitle,
                      favicon: decoyFavicon,
                    });
                  }
                }}
              >
                {currentThumb && (
                  <img
                    src={currentThumb}
                    alt={currentVideo.title || 'Selected video thumbnail'}
                  />
                )}
                <div className="clarity-launch-overlay">
                  <span className="clarity-launch-play-btn">
                    <svg viewBox="0 0 24 24">
                      <path d="M7 4.6v14.8c0 .9 1 1.5 1.8 1L20.6 13c.8-.5.8-1.6 0-2L8.8 3.6c-.8-.5-1.8.1-1.8 1z" />
                    </svg>
                    Open Video
                  </span>
                  {classroomUrl && (
                    <span className="clarity-launch-badge" title={classroomUrl}>
                      {classroomUrl}
                    </span>
                  )}
                </div>
              </div>

              <div className="clarity-player-meta">
                <div className="clarity-meta-thumb">
                  {(currentVideo.author || 'Y').trim().charAt(0).toUpperCase()}
                </div>
                <div className="clarity-meta-text">
                  <div className="clarity-video-title">
                    {currentVideo.title ||
                      (currentVideo.kind === 'playlist' ? 'YouTube Playlist' : 'YouTube Video')}
                  </div>
                  <div className="clarity-video-channel">
                    {currentVideo.author || 'YouTube'}
                  </div>
                </div>

                <div className="clarity-player-actions">
                  {classroomUrl && (
                    <a
                      href={classroomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clarity-chip-btn"
                      title="Open video in a new tab"
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                      Open Video
                    </a>
                  )}

                  {classroomUrl && (
                    <button
                      type="button"
                      className="clarity-chip-btn"
                      onClick={() => {
                        navigator.clipboard
                          ?.writeText(classroomUrl)
                          .then(() => showToast('Classroom link copied'))
                          .catch(() => showToast(classroomUrl));
                      }}
                    >
                      <svg viewBox="0 0 24 24">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy link
                    </button>
                  )}

                  <button
                    type="button"
                    className={`clarity-chip-btn ${isItemFav(currentVideo) ? 'is-active' : ''}`}
                    onClick={() => toggleFav(currentVideo)}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.6 5 6.2 5c2.2 0 3.6 1.1 4.5 2.4h2.6C14.2 6.1 15.6 5 17.8 5c3.6 0 5.8 3.6 4.2 6.7C19.5 16.3 12 21 12 21z" />
                    </svg>
                    {isItemFav(currentVideo) ? 'Favorited' : 'Favorite'}
                  </button>

                  <button
                    type="button"
                    className="clarity-chip-btn"
                    onClick={() => {
                      setIsSearchActive(true);
                      setTimeout(() => searchInputRef.current?.focus(), 20);
                    }}
                  >
                    <svg viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.8-3.8" />
                    </svg>
                    Search
                  </button>
                </div>
              </div>
            </article>
          </section>
        ) : (
          <div
            className="clarity-idle-welcome-card"
            onClick={() => {
              setIsSearchActive(true);
              searchInputRef.current?.focus();
            }}
          >
            <div className="clarity-idle-welcome-inner">
              <div className="clarity-idle-brand-mark">
                <svg viewBox="0 0 24 24">
                  <path d="M6 3.8v16.4c0 1 1.1 1.6 2 1.1l13-8.2c.8-.5.8-1.7 0-2.2L8 2.7c-.9-.5-2 .1-2 1.1z" />
                </svg>
              </div>
              <h2>Watch distraction-free</h2>
              <p>
                Click the search bar above or press <kbd>/</kbd> to search YouTube or paste any
                link. Videos open directly via <strong>Classroom</strong>.
              </p>
              {lastHistoryItem && (
                <button
                  type="button"
                  className="clarity-idle-resume-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playVideo(lastHistoryItem, { launchAboutBlank: true });
                  }}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M7 4.6v14.8c0 .9 1 1.5 1.8 1L20.6 13c.8-.5.8-1.6 0-2L8.8 3.6c-.8-.5-1.8.1-1.8 1z" />
                  </svg>
                  Resume: {lastHistoryItem.title || 'Last watched video'}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Library Drawer */}
      <div
        className={`clarity-overlay ${isLibraryOpen ? 'open' : ''}`}
        onClick={() => setIsLibraryOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`clarity-drawer ${isLibraryOpen ? 'open' : ''}`}
        style={{ width: 'min(540px, 100%)' }}
        aria-label="Your Library"
        aria-hidden={!isLibraryOpen}
      >
        <div className="clarity-drawer-head">
          <h2>Your Library</h2>
          <button
            type="button"
            className="clarity-icon-btn"
            aria-label="Close library"
            onClick={() => setIsLibraryOpen(false)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="clarity-drawer-body" style={{ padding: '20px' }}>
          <section aria-label="Library">
            <div className="clarity-lib-header">
              <div className="clarity-lib-tabs" role="tablist">
                <button
                  type="button"
                  className={`clarity-lib-tab ${libraryTab === 'history' ? 'is-active' : ''}`}
                  role="tab"
                  aria-selected={libraryTab === 'history'}
                  onClick={() => setLibraryTab('history')}
                >
                  History ({settings.history.length})
                </button>
                <button
                  type="button"
                  className={`clarity-lib-tab ${libraryTab === 'favorites' ? 'is-active' : ''}`}
                  role="tab"
                  aria-selected={libraryTab === 'favorites'}
                  onClick={() => setLibraryTab('favorites')}
                >
                  Favorites ({settings.favorites.length})
                </button>
              </div>
              {libraryTab === 'history' && (
                <button
                  type="button"
                  className="clarity-lib-clear"
                  onClick={clearHistory}
                >
                  Clear history
                </button>
              )}
            </div>

            <div className="clarity-lib-grid" role="list">
              {libraryItems.length === 0 ? (
                <div className="clarity-lib-empty">
                  <svg viewBox="0 0 24 24">
                    {libraryTab === 'history' ? (
                      <>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3.5 2" />
                      </>
                    ) : (
                      <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.6 5 6.2 5c2.2 0 3.6 1.1 4.5 2.4h2.6C14.2 6.1 15.6 5 17.8 5c3.6 0 5.8 3.6 4.2 6.7C19.5 16.3 12 21 12 21z" />
                    )}
                  </svg>
                  <div>
                    {libraryTab === 'history'
                      ? 'Videos you open will show up here.'
                      : 'Tap ♥ on any video to keep it here.'}
                  </div>
                </div>
              ) : (
                libraryItems.map((item, idx) => {
                  const thumb = getItemThumb(item);
                  const fav = isItemFav(item);
                  const when = item.watchedAt || item.favedAt;
                  const kind = item.kind === 'playlist' ? 'Playlist' : '';
                  return (
                    <div
                      key={`${item.videoId || item.listId}-${idx}`}
                      className="clarity-lib-card"
                      role="listitem"
                      tabIndex={0}
                      onClick={() => {
                        playVideo(item, { launchAboutBlank: true });
                        setIsLibraryOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          playVideo(item, { launchAboutBlank: true });
                          setIsLibraryOpen(false);
                        }
                      }}
                    >
                      <div className="clarity-lib-thumb">
                        {thumb && (
                          <img
                            src={thumb}
                            alt=""
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        {kind && <span className="kind-badge">{kind}</span>}
                        <span className="play-ico">
                          <span>
                            <svg viewBox="0 0 24 24">
                              <path d="M7 4.6v14.8c0 .9 1 1.5 1.8 1L20.6 13c.8-.5.8-1.6 0-2L8.8 3.6c-.8-.5-1.8.1-1.8 1z" />
                            </svg>
                          </span>
                        </span>
                      </div>
                      <div className="clarity-lib-body">
                        <div className="clarity-lib-info">
                          <div className="clarity-lib-title">
                            {item.title || (item.kind === 'playlist' ? 'YouTube Playlist' : 'YouTube Video')}
                          </div>
                          <div className="clarity-lib-when">{when ? timeAgo(when) : ''}</div>
                        </div>
                        <button
                          type="button"
                          className={`clarity-lib-fav ${fav ? 'is-fav' : ''}`}
                          title={fav ? 'Unfavorite' : 'Favorite'}
                          aria-label="Toggle favorite"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFav(item);
                          }}
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.6 5 6.2 5c2.2 0 3.6 1.1 4.5 2.4h2.6C14.2 6.1 15.6 5 17.8 5c3.6 0 5.8 3.6 4.2 6.7C19.5 16.3 12 21 12 21z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </aside>

      {/* Settings Drawer */}
      <div
        className={`clarity-overlay ${isSettingsOpen ? 'open' : ''}`}
        onClick={() => setIsSettingsOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`clarity-drawer ${isSettingsOpen ? 'open' : ''}`}
        aria-label="Settings"
        aria-hidden={!isSettingsOpen}
      >
        <div className="clarity-drawer-head">
          <h2>Settings</h2>
          <button
            type="button"
            className="clarity-icon-btn"
            aria-label="Close settings"
            onClick={() => setIsSettingsOpen(false)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="clarity-drawer-body">
          <div className="clarity-setting-group">
            <h3>Theme</h3>
            <div className="clarity-theme-grid">
              {CLARITY_THEMES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={`clarity-theme-swatch ${settings.theme === t.id && !settings.ytMode ? 'is-active' : ''}`}
                  title={t.name}
                  onClick={() => selectTheme(t.id)}
                >
                  <span className="sw" style={{ background: t.sw }} />
                  <span className="nm">{t.name}</span>
                </button>
              ))}
            </div>
            <div className="clarity-setting-row" style={{ marginTop: '10px' }}>
              <div>
                <div className="label">YouTube style</div>
                <div className="sub">Familiar red accents &amp; dark grey look</div>
              </div>
              <label className="clarity-toggle">
                <input
                  type="checkbox"
                  checked={settings.ytMode}
                  onChange={(e) => toggleYouTubeMode(e.target.checked)}
                />
                <span className="track" />
                <span className="knob" />
              </label>
            </div>
            <div className="clarity-setting-row">
              <div>
                <div className="label">Follow system</div>
                <div className="sub">Auto light / dark</div>
              </div>
              <label className="clarity-toggle">
                <input
                  type="checkbox"
                  checked={settings.systemTheme}
                  onChange={(e) => toggleSystemTheme(e.target.checked)}
                />
                <span className="track" />
                <span className="knob" />
              </label>
            </div>
          </div>

          <div className="clarity-setting-group">
            <h3>Accent palette</h3>
            <div className="clarity-palette-grid">
              {CLARITY_PALETTE.map((a) => {
                const isActive =
                  !settings.ytMode &&
                  a.h === settings.accent.h &&
                  a.s === settings.accent.s &&
                  a.l === settings.accent.l;
                return (
                  <button
                    type="button"
                    key={a.name}
                    className={`clarity-palette-dot ${isActive ? 'is-active' : ''}`}
                    style={{ background: `hsl(${a.h},${a.s}%,${a.l}%)` }}
                    data-dark-check={a.l < 52 ? '1' : undefined}
                    title={a.name}
                    aria-label={a.name}
                    onClick={() => selectAccent(a)}
                  />
                );
              })}
            </div>
            <div className="clarity-palette-name">
              {settings.ytMode
                ? 'YouTube Red'
                : activePaletteItem
                ? activePaletteItem.name
                : 'Custom'}
            </div>
          </div>

          <div className="clarity-setting-group">
            <h3>Layout &amp; surfaces</h3>
            <div className="clarity-setting-row">
              <div>
                <div className="label">Corner roundness</div>
              </div>
              <input
                type="range"
                min="6"
                max="24"
                value={settings.radius}
                style={{ '--fill': getRangeFill(settings.radius, 6, 24) }}
                aria-label="Corner roundness"
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSettings((prev) => ({ ...prev, radius: val }));
                }}
              />
            </div>
            <div className="clarity-setting-row">
              <div>
                <div className="label">Density</div>
              </div>
              <div className="clarity-segmented">
                <button
                  type="button"
                  className={settings.density === 0.85 ? 'is-active' : ''}
                  onClick={() => setSettings((prev) => ({ ...prev, density: 0.85 }))}
                >
                  Compact
                </button>
                <button
                  type="button"
                  className={settings.density === 1 ? 'is-active' : ''}
                  onClick={() => setSettings((prev) => ({ ...prev, density: 1 }))}
                >
                  Default
                </button>
                <button
                  type="button"
                  className={settings.density === 1.18 ? 'is-active' : ''}
                  onClick={() => setSettings((prev) => ({ ...prev, density: 1.18 }))}
                >
                  Cozy
                </button>
              </div>
            </div>
            <div className="clarity-setting-row">
              <div>
                <div className="label">Glass transparency</div>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={settings.glass}
                style={{ '--fill': getRangeFill(settings.glass, 20, 95) }}
                aria-label="Panel transparency"
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSettings((prev) => ({ ...prev, glass: val }));
                }}
              />
            </div>
          </div>

          <div className="clarity-setting-group">
            <h3>Motion &amp; effects</h3>
            <div className="clarity-setting-row">
              <div>
                <div className="label">Motion level</div>
              </div>
              <div className="clarity-segmented">
                <button
                  type="button"
                  className={settings.motion === 0 ? 'is-active' : ''}
                  onClick={() => setSettings((prev) => ({ ...prev, motion: 0 }))}
                >
                  Off
                </button>
                <button
                  type="button"
                  className={settings.motion === 0.6 ? 'is-active' : ''}
                  onClick={() => setSettings((prev) => ({ ...prev, motion: 0.6 }))}
                >
                  Reduced
                </button>
                <button
                  type="button"
                  className={settings.motion === 1 ? 'is-active' : ''}
                  onClick={() => setSettings((prev) => ({ ...prev, motion: 1 }))}
                >
                  Full
                </button>
              </div>
            </div>
            <div className="clarity-setting-row">
              <div>
                <div className="label">Background effects</div>
                <div className="sub">Orbs, shapes &amp; glow</div>
              </div>
              <label className="clarity-toggle">
                <input
                  type="checkbox"
                  checked={settings.fx}
                  onChange={(e) => setSettings((prev) => ({ ...prev, fx: e.target.checked }))}
                />
                <span className="track" />
                <span className="knob" />
              </label>
            </div>
          </div>

          <div className="clarity-setting-group">
            <h3>Library</h3>
            <div className="clarity-setting-row">
              <div>
                <div className="label">Save history</div>
                <div className="sub">Remember opened videos</div>
              </div>
              <label className="clarity-toggle">
                <input
                  type="checkbox"
                  checked={settings.saveHistory}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, saveHistory: e.target.checked }))
                  }
                />
                <span className="track" />
                <span className="knob" />
              </label>
            </div>
          </div>
        </div>
        <div className="clarity-settings-foot">
          <button type="button" className="clarity-reset-btn" onClick={resetSettings}>
            Reset all settings
          </button>
        </div>
      </aside>

      {/* Shortcuts Modal */}
      <div
        className={`clarity-shortcuts-modal ${isShortcutsOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsShortcutsOpen(false);
        }}
      >
        <div className="clarity-modal-card">
          <h2>Keyboard shortcuts</h2>
          <div className="clarity-shortcut-list">
            <div className="clarity-shortcut-item">
              <span>Focus search / URL bar</span>
              <span className="keys"><kbd>/</kbd></span>
            </div>
            <div className="clarity-shortcut-item">
              <span>Paste &amp; open video</span>
              <span className="keys"><kbd>Ctrl</kbd><kbd>V</kbd></span>
            </div>
            <div className="clarity-shortcut-item">
              <span>Re-open current video</span>
              <span className="keys"><kbd>O</kbd></span>
            </div>
            <div className="clarity-shortcut-item">
              <span>Toggle settings</span>
              <span className="keys"><kbd>S</kbd></span>
            </div>
            <div className="clarity-shortcut-item">
              <span>Favorite current video</span>
              <span className="keys"><kbd>F</kbd></span>
            </div>
            <div className="clarity-shortcut-item">
              <span>Copy Classroom video link</span>
              <span className="keys"><kbd>C</kbd></span>
            </div>
            <div className="clarity-shortcut-item">
              <span>Cycle theme</span>
              <span className="keys"><kbd>T</kbd></span>
            </div>
            <div className="clarity-shortcut-item">
              <span>Close search / drawers</span>
              <span className="keys"><kbd>Esc</kbd></span>
            </div>
            <div className="clarity-shortcut-item">
              <span>This help</span>
              <span className="keys"><kbd>?</kbd></span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`clarity-toast ${toastMsg ? 'show' : ''}`} role="status" aria-live="polite">
        <span className="t-dot" />
        <span>{toastMsg || ''}</span>
      </div>
    </div>
  );
}
