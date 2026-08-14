import React, { useEffect, useMemo, useState } from 'react';
import { Search, Info, ScrollText, RefreshCw } from 'lucide-react';
import TopBar from './components/TopBar.jsx';
import Hero from './components/Hero.jsx';
import Podium from './components/Podium.jsx';
import NewsTicker from './components/NewsTicker.jsx';
import KitTabs from './components/KitTabs.jsx';
import RankingTable from './components/RankingTable.jsx';
import InfoModal from './components/InfoModal.jsx';
import ReportModal from './components/ReportModal.jsx';
import MigrationModal from './components/MigrationModal.jsx';
import ApplicationModal from './components/ApplicationModal.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { DEMO_PLAYERS } from './data.js';
import { rankPlayers, totalPoints } from './lib.js';

export default function App() {
  const [players, setPlayers] = useState(DEMO_PLAYERS);
  const [news, setNews] = useState([]);
  const [activeKit, setActiveKit] = useState('overall');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null); // report | migration | application | info | admin
  const [refreshing, setRefreshing] = useState(false);

  const loadTiers = async () => {
    try {
      const res = await fetch('/api/tiers');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.players) && data.players.length) {
        setPlayers(data.players);
      }
    } catch {
      /* demo veride kal */
    }
  };

  useEffect(() => {
    loadTiers();
    fetch('/api/news')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.items && setNews(data.items))
      .catch(() => {});
  }, []);

  // Admin kısayolu: Ctrl/Cmd + Shift + A
  useEffect(() => {
    const onKey = (event) => {
      if (event.shiftKey && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        setModal('admin');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const ranked = useMemo(() => rankPlayers(players, activeKit, query), [players, activeKit, query]);
  const topThree = useMemo(() => rankPlayers(players, 'overall').slice(0, 3), [players]);

  const stats = useMemo(() => {
    const active = players.filter((p) => totalPoints(p) > 0).length;
    return { tests: '1000+', active: 248, onlineRate: '%72', players: players.length || active };
  }, [players]);

  const refresh = async () => {
    setRefreshing(true);
    await loadTiers();
    setTimeout(() => setRefreshing(false), 500);
  };

  const login = () => {
    window.location.href = '/api/discord/login';
  };

  return (
    <>
      <TopBar
        user={null}
        onLogin={login}
        onReport={() => setModal('report')}
        onMigration={() => setModal('migration')}
      />

      <main className="app-shell">
        <Hero stats={stats} onLogin={login} />

        <section className="showcase">
          <div className="showcase-head">
            <p className="section-kicker">Zirvedekiler</p>
            <h2>İlk 3 oyuncu</h2>
          </div>
          <div className="showcase-grid">
            <Podium players={topThree} />
            <NewsTicker items={news} />
          </div>
        </section>

        <section className="ranking" id="siralama">
          <div className="toolbar">
            <div className="toolbar-titles">
              <p className="section-kicker">Canlı sıralama</p>
              <h2>Tier listesi</h2>
            </div>
            <div className="toolbar-controls">
              <label className="search">
                <Search size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Oyuncu ara"
                  aria-label="Oyuncu ara"
                />
              </label>
              <button className="btn btn-outline" onClick={() => setModal('info')}>
                <Info size={16} /> Information
              </button>
              <button className="btn btn-outline" onClick={() => setModal('application')}>
                <ScrollText size={16} /> Başvuru
              </button>
              <button className={`icon-button refresh ${refreshing ? 'spinning' : ''}`} onClick={refresh} aria-label="Yenile">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          <KitTabs active={activeKit} onChange={setActiveKit} />
          <RankingTable players={ranked} activeKit={activeKit} />
        </section>

        <footer className="footer">
          <p>
            NepTierList — Minecraft Türkiye Tierlist. Sıralama Discord rolleriyle otomatik güncellenir.
          </p>
        </footer>
      </main>

      {modal === 'info' && <InfoModal onClose={() => setModal(null)} />}
      {modal === 'report' && <ReportModal onClose={() => setModal(null)} />}
      {modal === 'migration' && <MigrationModal onClose={() => setModal(null)} />}
      {modal === 'application' && <ApplicationModal onClose={() => setModal(null)} />}
      {modal === 'admin' && (
        <AdminPanel players={players} onPublished={loadTiers} onClose={() => setModal(null)} />
      )}
    </>
  );
}
