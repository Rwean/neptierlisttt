import { json, handleOptions } from '../../_shared.js';

export function onRequestOptions() {
  return handleOptions();
}

// Admin paneli girişini doğrular. Başarılıysa client, şifreyi sonraki
// admin isteklerinde Authorization: Bearer <şifre> olarak gönderir.
export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'Geçersiz JSON' }, { status: 400 });
  }

  const password = String(body.password ?? '');
  const expected = context.env.ADMIN_PASSWORD;

  if (!expected) {
    return json({ error: 'ADMIN_PASSWORD ayarlı değil. Cloudflare env değişkenlerine ekleyin.' }, { status: 503 });
  }

  if (password !== expected) {
    return json({ error: 'Şifre hatalı.' }, { status: 401 });
  }

  return json({ ok: true });
}
