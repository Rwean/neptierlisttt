import React, { useState } from 'react';
import { ScrollText, Send, CheckCircle2 } from 'lucide-react';
import Modal from './Modal.jsx';
import { api } from '../lib.js';
import { COMBAT_KITS } from '../data.js';

export default function ApplicationModal({ onClose }) {
  const [form, setForm] = useState({ player: '', kit: COMBAT_KITS[0].id, discord: '', experience: '' });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.player.trim()) return;
    setState('sending');
    setError('');
    try {
      await api.submit('applications', form);
      setState('done');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  };

  return (
    <Modal
      title="Tier Testi Başvurusu"
      subtitle="Listeye girmek veya tier'ını yükseltmek için test başvurusu yap."
      icon={ScrollText}
      onClose={onClose}
    >
      {state === 'done' ? (
        <div className="form-success">
          <CheckCircle2 size={38} />
          <h3>Başvurun alındı!</h3>
          <p>Testin planlandığında Discord üzerinden bilgilendirileceksin.</p>
          <button className="btn btn-primary" onClick={onClose}>
            Kapat
          </button>
        </div>
      ) : (
        <form className="form" onSubmit={submit}>
          <label className="field">
            <span>Oyuncu adı *</span>
            <input value={form.player} onChange={set('player')} required placeholder="Minecraft kullanıcı adın" />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Kit</span>
              <select value={form.kit} onChange={set('kit')}>
                {COMBAT_KITS.map((kit) => (
                  <option key={kit.id} value={kit.id}>
                    {kit.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Discord</span>
              <input value={form.discord} onChange={set('discord')} placeholder="kullaniciadi" />
            </label>
          </div>
          <label className="field">
            <span>Tecrübe / notlar</span>
            <textarea
              value={form.experience}
              onChange={set('experience')}
              rows={3}
              placeholder="Kendinden kısaca bahset..."
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary" disabled={state === 'sending'}>
            <Send size={16} /> {state === 'sending' ? 'Gönderiliyor...' : 'Başvur'}
          </button>
        </form>
      )}
    </Modal>
  );
}
