import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Gamepad2,
  Layers,
  Plus,
  RotateCcw,
  Shuffle,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { BUILTIN_QUIZZES } from '../data/studyData';

const CUSTOM_QUIZZES_STORAGE_KEY = 'urnperiodic_custom_quizzes_v1';

function loadCustomQuizzes() {
  try {
    const raw = localStorage.getItem(CUSTOM_QUIZZES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function QuizWorkspace({
  refArticle = null,
  onGeneratedSuccess = null,
  mode = 'light',
}) {
  const isLight = mode === 'light';
  const [customQuizzes, setCustomQuizzes] = useState(() => loadCustomQuizzes());

  const mixedChallenge = useMemo(() => {
    const combined = BUILTIN_QUIZZES.flatMap((q) =>
      q.questions.slice(0, 2).map((item) => ({ ...item, sourceSubject: q.subject })),
    );
    return {
      id: 'quiz-mixed',
      title: 'All-Subjects Mixed Review',
      subject: 'Mixed',
      description: 'Cross-subject review combining Science, Math, History, ELA, and Italian.',
      questions: combined,
    };
  }, []);

  const allQuizzes = useMemo(() => {
    const articleMatchId = refArticle?.category
      ? BUILTIN_QUIZZES.find(
          (q) => q.subject.toLowerCase() === String(refArticle.category).toLowerCase(),
        )?.id
      : null;
    const orderedBuiltIns = [...BUILTIN_QUIZZES];
    if (articleMatchId) {
      orderedBuiltIns.sort((a, b) => (a.id === articleMatchId ? -1 : b.id === articleMatchId ? 1 : 0));
    }
    return [...customQuizzes, ...orderedBuiltIns, mixedChallenge];
  }, [customQuizzes, mixedChallenge, refArticle?.category]);

  const [selectedQuizId, setSelectedQuizId] = useState(() => allQuizzes[0]?.id || 'quiz-science');
  const [instantFeedback, setInstantFeedback] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);

  // Active quiz session state
  const [questionPool, setQuestionPool] = useState(null); // optional subset (shuffled or missed)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({}); // questionId -> chosen option index
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Custom quiz builder state
  const [showBuilder, setShowBuilder] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSubject, setDraftSubject] = useState('Custom');
  const [draftPrompt, setDraftPrompt] = useState('');
  const [draftOptions, setDraftOptions] = useState(['', '', '', '']);
  const [draftCorrect, setDraftCorrect] = useState(0);
  const [draftExplanation, setDraftExplanation] = useState('');
  const [draftQuestions, setDraftQuestions] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_QUIZZES_STORAGE_KEY, JSON.stringify(customQuizzes));
    } catch {}
  }, [customQuizzes]);

  const activeQuiz = useMemo(
    () => allQuizzes.find((q) => q.id === selectedQuizId) || allQuizzes[0],
    [allQuizzes, selectedQuizId],
  );

  const activeQuestions = useMemo(() => {
    if (questionPool && questionPool.quizId === activeQuiz?.id) {
      return questionPool.items;
    }
    return activeQuiz?.questions || [];
  }, [activeQuiz, questionPool]);

  const currentQuestion = activeQuestions[currentIndex] || null;

  const startQuiz = (quizId = activeQuiz?.id, customList = null, shouldShuffle = shuffleQuestions) => {
    const target = allQuizzes.find((q) => q.id === quizId) || activeQuiz;
    if (!target) return;
    let items = customList ? [...customList] : [...target.questions];
    if (shouldShuffle && items.length > 1) {
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
    }
    setSelectedQuizId(target.id);
    setQuestionPool({ quizId: target.id, items });
    setCurrentIndex(0);
    setAnswersMap({});
    setIsFinished(false);
    setStreak(0);
    setBestStreak(0);
    setShowBuilder(false);
  };

  const handleSelectOption = (optionIdx) => {
    if (!currentQuestion || isFinished) return;
    if (instantFeedback && answersMap[currentQuestion.id] !== undefined) return;

    const alreadyAnswered = answersMap[currentQuestion.id] !== undefined;
    setAnswersMap((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));

    if (!alreadyAnswered) {
      if (optionIdx === currentQuestion.correctIndex) {
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
      } else {
        setStreak(0);
      }
    }
  };

  const handleAdvance = () => {
    if (currentIndex + 1 >= activeQuestions.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const scoreSummary = useMemo(() => {
    const total = activeQuestions.length;
    let correct = 0;
    const missed = [];
    activeQuestions.forEach((q) => {
      if (answersMap[q.id] === q.correctIndex) {
        correct += 1;
      } else {
        missed.push(q);
      }
    });
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'Needs Review';
    return { total, correct, missed, pct, grade };
  }, [activeQuestions, answersMap]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (showBuilder || isFinished || !currentQuestion) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        if (currentQuestion.options[idx] !== undefined) {
          handleSelectOption(idx);
        }
      } else if (e.key === 'Enter' && answersMap[currentQuestion.id] !== undefined) {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handleAddDraftQuestion = (e) => {
    e.preventDefault();
    const prompt = draftPrompt.trim();
    const cleanedOpts = draftOptions.map((o) => o.trim());
    if (!prompt || cleanedOpts.some((o) => !o)) return;
    setDraftQuestions((prev) => [
      ...prev,
      {
        id: `cq-${Date.now()}-${prev.length}`,
        prompt,
        options: cleanedOpts,
        correctIndex: draftCorrect,
        explanation: draftExplanation.trim() || 'Custom answer key.',
      },
    ]);
    setDraftPrompt('');
    setDraftOptions(['', '', '', '']);
    setDraftCorrect(0);
    setDraftExplanation('');
  };

  const handleSaveCustomQuiz = () => {
    const title = draftTitle.trim();
    if (!title || draftQuestions.length === 0) return;
    const created = {
      id: `custom-quiz-${Date.now()}`,
      title,
      subject: draftSubject.trim() || 'Custom',
      description: `${draftQuestions.length} custom question${draftQuestions.length === 1 ? '' : 's'} saved locally.`,
      isCustom: true,
      questions: draftQuestions,
    };
    setCustomQuizzes((prev) => [created, ...prev]);
    setDraftTitle('');
    setDraftQuestions([]);
    setShowBuilder(false);
    setSelectedQuizId(created.id);
    setQuestionPool({ quizId: created.id, items: created.questions });
    setCurrentIndex(0);
    setAnswersMap({});
    setIsFinished(false);
  };

  const handleDeleteCustomQuiz = (quizId) => {
    setCustomQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    if (selectedQuizId === quizId) {
      startQuiz(BUILTIN_QUIZZES[0].id, BUILTIN_QUIZZES[0].questions, false);
    }
  };

  return (
    <div
      id="quiz-workspace"
      className="w-full h-full flex flex-col lg:flex-row bg-[var(--bg-color)] text-[var(--text-primary)] overflow-hidden select-none"
    >
      {/* Left Quiz Selector */}
      <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] bg-[var(--bg-secondary)] p-3.5 flex flex-col gap-3 max-h-56 lg:max-h-none overflow-y-auto">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] flex items-center justify-center">
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider">Practice Quizzes</h2>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">{allQuizzes.length} tests ready</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowBuilder((v) => !v)}
            className="px-2.5 py-1 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:opacity-90"
          >
            <Plus className="w-3 h-3" />
            <span>Create</span>
          </button>
        </div>

        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
          {allQuizzes.map((quiz) => {
            const isSelected = !showBuilder && quiz.id === activeQuiz?.id;
            return (
              <div
                key={quiz.id}
                onClick={() => startQuiz(quiz.id, quiz.questions, shuffleQuestions)}
                className={`min-w-[205px] lg:min-w-0 p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'bg-[var(--accent-color)]/15 border-[var(--accent-color)] shadow-sm'
                    : 'bg-[var(--card-bg)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)]">
                      {quiz.subject}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--text-muted)]">
                      {quiz.questions.length} Qs
                    </span>
                  </div>
                  <div className="text-xs font-bold mt-1 line-clamp-1">{quiz.title}</div>
                </div>
                {quiz.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustomQuiz(quiz.id);
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/15 shrink-0 cursor-pointer"
                    title="Delete custom quiz"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Quiz Area */}
      <main className="flex-1 min-w-0 min-h-0 flex flex-col p-4 md:p-6 overflow-y-auto gap-4">
        {showBuilder ? (
          <div className="max-w-2xl w-full mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <div>
                <h1 className="text-base font-black">Create Custom Practice Quiz</h1>
                <p className="text-xs text-[var(--text-muted)]">
                  Add multiple-choice questions and save locally for anytime review.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBuilder(false)}
                className="p-1.5 rounded-lg border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="Quiz title (e.g. Unit 3 Bio Test)"
                className="sm:col-span-2 px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] text-xs font-semibold outline-none focus:border-[var(--accent-color)]"
              />
              <input
                type="text"
                value={draftSubject}
                onChange={(e) => setDraftSubject(e.target.value)}
                placeholder="Subject"
                className="px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] text-xs outline-none focus:border-[var(--accent-color)]"
              />
            </div>

            <form
              onSubmit={handleAddDraftQuestion}
              className="p-4 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-secondary)] space-y-3"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">
                Add Question ({draftQuestions.length} added)
              </div>
              <input
                type="text"
                required
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                placeholder="Question prompt..."
                className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs outline-none focus:border-[var(--accent-color)]"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {draftOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="draftCorrect"
                      checked={draftCorrect === idx}
                      onChange={() => setDraftCorrect(idx)}
                      title="Mark as correct option"
                      className="cursor-pointer accent-[var(--accent-color)]"
                    />
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) =>
                        setDraftOptions((prev) => prev.map((v, i) => (i === idx ? e.target.value : v)))
                      }
                      placeholder={`Option ${idx + 1}${draftCorrect === idx ? ' (Correct)' : ''}`}
                      className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-xs outline-none focus:border-[var(--accent-color)]"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={draftExplanation}
                  onChange={(e) => setDraftExplanation(e.target.value)}
                  placeholder="Optional explanation shown after answering..."
                  className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-xs outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-bold cursor-pointer"
                >
                  + Add Question
                </button>
              </div>
            </form>

            {draftQuestions.length > 0 && (
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10">
                <span className="text-xs font-bold text-emerald-500">
                  {draftQuestions.length} question{draftQuestions.length === 1 ? '' : 's'} ready to publish
                </span>
                <button
                  type="button"
                  disabled={!draftTitle.trim()}
                  onClick={handleSaveCustomQuiz}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black uppercase cursor-pointer"
                >
                  Save &amp; Start Quiz
                </button>
              </div>
            )}
          </div>
        ) : activeQuiz ? (
          <>
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--card-border)]">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30">
                    {activeQuiz.subject}
                  </span>
                  <h1 className="text-base font-extrabold truncate">{activeQuiz.title}</h1>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{activeQuiz.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setInstantFeedback((v) => !v)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-semibold cursor-pointer ${
                    instantFeedback
                      ? 'bg-[var(--accent-color)]/15 border-[var(--accent-color)] text-[var(--accent-color)]'
                      : 'border-[var(--card-border)] bg-[var(--bg-secondary)]'
                  }`}
                >
                  {instantFeedback ? 'Mode: Study (Instant)' : 'Mode: Exam'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = !shuffleQuestions;
                    setShuffleQuestions(next);
                    startQuiz(activeQuiz.id, activeQuiz.questions, next);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-semibold flex items-center gap-1 cursor-pointer ${
                    shuffleQuestions
                      ? 'bg-[var(--accent-color)]/15 border-[var(--accent-color)] text-[var(--accent-color)]'
                      : 'border-[var(--card-border)] bg-[var(--bg-secondary)]'
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle</span>
                </button>
                <button
                  type="button"
                  onClick={() => startQuiz(activeQuiz.id, activeQuiz.questions, shuffleQuestions)}
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[11px] font-mono font-semibold flex items-center gap-1 cursor-pointer hover:border-[var(--accent-color)]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
                {onGeneratedSuccess && (
                  <button
                    type="button"
                    onClick={() => onGeneratedSuccess('flashcards')}
                    className="px-2.5 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[11px] font-mono font-semibold flex items-center gap-1 cursor-pointer hover:border-[var(--accent-color)]"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Flashcards</span>
                  </button>
                )}
              </div>
            </div>

            {isFinished ? (
              <div className="max-w-2xl w-full mx-auto space-y-4 py-2">
                <div className="p-6 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--accent-color)] font-bold">
                      <Award className="w-4 h-4" />
                      <span>Quiz Complete</span>
                    </div>
                    <div className="text-2xl font-black">
                      {scoreSummary.correct} / {scoreSummary.total} Correct ({scoreSummary.pct}%)
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      Grade: <strong>{scoreSummary.grade}</strong> • Best Streak: {bestStreak} in a row
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scoreSummary.missed.length > 0 && (
                      <button
                        type="button"
                        onClick={() => startQuiz(activeQuiz.id, scoreSummary.missed, false)}
                        className="px-3.5 py-2 rounded-xl border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 text-xs font-bold cursor-pointer"
                      >
                        Retry Missed ({scoreSummary.missed.length})
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => startQuiz(activeQuiz.id, activeQuiz.questions, shuffleQuestions)}
                      className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-black uppercase cursor-pointer"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>

                {/* Question Review */}
                <div className="space-y-2.5 pb-4">
                  {activeQuestions.map((q, idx) => {
                    const chosen = answersMap[q.id];
                    const isCorrect = chosen === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border space-y-2 select-text ${
                          isCorrect
                            ? 'border-emerald-500/35 bg-emerald-500/10'
                            : 'border-rose-500/35 bg-rose-500/10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold">
                            {idx + 1}. {q.prompt}
                          </span>
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs space-y-0.5">
                          {!isCorrect && (
                            <div className="text-rose-500">
                              Your answer: {chosen !== undefined ? q.options[chosen] : 'Skipped'}
                            </div>
                          )}
                          <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Correct answer: {q.options[q.correctIndex]}
                          </div>
                          {q.explanation && (
                            <div className="text-[11px] text-[var(--text-muted)] pt-1">{q.explanation}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : currentQuestion ? (
              <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-center gap-4 py-2">
                {/* Progress Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                    <span>
                      Question {currentIndex + 1} of {activeQuestions.length}
                    </span>
                    <span>Streak: {streak} 🔥</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--card-border)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-color)] transition-all duration-300"
                      style={{
                        width: `${Math.round(((currentIndex + 1) / Math.max(1, activeQuestions.length)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <div
                  className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-md select-text ${
                    isLight ? 'bg-white border-neutral-200' : 'bg-[var(--card-bg)] border-[var(--card-border)]'
                  }`}
                >
                  <h2 className="text-base sm:text-lg font-extrabold leading-snug">
                    {currentQuestion.prompt}
                  </h2>

                  <div className="space-y-2">
                    {currentQuestion.options.map((opt, idx) => {
                      const chosen = answersMap[currentQuestion.id];
                      const hasAnswered = chosen !== undefined;
                      const isChosen = chosen === idx;
                      const isRight = idx === currentQuestion.correctIndex;

                      let styleClass =
                        'border-[var(--card-border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]';
                      if (hasAnswered && instantFeedback) {
                        if (isRight) {
                          styleClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold';
                        } else if (isChosen) {
                          styleClass = 'border-rose-500 bg-rose-500/15 text-rose-500';
                        }
                      } else if (isChosen) {
                        styleClass = 'border-[var(--accent-color)] bg-[var(--accent-color)]/15 font-bold';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 transition-all cursor-pointer ${styleClass}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-lg border border-current/25 flex items-center justify-center text-[11px] font-mono font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="break-words">{opt}</span>
                          </div>
                          {hasAnswered && instantFeedback && isRight && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                          {hasAnswered && instantFeedback && isChosen && !isRight && (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {instantFeedback && answersMap[currentQuestion.id] !== undefined && currentQuestion.explanation && (
                    <div className="p-3 rounded-xl border border-[var(--accent-color)]/30 bg-[var(--accent-color)]/10 text-xs leading-relaxed">
                      <strong>Explanation:</strong> {currentQuestion.explanation}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      Keys 1–4 to choose • Enter for next
                    </span>
                    <button
                      type="button"
                      disabled={answersMap[currentQuestion.id] === undefined}
                      onClick={handleAdvance}
                      className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] disabled:opacity-40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{currentIndex + 1 >= activeQuestions.length ? 'Finish Quiz' : 'Next Question'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  );
}
