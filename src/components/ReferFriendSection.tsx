import React, { useState, useEffect } from 'react';
import {
  Gift,
  Copy,
  Check,
  RefreshCw,
  UserPlus,
  Users,
  Coins,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Link2
} from 'lucide-react';
import { ReferralAccount, ReferralEvent } from '../types/quiz';
import { REFERRAL_BONUS_COINS } from '../utils/referrals';
import { sound } from '../utils/audio';

interface ReferFriendSectionProps {
  myCode: string;
  redeemedCode: string | null;
  redeemedByReferrerName: string | null;
  accounts: ReferralAccount[];
  events: ReferralEvent[];
  userBalance: number;
  initialPrefillCode?: string;
  onRegenerateCode: () => void;
  onRedeemCode: (code: string) => { success: boolean; message: string; referrerName?: string };
  onSimulateFriendSignup: (
    friendName: string,
    code: string
  ) => { success: boolean; message: string; newUserBalance?: number };
}

export const ReferFriendSection: React.FC<ReferFriendSectionProps> = ({
  myCode,
  redeemedCode,
  redeemedByReferrerName,
  accounts,
  events,
  userBalance,
  initialPrefillCode = '',
  onRegenerateCode,
  onRedeemCode,
  onSimulateFriendSignup
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [codeInput, setCodeInput] = useState(initialPrefillCode);
  const [redeemFeedback, setRedeemFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [showFriendTester, setShowFriendTester] = useState(false);
  const [friendName, setFriendName] = useState('Esther_Grace');
  const [friendCodeInput, setFriendCodeInput] = useState(myCode);
  const [friendFeedback, setFriendFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    setFriendCodeInput(myCode);
  }, [myCode]);

  useEffect(() => {
    if (initialPrefillCode) {
      setCodeInput(initialPrefillCode);
    }
  }, [initialPrefillCode]);

  const inviteLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?ref=${myCode}`
      : `https://biblequizearning.app/?ref=${myCode}`;

  const myReferralEvents = events.filter((ev) => ev.referrerId === 'current_user');
  const totalReferralCoinsEarned =
    myReferralEvents.length * REFERRAL_BONUS_COINS +
    (redeemedCode ? REFERRAL_BONUS_COINS : 0);

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard?.writeText(myCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard?.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const res = onRedeemCode(codeInput);
    if (res.success) {
      sound.playCashChime();
      sound.playCelebration();
      setRedeemFeedback({ type: 'success', text: res.message });
      setCodeInput('');
    } else {
      sound.playIncorrect();
      setRedeemFeedback({ type: 'error', text: res.message });
    }
  };

  const handleFriendTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const res = onSimulateFriendSignup(friendName, friendCodeInput);
    if (res.success) {
      sound.playCashChime();
      sound.playCelebration();
      setFriendFeedback({ type: 'success', text: res.message });
      setFriendName('');
    } else {
      sound.playIncorrect();
      setFriendFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Refer a Friend Container */}
      <div className="bg-slate-900/95 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Gift className="w-4 h-4" />
              <span>REFER A FRIEND · DUAL 500 COIN BONUS</span>
            </div>
            <h3 className="text-xl font-bold text-white font-serif-biblical">
              Share Your Unique Code & Earn 500 Coins Together
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Every time a new believer enters your unique referral code, both you (the referrer) and your friend immediately receive a{' '}
              <span className="text-emerald-400 font-semibold">500 coin bonus</span>{' '}
              credited directly to your wallets.
            </p>
          </div>

          {/* Referral KPI Summary */}
          <div className="flex items-center gap-5 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl shrink-0">
            <div>
              <div className="text-[11px] text-slate-400">Friends Referred</div>
              <div className="text-lg font-bold font-mono text-white tabular-nums">
                {myReferralEvents.length}
              </div>
            </div>
            <div className="border-l border-slate-800 pl-5">
              <div className="text-[11px] text-slate-400">Referral Coins Won</div>
              <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                +{totalReferralCoinsEarned.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Action Grid: Left = Share Your Code, Right = Enter a Referral Code */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Column 1: Your Unique Referral Code */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Your Unique Referral Code
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onRegenerateCode();
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-medium transition-colors whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Code</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-12 px-4 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-between">
                  <span className="font-mono text-lg font-bold tracking-wider text-amber-300 select-all">
                    {myCode}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    +500 Coins
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="h-12 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-md"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <span className="text-slate-400 truncate font-mono text-[11px]">
                  {inviteLink}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-slate-300 hover:text-white flex items-center gap-1 font-medium whitespace-nowrap shrink-0 underline underline-offset-4"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Copy Invite Link'}</span>
                </button>
              </div>
            </div>

            {/* Interactive New Friend Simulator Toggle */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Want to verify your code awards both accounts 500 coins?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowFriendTester((prev) => !prev);
                    setFriendFeedback(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{showFriendTester ? 'Close Tester' : 'Test Friend Signup'}</span>
                </button>
              </div>

              {showFriendTester && (
                <form
                  onSubmit={handleFriendTestSubmit}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3"
                >
                  <div className="text-xs font-semibold text-white">
                    Simulate New Friend Entering Your Code
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        New Friend Username
                      </label>
                      <input
                        type="text"
                        required
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                        placeholder="e.g. Esther_Grace"
                        className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Referral Code Entered
                      </label>
                      <input
                        type="text"
                        required
                        value={friendCodeInput}
                        onChange={(e) => setFriendCodeInput(e.target.value.toUpperCase())}
                        placeholder="BQE-XXXX-XX"
                        className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Join as New Friend (+500 Coins Each)</span>
                  </button>
                  {friendFeedback && (
                    <div
                      className={`p-2.5 rounded-lg text-xs flex items-start gap-2 ${
                        friendFeedback.type === 'success'
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                      }`}
                    >
                      {friendFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      <span>{friendFeedback.text}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Enter a Referral Code (New User Redemption) */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Enter a Referral Code
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +500 Coin Bonus
                </span>
              </div>

              {redeemedCode ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Referral Bonus Claimed</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    You redeemed code <span className="font-mono font-bold text-amber-300">{redeemedCode}</span>. Both you and{' '}
                    <span className="font-semibold text-white">{redeemedByReferrerName}</span> received a{' '}
                    <span className="font-mono font-bold text-emerald-400">+500 coin</span> bonus!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRedeemSubmit} className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Have a friend's invite code? Enter it below to unlock 500 bonus coins for both you and your referrer.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) => {
                        setCodeInput(e.target.value.toUpperCase());
                        if (redeemFeedback) setRedeemFeedback(null);
                      }}
                      placeholder="Enter code (e.g. PRISCILLA-777)"
                      className="flex-1 h-12 px-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-mono uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="h-12 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-md"
                    >
                      <span>Redeem</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {redeemFeedback && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                        redeemFeedback.type === 'success'
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                      }`}
                    >
                      {redeemFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      <span>{redeemFeedback.text}</span>
                    </div>
                  )}

                  {/* Quick-fill valid community codes for testing */}
                  <div className="pt-1 space-y-1.5">
                    <div className="text-[11px] text-slate-500">
                      Valid community referrer codes you can try:
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {accounts.slice(0, 3).map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setCodeInput(acc.code);
                            setRedeemFeedback(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 font-mono text-[11px] transition-colors whitespace-nowrap"
                        >
                          {acc.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Current Wallet Coins</span>
              <span className="font-mono font-bold text-white tabular-nums">
                {userBalance.toLocaleString()} Coins (₦{userBalance.toLocaleString()})
              </span>
            </div>
          </div>
        </div>

        {/* Dual-Bonus Referral Ledger */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Verified Referral Bonus Activity</span>
            </h4>
            <span className="text-xs text-slate-500">
              500 Coins to Referrer · 500 Coins to New User
            </span>
          </div>

          {events.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-500 text-center">
              No referral bonuses claimed yet. Enter a friend's referral code or test your code above to award 500 coins to both accounts.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80 bg-slate-950/50 rounded-xl border border-slate-800">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>Code:</span>
                      <span className="font-mono text-amber-300">{ev.codeUsed}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 font-normal">{ev.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Referrer: <span className="text-slate-200 font-medium">{ev.referrerName}</span> · New User:{' '}
                      <span className="text-slate-200 font-medium">{ev.newUserName}</span>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-emerald-400 tabular-nums shrink-0">
                    +{ev.referrerBonus} Referrer / +{ev.newUserBonus} New User Coins
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
