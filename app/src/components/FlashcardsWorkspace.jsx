import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  List,
  Plus,
  RotateCcw,
  Shuffle,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { BUILTIN_FLASHCARD_DECKS, extractCardsFromArticle } from '../data/studyData';

const CUSTOM_DECKS_STORAGE_KEY = 'urnperiodic_flashcard_decks_v1';
const MASTERY_STORAGE_KEY = 'urnperiodic_flashcard_mastery_v1';

function loadSavedJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function FlashcardsWorkspace({
  refArticle = null,
  onGeneratedSuccess = null,
  mode = 'light',
}) {
  const isLight = mode === 'light';

  const [customDecks, setCustomDecks] = useState(() =>
    loadSavedJson(CUSTOM_DECKS_STORAGE_KEY, []),
  );
  const [masteredMap, setMasteredMap] = useState(() =>
    loadSavedJson(MASTERY_STORAGE_KEY, {}),
  );

  const articleDeck = useMemo(() => {
    const cards = extractCardsFromArticle(refArticle);
    if (!refArticle || cards.length === 0) return null;
    return {
      id: `article-${refArticle.id}`,
      title: `Article: ${refArticle.title}`,
      subject: refArticle.category || 'Study Guide',
      description: 'Terms extracted automatically from the active study guide.',
      cards,
      isDynamic: true,
    };
  }, [refArticle]);

  const allDecks = useMemo(() => {
    const list = [];
    if (articleDeck) list.push(articleDeck);
    return [...list, ...customDecks, ...BUILTIN_FLASHCARD_DECKS];
  }, [articleDeck, customDecks]);

  const [selectedDeckId, setSelectedDeckId] = useState(() => allDecks[0]?.id || 'deck-biology');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swapSides, setSwapSides] = useState(false);
  const [onlyNeedsReview, setOnlyNeedsReview] = useState(false);
  const [viewType, setViewType] = useState('cards'); // 'cards' | 'list'
  const [shuffledOrder, setShuffledOrder] = useState(null);

  // Create deck & add card UI state
  const [showNewDeckForm, setShowNewDeckForm] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckSubject, setNewDeckSubject] = useState('General');
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newDef, setNewDef] = useState('');
  const [newHint, setNewHint] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_DECKS_STORAGE_KEY, JSON.stringify(customDecks));
    } catch {}
  }, [customDecks]);

  useEffect(() => {
    try {
      localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(masteredMap));
    } catch {}
  }, [masteredMap]);

  const activeDeck = useMemo(
    () => allDecks.find((d) => d.id === selectedDeckId) || allDecks[0],
    [allDecks, selectedDeckId],
  );

  const visibleCards = useMemo(() => {
    const base = activeDeck?.cards || [];
    const filtered = onlyNeedsReview ? base.filter((c) => !masteredMap[c.id]) : base;
    if (shuffledOrder && shuffledOrder.deckId === activeDeck?.id) {
      const byId = new Map(filtered.map((c) => [c.id, c]));
      const ordered = shuffledOrder.ids.map((id) => byId.get(id)).filter(Boolean);
      const remaining = filtered.filter((c) => !shuffledOrder.ids.includes(c.id));
      return [...ordered, ...remaining];
    }
    return filtered;
  }, [activeDeck, onlyNeedsReview, masteredMap, shuffledOrder]);

  const safeIndex = visibleCards.length > 0 ? Math.min(cardIndex, visibleCards.length - 1) : 0;
  const currentCard = visibleCards[safeIndex] || null;

  const masteredCount = useMemo(() => {
    if (!activeDeck) return 0;
    return activeDeck.cards.filter((c) => Boolean(masteredMap[c.id])).length;
  }, [activeDeck, masteredMap]);

  const selectDeck = (deckId) => {
    setSelectedDeckId(deckId);
    setCardIndex(0);
    setIsFlipped(false);
    setShuffledOrder(null);
    setShowAddCardForm(false);
  };

  const handleNext = () => {
    if (visibleCards.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % visibleCards.length);
  };

  const handlePrev = () => {
    if (visibleCards.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + visibleCards.length) % visibleCards.length);
  };

  const handleShuffle = () => {
    if (!activeDeck || visibleCards.length <= 1) return;
    const ids = visibleCards.map((c) => c.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffledOrder({ deckId: activeDeck.id, ids });
    setCardIndex(0);
    setIsFlipped(false);
  };

  const toggleMastered = (cardId, known) => {
    setMasteredMap((prev) => ({
      ...prev,
      [cardId]: known,
    }));
    if (visibleCards.length > 1) {
      setIsFlipped(false);
      setCardIndex((prev) => (prev + 1) % visibleCards.length);
    }
  };

  const handleResetProgress = () => {
    if (!activeDeck) return;
    setMasteredMap((prev) => {
      const next = { ...prev };
      activeDeck.cards.forEach((c) => delete next[c.id]);
      return next;
    });
    setOnlyNeedsReview(false);
    setCardIndex(0);
    setIsFlipped(false);
  };

  const handleCreateDeck = (e) => {
    e.preventDefault();
    const title = newDeckTitle.trim();
    if (!title) return;
    const created = {
      id: `custom-deck-${Date.now()}`,
      title,
      subject: newDeckSubject.trim() || 'Custom',
      description: 'Custom flashcard deck saved locally.',
      isCustom: true,
      cards: [],
    };
    setCustomDecks((prev) => [created, ...prev]);
    setSelectedDeckId(created.id);
    setNewDeckTitle('');
    setShowNewDeckForm(false);
    setShowAddCardForm(true);
    setCardIndex(0);
    setIsFlipped(false);
  };

  const handleDeleteCustomDeck = (deckId) => {
    setCustomDecks((prev) => prev.filter((d) => d.id !== deckId));
    if (selectedDeckId === deckId) {
      setSelectedDeckId(BUILTIN_FLASHCARD_DECKS[0].id);
      setCardIndex(0);
      setIsFlipped(false);
    }
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const term = newTerm.trim();
    const definition = newDef.trim();
    if (!term || !definition || !activeDeck?.isCustom) return;
    const card = {
      id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      term,
      definition,
      hint: newHint.trim(),
    };
    setCustomDecks((prev) =>
      prev.map((d) => (d.id === activeDeck.id ? { ...d, cards: [...d.cards, card] } : d)),
    );
    setNewTerm('');
    setNewDef('');
    setNewHint('');
    setShowAddCardForm(false);
  };

  const handleDeleteCard = (cardId) => {
    if (!activeDeck?.isCustom) return;
    setCustomDecks((prev) =>
      prev.map((d) =>
        d.id === activeDeck.id ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) } : d,
      ),
    );
    setCardIndex(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (viewType !== 'cards' || !currentCard) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const progressPct =
    activeDeck && activeDeck.cards.length > 0
      ? Math.round((masteredCount / activeDeck.cards.length) * 100)
      : 0;

  return (
    <div
      id="flashcards-workspace"
      className="w-full h-full flex flex-col lg:flex-row bg-[var(--bg-color)] text-[var(--text-primary)] overflow-hidden select-none"
    >
      {/* Left Deck Sidebar */}
      <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] bg-[var(--bg-secondary)] p-3.5 flex flex-col gap-3 max-h-56 lg:max-h-none overflow-y-auto">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider">Flashcard Decks</h2>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">{allDecks.length} available</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowNewDeckForm((v) => !v)}
            className="px-2.5 py-1 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:opacity-90"
          >
            <Plus className="w-3 h-3" />
            <span>New</span>
          </button>
        </div>

        {showNewDeckForm && (
          <form
            onSubmit={handleCreateDeck}
            className="p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] space-y-2"
          >
            <input
              type="text"
              required
              value={newDeckTitle}
              onChange={(e) => setNewDeckTitle(e.target.value)}
              placeholder="Deck title (e.g. Chem Ch. 4)"
              maxLength={60}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] text-xs outline-none focus:border-[var(--accent-color)]"
            />
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newDeckSubject}
                onChange={(e) => setNewDeckSubject(e.target.value)}
                placeholder="Subject"
                maxLength={24}
                className="flex-1 min-w-0 px-2.5 py-1 rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[11px] outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-[10px] font-bold cursor-pointer"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowNewDeckForm(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
          {allDecks.map((deck) => {
            const isSelected = deck.id === activeDeck?.id;
            const deckMastered = deck.cards.filter((c) => Boolean(masteredMap[c.id])).length;
            return (
              <div
                key={deck.id}
                onClick={() => selectDeck(deck.id)}
                className={`min-w-[200px] lg:min-w-0 p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'bg-[var(--accent-color)]/15 border-[var(--accent-color)] shadow-sm'
                    : 'bg-[var(--card-bg)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)]">
                      {deck.subject}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--text-muted)]">
                      {deckMastered}/{deck.cards.length}
                    </span>
                  </div>
                  <div className="text-xs font-bold mt-1 line-clamp-1">{deck.title}</div>
                </div>
                {deck.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustomDeck(deck.id);
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/15 shrink-0 cursor-pointer"
                    title="Delete custom deck"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Flashcard Stage */}
      <main className="flex-1 min-w-0 min-h-0 flex flex-col p-4 md:p-6 overflow-y-auto gap-4">
        {activeDeck && (
          <>
            {/* Top Controls & Mastery Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--card-border)]">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30">
                    {activeDeck.subject}
                  </span>
                  <h1 className="text-base font-extrabold truncate">{activeDeck.title}</h1>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{activeDeck.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                {activeDeck.isCustom && (
                  <button
                    type="button"
                    onClick={() => setShowAddCardForm((v) => !v)}
                    className="px-2.5 py-1.5 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Card</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewType((v) => (v === 'cards' ? 'list' : 'cards'))}
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[11px] font-mono font-semibold flex items-center gap-1.5 cursor-pointer hover:border-[var(--accent-color)]"
                >
                  {viewType === 'cards' ? <List className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                  <span>{viewType === 'cards' ? 'Term List' : 'Flip Cards'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[11px] font-mono font-semibold flex items-center gap-1 cursor-pointer hover:border-[var(--accent-color)]"
                  title="Shuffle cards"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Shuffle</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSwapSides((v) => !v);
                    setIsFlipped(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-semibold cursor-pointer ${
                    swapSides
                      ? 'bg-[var(--accent-color)]/15 border-[var(--accent-color)] text-[var(--accent-color)]'
                      : 'border-[var(--card-border)] bg-[var(--bg-secondary)]'
                  }`}
                >
                  {swapSides ? 'Def First' : 'Term First'}
                </button>
                {onGeneratedSuccess && (
                  <button
                    type="button"
                    onClick={() => onGeneratedSuccess('quiz')}
                    className="px-2.5 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[11px] font-mono font-semibold flex items-center gap-1 cursor-pointer hover:border-[var(--accent-color)]"
                    title="Switch to Quizzes"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Quizzes</span>
                  </button>
                )}
              </div>
            </div>

            {/* Add Custom Card Form */}
            {showAddCardForm && activeDeck.isCustom && (
              <form
                onSubmit={handleAddCard}
                className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] grid grid-cols-1 md:grid-cols-3 gap-2.5"
              >
                <input
                  type="text"
                  required
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="Front term..."
                  className="px-3 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-xs outline-none focus:border-[var(--accent-color)]"
                />
                <input
                  type="text"
                  required
                  value={newDef}
                  onChange={(e) => setNewDef(e.target.value)}
                  placeholder="Back definition..."
                  className="px-3 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-xs outline-none focus:border-[var(--accent-color)]"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    placeholder="Optional hint"
                    className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-xs outline-none focus:border-[var(--accent-color)]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-bold cursor-pointer shrink-0"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Mastery Progress Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5">
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <span className="text-[11px] font-mono font-bold">
                  {masteredCount}/{activeDeck.cards.length} Mastered ({progressPct}%)
                </span>
                <div className="flex-1 max-w-xs h-2 rounded-full bg-[var(--card-border)] overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOnlyNeedsReview((v) => !v);
                    setCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold cursor-pointer ${
                    onlyNeedsReview
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                      : 'border-[var(--card-border)] text-[var(--text-muted)]'
                  }`}
                >
                  {onlyNeedsReview ? 'Showing Needs Review' : 'Filter: Needs Review'}
                </button>
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="px-2.5 py-1 rounded-lg border border-[var(--card-border)] text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {viewType === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                {activeDeck.cards.length === 0 ? (
                  <div className="col-span-full py-12 text-center border border-dashed border-[var(--card-border)] rounded-2xl text-xs text-[var(--text-muted)]">
                    No cards in this deck yet. Click "Add Card" above to add your first term.
                  </div>
                ) : (
                  activeDeck.cards.map((card, idx) => {
                    const isMastered = Boolean(masteredMap[card.id]);
                    return (
                      <div
                        key={card.id}
                        className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] flex flex-col gap-2 select-text"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                            #{idx + 1}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setMasteredMap((prev) => ({ ...prev, [card.id]: !prev[card.id] }))
                              }
                              className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold cursor-pointer ${
                                isMastered
                                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500'
                                  : 'border-[var(--card-border)] text-[var(--text-muted)]'
                              }`}
                            >
                              {isMastered ? 'Mastered' : 'Review'}
                            </button>
                            {activeDeck.isCustom && (
                              <button
                                type="button"
                                onClick={() => handleDeleteCard(card.id)}
                                className="p-1 text-rose-400 hover:bg-rose-500/15 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-extrabold">{card.term}</div>
                        <div className="text-xs text-[var(--text-muted)] leading-relaxed">{card.definition}</div>
                        {card.hint && (
                          <div className="text-[11px] font-mono text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2.5 py-1.5 rounded-lg">
                            Hint: {card.hint}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-2 min-h-[300px]">
                {visibleCards.length === 0 ? (
                  <div className="w-full max-w-xl p-8 rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--bg-secondary)] text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="text-sm font-bold">
                      {activeDeck.cards.length === 0
                        ? 'This custom deck is empty.'
                        : 'You mastered every card in this deck!'}
                    </div>
                    {activeDeck.cards.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setOnlyNeedsReview(false)}
                        className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-bold cursor-pointer"
                      >
                        Show All Cards
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddCardForm(true)}
                        className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-bold cursor-pointer"
                      >
                        Add First Card
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Interactive Flashcard */}
                    <button
                      type="button"
                      onClick={() => setIsFlipped((f) => !f)}
                      className={`w-full max-w-2xl min-h-[260px] sm:min-h-[300px] rounded-3xl border-2 p-6 sm:p-8 flex flex-col justify-between text-left transition-all cursor-pointer shadow-lg select-text ${
                        isFlipped
                          ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10'
                          : isLight
                            ? 'border-neutral-200 bg-white hover:border-[var(--accent-color)]/60'
                            : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent-color)]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full text-[11px] font-mono">
                        <span className="uppercase tracking-wider font-bold text-[var(--accent-color)]">
                          {isFlipped
                            ? swapSides
                              ? 'Term (Answer)'
                              : 'Definition'
                            : swapSides
                              ? 'Definition (Prompt)'
                              : 'Term'}
                        </span>
                        <span className="text-[var(--text-muted)]">
                          Card {safeIndex + 1} of {visibleCards.length} • Click or Space to flip
                        </span>
                      </div>

                      <div className="my-auto py-4 text-center space-y-3">
                        <p className={`${isFlipped ? 'text-base sm:text-lg font-semibold leading-relaxed' : 'text-xl sm:text-2xl font-black tracking-tight'}`}>
                          {isFlipped
                            ? swapSides
                              ? currentCard.term
                              : currentCard.definition
                            : swapSides
                              ? currentCard.definition
                              : currentCard.term}
                        </p>
                        {isFlipped && currentCard.hint && (
                          <p className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-secondary)] inline-block px-3 py-1.5 rounded-lg border border-[var(--card-border)]">
                            Tip: {currentCard.hint}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between w-full text-[10px] font-mono text-[var(--text-muted)]">
                        <span>{masteredMap[currentCard.id] ? 'Status: Mastered' : 'Status: Studying'}</span>
                        <span>Use Left / Right arrows to navigate</span>
                      </div>
                    </button>

                    {/* Navigation & Mastery Controls */}
                    <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-3.5 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Prev</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-3.5 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleMastered(currentCard.id, false)}
                          className="px-3.5 py-2 rounded-xl border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 text-xs font-bold cursor-pointer"
                        >
                          Still Learning
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleMastered(currentCard.id, true)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Got It</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
