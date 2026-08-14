import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { DiscordIcon } from './DiscordIcon.jsx';

export function Hero({ stats, user }) {
  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-content">
        <p className="eyebrow">
          <span className="live-dot" /> Minecraft PvP • Discord Entegre
        </p>
        <h1>
          Rekabetin <span className="grad">gerçek sıralaması</span>
        </h1>
        <p className="subtitle">
          NepTierList, Discord rollerinden beslenen canlı bir Minecraft tier
          platformu. Testlere katıl, tier rozetlerini topla ve bölgesel
          sıralamanda yüksel.
        </p>

        <div className="hero-actions">
          {!user && (
            <a className="btn btn-discord" href="/api/discord/login">
              <DiscordIcon size={18} />
              Discord ile giriş yap
            </a>
          )}
          <a className="btn btn-ghost" href="#leaderboard">
            <Zap size={18} />
            Sıralamayı gör
          </a>
          <span className="hero-badge">
            <ShieldCheck size={16} /> Canlı rol senkronu
          </span>
        </div>

        <div className="hero-stats">
          <Stat value={stats.tests} label="Toplam test" />
          <Stat value={stats.active} label="Aktif oyuncu" />
          <Stat value={stats.onlineRate} label="Aktiflik oranı" />
          <Stat value={stats.players} label="Sıralamada" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="hero-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
