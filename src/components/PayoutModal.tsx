import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  History,
  FileText,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Check
} from 'lucide-react';
import { NigerianBankOption, PaymentMethod, Transaction } from '../types/quiz';
import { sound } from '../utils/audio';

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  transactions: Transaction[];
  onWithdraw: (
    amount: number,
    method: PaymentMethod,
    accountNumber: string,
    bankName: string,
    accountName: string
  ) => Promise<Transaction>;
  onViewReceipt: (tx: Transaction) => void;
}

export const NIGERIAN_BANKS: NigerianBankOption[] = [
  {
    id: 'PALMPAY',
    name: 'PalmPay',
    code: '999991',
    tagline: 'Instant credit to PalmPay mobile number',
    badge: 'Popular',
    iconBg: 'bg-purple-600',
    accentColor: 'text-purple-400'
  },
  {
    id: 'OPAY',
    name: 'OPay Digital Services',
    code: '999992',
    tagline: 'Instant transfer to OPay wallet / account',
    badge: 'Fastest',
    iconBg: 'bg-emerald-600',
    accentColor: 'text-emerald-400'
  },
  {
    id: 'MONIEPOINT',
    name: 'Moniepoint MFB',
    code: '090405',
    tagline: 'Direct deposit to Moniepoint account',
    badge: 'Instant',
    iconBg: 'bg-blue-600',
    accentColor: 'text-blue-400'
  },
  {
    id: 'KUDA',
    name: 'Kuda Microfinance Bank',
    code: '090267',
    tagline: 'The bank of the free',
    badge: 'Zero Fee',
    iconBg: 'bg-indigo-600',
    accentColor: 'text-indigo-400'
  },
  {
    id: 'GTBANK',
    name: 'Guaranty Trust Bank (GTBank)',
    code: '058',
    tagline: 'GTCO NUBAN transfer',
    badge: 'Commercial',
    iconBg: 'bg-orange-600',
    accentColor: 'text-orange-400'
  },
  {
    id: 'ACCESS_BANK',
    name: 'Access Bank Plc',
    code: '044',
    tagline: 'Access NUBAN deposit',
    badge: 'Commercial',
    iconBg: 'bg-amber-600',
    accentColor: 'text-amber-400'
  },
  {
    id: 'ZENITH_BANK',
    name: 'Zenith Bank Plc',
    code: '057',
    tagline: 'In your best interest',
    badge: 'Commercial',
    iconBg: 'bg-red-600',
    accentColor: 'text-red-400'
  },
  {
    id: 'FIRST_BANK',
    name: 'First Bank of Nigeria',
    code: '011',
    tagline: 'FirstBank NUBAN payout',
    badge: 'Commercial',
    iconBg: 'bg-blue-800',
    accentColor: 'text-blue-300'
  },
  {
    id: 'UBA',
    name: 'United Bank for Africa (UBA)',
    code: '033',
    tagline: 'Africas global bank',
    badge: 'Commercial',
    iconBg: 'bg-red-700',
    accentColor: 'text-red-300'
  },
  {
    id: 'OTHER_NIGERIA_BANK',
    name: 'Other Nigerian Commercial Bank',
    code: '000',
    tagline: 'Stanbic, Fidelity, Sterling, Wema, FCMB, Union',
    badge: 'All Banks',
    iconBg: 'bg-slate-700',
    accentColor: 'text-slate-300'
  }
];

export const PayoutModal: React.FC<PayoutModalProps> = ({
  isOpen,
  onClose,
  balance,
  transactions,
  onWithdraw,
  onViewReceipt
}) => {
  const [tab, setTab] = useState<'withdraw' | 'history'>('withdraw');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('PALMPAY');
  const [customBankName, setCustomBankName] = useState<string>('Stanbic IBTC Bank');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [isVerifyingAccount, setIsVerifyingAccount] = useState<boolean>(false);
  const [accountVerified, setAccountVerified] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>('1000');
  
  // Withdrawal processing
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStep, setProcessStep] = useState<number>(0);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const currentBank = NIGERIAN_BANKS.find((b) => b.id === selectedMethod) || NIGERIAN_BANKS[0];
  const activeBankName = selectedMethod === 'OTHER_NIGERIA_BANK' ? customBankName : currentBank.name;
  const numAmount = parseFloat(amount) || 0;
  const minWithdrawal = 1000; // ₦1,000 minimum cashout threshold

  // Simulated real-time Nigerian NUBAN / NIP Name Enquiry
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(val);
    setAccountVerified(false);

    if (val.length === 10) {
      setIsVerifyingAccount(true);
      setTimeout(() => {
        setIsVerifyingAccount(false);
        setAccountVerified(true);
        // Realistic default user account name or based on previous profile
        if (!accountName) {
          setAccountName('TAMARA BRAKEMI ERNEST');
        }
      }, 700);
    }
  };

  const handleStartWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (accountNumber.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Nigerian account number or phone number');
      return;
    }
    if (!accountName.trim()) {
      setErrorMsg('Please enter or verify the beneficiary account name');
      return;
    }
    if (numAmount < minWithdrawal) {
      setErrorMsg(`Minimum withdrawal is ₦${minWithdrawal.toLocaleString()}`);
      return;
    }
    if (numAmount > balance) {
      setErrorMsg(`Insufficient quiz reward balance (₦${balance.toLocaleString()} available)`);
      return;
    }

    sound.playClick();
    setIsProcessing(true);
    setProcessStep(1);

    // Step 1: NUBAN & Account verification with Central Switch
    await new Promise((r) => setTimeout(r, 1000));
    setProcessStep(2);

    // Step 2: NIBSS Instant Payment (NIP) clearing
    await new Promise((r) => setTimeout(r, 1100));
    setProcessStep(3);

    try {
      const tx = await onWithdraw(
        numAmount,
        selectedMethod,
        accountNumber,
        activeBankName,
        accountName
      );
      sound.playCashChime();
      sound.playCelebration();
      setCompletedTx(tx);
    } catch {
      setErrorMsg('Failed to process payout. Please check your bank details.');
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setCompletedTx(null);
    setIsProcessing(false);
    setProcessStep(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Withdraw to Nigerian Bank / Mobile Money
              </h2>
              <div className="text-xs text-slate-400">
                Available Wallet Balance:{' '}
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ₦{balance.toLocaleString()} NGN
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-4 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              setTab('withdraw');
            }}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'withdraw'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Instant Bank Payout
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTab('history');
            }}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'history'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            Payout History ({transactions.length})
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {tab === 'withdraw' ? (
            completedTx ? (
              /* Success View */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Payout Dispatched to {completedTx.destinationBankName || 'Bank'}!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                    ₦{completedTx.amount.toLocaleString()} has been credited via NIP to {completedTx.accountName} ({completedTx.destinationAccount}).
                  </p>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-left max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-400">NIP Session ID</span>
                    <span className="font-mono text-amber-300 font-bold truncate max-w-[200px]">
                      {completedTx.nipSessionId || '999014261112...'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Destination</span>
                    <span className="text-slate-200 font-semibold">{completedTx.destinationBankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Beneficiary Name</span>
                    <span className="text-emerald-400 font-medium">{completedTx.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Settlement Reference</span>
                    <span className="font-mono text-slate-300">{completedTx.receiptCode}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-200/80 italic">
                    "{completedTx.verseBlessing}"
                  </div>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onViewReceipt(completedTx);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700"
                  >
                    <FileText className="w-4 h-4" />
                    View Official Voucher
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : isProcessing ? (
              /* Processing Stepper */
              <div className="py-8 px-4 text-center space-y-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 animate-spin">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Routing NIBSS Instant Transfer
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Sending ₦{numAmount.toLocaleString()} to {activeBankName} ({accountNumber})
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-3 max-w-sm mx-auto text-left text-xs">
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${processStep >= 1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>1. Scripture Accuracy Verified (Passed 100%)</span>
                  </div>
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${processStep >= 2 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>2. NIBSS Instant Payment (NIP) Handshake with {activeBankName}</span>
                  </div>
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${processStep >= 3 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>3. Credit Verified & Settlement Voucher Issued</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleStartWithdrawal} className="space-y-5">
                
                {/* 1. Bank Rail Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                    1. Select Bank / Fintech Destination
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {NIGERIAN_BANKS.map((bank) => {
                      const isSel = selectedMethod === bank.id;
                      return (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setSelectedMethod(bank.id);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                            isSel
                              ? 'bg-slate-800 border-amber-400 ring-1 ring-amber-400/50 shadow-md'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white truncate pr-1">
                              {bank.name}
                            </span>
                            <span className="text-[9px] font-mono text-amber-400/90 shrink-0">
                              {bank.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 truncate">
                            {bank.tagline}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* If Other Nigerian Bank Selected, provide input/select */}
                {selectedMethod === 'OTHER_NIGERIA_BANK' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                      Specify Commercial Bank Name
                    </label>
                    <select
                      value={customBankName}
                      onChange={(e) => setCustomBankName(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                      <option value="Fidelity Bank">Fidelity Bank</option>
                      <option value="Sterling Bank">Sterling Bank</option>
                      <option value="Wema Bank (ALAT)">Wema Bank (ALAT)</option>
                      <option value="First City Monument Bank (FCMB)">First City Monument Bank (FCMB)</option>
                      <option value="Union Bank of Nigeria">Union Bank of Nigeria</option>
                      <option value="Polaris Bank">Polaris Bank</option>
                      <option value="Providus Bank">Providus Bank</option>
                      <option value="Jaiz Bank">Jaiz Bank</option>
                      <option value="Taj Bank">Taj Bank</option>
                      <option value="Titan Trust Bank">Titan Trust Bank</option>
                    </select>
                  </div>
                )}

                {/* 2. Account Number (NUBAN / Phone) */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      2. 10-Digit {activeBankName} Account / NUBAN
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {selectedMethod === 'PALMPAY' || selectedMethod === 'OPAY'
                        ? 'Phone or Account Number'
                        : '10-Digit NUBAN'}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={accountNumber}
                      onChange={handleAccountNumberChange}
                      placeholder={
                        selectedMethod === 'PALMPAY'
                          ? 'e.g. 8031234567 or 9012345678'
                          : selectedMethod === 'OPAY'
                          ? 'e.g. 7061234567 or 8123456789'
                          : 'e.g. 0123456789 (10 Digits)'
                      }
                      className="w-full h-11 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                    />
                    {isVerifyingAccount && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Resolving Name...</span>
                      </span>
                    )}
                    {accountVerified && !isVerifyingAccount && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                        <Check className="w-4 h-4" />
                        <span>NUBAN Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Verified Beneficiary Name Box */}
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Account Name:</span>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Account Beneficiary Name"
                      className="bg-transparent text-right font-semibold text-emerald-400 focus:outline-none text-xs w-2/3"
                    />
                  </div>
                </div>

                {/* 3. Amount Selection (Naira) */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      3. Withdrawal Amount (NGN)
                    </label>
                    <span className="text-xs text-slate-400">
                      Balance: <span className="font-mono text-emerald-400 font-semibold">₦{balance.toLocaleString()}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['1000', '2500', '5000'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setAmount(preset);
                        }}
                        className={`h-9 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                          amount === preset
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        ₦{parseInt(preset).toLocaleString()}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAmount(balance >= minWithdrawal ? balance.toString() : '1000');
                      }}
                      className="h-9 rounded-lg text-xs font-semibold border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                    >
                      Max (₦{balance.toLocaleString()})
                    </button>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold">
                      ₦
                    </span>
                    <input
                      type="number"
                      step="100"
                      min={minWithdrawal}
                      max={balance}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full h-11 pl-8 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {balance < minWithdrawal && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <div>
                        <span className="font-semibold">Minimum withdrawal threshold: ₦1,000</span>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Your wallet has ₦{balance.toLocaleString()}. Win {Math.ceil((minWithdrawal - balance) / 100)} Bible quiz game{Math.ceil((minWithdrawal - balance) / 100) > 1 ? 's' : ''} (+₦100 per win) to reach ₦{(balance + Math.ceil((minWithdrawal - balance) / 100) * 100).toLocaleString()} and withdraw to {activeBankName}!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={balance < minWithdrawal || numAmount < minWithdrawal}
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                  >
                    <span>
                      {balance < minWithdrawal
                        ? `₦1,000 Minimum (Need ₦${(minWithdrawal - balance).toLocaleString()} more)`
                        : `Confirm Payout to ${activeBankName} (₦${numAmount > 0 ? numAmount.toLocaleString() : '0'})`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    Direct Credit via NIBSS Instant Payment (NIP) · PalmPay · OPay · Moniepoint · All Nigerian Banks
                  </p>
                </div>
              </form>
            )
          ) : (
            /* History Tab */
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No transactions recorded yet. Complete quizzes to earn your first reward!
                </div>
              ) : (
                transactions.map((tx) => {
                  const isWithdrawal = tx.type === 'WITHDRAWAL_PAYOUT';
                  return (
                    <div
                      key={tx.id}
                      className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isWithdrawal
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {isWithdrawal ? <Building2 className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {tx.note}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{tx.timestamp}</span>
                            <span>·</span>
                            <span className="font-mono text-slate-400">{tx.receiptCode}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`font-mono font-bold text-sm ${
                            isWithdrawal ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {isWithdrawal ? '-' : '+'}₦{tx.amount.toLocaleString()}
                        </div>
                        <button
                          onClick={() => {
                            sound.playClick();
                            onViewReceipt(tx);
                          }}
                          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 justify-end font-medium transition-colors"
                        >
                          <span>Voucher</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
