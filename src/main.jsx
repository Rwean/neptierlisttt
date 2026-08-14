import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  ChevronRight,
  Crown,
  Flame,
  Gauge,
  Lock,
  LogIn,
  Newspaper,
  Save,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Users,
  X
} from 'lucide-react';
import './styles.css';

const ADMIN_USER = 'Admin';
const ADMIN_PASS = String.raw`]&.RaD30P+B1ocaF+n!I-~QgPQxH8AEAHq'k7Ezsbco33EBGvA`;
const DISCORD_INVITE = 'https://discord.gg/neptiers';

const defaultPlayers = [
  {
    id: 1,
    name: 'Marlowww',
    rank: 'Savaş Büyük Ustası',
    points: 450,
    region: 'TR',
    avatar: 'M',
    accent: '#e7b84e',
    tiers: ['HT1', 'HT1', 'HT1', 'HT1', 'HT1', 'HT1', 'LT1', 'LT1']
  },
  {
    id: 2,
    name: 'ItzRealMe',
    rank: 'Savaş Ustası',
    points: 330,
    region: 'TR',
    avatar: 'I',
    accent: '#9fb4b8',
    tiers: ['HT3', 'HT1', 'HT1', 'HT1', 'HT1', 'LT2', 'LT2', 'LT2']
  },
  {
    id: 3,
    name: 'X Kişisi',
    rank: 'Savaş Ustası',
    points: 326,
    region: 'TR',
    avatar: 'X',
    accent: '#b06f4f',
    tiers: ['LT3', 'LT3', 'HT1', 'HT1', 'LT1', 'LT1', 'LT1', 'LT2']
  },
  {
    id: 4,
    name: 'Y Kişisi',
    rank: 'Savaş Ustası',
    points: 290,
    region: 'TR',
    avatar: 'Y',
    accent: '#7587a5',
    tiers: ['LT3', 'HT4', 'HT1', 'HT1', 'HT2', 'LT2', 'LT2', 'LT2']
  },
  {
    id: 5,
    name: 'janekv',
    rank: 'Savaş Ustası',
    points: 260,
    region: 'TR',
    avatar: 'J',
    accent: '#64748b',
    tiers: ['LT3', 'HT4', 'HT1', 'HT1', 'HT1', 'HT2', 'LT2', 'LT2']
  }
];

const modes = [
  { icon: Swords, label: 'Kılıç' },
  { icon: ShieldCheck, label: 'Kristal' },
  { icon: Activity, label: 'İksir' },
  { icon: Crown, label: 'Netherite' },
  { icon: Gauge, label: 'Balta' },
  { icon: Trophy, label: 'UHC' },
  { icon: Users, label: 'Takım' },
  { icon: Flame, label: 'Mace' }
];

function loadPlayers() {
  const saved = localStorage.getItem('neptierlist.players');
  return saved ? JSON.parse(saved).map((player) => ({ ...player, region: 'TR' })) : defaultPlayers;
}

function App() {
  const [players, setPlayers] = useState(loadPlayers);
  const [query, setQuery] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

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

  useEffect(() => {
    fetch('/api/tiers')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.players?.length) {
          setPlayers(data.players.map((player, index) => ({
            ...defaultPlayers[index % defaultPlayers.length],
            ...player,
            id: player.id || index + 1,
            region: 'TR',
            avatar: player.avatar || player.name?.[0]?.toUpperCase() || '?',
            tiers: player.tiers || defaultPlayers[index % defaultPlayers.length].tiers
          })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('neptierlist.players', JSON.stringify(players.map((player) => ({ ...player, region: 'TR' }))));
  }, [players]);

  const sortedPlayers = useMemo(() => {
    return [...players]
      .filter((player) => player.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.points - a.points);
  }, [players, query]);

  const stats = useMemo(() => ({
    tests: '1000+',
    active: 248,
    onlineRate: '%72',
    players: players.length
  }), [players.length]);

  return (
    <>
      <nav className={`topbar ${navHidden ? 'topbar-hidden' : ''}`}>
        <a className="brand" href="#home"><Sparkles size={18} /> NepTierList</a>
        <div className="nav-links">
          <a href="#home">Ana Sayfa</a>
          <a href={DISCORD_INVITE}>Discord</a>
          <a href="#haberler">Haberler</a>
          <a href="#basvuru">Başvuru</a>
        </div>
      </nav>

      <main className="app-shell" id="home">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Minecraft Türkiye Tierlist</p>
            <h1>NepTierList</h1>
            <p className="subtitle">Discord sunucundaki rollerle güncellenen, net ve hızlı okunabilen Minecraft tier sıralaması.</p>
            <div className="hero-actions">
              <a className="primary" href="/api/discord/login"><LogIn size={18} /> Discord ile giriş yap</a>
              <a className="ghost" href={DISCORD_INVITE}><ShieldCheck size={18} /> Sunucuya katıl</a>
            </div>
          </div>
          <div className="stats-grid">
            <Stat label="Toplam test" value={stats.tests} />
            <Stat label="Aktif üye" value={stats.active} />
            <Stat label="Aktiflik" value={stats.onlineRate} />
            <Stat label="Oyuncu" value={stats.players} />
          </div>
        </section>

        <section className="toolbar">
          <div>
            <p className="section-kicker">Canlı sıralama</p>
            <h2>Tier listesi</h2>
          </div>
          <label className="search">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Oyuncu ara" />
          </label>
        </section>

        <section className="tier-board">
          <div className="board-head">
            <span>#</span>
            <span>Oyuncu</span>
            <span>Bölge</span>
            <span>Tierler</span>
          </div>
          {sortedPlayers.map((player, index) => (
            <PlayerRow key={player.id} player={{ ...player, region: 'TR' }} index={index} />
          ))}
        </section>

        <section className="empty-section" id="haberler">
          <Newspaper size={22} />
          <h2>Haberler</h2>
        </section>

        <section className="empty-section" id="basvuru">
          <ScrollText size={22} />
          <h2>Başvuru</h2>
        </section>

        {adminOpen && (
          <AdminPanel
            authed={authed}
            setAuthed={setAuthed}
            players={players}
            setPlayers={setPlayers}
            onClose={() => setAdminOpen(false)}
          />
        )}
      </main>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PlayerRow({ player, index }) {
  return (
    <article className="player-row">
      <div className="rank-cell" style={{ '--accent': player.accent }}>
        <strong>{index + 1}</strong>
        <div className="avatar">{player.avatar}</div>
      </div>
      <div className="player-cell">
        <h3>{player.name}</h3>
        <p><Crown size={16} /> {player.rank} <span>{player.points} puan</span></p>
      </div>
      <div className="region">{player.region}</div>
      <div className="tier-icons">
        {player.tiers.map((tier, tierIndex) => {
          const ModeIcon = modes[tierIndex % modes.length].icon;
          return (
            <span className="tier-pill" title={`${modes[tierIndex].label} ${tier}`} key={`${tier}-${tierIndex}`}>
              <ModeIcon size={16} />
              <b>{tier}</b>
            </span>
          );
        })}
      </div>
    </article>
  );
}

function AdminPanel({ authed, setAuthed, players, setPlayers, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [draft, setDraft] = useState(players.map((player) => ({ ...player, region: 'TR' })));
  const [error, setError] = useState('');

  const login = (event) => {
    event.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAuthed(true);
      setError('');
      return;
    }
    setError('Kullanıcı adı veya şifre hatalı.');
  };

  const updatePlayer = (id, field, value) => {
    setDraft((items) => items.map((item) => item.id === id ? {
      ...item,
      [field]: field === 'points' ? Number(value) : value,
      region: 'TR'
    } : item));
  };

  const save = () => {
    setPlayers(draft.map((player) => ({ ...player, region: 'TR' })));
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <aside className="admin-panel">
        <button className="icon-button close" onClick={onClose} aria-label="Kapat"><X size={18} /></button>
        {!authed ? (
          <form onSubmit={login} className="login-form">
            <Lock size={30} />
            <h2>Admin Paneli</h2>
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Kullanıcı adı" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifre" type="password" />
            {error && <p className="error">{error}</p>}
            <button className="primary">Giriş yap <ChevronRight size={17} /></button>
          </form>
        ) : (
          <div className="editor">
            <div className="editor-head">
              <h2>Sıralamayı düzenle</h2>
              <button className="primary" onClick={save}><Save size={17} /> Kaydet</button>
            </div>
            {draft.map((player) => (
              <div className="edit-row" key={player.id}>
                <input value={player.name} onChange={(event) => updatePlayer(player.id, 'name', event.target.value)} />
                <input value={player.rank} onChange={(event) => updatePlayer(player.id, 'rank', event.target.value)} />
                <input value="TR" readOnly />
                <input type="number" value={player.points} onChange={(event) => updatePlayer(player.id, 'points', event.target.value)} />
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
