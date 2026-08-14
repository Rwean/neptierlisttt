import { TIER_POINTS, COMBAT_KITS, titleForPoints } from './data.js';

// Bir oyuncunun toplam puanı: tüm kitlerdeki tier puanlarının toplamı.
export function totalPoints(player) {
  if (!player?.tiers) return 0;
  return Object.values(player.tiers).reduce((sum, tier) => sum + (TIER_POINTS[tier] || 0), 0);
}

// Belirli bir kitteki puan.
export function kitPoints(player, kitId) {
  const tier = player?.tiers?.[kitId];
  return TIER_POINTS[tier] || 0;
}

// Oyuncuyu görünürde kullanılacak alanlarla zenginleştirir.
export function decorate(player) {
  const points = totalPoints(player);
  return {
    ...player,
    region: 'TR',
    avatar: (player.name?.[0] || '?').toUpperCase(),
    points,
    title: titleForPoints(points)
  };
}

// Seçili kite göre sıralanmış liste döner.
export function rankPlayers(players, kitId, query = '') {
  const q = query.trim().toLowerCase();
  const scoreFn = kitId === 'overall' ? totalPoints : (p) => kitPoints(p, kitId);

  return players
    .map(decorate)
    .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
    .filter((p) => (kitId === 'overall' ? true : Boolean(p.tiers?.[kitId])))
    .map((p) => ({ ...p, score: scoreFn(p) }))
    .sort((a, b) => b.score - a.score || b.points - a.points);
}

// Minecraft skin başı (kullanıcı adı verilmişse) 3D render URL'i.
export function skinFace(skin) {
  if (!skin) return null;
  return `https://mc-heads.net/avatar/${encodeURIComponent(skin)}/128`;
}
export function skinBody(skin) {
  if (!skin) return null;
  return `https://mc-heads.net/body/${encodeURIComponent(skin)}/right`;
}

// ---- API yardımcıları ----

const ADMIN_KEY = 'neptierlist.adminToken';

export function getAdminToken() {
  try {
    return sessionStorage.getItem(ADMIN_KEY) || '';
  } catch {
    return '';
  }
}
export function setAdminToken(token) {
  try {
    if (token) sessionStorage.setItem(ADMIN_KEY, token);
    else sessionStorage.removeItem(ADMIN_KEY);
  } catch {
    /* yoksay */
  }
}

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Hata: ${res.status}`);
  return data;
}

function authHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  getTiers: () => request('/api/tiers'),
  getNews: () => request('/api/news'),

  adminLogin: (password) =>
    request('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password })
    }),

  savePlayers: (players, published = true) =>
    request('/api/tiers', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ players, published })
    }),

  saveNews: (items) =>
    request('/api/news', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ items })
    }),

  submit: (kind, payload) =>
    request(`/api/${kind}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    }),

  list: (kind) => request(`/api/${kind}`, { headers: authHeaders() }),

  setStatus: (kind, id, status) =>
    request(`/api/${kind}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ id, status })
    }),

  remove: (kind, id) =>
    request(`/api/${kind}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ id })
    })
};
