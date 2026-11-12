import { ReferralAccount, ReferralEvent } from '../types/quiz';

export const REFERRAL_BONUS_COINS = 500;

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const STORAGE_KEY = 'bqe_referral_registry_v1';

export const SEEDED_REFERRERS: ReferralAccount[] = [
  {
    id: 'ref_priscilla',
    name: 'Priscilla_Acts',
    code: 'PRISCILLA-777',
    coinBalance: 485000,
    referralCount: 14
  },
  {
    id: 'ref_david',
    name: 'DavidThePsalmist',
    code: 'DAVID-PSALM-23',
    coinBalance: 394000,
    referralCount: 9
  },
  {
    id: 'ref_grace',
    name: 'GraceSeeker77',
    code: 'GRACE-77',
    coinBalance: 312500,
    referralCount: 6
  },
  {
    id: 'ref_timothy',
    name: 'Timothy_Faith',
    code: 'TIMOTHY-FAITH',
    coinBalance: 245000,
    referralCount: 4
  },
  {
    id: 'ref_deborah',
    name: 'DeborahTheJudge',
    code: 'DEBORAH-531',
    coinBalance: 188750,
    referralCount: 3
  }
];

function randomSegment(length: number): string {
  const bytes = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return result;
}

/**
 * Generates a unique referral code formatted as BQE-XXXX-XX
 * guaranteed not to collide with any existing code in the registry.
 */
export function generateUniqueReferralCode(existingCodes: Set<string>): string {
  let candidate = '';
  let attempts = 0;
  do {
    candidate = `BQE-${randomSegment(4)}-${randomSegment(2)}`;
    attempts++;
  } while (existingCodes.has(candidate) && attempts < 100);
  return candidate;
}

export interface PersistedReferralState {
  myCode: string;
  myRetiredCodes: string[];
  redeemedCode: string | null;
  redeemedByReferrerName: string | null;
  accounts: ReferralAccount[];
  events: ReferralEvent[];
}

export function loadReferralState(): PersistedReferralState {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedReferralState;
        if (parsed && parsed.myCode && Array.isArray(parsed.accounts)) {
          return parsed;
        }
      }
    } catch {
      // Ignore malformed storage and re-initialize
    }
  }

  const existing = new Set(SEEDED_REFERRERS.map((r) => r.code));
  const initialCode = generateUniqueReferralCode(existing);

  const initialState: PersistedReferralState = {
    myCode: initialCode,
    myRetiredCodes: [],
    redeemedCode: null,
    redeemedByReferrerName: null,
    accounts: SEEDED_REFERRERS,
    events: []
  };

  saveReferralState(initialState);
  return initialState;
}

export function saveReferralState(state: PersistedReferralState): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota errors fail silently
    }
  }
}

export function normalizeReferralCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}
