import React, { useState } from 'react';
import { Calendar, Gift, Check, Sparkles, BookOpen, Clock, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface DailyGraceRewardProps {
  onClaimDaily: (amount: number) => void;
  dailyClaimed: boolean;
  streak: number;
}

const WEEK_DROPS = [
  { day: 1, amount: 250, label: 'Day 1' },
  { day: 2, amount: 500, label: 'Day 2' },
  { day: 3, amount: 750, label: 'Day 3' },
  { day: 4, amount: 1000, label: 'Day 4' },
  { day: 5, amount: 1500, label: 'Day 5' },
  { day: 6, amount: 2000, label: 'Day 6' },
  { day: 7, amount: 5000, label: 'Day 7 Jackpot' },
];

export const DailyGraceReward: React.FC<DailyGraceRewardProps> = ({
  onClaimDaily,
  dailyClaimed,
  streak
}) => {
  const [claimed, setClaimed] = useState<boolean>(dailyClaimed);

  const todayIndex = Math.min(streak % 7, 6);
  const todayDrop = WEEK_DROPS[todayIndex];

  const handleClaim = () => {
    if (claimed) return;
    sound.playCashChime();
    sound.playCelebration();
    setClaimed(true);
    onClaimDaily(todayDrop.amount);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* Daily Verse of the Day Card */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <BookOpen className="w-4 h-4" />
            <span>DAILY SCRIPTURE INSPIRATION</span>
          </div>
          <span className="text-xs text-slate-400">
            Philippians 4:19
          </span>
        </div>

        <blockquote className="text-lg sm:text-xl font-serif-biblical text-white italic leading-relaxed">
          "And my God will meet all your needs according to the riches of his glory in Christ Jesus."
        </blockquote>

        <p className="text-xs text-slate-400 leading-relaxed">
          As you test your knowledge and meditate on God’s Holy Word today, remember that every good gift and every perfect blessing comes down from the Father of lights.
        </p>
      </div>

      {/* 7-Day Drop Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-serif-biblical">
              7-Day Grace Cash Calendar
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Log in daily to claim escalating scripture cash rewards directly to your wallet
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400">Current Streak</span>
            <div className="text-base font-bold font-mono text-amber-400">
              {streak} Days Active
            </div>
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {WEEK_DROPS.map((drop, idx) => {
            const isToday = idx === todayIndex;
            const isPast = idx < todayIndex || (isToday && claimed);

            return (
              <div
                key={drop.day}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isToday
                    ? 'bg-amber-500/10 border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                    : isPast
                    ? 'bg-slate-950/70 border-slate-800 text-slate-500'
                    : 'bg-slate-950/40 border-slate-850 text-slate-400'
                }`}
              >
                <div className="text-[11px] font-semibold text-slate-400 mb-1">
                  {drop.label}
                </div>
                <div
                  className={`text-sm font-mono font-bold ${
                    isToday ? 'text-amber-300' : isPast ? 'text-slate-500' : 'text-slate-300'
                  }`}
                >
                  ₦{drop.amount.toLocaleString()}
                </div>

                <div className="mt-2 flex items-center justify-center">
                  {isPast ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : isToday ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">
                      ★
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-600 flex items-center justify-center text-xs">
                      <Clock className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Claim CTA Button */}
        <div className="pt-2">
          <button
            onClick={handleClaim}
            disabled={claimed}
            className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              claimed
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 active:scale-[0.99]'
            }`}
          >
            {claimed ? (
              <>
                <Check className="w-4 h-4" />
                <span>Today's Grace Drop Claimed (₦{todayDrop.amount.toLocaleString()})</span>
              </>
            ) : (
              <>
                <Gift className="w-4 h-4 text-emerald-200" />
                <span>Claim Today's Grace Drop (₦{todayDrop.amount.toLocaleString()} Cash)</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            Resets each midnight. Streak resets if a day is skipped.
          </p>
        </div>

      </div>

    </div>
  );
};
