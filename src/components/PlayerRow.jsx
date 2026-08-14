import React from 'react';
import { Crown, Medal } from 'lucide-react';
import { modes, tierClass, regionMeta } from '../data.js';

export function PlayerRow({ player, index }) {
  const position = index + 1;
  const podium = position <= 3 ? `podium-${position}` : '';
  const region = regionMeta[player.region] || { label: player.region, tone: 'na' };

  return (
    <article className={`player-row ${podium}`}>
      <div className="col-rank">
        <span className="rank-num">{position}</span>
        {position <= 3 ? (
          <span className={`rank-medal ${podium}`}>
            <Medal size={16} />
          </span>
        ) : null}
      </div>

      <div className="col-player">
        <div className="avatar" aria-hidden="true">
          {player.avatar}
        </div>
        <div className="player-meta">
          <h3>{player.name}</h3>
          <p>
            <Crown size={14} /> {player.rank}
            <span className="points">{player.points} puan</span>
          </p>
        </div>
      </div>

      <div className="col-region">
        <span className={`region-badge region-${region.tone}`} title={region.label}>
          {player.region}
        </span>
      </div>

      <div className="col-tiers">
        {player.tiers.map((tier, tierIndex) => {
          const mode = modes[tierIndex % modes.length];
          const ModeIcon = mode.icon;
          return (
            <span
              key={`${mode.label}-${tierIndex}`}
              className={`tier-badge ${tierClass(tier)}`}
              title={`${mode.label}: ${tier}`}
            >
              <ModeIcon size={14} />
              <b>{tier}</b>
            </span>
          );
        })}
      </div>
    </article>
  );
}
