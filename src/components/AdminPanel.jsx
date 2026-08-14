import React, { useEffect, useState } from 'react';
import {
  Lock,
  X,
  Save,
  Plus,
  Trash2,
  Users,
  Newspaper,
  ArrowLeftRight,
  ScrollText,
  TriangleAlert,
  Check,
  Ban,
  Rocket,
  LogOut
} from 'lucide-react';
import { api, getAdminToken, setAdminToken } from '../lib.js';
import { COMBAT_KITS, TIER_ORDER } from '../data.js';

const TABS = [
  { id: 'players', label: 'Sıralama', icon: Users },
  { id: 'migrations', label: 'Tier Göç', icon: ArrowLeftRight },
  { id: 'applications', label: 'Başvurular', icon: ScrollText },
  { id: 'reports', label: 'Hatalar', icon: TriangleAlert },
  { id: 'news', label: 'Haberler', icon: Newspaper }
];

export default function AdminPanel({ players, onPublished, onClose }) {
  const [authed, setAuthed] = useState(Boolean(getAdminToken()));
  const [tab, setTab] = useState('players');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const logout = () => {
    setAdminToken('');
    setAuthed(false);
  };

  return (
    <div className="admin-overlay">
      <div className="admin-shell">
        <header className="admin-top">
          <div className="admin-brand">
            <Lock size={16} /> Admin Paneli
          </div>
          <div className="admin-top-actions">
            {authed && (
              <button className="nav-chip" onClick={logout}>
                <LogOut size={15} /> Çıkış
              </button>
            )}
            <button className="icon-button" onClick={onClose} aria-label="Kapat">
              <X size={18} />
            </button>
          </div>
        </header>

        {!authed ? (
          <LoginForm onSuccess={() => setAuthed(true)} />
        ) : (
          <div className="admin-content">
            <nav className="admin-tabs">
              {TABS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`admin-tab ${tab === item.id ? 'active' : ''}`}
                    onClick={() => setTab(item.id)}
                  >
                    <Icon size={16} /> {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="admin-panel-body">
              {tab === 'players' && <PlayersEditor initial={players} onPublished={onPublished} />}
              {tab === 'news' && <NewsEditor />}
              {tab === 'migrations' && <RequestList kind="migrations" render={renderMigration} />}
              {tab === 'applications' && <RequestList kind="applications" render={renderApplication} />}
              {tab === 'reports' && <RequestList kind="reports" render={renderReport} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginForm({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.adminLogin(password);
      setAdminToken(password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="admin-login" onSubmit={submit}>
      <Lock size={30} />
      <h2>Yönetici girişi</h2>
      <p>Devam etmek için admin şifresini gir.</p>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Şifre"
        autoFocus
      />
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-primary" disabled={busy}>
        {busy ? 'Kontrol ediliyor...' : 'Giriş yap'}
      </button>
    </form>
  );
}

function emptyPlayer() {
  return { id: `new_${Math.random().toString(36).slice(2, 8)}`, name: '', region: 'TR', skin: '', accent: '', tiers: {} };
}

function PlayersEditor({ initial, onPublished }) {
  const [draft, setDraft] = useState(() => initial.map((p) => ({ ...p, tiers: { ...p.tiers } })));
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (id, field, value) =>
    setDraft((list) => list.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const setTier = (id, kitId, value) =>
    setDraft((list) =>
      list.map((p) => {
        if (p.id !== id) return p;
        const tiers = { ...p.tiers };
        if (value) tiers[kitId] = value;
        else delete tiers[kitId];
        return { ...p, tiers };
      })
    );

  const addPlayer = () => setDraft((list) => [...list, emptyPlayer()]);
  const removePlayer = (id) => setDraft((list) => list.filter((p) => p.id !== id));

  const publish = async () => {
    setBusy(true);
    setStatus('');
    try {
      const clean = draft.filter((p) => p.name.trim());
      await api.savePlayers(clean, true);
      setStatus('Panel yayınlandı ve siteye işlendi.');
      onPublished?.();
    } catch (err) {
      setStatus(`Hata: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="players-editor">
      <div className="editor-toolbar">
        <button className="btn btn-ghost" onClick={addPlayer}>
          <Plus size={16} /> Oyuncu ekle
        </button>
        <button className="btn btn-primary" onClick={publish} disabled={busy}>
          <Rocket size={16} /> {busy ? 'Yayınlanıyor...' : 'Paneli yayınla'}
        </button>
      </div>
      {status && <p className="editor-status">{status}</p>}

      <div className="editor-list">
        {draft.map((player) => (
          <div className="editor-card" key={player.id}>
            <div className="editor-fields">
              <label className="field">
                <span>İsim</span>
                <input value={player.name} onChange={(e) => update(player.id, 'name', e.target.value)} placeholder="Oyuncu adı" />
              </label>
              <label className="field">
                <span>Skin (MC adı)</span>
                <input value={player.skin || ''} onChange={(e) => update(player.id, 'skin', e.target.value)} placeholder="opsiyonel" />
              </label>
              <label className="field field-color">
                <span>Renk</span>
                <input type="color" value={player.accent || '#e7b84e'} onChange={(e) => update(player.id, 'accent', e.target.value)} />
              </label>
              <button className="icon-button danger" onClick={() => removePlayer(player.id)} aria-label="Sil">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="editor-tiers">
              {COMBAT_KITS.map((kit) => (
                <label key={kit.id} className="tier-select" style={{ '--kit-color': kit.color }}>
                  <span>{kit.label}</span>
                  <select value={player.tiers?.[kit.id] || ''} onChange={(e) => setTier(player.id, kit.id, e.target.value)}>
                    <option value="">—</option>
                    {TIER_ORDER.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="editor-footer">
        <button className="btn btn-primary" onClick={publish} disabled={busy}>
          <Save size={16} /> {busy ? 'Kaydediliyor...' : 'Kaydet ve yayınla'}
        </button>
      </div>
    </div>
  );
}

function NewsEditor() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getNews().then((data) => setItems(data.items || [])).catch(() => {});
  }, []);

  const update = (i, field, value) => setItems((list) => list.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  const add = () => setItems((list) => [...list, { id: `new_${Math.random().toString(36).slice(2, 8)}`, title: '', body: '', tag: 'Duyuru' }]);
  const remove = (i) => setItems((list) => list.filter((_, idx) => idx !== i));

  const save = async () => {
    setBusy(true);
    setStatus('');
    try {
      await api.saveNews(items.filter((item) => item.title.trim()));
      setStatus('Haberler kaydedildi.');
    } catch (err) {
      setStatus(`Hata: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="news-editor">
      <div className="editor-toolbar">
        <button className="btn btn-ghost" onClick={add}>
          <Plus size={16} /> Haber ekle
        </button>
        <button className="btn btn-primary" onClick={save} disabled={busy}>
          <Save size={16} /> {busy ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
      {status && <p className="editor-status">{status}</p>}

      <div className="editor-list">
        {items.map((item, i) => (
          <div className="editor-card" key={item.id || i}>
            <div className="editor-fields">
              <label className="field">
                <span>Başlık</span>
                <input value={item.title} onChange={(e) => update(i, 'title', e.target.value)} />
              </label>
              <label className="field field-tag">
                <span>Etiket</span>
                <input value={item.tag} onChange={(e) => update(i, 'tag', e.target.value)} />
              </label>
              <button className="icon-button danger" onClick={() => remove(i)} aria-label="Sil">
                <Trash2 size={16} />
              </button>
            </div>
            <label className="field">
              <span>Metin</span>
              <textarea rows={2} value={item.body} onChange={(e) => update(i, 'body', e.target.value)} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestList({ kind, render }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    api
      .list(kind)
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err.message));
  };

  useEffect(load, [kind]);

  const setStatus = async (id, status) => {
    await api.setStatus(kind, id, status).catch(() => {});
    load();
  };
  const remove = async (id) => {
    await api.remove(kind, id).catch(() => {});
    load();
  };

  if (error) return <p className="form-error">{error}</p>;
  if (!items) return <p className="editor-status">Yükleniyor...</p>;
  if (items.length === 0) return <p className="editor-status">Kayıt yok.</p>;

  return (
    <div className="request-list">
      {items.map((item) => (
        <div className={`request-card status-${item.status}`} key={item.id}>
          <div className="request-body">{render(item)}</div>
          <div className="request-actions">
            <span className={`status-badge ${item.status}`}>
              {item.status === 'approved' ? 'Onaylı' : item.status === 'rejected' ? 'Red' : 'Beklemede'}
            </span>
            <button className="icon-button ok" onClick={() => setStatus(item.id, 'approved')} aria-label="Onayla">
              <Check size={16} />
            </button>
            <button className="icon-button warn" onClick={() => setStatus(item.id, 'rejected')} aria-label="Reddet">
              <Ban size={16} />
            </button>
            <button className="icon-button danger" onClick={() => remove(item.id)} aria-label="Sil">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function renderMigration(item) {
  return (
    <>
      <h4>{item.player}</h4>
      <p>
        <b>{item.fromPlatform}</b> → {item.kit} / {item.tier}
      </p>
      {item.proof && (
        <a href={item.proof} target="_blank" rel="noreferrer" className="request-link">
          Kanıt linki
        </a>
      )}
    </>
  );
}

function renderApplication(item) {
  return (
    <>
      <h4>{item.player}</h4>
      <p>
        Kit: <b>{item.kit}</b>
        {item.discord ? ` • Discord: ${item.discord}` : ''}
      </p>
      {item.experience && <p className="request-note">{item.experience}</p>}
    </>
  );
}

function renderReport(item) {
  return (
    <>
      <h4>{item.subject || 'Genel'}</h4>
      <p className="request-note">{item.message}</p>
      {item.contact && <p className="request-meta">İletişim: {item.contact}</p>}
    </>
  );
}
