import {
  Trophy,
  Gem,
  Heart,
  Axe,
  FlaskConical,
  Hammer,
  Skull,
  Leaf,
  Globe,
  Sword
} from 'lucide-react';

// Tier -> puan tablosu (yüksekten düşüğe).
export const TIER_POINTS = {
  HT1: 60,
  LT1: 50,
  HT2: 40,
  LT2: 30,
  HT3: 20,
  LT3: 10
};

// Bilgi (Information) modalinde gösterilecek sıralı liste.
export const TIER_ORDER = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3'];

export const TIER_COLORS = {
  HT1: '#ffcf5c',
  LT1: '#f0b840',
  HT2: '#c7d2fe',
  LT2: '#93a4c9',
  HT3: '#7c8aa5',
  LT3: '#5b6577'
};

// Kit listesi. İlki genel sıralama (Overall).
export const KITS = [
  { id: 'overall', label: 'Overall', icon: Trophy, color: '#e7b84e' },
  { id: 'vanilla', label: 'Vanilla', icon: Gem, color: '#a855f7' },
  { id: 'uhc', label: 'UHC', icon: Heart, color: '#ef4444' },
  { id: 'axe', label: 'Axe', icon: Axe, color: '#60a5fa' },
  { id: 'diapot', label: 'DiaPot', icon: FlaskConical, color: '#ec4899' },
  { id: 'mace', label: 'Mace', icon: Hammer, color: '#f97316' },
  { id: 'nethop', label: 'NethOP', icon: Skull, color: '#8b5cf6' },
  { id: 'ogv', label: 'OGV', icon: Leaf, color: '#84cc16' },
  { id: 'smp', label: 'SMP', icon: Globe, color: '#10b981' },
  { id: 'sword', label: 'Sword', icon: Sword, color: '#38bdf8' }
];

export const COMBAT_KITS = KITS.filter((kit) => kit.id !== 'overall');

// Toplam puana göre ünvan.
export function titleForPoints(points) {
  if (points >= 400) return 'Savaş Büyük Ustası';
  if (points >= 280) return 'Savaş Ustası';
  if (points >= 180) return 'Uzman';
  if (points >= 90) return 'Savaşçı';
  if (points > 0) return 'Acemi';
  return 'Sıralanmadı';
}

// Örnek veri (KV boşken veya API erişilemezken gösterilir).
export const DEMO_PLAYERS = [
  { id: 'd1', name: 'Marlowww', region: 'TR', skin: 'Technoblade', accent: '#e7b84e', tiers: { vanilla: 'HT1', uhc: 'HT1', axe: 'HT1', diapot: 'HT1', mace: 'HT2', nethop: 'HT1', ogv: 'LT1', smp: 'HT1', sword: 'HT1' } },
  { id: 'd2', name: 'ItzRealMe', region: 'TR', skin: 'Dream', accent: '#9fb4b8', tiers: { vanilla: 'HT1', uhc: 'HT2', axe: 'LT1', diapot: 'HT1', mace: 'LT2', nethop: 'HT1', ogv: 'LT2', smp: 'LT1', sword: 'HT1' } },
  { id: 'd3', name: 'janekv', region: 'TR', skin: 'Ninja', accent: '#b06f4f', tiers: { vanilla: 'HT2', uhc: 'LT1', axe: 'HT2', diapot: 'HT1', mace: 'HT3', nethop: 'LT1', ogv: 'LT2', smp: 'HT2', sword: 'LT1' } },
  { id: 'd4', name: 'Efe', region: 'TR', accent: '#7587a5', tiers: { vanilla: 'LT2', uhc: 'HT3', axe: 'HT2', diapot: 'LT1', mace: 'LT3', nethop: 'HT3', ogv: 'HT3', smp: 'LT2', sword: 'HT2' } },
  { id: 'd5', name: 'Kayra', region: 'TR', accent: '#64748b', tiers: { vanilla: 'LT3', uhc: 'HT3', axe: 'LT3', diapot: 'HT3', mace: 'LT3', nethop: 'HT3', ogv: 'LT3', smp: 'HT3', sword: 'LT2' } },
  { id: 'd6', name: 'Poyraz', region: 'TR', accent: '#94a3b8', tiers: { vanilla: 'HT3', uhc: 'LT3', axe: 'HT3', diapot: 'LT3', mace: 'HT3', nethop: 'LT3', ogv: 'HT3', smp: 'LT3', sword: 'HT3' } }
];
