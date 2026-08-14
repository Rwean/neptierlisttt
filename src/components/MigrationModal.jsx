import React, { useState } from 'react';
import { ArrowLeftRight, Send, CheckCircle2 } from 'lucide-react';
import Modal from './Modal.jsx';
import { api } from '../lib.js';
import { COMBAT_KITS, TIER_ORDER } from '../data.js';

export default function MigrationModal({ onClose }) {
  const [form, setForm] = useState({ player: '', fromPlatform: '', kit: COMBAT_KITS[0].id, tier: 'HT3', proof: '' });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.player.trim() || !form.fromPlatform.trim()) return;
    setState('sending');
    setError('');
    try {
      await api.submit('migrations', form);
      setState('done');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  };

  return (
    <Modal
      title="Tier Göç"
      subtitle="Başka bir platformdaki tier'ını buraya taşımak için başvur."
      icon={ArrowLeftRight}
      onClose={onClose}
    >
      {state === 'done' ? (
        <div className="form-success">
          <CheckCircle2 size={38} />
          <h3>Başvurun alındı!</h3>
          <p>Yetkililer inceledikten sonra tier'ın işlenecek.</p>
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
          <label className="field">
            <span>Hangi platformdan? *</span>
            <input value={form.fromPlatform} onChange={set('fromPlatform')} required placeholder="Örn: MCTiers, başka bir liste" />
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
              <span>Tier</span>
              <select value={form.tier} onChange={set('tier')}>
                {TIER_ORDER.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Kanıt (link)</span>
            <input value={form.proof} onChange={set('proof')} placeholder="Profil / kanıt linki" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary" disabled={state === 'sending'}>
            <Send size={16} /> {state === 'sending' ? 'Gönderiliyor...' : 'Başvuruyu gönder'}
          </button>
        </form>
      )}
    </Modal>
  );
}
