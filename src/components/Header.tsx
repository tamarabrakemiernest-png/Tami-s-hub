import React from 'react';
import { Wallet, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  activeTab: 'quiz' | 'wallet' | 'leaderboard' | 'scholar' | 'daily';
  setActiveTab: (tab: 'quiz' | 'wallet' | 'leaderboard' | 'scholar' | 'daily') => void;
  balance: number;
  onOpenWallet: () => void;
  streak: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  balance,
  onOpenWallet,
  streak
}) => {
  const [soundOn, setSoundOn] = React.useState(sound.isEnabled());

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setSoundOn(newState);
    if (newState) sound.playClick();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('quiz');
          }}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-sm">
            ✝
          </span>
          <span className="font-serif-biblical tracking-wide text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-400 bg-clip-text text-transparent">
            Bible Quiz Earning
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('quiz');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'quiz'
                ? 'text-amber-300 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Bible Quizzes
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('daily');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'daily'
                ? 'text-amber-300 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Daily Grace Drop
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('leaderboard');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'leaderboard'
                ? 'text-amber-300 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Leaderboard
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('scholar');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'scholar'
                ? 'text-amber-300 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            AI Bible Scholar
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('wallet');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'wallet'
                ? 'text-amber-300 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Cash Ledger
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleToggleSound}
            aria-label="Toggle audio effects"
            className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenWallet();
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-950/40 active:scale-[0.98] whitespace-nowrap shrink-0 border border-emerald-400/30"
          >
            <Wallet className="w-4 h-4 text-emerald-100" />
            <span className="font-mono tabular-nums tracking-tight font-bold">
              ₦{balance.toLocaleString()}
            </span>
            <span className="text-xs bg-emerald-700/60 px-1.5 py-0.5 rounded text-emerald-100 hidden sm:inline">
              Withdraw
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
