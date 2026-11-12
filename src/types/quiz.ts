export type QuizCategory =
  | 'OLD_TESTAMENT'
  | 'GOSPELS'
  | 'PARABLES'
  | 'MIRACLES'
  | 'PROPHECY'
  | 'WISDOM';

export type QuizDifficulty = 'novice' | 'disciple' | 'scholar';

export type GameMode =
  | 'DAILY_JACKPOT'
  | 'SPEED_RUSH'
  | 'CATEGORY_QUEST'
  | 'HIGH_STAKES';

export interface BibleQuestion {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  question: string;
  options: string[];
  correctIndex: number;
  verseReference: string;
  scriptureText: string;
  theologicalContext: string;
  rewardValue: number; // e.g. 250, 500, 1000 Naira
}

export type PaymentMethod =
  | 'PALMPAY'
  | 'OPAY'
  | 'MONIEPOINT'
  | 'KUDA'
  | 'GTBANK'
  | 'ACCESS_BANK'
  | 'ZENITH_BANK'
  | 'FIRST_BANK'
  | 'UBA'
  | 'OTHER_NIGERIA_BANK';

export interface NigerianBankOption {
  id: PaymentMethod;
  name: string;
  code: string;
  tagline: string;
  badge: string;
  iconBg: string;
  accentColor: string;
}

export interface PaymentAccountInfo {
  method: PaymentMethod;
  accountNumber: string; // 10-digit NUBAN
  accountName: string; // Verified Account Name (e.g. TAMARA BRAKEMI ERNEST)
  bankName: string;
  phone?: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  type: 'QUIZ_REWARD' | 'DAILY_BONUS' | 'STREAK_BONUS' | 'REFERRAL_REWARD' | 'WITHDRAWAL_PAYOUT';
  amount: number;
  status: 'COMPLETED' | 'PROCESSING' | 'PENDING';
  timestamp: string;
  destinationApp?: PaymentMethod;
  destinationBankName?: string;
  destinationAccount?: string; // 10-digit NUBAN
  accountName?: string; // Beneficiary name
  nipSessionId?: string; // NIBSS Instant Payment Session ID
  note: string;
  receiptCode: string;
  verseBlessing: string;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  badge: string;
  earnedTotal: number;
  streakDays: number;
  accuracyRate: number;
  favoriteVerse: string;
  avatarColor: string;
}

export interface ReferralAccount {
  id: string;
  name: string;
  code: string;
  coinBalance: number;
  referralCount: number;
  isCurrentUser?: boolean;
}

export interface ReferralEvent {
  id: string;
  codeUsed: string;
  referrerId: string;
  referrerName: string;
  newUserId: string;
  newUserName: string;
  referrerBonus: number;
  newUserBonus: number;
  timestamp: string;
}

