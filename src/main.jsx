import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  supabase,
  TIER_POINTS,
  TIER_ORDER,
  CATEGORIES,
  getRank,
  calculateTotalScore,
  getTierArray,
  skinUrl,
  headUrl,
  ADMIN_USER,
  ADMIN_PASS,
  DISCORD_INVITE
} from './lib/supabase';
import { Activity, Bug, ChevronRight, Crown, Flame, Gauge, Info, LogIn, Menu, Newspaper, Save, ScrollText, Search, ShieldCheck, Sparkles, Swords, Trophy, Users, X, Zap, ArrowRightLeft, CircleCheck as CheckCircle, Clock, Plus, Trash2, Pencil, CircleAlert as AlertCircle } from 'lucide-react';
import './styles.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [adminOpen, setAdminOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const [migrationOpen, setMigrationOpen] = useState(false);
  const [kitSelect, setKitSelect] = useState(null);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [playersRes, newsRes] = await Promise.all([
        supabase.from('players').select('*').order('total_score', { ascending: false }),
        supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false })
      ]);

      if (playersRes.error) throw playersRes.error;
      if (newsRes.error) throw newsRes.error;

      setPlayers(playersRes.data || []);
      setNews(newsRes.data || []);
    } catch (err) {
      setError(err.message || 'Veri yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setNavHidden(currentY > lastY && currentY > 80);
      lastY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      const isA = event.key.toLowerCase() === 'a';
      if (event.shiftKey && isA && (event.metaKey || event.ctrlKey || event.getModifierState('OS'))) {
        event.preventDefault();
        setAdminOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const sortedPlayers = useMemo(() => {
    return [...players]
      .filter((player) => player.display_name?.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
  }, [players, query]);

  const top3 = sortedPlayers.slice(0, 3);
  const restPlayers = sortedPlayers.slice(3);

  const stats = useMemo(() => ({
    total: players.length,
    active: players.length,
    news: news.length
  }), [players.length, news.length]);

  return (
    <>
      <TopNav
        navHidden={navHidden}
        onBugReport={() => setBugOpen(true)}
        onMigration={() => setMigrationOpen(true)}
        onAdmin={() => setAdminOpen(true)}
      />

      {view === 'home' && (
        <main className="app-shell">
          {error && <div className="error-banner"><AlertCircle size={18} /> {error}</div>}

          <Top3Showcase players={top3} loading={loading} />

          <NewsTicker news={news} />

          <section className="toolbar" id="ranking">
            <div className="toolbar-left">
              <p className="section-kicker">Canlı sıralama</p>
              <h2>Tier Listesi</h2>
            </div>
            <div className="toolbar-right">
              <button className="info-btn" onClick={() => setInfoOpen(true)}>
                <Info size={18} /> <span>Information</span>
              </button>
              <label className="search">
                <Search size={18} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Oyuncu ara..." />
              </label>
            </div>
          </section>

          <TierBoard players={restPlayers} loading={loading} startIndex={3} />

          <KitSelectionSection onSelect={(kit) => setKitSelect(kit)} />

          <ApplicationSection />

          <Footer />
        </main>
      )}

      {infoOpen && <InfoModal tiers={TIER_POINTS} onClose={() => setInfoOpen(false)} />}

      {bugOpen && <BugReportModal onClose={() => setBugOpen(false)} />}

      {migrationOpen && (
        <TierMigrationModal players={players} onClose={() => setMigrationOpen(false)} onSubmitted={fetchData} />
      )}

      {kitSelect && <KitDetailModal kit={kitSelect} onClose={() => setKitSelect(null)} />}

      {adminOpen && (
        <AdminPanel
          authed={authed}
          setAuthed={setAuthed}
          onClose={() => setAdminOpen(false)}
          onChanged={fetchData}
        />
      )}
    </>
  );
}

function TopNav({ navHidden, onBugReport, onMigration, onAdmin }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className={`topbar ${navHidden ? 'topbar-hidden' : ''}`}>
      <a className="brand" href="#home"><Sparkles size={20} /> NepTierList</a>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
        <a href="#home" onClick={() => setMobileOpen(false)}>Ana Sayfa</a>
        <a href="#ranking" onClick={() => setMobileOpen(false)}>Sıralama</a>
        <a href="#kits" onClick={() => setMobileOpen(false)}>Kitler</a>
        <a href="#basvuru" onClick={() => setMobileOpen(false)}>Başvuru</a>
        <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)}>Discord</a>
        <button className="nav-btn" onClick={() => { onBugReport(); setMobileOpen(false); }}>
          <Bug size={16} /> <span>Hata Bildir</span>
        </button>
        <button className="nav-btn" onClick={() => { onMigration(); setMobileOpen(false); }}>
          <ArrowRightLeft size={16} /> <span>Tier Göç</span>
        </button>
        <a className="nav-btn primary" href="/api/discord/login">
          <LogIn size={16} /> <span>Discord ile Giriş</span>
        </a>
        <button className="nav-btn admin" onClick={() => { onAdmin(); setMobileOpen(false); }} title="Admin (Ctrl+Shift+A)">
          <ShieldCheck size={16} />
        </button>
      </div>
    </nav>
  );
}

function Top3Showcase({ players, loading }) {
  const podiumOrder = [1, 0, 2];
  return (
    <section className="top3-showcase" id="home">
      <div className="showcase-bg" />
      <h2 className="showcase-title">
        <Crown size={28} /> En İyi 3 Oyuncu
      </h2>
      <div className="podium">
        {loading ? (
          <div className="podium-loading">Yükleniyor...</div>
        ) : players.length === 0 ? (
          <div className="podium-loading">Henüz oyuncu yok</div>
        ) : (
          podiumOrder.map((idx) => {
            const player = players[idx];
            if (!player) return null;
            const place = idx + 1;
            return (
              <div key={player.id} className={`podium-card place-${place}`}>
                <div className="podium-rank-badge">{place === 1 ? '👑' : `#${place}`}</div>
                <div className="podium-skin">
                  <img
                    src={skinUrl(player.minecraft_username || player.display_name, 180)}
                    alt={player.display_name}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="podium-info">
                  <h3>{player.display_name}</h3>
                  <p className="podium-rank-text">{getRank(player.total_score || 0)}</p>
                  <div className="podium-score">
                    <Trophy size={16} /> {player.total_score || 0} puan
                  </div>
                  <div className="podium-tiers">
                    {getTierArray(player.tiers).slice(0, 5).map((tier, i) => (
                      <span key={i} className={`mini-tier tier-${tier}`}>{tier}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function NewsTicker({ news }) {
  const items = news.length > 0 ? news : [
    { title: 'Hoş geldiniz!', body: 'NepTierList - Minecraft PvP Tierlist' }
  ];
  return (
    <section className="news-ticker">
      <div className="ticker-badge"><Newspaper size={16} /> Haberler</div>
      <div className="ticker-track">
        <div className="ticker-content">
          {items.concat(items).map((item, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot" />
              <strong>{item.title}</strong>
              {item.body ? ` — ${item.body}` : ''}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function TierBoard({ players, loading, startIndex }) {
  if (loading) {
    return <div className="tier-board-loading">Sıralama yükleniyor...</div>;
  }
  if (players.length === 0) {
    return <div className="tier-board-empty">Bu kriterlere uygun oyuncu bulunamadı.</div>;
  }
  return (
    <section className="tier-board">
      <div className="board-head">
        <span>#</span>
        <span>Oyuncu</span>
        <span>Rütbe</span>
        <span>Puan</span>
        <span>Tierler</span>
      </div>
      {players.map((player, index) => (
        <PlayerRow key={player.id} player={player} index={startIndex + index} />
      ))}
    </section>
  );
}

function PlayerRow({ player, index }) {
  const [imgError, setImgError] = useState(false);
  const tiers = getTierArray(player.tiers);
  return (
    <article className="player-row">
      <div className="rank-cell">
        <strong>{index + 1}</strong>
      </div>
      <div className="player-cell">
        <div className="player-avatar">
          {!imgError && player.minecraft_username ? (
            <img
              src={headUrl(player.minecraft_username, 48)}
              alt={player.display_name}
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="avatar-fallback">{(player.display_name || '?')[0]}</span>
          )}
        </div>
        <div className="player-info">
          <h3>{player.display_name}</h3>
          <p className="player-region">
            <span className="region-badge">{player.region || 'TR'}</span>
            {player.minecraft_username && <span className="mc-user">@{player.minecraft_username}</span>}
          </p>
        </div>
      </div>
      <div className="player-rank">{getRank(player.total_score || 0)}</div>
      <div className="player-points">{player.total_score || 0}</div>
      <div className="tier-icons">
        {tiers.map((tier, tierIndex) => (
          <span className={`tier-pill tier-${tier}`} title={`${CATEGORIES[tierIndex]?.label || ''}: ${tier}`} key={tierIndex}>
            {CATEGORIES[tierIndex] && React.createElement(CATEGORY_ICONS[tierIndex], { size: 14 })}
            <b>{tier}</b>
          </span>
        ))}
      </div>
    </article>
  );
}

const CATEGORY_ICONS = [Swords, ShieldCheck, Activity, Crown, Gauge, Trophy, Users, Flame, Sparkles];

function KitSelectionSection({ onSelect }) {
  const kits = [
    { id: 'sword', name: 'Sword', icon: Swords, color: '#e7b84e', desc: 'Klasik kılıç dövüşü' },
    { id: 'crystal', name: 'Crystal', icon: ShieldCheck, color: '#4da3c7', desc: 'Kristal PvP' },
    { id: 'diapot', name: 'Diapot', icon: Activity, color: '#7fb069', desc: 'Diamond Pot' },
    { id: 'nethpot', name: 'Nethpot', icon: Crown, color: '#b06f4f', desc: 'Netherite Pot' },
    { id: 'axe', name: 'Axe', icon: Gauge, color: '#7587a5', desc: 'Balta savaşı' },
    { id: 'uhc', name: 'UHC', icon: Trophy, color: '#e7b84e', desc: 'Ultra Hardcore' },
    { id: 'smp', name: 'SMP', icon: Users, color: '#9fb4b8', desc: 'Survival Multiplayer' },
    { id: 'mace', name: 'Mace', icon: Flame, color: '#c73636', desc: 'Mace dövüşü' },
    { id: 'ogv', name: 'OGV', icon: Sparkles, color: '#4da3c7', desc: 'OGV modu' }
  ];
  return (
    <section className="kit-section" id="kits">
      <div className="section-header">
        <p className="section-kicker">Modlar</p>
        <h2>Kit Seç</h2>
        <p className="section-desc">Bir kiti seçerek o moddaki en iyi oyuncuları görüntüle.</p>
      </div>
      <div className="kit-grid">
        {kits.map((kit) => {
          const Icon = kit.icon;
          return (
            <button key={kit.id} className="kit-card" onClick={() => onSelect(kit)} style={{ '--kit-color': kit.color }}>
              <div className="kit-icon-wrap">
                <Icon size={32} />
              </div>
              <h3>{kit.name}</h3>
              <p>{kit.desc}</p>
              <ChevronRight size={18} className="kit-arrow" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function KitDetailModal({ kit, onClose }) {
  const [kitPlayers, setKitPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const kitIndex = CATEGORIES.findIndex((c) => c.key === kit.id);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('players').select('*').order('total_score', { ascending: false });
      const filtered = (data || []).map((p) => {
        const tiers = getTierArray(p.tiers);
        const tier = tiers[kitIndex] || '-';
        const points = TIER_POINTS[tier] || 0;
        return { ...p, _kitTier: tier, _kitPoints: points };
      }).filter((p) => p._kitTier !== '-').sort((a, b) => b._kitPoints - a._kitPoints);
      setKitPlayers(filtered);
      setLoading(false);
    })();
  }, [kit.id, kitIndex]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="kit-modal" onClick={(e) => e.stopPropagation()} style={{ '--kit-color': kit.color }}>
        <button className="icon-button close" onClick={onClose}><X size={18} /></button>
        <div className="kit-modal-header">
          <kit.icon size={36} />
          <h2>{kit.name}</h2>
          <p>{kit.desc}</p>
        </div>
        {loading ? (
          <div className="kit-modal-loading">Yükleniyor...</div>
        ) : kitPlayers.length === 0 ? (
          <div className="kit-modal-empty">Bu kitta henüz oyuncu yok.</div>
        ) : (
          <div className="kit-modal-list">
            {kitPlayers.map((p, i) => (
              <div key={p.id} className="kit-player-row">
                <span className="kit-rank">#{i + 1}</span>
                <span className="kit-name">{p.display_name}</span>
                <span className={`kit-tier tier-${p._kitTier}`}>{p._kitTier}</span>
                <span className="kit-points">{p._kitPoints} puan</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoModal({ tiers, onClose }) {
  const entries = Object.entries(tiers).sort((a, b) => b[1] - a[1]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="info-modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-button close" onClick={onClose}><X size={18} /></button>
        <Info size={32} />
        <h2>Tier Puanları</h2>
        <p className="info-desc">Her tierin puan karşılığı aşağıdadır. Toplam puan, 9 kategorideki tier puanlarının toplamıdır.</p>
        <div className="info-tiers">
          {entries.map(([tier, points]) => (
            <div key={tier} className={`info-tier-row tier-${tier}`}>
              <span className="info-tier-label">{tier}</span>
              <span className="info-tier-points">{points} Puan</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BugReportModal({ onClose }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    const { error } = await supabase.from('applications').insert({
      player_name: name || 'Anonim',
      notes: `HATA BİLDİRİMİ: ${desc}`,
      category: 'bug-report',
      status: 'pending'
    });
    setSending(false);
    if (!error) setSent(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bug-modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-button close" onClick={onClose}><X size={18} /></button>
        <Bug size={32} />
        <h2>Hata Bildir</h2>
        {sent ? (
          <div className="success-msg">
            <CheckCircle size={28} />
            <p>Hata bildirimin alındı! En kısa sürede incelenecek.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="bug-form">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Adın (opsiyonel)" />
            <textarea value={desc} onChange={(event) => setDesc(event.target.value)} placeholder="Hatayı detaylıca açıkla..." required rows={5} />
            <button className="primary" disabled={sending}>{sending ? 'Gönderiliyor...' : 'Gönder'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function TierMigrationModal({ players, onClose, onSubmitted }) {
  const [playerId, setPlayerId] = useState('');
  const [category, setCategory] = useState('sword');
  const [toTier, setToTier] = useState('HT1');
  const [reason, setReason] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    setSending(true);
    const tiers = getTierArray(player.tiers);
    const catIndex = CATEGORIES.findIndex((c) => c.key === category);
    const fromTier = tiers[catIndex] || '-';
    const { error } = await supabase.from('tier_migrations').insert({
      player_id: player.id,
      player_name: player.display_name,
      category,
      from_tier: fromTier,
      to_tier: toTier,
      reason,
      status: 'pending'
    });
    setSending(false);
    if (!error) {
      setSent(true);
      onSubmitted();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="migration-modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-button close" onClick={onClose}><X size={18} /></button>
        <ArrowRightLeft size={32} />
        <h2>Tier Göç Başvurusu</h2>
        {sent ? (
          <div className="success-msg">
            <CheckCircle size={28} />
            <p>Tier göç başvurun alındı! Admin onayı bekleniyor.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="migration-form">
            <select value={playerId} onChange={(event) => setPlayerId(event.target.value)} required>
              <option value="">Oyuncu seç...</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>{p.display_name}</option>
              ))}
            </select>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <select value={toTier} onChange={(event) => setToTier(event.target.value)}>
              {TIER_ORDER.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Sebep (opsiyonel)" rows={3} />
            <button className="primary" disabled={sending || !playerId}>{sending ? 'Gönderiliyor...' : 'Başvur'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function ApplicationSection() {
  const [name, setName] = useState('');
  const [mcUser, setMcUser] = useState('');
  const [category, setCategory] = useState('sword');
  const [requestedTier, setRequestedTier] = useState('HT1');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    const { error } = await supabase.from('applications').insert({
      player_name: name,
      minecraft_username: mcUser,
      category,
      requested_tier: requestedTier,
      notes,
      status: 'pending'
    });
    setSending(false);
    if (!error) {
      setSent(true);
      setName(''); setMcUser(''); setNotes('');
    }
  };

  return (
    <section className="application-section" id="basvuru">
      <div className="section-header">
        <p className="section-kicker">Aramıza Katıl</p>
        <h2>Başvuru</h2>
        <p className="section-desc">Tierlistte yer almak için başvurunu oluştur.</p>
      </div>
      {sent ? (
        <div className="success-card">
          <CheckCircle size={32} />
          <p>Başvurun alındı! Admin ekibi en kısa sürede inceleyecek.</p>
          <button className="ghost" onClick={() => setSent(false)}>Yeni Başvuru</button>
        </div>
      ) : (
        <form onSubmit={submit} className="application-form">
          <div className="form-row">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Oyuncu adı" required />
            <input value={mcUser} onChange={(event) => setMcUser(event.target.value)} placeholder="Minecraft kullanıcı adı" />
          </div>
          <div className="form-row">
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <select value={requestedTier} onChange={(event) => setRequestedTier(event.target.value)}>
              {TIER_ORDER.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Kendinden bahset..." rows={4} />
          <button className="primary" disabled={sending}>{sending ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}</button>
        </form>
      )}
    </section>
  );
}

function AdminPanel({ authed, setAuthed, onClose, onChanged }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('players');
  const [players, setPlayers] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [applications, setApplications] = useState([]);
  const [migrations, setMigrations] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const login = (event) => {
    event.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAuthed(true);
      setError('');
      return;
    }
    setError('Kullanıcı adı veya şifre hatalı.');
  };

  const loadAdminData = useCallback(async () => {
    const [p, n, a, m] = await Promise.all([
      supabase.from('players').select('*').order('total_score', { ascending: false }),
      supabase.from('news').select('*').order('created_at', { ascending: false }),
      supabase.from('applications').select('*').order('created_at', { ascending: false }),
      supabase.from('tier_migrations').select('*').order('created_at', { ascending: false })
    ]);
    setPlayers(p.data || []);
    setNewsList(n.data || []);
    setApplications(a.data || []);
    setMigrations(m.data || []);
  }, []);

  useEffect(() => {
    if (authed) loadAdminData();
  }, [authed, loadAdminData]);

  const savePlayer = async (player) => {
    const totalScore = calculateTotalScore(player.tiers);
    const { id, ...data } = player;
    const payload = { ...data, total_score: totalScore, updated_at: new Date().toISOString() };
    if (id) {
      await supabase.from('players').update(payload).eq('id', id);
    } else {
      await supabase.from('players').insert(payload);
    }
    setEditingPlayer(null);
    loadAdminData();
    onChanged();
  };

  const deletePlayer = async (id) => {
    await supabase.from('players').delete().eq('id', id);
    loadAdminData();
    onChanged();
  };

  const saveNews = async (newsItem) => {
    const { id, ...data } = newsItem;
    if (id) {
      await supabase.from('news').update(data).eq('id', id);
    } else {
      await supabase.from('news').insert(data);
    }
    loadAdminData();
    onChanged();
  };

  const deleteNews = async (id) => {
    await supabase.from('news').delete().eq('id', id);
    loadAdminData();
    onChanged();
  };

  const reviewApplication = async (id, status) => {
    await supabase.from('applications').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id);
    loadAdminData();
  };

  const reviewMigration = async (migration) => {
    await supabase.from('tier_migrations').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', migration.id);
    if (migration.player_id) {
      const { data: player } = await supabase.from('players').select('*').eq('id', migration.player_id).maybeSingle();
      if (player) {
        const tiers = { ...(player.tiers || {}) };
        if (typeof tiers[migration.category] === 'object') {
          tiers[migration.category] = { ...tiers[migration.category], tier: migration.to_tier };
        } else {
          tiers[migration.category] = migration.to_tier;
        }
        const totalScore = calculateTotalScore(tiers);
        await supabase.from('players').update({ tiers, total_score: totalScore, updated_at: new Date().toISOString() }).eq('id', player.id);
      }
    }
    loadAdminData();
    onChanged();
  };

  const rejectMigration = async (id) => {
    await supabase.from('tier_migrations').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id);
    loadAdminData();
  };

  if (!authed) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
          <button className="icon-button close" onClick={onClose}><X size={18} /></button>
          <form onSubmit={login} className="login-form">
            <ShieldCheck size={32} />
            <h2>Admin Paneli</h2>
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Kullanıcı adı" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifre" type="password" />
            {error && <p className="error">{error}</p>}
            <button className="primary">Giriş yap <ChevronRight size={17} /></button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="admin-panel admin-panel-wide" onClick={(e) => e.stopPropagation()}>
        <button className="icon-button close" onClick={onClose}><X size={18} /></button>
        <div className="admin-header">
          <h2>Admin Paneli</h2>
          <div className="admin-tabs">
            <button className={tab === 'players' ? 'active' : ''} onClick={() => setTab('players')}>Oyuncular</button>
            <button className={tab === 'news' ? 'active' : ''} onClick={() => setTab('news')}>Haberler</button>
            <button className={tab === 'apps' ? 'active' : ''} onClick={() => setTab('apps')}>Başvurular</button>
            <button className={tab === 'migrations' ? 'active' : ''} onClick={() => setTab('migrations')}>Tier Göçleri</button>
          </div>
        </div>

        {tab === 'players' && (
          <div className="admin-tab-content">
            <button className="primary add-btn" onClick={() => setEditingPlayer({ display_name: '', minecraft_username: '', tiers: {}, region: 'TR' })}>
              <Plus size={16} /> Yeni Oyuncu
            </button>
            <div className="admin-list">
              {players.map((p) => (
                <div key={p.id} className="admin-row">
                  <span className="admin-row-name">{p.display_name}</span>
                  <span className="admin-row-score">{p.total_score} puan</span>
                  <button className="icon-button" onClick={() => setEditingPlayer(p)}><Pencil size={16} /></button>
                  <button className="icon-button danger" onClick={() => deletePlayer(p.id)}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            {editingPlayer && (
              <PlayerEditor player={editingPlayer} onSave={savePlayer} onCancel={() => setEditingPlayer(null)} />
            )}
          </div>
        )}

        {tab === 'news' && (
          <NewsAdmin newsList={newsList} onSave={saveNews} onDelete={deleteNews} />
        )}

        {tab === 'apps' && (
          <div className="admin-list">
            {applications.length === 0 ? (
              <p className="admin-empty">Başvuru yok.</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="admin-row admin-row-app">
                  <div className="admin-row-info">
                    <strong>{app.player_name}</strong>
                    <span>{app.category} → {app.requested_tier || '-'}</span>
                    {app.notes && <p>{app.notes}</p>}
                    <span className={`status-badge status-${app.status}`}>{app.status}</span>
                  </div>
                  {app.status === 'pending' && (
                    <div className="admin-row-actions">
                      <button className="icon-button approve" onClick={() => reviewApplication(app.id, 'approved')}><CheckCircle size={16} /></button>
                      <button className="icon-button danger" onClick={() => reviewApplication(app.id, 'rejected')}><X size={16} /></button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'migrations' && (
          <div className="admin-list">
            {migrations.length === 0 ? (
              <p className="admin-empty">Tier göç başvurusu yok.</p>
            ) : (
              migrations.map((mig) => (
                <div key={mig.id} className="admin-row admin-row-app">
                  <div className="admin-row-info">
                    <strong>{mig.player_name}</strong>
                    <span>{mig.category}: {mig.from_tier || '-'} → {mig.to_tier}</span>
                    {mig.reason && <p>{mig.reason}</p>}
                    <span className={`status-badge status-${mig.status}`}>{mig.status}</span>
                  </div>
                  {mig.status === 'pending' && (
                    <div className="admin-row-actions">
                      <button className="icon-button approve" onClick={() => reviewMigration(mig)}><CheckCircle size={16} /></button>
                      <button className="icon-button danger" onClick={() => rejectMigration(mig.id)}><X size={16} /></button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerEditor({ player, onSave, onCancel }) {
  const [draft, setDraft] = useState({ ...player });
  const tiers = getTierArray(player.tiers);

  const updateTier = (catKey, value) => {
    setDraft((d) => ({
      ...d,
      tiers: { ...(d.tiers || {}), [catKey]: value }
    }));
  };

  return (
    <div className="player-editor-overlay" onClick={onCancel}>
      <div className="player-editor" onClick={(e) => e.stopPropagation()}>
        <h3>{player.id ? 'Oyuncuyu Düzenle' : 'Yeni Oyuncu'}</h3>
        <div className="form-row">
          <input value={draft.display_name || ''} onChange={(event) => setDraft({ ...draft, display_name: event.target.value })} placeholder="Görünen ad" />
          <input value={draft.minecraft_username || ''} onChange={(event) => setDraft({ ...draft, minecraft_username: event.target.value })} placeholder="Minecraft kullanıcı adı" />
        </div>
        <div className="tier-editor-grid">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.key} className="tier-editor-row">
              <label>{cat.label}</label>
              <select
                value={typeof draft.tiers?.[cat.key] === 'string' ? draft.tiers[cat.key] : draft.tiers?.[cat.key]?.tier || 'LT3'}
                onChange={(event) => updateTier(cat.key, event.target.value)}
              >
                {TIER_ORDER.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="editor-actions">
          <button className="ghost" onClick={onCancel}>İptal</button>
          <button className="primary" onClick={() => onSave(draft)}><Save size={16} /> Kaydet</button>
        </div>
      </div>
    </div>
  );
}

function NewsAdmin({ newsList, onSave, onDelete }) {
  const [editing, setEditing] = useState(null);
  return (
    <div className="admin-tab-content">
      <button className="primary add-btn" onClick={() => setEditing({ title: '', body: '', category: 'general', published: true })}>
        <Plus size={16} /> Yeni Haber
      </button>
      <div className="admin-list">
        {newsList.map((n) => (
          <div key={n.id} className="admin-row">
            <span className="admin-row-name">{n.title}</span>
            <span className={`status-badge status-${n.published ? 'published' : 'draft'}`}>{n.published ? 'yayında' : 'taslak'}</span>
            <button className="icon-button" onClick={() => setEditing(n)}><Pencil size={16} /></button>
            <button className="icon-button danger" onClick={() => onDelete(n.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      {editing && (
        <NewsEditor news={editing} onSave={(item) => { onSave(item); setEditing(null); }} onCancel={() => setEditing(null)} />
      )}
    </div>
  );
}

function NewsEditor({ news, onSave, onCancel }) {
  const [draft, setDraft] = useState({ ...news });
  return (
    <div className="player-editor-overlay" onClick={onCancel}>
      <div className="player-editor" onClick={(e) => e.stopPropagation()}>
        <h3>{news.id ? 'Haber Düzenle' : 'Yeni Haber'}</h3>
        <input value={draft.title || ''} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Başlık" />
        <textarea value={draft.body || ''} onChange={(event) => setDraft({ ...draft, body: event.target.value })} placeholder="İçerik" rows={4} />
        <div className="form-row">
          <input value={draft.category || ''} onChange={(event) => setDraft({ ...draft, category: event.target.value })} placeholder="Kategori" />
          <label className="checkbox-label">
            <input type="checkbox" checked={draft.published} onChange={(event) => setDraft({ ...draft, published: event.target.checked })} />
            Yayında
          </label>
        </div>
        <div className="editor-actions">
          <button className="ghost" onClick={onCancel}>İptal</button>
          <button className="primary" onClick={() => onSave(draft)}><Save size={16} /> Kaydet</button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Sparkles size={20} /> NepTierList
        </div>
        <p>Minecraft PvP Tierlist — Discord botu ile canlı güncellenir</p>
        <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="footer-discord">
          <ShieldCheck size={16} /> Discord'a Katıl
        </a>
      </div>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
