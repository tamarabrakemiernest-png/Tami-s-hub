import React from 'react';
import { BookOpen, Gift, Trophy, Sparkles, Wallet } from 'lucide-react';
import { sound } from '../utils/audio';

interface BottomNavProps {
  activeTab: 'quiz' | 'wallet' | 'leaderboard' | 'scholar' | 'daily';
  setActiveTab: (tab: 'quiz' | 'wallet' | 'leaderboard' | 'scholar' | 'daily') => void;
  onOpenWallet: () => void;
  balance: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenWallet,
  balance
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-slate-400">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        
        {/* Tab 1: Quiz */}
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('quiz');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'quiz' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Quiz</span>
        </button>

        {/* Tab 2: Daily */}
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('daily');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'daily' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Daily</span>
        </button>

        {/* Tab 3: Leaderboard */}
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('leaderboard');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'leaderboard' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Faith Top</span>
        </button>

        {/* Tab 4: Scholar */}
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('scholar');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'scholar' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Scholar</span>
        </button>

        {/* Tab 5: Wallet / Cash Out */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenWallet();
          }}
          className="flex flex-col items-center justify-center min-h-[44px] text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-mono font-bold tracking-tight mt-1">
            ₦{balance.toLocaleString()}
          </span>
        </button>

      </div>
    </nav>
  );
};
