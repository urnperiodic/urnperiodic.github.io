import { useState, useEffect, useRef } from 'react';
import { games as gamesData } from './data/games';
import { initialArticles, gameOptions, toneOptions, generateMockAIArticle } from './data/articles';
import { 
  School, 
  Search, 
  Play, 
  ExternalLink, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
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
  Lock,
  Unlock,
  LogOut
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
  }
};

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = safeStorage.getItem('unblocked-theme');
    return saved && ['cyborg', 'violet', 'ice', 'rose-pine', 'none'].includes(saved) ? saved : 'none';
  });
  const [mode, setMode] = useState(() => {
    return safeStorage.getItem('unblocked-mode') || 'dark';
  });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = safeStorage.getItem('unblocked-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [viewMode, setViewMode] = useState(() => {
    const saved = safeStorage.getItem('classroom-view-mode');
    if (saved && ['locked', 'articles', 'games'].includes(saved)) return saved;
    const legacy = safeStorage.getItem('classroom-passcode-unlocked');
    return legacy === 'true' ? 'games' : 'locked';
  });

  const isPasscodeUnlocked = viewMode === 'games';

  const setViewModeAndSave = (mode) => {
    setViewMode(mode);
    safeStorage.setItem('classroom-view-mode', mode);
    safeStorage.setItem('classroom-passcode-unlocked', mode === 'games' ? 'true' : 'false');
  };

  const [passcode, setPasscode] = useState('');
  const [isShake, setIsShake] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  // Articles and Custom AI article generator states
  const [articles, setArticles] = useState(initialArticles);
  const [selectedArticleId, setSelectedArticleId] = useState(initialArticles[0].id);
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedArticleCategory, setSelectedArticleCategory] = useState('All');
  const [newArticleGame, setNewArticleGame] = useState(gameOptions[0].value);
  const [newArticleTone, setNewArticleTone] = useState(toneOptions[0].value);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerateArticle = () => {
    if (isGeneratingArticle) return;
    setIsGeneratingArticle(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const article = generateMockAIArticle(newArticleGame, newArticleTone);
            setArticles((prevArticles) => [article, ...prevArticles]);
            setSelectedArticleCategory(article.category);
            setSelectedArticleId(article.id);
            setIsGeneratingArticle(false);
          }, 200);
          return 100;
        }
        return prev + 5;
      });
    }, 45);
  };

  const handleDigitInput = (digit) => {
    if (viewMode === 'games' || passcode.length >= 4) return;
    const nextPasscode = passcode + digit;
    setPasscode(nextPasscode);

    if (nextPasscode === '0609') {
      setTimeout(() => {
        setViewModeAndSave('games');
        setPasscode('');
      }, 150);
    } else if (nextPasscode === '1212' || nextPasscode === '2026' || nextPasscode === '1111') {
      setTimeout(() => {
        setViewModeAndSave('articles');
        setPasscode('');
      }, 150);
    } else if (nextPasscode.length === 4) {
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
      if (e.key >= '0' && e.key <= '9') {
        handleDigitInput(e.key);
      } else if (e.key === 'Backspace') {
        setPasscode(prev => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        setPasscode('');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passcode, viewMode]);

  // Global Panic Key Handler
  useEffect(() => {
    const handlePanic = (e) => {
      if (e.key === '[' || e.key === ']') {
        e.preventDefault();
        setViewModeAndSave('articles');
        setSelectedGame(null); // Instantly close active game to clear screen
      }
    };
    window.addEventListener('keydown', handlePanic);
    return () => window.removeEventListener('keydown', handlePanic);
  }, []);

  // Set browser tab title to Home - Classroom
  useEffect(() => {
    document.title = "Home - Classroom";
  }, []);

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

  // Hide/show chat widget based on lock state
  useEffect(() => {
    document.body.setAttribute('data-locked', isPasscodeUnlocked ? 'false' : 'true');
  }, [isPasscodeUnlocked]);

  // List of Alt links configuration
  const altLinks = [
    { name: 'Alt Link 1', url: 'https://granddia3.github.io' },
    { name: 'Alt Link 2', url: 'https://classroonn.github.io' },
    { name: 'Alt Link 3', url: 'https://IIMS-sucksasaschool.github.io/' },
    { name: 'Alt Link 4', url: 'https://ciassroonn.github.io' },
    { name: 'Alt Link 5', url: 'https://acutusinvictus.github.io' }
  ];

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
  const renderGameArt = (game) => {
    const iconSize = 48;
    switch (game.id) {
      case 1: // Slope
        return (
          <div className="relative w-full h-full flex items-center justify-center">
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
      case 2: // 2048
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1 bg-amber-950/20 p-2 rounded">
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-xs font-black text-black">2</div>
              <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-xs font-black text-white">0</div>
              <div className="w-8 h-8 rounded bg-yellow-500 flex items-center justify-center text-xs font-black text-white">4</div>
              <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center text-xs font-black text-white animate-bounce">8</div>
            </div>
          </div>
        );
      case 3: // Retro Bowl
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-blue-400 opacity-60">QUARTERBACK</div>
            <div className="relative w-14 h-8 bg-amber-800 rounded-full border-y-[3px] border-white/60 flex items-center justify-center shadow-lg transform -rotate-12">
              <div className="w-1 h-6 bg-white/80 absolute" />
              <div className="w-3 h-[2px] bg-white translate-x-2 absolute" />
              <div className="w-3 h-[2px] bg-white -translate-x-2 absolute" />
            </div>
          </div>
        );
      case 4: // Flappy Bird
        return (
          <div className="relative w-full h-full flex items-center justify-center">
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
      case 5: // Pacman Retro
        return (
          <div className="relative w-full h-full flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-full border-r-4 border-transparent rotate-45 animate-pulse" />
            <div className="w-2 h-2 bg-white rounded-full" />
            <div className="w-2 h-2 bg-white/60 rounded-full" />
            <div className="w-2 h-2 bg-white/30 rounded-full" />
          </div>
        );
      case 6: // Tunnel rush
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="absolute w-24 h-24 border-2 border-dashed border-purple-500/40 rounded-full animate-spin" />
            <div className="absolute w-16 h-16 border border-purple-500/30 rounded-full animate-ping" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white" />
          </div>
        );
      case 7: // Chess
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
      case 8: // Bubble shooter
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-3 flex gap-2">
              <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" />
              <div className="w-4 h-4 bg-red-400 rounded-full shadow-[0_0_8px_red]" />
              <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_8px_yellow]" />
            </div>
            <div className="absolute bottom-2 w-2 h-8 bg-zinc-400 rounded-full origin-bottom rotate-45 animate-pulse" />
          </div>
        );
      case 9: // Crossy Road
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-x-0 h-4 bg-neutral-800/80 border-y border-neutral-700" />
            <div className="w-8 h-8 bg-white border border-neutral-300 rounded flex flex-col items-center justify-center transform hover:translate-y-[-6px] transition-transform shadow-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1" />
              <div className="w-3 h-1.5 bg-yellow-500 rounded-b mt-0.5" />
            </div>
          </div>
        );
      case 10: // Solitaire
        return (
          <div className="relative w-full h-full flex items-center justify-center">
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
      case 11: // Doodle jump
        return (
          <div className="relative w-full h-full flex items-center justify-center">
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
      case 12: // Classroom portal
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="bg-sky-500/10 p-3 rounded-full border border-sky-400/20">
              <MessageSquare className="text-sky-400 w-10 h-10 animate-pulse" />
            </div>
          </div>
        );
      case 13: // Youtube stealth
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg relative cursor-pointer transform hover:scale-105 duration-200">
              <Play className="fill-white text-white w-5 h-5 ml-0.5" />
            </div>
          </div>
        );
      case 14: // Stealth proxy frame
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="bg-zinc-800 p-3 rounded-lg border-2 border-zinc-700 flex flex-col items-center gap-1 shadow-md">
              <Globe className="text-zinc-300 w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
        );
      case 15: // Sim Life
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="bg-pink-500/10 p-4 rounded-full border border-pink-400/30">
              <Users className="text-pink-400 w-8 h-8 hover:rotate-12 duration-200" />
            </div>
          </div>
        );
      case 16: // Sandbox Island
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-amber-950 opacity-40" />
            <div className="relative w-12 h-12 bg-amber-800 rounded-md border-t-[8px] border-emerald-500 shadow-xl flex items-center justify-center font-mono font-bold text-white/50 text-[10px]">
              3D
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <Gamepad2 className="text-neutral-400 w-12 h-12" />
          </div>
        );
    }
  };

  const isSinglePlayerCategory = (cat) => {
    if (!cat) return true;
    const c = cat.toLowerCase().trim();
    return ['solo', 'single', 'platformer', 'skill', 'science', 'driving', 'horror', 'creative', 'ai'].some(kw => c.includes(kw));
  };

  const isMultiplayerCategory = (cat) => {
    if (!cat) return false;
    const c = cat.toLowerCase().trim();
    return ['social', 'sport', 'multiplayer', 'fast', 'party', 'puzzle', 'shooter'].some(kw => c.includes(kw)) || c.includes('or');
  };

  // Filter games based on category sidebar, matching search query
  const filteredGames = gamesData.filter(game => {
    if (filter === 'single' && !isSinglePlayerCategory(game.category)) return false;
    if (filter === 'multiplayer' && !isMultiplayerCategory(game.category)) return false;
    if (filter === 'favorites' && !favorites.includes(game.id)) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = (game.title || '').toLowerCase().includes(q);
      const matchDesc = (game.description || '').toLowerCase().includes(q);
      const matchCat = (game.category || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    }

    return true;
  });



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
      return text.split('\n').map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('###')) {
          const headerText = trimmed.replace(/^###\s*/, '');
          return (
            <h4 key={idx} className="text-xs font-bold text-[var(--text-primary)] mt-3 mb-1.5">
              {headerText}
            </h4>
          );
        }
        if (trimmed.startsWith('*')) {
          const itemText = trimmed.replace(/^\*\s*/, '');
          return (
            <li key={idx} className="text-[11px] text-[var(--text-muted)] ml-4 list-disc mb-1 leading-relaxed">
              {itemText}
            </li>
          );
        }
        if (trimmed.match(/^\d+\./)) {
          const itemText = trimmed.replace(/^\d+\.\s*/, '');
          return (
            <li key={idx} className="text-[11px] text-[var(--text-muted)] ml-4 list-decimal mb-1 leading-relaxed">
              {itemText}
            </li>
          );
        }
        if (trimmed === '') {
          return <div key={idx} className="h-1.5" />;
        }
        return (
          <p key={idx} className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-2">
            {trimmed}
          </p>
        );
      });
    };

    if (viewMode === 'articles') {
      return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col p-4 md:p-6 transition-colors duration-300 relative select-text">
          
          {/* Decoy Legitimate Educational Header */}
          <header className="w-full max-w-7xl mx-auto flex justify-between items-center pb-4 mb-4 border-b border-[var(--card-border)] gap-4 select-none">
            <div 
              onClick={() => setViewModeAndSave('locked')}
              className="flex items-center gap-3 cursor-pointer active:scale-98 transition-transform"
              title="Return to secure screen"
            >
              <div className="p-2 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-xl shadow-[0_2px_8.5px_var(--accent-shadow)] border border-[var(--card-border)]">
                <BookOpen className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                  Classroom <span className="text-[10px] font-mono border border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Academic Base</span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
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

          {/* Actual Articles Hub Grid (Occupies full-screen width) */}
          <div className="w-full max-w-7xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 md:p-6 shadow-2xl transition-all flex flex-col gap-4 flex-1 md:h-[650px] overflow-hidden">
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0 overflow-hidden">
              {/* Left Column - Articles selection */}
              <div className="md:col-span-2 flex flex-col gap-3 overflow-hidden h-full">
                
                {/* Subject Specific Sections */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none select-none">
                  {['All', 'Science', 'Mathematics', 'ELA', 'Social Studies'].map((cat) => {
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
                          className={`p-2 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
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
                  <div className="flex flex-col h-full overflow-hidden">
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
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col xl:flex-row items-center xl:items-center justify-center p-4 md:p-8 xl:p-12 gap-8 md:gap-10 transition-colors duration-350 relative select-none">
        
        {/* Floating Controls inside Lock Screen */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          
          {/* Light/Dark Slider */}
          <div className="flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] py-1.5 px-2.5 rounded-full shadow-sm">
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
          </div>

          {/* Theme custom capsule */}
          <div className="border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <div className="flex items-center gap-1.5">
              {[
                { key: 'cyborg', color: 'bg-green-500 border-green-300 shadow-[0_0_5px_green]', tooltip: 'Cyborg Theme' },
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

        </div>

        {/* Lock Card Content Container */}
        <div className={`w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 flex flex-col items-center gap-6 flex-shrink-0 ${isShake ? 'animate-shake' : ''}`}>
          
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Portal Secured</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">This is a paid Science, Math, ELA, and Social Studies article website. Please enter a correct password to continue to the website. Hint: Year 26.</p>
          </div>

          {/* Indicators for passcode digits */}
          <div className="flex justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = passcode.length > index;
              return (
                <div 
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-150 transform ${
                    isFilled 
                      ? 'bg-[var(--accent-color)] border-[var(--accent-color)] scale-110 shadow-[0_0_8px_var(--accent-shadow)]' 
                      : 'border-[var(--card-border)] bg-[var(--bg-secondary)]'
                  }`}
                />
              );
            })}
          </div>

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
                <BookOpen className="text-[var(--accent-color)] w-5 h-5" />
                Examples of some articles
              </h3>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto uppercase tracking-wider text-[10px] font-mono bg-[var(--bg-secondary)] py-1 px-2 rounded-md border border-[var(--card-border)] text-[var(--accent-color)]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-400" />
              <span>AI generated examples</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0 overflow-hidden">
            {/* Left lists & creator pane (cols 2) */}
            <div className="md:col-span-2 flex flex-col gap-3 overflow-hidden h-full">
              
              {/* Subject Specific Sections */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none select-none">
                {['All', 'Science', 'Mathematics', 'ELA', 'Social Studies'].map((cat) => {
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

              {/* Creator board container */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-3 flex-shrink-0 flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-xs font-bold text-[var(--text-primary)] font-mono">Interactive AI Writer</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Subject</label>
                    <select
                      value={newArticleGame}
                      onChange={(e) => setNewArticleGame(e.target.value)}
                      className="text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1.5 text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-mono"
                    >
                      {gameOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Tone</label>
                    <select
                      value={newArticleTone}
                      onChange={(e) => setNewArticleTone(e.target.value)}
                      className="text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1.5 text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-mono"
                    >
                      {toneOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.value}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateArticle}
                  disabled={isGeneratingArticle}
                  className="w-full text-xs font-semibold bg-[var(--accent-color)] text-[var(--bg-color)] py-1.5 rounded-xl hover:opacity-95 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5 font-mono shadow-sm mt-0.5"
                >
                  {isGeneratingArticle ? (
                    <>
                      <Sparkles className="w-3 h-3 animate-spin text-yellow-300" />
                      <span>DEEP WRITER ({generationProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      <span>GENERATE ARTICLE WITH AI</span>
                    </>
                  )}
                </button>
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
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* HEADER */}
      <nav className="border-b border-[var(--card-border)] bg-[var(--header-bg)] py-3.5 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors duration-300 sticky top-0 z-50 shadow-sm">
        
        {/* Left Side: Decoy Classroom Title */}
        <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between w-full sm:w-auto">
          <div 
            onClick={() => { setFilter('all'); setSelectedGame(null); setSearchQuery(''); }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            title="Go to Classroom homepage"
          >
            <div className="p-2 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-lg border border-[var(--card-border)] shadow-[0_2px_8.5px_var(--accent-shadow)] group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 transform">
              <School className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] block group-hover:text-[var(--accent-color)] transition-colors">Classroom</span>
            </div>
          </div>

          {/* Sign Out Button right after Classroom */}
          <button
            onClick={() => {
              setViewModeAndSave('locked');
              setPasscode('');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-red-500/50 hover:bg-red-500/10 text-[var(--text-primary)] hover:text-red-500 transition-all duration-200 cursor-pointer shadow-sm group"
            title="Sign Out to Lock Screen"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Middle Search Bar */}
        <div className="relative w-full max-w-sm sm:mx-4">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search school games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm rounded-full py-2.5 pl-9 pr-4 border border-[var(--card-border)] bg-[var(--input-fill)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder:opacity-50 transition-all duration-300 shadow-inner"
          />
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3 md:gap-4 self-stretch sm:self-auto justify-between sm:justify-end flex-wrap sm:flex-nowrap">
          
          <div className="text-[11px] font-mono select-none opacity-80 pl-1">
            <span className="text-xs opacity-50 block sm:inline mr-1">made by</span>
            <span className="font-bold text-[var(--accent-color)] tracking-wider">™ AND GRANDDIA2</span>
          </div>

          {/* Light/Dark slider */}
          <div className="flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] py-1 md:py-1.5 px-2.5 rounded-full shadow-sm">
            <div 
              onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
              className="relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 select-none transition-all duration-300"
              title="Slide to change Mode (Light / Dark)"
            >
              <div 
                className={`w-5 h-5 rounded-full bg-[var(--accent-color)] shadow-md transition-all duration-350 ease-out flex items-center justify-center text-[10px] transform ${
                  mode === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {mode === 'dark' ? '🌙' : '☀️'}
              </div>
            </div>
          </div>

          {/* Theme capsule */}
          <div className="border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <div className="flex items-center gap-1.5">
              {[
                { key: 'cyborg', color: 'bg-green-500 border-green-300 shadow-[0_0_5px_green]', tooltip: 'Cyborg Theme' },
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
        </div>

      </nav>

      {/* ALT LINKS BAR */}
      <section className="bg-[var(--bg-secondary)] border-b border-[var(--card-border)] py-3 px-4 md:px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="text-[10px] font-mono tracking-widest uppercase opacity-60 self-center">
              ALT LINKS
            </div>
            <div className="flex flex-wrap gap-2">
              {altLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-[var(--card-bg)] border border-[var(--card-border)] py-1.5 px-3 rounded-full hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all duration-200 font-mono shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <span>{idx + 1}</span>
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              const win = window.open("about:blank", "_blank");
              if (!win) {
                alert("Popup blocked! Please allow popups to open the site in about:blank.");
                return;
              }
              win.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Home - Classroom</title>
                  <link rel="icon" type="image/png" href="https://ssl.gstatic.com/classroom/favicon.png">
                  <meta charset="utf-8">
                  <style>
                    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #0c0a09; }
                    iframe { width: 100vw; height: 100vh; border: none; display: block; }
                  </style>
                </head>
                <body>
                  <iframe src="${window.location.origin}${window.location.pathname}${window.location.search}" allow="fullscreen" referrerpolicy="no-referrer"></iframe>
                </body>
                </html>
              `);
              win.document.close();
            }}
            className="text-xs bg-[var(--accent-color)] text-[var(--bg-color)] border border-[var(--accent-color)] py-1.5 px-3.5 rounded-full hover:opacity-90 active:scale-98 transition-all duration-200 font-mono font-bold shadow-[0_2px_8px_var(--accent-shadow)] flex items-center gap-1.5 cursor-pointer md:ml-auto"
            title="Open entire site inside about:blank tab to cloak history"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>CLOAK IN ABOUT:BLANK</span>
          </button>
        </div>
      </section>

      {/* MAIN CONTAINER: SIDEBAR + GAMES */}
      <div className="flex-1 flex flex-col md:flex-row max-w-8xl w-full mx-auto p-4 md:p-6 gap-6 self-center">
        
        {/* LEFT NAV PANEL - CAT SIDEBAR */}
        <aside className={`transition-all duration-300 ease-in-out shrink-0 flex flex-col gap-2 overflow-hidden ${
          sidebarOpen ? 'w-full md:w-64' : 'w-full md:w-14'
        }`}>
          
          <div className="flex items-center justify-between px-2 py-1 min-h-[36px]">
            {sidebarOpen ? (
              <span className="text-[10px] font-mono tracking-wider opacity-50 uppercase whitespace-nowrap">
                Browse Portals
              </span>
            ) : (
              <span className="hidden md:inline text-[9px] font-mono tracking-wider opacity-50 uppercase text-center mx-auto font-bold text-[var(--accent-color)]">
                NAV
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--accent-color)] transition-all duration-250 cursor-pointer flex items-center justify-center ml-auto"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 animate-bounce" />}
            </button>
          </div>

          <button
            onClick={() => { setFilter('all'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'all' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Layers className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>All Classrooms</span>
          </button>

          <button
            onClick={() => { setFilter('single'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'single' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Gamepad2 className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Single Player</span>
          </button>

          <button
            onClick={() => { setFilter('multiplayer'); setSelectedGame(null); }}
            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === 'multiplayer' && !selectedGame
                ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold'
                : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80'
            }`}
          >
            <Users className="w-4.5 h-4.5 shrink-0" />
            <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none md:hidden'}`}>Multiplayer</span>
          </button>

        </aside>

        {/* MAIN BODY DISPLAY */}
        <main className="flex-1 min-w-0">
          
          {!selectedGame ? (
            /* LIBRARY LIST VIEW */
            <div className="flex flex-col gap-6">
              
              <div className="flex justify-between items-center border-l-4 border-[var(--accent-color)] pl-3">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-[var(--text-primary)]">
                    {filter === 'all' && 'Games Library'}
                    {filter === 'single' && 'Singleplayer Arcades'}
                    {filter === 'multiplayer' && 'Multiplayer Hub'}
                    {filter === 'favorites' && 'Bookmarked Games'}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Showing {filteredGames.length} unblocked resources
                  </p>
                </div>
              </div>

              {filteredGames.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--card-border)] rounded-2xl bg-[var(--bg-secondary)]">
                  <Gamepad2 className="w-16 h-16 text-[var(--text-muted)] stroke-1 opacity-40 animate-pulse" />
                  <p className="text-sm font-semibold mt-4 text-[var(--text-primary)]">No games found matches filter</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Try searching a different keyword or resetting filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGames.map(game => {
                    const isFav = favorites.includes(game.id);
                    return (
                      <div 
                        key={game.id}
                        onClick={() => { setSelectedGame(game); setZoom(1); }}
                        className="custom-card flex flex-col rounded-xl overflow-hidden cursor-pointer h-[360px]"
                        style={{ contentVisibility: 'auto' }}
                      >
                        {/* Artwork container */}
                        <div className="relative h-48 bg-neutral-950 flex-shrink-0 flex items-center justify-center border-b border-[var(--card-border)] overflow-hidden">
                          {game.thumbnail ? (
                            <img 
                              src={game.thumbnail} 
                              alt={game.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                            />
                          ) : (
                            renderGameArt(game)
                          )}

                          <span className="absolute top-2.5 right-2.5 text-[8px] font-bold uppercase tracking-widest bg-black/75 backdrop-blur-sm text-white border border-white/10 px-2.5 py-0.5 rounded-full inline-block z-10">
                            {game.category}
                          </span>

                          <button
                            onClick={(e) => toggleFavorite(e, game.id)}
                            className="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-black/40 hover:bg-black/80 text-white/90 border border-white/10 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all duration-200"
                            title={isFav ? "Remove Bookmark" : "Add Bookmark"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>

                        {/* Title and descriptions */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h3 className="text-sm font-black text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-color)] leading-snug">
                              {game.title}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                              {game.description}
                            </p>
                          </div>

                          <button
                            onClick={() => { setSelectedGame(game); setZoom(1); }}
                            className="w-full mt-3 border border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-black hover:font-bold hover:shadow-[0_0_12px_calc(var(--accent-color))] text-[11px] font-semibold tracking-wider text-[var(--accent-color)] py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 self-end"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Open Article</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          ) : (
            /* ACTIVE GAME SCREEN */
            <div className="flex flex-col gap-4 animate-fade-in">
              
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-[var(--card-border)] bg-[var(--bg-secondary)] rounded-xl py-3 px-4 gap-3 shadow-inner">
                
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all font-mono py-1.5 px-3.5 rounded-lg text-xs font-bold leading-normal cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Go back</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    {selectedGame.title}
                    <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border border-[var(--card-border)] bg-[var(--bg-color)] text-[var(--accent-color)]">
                      {selectedGame.category}
                    </span>
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
                      Res
                    </button>
                  </div>

                  {/* Reload button */}
                  <button
                    onClick={() => {
                      const iframe = document.getElementById('game-frame');
                      if (iframe) iframe.src = iframe.src;
                    }}
                    className="p-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] rounded-lg text-[var(--text-primary)] transition-all cursor-pointer"
                    title="Reload game frame session"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

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
                    className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-3 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer"
                    title="Toggle Fullscreen Arena"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px] font-bold">FULLSCREEN</span>
                  </button>

                  {/* Open in New Tab button */}
                  <button
                    onClick={() => {
                      const win = window.open("about:blank", "_blank");
                      if (!win) {
                        alert("Popup blocked. Allow popups for this site.");
                        return;
                      }
                      win.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>Home - Classroom</title>
                          <link rel="icon" type="image/png" href="https://ssl.gstatic.com/classroom/favicon.png">
                          <meta charset="utf-8">
                          <style>
                            html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #ffffff; }
                            iframe { width: 100vw; height: 100vh; border: none; display: block; }
                          </style>
                        </head>
                        <body>
                          <iframe src="${selectedGame.url}" allow="fullscreen" referrerpolicy="no-referrer"></iframe>
                        </body>
                        </html>
                      `);
                      win.document.close();
                    }}
                    className="flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-3 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer"
                    title="Open Game in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px] font-bold">OPEN IN NEW TAB</span>
                  </button>

                  {/* Panic Key / Escape to Academic Articles */}
                  <button
                    onClick={() => {
                      setViewModeAndSave('articles');
                      setSelectedGame(null);
                    }}
                    className="flex items-center gap-1.5 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 py-1.5 px-3 rounded-lg text-xs font-mono text-red-500 font-medium transition-all cursor-pointer whitespace-nowrap"
                    title="Panic escape key (or press [ or ] at any time)"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span className="hidden sm:inline text-[10px] font-bold">PANIC ESCAPE ([ or ])</span>
                  </button>

                </div>

              </div>

              {/* Game Viewport Container */}
              <div 
                id="frame-viewport"
                className="w-full h-[65vh] min-h-[420px] rounded-2xl border border-[var(--card-border)] bg-black overflow-hidden relative shadow-lg"
              >
                <div 
                  className="w-full h-full duration-150 transition-transform origin-top-left"
                  style={{ 
                    transform: `scale(${zoom})`,
                    width: `${100 / zoom}%`,
                    height: `${100 / zoom}%`
                  }}
                >
                  <iframe 
                    id="game-frame"
                    src={selectedGame.url} 
                    className="w-full h-full border-none"
                    title={selectedGame.title}
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
