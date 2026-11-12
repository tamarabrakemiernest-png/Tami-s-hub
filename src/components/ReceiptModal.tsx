import React from 'react';
import { CheckCircle2, Printer, X, ShieldCheck, Building2 } from 'lucide-react';
import { Transaction } from '../types/quiz';
import { sound } from '../utils/audio';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const isWithdrawal = transaction.type === 'WITHDRAWAL_PAYOUT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative text-slate-100">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 p-4 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-950" />
            <span className="font-semibold text-xs tracking-wider uppercase font-mono">
              Bible Quiz Earning Settlement Voucher
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-slate-950/20 hover:bg-slate-950/40 flex items-center justify-center text-slate-950 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Voucher Body */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            {/* Embedded Seal Image */}
            <div className="w-20 h-20 mx-auto rounded-full p-1 bg-amber-500/20 border border-amber-400/40 shadow-inner flex items-center justify-center overflow-hidden">
              <img
                src="/src/assets/images/payout_golden_seal_1794455011413.jpg"
                alt="Golden Payout Seal"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-xs text-amber-400 font-mono tracking-wider">
              {isWithdrawal ? 'NIBSS INSTANT SETTLEMENT PROOF' : 'SCRIPTURE REWARD CREDIT'}
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              {isWithdrawal ? '-' : '+'}₦{transaction.amount.toLocaleString()} NGN
            </div>
            <div className="text-xs text-slate-400">
              {transaction.destinationBankName
                ? `Credited via ${transaction.destinationBankName}`
                : 'Bible Quiz Earning Knowledge Vault'}
            </div>
          </div>

          {/* Details Grid */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3 text-xs">
            {transaction.accountName && (
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Beneficiary Name</span>
                <span className="font-semibold text-emerald-400">
                  {transaction.accountName}
                </span>
              </div>
            )}

            {transaction.destinationAccount && (
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Account / NUBAN</span>
                <span className="font-mono font-medium text-amber-200">
                  {transaction.destinationAccount}
                </span>
              </div>
            )}

            {transaction.destinationBankName && (
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Bank Destination</span>
                <span className="text-slate-200 font-medium">
                  {transaction.destinationBankName}
                </span>
              </div>
            )}

            {transaction.nipSessionId && (
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">NIP Session ID</span>
                <span className="font-mono text-slate-300 font-medium truncate max-w-[190px]">
                  {transaction.nipSessionId}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Voucher Reference</span>
              <span className="font-mono text-slate-300 font-medium">
                {transaction.receiptCode}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Date & Time</span>
              <span className="text-slate-300">{transaction.timestamp}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Transfer Status</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Successful / Credited
              </span>
            </div>
          </div>

          {/* Scripture Blessing Card */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="text-[11px] text-amber-400 font-semibold mb-1 uppercase tracking-wide">
              Scripture Blessing
            </div>
            <p className="text-xs text-slate-300 italic font-serif leading-relaxed">
              "{transaction.verseBlessing}"
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700 active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              Print Voucher
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md active:scale-[0.98]"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
