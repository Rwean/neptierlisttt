import React, { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { modes } from '../data.js';
import { PlayerRow } from './PlayerRow.jsx';

const regions = ['ALL', 'NA', 'EU', 'AS'];

export function Leaderboard({ players }) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('ALL');

  const sorted = useMemo(() => {
    return [...players]
      .filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase().trim())
      )
      .filter((player) => (region === 'ALL' ? true : player.region === region))
      .sort((a, b) => b.points - a.points);
  }, [players, query, region]);

  return (
    <section className="leaderboard" id="leaderboard">
      <div className="section-head">
        <div>
          <p className="section-kicker">Leaderboard</p>
          <h2>Tier Sıralaması</h2>
        </div>
        <label className="search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Oyuncu ara..."
            aria-label="Oyuncu ara"
          />
        </label>
      </div>

      <div className="mode-legend" aria-hidden="true">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <span className="mode-chip" key={mode.label}>
              <Icon size={14} />
              {mode.label}
            </span>
          );
        })}
      </div>

      <div className="region-filter">
        <span className="filter-label">
          <Filter size={14} /> Bölge
        </span>
        {regions.map((item) => (
          <button
            key={item}
            className={`region-pill ${region === item ? 'active' : ''}`}
            onClick={() => setRegion(item)}
          >
            {item === 'ALL' ? 'Tümü' : item}
          </button>
        ))}
      </div>

      <div className="board">
        <div className="board-head">
          <span>#</span>
          <span>Oyuncu</span>
          <span>Bölge</span>
          <span>Tier Rozetleri</span>
        </div>

        {sorted.length === 0 ? (
          <div className="board-empty">Eşleşen oyuncu bulunamadı.</div>
        ) : (
          sorted.map((player, index) => (
            <PlayerRow key={player.id} player={player} index={index} />
          ))
        )}
      </div>
    </section>
  );
}
