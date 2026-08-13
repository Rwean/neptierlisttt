import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  Crown,
  Gauge,
  Lock,
  LogIn,
  Save,
  Search,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
  X
} from 'lucide-react';
import './styles.css';

const ADMIN_USER = 'Admin';
const ADMIN_PASS = String.raw`]&.RaD30P+B1ocaF+n!I-~QgPQxH8AEAHq'k7Ezsbco33EBGvA`;

const defaultPlayers = [
  {
    id: 1,
    name: 'Marlowww',
    rank: 'Combat Grandmaster',
    points: 450,
    region: 'NA',
    avatar: 'M',
    accent: '#f4bf32',
    tiers: ['HT1', 'HT1', 'HT1', 'HT1', 'HT1', 'HT1', 'LT1', 'LT1']
  },
  {
    id: 2,
    name: 'ItzRealMe',
    rank: 'Combat Master',
    points: 330,
    region: 'NA',
    avatar: 'I',
    accent: '#9fb4b8',
    tiers: ['HT3', 'HT1', 'HT1', 'HT1', 'HT1', 'LT2', 'LT2', 'LT2']
  },
  {
    id: 3,
    name: 'X Kisisi',
    rank: 'Combat Master',
    points: 326,
    region: 'EU',
    avatar: 'X',
    accent: '#c26b2a',
    tiers: ['LT3', 'LT3', 'HT1', 'HT1', 'LT1', 'LT1', 'LT1', 'LT2']
  },
  {
    id: 4,
    name: 'Y Kisisi',
    rank: 'Combat Master',
    points: 290,
    region: 'NA',
    avatar: 'Y',
    accent: '#596d8b',
    tiers: ['LT3', 'HT4', 'HT1', 'HT1', 'HT2', 'LT2', 'LT2', 'LT2']
  },
  {
    id: 5,
    name: 'janekv',
    rank: 'Combat Master',
    points: 260,
    region: 'EU',
    avatar: 'J',
    accent: '#28313d',
    tiers: ['LT3', 'HT4', 'HT1', 'HT1', 'HT1', 'HT2', 'LT2', 'LT2']
  }
];

const modes = [
  { icon: Swords, label: 'Sword' },
  { icon: ShieldCheck, label: 'Crystal' },
  { icon: Activity, label: 'Potion' },
  { icon: Crown, label: 'Netherite' },
  { icon: Gauge, label: 'Axe' },
  { icon: Trophy, label: 'UHC' },
  { icon: Users, label: 'Team' },
  { icon: Swords, label: 'Mace' }
];

function loadPlayers() {
  const saved = localStorage.getItem('neptierlist.players');
  return saved ? JSON.parse(saved) : defaultPlayers;
}

function App() {
  const [players, setPlayers] = useState(loadPlayers);
  const [query, setQuery] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

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
          setPlayers((current) => data.players.map((player, index) => ({
            ...defaultPlayers[index % defaultPlayers.length],
            ...player,
            id: player.id || index + 1,
            avatar: player.avatar || player.name?.[0]?.toUpperCase() || '?',
            tiers: player.tiers || defaultPlayers[index % defaultPlayers.length].tiers
          })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('neptierlist.players', JSON.stringify(players));
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
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Minecraft Tierlist Discord</p>
          <h1>NepTierList</h1>
          <p className="subtitle">Discord rollerinden beslenen modern, anlik Minecraft tier siralamasi.</p>
          <div className="hero-actions">
            <a className="primary" href="/api/discord/login"><LogIn size={18} /> Discord ile giris yap</a>
            <button className="ghost"><ShieldCheck size={18} /> Canli rol senkronu</button>
          </div>
        </div>
        <div className="stats-grid">
          <Stat label="Test" value={stats.tests} />
          <Stat label="Aktif" value={stats.active} />
          <Stat label="Aktiflik" value={stats.onlineRate} />
          <Stat label="Oyuncu" value={stats.players} />
        </div>
      </section>

      <section className="toolbar">
        <div>
          <p className="section-kicker">Leaderboard</p>
          <h2>Tier siralamasi</h2>
        </div>
        <label className="search">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Oyuncu ara" />
        </label>
      </section>

      <section className="tier-board">
        <div className="board-head">
          <span>#</span>
          <span>Player</span>
          <span>Region</span>
          <span>Tiers</span>
        </div>
        {sortedPlayers.map((player, index) => (
          <PlayerRow key={player.id} player={player} index={index} />
        ))}
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
        <strong>{index + 1}.</strong>
        <div className="avatar">{player.avatar}</div>
      </div>
      <div className="player-cell">
        <h3>{player.name}</h3>
        <p><Crown size={16} /> {player.rank} <span>({player.points} points)</span></p>
      </div>
      <div className={`region ${player.region.toLowerCase()}`}>{player.region}</div>
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
  const [draft, setDraft] = useState(players);
  const [error, setError] = useState('');

  const login = (event) => {
    event.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAuthed(true);
      setError('');
      return;
    }
    setError('Bilgiler hatali.');
  };

  const updatePlayer = (id, field, value) => {
    setDraft((items) => items.map((item) => item.id === id ? {
      ...item,
      [field]: field === 'points' ? Number(value) : value
    } : item));
  };

  const save = () => {
    setPlayers(draft);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <aside className="admin-panel">
        <button className="icon-button close" onClick={onClose} aria-label="Kapat"><X size={18} /></button>
        {!authed ? (
          <form onSubmit={login} className="login-form">
            <Lock size={30} />
            <h2>Admin Panel</h2>
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sifre" type="password" />
            {error && <p className="error">{error}</p>}
            <button className="primary">Giris yap</button>
          </form>
        ) : (
          <div className="editor">
            <div className="editor-head">
              <h2>Siralamayi duzenle</h2>
              <button className="primary" onClick={save}><Save size={17} /> Kaydet</button>
            </div>
            {draft.map((player) => (
              <div className="edit-row" key={player.id}>
                <input value={player.name} onChange={(event) => updatePlayer(player.id, 'name', event.target.value)} />
                <input value={player.rank} onChange={(event) => updatePlayer(player.id, 'rank', event.target.value)} />
                <input value={player.region} onChange={(event) => updatePlayer(player.id, 'region', event.target.value.toUpperCase())} />
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
