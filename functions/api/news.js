import { json, handleOptions, isAdmin, kvGet, kvPut, uid } from '../_shared.js';

const DEFAULT_NEWS = [
  { id: 'n1', title: 'NepTierList yeni sürüm', body: 'Site tamamen yenilendi, sıralama artık tier puanlarına göre.', tag: 'Güncelleme' },
  { id: 'n2', title: 'Tier göç sistemi açıldı', body: 'Diğer platformlardaki tier\'ını taşımak için üst panelden başvur.', tag: 'Yeni' },
  { id: 'n3', title: 'Başvurular değerlendiriliyor', body: 'Test başvuruları düzenli olarak inceleniyor, sabırlı ol.', tag: 'Duyuru' }
];

export function onRequestOptions() {
  return handleOptions();
}

export async function onRequestGet(context) {
  const items = await kvGet(context, 'news', null);
  return json({ items: Array.isArray(items) && items.length ? items : DEFAULT_NEWS });
}

// Admin: tüm haber listesini değiştirir.
export async function onRequestPut(context) {
  if (!isAdmin(context)) return json({ error: 'Unauthorized' }, { status: 401 });
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'Geçersiz JSON' }, { status: 400 });
  }
  const list = Array.isArray(body.items) ? body.items : [];
  const items = list
    .map((item) => ({
      id: item.id || uid(),
      title: String(item.title ?? '').trim().slice(0, 120),
      body: String(item.body ?? '').trim().slice(0, 400),
      tag: String(item.tag ?? '').trim().slice(0, 30) || 'Duyuru'
    }))
    .filter((item) => item.title);
  const ok = await kvPut(context, 'news', items);
  if (!ok) return json({ error: 'Depolama bağlı değil (TIERLIST_KV).' }, { status: 503 });
  return json({ ok: true, count: items.length });
}
