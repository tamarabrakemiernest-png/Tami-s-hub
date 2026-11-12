import React, { useState } from 'react';
import { Trophy, Medal, Star, Flame, Award, BookOpen, Search } from 'lucide-react';
import { LeaderboardUser, ReferralAccount } from '../types/quiz';
import { INITIAL_LEADERBOARD } from '../data/initialData';
import { sound } from '../utils/audio';

interface LeaderboardViewProps {
  userBalance: number;
  userStreak: number;
  referralAccounts?: ReferralAccount[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  userBalance,
  userStreak,
  referralAccounts = []
}) => {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'all'>('week');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const users: LeaderboardUser[] = INITIAL_LEADERBOARD.map((user) => {
    const matched = referralAccounts.find((acc) => acc.name === user.username);
    if (matched && matched.coinBalance > user.earnedTotal) {
      return {
        ...user,
        earnedTotal: matched.coinBalance
      };
    }
    return user;
  });

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Trophy className="w-4 h-4" />
            <span>GLOBAL FAITH LEADERBOARD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-biblical">
            Top Scripture Scholars & Earners
          </h2>
          <p className="text-xs text-slate-400">
            Honoring believers who excel in God's Holy Word and redeem cash blessings.
          </p>
        </div>

        {/* User Quick Rank Strip */}
        <div className="bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-xl flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] text-slate-400">Your Standing</div>
            <div className="text-sm font-bold text-white font-serif-biblical">
              Rank #12 <span className="text-xs text-amber-400 font-sans font-normal">(Rising)</span>
            </div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[11px] text-slate-400">Cash Rewards</div>
            <div className="text-sm font-mono font-bold text-emerald-400">
              ₦{userBalance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Timeframe Buttons & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Timeframe Segmented Control (buttons with active state) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => {
              sound.playClick();
              setTimeframe('today');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              timeframe === 'today'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Today's Tourney
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTimeframe('week');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              timeframe === 'week'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTimeframe('all');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              timeframe === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search believer or badge..."
            className="w-full h-9 pl-9 pr-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/80">
          {filtered.map((user) => {
            const isTop3 = user.rank <= 3;
            return (
              <div
                key={user.rank}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
              >
                {/* Left: Rank & Avatar */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      user.rank === 1
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : user.rank === 2
                        ? 'bg-slate-300 text-slate-950 font-bold'
                        : user.rank === 3
                        ? 'bg-amber-700 text-white font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {user.rank}
                  </div>

                  <div className={`w-10 h-10 rounded-full ${user.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 border border-white/10`}>
                    {user.username.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm truncate">
                        {user.username}
                      </span>
                      <span className="text-[11px] text-amber-400/90 hidden sm:inline">
                        · {user.badge}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 italic truncate mt-0.5 font-serif">
                      {user.favoriteVerse}
                    </div>
                  </div>
                </div>

                {/* Right: Earnings & Accuracy */}
                <div className="flex items-center gap-6 shrink-0 text-right">
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-slate-300 flex items-center gap-1 justify-end">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{user.streakDays}d Streak</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {user.accuracyRate}% Accuracy
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                      ₦{user.earnedTotal.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Paid Out
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
