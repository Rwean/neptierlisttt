import React, { useState } from 'react';
import { Lock, Save, X } from 'lucide-react';

const ADMIN_USER = 'Admin';
const ADMIN_PASS = String.raw`]&.RaD30P+B1ocaF+n!I-~QgPQxH8AEAHq'k7Ezsbco33EBGvA`;

export function AdminPanel({ authed, setAuthed, players, setPlayers, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [draft, setDraft] = useState(players);
  const [error, setError] = useState('');

  const login = (event) => {
    event.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAuthed(true);
      setError('');
      return;
    }
    setError('Bilgiler hatalı.');
  };

  const updatePlayer = (id, field, value) => {
    setDraft((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, [field]: field === 'points' ? Number(value) : value }
          : item
      )
    );
  };

  const save = () => {
    setPlayers(draft);
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <aside className="admin-panel" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button close" onClick={onClose} aria-label="Kapat">
          <X size={18} />
        </button>

        {!authed ? (
          <form onSubmit={login} className="login-form">
            <span className="page-icon">
              <Lock size={22} />
            </span>
            <h2>Admin Panel</h2>
            <p className="page-lead center">Sıralamayı düzenlemek için giriş yap.</p>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Kullanıcı adı"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Şifre"
              type="password"
            />
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" type="submit">
              Giriş yap
            </button>
          </form>
        ) : (
          <div className="editor">
            <div className="editor-head">
              <h2>Sıralamayı düzenle</h2>
              <button className="btn btn-primary" onClick={save}>
                <Save size={16} /> Kaydet
              </button>
            </div>
            {draft.map((player) => (
              <div className="edit-row" key={player.id}>
                <input
                  value={player.name}
                  onChange={(event) => updatePlayer(player.id, 'name', event.target.value)}
                  placeholder="İsim"
                />
                <input
                  value={player.rank}
                  onChange={(event) => updatePlayer(player.id, 'rank', event.target.value)}
                  placeholder="Rank"
                />
                <input
                  value={player.region}
                  onChange={(event) =>
                    updatePlayer(player.id, 'region', event.target.value.toUpperCase())
                  }
                  placeholder="Bölge"
                />
                <input
                  type="number"
                  value={player.points}
                  onChange={(event) => updatePlayer(player.id, 'points', event.target.value)}
                  placeholder="Puan"
                />
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
