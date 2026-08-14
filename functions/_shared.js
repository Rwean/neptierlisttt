// Ortak yardımcılar: CORS, KV erişimi ve yetkilendirme.

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...(init.headers || {}) }
  });
}

export function handleOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// Botun kullandığı token (ADMIN_API_TOKEN) ya da admin panelinin şifresi (ADMIN_PASSWORD)
// ile yetki kontrolü. İkisinden biri eşleşirse yetkilidir.
export function isAuthorized(context) {
  const header = context.request.headers.get('authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;

  const botToken = context.env.ADMIN_API_TOKEN;
  const adminPass = context.env.ADMIN_PASSWORD;

  return (botToken && token === botToken) || (adminPass && token === adminPass);
}

export function isAdmin(context) {
  const header = context.request.headers.get('authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  return context.env.ADMIN_PASSWORD && token === context.env.ADMIN_PASSWORD;
}

export async function kvGet(context, key, fallback = null) {
  if (!context.env.TIERLIST_KV) return fallback;
  const value = await context.env.TIERLIST_KV.get(key, 'json');
  return value ?? fallback;
}

export async function kvPut(context, key, value) {
  if (!context.env.TIERLIST_KV) return false;
  await context.env.TIERLIST_KV.put(key, JSON.stringify(value));
  return true;
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Ortak "başvuru/bildirim" koleksiyonu handler'ı üretir.
// key: KV anahtarı, validate: gelen gövdeyi doğrulayıp kayıt objesine çevirir.
export function makeCollection(key, validate) {
  return {
    onRequestOptions() {
      return handleOptions();
    },
    async onRequestGet(context) {
      if (!isAdmin(context)) return json({ error: 'Unauthorized' }, { status: 401 });
      const items = await kvGet(context, key, []);
      return json({ items });
    },
    async onRequestPost(context) {
      let body;
      try {
        body = await context.request.json();
      } catch {
        return json({ error: 'Geçersiz JSON' }, { status: 400 });
      }
      const record = validate(body);
      if (!record) return json({ error: 'Eksik veya hatalı alanlar' }, { status: 400 });

      const items = await kvGet(context, key, []);
      const entry = { id: uid(), status: 'pending', createdAt: new Date().toISOString(), ...record };
      items.unshift(entry);
      const ok = await kvPut(context, key, items.slice(0, 500));
      if (!ok) return json({ error: 'Depolama bağlı değil (TIERLIST_KV).' }, { status: 503 });
      return json({ ok: true, id: entry.id });
    },
    async onRequestPatch(context) {
      if (!isAdmin(context)) return json({ error: 'Unauthorized' }, { status: 401 });
      let body;
      try {
        body = await context.request.json();
      } catch {
        return json({ error: 'Geçersiz JSON' }, { status: 400 });
      }
      const { id, status } = body || {};
      if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
        return json({ error: 'id ve geçerli status gerekli' }, { status: 400 });
      }
      const items = await kvGet(context, key, []);
      const next = items.map((item) => (item.id === id ? { ...item, status } : item));
      await kvPut(context, key, next);
      return json({ ok: true });
    },
    async onRequestDelete(context) {
      if (!isAdmin(context)) return json({ error: 'Unauthorized' }, { status: 401 });
      let body;
      try {
        body = await context.request.json();
      } catch {
        return json({ error: 'Geçersiz JSON' }, { status: 400 });
      }
      const { id } = body || {};
      const items = await kvGet(context, key, []);
      await kvPut(context, key, items.filter((item) => item.id !== id));
      return json({ ok: true });
    }
  };
}
