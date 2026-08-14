import React from 'react';
import { LogIn, TriangleAlert, ArrowLeftRight, Trophy, User } from 'lucide-react';

export default function TopBar({ user, onReport, onMigration, onLogin }) {
  return (
    <nav className="topbar">
      <a className="brand" href="#home">
        <span className="brand-mark">
          <Trophy size={18} />
        </span>
        <span className="brand-text">
          Nep<span>TierList</span>
        </span>
      </a>

      <div className="topbar-actions">
        <button className="nav-chip" onClick={onReport}>
          <TriangleAlert size={16} />
          <span>Hata Bildir</span>
        </button>
        <button className="nav-chip" onClick={onMigration}>
          <ArrowLeftRight size={16} />
          <span>Tier Göç</span>
        </button>

        {user ? (
          <div className="nav-user">
            {user.avatar ? (
              <img src={user.avatar || '/placeholder.svg'} alt="" />
            ) : (
              <User size={16} />
            )}
            <span>{user.name}</span>
          </div>
        ) : (
          <button className="nav-login" onClick={onLogin}>
            <LogIn size={16} />
            <span>Discord ile giriş yap</span>
          </button>
        )}
      </div>
    </nav>
  );
}
