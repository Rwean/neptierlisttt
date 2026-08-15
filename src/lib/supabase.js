import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const TIER_POINTS = {
  LT3: 10,
  HT3: 20,
  LT2: 30,
  HT2: 40,
  LT1: 50,
  HT1: 60
};

export const TIER_ORDER = ['LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1'];

export const CATEGORIES = [
  { key: 'sword', label: 'Sword' },
  { key: 'crystal', label: 'Crystal' },
  { key: 'diapot', label: 'Diapot' },
  { key: 'nethpot', label: 'Nethpot' },
  { key: 'axe', label: 'Axe' },
  { key: 'uhc', label: 'UHC' },
  { key: 'smp', label: 'SMP' },
  { key: 'mace', label: 'Mace' },
  { key: 'ogv', label: 'OGV' }
];

export const RANK_BY_SCORE = [
  { min: 360, rank: 'Savaş Büyük Ustası' },
  { min: 260, rank: 'Savaş Ustası' },
  { min: 160, rank: 'Usta Oyuncu' },
  { min: 80, rank: 'Tecrübeli Oyuncu' },
  { min: 1, rank: 'Oyuncu' }
];

export function getRank(totalScore) {
  return RANK_BY_SCORE.find((item) => totalScore >= item.min)?.rank || 'Oyuncu';
}

export function calculateTotalScore(tiers) {
  if (!tiers) return 0;
  return CATEGORIES.reduce((sum, cat) => {
    const tier = typeof tiers[cat.key] === 'string'
      ? tiers[cat.key]
      : tiers[cat.key]?.tier || 'LT3';
    return sum + (TIER_POINTS[String(tier).toUpperCase()] || 0);
  }, 0);
}

export function getTierArray(tiers) {
  if (!tiers) return CATEGORIES.map(() => '-');
  return CATEGORIES.map((cat) => {
    const tier = typeof tiers[cat.key] === 'string'
      ? tiers[cat.key]
      : tiers[cat.key]?.tier || '-';
    return String(tier).toUpperCase();
  });
}

export function skinUrl(username, size = 200) {
  if (!username) return '';
  return `https://mc-heads.net/body/${encodeURIComponent(username)}/${size}`;
}

export function headUrl(username, size = 64) {
  if (!username) return '';
  return `https://mc-heads.net/avatar/${encodeURIComponent(username)}/${size}`;
}

export const ADMIN_USER = 'Admin';
export const ADMIN_PASS = String.raw`]&.RaD30P+B1ocaF+n!I-~QgPQxH8AEAHq'k7Ezsbco33EBGvA`;

export const DISCORD_INVITE = 'https://discord.gg/neptiers';
