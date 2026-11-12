import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { QuizArena } from './components/QuizArena';
import { PayoutModal } from './components/PayoutModal';
import { ReceiptModal } from './components/ReceiptModal';
import { DailyGraceReward } from './components/DailyGraceReward';
import { LeaderboardView } from './components/LeaderboardView';
import { AIScholarChat } from './components/AIScholarChat';
import { WalletLedgerView } from './components/WalletLedgerView';
import { BottomNav } from './components/BottomNav';
import {
  PaymentMethod,
  ReferralAccount,
  ReferralEvent,
  Transaction
} from './types/quiz';
import { INITIAL_TRANSACTIONS } from './data/initialData';
import {
  REFERRAL_BONUS_COINS,
  PersistedReferralState,
  generateUniqueReferralCode,
  loadReferralState,
  normalizeReferralCode,
  saveReferralState
} from './utils/referrals';

const WALLET_STORAGE_KEY = 'bqe_wallet_state_v1';

interface PersistedWalletState {
  balance: number;
  transactions: Transaction[];
}

function loadWalletState(): PersistedWalletState {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(WALLET_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedWalletState;
        if (
          parsed &&
          typeof parsed.balance === 'number' &&
          Array.isArray(parsed.transactions)
        ) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default initial wallet
    }
  }
  return {
    balance: 300,
    transactions: INITIAL_TRANSACTIONS
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'wallet' | 'leaderboard' | 'scholar' | 'daily'>('quiz');
  const [initialWallet] = useState<PersistedWalletState>(() => loadWalletState());
  const [balance, setBalance] = useState<number>(initialWallet.balance);
  const [streak, setStreak] = useState<number>(3);
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>(initialWallet.transactions);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  const [referralState, setReferralState] = useState<PersistedReferralState>(() => loadReferralState());
  const [initialPrefillCode, setInitialPrefillCode] = useState<string>('');

  // Persist wallet balance and transactions alongside referral registry
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          WALLET_STORAGE_KEY,
          JSON.stringify({ balance, transactions })
        );
      } catch {
        // Ignore quota errors
      }
    }
  }, [balance, transactions]);

  // Persist referral registry whenever updated
  useEffect(() => {
    saveReferralState(referralState);
  }, [referralState]);

  // Pre-fill referral code if user opened app with ?ref=CODE
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      const normalized = normalizeReferralCode(refParam);
      if (normalized) {
        setInitialPrefillCode(normalized);
        setActiveTab('wallet');
      }
    }
  }, []);

  // Rewards handler
  const handleEarnReward = (amount: number, note: string) => {
    const formattedAmount = Math.round(amount);
    setBalance((prev) => prev + formattedAmount);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'QUIZ_REWARD',
      amount: formattedAmount,
      status: 'COMPLETED',
      timestamp: 'Just now',
      note: note,
      receiptCode: `BQE-QUIZ-${Math.floor(1000 + Math.random() * 9000)}`,
      verseBlessing: 'Whatever you do, work at it with all your heart, as working for the Lord. — Colossians 3:23'
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Nigerian Banks / Fintech Withdrawal handler
  const handleWithdraw = async (
    amount: number,
    method: PaymentMethod,
    accountNumber: string,
    bankName: string,
    accountName: string
  ): Promise<Transaction> => {
    const formattedAmount = Math.round(amount);
    setBalance((prev) => Math.max(0, prev - formattedAmount));

    const sessionRandom = Math.floor(100000000000 + Math.random() * 900000000000);
    const payoutTx: Transaction = {
      id: `tx_payout_${Date.now()}`,
      type: 'WITHDRAWAL_PAYOUT',
      amount: formattedAmount,
      status: 'COMPLETED',
      timestamp: 'Just now',
      destinationApp: method,
      destinationBankName: bankName,
      destinationAccount: accountNumber,
      accountName: accountName,
      nipSessionId: `999014${Date.now()}${sessionRandom.toString().slice(0, 6)}`,
      note: `Direct Payout to ${bankName} (${accountNumber})`,
      receiptCode: `BQE-NIP-${Math.floor(10000 + Math.random() * 90000)}`,
      verseBlessing: 'The blessing of the LORD brings wealth, without painful toil for it. — Proverbs 10:22'
    };

    setTransactions((prev) => [payoutTx, ...prev]);
    return payoutTx;
  };

  // Daily Drop handler
  const handleClaimDaily = (amount: number) => {
    const formattedAmount = Math.round(amount);
    setBalance((prev) => prev + formattedAmount);
    setDailyClaimed(true);
    setStreak((prev) => prev + 1);

    const dailyTx: Transaction = {
      id: `tx_daily_${Date.now()}`,
      type: 'DAILY_BONUS',
      amount: formattedAmount,
      status: 'COMPLETED',
      timestamp: 'Just now',
      note: `Day ${streak + 1} Daily Grace Reward`,
      receiptCode: `BQE-DAY-${Math.floor(1000 + Math.random() * 9000)}`,
      verseBlessing: 'Give us today our daily bread. — Matthew 6:11'
    };

    setTransactions((prev) => [dailyTx, ...prev]);
  };

  // Generate a fresh collision-free referral code while keeping previously shared codes valid
  const handleRegenerateReferralCode = () => {
    setReferralState((prev) => {
      const existing = new Set<string>([
        prev.myCode,
        ...prev.myRetiredCodes,
        ...prev.accounts.map((acc) => normalizeReferralCode(acc.code))
      ]);
      const nextCode = generateUniqueReferralCode(existing);
      return {
        ...prev,
        myCode: nextCode,
        myRetiredCodes: [prev.myCode, ...prev.myRetiredCodes]
      };
    });
  };

  // Redeem a referral code entered by the current user: awards +500 coins to both referrer and current user
  const handleRedeemReferralCode = (
    rawCode: string
  ): { success: boolean; message: string; referrerName?: string } => {
    const code = normalizeReferralCode(rawCode);

    if (referralState.redeemedCode) {
      return {
        success: false,
        message: `You have already redeemed referral code ${referralState.redeemedCode}.`
      };
    }

    if (!code) {
      return {
        success: false,
        message: 'Please enter a valid referral code.'
      };
    }

    if (
      code === normalizeReferralCode(referralState.myCode) ||
      referralState.myRetiredCodes.some((c) => normalizeReferralCode(c) === code)
    ) {
      return {
        success: false,
        message: 'You cannot redeem your own referral code. Share it with a friend instead!'
      };
    }

    const referrer = referralState.accounts.find(
      (acc) => normalizeReferralCode(acc.code) === code
    );

    if (!referrer) {
      return {
        success: false,
        message: 'Invalid referral code. Double-check the code or try one of the community codes below.'
      };
    }

    const newEvent: ReferralEvent = {
      id: `ref_ev_${Date.now()}`,
      codeUsed: referrer.code,
      referrerId: referrer.id,
      referrerName: referrer.name,
      newUserId: 'current_user',
      newUserName: 'You',
      referrerBonus: REFERRAL_BONUS_COINS,
      newUserBonus: REFERRAL_BONUS_COINS,
      timestamp: 'Just now'
    };

    setReferralState((prev) => ({
      ...prev,
      redeemedCode: referrer.code,
      redeemedByReferrerName: referrer.name,
      accounts: prev.accounts.map((acc) =>
        acc.id === referrer.id
          ? {
              ...acc,
              coinBalance: acc.coinBalance + REFERRAL_BONUS_COINS,
              referralCount: acc.referralCount + 1
            }
          : acc
      ),
      events: [newEvent, ...prev.events]
    }));

    setBalance((prev) => prev + REFERRAL_BONUS_COINS);

    const referralTx: Transaction = {
      id: `tx_ref_${Date.now()}`,
      type: 'REFERRAL_REWARD',
      amount: REFERRAL_BONUS_COINS,
      status: 'COMPLETED',
      timestamp: 'Just now',
      note: `Referral Bonus (${referrer.code} · Invited by ${referrer.name})`,
      receiptCode: `BQE-REF-${Math.floor(1000 + Math.random() * 9000)}`,
      verseBlessing: 'Two are better than one, because they have a good return for their labor. — Ecclesiastes 4:9'
    };

    setTransactions((prev) => [referralTx, ...prev]);

    return {
      success: true,
      message: `Code ${referrer.code} verified! Both you and ${referrer.name} received a +${REFERRAL_BONUS_COINS} coin bonus.`,
      referrerName: referrer.name
    };
  };

  // Simulate a new friend joining with a referral code (awards +500 coins to both the referrer and the new friend)
  const handleSimulateFriendSignup = (
    friendName: string,
    rawCode: string
  ): { success: boolean; message: string; newUserBalance?: number } => {
    const trimmedName = friendName.trim();
    const code = normalizeReferralCode(rawCode);

    if (trimmedName.length < 2) {
      return {
        success: false,
        message: 'Enter a friend username (at least 2 characters).'
      };
    }

    if (!code) {
      return {
        success: false,
        message: 'Enter a referral code to test.'
      };
    }

    const isMyCode =
      code === normalizeReferralCode(referralState.myCode) ||
      referralState.myRetiredCodes.some((c) => normalizeReferralCode(c) === code);

    const matchedAccount = isMyCode
      ? null
      : referralState.accounts.find((acc) => normalizeReferralCode(acc.code) === code);

    if (!isMyCode && !matchedAccount) {
      return {
        success: false,
        message: 'Referral code not found. Enter your unique code or a valid community code.'
      };
    }

    const existingCodes = new Set<string>([
      referralState.myCode,
      ...referralState.myRetiredCodes,
      ...referralState.accounts.map((acc) => normalizeReferralCode(acc.code))
    ]);

    const friendUniqueCode = generateUniqueReferralCode(existingCodes);
    const friendInitialTotal = 300 + REFERRAL_BONUS_COINS; // 300 starting wallet + 500 referral bonus
    const newFriendAccount: ReferralAccount = {
      id: `ref_friend_${Date.now()}`,
      name: trimmedName,
      code: friendUniqueCode,
      coinBalance: friendInitialTotal,
      referralCount: 0
    };

    const referrerId = isMyCode ? 'current_user' : matchedAccount!.id;
    const referrerName = isMyCode ? 'You' : matchedAccount!.name;
    const usedCodeDisplay = isMyCode ? code : matchedAccount!.code;

    const newEvent: ReferralEvent = {
      id: `ref_ev_${Date.now()}`,
      codeUsed: usedCodeDisplay,
      referrerId,
      referrerName,
      newUserId: newFriendAccount.id,
      newUserName: trimmedName,
      referrerBonus: REFERRAL_BONUS_COINS,
      newUserBonus: REFERRAL_BONUS_COINS,
      timestamp: 'Just now'
    };

    setReferralState((prev) => ({
      ...prev,
      accounts: [
        ...(isMyCode
          ? prev.accounts
          : prev.accounts.map((acc) =>
              acc.id === matchedAccount!.id
                ? {
                    ...acc,
                    coinBalance: acc.coinBalance + REFERRAL_BONUS_COINS,
                    referralCount: acc.referralCount + 1
                  }
                : acc
            )),
        newFriendAccount
      ],
      events: [newEvent, ...prev.events]
    }));

    if (isMyCode) {
      setBalance((prev) => prev + REFERRAL_BONUS_COINS);

      const friendBonusTx: Transaction = {
        id: `tx_ref_friend_${Date.now()}`,
        type: 'REFERRAL_REWARD',
        amount: REFERRAL_BONUS_COINS,
        status: 'COMPLETED',
        timestamp: 'Just now',
        note: `Refer a Friend Bonus (${trimmedName} used ${usedCodeDisplay})`,
        receiptCode: `BQE-REF-${Math.floor(1000 + Math.random() * 9000)}`,
        verseBlessing: 'Iron sharpens iron, and one person sharpens another. — Proverbs 27:17'
      };

      setTransactions((prev) => [friendBonusTx, ...prev]);

      return {
        success: true,
        message: `${trimmedName} signed up with ${usedCodeDisplay}! You received +${REFERRAL_BONUS_COINS} coins and ${trimmedName} received +${REFERRAL_BONUS_COINS} coins (${friendInitialTotal} coins total).`,
        newUserBalance: friendInitialTotal
      };
    }

    return {
      success: true,
      message: `${trimmedName} signed up with ${usedCodeDisplay}! Both ${referrerName} and ${trimmedName} received +${REFERRAL_BONUS_COINS} coins.`,
      newUserBalance: friendInitialTotal
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        balance={balance}
        onOpenWallet={() => setIsPayoutModalOpen(true)}
        streak={streak}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {activeTab === 'quiz' && (
          <QuizArena
            onEarnReward={handleEarnReward}
            streak={streak}
            incrementStreak={() => setStreak((s) => s + 1)}
            resetStreak={() => setStreak(1)}
            onOpenCashout={() => setIsPayoutModalOpen(true)}
            onOpenReferrals={() => setActiveTab('wallet')}
          />
        )}

        {activeTab === 'daily' && (
          <DailyGraceReward
            onClaimDaily={handleClaimDaily}
            dailyClaimed={dailyClaimed}
            streak={streak}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            userBalance={balance}
            userStreak={streak}
            referralAccounts={referralState.accounts}
          />
        )}

        {activeTab === 'scholar' && (
          <AIScholarChat
            onPlayCustomQuiz={() => {
              setActiveTab('quiz');
            }}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletLedgerView
            balance={balance}
            transactions={transactions}
            onOpenCashout={() => setIsPayoutModalOpen(true)}
            onViewReceipt={(tx) => setSelectedReceipt(tx)}
            myReferralCode={referralState.myCode}
            redeemedCode={referralState.redeemedCode}
            redeemedByReferrerName={referralState.redeemedByReferrerName}
            referralAccounts={referralState.accounts}
            referralEvents={referralState.events}
            initialPrefillCode={initialPrefillCode}
            onRegenerateCode={handleRegenerateReferralCode}
            onRedeemCode={handleRedeemReferralCode}
            onSimulateFriendSignup={handleSimulateFriendSignup}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <span>Holy Scriptures Referenced</span>
            <span>·</span>
            <span>Instant Settled Payments</span>
            <span>·</span>
            <span>Grace & Truth</span>
          </div>
          <p className="text-[11px] text-slate-600">
            "Thy word is a lamp unto my feet, and a light unto my path." — Psalm 119:105
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWallet={() => setIsPayoutModalOpen(true)}
        balance={balance}
      />

      {/* Payout & Withdrawal Modal */}
      <PayoutModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        balance={balance}
        transactions={transactions}
        onWithdraw={handleWithdraw}
        onViewReceipt={(tx) => {
          setSelectedReceipt(tx);
        }}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

    </div>
  );
}
