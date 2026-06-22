import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Tv, 
  Search, 
  Settings as SettingsIcon, 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  RotateCcw, 
  Bookmark, 
  BookmarkCheck, 
  History as HistoryIcon, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Info, 
  Sparkles,
  ChevronRight,
  Maximize2,
  ChevronLeft,
  ListFilter,
  Eye,
  Film,
  Compass,
  X,
  Share2,
  Trash2,
  MonitorPlay,
  Flame,
  HelpCircle,
  Star,
  User,
  Layers,
  AlertTriangle,
  Menu
} from 'lucide-react';

/* ============================================================
   TMDB API HELPER / CLIENT
   ============================================================ */
const DEFAULT_KEY = '8265bd1679663a7ea12ac168da84d2e8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const GENRES = {
  movie: { 
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller', 
    10752: 'War', 37: 'Western' 
  },
  tv: { 
    10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy', 
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 
    10765: 'Sci-Fi & Fantasy', 9648: 'Mystery', 10764: 'Reality', 
    10768: 'War & Politics' 
  }
};

const SWATCHES = ['e50914', 'ff6b00', 'f5a623', '46d369', '00b4d8', '4361ee', '9146ff', 'e91e63', 'ffffff'];

const PROVIDERS = [
  { id: 'vidsrc', name: 'VidSrc', badge: 'Subs', build({type, tmdb, season, episode}) {
      return type === 'movie' 
        ? `https://vidsrc.to/embed/movie/${tmdb}` 
        : `https://vidsrc.to/embed/tv/${tmdb}/${season}/${episode}`;
  }},
  { id: 'vidlink', name: 'VidLink', badge: 'Multi', build({type, tmdb, season, episode, opt}) {
      let base = type === 'movie' 
        ? `https://vidlink.pro/movie/${tmdb}` 
        : `https://vidlink.pro/tv/${tmdb}/${season}/${episode}`;
      const p = new URLSearchParams();
      if (opt?.color) p.set('primaryColor', opt.color);
      p.set('autoplay', opt?.autoplay === false ? 'false' : 'true');
      if (type === 'tv') p.set('nextbutton', 'true');
      const qs = p.toString(); 
      return qs ? `${base}?${qs}` : base;
  }},
  { id: 'vidsrccc', name: 'VidSrc.cc', badge: 'HD', build({type, tmdb, season, episode, opt}) {
      let base = type === 'movie' 
        ? `https://vidsrc.cc/v2/embed/movie/${tmdb}` 
        : `https://vidsrc.cc/v2/embed/tv/${tmdb}/${season}/${episode}`;
      return base + (opt?.autoplay === false ? '?autoPlay=false' : '?autoPlay=true');
  }},
  { id: 'vidking', name: 'VidKing', badge: 'Fast', build({type, tmdb, season, episode, opt}) {
      let base = type === 'movie' 
        ? `https://www.vidking.net/embed/movie/${tmdb}` 
        : `https://www.vidking.net/embed/tv/${tmdb}/${season}/${episode}`;
      const p = new URLSearchParams();
      if (opt?.color) p.set('color', opt.color);
      p.set('autoPlay', opt?.autoplay === false ? 'false' : 'true');
      if (type === 'tv') { 
        p.set('nextEpisode', 'true'); 
        p.set('episodeSelector', 'true'); 
      }
      const qs = p.toString(); 
      return qs ? `${base}?${qs}` : base;
  }}
];

export default function MoviesWorkspace({ onClose }) {
  // Navigation / Route status
  const [view, setView] = useState('home'); // 'home' | 'browse' | 'watch'
  const [browseType, setBrowseType] = useState('movie'); // 'movie' | 'tv'
  const [browseGenre, setBrowseGenre] = useState('');
  const [browseTrending, setBrowseTrending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputVal, setSearchInputVal] = useState('');
  
  // Watch State
  const [watchId, setWatchId] = useState('');
  const [watchType, setWatchType] = useState('movie');
  const [watchSeason, setWatchSeason] = useState(1);
  const [watchEpisode, setWatchEpisode] = useState(1);
  const [currentProvider, setCurrentProvider] = useState('vidsrc');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  // Loaded Resources
  const [heroPick, setHeroPick] = useState(null);
  const [rowsData, setRowsData] = useState({});
  const [watchDetails, setWatchDetails] = useState(null);
  const [watchEpisodes, setWatchEpisodes] = useState([]);
  const [browseResults, setBrowseResults] = useState([]);
  const [browsePage, setBrowsePage] = useState(1);
  const [browseDone, setBrowseDone] = useState(false);
  
  // Loaders
  const [loadingHero, setLoadingHero] = useState(false);
  const [loadingWatch, setLoadingWatch] = useState(false);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [loadingBrowse, setLoadingBrowse] = useState(false);

  // Settings & Utilities
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('streamsettings');
      return saved ? {
        color: 'e50914',
        autoplay: true,
        muted: false,
        defaultProvider: 'vidsrc',
        ...JSON.parse(saved)
      } : {
        color: 'e50914',
        autoplay: true,
        muted: false,
        defaultProvider: 'vidsrc'
      };
    } catch {
      return { color: 'e50914', autoplay: true, muted: false, defaultProvider: 'vidsrc' };
    }
  });

  const [tmdbKey, setTmdbKey] = useState(() => {
    return localStorage.getItem('tmdb_key') || '';
  });

  const [watchHistory, setWatchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('watchhistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('unblocked-movie-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Settings drawer & state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Fullscreen elements
  const [theaterMode, setTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerStageRef = useRef(null);

  // Core TMDB Key Fetcher
  const getKey = () => tmdbKey.trim() || DEFAULT_KEY;

  // TMDB HTTP Request Helper
  const fetchTmdb = async (path, params = {}) => {
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set('api_key', getKey());
    url.searchParams.set('language', 'en-US');
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, v.toString());
      }
    });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB error status: ${res.status}`);
    return res.json();
  };

  // Synchronize settings changes
  useEffect(() => {
    localStorage.setItem('streamsettings', JSON.stringify(settings));
    // Apply styling rules globally
    document.documentElement.style.setProperty('--sv-accent', '#' + settings.color);
    if (settings.defaultProvider) {
      setCurrentProvider(settings.defaultProvider);
    }
  }, [settings]);

  // Synchronize dynamic lists to storage
  useEffect(() => {
    localStorage.setItem('watchhistory', JSON.stringify(watchHistory.slice(0, 60)));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem('unblocked-movie-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Trigger loading initial Home Page resources
  useEffect(() => {
    if (view === 'home') {
      loadHomePage();
    }
  }, [view, tmdbKey]);

  // Handle Search Input Debounce
  useEffect(() => {
    if (!searchQuery) return;
    setView('browse');
    setBrowseResults([]);
    setBrowsePage(1);
    setBrowseDone(false);
    setBrowseGenre('');
    setBrowseTrending(false);
  }, [searchQuery]);

  // Load browse results
  useEffect(() => {
    if (view === 'browse') {
      executeBrowse();
    }
  }, [view, browseType, browseGenre, browseTrending, browsePage, searchQuery, tmdbKey]);

  // Load Watch details on navigation
  useEffect(() => {
    if (view === 'watch' && watchId) {
      loadWatchViewDetails();
    }
  }, [view, watchId, watchType, tmdbKey]);

  // Load Season Episodes on Season Change
  useEffect(() => {
    if (view === 'watch' && watchDetails && watchType === 'tv') {
      loadSeasonEpisodesList();
    }
  }, [view, watchDetails, watchSeason, tmdbKey]);

  // Apply default Accent Color variable style on startup
  useEffect(() => {
    document.documentElement.style.setProperty('--sv-accent', '#' + settings.color);
  }, []);

  // Set Keyboard Shortcuts
  useEffect(() => {
    const handleKeys = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const key = e.key.toLowerCase();
      
      if (view === 'watch') {
        if (key === 'w') {
          e.preventDefault();
          setTheaterMode(prev => !prev);
        } else if (key === 'f') {
          e.preventDefault();
          toggleBrowserFullscreen();
        } else if (key === 'escape') {
          setTheaterMode(false);
        } else {
          const num = parseInt(key);
          if (num >= 1 && num <= PROVIDERS.length) {
            e.preventDefault();
            setCurrentProvider(PROVIDERS[num - 1].id);
          }
        }
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };

    document.addEventListener('keydown', handleKeys);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleKeys);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [view, watchId]);

  // Load everything for the Home tab
  const loadHomePage = async () => {
    setLoadingHero(true);
    try {
      // 1. Fetch Trending items for Hero Header
      const trendingTrend = await fetchTmdb('/trending/all/week');
      const filteredTrend = (trendingTrend.results || []).filter(x => x.backdrop_path && (x.title || x.name));
      if (filteredTrend.length > 0) {
        setHeroPick(filteredTrend[Math.floor(Math.random() * Math.min(6, filteredTrend.length))]);
      }
      setLoadingHero(false);

      // Fetch row content asynchronously to populate rows
      const fetchRow = async (label, fetcher) => {
        try {
          const data = await fetcher();
          setRowsData(prev => ({ ...prev, [label]: (data.results || []).filter(x => x.poster_path) }));
        } catch {
          setRowsData(prev => ({ ...prev, [label]: [] }));
        }
      };

      fetchRow('Trending This Week', () => fetchTmdb('/trending/all/week'));
      fetchRow('Popular Movies', () => fetchTmdb('/movie/popular'));
      fetchRow('Popular TV Shows', () => fetchTmdb('/tv/popular'));
      fetchRow('Now Playing in Theaters', () => fetchTmdb('/movie/now_playing'));
      fetchRow('Top Rated Blockbusters', () => fetchTmdb('/movie/top_rated'));
      fetchRow('Action & Adventure Spree', () => fetchTmdb('/discover/movie', { with_genres: 28 }));
      fetchRow('Commanding Comedies', () => fetchTmdb('/discover/movie', { with_genres: 35 }));
      fetchRow('Chilling Horrors', () => fetchTmdb('/discover/movie', { with_genres: 27 }));
      fetchRow('Vast Sci-Fi Dimensions', () => fetchTmdb('/discover/movie', { with_genres: 878 }));
    } catch {
      setLoadingHero(false);
    }
  };

  // Perform multi-query filter or standard browse lists
  const executeBrowse = async () => {
    setLoadingBrowse(true);
    try {
      let data;
      if (searchQuery) {
        data = await fetchTmdb('/search/multi', { query: searchQuery, page: browsePage });
      } else if (browseTrending) {
        data = await fetchTmdb('/trending/all/week', { page: browsePage });
      } else if (browseGenre) {
        data = await fetchTmdb(`/discover/${browseType}`, { with_genres: browseGenre, sort_by: 'popularity.desc', page: browsePage });
      } else {
        data = browseType === 'tv' 
          ? await fetchTmdb('/tv/popular', { page: browsePage }) 
          : await fetchTmdb('/movie/popular', { page: browsePage });
      }

      let items = (data.results || []).filter(x => x.poster_path);
      if (searchQuery) {
        items = items.filter(x => x.media_type === 'movie' || x.media_type === 'tv');
      }

      if (browsePage === 1) {
        setBrowseResults(items);
      } else {
        setBrowseResults(prev => [...prev, ...items]);
      }

      if (items.length === 0 || browsePage >= (data.total_pages || 1)) {
        setBrowseDone(true);
      }
    } catch {
      setBrowseDone(true);
    } finally {
      setLoadingBrowse(false);
    }
  };

  // Fetch meta details of selected stream
  const loadWatchViewDetails = async () => {
    setLoadingWatch(true);
    setIframeLoaded(false);
    try {
      const details = watchType === 'movie'
        ? await fetchTmdb(`/movie/${watchId}`, { append_to_response: 'credits,recommendations' })
        : await fetchTmdb(`/tv/${watchId}`, { append_to_response: 'credits,recommendations' });
      setWatchDetails(details);
      
      // Select appropriate initial options
      if (watchType === 'tv') {
        const seasons = (details.seasons || []).filter(s => s.season_number > 0);
        if (seasons.length > 0) {
          const firstSeason = seasons[0].season_number;
          // check history to restore session
          const lastSession = watchHistory.find(h => h.id == watchId && h.type === 'tv');
          if (lastSession && lastSession.season) {
            setWatchSeason(lastSession.season);
            setWatchEpisode(lastSession.episode || 1);
          } else {
            setWatchSeason(firstSeason);
            setWatchEpisode(1);
          }
        }
      }

      // Track item immediately in history log
      recordHistoryState(details, watchType);
    } catch {
      setWatchDetails(null);
    } finally {
      setLoadingWatch(false);
    }
  };

  // Download Season information
  const loadSeasonEpisodesList = async () => {
    setLoadingEpisodes(true);
    try {
      const sDetails = await fetchTmdb(`/tv/${watchId}/season/${watchSeason}`);
      setWatchEpisodes(sDetails.episodes || []);
    } catch {
      setWatchEpisodes([]);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  // Log to local watch history index list
  const recordHistoryState = (details, type, specSeason, specEpisode) => {
    const sVal = specSeason || (type === 'tv' ? watchSeason : undefined);
    const eVal = specEpisode || (type === 'tv' ? watchEpisode : undefined);
    
    const entry = {
      id: watchId,
      type,
      title: details?.title || details?.name || 'Untitled Content',
      poster: details?.poster_path,
      backdrop: details?.backdrop_path,
      season: sVal,
      episode: eVal,
      year: (details?.release_date || details?.first_air_date || '').slice(0, 4),
      updated: Date.now()
    };

    setWatchHistory(prev => {
      const filtered = prev.filter(x => !(x.id == watchId && x.type === type));
      return [entry, ...filtered].slice(0, 50);
    });
  };

  const handlePlayCard = (id, type, s = 1, e = 1) => {
    setWatchId(id);
    setWatchType(type);
    setWatchSeason(s);
    setWatchEpisode(e);
    setView('watch');
    setIsMobileMenuOpen(false);
  };

  const toggleBookmark = (item) => {
    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie') || item.type;
    const isSaved = bookmarks.some(b => b.id == item.id && b.type === type);
    
    if (isSaved) {
      setBookmarks(prev => prev.filter(b => !(b.id == item.id && b.type === type)));
    } else {
      const entry = {
        id: item.id,
        type,
        title: item.title || item.name,
        poster_path: item.poster_path || item.poster,
        vote_average: item.vote_average || 0,
        release_date: item.release_date || item.first_air_date || item.year,
        timestamp: Date.now()
      };
      setBookmarks(prev => [entry, ...prev]);
    }
  };

  const clearAllWatchHistory = () => {
    if (window.confirm('Delete all entries from your local streaming history?')) {
      setWatchHistory([]);
      localStorage.removeItem('watchhistory');
    }
  };

  const toggleBrowserFullscreen = () => {
    if (!playerStageRef.current) return;
    const el = playerStageRef.current;
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);

    if (!isFs) {
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      if (req) {
        try {
          req.call(el);
        } catch {
          alert('Fullscreen option blocked by security permissions.');
        }
      }
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (exit) {
        exit.call(document);
      }
    }
  };

  const activeProviderObj = PROVIDERS.find(p => p.id === currentProvider) || PROVIDERS[0];
  const activeStreamUrl = activeProviderObj.build({
    type: watchType,
    tmdb: watchId,
    season: watchSeason,
    episode: watchEpisode,
    opt: {
      color: settings.color,
      autoplay: settings.autoplay
    }
  });

  const getPosterUrl = (path, size = 'w500') => {
    return path ? `${IMAGE_BASE}/${size}${path}` : '';
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const val = searchInputVal.trim();
    if (val) {
      setSearchQuery(val);
    }
  };

  return (
    <div 
      className="flex flex-col w-full h-full text-[#f5f5f7] bg-[#0a0a0f] overflow-hidden select-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* GLOBAL BACKGROUND INJECTED ACCENT VARIABLE STYLES */}
      <style>{`
        :root {
          --accent: var(--sv-accent, #e50914);
        }
        .accent-text { color: var(--accent); }
        .accent-bg { background-color: var(--accent); }
        .accent-border { border-color: var(--accent); }
        .accent-ring { --tw-ring-color: var(--accent); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-cust::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollbar-cust::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .scrollbar-cust::-webkit-scrollbar-thumb { background: #2a2a36; border-radius: 9px; }
        .scrollbar-cust::-webkit-scrollbar-thumb:hover { background: #3a3a48; }
        .glass-header { 
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
      `}</style>

      {/* HEADER NAVIGATION BAR */}
      <header className={`shrink-0 z-50 px-4 md:px-8 py-3.5 flex items-center justify-between glass-header gap-4`}>
        <div className="flex items-center gap-6">
          <div 
            onClick={() => { setView('home'); setSearchQuery(''); setSearchInputVal(''); }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 px-2.5 rounded-xl accent-bg text-white shadow-[0_0_15px_rgba(229,9,20,0.25)] flex items-center justify-center">
              <Film className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black font-mono leading-none tracking-tighter uppercase">
                STREAM<span className="accent-text">VERSE</span>
              </span>
              <span className="text-[9px] text-[#9a9aa8] tracking-widest font-bold uppercase mt-0.5">Free Unblocked Cinema</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider text-[#9a9aa8]">
            <button 
              onClick={() => { setView('home'); setSearchQuery(''); setSearchInputVal(''); }}
              className={`hover:text-white transition-all cursor-pointer py-1 ${view === 'home' && !searchQuery ? 'text-white border-b-2 accent-border' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setView('browse'); setBrowseType('movie'); setBrowseGenre(''); setBrowseTrending(false); setSearchQuery(''); setSearchInputVal(''); setBrowsePage(1); }}
              className={`hover:text-white transition-all cursor-pointer py-1 ${view === 'browse' && browseType === 'movie' && !browseTrending && !browseGenre && !searchQuery ? 'text-white border-b-2 accent-border' : ''}`}
            >
              Movies
            </button>
            <button 
              onClick={() => { setView('browse'); setBrowseType('tv'); setBrowseGenre(''); setBrowseTrending(false); setSearchQuery(''); setSearchInputVal(''); setBrowsePage(1); }}
              className={`hover:text-white transition-all cursor-pointer py-1 ${view === 'browse' && browseType === 'tv' && !browseTrending && !browseGenre && !searchQuery ? 'text-white border-b-2 accent-border' : ''}`}
            >
              TV Shows
            </button>
            <button 
              onClick={() => { setView('browse'); setBrowseTrending(true); setSearchQuery(''); setSearchInputVal(''); setBrowsePage(1); }}
              className={`hover:text-white transition-all cursor-pointer py-1 ${view === 'browse' && browseTrending && !searchQuery ? 'text-white border-b-2 accent-border' : ''}`}
            >
              Trending Group
            </button>
          </nav>
        </div>

        {/* Search controls & setup */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#9a9aa8]" />
            <input 
              type="text"
              placeholder="Search movies, TV shows..."
              value={searchInputVal}
              onChange={(e) => setSearchInputVal(e.target.value)}
              className="bg-[#14141c] border border-white/5 pl-9 pr-4 py-2 text-xs rounded-full outline-none focus:border-[var(--accent)] text-[#f5f5f7] w-48 focus:w-64 transition-all duration-300"
            />
          </form>

          {/* Settings triggering knob */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full bg-[#14141c] border border-white/5 hover:border-white/10 hover:bg-[#1a1a24] text-[#f5f5f7] transition-all cursor-pointer flex items-center justify-center"
            title="Configure Streaming Engine"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Back to games library */}
          <button 
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-white/5 bg-[#14141c]/40 hover:bg-neutral-800 text-xs font-mono font-bold flex items-center gap-1.5 text-zinc-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 accent-text" />
            <span>Close Tab</span>
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-lg bg-[#14141c] border border-white/5 hover:bg-[#1a1a24] text-white flex items-center justify-center cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE EXPANSION NAV DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-3.5 p-4 bg-[#0a0a0f] border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-[#9a9aa8] shrink-0">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#9a9aa8]" />
            <input 
              type="text"
              placeholder="Search movies, TV shows..."
              value={searchInputVal}
              onChange={(e) => setSearchInputVal(e.target.value)}
              className="bg-[#14141c] border border-white/5 pl-9 pr-4 py-2.5 text-xs rounded-xl outline-none focus:border-[var(--accent)] text-[#f5f5f7] w-full"
            />
          </form>
          <button 
            onClick={() => { setView('home'); setSearchQuery(''); setSearchInputVal(''); setIsMobileMenuOpen(false); }}
            className={`text-left hover:text-white py-1 ${view === 'home' && !searchQuery ? 'text-white pl-2 border-l-2 accent-border' : ''}`}
          >
            Home Overview
          </button>
          <button 
            onClick={() => { setView('browse'); setBrowseType('movie'); setBrowseGenre(''); setBrowseTrending(false); setSearchQuery(''); setSearchInputVal(''); setBrowsePage(1); setIsMobileMenuOpen(false); }}
            className={`text-left hover:text-white py-1 ${view === 'browse' && browseType === 'movie' && !browseTrending && !browseGenre && !searchQuery ? 'text-white pl-2 border-l-2 accent-border' : ''}`}
          >
            Movies
          </button>
          <button 
            onClick={() => { setView('browse'); setBrowseType('tv'); setBrowseGenre(''); setBrowseTrending(false); setSearchQuery(''); setSearchInputVal(''); setBrowsePage(1); setIsMobileMenuOpen(false); }}
            className={`text-left hover:text-white py-1 ${view === 'browse' && browseType === 'tv' && !browseTrending && !browseGenre && !searchQuery ? 'text-white pl-2 border-l-2 accent-border' : ''}`}
          >
            TV Shows
          </button>
          <button 
            onClick={() => { setView('browse'); setBrowseTrending(true); setSearchQuery(''); setSearchInputVal(''); setBrowsePage(1); setIsMobileMenuOpen(false); }}
            className={`text-left hover:text-white py-1 ${view === 'browse' && browseTrending && !searchQuery ? 'text-white pl-2 border-l-2 accent-border' : ''}`}
          >
            Trending Group
          </button>
        </div>
      )}

      {/* CORE FRAME CONTAINER: HOME | BROWSE | WATCH */}
      <div className="flex-1 overflow-y-auto scrollbar-cust">
        
        {/* VIEW 1: HOME PAGE */}
        {view === 'home' && (
          <div className="pb-16 flex flex-col">
            {/* HERO TRENDING SPOTLIGHT BILLBOARD */}
            {loadingHero ? (
              <div className="h-[55vh] min-h-[380px] bg-[#14141c] flex flex-col justify-end p-6 md:p-12 animate-pulse space-y-4">
                <div className="w-24 h-6 bg-neutral-800 rounded-md" />
                <div className="w-3/5 h-12 bg-neutral-800 rounded-md" />
                <div className="w-2/5 h-4 bg-neutral-800 rounded-md" />
                <div className="w-[500px] h-12 bg-neutral-800 rounded-md" />
              </div>
            ) : heroPick && (
              <div 
                className="relative h-[60vh] min-h-[400px] flex items-end p-6 md:p-14 overflow-hidden bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${getPosterUrl(heroPick.backdrop_path, 'original')})` }}
              >
                {/* Visual shade overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-black/20 to-black/40 z-0" />
                <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-0" />

                <div className="relative z-10 max-w-2xl space-y-4 text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 font-mono font-black text-[10px] tracking-wider uppercase text-white accent-bg rounded-lg">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>Trending Spotlight</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {heroPick.title || heroPick.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3.5 text-xs text-[#9a9aa8] font-medium">
                    <span className="flex items-center gap-1 text-yellow-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {(heroPick.vote_average || 0).toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{(heroPick.release_date || heroPick.first_air_date || '2026').slice(0, 4)}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 rounded border border-white/10 uppercase text-[9px] font-bold">
                      {heroPick.media_type === 'tv' ? 'TV Show' : 'Movie'}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-[#d6d6e0] leading-relaxed max-w-xl line-clamp-3">
                    {heroPick.overview || 'No overview summary currently description loaded.'}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={() => handlePlayCard(heroPick.id, heroPick.media_type || (heroPick.first_air_date ? 'tv' : 'movie'))}
                      className="px-6 py-3 rounded-xl font-bold text-[#fafafa] accent-bg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 text-sm shadow-lg shadow-black/80 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Watch Stream</span>
                    </button>
                    <button 
                      onClick={() => handlePlayCard(heroPick.id, heroPick.media_type || (heroPick.first_air_date ? 'tv' : 'movie'))}
                      className="px-6 py-3 rounded-xl font-bold text-white bg-white/15 hover:bg-white/20 active:scale-95 transition-all flex items-center gap-2 text-sm backdrop-blur-md cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                      <span>Release Details</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN PORTAL ROW WRAPPER COVERS */}
            <div className="px-4 md:px-8 mt-6 space-y-8 select-none">
              
              {/* CONTINUE PLAYBACK HISTORY */}
              {watchHistory.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-zinc-300">
                      <HistoryIcon className="w-4 h-4 accent-text" />
                      <span>Continue Streaming</span>
                    </h3>
                    <button 
                      onClick={clearAllWatchHistory}
                      className="text-[11px] font-mono font-bold text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Lists</span>
                    </button>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                    {watchHistory.map((item) => (
                      <div 
                        key={`${item.id}-${item.type}`}
                        onClick={() => handlePlayCard(item.id, item.type, item.season, item.episode)}
                        className="flex-shrink-0 w-36 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#14141c] border border-white/5 group-hover:border-white/10 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                          {item.poster ? (
                            <img 
                              src={getPosterUrl(item.poster, 'w342')} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1a24] text-neutral-600">
                              <Film className="w-6 h-6 mb-1" />
                              <span className="text-[10px] uppercase font-bold">Unlisted</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                            <Play className="w-10 h-10 text-white fill-current animate-pulse" />
                          </div>

                          <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold text-white tracking-widest uppercase border border-white/10">
                            {item.type === 'tv' ? 'Shows' : 'Film'}
                          </span>

                          {/* Detail of progress */}
                          {item.type === 'tv' && item.season && item.episode && (
                            <div className="absolute bottom-1 left-1.5 right-1.5 bg-black/80 border border-white/5 py-1 px-1.5 rounded text-[8px] font-mono text-center text-zinc-300 font-bold tracking-tight">
                              S{item.season} · E{item.episode}
                            </div>
                          )}
                        </div>

                        <h4 className="text-[11px] font-bold mt-2 truncate text-zinc-100 group-hover:accent-text transition-colors text-left pl-0.5">
                          {item.title}
                        </h4>
                        <p className="text-[9px] font-mono text-neutral-500 font-semibold tracking-wide text-left pl-0.5 uppercase">
                          {item.year || 'Unknown'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BOOKMARKS WATCHLIST */}
              {bookmarks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-zinc-300">
                    <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                    <span>Your Bookmarks Watchlist</span>
                  </h3>

                  <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                    {bookmarks.map((item) => (
                      <div 
                        key={`${item.id}-${item.type}`}
                        className="flex-shrink-0 w-36 hover:-translate-y-1.5 transition-all duration-300 group relative"
                      >
                        <div 
                          onClick={() => handlePlayCard(item.id, item.type)}
                          className="cursor-pointer"
                        >
                          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#14141c] border border-white/5 group-hover:border-white/10 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                            {item.poster_path ? (
                              <img 
                                src={getPosterUrl(item.poster_path, 'w342')} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1a24] text-neutral-600">
                                <Film className="w-6 h-6 mb-1" />
                                <span className="text-[10px] uppercase font-bold">No Image</span>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                              <Play className="w-10 h-10 text-white fill-current" />
                            </div>

                            <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold text-white tracking-widest uppercase border border-white/10">
                              {item.type === 'tv' ? 'Shows' : 'Film'}
                            </span>
                          </div>

                          <h4 className="text-[11px] font-bold mt-2 truncate text-zinc-100 group-hover:accent-text transition-colors text-left pl-0.5">
                            {item.title}
                          </h4>
                        </div>

                        {/* Trash Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(item); }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-rose-950/80 text-neutral-400 hover:text-rose-400 transition-all cursor-pointer border border-white/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ITERATIVE DYNAMIC CATEGORIES LOAD */}
              {Object.entries(rowsData).map(([title, items]) => (
                <div key={title} className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-300 text-left border-l-2 accent-border pl-2">
                    {title}
                  </h3>

                  {items.length === 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                      {Array(8).fill(null).map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-36 aspect-[2/3] bg-[#14141c] rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                      {items.map((item) => {
                        const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                        return (
                          <div 
                            key={item.id}
                            onClick={() => handlePlayCard(item.id, type)}
                            className="flex-shrink-0 w-36 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#14141c] border border-white/5 group-hover:border-white/10 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                              <img 
                                src={getPosterUrl(item.poster_path, 'w342')} 
                                alt={item.title || item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                loading="lazy"
                              />

                              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                <Play className="w-10 h-10 text-white fill-current" />
                              </div>

                              {item.vote_average > 0 && (
                                <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold text-yellow-400 border border-white/5 flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  {item.vote_average.toFixed(1)}
                                </span>
                              )}

                              <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-extrabold text-white tracking-widest uppercase border border-white/10">
                                {type === 'tv' ? 'TV' : 'Movie'}
                              </span>
                            </div>

                            <h4 className="text-[11px] font-bold mt-2 truncate text-zinc-100 group-hover:accent-text transition-colors text-left pl-0.5">
                              {item.title || item.name}
                            </h4>
                            <p className="text-[9px] font-mono text-neutral-500 font-semibold tracking-wide text-left pl-0.5">
                              {(item.release_date || item.first_air_date || '').slice(0, 4)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

            </div>
          </div>
        )}

        {/* VIEW 2: BROWSE GRID AND GENRE CHIPS */}
        {view === 'browse' && (
          <div className="px-4 md:px-8 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h1 className="text-xl font-black uppercase text-left">
                  {searchQuery 
                    ? `Results for "${searchQuery}"` 
                    : browseTrending 
                    ? 'Trending Blockbusters' 
                    : browseType === 'tv' 
                    ? 'TV Shows Collection' 
                    : 'Unlimited Hot Movies'}
                </h1>
                <p className="text-[11px] font-semibold text-neutral-500 text-left mt-0.5">
                  {searchQuery ? 'Direct metadata matching results from TMDB' : 'Select category filters below to locate streams'}
                </p>
              </div>

              {/* Dynamic Categories Trigger */}
              {!searchQuery && !browseTrending && (
                <div className="flex bg-[#14141c] p-0.5 rounded-full border border-white/5 select-none self-start sm:self-auto text-[10px] uppercase tracking-wider font-extrabold">
                  <button 
                    onClick={() => { setBrowseType('movie'); setBrowseGenre(''); setBrowsePage(1); }}
                    className={`px-3 py-1.5 rounded-full ${browseType === 'movie' ? 'accent-bg text-white' : 'text-neutral-400 hover:text-white'}`}
                  >
                    Films
                  </button>
                  <button 
                    onClick={() => { setBrowseType('tv'); setBrowseGenre(''); setBrowsePage(1); }}
                    className={`px-3 py-1.5 rounded-full ${browseType === 'tv' ? 'accent-bg text-white' : 'text-neutral-400 hover:text-white'}`}
                  >
                    TV Shows
                  </button>
                </div>
              )}
            </div>

            {/* GENRE CHIPS ROW */}
            {!searchQuery && !browseTrending && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-wrap select-none">
                <button 
                  onClick={() => { setBrowseGenre(''); setBrowsePage(1); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                    !browseGenre 
                      ? 'accent-bg text-white border-transparent' 
                      : 'bg-[#14141c] text-neutral-400 hover:text-white border-white/5'
                  }`}
                >
                  All Genres
                </button>
                {Object.entries(GENRES[browseType]).map(([id, name]) => (
                  <button 
                    key={id}
                    onClick={() => { setBrowseGenre(id); setBrowsePage(1); }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                      browseGenre == id 
                        ? 'accent-bg text-white border-transparent' 
                        : 'bg-[#14141c] text-neutral-400 hover:text-white border-white/5'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}

            {/* BROWSE GRID OF STREAM LISTS */}
            {loadingBrowse && browsePage === 1 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pb-20">
                {Array(16).fill(null).map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-[#14141c] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : browseResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-500">
                <AlertTriangle className="w-12 h-12 mb-3 animate-bounce" />
                <h3 className="text-sm font-extrabold uppercase">Resource Unlisted</h3>
                <p className="text-xs px-6 mt-1">We couldn&apos;t match any results from TMDB. Search directly with proper name spelling.</p>
              </div>
            ) : (
              <div className="space-y-8 pb-20">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {browseResults.map((item) => {
                    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                    return (
                      <div 
                        key={item.id}
                        onClick={() => handlePlayCard(item.id, type)}
                        className="hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#14141c] border border-white/5 group-hover:border-white/10 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                          <img 
                            src={getPosterUrl(item.poster_path, 'w342')} 
                            alt={item.title || item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                            loading="lazy"
                          />

                          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                            <Play className="w-10 h-10 text-white fill-current" />
                          </div>

                          {item.vote_average > 0 && (
                            <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold text-yellow-400 border border-white/5 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              {item.vote_average.toFixed(1)}
                            </span>
                          )}

                          <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-extrabold text-white tracking-widest uppercase border border-white/10">
                            {type === 'tv' ? 'TV' : 'Movie'}
                          </span>
                        </div>

                        <h4 className="text-[11px] font-bold mt-2 truncate text-zinc-100 group-hover:accent-text transition-colors text-left pl-0.5">
                          {item.title || item.name}
                        </h4>
                        <p className="text-[9px] font-mono text-neutral-500 font-semibold tracking-wide text-left pl-0.5">
                          {(item.release_date || item.first_air_date || '').slice(0, 4)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* PAGINATION TRIGGER */}
                {!browseDone && (
                  <div className="flex justify-center select-none pt-4">
                    <button 
                      onClick={() => setBrowsePage(prev => prev + 1)}
                      disabled={loadingBrowse}
                      className="px-6 py-2.5 rounded-full font-mono text-xs font-black uppercase tracking-wider bg-[#14141c] border border-white/5 hover:border-white/10 hover:bg-[#1a1a24] text-white disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-black/40"
                    >
                      {loadingBrowse ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Streaming lists...</span>
                        </>
                      ) : (
                        <span>Load More Releases</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: watch VIEW STREAMING PLAYER */}
        {view === 'watch' && (
          <div className="pb-20">
            {/* LARGE IMMERSIVE MOVIE FEED */}
            <div 
              ref={playerStageRef}
              id="player-stage"
              className={`relative bg-black transition-all duration-300 w-full overflow-hidden ${
                theaterMode 
                  ? 'fixed inset-0 z-[1000] w-screen h-screen aspect-auto' 
                  : 'aspect-video max-h-[82vh]'
              }`}
            >
              {/* Spinner loader indicator */}
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 space-y-3 z-10">
                  <div className="w-12 h-12 border-4 border-zinc-800 border-t-[var(--accent)] rounded-full animate-spin" />
                  <span className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">Syncing Secure Player Feed...</span>
                </div>
              )}

              {/* Streaming Embed Content */}
              {watchId && (
                <iframe 
                  key={activeStreamUrl}
                  src={activeStreamUrl}
                  className="w-full h-full border-none z-0"
                  allowFullScreen
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  referrerPolicy="origin"
                  onLoad={() => setIframeLoaded(true)}
                  title="Dynamic Streaming Player Frame"
                />
              )}

              {/* Top Controls Overlay on hover */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-20 opacity-40 hover:opacity-100 transition-opacity duration-200 select-none">
                <button 
                  onClick={() => setTheaterMode(prev => !prev)}
                  className="px-3 py-1.5 rounded-lg bg-black/75 hover:bg-black font-semibold text-xs text-white border border-white/10 flex items-center gap-1 cursor-pointer"
                  title="Window Theater Mode (Press W)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{theaterMode ? 'Exit Window' : 'Window'}</span>
                </button>
                <button 
                  onClick={toggleBrowserFullscreen}
                  className="px-3 py-1.5 rounded-lg bg-black/75 hover:bg-black font-semibold text-xs text-white border border-white/10 flex items-center gap-1 cursor-pointer"
                  title="True Fullscreen (Press F)"
                >
                  <Maximize2 className="w-3.5 h-3.5 rotate-90" />
                  <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
                </button>
                
                {theaterMode && (
                  <button 
                    onClick={() => setTheaterMode(false)}
                    className="p-1.5 px-2.5 rounded-lg bg-red-600 hover:bg-red-500 font-extrabold text-xs text-white cursor-pointer"
                    title="Exit Theater"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* WATCH DECK WORKSPACE COLUMN GRID */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              
              {/* LEFT & CENTER COLUMN COMPONENTS */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* BACKLINK AND ACTIONS */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14141c] border border-white/5 p-4 rounded-2xl select-none">
                  <button 
                    onClick={() => { setView('home'); }}
                    className="flex items-center gap-1.5 text-xs font-mono font-black uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 accent-text" />
                    <span>Return Home</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleBookmark({ id: watchId, ...watchDetails })}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        bookmarks.some(b => b.id == watchId && b.type === watchType)
                          ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                          : 'bg-neutral-900/60 border-white/5 text-[#9a9aa8] hover:text-white'
                      }`}
                      title="Add to Library Bookmarks"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <a 
                      href={activeStreamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#1a1a24] border border-white/5 hover:border-white/10 hover:text-[var(--accent)] rounded-xl text-xs font-mono font-bold text-neutral-300 transition-all flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Stand-alone URL</span>
                    </a>
                  </div>
                </div>

                {/* SERVER SELECTOR INTERACTIVE CHIPS */}
                <div className="space-y-2 select-none">
                  <h3 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider block pl-1">
                    Streaming Channel Feed Slots (Press Hotkeys 1-4 to Toggle instantly!)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PROVIDERS.map((prov, i) => (
                      <button 
                        key={prov.id}
                        onClick={() => { setCurrentProvider(prov.id); }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          currentProvider === prov.id
                            ? 'accent-bg text-white border-transparent shadow-[0_4px_16px_rgba(229,9,20,0.15)] font-black'
                            : 'bg-[#14141c] text-[#f5f5f7] border-white/5 hover:bg-[#1a1a24] hover:border-white/10 font-bold'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-1">
                          <p className="text-xs truncate">{prov.name}</p>
                          <span className={`text-[8px] uppercase tracking-widest block font-bold ${
                            currentProvider === prov.id ? 'text-white/80' : 'text-neutral-500'
                          }`}>
                            {prov.badge}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-neutral-300 font-extrabold border border-white/5 shadow-inner">
                          {i + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SHOW EPISODE SELECTORS (ONLY IN SERIES TYPES!) */}
                {watchType === 'tv' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h2 className="text-sm font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        <MonitorPlay className="w-4 h-4 accent-text animate-bounce" />
                        <span>Episodes Matrix</span>
                      </h2>

                      {watchDetails?.seasons && (
                        <select 
                          value={watchSeason}
                          onChange={(e) => { 
                            const val = parseInt(e.target.value); 
                            setWatchSeason(val); 
                            setWatchEpisode(1);
                            setIframeLoaded(false);
                          }}
                          className="bg-[#14141c] border border-white/5 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-[var(--accent)] font-semibold text-white cursor-pointer"
                        >
                          {(watchDetails.seasons || [])
                            .filter(s => s.season_number > 0)
                            .map(s => (
                              <option key={s.id} value={s.season_number}>
                                {s.name || `Season ${s.season_number}`}
                              </option>
                            ))
                          }
                        </select>
                      )}
                    </div>

                    {loadingEpisodes ? (
                      <div className="flex items-center justify-center py-10">
                        <div className="w-8 h-8 border-2 border-zinc-800 border-t-rose-500 rounded-full animate-spin" />
                      </div>
                    ) : watchEpisodes.length === 0 ? (
                      <div className="text-center py-6 text-neutral-500 text-xs">
                        No episode details available for this season.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto scrollbar-cust pr-1">
                        {watchEpisodes.map((ep) => (
                          <div 
                            key={ep.id}
                            onClick={() => { 
                              setWatchEpisode(ep.episode_number);
                              setIframeLoaded(false);
                              if (watchDetails) {
                                recordHistoryState(watchDetails, 'tv', watchSeason, ep.episode_number);
                              }
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`flex gap-3 text-left p-2.5 rounded-xl border cursor-pointer transition-all ${
                              watchEpisode === ep.episode_number
                                ? 'bg-rose-950/20 border-rose-500/20 text-white'
                                : 'bg-[#14141c] border-white/5 hover:border-white/10 hover:bg-[#1a1a24] text-[#9a9aa8] hover:text-white'
                            }`}
                          >
                            <div className="relative flex-shrink-0 w-20 aspect-video rounded-lg overflow-hidden bg-black/40">
                              {ep.still_path ? (
                                <img 
                                  src={getPosterUrl(ep.still_path, 'w185')} 
                                  alt="" 
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 border border-white/5">
                                  <Film className="w-3 text-neutral-600" />
                                </div>
                              )}
                              <span className="absolute bottom-1 right-1 px-1 bg-black/80 rounded text-[8px] font-bold text-white font-mono">
                                E{ep.episode_number}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <h4 className="text-[11px] font-extrabold truncate text-zinc-100 group-hover:accent-text">
                                {ep.name || `Episode ${ep.episode_number}`}
                              </h4>
                              <p className="text-[9px] text-[#9a9aa8] line-clamp-2 mt-0.5 leading-relaxed font-sans">
                                {ep.overview || 'Synopsis unlisted. Play to view details.'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* MORE LIKE THIS RECOMMENDATIONS */}
                {watchDetails?.recommendations?.results?.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-black uppercase tracking-wider text-zinc-300 border-l-2 accent-border pl-2 select-none">
                      More Releases Like This
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide select-none">
                      {watchDetails.recommendations.results
                        .filter(r => r.poster_path)
                        .slice(0, 14)
                        .map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => handlePlayCard(item.id, watchType)}
                            className="flex-shrink-0 w-28 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#14141c] border border-white/5 group-hover:border-white/10">
                              <img 
                                src={getPosterUrl(item.poster_path, 'w185')} 
                                alt={item.title || item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                loading="lazy"
                              />
                            </div>
                            <h4 className="text-[10px] font-bold mt-1.5 truncate text-zinc-200 group-hover:accent-text text-left pl-0.5">
                              {item.title || item.name}
                            </h4>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT SIDE DETAILS AND CAST COMPONENT */}
              <div className="space-y-6">
                
                {/* POSTER AND META DESCRIPTION */}
                {loadingWatch ? (
                  <div className="bg-[#14141c] border border-white/5 p-6 rounded-2xl space-y-4 animate-pulse">
                    <div className="aspect-[2/3] bg-neutral-800 rounded-xl w-40 mx-auto" />
                    <div className="w-2/3 h-5 bg-neutral-800 rounded mx-auto" />
                    <div className="w-full h-12 bg-neutral-800 rounded" />
                  </div>
                ) : watchDetails && (
                  <div className="bg-[#14141c]/50 border border-white/5 p-5 rounded-2xl space-y-4 shadow-xl">
                    <div className="flex gap-4 items-start border-b border-white/5 pb-4">
                      {watchDetails.poster_path ? (
                        <div className="w-24 shrink-0 aspect-[2/3] rounded-xl overflow-hidden border border-white/5 self-start shadow-md shadow-black/60">
                          <img 
                            src={getPosterUrl(watchDetails.poster_path, 'w342')} 
                            alt={watchDetails.title || watchDetails.name || ''} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null}

                      <div className="min-w-0">
                        <span className="text-[9px] font-mono accent-text font-black uppercase tracking-wider">
                          {watchType === 'movie' ? 'Cinematic Release' : 'Serialized TV Stream'}
                        </span>
                        <h2 className="text-base font-black truncate text-white mt-0.5">
                          {watchDetails.title || watchDetails.name}
                        </h2>
                        
                        {watchType === 'tv' && (
                          <div className="text-[10px] font-mono text-zinc-400 font-bold mt-1 shadow-inner bg-black/45 px-2 py-1 rounded inline-block border border-white/5">
                            Now Playing: <span className="accent-text font-black">S{watchSeason} · E{watchEpisode}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-400 font-bold mt-2 font-mono">
                          <span className="text-yellow-400 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" />
                            {(watchDetails.vote_average || 0).toFixed(1)}
                          </span>
                          <span>•</span>
                          <span>{(watchDetails.release_date || watchDetails.first_air_date || '2026').slice(0, 4)}</span>
                          {watchDetails.runtime ? (
                            <>
                              <span>•</span>
                              <span>{watchDetails.runtime}m</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {watchDetails.tagline ? (
                      <p className="text-[11px] font-sans italic text-zinc-400 tracking-wide text-center bg-black/25 p-2 rounded-lg border border-white/5 shadow-inner leading-relaxed">
                        &ldquo;{watchDetails.tagline}&rdquo;
                      </p>
                    ) : null}

                    {/* GENRE LABELS */}
                    {watchDetails.genres && (
                      <div className="flex flex-wrap gap-1.5 select-none">
                        {watchDetails.genres.map(g => (
                          <span key={g.id} className="text-[9px] font-mono font-bold uppercase tracking-wide px-2.5 py-1 rounded bg-[#1a1a24] text-neutral-300 border border-white/5">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <span className="text-[8px] font-mono tracking-widest text-[#9a9aa8] uppercase font-black block">Storyline Summary</span>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        {watchDetails.overview || 'No textual synopsis currently catalogs in records.'}
                      </p>
                    </div>

                    {/* CAST MEMBERS LIST PANEL */}
                    {watchDetails?.credits?.cast?.length > 0 && (
                      <div className="space-y-2.5 pt-2 border-t border-white/5 select-none text-left">
                        <span className="text-[8px] font-mono tracking-widest text-[#9a9aa8] uppercase font-black block">Cast Members ({Math.min(10, watchDetails.credits.cast.length)})</span>
                        <div className="grid grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto scrollbar-cust pr-1">
                          {watchDetails.credits.cast.slice(0, 10).map((actor) => (
                            <div key={actor.id} className="flex gap-2 items-center bg-black/15 p-1 rounded-lg border border-white/5">
                              {actor.profile_path ? (
                                <img 
                                  src={getPosterUrl(actor.profile_path, 'w185')} 
                                  alt="" 
                                  className="w-8 h-8 rounded-full object-cover bg-neutral-900 border border-white/10 scale-95"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center border border-white/10 text-neutral-600 scale-95">
                                  <User className="w-3.5 h-3.5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-[10px] font-bold truncate text-white leading-none">{actor.name}</p>
                                <p className="text-[8px] font-semibold text-[#9a9aa8] truncate mt-0.5 leading-none">{actor.character}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* HELP INSTRUCTIONS TIP */}
                <div className="p-4 rounded-2xl bg-blue-950/10 border border-blue-900/30 text-xs flex gap-3 text-left">
                  <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1 leading-relaxed">
                    <h4 className="font-extrabold text-blue-300 font-mono text-[11px] uppercase tracking-wide">Dynamic Mirror Controls</h4>
                    <p className="text-zinc-400 leading-normal text-[11px]">
                      If the default stream experiences buffering or doesn&apos;t load, quickly press hotkeys <kbd className="bg-[#14141c]/80 border border-white/10 px-1 py-0.5 rounded px-1 px-1 text-white font-bold font-mono">1</kbd> to <kbd className="bg-[#14141c]/80 border border-white/10 px-1 py-0.5 rounded text-white font-bold font-mono">4</kbd> to toggle between fast, alternative, unblocked web mirror servers instantly. Keep an Adblocker active for premium cinema speeds!
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* FOOTER METADATA SPECTRUMS */}
      <footer className="shrink-0 border-t border-white/5 py-4 px-6 text-center text-[#9a9aa8] text-[10px] select-none uppercase tracking-widest font-mono">
        <p>StreamVerse Multiplex System · Backed by <span className="text-white hover:accent-text transition-all font-black">TMDB Service Nodes</span></p>
      </footer>

      {/* SETTINGS DIALOG DRAWER MODAL OVERLAY */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-end select-none">
          <div 
            onClick={() => setIsSettingsOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="relative w-80 h-full bg-[#14141c] border-l border-white/5 p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.85)] z-10 animate-slide-in">
            <div className="space-y-6 overflow-y-auto scrollbar-hide pr-1">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#e50914]" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Stream Configuration</h3>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CUSTOM ACCENT COLOR CHOICE */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-neutral-400">Custom Canvas Accent Color:</span>
                <div className="grid grid-cols-5 gap-2">
                  {SWATCHES.map((swatch) => (
                    <button 
                      key={swatch}
                      onClick={() => setSettings(prev => ({ ...prev, color: swatch }))}
                      className={`h-7 rounded-lg border-2 transition-transform hover:scale-110 cursor-pointer ${
                        settings.color === swatch 
                          ? 'border-white scale-105' 
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: `#${swatch}` }}
                    />
                  ))}
                </div>
              </div>

              {/* DEFAULT SERVER CHOICE */}
              <div className="space-y-1.5 text-left select-none">
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-neutral-400">Default Mirror Server:</span>
                <select 
                  value={settings.defaultProvider}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultProvider: e.target.value }))}
                  className="w-full bg-[#1c1c24] border border-white/5 text-xs rounded-xl px-3 py-2 outline-none text-[#fafafa] font-semibold cursor-pointer"
                >
                  {PROVIDERS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} Embedded Server</option>
                  ))}
                </select>
              </div>

              {/* OTHER SWITCHES */}
              <div className="space-y-3 text-left">
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-neutral-400 block border-b border-white/5 pb-1.5">Playback Engine</span>
                
                <label className="flex items-center justify-between cursor-pointer group py-0.5">
                  <span className="text-xs font-semibold text-[#fafafa]">Default autoplay frame</span>
                  <input 
                    type="checkbox"
                    checked={settings.autoplay}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoplay: e.target.checked }))}
                    className="rounded bg-black border-white/5 accent-bg w-4 h-4 cursor-pointer outline-none focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group py-0.5">
                  <span className="text-xs font-semibold text-[#fafafa]">Mute sound on launch</span>
                  <input 
                    type="checkbox"
                    checked={settings.muted}
                    onChange={(e) => setSettings(prev => ({ ...prev, muted: e.target.checked }))}
                    className="rounded bg-black border-white/5 accent-bg w-4 h-4 cursor-pointer outline-none focus:ring-0"
                  />
                </label>
              </div>

              {/* CUSTOM TMDB API KEY SECTION */}
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-neutral-400 block border-b border-white/5 pb-1.5">developer keys</span>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 font-bold uppercase">Provide your own TMDB API v3 Key:</label>
                  <input 
                    type="password"
                    placeholder="Enter key to personalize list feeds"
                    value={tmdbKey}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      setTmdbKey(v);
                      if (v) {
                        localStorage.setItem('tmdb_key', v);
                      } else {
                        localStorage.removeItem('tmdb_key');
                      }
                    }}
                    className="w-full bg-[#1c1c24] border border-white/5 text-xs rounded-xl px-3 py-2 outline-none text-white focus:border-[var(--accent)] font-mono"
                  />
                  <p className="text-[8px] text-zinc-500 font-sans leading-relaxed">
                    Leave empty to fallback to our shared developer key slot automatically.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Actions inside settings drawer */}
            <div className="pt-4 border-t border-white/5 select-none space-y-2">
              <button 
                onClick={clearAllWatchHistory}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-black uppercase text-center bg-[#1a1a24] hover:bg-rose-950/20 text-[#9a9aa8] hover:text-rose-400 transition-colors border border-white/5 hover:border-rose-950/30 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All History</span>
              </button>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-black uppercase text-center accent-bg text-white hover:opacity-95 transition-all cursor-pointer shadow-lg shadow-black/80"
              >
                Save & Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
