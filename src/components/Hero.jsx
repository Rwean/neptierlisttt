import React from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';

const DISCORD_INVITE = 'https://discord.gg/neptiers';

export default function Hero({ stats, onLogin }) {
  return (
    <section className="hero" id="home">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Minecraft Türkiye Tierlist</p>
          <h1>
            Nep<span>TierList</span>
          </h1>
          <p className="subtitle">
            Discord sunucundaki rollerle güncellenen, net ve hızlı okunabilen Minecraft tier sıralaması.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onLogin}>
              <LogIn size={18} /> Discord ile giriş yap
            </button>
            <a className="btn btn-ghost" href={DISCORD_INVITE} target="_blank" rel="noreferrer">
              <ShieldCheck size={18} /> Sunucuya katıl
            </a>
          </div>
        </div>

        <div className="stats-grid">
          <Stat label="Toplam test" value={stats.tests} />
          <Stat label="Aktif üye" value={stats.active} />
          <Stat label="Aktiflik" value={stats.onlineRate} />
          <Stat label="Oyuncu" value={stats.players} />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
