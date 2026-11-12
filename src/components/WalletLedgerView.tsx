import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  FileText,
  CreditCard
} from 'lucide-react';
import { ReferralAccount, ReferralEvent, Transaction } from '../types/quiz';
import { ReferFriendSection } from './ReferFriendSection';
import { sound } from '../utils/audio';

interface WalletLedgerViewProps {
  balance: number;
  transactions: Transaction[];
  onOpenCashout: () => void;
  onViewReceipt: (tx: Transaction) => void;
  myReferralCode: string;
  redeemedCode: string | null;
  redeemedByReferrerName: string | null;
  referralAccounts: ReferralAccount[];
  referralEvents: ReferralEvent[];
  initialPrefillCode?: string;
  onRegenerateCode: () => void;
  onRedeemCode: (code: string) => { success: boolean; message: string; referrerName?: string };
  onSimulateFriendSignup: (
    friendName: string,
    code: string
  ) => { success: boolean; message: string; newUserBalance?: number };
}

export const WalletLedgerView: React.FC<WalletLedgerViewProps> = ({
  balance,
  transactions,
  onOpenCashout,
  onViewReceipt,
  myReferralCode,
  redeemedCode,
  redeemedByReferrerName,
  referralAccounts,
  referralEvents,
  initialPrefillCode,
  onRegenerateCode,
  onRedeemCode,
  onSimulateFriendSignup
}) => {
  const [filter, setFilter] = useState<'ALL' | 'REWARDS' | 'PAYOUTS'>('ALL');

  const lifetimeEarned = transactions
    .filter((tx) => tx.type !== 'WITHDRAWAL_PAYOUT')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPaidOut = transactions
    .filter((tx) => tx.type === 'WITHDRAWAL_PAYOUT')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const filteredTx = transactions.filter((tx) => {
    if (filter === 'REWARDS') return tx.type !== 'WITHDRAWAL_PAYOUT';
    if (filter === 'PAYOUTS') return tx.type === 'WITHDRAWAL_PAYOUT';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Main Available Balance */}
        <div className="sm:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-3 relative overflow-hidden">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Available Balance</span>
            <span className="font-mono text-[11px] text-emerald-400">1 Coin = ₦1</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
            ₦{balance.toLocaleString()} <span className="text-sm font-sans font-normal text-emerald-400">NGN</span>
          </div>
          <div className="text-xs text-slate-400 font-mono tabular-nums">
            {balance.toLocaleString()} Coins
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onOpenCashout();
            }}
            className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all active:scale-[0.98]"
          >
            <CreditCard className="w-4 h-4" />
            <span>Withdraw to Bank / App</span>
          </button>
        </div>

        {/* Lifetime Earned */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2 flex flex-col justify-center">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Lifetime Rewards</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 tabular-nums">
            +₦{lifetimeEarned.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            From quizzes, daily drops & referrals
          </div>
        </div>

        {/* Total Settled / Paid Out */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2 flex flex-col justify-center">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
            <span>Settled & Transferred</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-200 tabular-nums">
            ₦{totalPaidOut.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            Dispatched to PalmPay, OPay & Banks
          </div>
        </div>

      </div>

      {/* Interactive Refer a Friend Hub */}
      <ReferFriendSection
        myCode={myReferralCode}
        redeemedCode={redeemedCode}
        redeemedByReferrerName={redeemedByReferrerName}
        accounts={referralAccounts}
        events={referralEvents}
        userBalance={balance}
        initialPrefillCode={initialPrefillCode}
        onRegenerateCode={onRegenerateCode}
        onRedeemCode={onRedeemCode}
        onSimulateFriendSignup={onSimulateFriendSignup}
      />

      {/* Ledger History List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white font-serif-biblical">
              Scripture Reward & Settlement Ledger
            </h3>
            <p className="text-xs text-slate-400">
              Audit trail with verified settlement receipts
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sound.playClick();
                setFilter('ALL');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilter('REWARDS');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'REWARDS'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rewards
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilter('PAYOUTS');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'PAYOUTS'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Payouts
            </button>
          </div>
        </div>

        {/* Transactions list */}
        <div className="divide-y divide-slate-800/80">
          {filteredTx.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No transactions match the selected filter.
            </div>
          ) : (
            filteredTx.map((tx) => {
              const isPayout = tx.type === 'WITHDRAWAL_PAYOUT';
              return (
                <div
                  key={tx.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-850/40 px-2 rounded-xl transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isPayout
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {isPayout ? <ArrowUpRight className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="font-semibold text-white">
                        {tx.note}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{tx.timestamp}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-500">{tx.receiptCode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`font-mono font-bold text-sm tabular-nums ${
                        isPayout ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {isPayout ? '-' : '+'}₦{tx.amount.toLocaleString()}
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onViewReceipt(tx);
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 justify-end transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Voucher</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
