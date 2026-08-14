import { json, handleOptions, isAuthorized, kvGet, kvPut, uid } from '../_shared.js';

// Geçerli tier değerleri (puanlama sitede yapılır, burada sadece saklanır).
const VALID_TIERS = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3'];

// Botun/adminin gönderdiği bir oyuncuyu güvenli biçime çevirir.
function normalizePlayer(raw, index) {
  if (!raw || typeof raw !== 'object') return null;
  const name = String(raw.name ?? raw.username ?? raw.player ?? '').trim();
  if (!name) return null;

  // tiers: { vanilla: "HT1", uhc: "LT2", ... } biçimi beklenir.
  const tiers = {};
  const source = raw.tiers && typeof raw.tiers === 'object' ? raw.tiers : {};
  for (const [key, value] of Object.entries(source)) {
    const tier = String(value ?? '').toUpperCase().trim();
    if (VALID_TIERS.includes(tier)) {
      tiers[String(key).toLowerCase().trim()] = tier;
    }
  }

  return {
    id: raw.id ? String(raw.id) : `p_${index}_${uid()}`,
    name,
    region: 'TR',
    // Minecraft kullanıcı adı gönderilirse skin render için kullanılır (opsiyonel).
    skin: raw.skin ? String(raw.skin).trim() : (raw.mc ? String(raw.mc).trim() : null),
    accent: typeof raw.accent === 'string' ? raw.accent : null,
    tiers
  };
}

export function onRequestOptions() {
  return handleOptions();
}

export async function onRequestGet(context) {
  const stored = await kvGet(context, 'players', null);
  const meta = await kvGet(context, 'players_meta', {});

  return json({
    updatedAt: meta.updatedAt || null,
    published: meta.published !== false,
    players: Array.isArray(stored) ? stored : []
  });
}

export async function onRequestPost(context) {
  if (!isAuthorized(context)) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'Geçersiz JSON' }, { status: 400 });
  }

  // Hem { players: [...] } hem de doğrudan [...] kabul edilir.
  const list = Array.isArray(body) ? body : body.players;
  if (!Array.isArray(list)) {
    return json({ error: 'players dizisi gerekli' }, { status: 400 });
  }

  const players = list.map(normalizePlayer).filter(Boolean);

  const saved = await kvPut(context, 'players', players);
  if (!saved) {
    return json({ error: 'TIERLIST_KV bağlı değil. Cloudflare Pages > Settings > Functions > KV bindings kısmından ekleyin.' }, { status: 503 });
  }

  await kvPut(context, 'players_meta', {
    updatedAt: new Date().toISOString(),
    published: body.published !== false
  });

  return json({ ok: true, count: players.length });
}
