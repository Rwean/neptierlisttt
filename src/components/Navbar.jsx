import React, { useEffect, useState } from 'react';
import { Newspaper, Bug, ClipboardList, Trophy, Menu, X } from 'lucide-react';
import { DiscordIcon } from './DiscordIcon.jsx';

const links = [
  { key: 'home', label: 'Sıralama', icon: Trophy },
  { key: 'news', label: 'Haberler', icon: Newspaper },
  { key: 'feedback', label: 'Hata / Öneri', icon: Bug },
  { key: 'applications', label: 'Başvurular', icon: ClipboardList }
];

export function Navbar({ view, setView, user }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (key) => {
    setView(key);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-inner">
        <button className="brand" onClick={() => go('home')} aria-label="Ana sayfa">
          <span className="brand-mark">
            <Trophy size={18} />
          </span>
          <span className="brand-text">
            Nep<span>TierList</span>
          </span>
        </button>

        <nav className="nav-links" aria-label="Ana menü">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.key}
                className={`nav-link ${view === link.key ? 'active' : ''}`}
                onClick={() => go(link.key)}
              >
                <Icon size={16} />
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="nav-user" title={user}>
              <span className="user-dot" />
              {user}
            </div>
          ) : (
            <a className="discord-btn" href="/api/discord/login">
              <DiscordIcon size={18} />
              <span>Discord ile Giriş</span>
            </a>
          )}
          <button
            className="menu-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menüyü aç/kapat"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-menu" aria-label="Mobil menü">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.key}
                className={`mobile-link ${view === link.key ? 'active' : ''}`}
                onClick={() => go(link.key)}
              >
                <Icon size={18} />
                {link.label}
              </button>
            );
          })}
          {!user && (
            <a className="discord-btn full" href="/api/discord/login">
              <DiscordIcon size={18} />
              <span>Discord ile Giriş</span>
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
