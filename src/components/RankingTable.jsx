import React from 'react';
import { Crown } from 'lucide-react';
import { COMBAT_KITS, TIER_COLORS } from '../data.js';

export default function RankingTable({ players, activeKit }) {
  const isOverall = activeKit === 'overall';

  if (players.length === 0) {
    return (
      <div className="empty-state">
        <p>Bu kit için sıralama bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className={`tier-board ${isOverall ? 'is-overall' : 'is-kit'}`}>
      <div className="board-head">
        <span>#</span>
        <span>Oyuncu</span>
        <span className="col-region">Bölge</span>
        <span className="col-tiers">{isOverall ? 'Tierler' : 'Tier / Puan'}</span>
      </div>

      {players.map((player, index) => (
        <PlayerRow key={player.id} player={player} index={index} activeKit={activeKit} isOverall={isOverall} />
      ))}
    </div>
  );
}

function PlayerRow({ player, index, activeKit, isOverall }) {
  const rankClass = index < 3 ? `top top-${index + 1}` : '';

  return (
    <article className={`player-row ${rankClass}`} style={{ '--accent': player.accent || '#e7b84e' }}>
      <div className="rank-cell">
        <strong className="rank-num">{index + 1}</strong>
        <div className="avatar">{player.avatar}</div>
      </div>

      <div className="player-cell">
        <h3>{player.name}</h3>
        <p>
          <Crown size={14} /> {player.title} <span className="dot">•</span>{' '}
          <b>{player.points}</b> puan
        </p>
      </div>

      <div className="region col-region">
        <span className="flag">TR</span>
      </div>

      <div className="col-tiers">
        {isOverall ? (
          <div className="tier-icons">
            {COMBAT_KITS.map((kit) => {
              const tier = player.tiers?.[kit.id];
              const Icon = kit.icon;
              return (
                <span
                  className={`tier-pill ${tier ? '' : 'muted'}`}
                  key={kit.id}
                  title={`${kit.label}${tier ? ` — ${tier}` : ' — yok'}`}
                  style={{ '--kit-color': kit.color, '--tier-color': tier ? TIER_COLORS[tier] : '#3a4152' }}
                >
                  <Icon size={15} />
                  <b>{tier || '—'}</b>
                </span>
              );
            })}
          </div>
        ) : (
          <div className="kit-score">
            <span className="big-tier" style={{ '--tier-color': TIER_COLORS[player.tiers?.[activeKit]] }}>
              {player.tiers?.[activeKit]}
            </span>
            <span className="kit-score-points">
              <strong>{player.score}</strong> puan
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
