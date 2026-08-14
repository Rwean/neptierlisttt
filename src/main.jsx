import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, X } from 'lucide-react';
import { defaultPlayers } from './data.js';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Leaderboard } from './components/Leaderboard.jsx';
import { News } from './pages/News.jsx';
import { Feedback } from './pages/Feedback.jsx';
import { Applications } from './pages/Applications.jsx';
import { AdminPanel } from './components/AdminPanel.jsx';
import './styles.css';

function loadPlayers() {
  const saved = localStorage.getItem('neptierlist.players');
  return saved ? JSON.parse(saved) : defaultPlayers;
}

function App() {
  const [players, setPlayers] = useState(loadPlayers);
  const [view, setView] = useState('home');
  const [adminOpen, setAdminOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Admin panel kısayolu: Ctrl/Cmd + Shift + A
  useEffect(() => {
    const onKey = (event) => {
      const isA = event.key.toLowerCase() === 'a';
      if (event.shiftKey && isA && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setAdminOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Discord callback dönüşünü karşıla
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const login = params.get('login');
    if (login === 'discord') {
      setUser('Discord Üyesi');
      setToast({ type: 'success', text: 'Discord ile giriş başarılı!' });
    } else if (login === 'failed') {
      setToast({ type: 'error', text: 'Discord girişi başarısız oldu.' });
    }
    if (login) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Sunucudan güncel sıralamayı çek
  useEffect(() => {
    fetch('/api/tiers')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.players?.length) {
          setPlayers(() =>
            data.players.map((player, index) => ({
              ...defaultPlayers[index % defaultPlayers.length],
              ...player,
              id: player.id || index + 1,
              avatar: player.avatar || player.name?.[0]?.toUpperCase() || '?',
              tiers:
                player.tiers || defaultPlayers[index % defaultPlayers.length].tiers
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('neptierlist.players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(
    () => ({
      tests: '1000+',
      active: 248,
      onlineRate: '%72',
      players: players.length
    }),
    [players.length]
  );

  return (
    <div className="app">
      <Navbar view={view} setView={setView} user={user} />

      <main className="content">
        {view === 'home' && (
          <>
            <Hero stats={stats} user={user} />
            <Leaderboard players={players} />
          </>
        )}
        {view === 'news' && <News />}
        {view === 'feedback' && <Feedback />}
        {view === 'applications' && <Applications user={user} />}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">
            Nep<span>TierList</span>
          </span>
          <p>Minecraft PvP topluluğu için bağımsız tier platformu.</p>
          <span className="footer-note">Cloudflare Pages üzerinde çalışır.</span>
        </div>
      </footer>

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
          {toast.text}
          <button
            className="toast-close"
            onClick={() => setToast(null)}
            aria-label="Kapat"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {adminOpen && (
        <AdminPanel
          authed={authed}
          setAuthed={setAuthed}
          players={players}
          setPlayers={setPlayers}
          onClose={() => setAdminOpen(false)}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
