import React from 'react';
import { Crown, Medal } from 'lucide-react';
import { skinBody } from '../lib.js';

const ORDER = [1, 0, 2]; // 2. - 1. - 3. yerleşimi

export default function Podium({ players }) {
  const top = players.slice(0, 3);
  if (top.length === 0) return null;

  return (
    <div className="podium">
      {ORDER.map((slot) => {
        const player = top[slot];
        if (!player) return <div key={slot} className="podium-empty" />;
        return <PodiumCard key={player.id} player={player} place={slot + 1} />;
      })}
    </div>
  );
}

function PodiumCard({ player, place }) {
  const body = skinBody(player.skin);
  const accent = player.accent || (place === 1 ? '#e7b84e' : place === 2 ? '#c7d2fe' : '#d8956b');

  return (
    <article className={`podium-card place-${place}`} style={{ '--accent': accent }}>
      <div className="podium-rank">
        {place === 1 ? <Crown size={18} /> : <Medal size={16} />}
        <span>{place}</span>
      </div>

      <div className="podium-figure">
        {body ? (
          <img src={body || '/placeholder.svg'} alt={`${player.name} skin`} loading="lazy" />
        ) : (
          <div className="podium-avatar" aria-hidden="true">
            {player.avatar}
          </div>
        )}
        <div className="podium-halo" aria-hidden="true" />
      </div>

      <div className="podium-info">
        <h3>{player.name}</h3>
        <p>{player.title}</p>
        <div className="podium-points">
          <strong>{player.points}</strong>
          <span>puan</span>
        </div>
      </div>
    </article>
  );
}
