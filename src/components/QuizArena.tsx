import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Zap,
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Shield,
  Lightbulb,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  Gift
} from 'lucide-react';
import { BibleQuestion, GameMode, QuizCategory } from '../types/quiz';
import { BIBLE_QUESTIONS, CATEGORY_LABELS } from '../data/bibleQuestions';
import { sound } from '../utils/audio';

interface QuizArenaProps {
  onEarnReward: (amount: number, note: string) => void;
  streak: number;
  incrementStreak: () => void;
  resetStreak: () => void;
  onOpenCashout: () => void;
  onOpenReferrals?: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  onEarnReward,
  streak,
  incrementStreak,
  resetStreak,
  onOpenCashout,
  onOpenReferrals
}) => {
  const [mode, setMode] = useState<GameMode>('DAILY_JACKPOT');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('GOSPELS');
  const [gameState, setGameState] = useState<'LOBBY' | 'PLAYING' | 'SUMMARY'>('LOBBY');
  
  const [questions, setQuestions] = useState<BibleQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  
  // Lifelines
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [usedScholarHint, setUsedScholarHint] = useState<boolean>(false);

  // Stats for the current run
  const [sessionCashWon, setSessionCashWon] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Timer loop for Speed Rush
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === 'PLAYING' && mode === 'SPEED_RUSH' && isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, mode, isTimerRunning]);

  const startQuiz = (selectedMode: GameMode, cat?: QuizCategory) => {
    sound.playClick();
    setMode(selectedMode);
    if (cat) setSelectedCategory(cat);

    let deck: BibleQuestion[] = [];
    if (selectedMode === 'CATEGORY_QUEST') {
      deck = BIBLE_QUESTIONS.filter((q) => q.category === (cat || selectedCategory));
      if (deck.length < 5) {
        deck = [...deck, ...BIBLE_QUESTIONS.filter((q) => q.category !== (cat || selectedCategory))];
      }
    } else if (selectedMode === 'DAILY_JACKPOT') {
      // 7 diverse curated questions
      deck = [...BIBLE_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 7);
    } else if (selectedMode === 'SPEED_RUSH') {
      // 10 fast questions
      deck = [...BIBLE_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 10);
      setTimerSeconds(60);
      setIsTimerRunning(true);
    } else {
      // High stakes: 5 questions
      deck = [...BIBLE_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    setQuestions(deck);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setDisabledOptions([]);
    setUsedFiftyFifty(false);
    setShowHint(false);
    setUsedScholarHint(false);
    setSessionCashWon(0);
    setCorrectCount(0);
    setGameState('PLAYING');
  };

  const handleSelectOption = (idx: number) => {
    if (hasAnswered || disabledOptions.includes(idx)) return;
    setSelectedAnswer(idx);
    setHasAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      sound.playCorrect();
      sound.playCashChime();
      incrementStreak();
      
      const earned = 100; // ₦100 earned per game won
      
      setSessionCashWon((prev) => prev + earned);
      setCorrectCount((prev) => prev + 1);
      onEarnReward(earned, `Bible Quiz: ${currentQ.verseReference}`);
    } else {
      sound.playIncorrect();
      resetStreak();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setDisabledOptions([]);
      setShowHint(false);
      setUsedScholarHint(false);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setIsTimerRunning(false);
    sound.playCelebration();
    setGameState('SUMMARY');
  };

  // 50:50 Lifeline
  const handleUseFiftyFifty = () => {
    if (usedFiftyFifty || hasAnswered) return;
    sound.playClick();
    setUsedFiftyFifty(true);
    const currentQ = questions[currentIndex];
    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.correctIndex);
    // Shuffle and pick 2 to disable
    const toDisable = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setDisabledOptions(toDisable);
  };

  // Ask Scholar Lifeline
  const handleUseScholarHint = () => {
    if (usedScholarHint || hasAnswered) return;
    sound.playClick();
    setUsedScholarHint(true);
    setShowHint(true);
  };

  const currentQ = questions[currentIndex];

  // ----------------------------------------------------
  // RENDER: LOBBY
  // ----------------------------------------------------
  if (gameState === 'LOBBY') {
    return (
      <div className="space-y-8 animate-fade-in">
        
        {/* Hero Banner with Generated Asset */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 shadow-xl bg-slate-950">
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/images/bible_quiz_hero_1794455011789.jpg"
              alt="Scripture and Gilded Holy Bible"
              className="w-full h-full object-cover opacity-35"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span>Proverbs 3:13-14</span>
              <span aria-hidden="true">·</span>
              <span>Knowledge Above Silver</span>
              <span aria-hidden="true">·</span>
              <span>Instant Payouts</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif-biblical tracking-tight text-balance leading-tight">
              Test Your Biblical Wisdom, Earn Real Rewards
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Complete Scripture trivia accurately to accumulate cash balances. Withdraw directly to PalmPay, OPay, Moniepoint, or your Nigerian commercial bank via instant NIBSS transfer.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Today's Jackpot:</span>
                <span className="font-mono font-bold text-amber-300">₦10,000 Pool</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Current Streak:</span>
                <span className="font-mono font-bold text-emerald-300">{streak}x Multiplier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Mode Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-serif-biblical">
              Choose Quiz Format
            </h2>
            <div className="text-xs text-slate-400">
              All modes pay verified cash to your Nigerian bank or mobile wallet
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Mode 1: Daily Jackpot */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 hover:border-amber-400/60 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    ₦10,000 Jackpot
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                    Daily Scripture Jackpot
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    7 holy questions spanning Old and New Testaments. Answer without failing to claim the top prize share!
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>7 Questions</span>
                  <span>·</span>
                  <span>No Timer</span>
                  <span>·</span>
                  <span>2 Lifelines</span>
                </div>
              </div>

              <button
                onClick={() => startQuiz('DAILY_JACKPOT')}
                className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <span>Enter Daily Jackpot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mode 2: Speed Rush 60s Blitz */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +₦100 / Won
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                    60-Second Scripture Blitz
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Race the countdown timer! Earn ₦100 on every rapid scripture question answered correctly.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>60 Seconds</span>
                  <span>·</span>
                  <span>Unlimited Answers</span>
                  <span>·</span>
                  <span>+₦100 Per Win</span>
                </div>
              </div>

              <button
                onClick={() => startQuiz('SPEED_RUSH')}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <span>Start 60s Blitz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mode 3: High Stakes Showdown */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    +₦100 / Won
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                    Scripture Showdown
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Advanced scholarship questions from the Prophets and Revelation. Earn ₦100 per correct theological answer.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>5 Scholar Questions</span>
                  <span>·</span>
                  <span>₦100 Payout</span>
                  <span>·</span>
                  <span>Deep Context</span>
                </div>
              </div>

              <button
                onClick={() => startQuiz('HIGH_STAKES')}
                className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-[0.98]"
              >
                <span>Launch Showdown</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Thematic Category Quests */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white font-serif-biblical">
            Thematic Book & Chapter Quests
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.keys(CATEGORY_LABELS) as QuizCategory[]).map((catKey) => {
              const meta = CATEGORY_LABELS[catKey];
              return (
                <button
                  key={catKey}
                  onClick={() => startQuiz('CATEGORY_QUEST', catKey)}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-850 text-left transition-all group flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                      {meta.label}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                      {meta.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Refer a Friend Discovery Callout */}
        {onOpenReferrals && (
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wide">
                  Refer a Friend · 500 Coins Each
                </div>
                <h3 className="text-base font-bold text-white font-serif-biblical">
                  Invite Believers &amp; Both Earn a 500 Coin Bonus
                </h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  Share your unique referral code or enter a friend&apos;s code in the Cash Ledger to credit +500 coins to both accounts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenReferrals();
              }}
              className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 shadow-md"
            >
              <span>Refer a Friend</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: SUMMARY VIEW
  // ----------------------------------------------------
  if (gameState === 'SUMMARY') {
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6 text-center animate-fade-in">
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <div className="text-xs font-mono text-amber-400 tracking-wider uppercase">
              Quiz Round Finished
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-biblical mt-1">
              {accuracy >= 70 ? 'Well Done, Good & Faithful Servant!' : 'Keep Seeking the Word!'}
            </h2>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
              Your biblical answers have been validated and added to your Bible Quiz Earning wallet.
            </p>
          </div>

          {/* Reward Summary Stats */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="text-center">
              <div className="text-[11px] text-slate-400">Cash Won</div>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                +₦{sessionCashWon.toLocaleString()}
              </div>
            </div>
            <div className="text-center border-x border-slate-800">
              <div className="text-[11px] text-slate-400">Accuracy</div>
              <div className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                {accuracy}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-[11px] text-slate-400">Correct</div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {correctCount}/{questions.length}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                setGameState('LOBBY');
              }}
              className="flex-1 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Play Another Quiz
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onOpenCashout();
              }}
              className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              Withdraw to Bank / App
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: ACTIVE PLAY VIEW
  // ----------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* HUD Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-xl text-xs">
        
        {/* Left: Question counter */}
        <div className="flex items-center gap-2 text-slate-300">
          <span className="font-semibold text-white">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">
            {CATEGORY_LABELS[currentQ?.category]?.label || 'General'}
          </span>
        </div>

        {/* Center: Timer if Speed Rush */}
        {mode === 'SPEED_RUSH' && (
          <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>{timerSeconds}s</span>
          </div>
        )}

        {/* Right: Cash Won Meter */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400 hidden sm:inline">Earned:</span>
          <span className="font-bold text-emerald-400 text-sm">
            +₦{sessionCashWon.toLocaleString()}
          </span>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-amber-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
        
        {/* Question Header & Reward Badge */}
        <div className="flex items-start justify-between gap-4">
          <span className="text-xs font-mono text-amber-400 tracking-wider">
            SCRIPTURE KNOWLEDGE TEST
          </span>
          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold shrink-0">
            <span>+₦{currentQ.rewardValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Question Body */}
        <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-biblical leading-snug">
          {currentQ.question}
        </h2>

        {/* Lifeline Controls */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] mr-1">Lifelines:</span>
          <button
            onClick={handleUseFiftyFifty}
            disabled={usedFiftyFifty || hasAnswered}
            className={`px-2.5 py-1 rounded-md border transition-colors ${
              usedFiftyFifty
                ? 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            50:50 Lifeline
          </button>

          <button
            onClick={handleUseScholarHint}
            disabled={usedScholarHint || hasAnswered}
            className={`px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1 ${
              usedScholarHint
                ? 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Scholar Verse Clue</span>
          </button>
        </div>

        {/* Hint Box (if used) */}
        {showHint && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 space-y-1 animate-fade-in">
            <div className="font-semibold flex items-center gap-1.5 text-amber-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Biblical Reference Clue: {currentQ.verseReference}</span>
            </div>
            <p className="italic text-slate-300">
              "{currentQ.scriptureText}"
            </p>
          </div>
        )}

        {/* Answer Options Grid (44px+ touch targets) */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = currentQ.correctIndex === idx;
            const isDisabled = disabledOptions.includes(idx);

            let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800/80 hover:border-slate-700';

            if (hasAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold';
              } else {
                btnStyle = 'opacity-40 bg-slate-950 border-slate-800 text-slate-500';
              }
            } else if (isDisabled) {
              btnStyle = 'opacity-25 cursor-not-allowed line-through bg-slate-950 border-slate-900 text-slate-600';
            }

            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                disabled={hasAnswered || isDisabled}
                onClick={() => handleSelectOption(idx)}
                className={`min-h-[52px] w-full p-3.5 rounded-xl border text-left flex items-center gap-3.5 transition-all active:scale-[0.99] ${btnStyle}`}
              >
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold shrink-0 text-slate-300">
                  {letter}
                </span>
                <span className="text-sm font-medium flex-1">
                  {option}
                </span>
                {hasAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Theological Explanation Drawer (After answering) */}
        {hasAnswered && (
          <div className="pt-4 border-t border-slate-800 space-y-3 animate-fade-in">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {currentQ.verseReference}
                </span>
                <span className="text-[11px] text-slate-500">Holy Scripture Context</span>
              </div>
              <p className="text-xs text-slate-300 italic font-serif">
                "{currentQ.scriptureText}"
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {currentQ.theologicalContext}
              </p>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-colors"
            >
              <span>
                {currentIndex + 1 < questions.length ? 'Next Scripture Question' : 'View Quiz Settlement'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
