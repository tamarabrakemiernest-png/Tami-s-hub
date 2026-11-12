import { LeaderboardUser, Transaction } from '../types/quiz';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_welcome_01',
    type: 'DAILY_BONUS',
    amount: 300,
    status: 'COMPLETED',
    timestamp: 'Today at 8:15 AM',
    note: 'Welcome Sign-on Grace Bonus',
    receiptCode: 'BQE-WLCM-9821',
    nipSessionId: '9990142611120815234918239012',
    destinationBankName: 'OPay',
    destinationAccount: '8039218491',
    accountName: 'TAMARA BRAKEMI ERNEST',
    verseBlessing: 'The LORD bless you and keep you; the LORD make His face shine upon you. — Numbers 6:24-25'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    username: 'Priscilla_Acts',
    badge: 'Senior Scripture Scholar',
    earnedTotal: 485000,
    streakDays: 42,
    accuracyRate: 98,
    favoriteVerse: 'Acts 18:26 · "Explained the way of God more accurately"',
    avatarColor: 'bg-amber-600'
  },
  {
    rank: 2,
    username: 'DavidThePsalmist',
    badge: 'Proverbs Master',
    earnedTotal: 394000,
    streakDays: 28,
    accuracyRate: 95,
    favoriteVerse: 'Psalm 23:1 · "The LORD is my shepherd; I shall not want"',
    avatarColor: 'bg-emerald-600'
  },
  {
    rank: 3,
    username: 'GraceSeeker77',
    badge: 'Gospel Explorer',
    earnedTotal: 312500,
    streakDays: 19,
    accuracyRate: 92,
    favoriteVerse: 'John 14:6 · "I am the way, the truth, and the life"',
    avatarColor: 'bg-indigo-600'
  },
  {
    rank: 4,
    username: 'Timothy_Faith',
    badge: 'Daily Blitz Champion',
    earnedTotal: 245000,
    streakDays: 14,
    accuracyRate: 89,
    favoriteVerse: '2 Timothy 1:7 · "Spirit of power, love, and a sound mind"',
    avatarColor: 'bg-teal-600'
  },
  {
    rank: 5,
    username: 'DeborahTheJudge',
    badge: 'Old Testament Virtuoso',
    earnedTotal: 188750,
    streakDays: 9,
    accuracyRate: 94,
    favoriteVerse: 'Judges 5:31 · "Let those who love You be like the sun"',
    avatarColor: 'bg-rose-600'
  }
];
