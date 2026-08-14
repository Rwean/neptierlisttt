// NeptunePvP Tier List — veri modeli
// Kitler (oyun modları). Her kitin kendi sıralaması vardır.
export const KITS = [
  { id: 'vanilla', label: 'Vanilla', icon: '/kits/vanilla.png' },
  { id: 'uhc', label: 'UHC', icon: '/kits/uhc.png' },
  { id: 'pot', label: 'Pot', icon: '/kits/pot.png' },
  { id: 'nethpot', label: 'NethPot', icon: '/kits/nethpot.png' },
  { id: 'smp', label: 'SMP', icon: '/kits/smp.png' },
  { id: 'sword', label: 'Sword', icon: '/kits/sword.png' },
  { id: 'axe', label: 'Axe', icon: '/kits/axe.png' },
  { id: 'mace', label: 'Mace', icon: '/kits/mace.png' }
];

export const kitById = (id) => KITS.find((kit) => kit.id === id);

// Tier'ların puana katkısı (kullanıcı tanımı)
// HT1:60 HT2:40 HT3:20 / LT1:50 LT2:30 LT3:10 — Tier 4/5 puan getirmez
export const TIER_POINTS = {
  HT1: 60,
  LT1: 50,
  HT2: 40,
  LT2: 30,
  HT3: 20,
  LT3: 10,
  HT4: 0,
  LT4: 0,
  HT5: 0,
  LT5: 0
};

// Görüntülenecek tier kolonları (fotoğraftaki gibi Tier 1..5)
export const TIER_COLUMNS = [1, 2, 3, 4, 5];

// NeptunePvP rolleri — toplam puana göre
export const ROLES = [
  { id: 'grandmaster', label: 'Grandmaster', full: 'NeptunePvP Grandmaster', min: 160, tone: 'gm', img: '/ranks/grandmaster.png' },
  { id: 'master', label: 'Master', full: 'NeptunePvP Master', min: 120, tone: 'master', img: '/ranks/master.png' },
  { id: 'diamond', label: 'Diamond', full: 'NeptunePvP Diamond', min: 90, tone: 'diamond', img: '/ranks/diamond.png' },
  { id: 'gold', label: 'Gold', full: 'NeptunePvP Gold', min: 70, tone: 'gold', img: '/ranks/gold.png' },
  { id: 'silver', label: 'Silver', full: 'NeptunePvP Silver', min: 40, tone: 'silver', img: '/ranks/silver.png' },
  { id: 'copper', label: 'Copper', full: 'NeptunePvP Copper', min: 30, tone: 'copper', img: '/ranks/copper.png' }
];

export const UNRANKED = { id: 'unranked', label: 'Unranked', full: 'Derecesiz', min: 0, tone: 'unranked', img: null };

export function roleFor(points) {
  return ROLES.find((role) => points >= role.min) || UNRANKED;
}

// Bir oyuncunun tüm kitlerdeki tier'larından toplam puanı hesaplar
export function calcPoints(results = {}) {
  return Object.values(results).reduce((total, tier) => total + (TIER_POINTS[tier] || 0), 0);
}

// tier stringinden numara ve high/low bilgisi
export function parseTier(tier) {
  if (!tier) return null;
  const value = tier.toUpperCase();
  const high = value.startsWith('HT');
  const num = Number(value.replace(/[^0-9]/g, ''));
  return { high, num, value };
}

// tier'a görsel renk sınıfı
export function tierToneClass(tier) {
  const parsed = parseTier(tier);
  if (!parsed) return 'tier-empty';
  return `tier-t${parsed.num}`;
}

export const regionMeta = {
  NA: { label: 'North America', tone: 'na' },
  EU: { label: 'Europe', tone: 'eu' },
  AS: { label: 'Asia', tone: 'as' },
  OCE: { label: 'Oceania', tone: 'oce' },
  SA: { label: 'South America', tone: 'sa' }
};

export const REGION_FILTERS = ['ALL', 'NA', 'EU', 'AS', 'OCE', 'SA'];

// Skin görselleri mc-heads üzerinden gelir (gerçek hesap yoksa Steve döner)
export const skinFace = (name) => `https://mc-heads.net/avatar/${encodeURIComponent(name)}/80`;
export const skinBody = (name) => `https://mc-heads.net/player/${encodeURIComponent(name)}/100`;

// Varsayılan oyuncular — her oyuncunun kit bazlı tier sonuçları
export const defaultPlayers = [
  { id: 1, name: 'K1RBE', region: 'EU', results: { vanilla: 'HT1', uhc: 'HT1', pot: 'HT1', nethpot: 'HT1', smp: 'HT2', sword: 'HT1', axe: 'LT1', mace: 'HT2' } },
  { id: 2, name: 'Marlowww', region: 'NA', results: { vanilla: 'HT1', uhc: 'LT1', pot: 'HT1', nethpot: 'HT1', smp: 'HT1', sword: 'HT2', axe: 'HT1', mace: 'LT1' } },
  { id: 3, name: 'ItzRealMe', region: 'NA', results: { vanilla: 'HT2', uhc: 'HT1', pot: 'LT1', nethpot: 'HT1', smp: 'HT1', sword: 'LT2', axe: 'HT2', mace: 'LT2' } },
  { id: 4, name: 'N1tr0Blade', region: 'EU', results: { vanilla: 'HT2', uhc: 'LT1', pot: 'HT2', nethpot: 'LT1', smp: 'LT1', sword: 'HT1', axe: 'LT2', mace: 'HT3' } },
  { id: 5, name: 'janekv', region: 'EU', results: { vanilla: 'LT2', uhc: 'HT2', pot: 'HT1', nethpot: 'HT2', smp: 'HT2', sword: 'LT1', axe: 'HT3', mace: 'LT2' } },
  { id: 6, name: 'Swight', region: 'AS', results: { vanilla: 'HT3', uhc: 'HT2', pot: 'HT2', nethpot: 'LT2', smp: 'LT2', sword: 'HT2', axe: 'LT2', mace: 'HT3' } },
  { id: 7, name: 'BeingFawliet', region: 'NA', results: { vanilla: 'LT2', uhc: 'HT3', pot: 'LT2', nethpot: 'HT2', smp: 'HT3', sword: 'LT2', axe: 'HT3', mace: 'LT3' } },
  { id: 8, name: 'Rexqt', region: 'EU', results: { vanilla: 'HT3', uhc: 'LT2', pot: 'HT3', nethpot: 'LT2', smp: 'LT2', sword: 'HT3', axe: 'LT3', mace: 'HT4' } },
  { id: 9, name: 'Verglobe', region: 'EU', results: { vanilla: 'LT3', uhc: 'HT3', pot: 'LT2', nethpot: 'HT3', smp: 'LT3', sword: 'HT4', axe: 'LT3', mace: 'HT4' } },
  { id: 10, name: 'KittyCPVP', region: 'NA', results: { vanilla: 'HT3', uhc: 'LT3', pot: 'HT3', nethpot: 'LT3', smp: 'HT3', sword: 'LT3', axe: 'HT4', mace: 'LT4' } },
  { id: 11, name: 'cloudmlol', region: 'OCE', results: { vanilla: 'LT3', uhc: 'HT3', pot: 'LT3', nethpot: 'HT4', smp: 'LT3', sword: 'HT3', axe: 'LT4', mace: 'HT5' } },
  { id: 12, name: 'Kohaku', region: 'AS', results: { vanilla: 'HT4', uhc: 'LT3', pot: 'HT4', nethpot: 'LT3', smp: 'HT4', sword: 'LT4', axe: 'HT5', mace: 'LT4' } },
  { id: 13, name: 'quack55', region: 'SA', results: { vanilla: 'LT3', uhc: 'HT4', pot: 'LT3', nethpot: 'HT4', smp: 'LT4', sword: 'HT4', axe: 'LT4', mace: 'HT5' } },
  { id: 14, name: 'xMexus', region: 'EU', results: { vanilla: 'HT4', uhc: 'LT4', pot: 'HT4', nethpot: 'LT4', smp: 'HT4', sword: 'LT4', axe: 'HT5', mace: 'LT5' } },
  { id: 15, name: 'SnowzyMC', region: 'NA', results: { vanilla: 'LT4', uhc: 'HT4', pot: 'LT4', nethpot: 'HT5', smp: 'LT4', sword: 'HT5', axe: 'LT5', mace: 'HT5' } },
  { id: 16, name: 'ZiggyOYT', region: 'AS', results: { vanilla: 'HT5', uhc: 'LT4', pot: 'HT5', nethpot: 'LT4', smp: 'HT5', sword: 'LT5', axe: 'HT5', mace: 'LT5' } },
  { id: 17, name: 'freelist', region: 'EU', results: { vanilla: 'LT4', uhc: 'HT5', pot: 'LT5', nethpot: 'HT5', smp: 'LT5', sword: 'HT5', axe: 'LT5', mace: 'HT5' } },
  { id: 18, name: 'Chris8238', region: 'NA', results: { vanilla: 'HT5', uhc: 'LT5', pot: 'HT5', nethpot: 'LT5', smp: 'HT5', sword: 'LT5', axe: 'HT5', mace: 'LT5' } }
];

export const newsItems = [
  {
    id: 'n1',
    tag: 'Duyuru',
    date: '12 Ağu 2026',
    title: 'Sezon 4 sıralamaları başladı',
    body: 'Yeni sezonla birlikte tüm oyuncuların puanları sıfırlandı. İlk testler bu hafta sonu Sword ve Vanilla kitlerinde yapılacak. Discord üzerinden test talebi oluşturabilirsiniz.'
  },
  {
    id: 'n2',
    tag: 'Güncelleme',
    date: '5 Ağu 2026',
    title: 'Mace kiti resmi olarak eklendi',
    body: 'Topluluğun uzun süredir beklediği Mace kiti artık sıralamalara dahil. HT1 rozetini kapan ilk oyuncu ödül kazanacak.'
  },
  {
    id: 'n3',
    tag: 'Etkinlik',
    date: '28 Tem 2026',
    title: 'Yaz turnuvası kayıtları açık',
    body: 'Bölgesel elemeler NA, EU ve AS için ayrı ayrı düzenlenecek. Başvurular sekmesinden tester ekibine katılabilirsiniz.'
  }
];
