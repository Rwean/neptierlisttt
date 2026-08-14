import {
  Swords,
  Gem,
  FlaskConical,
  Flame,
  Axe,
  Crown,
  Users,
  Hammer
} from 'lucide-react';

// Oyun modları — her oyuncunun tier rozetleri bu sıraya göre gösterilir
export const modes = [
  { icon: Swords, label: 'Sword', short: 'SWD' },
  { icon: Gem, label: 'Crystal', short: 'CRY' },
  { icon: FlaskConical, label: 'Potion', short: 'POT' },
  { icon: Flame, label: 'Netherite', short: 'NTH' },
  { icon: Axe, label: 'Axe', short: 'AXE' },
  { icon: Crown, label: 'UHC', short: 'UHC' },
  { icon: Users, label: 'Team', short: 'TEM' },
  { icon: Hammer, label: 'Mace', short: 'MAC' }
];

export const defaultPlayers = [
  {
    id: 1,
    name: 'Marlowww',
    rank: 'Combat Grandmaster',
    points: 450,
    region: 'NA',
    avatar: 'M',
    tiers: ['HT1', 'HT1', 'HT1', 'HT1', 'HT1', 'HT1', 'LT1', 'LT1']
  },
  {
    id: 2,
    name: 'ItzRealMe',
    rank: 'Combat Master',
    points: 330,
    region: 'NA',
    avatar: 'I',
    tiers: ['HT3', 'HT1', 'HT1', 'HT1', 'HT1', 'LT2', 'LT2', 'LT2']
  },
  {
    id: 3,
    name: 'X Kisisi',
    rank: 'Combat Master',
    points: 326,
    region: 'EU',
    avatar: 'X',
    tiers: ['LT3', 'LT3', 'HT1', 'HT1', 'LT1', 'LT1', 'LT1', 'LT2']
  },
  {
    id: 4,
    name: 'Y Kisisi',
    rank: 'Combat Master',
    points: 290,
    region: 'NA',
    avatar: 'Y',
    tiers: ['LT3', 'HT4', 'HT1', 'HT1', 'HT2', 'LT2', 'LT2', 'LT2']
  },
  {
    id: 5,
    name: 'janekv',
    rank: 'Combat Master',
    points: 260,
    region: 'EU',
    avatar: 'J',
    tiers: ['LT3', 'HT4', 'HT1', 'HT1', 'HT1', 'HT2', 'LT2', 'LT2']
  },
  {
    id: 6,
    name: 'Swight',
    rank: 'Combat Ace',
    points: 214,
    region: 'AS',
    avatar: 'S',
    tiers: ['HT4', 'LT4', 'HT2', 'HT2', 'LT2', 'LT3', 'HT3', 'LT3']
  },
  {
    id: 7,
    name: 'Verglobe',
    rank: 'Combat Ace',
    points: 188,
    region: 'EU',
    avatar: 'V',
    tiers: ['LT4', 'HT3', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT4']
  },
  {
    id: 8,
    name: 'Kohaku',
    rank: 'Combat Specialist',
    points: 152,
    region: 'AS',
    avatar: 'K',
    tiers: ['HT5', 'LT4', 'HT4', 'LT3', 'HT4', 'LT4', 'HT5', 'LT4']
  }
];

// Her tier'a görsel ağırlık veren renk sınıfı
export function tierClass(tier) {
  if (!tier) return 'tier-empty';
  const value = tier.toUpperCase();
  if (value === 'HT1') return 'tier-ht1';
  if (value === 'LT1') return 'tier-lt1';
  if (value === 'HT2') return 'tier-ht2';
  if (value === 'LT2') return 'tier-lt2';
  if (value === 'HT3' || value === 'LT3') return 'tier-t3';
  return 'tier-low';
}

export const regionMeta = {
  NA: { label: 'North America', tone: 'na' },
  EU: { label: 'Europe', tone: 'eu' },
  AS: { label: 'Asia', tone: 'as' },
  OCE: { label: 'Oceania', tone: 'oce' },
  SA: { label: 'South America', tone: 'sa' }
};

export const newsItems = [
  {
    id: 'n1',
    tag: 'Duyuru',
    date: '12 Ağu 2026',
    title: 'Sezon 4 sıralamaları başladı',
    body: 'Yeni sezonla birlikte tüm oyuncuların puanları sıfırlandı. İlk testler bu hafta sonu Sword ve Crystal modlarında yapılacak. Discord üzerinden test talebi oluşturabilirsiniz.'
  },
  {
    id: 'n2',
    tag: 'Güncelleme',
    date: '5 Ağu 2026',
    title: 'Mace modu resmi olarak eklendi',
    body: 'Topluluğun uzun süredir beklediği Mace modu artık sıralamalara dahil. HT1 rozetini kapan ilk oyuncu ödül kazanacak.'
  },
  {
    id: 'n3',
    tag: 'Etkinlik',
    date: '28 Tem 2026',
    title: 'Yaz turnuvası kayıtları açık',
    body: 'Bölgesel elemeler NA, EU ve AS için ayrı ayrı düzenlenecek. Başvurular sekmesinden tester ekibine katılabilirsiniz.'
  }
];
